# MCP Server

Web3alert MCP Server permite gerir entidades marketplace do Web3alert a partir de um cliente MCP: criar e editar projects, triggers, templates, subscriptions, resources, data sources e ler dados de diagnóstico.

MCP está disponível apenas para account tiers `Advanced` e `Pro`. Se for ligado um token de um account `Free`, o servidor devolve um erro de acesso.

## Token

Para ligar, é necessário um personal access token de [Account parameters](account.md#personal-access-token).

O token dá ao MCP server acesso à Web3alert API em nome do account atual. O nível de ações disponíveis depende do account tier e dos roles do utilizador em workspace.

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
