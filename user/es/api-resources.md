# Resources API

Los endpoints Resources gestionan delivery resources y sus flujos públicos de
setup. Todas las rutas de esta página usan el namespace canónico `/api`.

## GET /api/resources

Devuelve resources.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: ninguno.

Respuesta: [ResourceView[]](types.md#resourceview).

## GET /api/resources/:fullname

Devuelve un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Respuesta: [ResourceView](types.md#resourceview).

## PUT /api/resources/:fullname

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

## DELETE /api/resources/:fullname

Elimina un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## POST /api/resources/:fullname/setup-sessions

Inicia una setup session segura para elegir el destino de Telegram. La cuenta
autenticada debe ser propietaria del workspace del resource y el resource debe
usar el blueprint externo de Telegram.

Solo puede haber una setup session activa por resource. Crear una nueva marca
la anterior como `superseded`, sin cambiar el destino actual del resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Fullname del Telegram resource. |

Payload: ninguno.

Respuesta:

| Campo | Descripción |
| --- | --- |
| `id` | ID de la setup session para consultar su estado o cancelarla. |
| `status` | `pending`. |
| `setupToken` | Secreto de un solo uso para abrir el setup flow del bot de Telegram. Solo se devuelve en esta respuesta; no debe registrarse ni guardarse. |
| `expiresAt` | Timestamp ISO. La session y `setupToken` caducan 15 minutos después de crearse. |

El destino existente sigue recibiendo alerts hasta que Telegram confirma el
nuevo destino y la session pasa a `completed`.

## GET /api/resources/:fullname/setup-sessions/:id

Devuelve el estado público de una Telegram destination setup session. La
respuesta nunca incluye `setupToken`.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Fullname del Telegram resource. |
| `id` | Path | ID de la setup session. |

Payload: ninguno.

Respuesta:

| Campo | Descripción |
| --- | --- |
| `id` | ID de la setup session. |
| `resourceFullname` | Fullname del resource. |
| `status` | `pending`, `claimed`, `completed`, `cancelled`, `expired` o `superseded`. |
| `expiresAt` | Timestamp ISO de caducidad. |

## DELETE /api/resources/:fullname/setup-sessions/:id

Cancela una Telegram destination setup session activa. Si el resource ya estaba
configurado, su destino actual no cambia.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Fullname del Telegram resource. |
| `id` | Path | ID de la setup session. |

Payload: ninguno.

Respuesta: respuesta de éxito vacía.

## GET /api/resources/external/:token

Abre external resource setup por token.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `token` | Path | Token de external setup. |

Payload: ninguno.

Respuesta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

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
