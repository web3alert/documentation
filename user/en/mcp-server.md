# MCP Server

Web3alert serves three Streamable HTTP paths.

| Path | Tool set | Authentication |
| --- | --- | --- |
| `/mcp/agent` | [14 tools](#agent-endpoint) for account, billing, subscriptions and delivery | Public discovery. Bearer key for calls. |
| `/mcp/agent/build` | 19 tools, including the 14 agent tools and [5 build tools](#build-endpoint) | Public discovery. Bearer key for calls. Build tools require Advanced or Pro. |
| `/mcp` | [Full authoring tool set](#remote-mcp-endpoint) | Bearer key on every request. |

The MCP Registry entry for the agent endpoint, `io.web3alert/agent`, marks the `Authorization` header as optional. See the [public MCP repository](https://github.com/web3alert/mcp) for server details.

## Authentication

Both agent paths accept individual `initialize`, `ping`, `tools/list` and notification messages without a token. Tool calls and batches require `Authorization: Bearer <agent-key>`. A batch can contain up to 20 messages. The authoring path requires the header for discovery as well. All paths verify any supplied credential and return HTTP `401` for an invalid one.

Create an agent key on the [Agents page](https://web3alert.io/agents) or [sign up with a wallet](agents.md). A key acts as the account in its bound workspace. Available operations depend on the key's scopes, the applicable plan and the account's workspace permissions.

After revocation, the API rejects the token immediately. While MCP still has a cached verification, an agent tool call that reaches the API returns `access_denied`. `initialize` and `tools/list` requests that carry the revoked token may still succeed for up to 30 seconds on a cached verification. When MCP rechecks the revoked token, it returns HTTP `401`.

| HTTP status | What to do |
| --- | --- |
| `401` | The bearer credential is missing, invalid, unknown, expired or revoked. Send the header with a valid agent key. |
| `403` | The client origin was rejected (`forbidden_origin`) or the account failed MCP access checks (`mcp_access_denied`). Check the client's `Origin` header or your account details, respectively. |
| `429` | The edge limited requests from your IP, or the API rate-limited credential verification. Honor `Retry-After` before retrying. |
| `503` | Token verification is temporarily unavailable. Wait for the delay in `Retry-After` and retry with the same credential. |

All three paths share a default budget of 120 tool calls per minute per account on each server process, across all credentials for that account. If you use up this budget, the tool returns `rate_limited` with `retryAfter` in seconds.

Tool errors are returned separately from HTTP authentication errors.

| Tool error | Meaning |
| --- | --- |
| `insufficient_scope` | The key lacks a required scope. See the [message for missing `code`](api.md#auth). |
| `key_not_allowed` | The operation requires an account session. This also applies to buying a plan with a key while an auto-renewing plan is active. |
| `spend_cap_exceeded` | The purchase would exceed the key's monthly EUR cap. |
| `not_in_plan` | The applicable workspace plan excludes inbox or delivery history. |
| `plan_required` | A build operation requires an Advanced or Pro account. |
| `insufficient_balance` | The EUR balance cannot cover the plan purchase. |
| `api_error` | For `buy_plan`, a pending checkout or a higher active plan can block purchase before any debit. The tool returns the API's message. Resolve the existing plan or checkout first. |
| `x402_unavailable` | USDC top-ups are unavailable. |
| `rate_unavailable` | The ECB reference rate is unavailable. |
| `no_current_workspace` | The tool needs a current workspace and the API returned none. |
| `not_tested` | The draft's latest test must return `matched` before activation. |
| `draft_expired` | The draft has expired. |
| `retryable` | A chain data request failed upstream or the workspace has reached its test rate limit. |
| `private_project_limit` | Creating the private agent project would exceed the account's project cap. |
| `trigger_limit` | Activating the trigger would exceed the plan's trigger cap. |
| `not_found` | The target is unavailable. Build calls can return this for an unknown chain, a missing verified ABI, or a missing IDL or unknown pallet identified by the runtime. A generic IDL or pallet lookup failure returns `retryable`. An unavailable event, draft or trigger can also return `not_found`. A busy explorer can also produce the missing-ABI `not_found` response. If the contract is verified on the explorer, retry in a minute. |
| `request_id_conflict` | The same activation `requestId` was already used for another draft in the workspace. |

## Upgrading existing clients

The `/mcp` endpoint now accepts the token only in the `Authorization: Bearer <token>` header on every request. Requests that supply the token only in the query string or request body receive HTTP `401`. The server is stateless and creates no sessions.

Existing session tokens work until the server revokes them. Use agent keys for new connections.

In Claude Code, run these commands from the project where you use Web3alert.

1. Run `claude mcp list` to check for the name you are replacing. To see the listed entry's scope, run `claude mcp get web3alert` or `claude mcp get web3alert-agent`.
2. Remove the entry by scope, for example with `claude mcp remove --scope user web3alert` or `claude mcp remove --scope local web3alert`. A same-name entry in another scope can appear after removal. Repeat steps 1 and 2 until the name no longer appears.
3. Run the `claude mcp add` example for your endpoint to add the new entry.

In Claude Desktop, Cursor, and VS Code, edit the existing entry's URL and headers in place. See the [remote endpoint configuration examples](#remote-mcp-endpoint).

## Agent Endpoint

Agent tools use the key's bound workspace. Create a key in the other workspace to use it there.

| Tool | What it does |
| --- | --- |
| `get_account` | Returns the account ID, name, tier, EUR wallet balance, tier limits, and active and total subscription counts for the current workspace when available, plus the key's scopes, expiry, monthly cap and spend when using a key. |
| `get_topup_requirements` | Quotes a €5–€500 USDC top-up. Sign the payment explicitly with your wallet. Requires `manage`. Check the [payment URL, network and asset](api-billing.md#post-api-billing-wallet-x402-topup) before signing. |
| `buy_plan` | Buys Advanced or Pro from the EUR balance without auto-renewal. Requires `spend` and a fresh `requestId` of 8–64 characters, such as a generated UUID. Reuse the same ID only when retrying that purchase. |
| `find_triggers` | Searches the public catalog for triggers from EVM and Substrate chains. It also searches the current workspace's triggers. |
| `get_trigger` | Shows a trigger's runtime inputs, delivered event fields, and fields you can use in `conditions`. |
| `list_webhooks` | Lists the `fullname`, name, and URL of each registered workspace webhook. The `signed` field indicates whether a webhook has a signing secret. |
| `add_webhook` | Registers a webhook with an HTTPS URL without credentials. If the workspace already has a resource with that name when checked, the tool refuses the request with `webhook_exists`. The signing secret appears only in the `add_webhook` reply as `signingSecret`. Rotating it later replaces it for every receiver of that endpoint. |
| `remove_webhook` | Deletes a webhook by fullname in the current workspace. Requires `manage`. Returns `webhook_in_use` if a live subscription in that workspace uses it. |
| `create_subscription` | Subscribes to one trigger with one delivery destination, either `webhook` or `inbox: true`. Supply required inputs and optional `conditions`. With `inbox: true`, `resource_name_in_use` means another resource already uses the inbox's name. Ask a workspace `owner` or `admin` to resolve the conflict. Give each `create_subscription` intent a unique `title`. If the reply is lost, call `list_subscriptions` and look for the title. If there's no match, wait and check again because the original call may still create the subscription. If the title is inconclusive, inspect the rules and actions returned by [GET /api/subscriptions](api-subscriptions.md#get-api-subscriptions). If the outcome stays unknown, stop and reconcile before retrying creation. |
| `read_events` | Reads the paid workspace inbox oldest first. Poll with `nextCursor` as `after` in the same workspace. `gap: true` reports holes before or within a page of previously stored events. An empty page can report a gap if newer stored events are no longer retained. Use `get_delivery_log` for undelivered events when history is available. Requires `read`. An inbox event with a body over 64 KiB arrives with `body.truncated: true` and without `body.object`. Check the flag before processing. |
| `list_subscriptions` | Lists subscription IDs, titles, states, triggers, webhooks, and creation times. |
| `set_subscription_state` | Pauses (`off`) or resumes (`on`) a subscription. |
| `remove_subscription` | Deletes a subscription. Webhook retries stop within about 10 seconds. An attempt already due in that window can still be sent. |
| `get_delivery_log` | Shows delivery outcomes for the workspace or a single subscription. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`. Webhook channel entries include `eventId` and `attempt`. `nextAttemptAt` is the ISO timestamp for which the next attempt was scheduled when the entry was written, or `null` if the entry records no scheduled retry. |

The `nextAttemptAt` timestamp stays fixed even after the retry runs or is canceled. To find the delivery outcome, look for a later entry with the same `eventId`. If pausing or removing the subscription stops retries or a retry expires, Web3alert writes no final entry, so a missing final entry leaves both the delivery outcome and the current retry status unknown.

`limits.maxSubscriptions` caps active subscriptions you created to non-Free projects across all workspaces. The cap is 5 on Free. Subscriptions to Free projects are exempt.

At the tier's subscription limit, `create_subscription` can fail with `subscription_limit_reached`. A successful create or resume (`set_subscription_state` with `on`) can return `state: "blocked"` and `blockedReason: "subscription_limit_reached"`. Check that the returned `state` is `on` before assuming delivery is running.

Use the [build endpoint](#build-endpoint) to create a private trigger from an on-chain event.

### Claude Code

```bash
printf 'Web3alert agent key: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop and Cursor

In Claude Desktop, add the entry under `mcpServers` in `claude_desktop_config.json`. In Cursor, use your personal `~/.cursor/mcp.json`.

```json
{
  "mcpServers": {
    "web3alert-agent": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp/agent",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```

### VS Code

For an editor-managed connection, add the entry under `servers` in `.vscode/mcp.json` and make `WEB3ALERT_KEY` available in the VS Code process environment.

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_KEY}"
      }
    }
  }
}
```

## Build Endpoint

Use `https://web3alert.io/mcp/agent/build` with the same client settings and bearer header. The tool list contains all 14 tools above plus these 5. Free accounts can discover the build tools and receive `plan_required` on calls to them. The build tools work without `code`.

`find_contract` and `plan_trigger` use Web3alert’s built-in chain sources. Pass a short name such as `ethereum`, `base`, `arbitrum-one`, `polkadot` or `solana`, or use `common.<chain>` or `common.source.<chain>`. When short names are available for the target type, the `not_found` tool error for an unknown chain appends `Supported:` followed by those names.

| Tool | Scope | What it does |
| --- | --- | --- |
| `find_contract` | `read` | Finds exact event signatures from a contract ABI, Solana IDL or Substrate metadata. EVM results include functions and a per-event `recentCount` over the last `recentBlocks` blocks, up to 1,000. The range can be shorter if the provider refuses a wide query. `recentBlocks` is `null` if no blocks could be read or the source is Solana or Substrate. A count of `0` means no matching logs in the reported range. |
| `plan_trigger` | `manage` | Generates a draft for an event without custom code. Returns its `draftId`, preview fullname, inputs, filterable fields, output schema and expiry. |
| `test_trigger` | `read` | Tests a draft on a recent sample or replays a supplied block or slot. EVM discovery covers at most the latest 1,000 blocks. Solana discovery tries up to 12 recent slots, and Substrate tries up to 12 recent blocks. After EVM discovery reads at least one log window without a match, an error response from the provider, including a provider-side timeout, or an opaque runtime refusal on older windows can end the scan with `no_match`. That result covers only the windows read. Transport failures, reaching the discovery deadline, and a scan that cannot read any windows return `retryable`. If you know where the event occurred or want to bypass discovery, pass its `slot` for Solana or `block` for EVM or Substrate to `test_trigger`. For an older EVM event, pass its `block` directly. If the API's workspace test limiter returns HTTP `429` with `error.code: "retryable"`, MCP reports a tool error. Back off before retrying. A successful tool reply can carry `result: "retryable"`. |
| `activate_trigger` | `manage` | Saves a draft whose latest test matched. The first successful activation creates the workspace's private agent project, which counts toward the account's private-project cap. Reuse `requestId` on retries for the same draft. Reusing it for a different draft returns `request_id_conflict`. The returned trigger fullname is ready for subscriptions. If another member created the workspace's agent project, activation uses that creator's plan to check trigger units. It returns `plan_required` if that plan no longer allows trigger management. Activation requires a `requestId` of at most 128 characters with at least one non-whitespace character. A workspace `developer` can build and activate the trigger. An `owner` or `admin` must use the returned fullname with `create_subscription`. |
| `remove_my_trigger` | `manage` | Removes a trigger from that project. Returns `trigger_in_use` if a live subscription in the trigger's workspace uses it. |

Direct removal of a trigger or webhook checks live (`on`) subscriptions in that trigger's or webhook's workspace. Pause or remove those subscriptions before retrying. Removing a project, workspace or account blocks its affected subscriptions. A live subscription in another workspace to a public trigger does not prevent direct removal.

## Remote MCP Endpoint

Use `https://web3alert.io/mcp` for the full authoring tool set for projects, triggers, templates, subscriptions, resources, data sources and diagnostics. Send an authenticated `tools/list` request for the complete list.

To add this endpoint to Claude Code, run the command in Bash or Zsh and enter your agent key at the hidden prompt.

```bash
printf 'Web3alert agent key: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_KEY"
```

Use the same Claude Desktop or Cursor configuration file. For [VS Code](#vs-code), use the same `servers` example with the URL `https://web3alert.io/mcp`.

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```

### Agent key permissions {#authoring-permissions}

With an agent key, the following `/mcp` tools require `code` alongside their [usual scopes](api-triggers.md#agent-key-permissions).

- `manage` + `code` — `web3alert_upsert_trigger`, `web3alert_patch_trigger`, `web3alert_patch_triggers`
- `manage` + `code` — `web3alert_test_trigger`, `web3alert_test_trigger_block`, `web3alert_test_trigger_provider`
- `read` + `code` — `web3alert_preview_trigger`

Saving with `save=true` also requires `manage` and `code` for the following import tools. `saveDrafts=true` has the same effect when `save` is omitted.

- Solana — `web3alert_import_solana_program`, `web3alert_import_solana_trigger`, `web3alert_import_solana_entries`
- Substrate — `web3alert_import_substrate_trigger`, `web3alert_import_substrate_entries`, `web3alert_import_substrate_pallets`
