# Para agentes

Encontre eventos on-chain descodificados de EVM, Substrate, Solana e HyperCore no catálogo da Web3alert. O seu agente pode usar as [10 ferramentas MCP](mcp-server.md#endpoint-para-agentes) para procurar um gatilho, subscrevê-lo e receber os eventos correspondentes em JSON no seu webhook.

## Em breve

- Início de sessão com carteira para os agentes poderem abrir as suas próprias contas.
- Carregamentos em USDC através de x402.
- Uma caixa de entrada para recuperar eventos perdidos.

## 1. Obtenha um token

Uma pessoa inicia sessão na [Web3alert](https://web3alert.io) e copia o token de acesso pessoal dos [parâmetros da conta](account.md#personal-access-token). Os agentes ainda não podem criar as suas próprias contas. Selecione na aplicação um espaço de trabalho de que seja proprietário ou administrador. Para adicionar um webhook, criar uma subscrição e consultar o histórico de entregas, precisa da função `owner` ou `admin`.

## 2. Ligue o cliente MCP

Use Streamable HTTP em `https://web3alert.io/mcp/agent` e envie `Authorization: Bearer <token>` em cada pedido.

### Claude Code

Atribua o token à variável `WEB3ALERT_TOKEN` no terminal e execute este comando.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

### Claude Desktop e Cursor

Adicione a entrada em `mcpServers` no ficheiro `claude_desktop_config.json` do Claude Desktop (Settings → Developer → Edit Config) ou no ficheiro pessoal `~/.cursor/mcp.json` do Cursor. O exemplo usa a ponte `mcp-remote` através de `npx`. Substitua o valor de exemplo do token.

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

## 3. Crie a sua primeira subscrição

Nesta sessão de exemplo, substitua os valores entre parênteses angulares pelos resultados das chamadas anteriores. Substitua o URL de exemplo pelo URL HTTPS de um webhook que controla, sem nome de utilizador ou palavra-passe. Escolha um gatilho de eventos e forneça os `inputs` obrigatórios que `get_trigger` indicar. O exemplo parte de um gatilho sem entradas obrigatórias.

1. `get_account({})` → A conta, o plano, o espaço de trabalho atual, o saldo da carteira em EUR, os limites do plano e as contagens de subscrições, quando disponíveis.
2. `find_triggers({"kind":"event","limit":5})` → Gatilhos correspondentes do catálogo publicado e do seu espaço de trabalho, com o `fullname` de cada um.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → Entradas de execução do gatilho, campos do evento e campos disponíveis para filtrar.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → `fullname`, nome e URL do webhook registado. Guarde o `signingSecret` devolvido para o seu recetor. A ferramenta devolve-o uma única vez.

   Se perder a resposta de `add_webhook`, chame `list_webhooks`. Se o endpoint existir e não tiver recebido o segredo, use o respetivo `fullname` e o mesmo token para substituir o segredo com [`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret).

5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → ID, título, estado resultante, gatilho e webhook da subscrição.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Resultados de entrega e `nextCursor` se houver mais resultados. O histórico de alertas usa o plano da primeira conta com a função de proprietário na lista de acesso do espaço de trabalho. Se essa conta não existir, a API verifica o plano da conta que faz o pedido. Se esse plano não incluir histórico, a ferramenta devolve `not_in_plan`.

   Se o cursor não conseguir avançar porque 500 ou mais entregas têm a mesma marca temporal, a ferramenta devolve `api_error`. Restrinja o filtro, por exemplo por estado, e comece de novo sem o cursor.

Confirme que o `state` devolvido para a subscrição é `on`. A partir daí, podem chegar os eventos correspondentes. Use um nome de webhook novo ou procure um já registado com `list_webhooks`.

## Corpo do webhook

O seu webhook recebe um corpo JSON com um ID de evento. Os novos webhooks recebem entregas assinadas, e o Web3alert volta a tentar automaticamente as entregas nos casos previstos. Consulte [Webhooks](webhooks.md) para ver o formato do corpo e saber como verificar assinaturas, lidar com novas tentativas e evitar duplicados.

## Limites

O plano Free limita a conta a **5 subscrições ativas que tenha criado para projetos que não sejam Free**, somadas entre todos os espaços de trabalho. As subscrições de projetos Free ficam fora do limite.

O endpoint para agentes cria subscrições que entregam alertas apenas a webhooks. Em Free, cada uma permite por predefinição um pico de 12 alertas, uma taxa sustentada de 1 alerta por segundo e um limite de fila de 15. Estas subscrições não consomem a quota de entrega do espaço de trabalho.

Free permite 60 pedidos por minuto à API externa. Os testes de subscrições e o histórico de alertas estão disponíveis em Advanced e Pro. Para ambos, a API verifica o plano do primeiro proprietário do espaço de trabalho e aplica a alternativa descrita no passo 6. Consulte as tabelas completas em [Limites](limits.md).

Por predefinição, o servidor MCP permite 120 chamadas a ferramentas por conta e por minuto. Os dois endpoints partilham este limite em cada processo do servidor. `get_account` devolve o plano da conta e os mesmos [limites do plano](api-account.md#me-limits) que `GET /api/me`. O valor de `limits` na ferramenta é `null` quando a API não fornece os limites do plano. O MCP pode usar a resposta de `/me` em cache durante até 30 segundos, pelo que uma alteração de plano pode demorar esse tempo a aparecer em `get_account`.

## Referências legíveis por máquinas

- [llms.txt](https://web3alert.io/llms.txt) com dados de ligação e ligações para a documentação.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) para a API HTTP destinada a agentes.
