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
| `429` | A camada de entrada limitou os pedidos do seu IP ou a API limitou a verificação de credenciais. Respeite `Retry-After` antes de tentar novamente. |
| `503` | A verificação do token está temporariamente indisponível. Aguarde o tempo indicado em `Retry-After` e volte a tentar com o mesmo token. |

Por predefinição, cada processo permite 120 chamadas a ferramentas por minuto e por conta, partilhadas pelos três endpoints e por todas as credenciais da conta. Quando o limite é atingido, a ferramenta devolve `rate_limited` com `retryAfter` em segundos.

Os erros das ferramentas são independentes dos erros de autenticação HTTP.

| Erro | Significado |
| --- | --- |
| `insufficient_scope` | A chave não tem uma permissão obrigatória. |
| `key_not_allowed` | A operação requer uma sessão da conta. Isto também se aplica à compra com uma chave enquanto está ativo um plano com renovação automática. |
| `spend_cap_exceeded` | A compra excederia o limite mensal em EUR da chave. |
| `not_in_plan` | O plano do espaço de trabalho não inclui caixa de entrada ou histórico de entregas. |
| `plan_required` | A operação de criação requer uma conta Advanced ou Pro. |
| `insufficient_balance` | O saldo em EUR é insuficiente para comprar o plano. |
| `api_error` | Em `buy_plan`, um checkout pendente ou plano superior ativo pode bloquear a compra antes de debitar o saldo. A ferramenta devolve a mensagem da API. Resolva primeiro o plano ou checkout existente. |
| `x402_unavailable` | Os carregamentos em USDC estão indisponíveis. |
| `rate_unavailable` | A taxa de referência do BCE está indisponível. |
| `no_current_workspace` | A ferramenta requer um espaço de trabalho atual e a API não devolveu nenhum. |
| `not_tested` | O último teste do rascunho tem de devolver `matched` antes da ativação. |
| `draft_expired` | O rascunho expirou. |
| `retryable` | Um pedido ao fornecedor de dados da cadeia falhou ou o espaço atingiu o limite de testes. |
| `private_project_limit` | Criar o projeto privado do agente excederia o limite de projetos da conta. |
| `trigger_limit` | Ativar o trigger excederia o limite do plano. |
| `not_found` | O alvo está indisponível. Na criação de triggers, este erro pode indicar uma cadeia desconhecida, um ABI verificado em falta ou que o runtime identificou um IDL em falta ou um pallet desconhecido. Uma falha genérica ao pesquisar o IDL ou pallet devolve `retryable`. Um evento, rascunho ou trigger indisponível também pode devolver `not_found`. Um explorador sobrecarregado também pode devolver `not_found` por falta de ABI. Se o contrato estiver verificado no explorador, tente novamente daqui a um minuto. |
| `request_id_conflict` | O mesmo `requestId` de ativação já foi usado para outro rascunho no espaço. |

## Atualizar clientes existentes

Envie a chave no cabeçalho `Authorization: Bearer <agent-key>`. O endpoint `/mcp` exige o cabeçalho em cada pedido e funciona sem sessões MCP. Retire a credencial do URL ou do corpo do pedido.

Os tokens de sessão existentes funcionam até serem revogados pelo servidor. Use chaves de agente para novas ligações.

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
| `get_topup_requirements` | Cota um carregamento de 5 € a 500 € em USDC. Assine o pagamento explicitamente com a sua carteira. Requer `manage`. Confirme o [URL de pagamento, a rede e o ativo](api-billing.md#post-api-billing-wallet-x402-topup) antes de assinar. |
| `buy_plan` | Compra Advanced ou Pro com o saldo em EUR, sem renovação automática. Requer `spend` e um `requestId` novo de 8–64 caracteres, como um UUID gerado. Reutilize o mesmo ID apenas ao repetir essa compra. |
| `find_triggers` | Pesquisa gatilhos de redes EVM e Substrate no catálogo público. Também pesquisa os gatilhos do espaço de trabalho atual. |
| `get_trigger` | Mostra os inputs de execução do trigger, os campos dos eventos entregues e os campos que pode usar em `conditions`. |
| `list_webhooks` | Lista o `fullname`, o nome e o URL de cada webhook registado no workspace. O campo `signed` indica se o webhook tem um segredo de assinatura. |
| `add_webhook` | Regista um webhook com um URL HTTPS sem credenciais. Se, ao verificar o nome, já existir um recurso com esse nome no espaço de trabalho, a ferramenta recusa o pedido com `webhook_exists`. O segredo de assinatura só aparece na resposta de `add_webhook` como `signingSecret`. Substituí-lo mais tarde altera o segredo para todos os recetores desse endpoint. |
| `remove_webhook` | Elimina um webhook pelo fullname no espaço atual. Requer `manage`. Devolve `webhook_in_use` se uma subscrição ativa no mesmo espaço o usar. |
| `create_subscription` | Cria uma subscrição com um destino, `webhook` ou `inbox: true`. Inclua as entradas obrigatórias e as `conditions` opcionais. Com `inbox: true`, `resource_name_in_use` indica que outro recurso já usa o nome da caixa de entrada. Peça a um `owner` ou `admin` do espaço que resolva o conflito. Atribua um `title` único a cada intenção de `create_subscription`. Se perder a resposta, chame `list_subscriptions` e procure pelo título. Se não houver correspondências, aguarde e volte a consultar, pois o pedido original ainda pode criar a subscrição. Se o título não for conclusivo, examine as regras e ações devolvidas por [GET /api/subscriptions](api-subscriptions.md#get-api-subscriptions). Se o resultado continuar por confirmar, pare e esclareça o que aconteceu antes de repetir a criação. |
| `list_subscriptions` | Lista os IDs, títulos, estados, triggers, webhooks e datas de criação das subscriptions. |
| `set_subscription_state` | Pausa (`off`) ou retoma (`on`) uma subscription. |
| `remove_subscription` | Elimina uma subscrição. As novas tentativas de webhook param em cerca de 10 segundos. Uma tentativa prevista para esse intervalo ainda pode ser enviada. |
| `read_events` | Lê a caixa de entrada de um espaço com plano pago a partir do evento mais antigo. Passe `nextCursor` como `after` no mesmo espaço. `gap: true` indica lacunas antes ou dentro de uma página de eventos guardados. Uma página vazia pode indicar uma lacuna se não estiverem retidos eventos mais recentes. Use `get_delivery_log` para eventos não entregues quando houver histórico. Requer `read`. Um evento da caixa de entrada com corpo superior a 64 KiB chega com `body.truncated: true` e sem `body.object`. Verifique esse indicador antes de processar o evento. |
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
| `test_trigger` | `read` | Testa um rascunho com uma amostra recente ou reproduz um bloco ou slot indicado. A pesquisa em EVM abrange no máximo os últimos 1 000 blocos. A pesquisa em Solana tenta até 12 slots recentes e em Substrate até 12 blocos recentes. Se uma pesquisa EVM ler pelo menos um intervalo de logs sem correspondências, uma resposta de erro do fornecedor, incluindo um tempo limite do lado do fornecedor, ou uma recusa genérica do runtime em intervalos anteriores pode terminar a pesquisa com `no_match`. O resultado só abrange os intervalos lidos. Falhas de transporte, o fim do prazo da pesquisa e a impossibilidade de ler qualquer intervalo devolvem `retryable`. Se souber onde ocorreu o evento ou quiser dispensar a pesquisa, passe a `test_trigger` o seu `slot` para Solana ou o seu `block` para EVM ou Substrate. Para um evento EVM anterior a esse intervalo, indique diretamente o respetivo `block`. Se a API aplicar o limite de testes do espaço e devolver HTTP `429` com `error.code: "retryable"`, o MCP devolve um erro da ferramenta. Aumente a espera antes de repetir o pedido. Uma resposta bem-sucedida da ferramenta pode conter `result: "retryable"`. |
| `activate_trigger` | `manage` | Guarda um rascunho cujo último teste encontrou uma correspondência. A primeira ativação bem-sucedida cria o projeto privado do agente, que conta para o limite da conta. Reutilize `requestId` ao repetir o pedido para o mesmo rascunho. Usá-lo com outro rascunho devolve `request_id_conflict`. Use o fullname devolvido para criar subscrições. Se outro membro criou o projeto de agente no espaço, a ativação usa o plano do criador para verificar as unidades de triggers. Devolve `plan_required` se esse plano já não permitir gerir triggers. A ativação requer um `requestId` de até 128 caracteres com pelo menos um carácter que não seja espaço em branco. A função `developer` no espaço permite criar e ativar o trigger. Só um `owner` ou `admin` pode usar o fullname devolvido com `create_subscription`. |
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
