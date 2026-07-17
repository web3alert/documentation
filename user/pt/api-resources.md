# Resources API

Os endpoints Resources gerem delivery resources e os seus fluxos públicos de
setup. Todas as rotas desta página usam o namespace canónico `/api`.

## GET /api/resources

Devolve resources.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: nenhum.

Resposta: [ResourceView[]](types.md#resourceview).

## GET /api/resources/:fullname

Devolve um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Resposta: [ResourceView](types.md#resourceview).

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

## DELETE /api/resources/:fullname

Elimina um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

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

## GET /api/resources/external/:token

Abre external resource setup por token.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload: nenhum.

Resposta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Envia payload para external resource setup.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `transform` | Sim | Objeto ou `null`, resultado transform/setup específico do resource/app. |

Resposta: [OperationResult](types.md#operationresult).
