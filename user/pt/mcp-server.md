# MCP Server

MCP está disponível para os tiers `Free`, `Advanced` e `Pro`.

- Use `https://web3alert.io/mcp/agent` para subscrever eventos on-chain descodificados e recebê-los num webhook.
- Use `https://web3alert.io/mcp` para aceder ao conjunto completo de ferramentas para criar e editar projects, triggers, templates, subscriptions, resources e data sources do marketplace do Web3alert e consultar dados de diagnóstico.

## Token

Para ligar, é necessário um personal access token de [Account parameters](account.md#personal-access-token).

O token dá ao MCP server acesso à Web3alert API em nome do account atual. O nível de ações disponíveis depende do account tier e dos roles do utilizador em workspace.

Envie o token em cada pedido HTTP no header `Authorization: Bearer <token>`. O servidor não aceita tokens na query string nem no corpo do pedido.

Após a revogação, a API rejeita o token imediatamente. Enquanto o MCP mantiver a verificação em cache, uma chamada a uma ferramenta para agentes que chegue à API devolve `access_denied`. `initialize` e `tools/list` podem continuar a responder durante até 30 segundos com a verificação em cache. Quando o MCP volta a verificar o token revogado, devolve HTTP `401`.

| Estado HTTP | O que fazer |
| --- | --- |
| `401` | O Bearer token está em falta ou é inválido, desconhecido ou revogado. Envie o header com um token válido. Obtenha um novo token se não tiver nenhum ou se o servidor já não o reconhecer. |
| `403` | O servidor rejeitou a origem do cliente (`forbidden_origin`) ou o account não passou a verificação de acesso ao MCP (`mcp_access_denied`). Verifique o header `Origin` do cliente ou os dados do account, consoante o erro. |
| `429` | A API limitou a verificação do token. Aguarde o tempo indicado em `Retry-After` antes de voltar a tentar. |
| `503` | A verificação do token está temporariamente indisponível. Aguarde o tempo indicado em `Retry-After` e volte a tentar com o mesmo token. |

Por predefinição, cada processo do servidor permite 120 chamadas a ferramentas por minuto e por account, partilhadas pelos dois endpoints e por todos os tokens do account. Quando esse limite é atingido, a ferramenta devolve `rate_limited` com `retryAfter` em segundos.

## Endpoint para agentes

As ferramentas para agentes atuam no workspace atual do account. Para usar outro workspace na chamada seguinte, selecione-o na aplicação Web3alert.

| Ferramenta | O que faz |
| --- | --- |
| `get_account` | Devolve o ID, o nome e o tier do account, o saldo em EUR e as contagens de subscriptions ativas e totais do workspace atual quando estão disponíveis. |
| `find_triggers` | Pesquisa no catálogo publicado e nos triggers do workspace atual. |
| `get_trigger` | Mostra os inputs de execução do trigger, os campos dos eventos entregues e os campos que pode usar em `conditions`. |
| `list_webhooks` | Lista o `fullname`, o nome e o URL de cada webhook registado no workspace. |
| `add_webhook` | Regista um webhook HTTPS com um nome novo. Se o nome já estiver em uso no workspace, a ferramenta devolve `webhook_exists`. |
| `create_subscription` | Cria uma subscription a um trigger com entrega num webhook. Indique os inputs obrigatórios e, se quiser filtrar eventos, `conditions`. |
| `list_subscriptions` | Lista os IDs, títulos, estados, triggers, webhooks e datas de criação das subscriptions. |
| `set_subscription_state` | Pausa (`off`) ou retoma (`on`) uma subscription. |
| `remove_subscription` | Elimina uma subscription e interrompe a entrega. |
| `get_delivery_log` | Mostra os resultados da entrega no workspace ou numa subscription. O histórico de alertas exige que o proprietário do workspace tenha o plano `Advanced` ou `Pro`. Se o plano não incluir o histórico de alertas, a ferramenta devolve `not_in_plan`. |

Quando o limite de subscriptions do tier é atingido, `create_subscription` pode devolver o erro `subscription_limit_reached`. A criação ou a retoma (com `set_subscription_state` e `on`) pode ter sucesso e devolver `state: "blocked"` e `blockedReason: "subscription_limit_reached"`. Confirme que o `state` devolvido é `on` antes de assumir que a entrega está ativa.

Neste endpoint, os agentes não podem criar, editar ou eliminar triggers, projects, templates ou data sources. Também não podem alterar a faturação, os planos ou os pagamentos, gerir tokens, eliminar accounts ou workspaces, mudar de workspace, colocar subscriptions no estado `blocked` nem gerir outros resources além de webhooks.

### Claude Code

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
```

### Configuração JSON genérica

Coloque este JSON no ficheiro de configuração MCP do seu cliente.

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

Coloque este JSON no ficheiro de configuração MCP do seu cliente.

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
