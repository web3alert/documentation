# MCP Server

Web3alert MCP Server 允许从 MCP client 管理 Web3alert marketplace 实体：创建和编辑 projects、triggers、templates、subscriptions、resources、data sources，并读取诊断数据。

MCP 仅对 account tier `Advanced` 和 `Pro` 可用。如果连接的是 `Free` account 的 token，server 会返回访问错误。

## Token

连接需要来自 [Account parameters](account.md#personal-access-token) 的 personal access token。

Token 让 MCP server 可以代表当前 account 访问 Web3alert API。可用操作级别取决于 account tier 和用户在 workspace 中的 roles。

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
