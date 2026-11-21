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

## Atualizar clientes existentes

O endpoint `/mcp` passa a aceitar o token apenas no cabeçalho `Authorization: Bearer <token>` em cada pedido. Os pedidos que enviam o token apenas na cadeia de consulta ou no corpo recebem uma resposta HTTP `401`. O servidor não mantém estado nem cria sessões.

Configure o cliente para enviar o cabeçalho e retire o token do URL ou do corpo do pedido. Consulte os [exemplos de configuração do endpoint remoto](#remote-mcp-endpoint).

## Endpoint para agentes

As ferramentas para agentes atuam no workspace atual do account. Para usar outro workspace na chamada seguinte, selecione-o na aplicação Web3alert.

| Ferramenta | O que faz |
| --- | --- |
| `get_account` | Devolve o ID, o nome e o plano da conta, o saldo em EUR, os limites do plano e as contagens de subscrições ativas e totais do espaço de trabalho atual, quando disponíveis. |
| `find_triggers` | Pesquisa no catálogo publicado e nos triggers do workspace atual. |
| `get_trigger` | Mostra os inputs de execução do trigger, os campos dos eventos entregues e os campos que pode usar em `conditions`. |
| `list_webhooks` | Lista o `fullname`, o nome e o URL de cada webhook registado no workspace. O campo `signed` indica se o webhook tem um segredo de assinatura. |
| `add_webhook` | Regista um webhook com um URL HTTPS sem credenciais. Se, ao verificar o nome, já existir um recurso com esse nome no espaço de trabalho, a ferramenta recusa o pedido com `webhook_exists`. O segredo de assinatura só aparece na resposta de `add_webhook` como `signingSecret`. Substituí-lo mais tarde altera o segredo para todos os recetores desse endpoint. |
| `create_subscription` | Cria uma subscription a um trigger com entrega num webhook. Indique os inputs obrigatórios e, se quiser filtrar eventos, `conditions`. |
| `list_subscriptions` | Lista os IDs, títulos, estados, triggers, webhooks e datas de criação das subscriptions. |
| `set_subscription_state` | Pausa (`off`) ou retoma (`on`) uma subscription. |
| `remove_subscription` | Elimina uma subscrição. As novas tentativas de webhook param em cerca de 10 segundos. Uma tentativa prevista para esse intervalo ainda pode ser enviada. |
| `get_delivery_log` | Mostra os resultados de entrega do espaço de trabalho ou de uma subscrição. O histórico de alertas usa o plano da primeira conta com a função de proprietário na lista de acesso do espaço de trabalho. Se essa conta não existir, a API verifica o plano da conta que faz o pedido. Se esse plano não incluir histórico, a ferramenta devolve `not_in_plan`. As entradas dos canais webhook incluem `eventId` e `attempt`. `nextAttemptAt` indica a data e hora em formato ISO para as quais estava agendada a próxima tentativa quando a entrada foi registada, ou `null` se a entrada não registar uma nova tentativa agendada. |

O valor de `nextAttemptAt` mantém-se fixo mesmo depois de a tentativa ocorrer ou ser cancelada. Para saber o resultado da entrega, procure uma entrada posterior com o mesmo `eventId`.

`limits.maxSubscriptions` limita as subscrições ativas que criou para projetos que não sejam Free, somadas entre todos os espaços de trabalho. O limite de Free é de 5. As subscrições de projetos Free ficam fora do limite.

Quando o limite de subscriptions do tier é atingido, `create_subscription` pode devolver o erro `subscription_limit_reached`. A criação ou a retoma (com `set_subscription_state` e `on`) pode ter sucesso e devolver `state: "blocked"` e `blockedReason: "subscription_limit_reached"`. Confirme que o `state` devolvido é `on` antes de assumir que a entrega está ativa.

Neste endpoint, os agentes não podem criar, editar ou eliminar triggers, projects, templates ou data sources. Também não podem alterar a faturação, os planos ou os pagamentos, gerir tokens, eliminar accounts ou workspaces, mudar de workspace, colocar subscriptions no estado `blocked` nem gerir outros resources além de webhooks.

### Claude Code

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

### Claude Desktop e Cursor

No Claude Desktop, adicione a entrada em `mcpServers` no ficheiro `claude_desktop_config.json`. No Cursor, use o ficheiro pessoal `~/.cursor/mcp.json`.

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

Para uma ligação gerida pelo editor, adicione a entrada em `servers` em `.vscode/mcp.json` e disponibilize `WEB3ALERT_TOKEN` no ambiente do processo do VS Code.

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

## Remote MCP Endpoint

Para adicionar este endpoint ao Claude Code, execute o comando em Bash ou Zsh e introduza o token quando lhe for pedido. O token fica oculto enquanto o introduz.

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

Use o mesmo ficheiro de configuração do Claude Desktop ou do Cursor. Para [VS Code](#vs-code), use o mesmo exemplo de `servers` com o URL `https://web3alert.io/mcp`.

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp",
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
