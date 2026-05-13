# MCP Server

Web3alert MCP Server позволяет управлять marketplace-сущностями Web3alert из MCP-клиента: создавать и редактировать projects, triggers, templates, subscriptions, resources, data sources и читать диагностические данные.

MCP доступен только для account tier `Advanced` и `Pro`. Если подключить token от `Free` account, сервер вернет ошибку доступа.

## Token

Для подключения нужен personal access token из [Account parameters](account.md#personal-access-token).

Token дает MCP server доступ к Web3alert API от имени текущего account. Уровень доступных действий зависит от tier account и ролей пользователя в workspace.

## Remote MCP endpoint

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
