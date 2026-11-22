# Para agentes

Encontre no catálogo do Web3alert eventos on-chain descodificados de redes EVM e Substrate, incluindo Ethereum, Polkadot e Kusama. O seu agente pode usar as [14 ferramentas MCP](mcp-server.md#endpoint-para-agentes) para procurar um gatilho, subscrevê-lo e receber os eventos correspondentes em JSON por webhook ou na caixa de entrada.

## 1. Obtenha uma chave de agente

### Crie uma chave na aplicação

Inicie sessão no [Web3alert](https://web3alert.io), selecione um espaço de trabalho de que seja proprietário ou administrador e crie uma chave na [página Agents](https://web3alert.io/agents). A chave fica associada a esse espaço. Copie o segredo quando aparecer. Só é mostrado uma vez.

Todas as chaves incluem `read`. Adicione `manage` para registar webhooks, criar subscrições ou pedir uma cotação de carregamento. Adicione `spend` para comprar planos com o saldo em EUR. Pode definir um [limite mensal de gastos](limits.md#agent-payments) e uma validade de 30, 90 ou 365 dias. Ambos são opcionais.

Os tokens de sessão existentes continuam a funcionar até o titular terminar a sessão ou os revogar. Use chaves de agente para novas ligações.

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

Cada início de sessão emite uma nova chave para o espaço inicial com as três permissões, sem limite nem validade. Use `secret` como credencial Bearer. Inícios de sessão posteriores reutilizam a conta. `claimUrl` fica a `null` depois de associar um início de sessão do Telegram ou Google.

Partilhe a ligação de reivindicação em privado com a pessoa que vai assumir a conta. A página mostra a carteira, a data de criação da conta e a validade da ligação, e permite iniciar sessão com Telegram ou Google. Em seguida, a página Agents permite ver e controlar as chaves e consultar o plano, o saldo e os gastos. Se o início de sessão já estiver associado a outra conta Web3alert, use um diferente. A ligação mais recente é válida durante sete dias. Pode substituí-la pelo [endpoint de reivindicação](api-account.md#post-api-agent-claim-link).

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

1. Chame `get_topup_requirements({"amountEur":5})` com `manage`. Pode carregar entre 5 € e 500 € em USDC na Base. O Web3alert usa a taxa de referência do BCE para USD, assume 1 USDC = 1 USD e não aplica margem.
2. Pague com o seu cliente x402 v2 e a sua carteira. Envie o `body` devolvido por `POST` para o `url` devolvido, com a credencial Bearer e o pagamento assinado em `PAYMENT-SIGNATURE`. Aguarde até que o [carregamento](api-billing.md#post-api-billing-wallet-x402-topup) seja liquidado e creditado no saldo em EUR.
3. Chame `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"first-plan-001"})` com `spend` e saldo suficiente. Pode comprar Advanced ou Pro por 1, 3, 6 ou 12 meses sem renovação automática. Se repetir o pedido, reutilize o `requestId` e os mesmos parâmetros.

## 4. Crie a sua primeira subscrição

Escolha um webhook HTTPS público ou, em Advanced e Pro, a caixa de entrada do espaço de trabalho. Para adicionar um webhook, criar uma subscrição ou consultar a caixa de entrada ou o histórico de entregas, precisa da função `owner` ou `admin`.

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

Chame `read_events({})` para começar pelo evento retido mais antigo. Guarde `nextCursor` quando tiver um valor e passe-o como `after` na próxima chamada. Continue enquanto `hasMore` for verdadeiro e reutilize o cursor em consultas periódicas. `gap: true` indica que alguns eventos já não estão retidos. Use o `id` para eliminar duplicados.

A retenção segue o plano do proprietário do espaço de trabalho, ou o de quem faz o pedido se o espaço não tiver proprietário. Advanced retém até **7 dias ou 25 000 eventos** e Pro até **30 dias ou 100 000 eventos**. Free devolve `not_in_plan`.

## 5. Crie um trigger

Em Advanced ou Pro, ligue o cliente a `https://web3alert.io/mcp/agent/build` com o mesmo cabeçalho Bearer. O servidor gera o trigger a partir de um ABI EVM, um IDL Solana ou metadados Substrate, sem precisar de escrever código.

1. Use `find_contract` com uma cadeia da plataforma e o endereço do contrato, o programa Solana ou o pallet Substrate. Em `chain`, use um nome curto como `ethereum`, `base`, `arbitrum-one`, `polkadot` ou `solana`, ou use `common.<chain>` ou `common.source.<chain>`. Se a cadeia for desconhecida, procure os nomes disponíveis após `Supported:` no erro.

   Para EVM, `recentBlocks` indica quantos blocos recentes são abrangidos pelo `recentCount` de cada evento, até 1 000. O intervalo pode ser menor se o fornecedor recusar uma consulta ampla. O valor `null` indica que não foi possível ler nenhum bloco.
2. Envie a mesma cadeia e o mesmo alvo, juntamente com a assinatura exata do evento, para `plan_trigger`. Guarde o `draftId`. O rascunho expira após sete dias.
3. Execute `test_trigger` com o rascunho. Deixe o servidor procurar uma amostra recente ou indique um bloco ou slot. Continue quando o último resultado for `matched`.
4. Chame `activate_trigger` com o `draftId` e um `requestId` seu. Reutilize este último ao repetir o pedido. O trigger fica guardado no projeto privado do agente no espaço de trabalho. Passe o fullname devolvido a `create_subscription`.

`find_contract` e `test_trigger` usam `read`. O planeamento e a ativação usam `manage`. Consulte a [referência das ferramentas de criação](mcp-server.md#build-endpoint).

## Limites

O plano Free limita a conta a **5 subscrições ativas que tenha criado para projetos que não sejam Free**, somadas entre todos os espaços de trabalho. As subscrições de projetos Free ficam fora do limite.

Em Free, uma subscrição que entrega apenas a webhooks integrados permite por predefinição um pico de 12 alertas, uma taxa sustentada de 1 alerta por segundo e um limite de fila de 15. Estas subscrições não consomem a quota de entrega do espaço de trabalho.

Free permite 60 pedidos por minuto à API externa. Os testes de subscrições e o histórico de alertas estão disponíveis em Advanced e Pro. Para ambos, a API verifica o plano do primeiro proprietário do espaço de trabalho e aplica a alternativa descrita no passo 6. Consulte as tabelas completas em [Limites](limits.md).

Por predefinição, o servidor MCP permite 120 chamadas a ferramentas por conta e por minuto. Os três endpoints partilham este limite em cada processo do servidor. `get_account` devolve o plano da conta e os mesmos [limites do plano](api-account.md#me-limits) que `GET /api/me`. O valor de `limits` na ferramenta é `null` quando a API não fornece os limites do plano. O MCP pode usar a resposta de `/me` em cache durante até 30 segundos, pelo que uma alteração de plano pode demorar esse tempo a aparecer em `get_account`.

## Referências legíveis por máquinas

- [llms.txt](https://web3alert.io/llms.txt) com dados de ligação e ligações para a documentação.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) para a API HTTP destinada a agentes.
