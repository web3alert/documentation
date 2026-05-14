# Resources API

Los endpoints Resources gestionan delivery resources y el flujo de external setup.

## GET /api/v2/resources

Devuelve resources.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: ninguno.

Respuesta: [ResourceView[]](types.md#resourceview).

## GET /api/v2/resources/:fullname

Devuelve un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Respuesta: [ResourceView](types.md#resourceview).

## PUT /api/v2/resources/:fullname

Crea o actualiza un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Debe coincidir con `payload.fullname`. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Nombre del resource. |
| `fullname` | Sí | Resource fullname. |
| `workspace` | Sí | Workspace fullname. |
| `project` | No | Project fullname, si el resource está vinculado a un project. |
| `blueprint` | Sí | Blueprint fullname que define el comportamiento setup/action. |
| `data` | No | Datos específicos del resource. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta.title` | No | Título visible. |

Respuesta: [ResourceView](types.md#resourceview).

## DELETE /api/v2/resources/:fullname

Elimina un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## GET /api/v2/resources/external/:token

Abre external resource setup por token.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload: ninguno.

Respuesta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/v2/resources/external/:token

Envía payload para external resource setup.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `transform` | Sí | Objeto o `null`, resultado transform/setup específico del resource/app. |

Respuesta: [OperationResult](types.md#operationresult).
