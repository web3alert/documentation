# MCP Server

Web3alert MCP Server allows managing Web3alert marketplace entities from an MCP client: creating and editing projects, triggers, templates, subscriptions, resources, data sources, and reading diagnostic data.

MCP is available only for `Advanced` and `Pro` account tiers. If a token from a `Free` account is connected, the server returns an access error.

## Token

To connect, you need a personal access token from [Account parameters](account.md#personal-access-token).

The token gives MCP server access to Web3alert API on behalf of the current account. The level of available actions depends on the account tier and the user's roles in workspace.

## Remote MCP Endpoint

```json
{
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
```
