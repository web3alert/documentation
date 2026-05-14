# MCP Server

Web3alert MCP Server permite gestionar entidades marketplace de Web3alert desde un cliente MCP: crear y editar projects, triggers, templates, subscriptions, resources, data sources y leer datos de diagnóstico.

MCP está disponible solo para account tiers `Advanced` y `Pro`. Si se conecta un token de un account `Free`, el servidor devuelve un error de acceso.

## Token

Para conectarse, se necesita un personal access token de [Account parameters](account.md#personal-access-token).

El token da al MCP server acceso a Web3alert API en nombre del account actual. El nivel de acciones disponibles depende del account tier y de los roles del usuario en workspace.

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
