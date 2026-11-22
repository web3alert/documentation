# For agents

Find decoded on-chain events from EVM and Substrate chains, including Ethereum, Polkadot and Kusama, in the Web3alert catalog. Use the [14 MCP tools](mcp-server.md#agent-endpoint) to find a trigger, subscribe and receive events as JSON.

## 1. Get an agent key

### Create a key in the app

Sign in to [Web3alert](https://web3alert.io), select a workspace you own or administer, and create a key on the [Agents page](https://web3alert.io/agents). The key is bound to that workspace. Copy the secret when it appears. It is shown once.

Every key includes `read`. Add `manage` to register webhooks, create subscriptions or request a top-up quote. Add `spend` to buy plans from the EUR balance. You can set a [monthly spend cap](limits.md#agent-payments) and an expiry of 30, 90 or 365 days, or leave either unset.

Existing session tokens keep working until their owner logs out or revokes them. Use agent keys for new connections.

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

Each successful sign-in issues a fresh key for the initial workspace, with all three scopes and no cap or expiry. Use `secret` as the bearer credential. Later sign-ins reuse the account. The `claimUrl` is `null` after a Telegram or Google login is linked.

Share the claim link privately with the person taking control of the account. The page shows the wallet, account creation date and link expiry, and offers Telegram or Google sign-in. After signing in, the person lands on the Agents page, where they can see and control the keys and access the account's plan, balance and spend. A login already linked to another Web3alert account requires a different login. The newest link is valid for seven days. Use [the claim-link endpoint](api-account.md#post-api-agent-claim-link) to replace it.

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

1. Call `get_topup_requirements({"amountEur":5})` with `manage`. Top-ups range from €5 to €500 in USDC on Base. Web3alert uses the ECB USD reference rate, values 1 USDC at 1 USD and applies no markup.
2. Use your own x402 v2 client and wallet to pay the quoted requirements. Send the returned `body` to the returned `url` using `POST`, with your bearer credential and the signed payment in `PAYMENT-SIGNATURE`. The MCP server returns the quote. Your wallet signs the payment. Wait until the [top-up](api-billing.md#post-api-billing-wallet-x402-topup) settles and credits your EUR balance.
3. Call `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"first-plan-001"})` with `spend` and enough balance. You can buy Advanced or Pro for 1, 3, 6 or 12 months without auto-renewal. Reuse the same `requestId` and purchase parameters when retrying that purchase.

## 4. Create your first subscription

Choose delivery to a public HTTPS webhook or, on Advanced and Pro, to the workspace inbox. Adding a webhook, creating a subscription, and accessing inbox or delivery history require the workspace `owner` or `admin` role.

### Webhook delivery

In this example session, replace the values in angle brackets with results from earlier calls. Replace the example webhook URL with an HTTPS URL you control, without a username or password. Choose an event trigger and supply any required `inputs` reported by `get_trigger`. This example assumes the trigger requires none.

1. `get_account({})` → Your account, tier, current workspace, EUR wallet balance, tier limits, and subscription counts when available.
2. `find_triggers({"kind":"event","limit":5})` → Matching triggers from the published catalog and your workspace, including each trigger's `fullname`.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → The trigger's runtime inputs, event fields, and fields available for filtering.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → The registered webhook's `fullname`, name, and URL. The signing secret appears only in the `add_webhook` reply as `signingSecret`. Rotating it later replaces it for every receiver of that endpoint. Store the secret for your receiver.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → The subscription's ID, title, resulting state, trigger, and webhook.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Delivery outcomes and `nextCursor` when there are more results. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`.

   If the cursor cannot advance because 500 or more deliveries share a timestamp, the tool returns `api_error`. Narrow the filter, for example by status, and start again without the cursor.

Use the subscription's returned `state` to confirm it is `on`. Matching events can arrive after that. Use a new webhook name or look up an existing webhook with `list_webhooks`.

### Webhook payload

Your webhook receives a JSON body with an event ID. New webhooks receive signed deliveries, and Web3alert automatically retries eligible failures. See [Webhooks](webhooks.md) for the payload, signature verification, retries, and deduplication.

### Inbox delivery

After finding a trigger and inspecting its inputs with `get_trigger`, call `create_subscription({"trigger":"<trigger-fullname>","inbox":true,"state":"on"})`. Supply required `inputs` as for webhook delivery. The tool accepts one destination per call. It creates or reuses the workspace inbox when you pass `inbox: true`.

Call `read_events({})` to start with the oldest retained event. Save `nextCursor` and pass it as `after` on your next call when it is non-null. Keep reading while `hasMore` is true and reuse the cursor when polling. A response with `gap: true` signals that some events are no longer retained. Use the event `id` to deduplicate.

Retention follows the workspace owner's plan, falling back to the caller's plan when there is no owner. Advanced retains up to **7 days or 25,000 events** and Pro up to **30 days or 100,000 events**. Free returns `not_in_plan` for inbox access.

## 5. Build a trigger

On Advanced or Pro, connect the same client to `https://web3alert.io/mcp/agent/build` using the same bearer header. The server generates the trigger from an EVM contract ABI, Solana IDL or Substrate metadata, so you can build without writing code.

1. Use `find_contract` with a built-in chain source and a contract address, Solana program or Substrate pallet to find an exact event signature.
2. Pass the target and event to `plan_trigger`. Save the returned `draftId`. The draft expires after seven days.
3. Run `test_trigger` on the draft. Let the server find a recent sample or supply a block or slot. Continue when the latest result is `matched`.
4. Call `activate_trigger` with the same `draftId` and your own `requestId`. Reuse the ID on retries. The saved trigger is in the workspace's private agent project. Pass its returned fullname to `create_subscription`.

`find_contract` and `test_trigger` use `read`. Planning and activation use `manage`. See the [build tool reference](mcp-server.md#build-endpoint).

## Limits

The Free plan caps active subscriptions you created to non-Free projects at **5 across all workspaces**. Subscriptions to Free projects are exempt.

On Free, a subscription that delivers only to a built-in webhook has a default burst of 12 alerts, a sustained rate of 1 alert per second, and a queue cutoff of 15. These subscriptions skip the workspace delivery bucket.

Free allows 60 external API requests per minute. Subscription tests and alert history are available on Advanced and Pro. For both, the API checks the plan of the first workspace owner, with the fallback described in step 6. See [Limits](limits.md) for the full tables.

The MCP server allows 120 tool calls per account per minute by default, shared across all three MCP paths on each server process. `get_account` reports the account tier and the [tier limits](api-account.md#me-limits) from `GET /api/me`. Its `limits` is `null` when the API does not supply tier limits. MCP can serve its cached `/me` snapshot for up to 30 seconds, so a plan change can take that long to appear in `get_account`.

## Machine-readable references

- [llms.txt](https://web3alert.io/llms.txt) for connection details and documentation links.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) for the agent-facing HTTP API.
