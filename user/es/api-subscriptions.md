# Subscriptions API

Los endpoints Subscription gestionan workspace subscriptions, su state, testing y delivery logs.

## GET /api/subscriptions

Devuelve subscriptions del workspace/account actual.

Argumentos: ninguno. El backend filtra la lista por el selected workspace actual.

Payload: ninguno.

Respuesta: [SubscriptionView[]](types.md#subscriptionview).

## POST /api/subscriptions

Crea una subscription directamente por rules o por template.

Argumentos: ninguno.

Payload para direct trigger subscription:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `template` | No | En direct mode normalmente es `null` o se omite. |
| `rules` | Sí | Array de rules. Se requiere al menos una rule. |
| `rules[].trigger` | Sí | Trigger fullname. |
| `rules[].conditions` | Sí | Conditions object para filtrar la rule. |
| `resources` | Sí | Array de resource fullnames. |
| `actions` | No | Delivery actions. |
| `meta.title` | No | Subscription title. |
| `state` | No | `on` o `off`. |

Payload para template subscription:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `template.id` | Sí | Template id. |
| `template.inputs` | Sí | Valores para template input schema. |
| `template.topics` | Sí | Selected topic names. |
| `resources` | Sí | Array de resource fullnames. |
| `actions` | No | Delivery actions. |
| `meta.title` | No | Subscription title. |
| `state` | No | `on` o `off`. |

Respuesta: [SubscriptionView](types.md#subscriptionview).

## GET /api/subscriptions/:id

Devuelve una subscription.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: ninguno.

Respuesta: [SubscriptionView](types.md#subscriptionview).

## PUT /api/subscriptions/:id

Actualiza una subscription.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: misma estructura que `POST /api/subscriptions`.

Respuesta: [SubscriptionView](types.md#subscriptionview).

## DELETE /api/subscriptions/:id

Elimina una subscription.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: ninguno.

Respuesta: `HTTP 204 No Content` con el cuerpo vacío.
<!-- api-contract: response=204; body=empty -->

## PUT /api/subscriptions/:id/state

Cambia el state de una subscription.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `state` | Sí | Estado deseado de la subscription: `on` o `off`. |

Respuesta:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `state` | Sí | Estado efectivo de la subscription: `on`, `off` o `blocked`. |
| `issue` | No | Incidencia o motivo del estado actual, cuando esté disponible. |

Tras un bloqueo automático por un webhook, al reanudar la suscripción el recuento de eventos consecutivos no entregados para ese webhook empieza en cero.

## POST /api/subscriptions/test

Prueba una subscription existente o una draft subscription.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `subscription` | Uno de | Id de subscription existente. |
| `draft` | Uno de | Draft payload con la misma estructura que `subscription.save.params`. |
| `ruleIndex` | No | Índice de rule para probar. |
| `mode` | No | `preview` o `send`. |
| `input` | No | Raw source item/test input. |
| `test.source` | No | Source item object. |
| `test.itemIndex` | No | Source item index. |
| `test.match.hash` | No | Existing match hash. |
| `test.match.index` | No | Existing match index. |

Respuesta: [SubscriptionTestResult](types.md#subscriptiontestresult).

## GET /api/subscriptions/alerts/history

Devuelve subscription logs del workspace actual.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `limit` | Query | `50`, `100`, `250` o `500`. |
| `status` | Query | `delivered`, `failed`, `rate_limited`, `blocked`. |
| `direction` | Query | `before` o `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: ninguno.

Respuesta: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).

Consulta [Campos de los canales webhook](#webhook-channel-fields).

## GET /api/subscriptions/:id/alerts/history

Devuelve logs de una subscription concreta.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |
| `limit` | Query | `50`, `100`, `250` o `500`. |
| `status` | Query | Filtro opcional por status. |
| `direction` | Query | `before` o `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: ninguno.

Respuesta: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).

Consulta [Campos de los canales webhook](#webhook-channel-fields).

## Campos de los canales webhook {#webhook-channel-fields}

En ambas respuestas de historial, los registros de webhooks en `channels` pueden incluir los siguientes campos.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `eventId` | `string` | ID de la entrega, igual al de la cabecera `webhook-id`. |
| `attempt` | `number` | Número de intento, a partir de `1`. |
| `nextAttemptAt` | `string` | Marca de tiempo ISO para la que se había programado el siguiente intento al guardar el registro. Las rutas REST de historial omiten el campo si el registro no indica un reintento programado. |

La marca de tiempo permanece fija aunque el reintento se ejecute o se cancele. Para conocer el resultado de la entrega, busca un registro posterior con el mismo `eventId`.

El estado del primer registro refleja todos los canales de entrega del evento. Si otro canal entregó el evento y el webhook falló con un error que admite reintento, el registro del evento tiene estado `delivered` y su canal webhook tiene `ok: false`. El campo `reasonCode` del canal webhook del registro del evento indica `channel.webhook.retry_scheduled` si se programa un reintento, o `channel.webhook.retry_queue_full` si la cola de reintentos no puede aceptar la entrega (porque está llena o la entrega en cola, incluidos los datos del evento, supera los 256 KB).

Si la cola de reintentos no puede aceptar la entrega tras un intento posterior, el registro final tiene estado `failed` y muestra `channel.webhook.retry_queue_full` en su canal webhook.
