# Resources API

Los endpoints Resources gestionan delivery resources y sus flujos públicos de
setup. Todas las rutas de esta página usan el namespace canónico `/api`.

Los recursos webhook incluyen `signing: { enabled: boolean, createdAt: string | null }` en la lista, en la vista de un recurso y en la respuesta de PUT. `enabled` indica si la firma está habilitada. `createdAt` indica cuándo se creó el secreto de firma actual, o es `null` si el webhook no está firmado.

Al transferir un proyecto a otro espacio de trabajo, se eliminan los secretos de firma de los webhooks transferidos con el proyecto. Esos webhooks muestran `signing.enabled: false`. Quien controle el nuevo espacio de trabajo puede [generar un secreto nuevo](#post-api-resources-fullname-signing-secret) para cada webhook transferido.

## GET /api/resources

Devuelve resources.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Query | Filtro opcional por workspace fullname. |
| `project` | Query | Filtro opcional por project fullname. |

Payload: ninguno.

Respuesta: [ResourceView[]](types.md#resourceview).

Con una clave de agente sin `manage`, la respuesta omite los tokens de escritura de recursos externos.

## GET /api/resources/:fullname

Devuelve un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Respuesta: [ResourceView](types.md#resourceview).

Con una clave de agente sin `manage`, la respuesta omite los tokens de escritura de recursos externos.

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

Al crear un webhook, la respuesta también devuelve `signingSecret` una sola vez. Las actualizaciones de recursos existentes devuelven solo la vista del recurso.

## POST /api/resources/:fullname/signing-secret

Genera un secreto de firma para un webhook sin firma o sustituye el secreto existente. El solicitante debe tener control sobre el espacio de trabajo del recurso.

Devuelve `signingSecret` una sola vez y `createdAt` como marca de tiempo ISO. Consulta [Webhooks](webhooks.md) para saber cuándo entra en vigor el nuevo secreto.

Estos errores de rotación devuelven HTTP `400` con un cuerpo JSON con el formato `{ "error": { "message": "..." } }`.

| Mensaje | Cuándo se devuelve |
| --- | --- |
| `access denied` | El solicitante no tiene control sobre el espacio de trabajo del recurso. |
| `resource not found` | El recurso no existe. |
| `not a webhook resource` | El recurso no es un webhook. |

## DELETE /api/resources/:fullname

Elimina un resource.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: ninguno.

Requiere una sesión o clave con `manage` y control del espacio del recurso. Devuelve `204 No Content`. Al eliminar un webhook, devuelve `409 webhook_in_use` si una suscripción activa (`on`) del mismo espacio le envía eventos. Las suscripciones activas a la bandeja no impiden eliminar el recurso de bandeja de entrada.

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

## PUT /api/inbox

Requiere una sesión o clave de agente con `manage`, además de control del espacio. No requiere cuerpo. Devuelve `{ fullname, retention: { days, maxEvents } }`. Los reintentos devuelven la misma bandeja. Si otro recurso ocupa el fullname, devuelve `409 resource_name_in_use`.

Usa el fullname como `values.inbox` en la acción de suscripción `common.builtin.inbox`. La creación y la lectura comprueban el plan del propietario del espacio, o el del solicitante si no hay propietario. Ambas devuelven `403 not_in_plan` si ese plan no incluye historial.

El almacenamiento y la retención siguen el plan del propietario del espacio o el de quien creó la suscripción si no hay propietario. Si ese plan no incluye historial de alertas, no se guardan eventos. Consulta [Límites](limits.md).

Sin historial de alertas en el plan aplicable, la API rechaza las escrituras de la bandeja. Esos eventos no aparecen en `read_events` ni en el historial de entregas. Cinco eventos consecutivos sin entregar a la bandeja bloquean la suscripción. Restaura el plan de pago del propietario del espacio o, si no hay propietario, el de quien creó la suscripción para reanudar las entregas. Comprueba el estado con `list_subscriptions` y usa `set_subscription_state` con `state: "on"` para las suscripciones bloqueadas. Confirma que devuelve `on`. Solo se reanuda la entrega de eventos futuros.

## GET /api/events

Requiere una sesión o una clave de agente con `read`, control del espacio y la misma comprobación de plan que la creación de la bandeja. Los parámetros `after` (cursor opaco) y `limit` (1–500, 100 por defecto) son opcionales. La primera lectura empieza en el evento conservado más antiguo. El cursor solo funciona en su espacio original. Un cursor vacío, con caracteres no admitidos o de más de 256 caracteres devuelve HTTP `400` con `invalid request` en `error.message`. Otros cursores inválidos, incluidos los de otro espacio, devuelven HTTP `400` con `invalid inbox cursor` en `error.message`.

Devuelve `{ events, nextCursor, hasMore, gap }`. Cada evento contiene `cursor`, `id`, `receivedAt`, `subscription`, `trigger` y `body`. Los cuerpos de más de 64 KB se guardan con `truncated: true` y sin `object`.

Pasa `nextCursor` como `after` para seguir leyendo. Una página vacía devuelve el cursor enviado o `null` si lo omitiste. `gap: true` indica huecos en eventos previamente guardados, entre el cursor y el primer resultado o entre eventos de la misma página. Con un cursor, una página vacía también puede indicar un hueco si se habían guardado eventos posteriores que caducaron o se eliminaron. Consulta el [historial de entregas](api-subscriptions.md) para ver los eventos no entregados cuando haya historial.

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
