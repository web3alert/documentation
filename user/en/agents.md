# For agents

Find decoded on-chain events from EVM and Substrate chains, including Ethereum, Polkadot and Kusama, in the Web3alert catalog. Use the [14 MCP tools](mcp-server.md#agent-endpoint) to find a trigger, subscribe and receive events as JSON.

## 1. Get an agent key

### Create a key in the app

Sign in to [Web3alert](https://web3alert.io), select a workspace you belong to, and create a key on the [Agents page](https://web3alert.io/agents). The key acts with your role in that workspace and within the scopes you grant. Copy the secret when it appears. It is shown once.

Every key includes `read`. Add `manage` to register webhooks, create subscriptions or request a top-up quote. Add `spend` to buy plans from the EUR balance. You can set a [monthly spend cap](limits.md#agent-payments) and an expiry of 30, 90 or 365 days, or leave either unset.

Existing session tokens work until the server revokes them. Use agent keys for new connections.

### Sign up with an Ethereum wallet

An agent with an Ethereum externally owned account (EOA) can create its own Free account. First request a single-use nonce. Both SIWE requests are public.

```http
POST /api/agent/siwe/nonce
Host: web3alert.io
```

```json
{
  "nonce": "exampleNonce123456",
  "issuedAt": "<ISO-8601 timestamp>",
  "expiresAt": "<ISO-8601 timestamp>"
}
```

Use the returned nonce and `issuedAt` to construct the EIP-4361 message, substitute your address, and sign the exact message with your wallet. The nonce is valid for 10 minutes and verification checks that `issuedAt` is within 5 minutes of the server clock.

```http
POST /api/agent/siwe/verify
Host: web3alert.io
Content-Type: application/json

{
  "message": "web3alert.io wants you to sign in with your Ethereum account:\n<your Ethereum address>\n\n\nURI: https://web3alert.io\nVersion: 1\nChain ID: 1\nNonce: <nonce>\nIssued At: <issuedAt>",
  "signature": "<wallet signature>"
}
```

Example `200` response, with the `key` view abbreviated.

```json
{
  "account": { "id": "<account-id>", "created": true },
  "key": { "id": "<key-id>", "scopes": ["read", "manage", "spend"] },
  "secret": "w3a_<key-secret>",
  "claimUrl": "https://web3alert.io/claim/<claim-token>"
}
```

Each successful sign-in issues a fresh key for the initial workspace, with all three scopes and no cap or expiry. Use `secret` as the bearer credential. Wallet verification returns a claim link when it creates the account or when there is no active link. If a link is already active, `claimUrl` is `null`. After a person claims the account with Telegram or Google, wallet sign-in returns `403 account_claimed`. Ask that person for an agent key.

Share the claim link privately with the person taking control of the account. The page shows the wallet, account creation date and link expiry, and offers Telegram or Google sign-in. After signing in, the person lands on the Agents page, where they can see and control the keys and access the account's plan, balance and spend. A login already linked to another Web3alert account requires a different login. The newest link is valid for seven days. Use [`POST /api/agent/claim-link`](api-account.md#post-api-agent-claim-link) to replace it.

Claiming the account leaves previously issued wallet keys active. After signing in, review the keys on the [Agents page](https://web3alert.io/agents) and revoke any you do not want to keep.

The nonce and verify endpoints share a per-IP edge limit of 1 request per second with a burst of 10. Honor `Retry-After` on a `429`. An edge rejection happens before verification and has no `signup_limited` body. Get a fresh nonce if the signed message has gone stale. For an API `429 signup_limited`, the nonce was already used. After waiting, fetch a new nonce and sign again.

## 2. Connect your MCP client

Use Streamable HTTP at `https://web3alert.io/mcp/agent`. You can discover tools without a token. Send `Authorization: Bearer <agent-key>` for tool calls.

### Claude Code

Set `WEB3ALERT_KEY` to your agent key in the shell, then run this command.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop and Cursor

Add the entry under `mcpServers` in Claude Desktop's `claude_desktop_config.json` (Settings → Developer → Edit Config) or Cursor's personal `~/.cursor/mcp.json`. This example uses the `mcp-remote` bridge via `npx`. Replace the key placeholder.

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

## 3. Top up and buy a plan

Before paying, confirm the key has `spend` and check the caller's current plan with [GET /api/billing/overview](api-billing.md#get-api-billing-overview). Confirm in the app or with the account owner that no higher active plan, pending checkout, or active auto-renewing plan blocks the intended purchase. To set up or read the inbox, confirm your workspace role is `owner` or `admin`. Inbox eligibility uses the plan of the first owner account in the workspace's access list. Buying a plan on another account leaves that owner's inbox eligibility unchanged.

1. Call `get_account({})` before signing. Check the EUR balance and confirm that the planned purchase fits within the key's remaining monthly cap if one is set. A new account starts at €0 and one month of Advanced costs €15. For this zero-balance example, call `get_topup_requirements({"amountEur":15})` with `manage` to cover the purchase. Top-ups range from €5 to €500. Web3alert uses the ECB USD reference rate, values 1 USDC at 1 USD and applies no markup.
2. Fetch a fresh quote by sending the same body without a payment signature to `https://web3alert.io/api/billing/wallet/x402-topup` over HTTPS. Send `Authorization: Bearer <agent-key>` and `Content-Type: application/json` on both POSTs. Include `PAYMENT-SIGNATURE` only on the second POST. Before signing, check that the payment URL is exactly that URL, the network is Base (`eip155:8453`), the asset is USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`), and the payment's `payTo` matches the address in the fresh quote. Check the expected USDC amount. Amounts are strings in six-decimal atomic units, so `"1000000"` is 1 USDC. Stop if any check fails. Sign that quote with your x402 v2 client and wallet. POST the quoted body with the bearer credential and the payment signature in `PAYMENT-SIGNATURE` only to that URL. Disable redirects for the signed POST.
3. Treat a `202`, timeout, or `5xx` from the signed POST as unresolved. Increase the delay between retries. Retry a limited number of times with the same body and signature in the same workspace, even after the quote expires. If a retry returns a fresh `402` quote with `PAYMENT-REQUIRED` and no `PAYMENT-RESPONSE`, the first payment's outcome is still unknown. Stop retries and leave the new quote unsigned. For a payment refusal, the decoded `PAYMENT-RESPONSE` contains `success: false`. If the outcome is still unresolved, stop and keep any identifiers you have, such as `topupId`, for the operator to reconcile. Never sign another payment for the same purpose while this one is unresolved. Wait for the [top-up](api-billing.md#post-api-billing-wallet-x402-topup) to settle and credit the balance before buying.
4. Generate a fresh `requestId` for this purchase, such as a UUID, and substitute it for `<new-uuid>` in `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"<new-uuid>"})`. Use `spend` and ensure the EUR balance is sufficient. You can buy Advanced or Pro for 1, 3, 6 or 12 months without auto-renewal. Reuse that ID and the same parameters only when retrying this purchase. An active auto-renewing plan returns `key_not_allowed`. A pending checkout or a higher active plan can block the purchase with `api_error` and the API's message. Ask the account owner to resolve the existing plan or checkout first.

## 4. Create your first subscription

Choose delivery to a public HTTPS webhook or, on Advanced and Pro, to the workspace inbox. Adding a webhook, creating a subscription, and accessing inbox or delivery history require the workspace `owner` or `admin` role.

Give each `create_subscription` intent a unique `title`. If the reply is lost, call `list_subscriptions` and look for the title. If there's no match, wait and check again because the original call may still create the subscription. If the title is inconclusive, inspect the rules and actions returned by [GET /api/subscriptions](api-subscriptions.md#get-api-subscriptions). If the outcome stays unknown, stop and reconcile before retrying creation.

### Webhook delivery

In this example session, replace the values in angle brackets with results from earlier calls. Replace the example webhook URL with an HTTPS URL you control, without a username or password. Choose an event trigger and supply any required `inputs` reported by `get_trigger`. This example assumes the trigger requires none.

1. `get_account({})` → Your account, tier, current workspace, EUR wallet balance, tier limits, and subscription counts when available.
2. `find_triggers({"kind":"event","limit":5})` → Matching triggers from the published catalog and your workspace, including each trigger's `fullname`.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → The trigger's runtime inputs, event fields, and fields available for filtering.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → The registered webhook's `fullname`, name, and URL. The signing secret appears only in the `add_webhook` reply as `signingSecret`. Rotating it later replaces it for every receiver of that endpoint. Store the secret for your receiver.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","title":"<unique-title>","state":"on"})` → The subscription's ID, title, resulting state, trigger, and webhook.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Delivery outcomes and `nextCursor` when there are more results. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`.

   If the cursor cannot advance because 500 or more deliveries share a timestamp, the tool returns `api_error`. Narrow the filter, for example by status, and start again without the cursor.

Use the subscription's returned `state` to confirm it is `on`. Matching events can arrive after that. Use a new webhook name or look up an existing webhook with `list_webhooks`.

### Webhook payload

Your webhook receives a JSON body with an event ID. New webhooks receive signed deliveries, and Web3alert automatically retries eligible failures. See [Webhooks](webhooks.md) for the payload, signature verification, retries, and deduplication.

### Inbox delivery

After finding a trigger and inspecting its inputs with `get_trigger`, call `create_subscription({"trigger":"<trigger-fullname>","inbox":true,"title":"<unique-title>","state":"on"})`. Supply required `inputs` as for webhook delivery. The tool accepts one destination per call. It creates or reuses the workspace inbox when you pass `inbox: true`. With `inbox: true`, `resource_name_in_use` means another resource already uses the inbox's name. Ask a workspace `owner` or `admin` to resolve the conflict.

Call `read_events({})` to start with the oldest retained event. While `hasMore` is true, keep reading. Pass a non-null `nextCursor` as `after` in the same workspace. `gap: true` reports previously stored events that are missing before the first result after the cursor or between results on the same page. An empty page can report a gap when newer stored events are no longer retained. Use `get_delivery_log` for undelivered events when delivery history is available. Use the event `id` to deduplicate.

The workspace owner's plan governs whether events are stored and how long they are retained. Without an owner, storage follows the subscription creator's plan. Advanced retains up to **7 days or 25,000 events** and Pro up to **30 days or 100,000 events**. Plans without alert history store no events. Inbox creation and reading use the workspace owner's plan, or the caller's when there is no owner, and return `not_in_plan` when that plan has no alert history.

While the applicable plan lacks alert history, the API refuses inbox writes. Those events are absent from both `read_events` and the delivery log. Five consecutive undelivered events to the inbox block the subscription. Restore the workspace owner's paid plan, or the subscription creator's plan for delivery when there is no owner. Check the state with `list_subscriptions` and use `set_subscription_state` with `state: "on"` for any blocked subscription. Confirm that it returns `on`. Recovery only resumes delivery of future events.

## 5. Build a trigger

On Advanced or Pro, connect the same client to `https://web3alert.io/mcp/agent/build` using the same bearer header. The server generates the trigger from an EVM contract ABI, Solana IDL or Substrate metadata, so you can build without writing code.

1. Use `find_contract` with a platform chain and a contract address, Solana program or Substrate pallet. Set `chain` to a short name such as `ethereum`, `base`, `arbitrum-one`, `polkadot` or `solana`, or use `common.<chain>` or `common.source.<chain>`. For an unknown chain, look for available names after `Supported:` in the tool error.

   For EVM, `recentBlocks` shows how many recent blocks each event’s `recentCount` covers, up to 1,000. The range can be shorter if the provider rejects a wide query. A `null` value means no blocks could be read.
2. Pass the same chain and target plus the exact event signature to `plan_trigger`. Save the returned `draftId`. The draft expires after seven days.
3. Run `test_trigger` on the draft. Let the server find a recent sample or supply a block or slot. Continue when the latest result is `matched`.

   EVM discovery covers at most the latest 1,000 blocks. Solana discovery tries up to 12 recent slots, and Substrate tries up to 12 recent blocks. After EVM discovery reads at least one log window without a match, an error response from the provider, including a provider-side timeout, or an opaque runtime refusal on older windows can end the scan with `no_match`. That result covers only the windows read. Transport failures, reaching the discovery deadline, and a scan that cannot read any windows return `retryable`.

   If you know where the event occurred or want to bypass discovery, pass its `slot` for Solana or `block` for EVM or Substrate to `test_trigger`. For an older EVM event, pass its `block` directly.

   If the API's workspace test limiter returns HTTP `429` with `error.code: "retryable"`, MCP reports a tool error. Back off before retrying. A successful tool reply can carry `result: "retryable"`.

4. Call `activate_trigger` with the same `draftId` and your own `requestId`. Reuse the ID on retries. The saved trigger is in the workspace's private agent project. A workspace `developer` can build and activate the trigger. An `owner` or `admin` must use the returned fullname with `create_subscription`. If another member created the workspace's agent project, activation uses that creator's plan to check trigger units. It returns `plan_required` if that plan no longer allows trigger management.

`find_contract` and `test_trigger` use `read`. Planning and activation use `manage`. See the [build tool reference](mcp-server.md#build-endpoint).

## Limits

The Free plan caps active subscriptions you created to non-Free projects at **5 across all workspaces**. Subscriptions to Free projects are exempt.

On Free, a subscription that delivers only to a built-in webhook has a default burst of 12 alerts, a sustained rate of 1 alert per second, and a queue cutoff of 15. These subscriptions skip the workspace delivery bucket.

Free allows 60 external API requests per minute. Subscription tests and alert history are available on Advanced and Pro. For both, the API checks the plan of the first workspace owner, with the fallback described in step 6. See [Limits](limits.md) for the full tables.

The MCP server allows 120 tool calls per account per minute by default, shared across all three MCP paths on each server process. `get_account` reports the account tier and the [tier limits](api-account.md#me-limits) from `GET /api/me`. Its `limits` is `null` when the API does not supply tier limits. MCP can serve its cached `/me` snapshot for up to 30 seconds, so a plan change can take that long to appear in `get_account`.

## Machine-readable references

- [llms.txt](https://web3alert.io/llms.txt) for connection details and documentation links.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) for the agent-facing HTTP API.
