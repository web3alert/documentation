# MCP Server

MCP is available on `Free`, `Advanced`, and `Pro`.

- Use `https://web3alert.io/mcp/agent` to subscribe to decoded on-chain events and receive them on a webhook.
- Use `https://web3alert.io/mcp` for the full set of tools to create and edit Web3alert marketplace projects, triggers, templates, subscriptions, resources, and data sources, and to read diagnostic data.

The agent endpoint is listed in the MCP Registry as `io.web3alert/agent`. See the [public MCP repository](https://github.com/web3alert/mcp) for server details.

## Token

The agent endpoint (`/mcp/agent`) accepts `initialize`, `ping`, notifications, and `tools/list` without a token. Tool calls (`tools/call`) require `Authorization: Bearer <token>`. A tool call without the header returns HTTP `401` with instructions for providing a token.

The authoring endpoint (`/mcp`) requires `Authorization: Bearer <token>` on every request. Both endpoints accept tokens only in that header. Either endpoint returns HTTP `401` if you send an invalid token, including on agent discovery requests.

Get a personal access token from [Account parameters](account.md#personal-access-token). The token gives MCP server access to Web3alert API on behalf of the current account. The level of available actions depends on the account tier and the user's roles in workspace.

After revocation, the API rejects the token immediately. While MCP still has a cached verification, an agent tool call that reaches the API returns `access_denied`. `initialize` and `tools/list` requests that carry the revoked token may still succeed for up to 30 seconds on a cached verification. When MCP rechecks the revoked token, it returns HTTP `401`.

| HTTP status | What to do |
| --- | --- |
| `401` | A required bearer token is missing, or the supplied token is invalid, unknown, or revoked. Send the header with a valid token. Get a new token if you do not have one or the server no longer recognizes it. |
| `403` | The client origin was rejected (`forbidden_origin`) or the account failed MCP access checks (`mcp_access_denied`). Check the client's `Origin` header or your account details, respectively. |
| `429` | The API rate-limited token verification. Wait for the delay in `Retry-After` before retrying. |
| `503` | Token verification is temporarily unavailable. Wait for the delay in `Retry-After` and retry with the same token. |

Both endpoints share a default budget of 120 tool calls per minute per account on each server process, across all tokens for that account. If you use up this budget, the tool returns `rate_limited` with `retryAfter` in seconds.

## Upgrading existing clients

The `/mcp` endpoint now accepts the token only in the `Authorization: Bearer <token>` header on every request. Requests that supply the token only in the query string or request body receive HTTP `401`. The server is stateless and creates no sessions.

Update your client to send the header and remove the token from the URL or request body.

In Claude Code, run these commands from the project where you use Web3alert.

1. Run `claude mcp list` to check for the name you are replacing. To see the listed entry's scope, run `claude mcp get web3alert` or `claude mcp get web3alert-agent`.
2. Remove the entry by scope, for example with `claude mcp remove --scope user web3alert` or `claude mcp remove --scope local web3alert`. A same-name entry in another scope can appear after removal. Repeat steps 1 and 2 until the name no longer appears.
3. Run the `claude mcp add` example for your endpoint to add the new entry.

In Claude Desktop, Cursor, and VS Code, edit the existing entry's URL and headers in place. See the [remote endpoint configuration examples](#remote-mcp-endpoint).

## Agent Endpoint

Agent tools act on the account's current workspace. To change which workspace the next call uses, select it in the Web3alert app.

| Tool | What it does |
| --- | --- |
| `get_account` | Returns the account ID, name, tier, EUR wallet balance, tier limits, and active and total subscription counts for the current workspace when available. |
| `find_triggers` | Searches the public catalog for triggers from EVM and Substrate chains. It also searches the current workspace's triggers. |
| `get_trigger` | Shows a trigger's runtime inputs, delivered event fields, and fields you can use in `conditions`. |
| `list_webhooks` | Lists the `fullname`, name, and URL of each registered workspace webhook. The `signed` field indicates whether a webhook has a signing secret. |
| `add_webhook` | Registers a webhook with an HTTPS URL without credentials. If the workspace already has a resource with that name when checked, the tool refuses the request with `webhook_exists`. The signing secret appears only in the `add_webhook` reply as `signingSecret`. Rotating it later replaces it for every receiver of that endpoint. |
| `create_subscription` | Subscribes to one trigger with delivery to one webhook. Supply any required inputs and optional `conditions` to filter events. |
| `list_subscriptions` | Lists subscription IDs, titles, states, triggers, webhooks, and creation times. |
| `set_subscription_state` | Pauses (`off`) or resumes (`on`) a subscription. |
| `remove_subscription` | Deletes a subscription. Webhook retries stop within about 10 seconds. An attempt already due in that window can still be sent. |
| `get_delivery_log` | Shows delivery outcomes for the workspace or a single subscription. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`. Webhook channel entries include `eventId` and `attempt`. `nextAttemptAt` is the ISO timestamp for which the next attempt was scheduled when the entry was written, or `null` if the entry records no scheduled retry. |

The `nextAttemptAt` timestamp stays fixed even after the retry runs or is canceled. To find the delivery outcome, look for a later entry with the same `eventId`. If pausing or removing the subscription stops retries or a retry expires, Web3alert writes no final entry, so a missing final entry leaves both the delivery outcome and the current retry status unknown.

`limits.maxSubscriptions` caps active subscriptions you created to non-Free projects across all workspaces. The cap is 5 on Free. Subscriptions to Free projects are exempt.

At the tier's subscription limit, `create_subscription` can fail with `subscription_limit_reached`. A successful create or resume (`set_subscription_state` with `on`) can return `state: "blocked"` and `blockedReason: "subscription_limit_reached"`. Check that the returned `state` is `on` before assuming delivery is running.

Through this endpoint, agents cannot create, edit, or delete triggers, projects, templates, or data sources. They also cannot change billing, plans, or payments, manage tokens, delete accounts or workspaces, switch workspaces, set subscriptions to `blocked`, or manage resources other than webhooks.

### Claude Code

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_TOKEN"
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
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### VS Code

For an editor-managed connection, add the entry under `servers` in `.vscode/mcp.json` and make `WEB3ALERT_TOKEN` available in the VS Code process environment.

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_TOKEN}"
      }
    }
  }
}
```

## Remote MCP Endpoint

To add this endpoint to Claude Code, run the command in Bash or Zsh and enter your token at the hidden prompt.

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_TOKEN"
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
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
