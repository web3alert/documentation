# Resources API

Os endpoints Resources gerem delivery resources e os seus fluxos públicos de
setup. Todas as rotas desta página usam o namespace canónico `/api`.

Os recursos webhook incluem `signing: { enabled: boolean, createdAt: string | null }` na lista, na vista de um recurso e na resposta a PUT. `enabled` indica se a assinatura está ativa. `createdAt` indica quando foi criado o segredo de assinatura atual, ou é `null` se o webhook não estiver assinado.

Transferir um projeto para outro espaço de trabalho remove os segredos de assinatura dos webhooks transferidos com o projeto. Esses webhooks apresentam `signing.enabled: false`. Quem controla o novo espaço de trabalho pode [gerar um novo segredo](#post-api-resources-fullname-signing-secret) para cada webhook transferido.

## GET /api/resources

Devolve resources.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: nenhum.

Resposta: [ResourceView[]](types.md#resourceview).

Se for usada uma chave de agente sem `manage`, a resposta omite os tokens de escrita de recursos externos.

## GET /api/resources/:fullname

Devolve um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Resposta: [ResourceView](types.md#resourceview).

Se for usada uma chave de agente sem `manage`, a resposta omite os tokens de escrita de recursos externos.

## PUT /api/resources/:fullname

Cria ou atualiza um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Nome do resource. |
| `fullname` | Sim | Resource fullname. |
| `workspace` | Sim | Workspace fullname. |
| `project` | Não | Project fullname, se o resource estiver vinculado a um project. |
| `blueprint` | Sim | Blueprint fullname que define o comportamento setup/action. |
| `data` | Não | Dados específicos do resource. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |
| `meta.title` | Não | Título visível. |

Resposta: [ResourceView](types.md#resourceview).

Ao criar um webhook, a resposta devolve também `signingSecret` uma única vez. As atualizações de recursos existentes devolvem apenas a vista do recurso.

## POST /api/resources/:fullname/signing-secret

Gera um segredo de assinatura para um webhook sem assinatura ou substitui o segredo existente. O requerente tem de controlar o espaço de trabalho do recurso.

Devolve `signingSecret` uma única vez e `createdAt` como marca temporal em formato ISO. Consulte [Webhooks](webhooks.md) para saber quando entra em vigor o novo segredo.

Estes erros de substituição do segredo devolvem HTTP `400` com um corpo JSON no formato `{ "error": { "message": "..." } }`.

| Mensagem | Quando é devolvida |
| --- | --- |
| `access denied` | O requerente não controla o espaço de trabalho do recurso. |
| `resource not found` | O recurso não existe. |
| `not a webhook resource` | O recurso não é um webhook. |

## DELETE /api/resources/:fullname

Elimina um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Requer uma sessão ou chave com `manage` e controlo do espaço do recurso. Devolve `204 No Content`. Ao eliminar um webhook, devolve `409 webhook_in_use` se uma subscrição ativa (`on`) no mesmo espaço lhe enviar eventos. As subscrições ativas da caixa de entrada não impedem a remoção do recurso.

Os três endpoints de setup session seguintes só estão disponíveis quando o
setup seguro do destino Telegram está ativado no servidor.

## POST /api/resources/:fullname/setup-sessions

Inicia uma setup session segura para escolher o destino Telegram. A conta
autenticada tem de ser proprietária do workspace do resource e o resource tem
de usar o blueprint externo do Telegram.

Só pode existir uma setup session ativa por resource. Criar uma nova marca a
anterior como `superseded`, sem alterar o destino atual do resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Fullname do Telegram resource. |

Payload: nenhum.

Resposta:

| Campo | Descrição |
| --- | --- |
| `id` | ID da setup session para consultar o estado ou cancelar. |
| `status` | `pending`. |
| `setupToken` | Segredo de utilização única para abrir o setup flow do bot Telegram. Só é devolvido nesta resposta; não deve ser registado nem guardado. |
| `expiresAt` | Timestamp ISO. A session e o `setupToken` expiram 15 minutos depois da criação. |

O destino existente continua a receber alerts até o Telegram confirmar o novo
destino e a session passar a `completed`.

Quando termina, o servidor guarda o target confirmado em `data` privado,
define `ready` como `true` e limpa `remark`. Um controller do workspace recebe
o nome seguro, o tipo e o topic opcional através de `destinationSummary`; o
Telegram target id e os dados privados não são expostos. Usa
`destinationSummary`, não `remark`, para mostrar o destino configurado.

## GET /api/resources/:fullname/setup-sessions/:id

Devolve o estado público de uma Telegram destination setup session. A resposta
nunca contém `setupToken`.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Fullname do Telegram resource. |
| `id` | Path | ID da setup session. |

Payload: nenhum.

Resposta:

| Campo | Descrição |
| --- | --- |
| `id` | ID da setup session. |
| `resourceFullname` | Fullname do resource. |
| `status` | `pending`, `claimed`, `completed`, `cancelled`, `expired` ou `superseded`. |
| `expiresAt` | Timestamp ISO de expiração. |

## DELETE /api/resources/:fullname/setup-sessions/:id

Cancela uma Telegram destination setup session ativa. Se o resource já estiver
configurado, o destino atual não é alterado.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Fullname do Telegram resource. |
| `id` | Path | ID da setup session. |

Payload: nenhum.

Resposta: resposta de sucesso vazia.

## PUT /api/inbox

Requer uma sessão ou chave de agente com `manage`, além de controlo do espaço. Sem corpo de pedido. Devolve `{ fullname, retention: { days, maxEvents } }`. Pedidos repetidos devolvem a mesma caixa. Se outro recurso já usar o fullname, devolve `409 resource_name_in_use`.

Use o fullname como `values.inbox` na ação de subscrição `common.builtin.inbox`. A criação e a leitura verificam o plano do proprietário do espaço, ou de quem faz o pedido quando não há proprietário. Ambas devolvem `403 not_in_plan` se esse plano não incluir histórico.

O armazenamento e a retenção seguem o plano do proprietário ou de quem criou a subscrição quando não há proprietário. Se esse plano não incluir histórico de alertas, não são guardados eventos. Consulte [Limites](limits.md).

## GET /api/events

Requer uma sessão ou chave de agente com `read`, mais controlo do espaço e a mesma verificação do plano que a criação da caixa. Os parâmetros `after` (cursor opaco) e `limit` (1–500, 100 por predefinição) são opcionais. A leitura inicial começa no evento retido mais antigo. O cursor só funciona no seu espaço original. Um cursor de outro espaço ou malformado devolve HTTP `400` com `invalid inbox cursor` em `error.message`.

Devolve `{ events, nextCursor, hasMore, gap }`. Cada evento contém `cursor`, `id`, `receivedAt`, `subscription`, `trigger` e `body`. Um corpo superior a 64 KB é guardado com `truncated: true` e sem `object`.

Passe `nextCursor` como `after` na próxima página ou consulta. Uma página vazia devolve o cursor enviado, ou `null` se este tiver sido omitido. Com um cursor, `gap: true` indica que um ou mais eventos entre o cursor e o primeiro resultado já não estão retidos. Também pode ocorrer numa página vazia se tinham sido guardados eventos posteriores ao cursor.

## GET /api/resources/external/:token

<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->

Lê o estado de external resource setup através da capability do resource.

Segurança: `:token` é uma bearer capability persistente do resource, não o
`setupToken` de utilização única e 15 minutos das Telegram setup sessions.
Trate o URL completo como um segredo: envie-o apenas por HTTPS e não o inclua
em analytics, logs da aplicação, mensagens de suporte ou links que transmitam
o referrer.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `token` | Path | Bearer capability persistente do resource. |

Payload: nenhum.

Resposta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Envia o payload de external resource setup através da capability do resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `token` | Path | Bearer capability persistente do resource. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `transform` | Sim | Objeto ou `null`, resultado transform/setup específico do resource/app. |

Resposta: [OperationResult](types.md#operationresult).
