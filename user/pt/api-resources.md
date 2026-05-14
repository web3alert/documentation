# Resources API

Os endpoints Resources gerem delivery resources e o fluxo de external setup.

## GET /api/v2/resources

Devolve resources.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: nenhum.

Resposta: [ResourceView[]](types.md#resourceview).

## GET /api/v2/resources/:fullname

Devolve um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Resposta: [ResourceView](types.md#resourceview).

## PUT /api/v2/resources/:fullname

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

## DELETE /api/v2/resources/:fullname

Elimina um resource.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## GET /api/v2/resources/external/:token

Abre external resource setup por token.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload: nenhum.

Resposta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/v2/resources/external/:token

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
