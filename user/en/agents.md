# For agents

Find decoded on-chain events from EVM and Substrate chains, including Ethereum, Polkadot and Kusama, in the Web3alert catalog. Your agent can use the [10 MCP tools](mcp-server.md#agent-endpoint) to find a trigger, subscribe to it, and receive matching events as JSON at its webhook.

## Coming soon

- Wallet sign-in so agents can open their own accounts.
- USDC top-ups over x402.
- An inbox to catch up on missed events.

## 1. Get a token

A person signs in to [Web3alert](https://web3alert.io) and copies the personal access token from [Account parameters](account.md#personal-access-token). Agents cannot create their own accounts yet. Select a workspace you own or administer in the app. Adding a webhook, creating a subscription, and reading delivery history require the `owner` or `admin` role.

## 2. Connect your MCP client

Use Streamable HTTP at `https://web3alert.io/mcp/agent` and send `Authorization: Bearer <token>` on each request.

### Claude Code

Set `WEB3ALERT_TOKEN` to your token in the shell, then run this command.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

### Claude Desktop and Cursor

Add the entry under `mcpServers` in Claude Desktop's `claude_desktop_config.json` (Settings → Developer → Edit Config) or Cursor's personal `~/.cursor/mcp.json`. This example uses the `mcp-remote` bridge via `npx`. Replace the token placeholder.

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

## 3. Create your first subscription

Your agent needs a public HTTPS endpoint to receive events. Agents without one cannot receive events until the inbox launches.

In this example session, replace the values in angle brackets with results from earlier calls. Replace the example webhook URL with an HTTPS URL you control, without a username or password. Choose an event trigger and supply any required `inputs` reported by `get_trigger`. This example assumes the trigger requires none.

1. `get_account({})` → Your account, tier, current workspace, EUR wallet balance, tier limits, and subscription counts when available.
2. `find_triggers({"kind":"event","limit":5})` → Matching triggers from the published catalog and your workspace, including each trigger's `fullname`.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → The trigger's runtime inputs, event fields, and fields available for filtering.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → The registered webhook's `fullname`, name, and URL. The signing secret appears only in the `add_webhook` reply as `signingSecret`. Rotating it later replaces it for every receiver of that endpoint. Store the secret for your receiver.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → The subscription's ID, title, resulting state, trigger, and webhook.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Delivery outcomes and `nextCursor` when there are more results. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`.

   If the cursor cannot advance because 500 or more deliveries share a timestamp, the tool returns `api_error`. Narrow the filter, for example by status, and start again without the cursor.

Use the subscription's returned `state` to confirm it is `on`. Matching events can arrive after that. Use a new webhook name or look up an existing webhook with `list_webhooks`.

## Webhook payload

Your webhook receives a JSON body with an event ID. New webhooks receive signed deliveries, and Web3alert automatically retries eligible failures. See [Webhooks](webhooks.md) for the payload, signature verification, retries, and deduplication.

## Limits

The Free plan caps active subscriptions you created to non-Free projects at **5 across all workspaces**. Subscriptions to Free projects are exempt.

The agent endpoint creates subscriptions that deliver only to webhooks. On Free, each of these subscriptions has a default burst of 12 alerts, a sustained rate of 1 alert per second, and a queue cutoff of 15. These subscriptions skip the workspace delivery bucket.

Free allows 60 external API requests per minute. Subscription tests and alert history are available on Advanced and Pro. For both, the API checks the plan of the first workspace owner, with the fallback described in step 6. See [Limits](limits.md) for the full tables.

The MCP server allows 120 tool calls per account per minute by default, shared across both endpoints on each server process. `get_account` reports the account tier and the [tier limits](api-account.md#me-limits) from `GET /api/me`. Its `limits` is `null` when the API does not supply tier limits. MCP can serve its cached `/me` snapshot for up to 30 seconds, so a plan change can take that long to appear in `get_account`.

## Machine-readable references

- [llms.txt](https://web3alert.io/llms.txt) for connection details and documentation links.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) for the agent-facing HTTP API.
