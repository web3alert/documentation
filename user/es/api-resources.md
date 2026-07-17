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

Los tres endpoints de setup session siguientes solo están disponibles cuando el
setup seguro del destino de Telegram está habilitado en el servidor.

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

Al completarse, el servidor guarda el target confirmado en `data` privado,
establece `ready` en `true` y limpia `remark`. Un controller del workspace
recibe el nombre seguro, el tipo y el topic opcional mediante
`destinationSummary`; el Telegram target id y los datos privados no se exponen.
Usa `destinationSummary`, no `remark`, para mostrar el destino configurado.

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

<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->

Lee el estado de external resource setup mediante la capability del resource.

Seguridad: `:token` es una bearer capability persistente del resource, no el
`setupToken` de un solo uso y 15 minutos de las Telegram setup sessions. Trata
la URL completa como un secreto: envíala solo por HTTPS y no la incluyas en
analytics, logs de aplicaciones, mensajes de soporte ni enlaces que transmitan
el referrer.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `token` | Path | Bearer capability persistente del resource. |

Payload: ninguno.

Respuesta: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Envía el payload de external resource setup mediante la capability del resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `token` | Path | Bearer capability persistente del resource. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `transform` | Sí | Objeto o `null`, resultado transform/setup específico del resource/app. |

Respuesta: [OperationResult](types.md#operationresult).
