# For agents

Find decoded EVM, Substrate, Solana, and HyperCore on-chain events in the Web3alert catalog. Your agent can use the [10 MCP tools](mcp-server.md#agent-endpoint) to find a trigger, subscribe to it, and receive matching events as JSON at its webhook.

## Coming soon

- Signed webhooks with automatic retries.
- Wallet sign-in so agents can open their own accounts.
- USDC top-ups over x402.
- An inbox to catch up on missed events.

## 1. Get a token

A person signs in to [Web3alert](https://web3alert.io) and copies the personal access token from [Account parameters](account.md#personal-access-token). Agents cannot create their own accounts yet. Select the workspace to use in the app.

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

In this example session, replace the values in angle brackets with results from earlier calls. Replace the example webhook URL with an HTTPS URL you control, without a username or password. Choose an event trigger and supply any required `inputs` reported by `get_trigger`. This example assumes the trigger requires none.

1. `get_account({})` → Your account, tier, current workspace, EUR wallet balance, tier limits, and subscription counts when available.
2. `find_triggers({"kind":"event","limit":5})` → Matching triggers from the published catalog and your workspace, including each trigger's `fullname`.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → The trigger's runtime inputs, event fields, and fields available for filtering.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → The registered webhook's `fullname`, name, and URL.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → The subscription's ID, title, resulting state, trigger, and webhook.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Delivery outcomes and `nextCursor` when there are more results. Alert history uses the plan of the first account with the owner role in the workspace's access list. If there is no such account, the API checks the caller's plan. Without history on that plan, the tool returns `not_in_plan`.

Use the subscription's returned `state` to confirm it is `on`. Matching events can arrive after that. Use a new webhook name or look up an existing webhook with `list_webhooks`.

## Webhook payload

Web3alert sends an HTTP POST with a JSON body in this format. `header` is the project title or name, `message` is the long or short alert text, and `object` contains the event data or an empty object. `icon`, `cover`, and `links` appear when supplied.

```json
{
  "header": "Example project",
  "icon": "https://example.com/icon.png",
  "cover": "https://example.com/cover.png",
  "message": "Example alert",
  "links": [{ "text": "View event", "url": "https://example.com/event" }],
  "object": {}
}
```

Webhook signatures and automatic retries are coming soon.

## Limits

Free accounts can keep up to **5 active subscriptions to non-free projects**. Subscriptions to Free projects do not count toward this cap. Free also has a runtime limit of 3 alerts in a burst, 0.25 alerts per second sustained, and a queue cutoff of 15 per subscription. The corresponding workspace limits are 10 alerts in a burst and 1 per second sustained. Free has 60 external API requests per minute and includes neither test runs nor alert history. See [Limits](limits.md) for the full tables.

The MCP server allows 120 tool calls per account per minute by default, shared across both endpoints on each server process. `get_account` reports the account tier and the same [tier limits](api-account.md#me-limits) as `GET /api/me`. Its `limits` is `null` when the API does not supply tier limits.

## Machine-readable references

- [llms.txt](https://web3alert.io/llms.txt) for connection details and documentation links.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) for the agent-facing HTTP API.
