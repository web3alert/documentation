# MCP Server

O Web3alert disponibiliza três caminhos com Streamable HTTP.

| Caminho | Ferramentas | Autenticação |
| --- | --- | --- |
| `/mcp/agent` | [14 ferramentas](#endpoint-para-agentes) para conta, faturação, subscrições e entregas | Descoberta pública. Chave Bearer para chamadas. |
| `/mcp/agent/build` | 19 ferramentas, incluindo as 14 de agentes e [5 de criação](#build-endpoint) | Descoberta pública. Chave Bearer para chamadas. As ferramentas de criação requerem Advanced ou Pro. |
| `/mcp` | [Conjunto completo de ferramentas de criação e edição](#remote-mcp-endpoint) | Chave Bearer em todos os pedidos. |

A entrada `io.web3alert/agent` no MCP Registry indica que o cabeçalho `Authorization` é opcional. Consulte o [repositório público do MCP](https://github.com/web3alert/mcp) para informações sobre o servidor.

## Autenticação

Os dois caminhos de agentes aceitam mensagens individuais `initialize`, `ping`, `tools/list` e notificações sem token. As chamadas a ferramentas e os lotes requerem `Authorization: Bearer <agent-key>`. Cada lote pode conter até 20 mensagens. O caminho de criação e edição também exige o cabeçalho para a descoberta. Os três caminhos verificam a credencial recebida e devolvem HTTP `401` se for inválida.

Crie uma chave na [página Agents](https://web3alert.io/agents) ou [registe-se com uma carteira](agents.md). A chave atua em nome da conta no espaço ao qual está associada. As operações dependem das permissões da chave, do plano aplicável e das permissões da conta nesse espaço.

Após a revogação, a API rejeita o token imediatamente. Enquanto o MCP mantiver a verificação em cache, uma chamada a uma ferramenta para agentes que chegue à API devolve `access_denied`. Os pedidos `initialize` e `tools/list` que incluam o token revogado podem continuar a funcionar durante até 30 segundos com a verificação em cache. Quando o MCP volta a verificar o token revogado, devolve HTTP `401`.

| Estado HTTP | O que fazer |
| --- | --- |
| `401` | Falta um Bearer token obrigatório ou o token enviado é inválido, desconhecido ou revogado. Envie o header com um token válido. Obtenha um novo token se não tiver nenhum ou se o servidor já não o reconhecer. |
| `403` | O servidor rejeitou a origem do cliente (`forbidden_origin`) ou o account não passou a verificação de acesso ao MCP (`mcp_access_denied`). Verifique o header `Origin` do cliente ou os dados do account, consoante o erro. |
| `429` | A API limitou a verificação do token. Aguarde o tempo indicado em `Retry-After` antes de voltar a tentar. |
| `503` | A verificação do token está temporariamente indisponível. Aguarde o tempo indicado em `Retry-After` e volte a tentar com o mesmo token. |

Por predefinição, cada processo permite 120 chamadas a ferramentas por minuto e por conta, partilhadas pelos três endpoints e por todas as credenciais da conta. Quando o limite é atingido, a ferramenta devolve `rate_limited` com `retryAfter` em segundos.

Os erros das ferramentas são independentes dos erros de autenticação HTTP.

| Erro | Significado |
| --- | --- |
| `insufficient_scope` | A chave não tem uma permissão obrigatória. |
| `key_not_allowed` | A operação requer uma sessão da conta. |
| `spend_cap_exceeded` | A compra excederia o limite mensal em EUR da chave. |
| `not_in_plan` | O plano do espaço de trabalho não inclui caixa de entrada ou histórico de entregas. |
| `plan_required` | A operação de criação requer uma conta Advanced ou Pro. |

## Atualizar clientes existentes

Envie a chave no cabeçalho `Authorization: Bearer <agent-key>`. O endpoint `/mcp` exige o cabeçalho em cada pedido e funciona sem sessões MCP. Retire a credencial do URL ou do corpo do pedido.

Os tokens de sessão existentes continuam a funcionar até o titular terminar a sessão ou os revogar.

No Claude Code, execute estes comandos a partir do projeto onde usa o Web3alert.

1. Execute `claude mcp list` para verificar se aparece o nome que pretende substituir. Para ver o âmbito da entrada apresentada, execute `claude mcp get web3alert` ou `claude mcp get web3alert-agent`.
2. Remova a entrada indicando o respetivo âmbito, por exemplo com `claude mcp remove --scope user web3alert` ou `claude mcp remove --scope local web3alert`. Depois de a remover, pode aparecer outra entrada com o mesmo nome noutro âmbito. Repita os passos 1 e 2 até que o nome deixe de aparecer.
3. Execute o exemplo de `claude mcp add` do seu endpoint para adicionar a nova entrada.

No Claude Desktop, no Cursor e no VS Code, edite o URL e os cabeçalhos da entrada existente. Consulte os [exemplos de configuração do endpoint remoto](#remote-mcp-endpoint).

## Endpoint para agentes

As ferramentas atuam no espaço de trabalho ao qual a chave está associada. Para trabalhar noutro espaço, crie uma chave nesse espaço.

| Ferramenta | O que faz |
| --- | --- |
| `get_account` | Devolve o ID, nome, plano, saldo em EUR, limites do plano e contagens de subscrições, se disponíveis, além das permissões, validade, limite e gastos mensais da chave. |
| `get_topup_requirements` | Cota um carregamento de 5 € a 500 € em USDC. Pague com um cliente x402 e a sua carteira. Requer `manage`. |
| `buy_plan` | Compra Advanced ou Pro com o saldo em EUR, sem renovação automática. Reutilize `requestId` ao repetir o pedido. Requer `spend`. |
| `find_triggers` | Pesquisa gatilhos de redes EVM e Substrate no catálogo público. Também pesquisa os gatilhos do espaço de trabalho atual. |
| `get_trigger` | Mostra os inputs de execução do trigger, os campos dos eventos entregues e os campos que pode usar em `conditions`. |
| `list_webhooks` | Lista o `fullname`, o nome e o URL de cada webhook registado no workspace. O campo `signed` indica se o webhook tem um segredo de assinatura. |
| `add_webhook` | Regista um webhook com um URL HTTPS sem credenciais. Se, ao verificar o nome, já existir um recurso com esse nome no espaço de trabalho, a ferramenta recusa o pedido com `webhook_exists`. O segredo de assinatura só aparece na resposta de `add_webhook` como `signingSecret`. Substituí-lo mais tarde altera o segredo para todos os recetores desse endpoint. |
| `remove_webhook` | Elimina um webhook pelo fullname no espaço atual. Requer `manage`. Devolve `webhook_in_use` se uma subscrição ativa no mesmo espaço o usar. |
| `create_subscription` | Cria uma subscrição com um destino, `webhook` ou `inbox: true`. Inclua as entradas obrigatórias e as `conditions` opcionais. |
| `list_subscriptions` | Lista os IDs, títulos, estados, triggers, webhooks e datas de criação das subscriptions. |
| `set_subscription_state` | Pausa (`off`) ou retoma (`on`) uma subscription. |
| `remove_subscription` | Elimina uma subscrição. As novas tentativas de webhook param em cerca de 10 segundos. Uma tentativa prevista para esse intervalo ainda pode ser enviada. |
| `read_events` | Lê a caixa de entrada do espaço num plano pago, a partir do evento mais antigo. Passe `nextCursor` como `after` ao consultar de novo. `gap` indica perda por retenção. Requer `read`. |
| `get_delivery_log` | Mostra os resultados de entrega do espaço de trabalho ou de uma subscrição. O histórico de alertas usa o plano da primeira conta com a função de proprietário na lista de acesso do espaço de trabalho. Se essa conta não existir, a API verifica o plano da conta que faz o pedido. Se esse plano não incluir histórico, a ferramenta devolve `not_in_plan`. As entradas dos canais webhook incluem `eventId` e `attempt`. `nextAttemptAt` indica a data e hora em formato ISO para as quais estava agendada a próxima tentativa quando a entrada foi registada, ou `null` se a entrada não registar uma nova tentativa agendada. |

O valor de `nextAttemptAt` mantém-se fixo mesmo depois de a tentativa ocorrer ou ser cancelada. Para saber o resultado da entrega, procure uma entrada posterior com o mesmo `eventId`. Se as novas tentativas pararem porque a subscrição foi pausada ou removida, ou se uma tentativa expirar, o Web3alert não escreve uma entrada final e, sem essa entrada, ficam por determinar o resultado da entrega e o estado atual das tentativas.

`limits.maxSubscriptions` limita as subscrições ativas que criou para projetos que não sejam Free, somadas entre todos os espaços de trabalho. O limite de Free é de 5. As subscrições de projetos Free ficam fora do limite.

Quando o limite de subscriptions do tier é atingido, `create_subscription` pode devolver o erro `subscription_limit_reached`. A criação ou a retoma (com `set_subscription_state` e `on`) pode ter sucesso e devolver `state: "blocked"` e `blockedReason: "subscription_limit_reached"`. Confirme que o `state` devolvido é `on` antes de assumir que a entrega está ativa.

Use o [endpoint de criação](#build-endpoint) para criar um gatilho privado a partir de um evento na cadeia.

### Claude Code

```bash
printf 'Chave de agente do Web3alert: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_KEY"
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
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```

### VS Code

Para uma ligação gerida pelo editor, adicione a entrada em `servers` em `.vscode/mcp.json` e disponibilize `WEB3ALERT_KEY` no ambiente do processo do VS Code.

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_KEY}"
      }
    }
  }
}
```

## Endpoint de criação {#build-endpoint}

Use `https://web3alert.io/mcp/agent/build` com as mesmas definições e o mesmo cabeçalho Bearer. A lista inclui as 14 ferramentas anteriores e estas 5. As contas Free podem descobri-las e recebem `plan_required` ao chamá-las.

`find_contract` e `plan_trigger` usam as fontes de cadeia integradas do Web3alert. Passe um nome curto como `ethereum`, `base`, `arbitrum-one`, `polkadot` ou `solana`, ou use `common.<chain>` ou `common.source.<chain>`. Se a cadeia for desconhecida e houver nomes curtos disponíveis para o tipo de alvo, o erro `not_found` apresenta-os após `Supported:`.

| Ferramenta | Permissão | Função |
| --- | --- | --- |
| `find_contract` | `read` | Procura assinaturas exatas de eventos no ABI de um contrato, no IDL Solana ou nos metadados Substrate. Para EVM, devolve funções e um `recentCount` por evento nos últimos `recentBlocks` blocos, até 1 000. O intervalo pode ser menor se o fornecedor recusar uma consulta ampla. `recentBlocks` é `null` se não for possível ler nenhum bloco ou se a fonte for Solana ou Substrate. Uma contagem de `0` indica que não foram encontrados logs correspondentes no intervalo indicado. |
| `plan_trigger` | `manage` | Gera um rascunho para um evento sem escrever código. Devolve `draftId`, fullname previsto, entradas, campos filtráveis, esquema de saída e validade. |
| `test_trigger` | `read` | Testa um rascunho com uma amostra recente ou reproduz um bloco ou slot indicado. |
| `activate_trigger` | `manage` | Guarda um rascunho cujo último teste encontrou uma correspondência no projeto privado do agente. Reutilize `requestId` nas novas tentativas. Use o fullname devolvido para criar subscrições. |
| `remove_my_trigger` | `manage` | Remove um trigger desse projeto. Devolve `trigger_in_use` se uma subscrição ativa no mesmo espaço o usar. |

A remoção direta de um trigger ou webhook verifica as subscrições ativas (`on`) no espaço de trabalho a que o trigger ou webhook pertence. Pause ou remova essas subscrições antes de repetir o pedido. A remoção de um projeto, espaço de trabalho ou conta bloqueia as subscrições afetadas. Uma subscrição ativa noutro espaço que use um trigger público permite a remoção direta desse trigger.

## Remote MCP Endpoint

Use `https://web3alert.io/mcp` para o conjunto completo de ferramentas para projetos, triggers, modelos, subscrições, recursos, fontes de dados e diagnóstico. Envie um pedido autenticado `tools/list` para obter a lista completa.

Para adicionar o endpoint ao Claude Code, execute o comando em Bash ou Zsh e introduza a chave de agente no pedido de entrada oculta.

```bash
printf 'Chave de agente do Web3alert: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_KEY"
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
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```
