# Para agentes

Encontre no catálogo do Web3alert eventos on-chain descodificados de redes EVM e Substrate, incluindo Ethereum, Polkadot e Kusama. O seu agente pode usar as [14 ferramentas MCP](mcp-server.md#endpoint-para-agentes) para procurar um gatilho, subscrevê-lo e receber os eventos correspondentes em JSON por webhook ou na caixa de entrada.

## 1. Obtenha uma chave de agente

### Crie uma chave na aplicação

Inicie sessão no [Web3alert](https://web3alert.io), selecione um espaço de trabalho de que seja membro e crie uma chave na [página Agents](https://web3alert.io/agents). A chave atua com a sua função nesse espaço e com as permissões que lhe atribuir. Copie o segredo quando aparecer. Só é mostrado uma vez.

Todas as chaves incluem `read`. Adicione `manage` para registar webhooks, criar subscrições ou pedir uma cotação de carregamento. Adicione `spend` para comprar planos com o saldo em EUR. Pode definir um [limite mensal de gastos](limits.md#agent-payments) e uma validade de 30, 90 ou 365 dias. Ambos são opcionais.

Os tokens de sessão existentes funcionam até serem revogados pelo servidor. Use chaves de agente para novas ligações.

### Registe-se com uma carteira Ethereum

Um agente com uma conta de propriedade externa (EOA) Ethereum pode criar a sua própria conta Free. Peça primeiro um nonce de utilização única. Os dois pedidos SIWE são públicos.

```http
POST /api/agent/siwe/nonce
Host: web3alert.io
```

```json
{
  "nonce": "exampleNonce123456",
  "issuedAt": "<ISO-8601 timestamp>",
  "expiresAt": "<ISO-8601 timestamp>"
}
```

Construa a mensagem EIP-4361 com o nonce e o `issuedAt` devolvidos, substitua o endereço e assine a mensagem exata com a carteira. O nonce é válido durante 10 minutos. O servidor verifica se `issuedAt` está dentro de 5 minutos do seu relógio.

```http
POST /api/agent/siwe/verify
Host: web3alert.io
Content-Type: application/json

{
  "message": "web3alert.io wants you to sign in with your Ethereum account:\n<your Ethereum address>\n\n\nURI: https://web3alert.io\nVersion: 1\nChain ID: 1\nNonce: <nonce>\nIssued At: <issuedAt>",
  "signature": "<wallet signature>"
}
```

Exemplo de resposta `200` com o objeto `key` abreviado.

```json
{
  "account": { "id": "<account-id>", "created": true },
  "key": { "id": "<key-id>", "scopes": ["read", "manage", "spend"] },
  "secret": "w3a_<key-secret>",
  "claimUrl": "https://web3alert.io/claim/<claim-token>"
}
```

Cada início de sessão bem-sucedido emite uma chave para o espaço inicial com as três permissões, sem limite nem validade. Use `secret` como credencial Bearer. A verificação devolve uma ligação de reivindicação quando cria a conta ou se não houver uma ligação ativa. Caso já haja uma, `claimUrl` fica a `null`. Quando uma pessoa reivindica a conta com Telegram ou Google, o início de sessão com carteira devolve `403 account_claimed`. Peça a essa pessoa uma chave de agente.

Partilhe a ligação de reivindicação em privado com a pessoa que vai assumir a conta. A página mostra a carteira, a data de criação da conta e a validade da ligação, e permite iniciar sessão com Telegram ou Google. Em seguida, a página Agents permite ver e controlar as chaves e consultar o plano, o saldo e os gastos. Se o início de sessão já estiver associado a outra conta Web3alert, use um diferente. A ligação mais recente é válida durante sete dias. Pode substituí-la pelo endpoint [`POST /api/agent/claim-link`](api-account.md#post-api-agent-claim-link).

Reivindicar a conta mantém ativas as chaves emitidas anteriormente através da carteira. Após iniciar sessão, reveja as chaves na [página Agents](https://web3alert.io/agents) e revogue as que não quiser manter.

Os endpoints de nonce e verificação partilham um limite por IP na camada de entrada de 1 pedido por segundo, com um pico de 10. Os `429` dessa camada não incluem o corpo `signup_limited` da API. Respeite `Retry-After` e peça um novo nonce se a mensagem assinada já não for válida.

## 2. Ligue o cliente MCP

Use Streamable HTTP em `https://web3alert.io/mcp/agent`. Pode descobrir as ferramentas sem token. Envie `Authorization: Bearer <agent-key>` ao chamar uma ferramenta.

### Claude Code

Atribua a chave de agente à variável `WEB3ALERT_KEY` no terminal e execute este comando.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop e Cursor

Adicione a entrada em `mcpServers` no ficheiro `claude_desktop_config.json` do Claude Desktop (Settings → Developer → Edit Config) ou no ficheiro pessoal `~/.cursor/mcp.json` do Cursor. O exemplo usa a ponte `mcp-remote` através de `npx`. Substitua o valor de exemplo da chave.

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

## 3. Carregue o saldo e compre um plano

1. Chame `get_account({})` antes de assinar. Verifique o saldo em EUR e confirme que o limite mensal restante da chave, se definido, cobre a compra. Uma conta nova começa com 0 € e um mês de Advanced custa 15 €. Para este exemplo sem saldo, chame `get_topup_requirements({"amountEur":15})` com `manage`. Os carregamentos vão de 5 € a 500 €. O Web3alert usa a taxa de referência do BCE para USD, assume 1 USDC = 1 USD e não aplica margem.
2. Antes de assinar, confirme que o URL é exatamente `https://web3alert.io/api/billing/wallet/x402-topup`, a rede é Base (`eip155:8453`) e o ativo é USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`). Pare se uma verificação falhar. Envie a chave e a assinatura do pagamento apenas para esse URL. Use o seu cliente x402 v2 e a sua carteira e envie o corpo cotado por `POST` com a credencial Bearer e a assinatura do pagamento em `PAYMENT-SIGNATURE`.
3. Se a API devolver `202`, repita o pedido um número limitado de vezes com o mesmo corpo e a mesma assinatura no mesmo espaço. Se continuar pendente, pare e guarde o `topupId` para o operador reconciliar o pagamento. Não autorize outro pagamento para o mesmo fim. Aguarde que o [carregamento](api-billing.md#post-api-billing-wallet-x402-topup) seja liquidado e creditado no saldo antes de comprar.
4. Chame `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"first-plan-001"})` com `spend` e saldo suficiente. Pode comprar Advanced ou Pro por 1, 3, 6 ou 12 meses sem renovação automática. Ao repetir a compra, reutilize o `requestId` e os parâmetros. Um plano ativo com renovação automática devolve `key_not_allowed`. Um checkout pendente ou plano superior ativo também pode bloquear a compra com `api_error` e a mensagem da API. Peça ao titular da conta para resolver primeiro o plano ou checkout existente.

## 4. Crie a sua primeira subscrição

Escolha um webhook HTTPS público ou, em Advanced e Pro, a caixa de entrada do espaço de trabalho. Para adicionar um webhook, criar uma subscrição ou consultar a caixa de entrada ou o histórico de entregas, precisa da função `owner` ou `admin`.

Se `create_subscription` terminar sem resposta, chame `list_subscriptions` antes de repetir o pedido. A repetição pode criar uma segunda subscrição.

### Entrega por webhook

Nesta sessão de exemplo, substitua os valores entre parênteses angulares pelos resultados das chamadas anteriores. Substitua o URL de exemplo pelo URL HTTPS de um webhook que controla, sem nome de utilizador ou palavra-passe. Escolha um gatilho de eventos e forneça os `inputs` obrigatórios que `get_trigger` indicar. O exemplo parte de um gatilho sem entradas obrigatórias.

1. `get_account({})` → A conta, o plano, o espaço de trabalho atual, o saldo da carteira em EUR, os limites do plano e as contagens de subscrições, quando disponíveis.
2. `find_triggers({"kind":"event","limit":5})` → Gatilhos correspondentes do catálogo publicado e do seu espaço de trabalho, com o `fullname` de cada um.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → Entradas de execução do gatilho, campos do evento e campos disponíveis para filtrar.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → `fullname`, nome e URL do webhook registado. O segredo de assinatura só aparece na resposta de `add_webhook` como `signingSecret`. Substituí-lo mais tarde altera o segredo para todos os recetores desse endpoint. Guarde o segredo para o seu recetor.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → ID, título, estado resultante, gatilho e webhook da subscrição.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Resultados de entrega e `nextCursor` se houver mais resultados. O histórico de alertas usa o plano da primeira conta com a função de proprietário na lista de acesso do espaço de trabalho. Se essa conta não existir, a API verifica o plano da conta que faz o pedido. Se esse plano não incluir histórico, a ferramenta devolve `not_in_plan`.

   Se o cursor não conseguir avançar porque 500 ou mais entregas têm a mesma marca temporal, a ferramenta devolve `api_error`. Restrinja o filtro, por exemplo por estado, e comece de novo sem o cursor.

Confirme que o `state` devolvido para a subscrição é `on`. A partir daí, podem chegar os eventos correspondentes. Use um nome de webhook novo ou procure um já registado com `list_webhooks`.

### Corpo do webhook

O seu webhook recebe um corpo JSON com um ID de evento. Os novos webhooks recebem entregas assinadas, e o Web3alert volta a tentar automaticamente as entregas nos casos previstos. Consulte [Webhooks](webhooks.md) para ver o formato do corpo e saber como verificar assinaturas, lidar com novas tentativas e evitar duplicados.

### Entrega na caixa de entrada

Localize o trigger, consulte os valores de entrada com `get_trigger` e chame `create_subscription({"trigger":"<trigger-fullname>","inbox":true,"state":"on"})`. Inclua os `inputs` obrigatórios. A ferramenta aceita um destino por chamada e cria ou reutiliza a caixa de entrada do espaço de trabalho.

Chame `read_events({})` para começar pelo evento retido mais antigo. Continue enquanto `hasMore` for verdadeiro e passe `nextCursor` como `after` quando tiver um valor, no mesmo espaço. `gap: true` indica eventos guardados anteriormente que faltam antes do primeiro resultado após o cursor ou entre resultados da mesma página. Uma página vazia também pode indicar uma lacuna se já não estiverem retidos eventos posteriores ao cursor. Use `get_delivery_log` para eventos não entregues quando o histórico estiver disponível. Use o `id` para eliminar duplicados.

O plano do proprietário do espaço determina se os eventos são guardados e durante quanto tempo. Se não houver proprietário, aplica-se o plano de quem criou a subscrição. Advanced retém até **7 dias ou 25 000 eventos** e Pro até **30 dias ou 100 000 eventos**. Planos sem histórico de alertas não guardam eventos. A criação e a leitura da caixa usam o plano do proprietário ou, se este não existir, o de quem faz o pedido. Se esse plano não incluir histórico, devolvem `not_in_plan`.

Enquanto o plano aplicável não incluir histórico de alertas, a API recusa gravações na caixa de entrada. Cinco eventos consecutivos por entregar à caixa bloqueiam a subscrição. Depois de restaurar um plano pago, verifique o estado com `list_subscriptions` e reative as subscrições bloqueadas com `set_subscription_state` e `state: "on"`. Confirme que é devolvido `on`.

## 5. Crie um trigger

Em Advanced ou Pro, ligue o cliente a `https://web3alert.io/mcp/agent/build` com o mesmo cabeçalho Bearer. O servidor gera o trigger a partir de um ABI EVM, um IDL Solana ou metadados Substrate, sem precisar de escrever código.

1. Use `find_contract` com uma cadeia da plataforma e o endereço do contrato, o programa Solana ou o pallet Substrate. Em `chain`, use um nome curto como `ethereum`, `base`, `arbitrum-one`, `polkadot` ou `solana`, ou use `common.<chain>` ou `common.source.<chain>`. Se a cadeia for desconhecida, procure os nomes disponíveis após `Supported:` no erro.

   Para EVM, `recentBlocks` indica quantos blocos recentes são abrangidos pelo `recentCount` de cada evento, até 1 000. O intervalo pode ser menor se o fornecedor recusar uma consulta ampla. O valor `null` indica que não foi possível ler nenhum bloco.
2. Envie a mesma cadeia e o mesmo alvo, juntamente com a assinatura exata do evento, para `plan_trigger`. Guarde o `draftId`. O rascunho expira após sete dias.
3. Execute `test_trigger` com o rascunho. Deixe o servidor procurar uma amostra recente ou indique um bloco ou slot. Continue quando o último resultado for `matched`.

   Se uma pesquisa EVM tiver lido alguns intervalos de logs, uma recusa ou um erro do runtime sem causa específica em intervalos mais antigos pode terminar com `no_match`. O resultado só abrange os intervalos lidos. Se souber que o evento ocorreu, passe o seu `block` a `test_trigger`. Tempos limite, falhas de transporte e pesquisas que não conseguiram ler nenhum intervalo devolvem `retryable`. Pode dispensar a pesquisa com um `block` recente para EVM ou Substrate.

4. Chame `activate_trigger` com o `draftId` e um `requestId` seu. Reutilize este último ao repetir o pedido. O trigger fica guardado no projeto privado do agente no espaço de trabalho. Passe o fullname devolvido a `create_subscription`. Se outro membro criou o projeto de agente no espaço, a ativação usa o plano do criador para verificar as unidades de triggers. Devolve `plan_required` se esse plano já não permitir gerir triggers.

`find_contract` e `test_trigger` usam `read`. O planeamento e a ativação usam `manage`. Consulte a [referência das ferramentas de criação](mcp-server.md#build-endpoint).

## Limites

O plano Free limita a conta a **5 subscrições ativas que tenha criado para projetos que não sejam Free**, somadas entre todos os espaços de trabalho. As subscrições de projetos Free ficam fora do limite.

Em Free, uma subscrição que entrega apenas a webhooks integrados permite por predefinição um pico de 12 alertas, uma taxa sustentada de 1 alerta por segundo e um limite de fila de 15. Estas subscrições não consomem a quota de entrega do espaço de trabalho.

Free permite 60 pedidos por minuto à API externa. Os testes de subscrições e o histórico de alertas estão disponíveis em Advanced e Pro. Para ambos, a API verifica o plano do primeiro proprietário do espaço de trabalho e aplica a alternativa descrita no passo 6. Consulte as tabelas completas em [Limites](limits.md).

Por predefinição, o servidor MCP permite 120 chamadas a ferramentas por conta e por minuto. Os três endpoints partilham este limite em cada processo do servidor. `get_account` devolve o plano da conta e os mesmos [limites do plano](api-account.md#me-limits) que `GET /api/me`. O valor de `limits` na ferramenta é `null` quando a API não fornece os limites do plano. O MCP pode usar a resposta de `/me` em cache durante até 30 segundos, pelo que uma alteração de plano pode demorar esse tempo a aparecer em `get_account`.

## Referências legíveis por máquinas

- [llms.txt](https://web3alert.io/llms.txt) com dados de ligação e ligações para a documentação.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) para a API HTTP destinada a agentes.
