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

Respuesta: [OperationResult](types.md#operationresult).

## PUT /api/subscriptions/:id/state

Cambia el state de una subscription.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `state` | Sí | `on`, `off` o `blocked`. |
| `issue` | No | Razón legible para humanos del bloqueo/desactivación. |

Respuesta: [SubscriptionView](types.md#subscriptionview).

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
