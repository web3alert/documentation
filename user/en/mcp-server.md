# MCP Server

MCP is available on `Free`, `Advanced`, and `Pro`.

- Use `https://web3alert.io/mcp/agent` to subscribe to decoded on-chain events and receive them on a webhook.
- Use `https://web3alert.io/mcp` for the full set of tools to create and edit Web3alert marketplace projects, triggers, templates, subscriptions, resources, and data sources, and to read diagnostic data.

## Token

To connect, you need a personal access token from [Account parameters](account.md#personal-access-token).

The token gives MCP server access to Web3alert API on behalf of the current account. The level of available actions depends on the account tier and the user's roles in workspace.

Send the token on every HTTP request in the `Authorization: Bearer <token>` header. The server does not accept tokens in the query string or request body.

After revocation, the API rejects the token immediately. While MCP still has a cached verification, an agent tool call that reaches the API returns `access_denied`. `initialize` and `tools/list` may still succeed for up to 30 seconds on a cached verification. When MCP rechecks the revoked token, it returns HTTP `401`.

| HTTP status | What to do |
| --- | --- |
| `401` | The bearer token is missing, invalid, unknown, or revoked. Send the header with a valid token. Get a new token if you do not have one or the server no longer recognizes it. |
| `403` | The client origin was rejected (`forbidden_origin`) or the account failed MCP access checks (`mcp_access_denied`). Check the client's `Origin` header or your account details, respectively. |
| `429` | The API rate-limited token verification. Wait for the delay in `Retry-After` before retrying. |
| `503` | Token verification is temporarily unavailable. Wait for the delay in `Retry-After` and retry with the same token. |

Both endpoints share a default budget of 120 tool calls per minute per account on each server process, across all tokens for that account. If you use up this budget, the tool returns `rate_limited` with `retryAfter` in seconds.

## Agent Endpoint

Agent tools act on the account's current workspace. To change which workspace the next call uses, select it in the Web3alert app.

| Tool | What it does |
| --- | --- |
| `get_account` | Returns the account ID, name, tier, EUR wallet balance, and active and total subscription counts for the current workspace when available. |
| `find_triggers` | Searches the published catalog and the current workspace's triggers. |
| `get_trigger` | Shows a trigger's runtime inputs, delivered event fields, and fields you can use in `conditions`. |
| `list_webhooks` | Lists the `fullname`, name, and URL of each registered workspace webhook. |
| `add_webhook` | Registers an HTTPS webhook under a new name. If the name is already in use in the workspace, the tool returns `webhook_exists`. |
| `create_subscription` | Subscribes to one trigger with delivery to one webhook. Supply any required inputs and optional `conditions` to filter events. |
| `list_subscriptions` | Lists subscription IDs, titles, states, triggers, webhooks, and creation times. |
| `set_subscription_state` | Pauses (`off`) or resumes (`on`) a subscription. |
| `remove_subscription` | Deletes a subscription and stops delivery. |
| `get_delivery_log` | Shows delivery outcomes for the workspace or a single subscription. Alert history requires the workspace owner to be on `Advanced` or `Pro`. If the owner's plan lacks alert history, the tool returns `not_in_plan`. |

At the tier's subscription limit, `create_subscription` can fail with `subscription_limit_reached`. A successful create or resume (`set_subscription_state` with `on`) can return `state: "blocked"` and `blockedReason: "subscription_limit_reached"`. Check that the returned `state` is `on` before assuming delivery is running.

Through this endpoint, agents cannot create, edit, or delete triggers, projects, templates, or data sources. They also cannot change billing, plans, or payments, manage tokens, delete accounts or workspaces, switch workspaces, set subscriptions to `blocked`, or manage resources other than webhooks.

### Claude Code

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
```

### Generic JSON Configuration

Put this JSON in your client's MCP configuration file.

```json
{
  "mcpServers": {
    "web3alert-agent": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "--header",
        "Authorization:${AUTH_HEADER}",
        "https://web3alert.io/mcp/agent"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

## Remote MCP Endpoint

Put this JSON in your client's MCP configuration file.

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "--header",
        "Authorization:${AUTH_HEADER}",
        "https://web3alert.io/mcp"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
