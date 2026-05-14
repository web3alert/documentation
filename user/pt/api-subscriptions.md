# Subscriptions API

Os endpoints Subscription gerem workspace subscriptions, o seu state, testing e delivery logs.

## GET /api/v1/subscriptions

Devolve subscriptions do workspace/account atual.

Argumentos: nenhum. O backend filtra a lista pelo selected workspace atual.

Payload: nenhum.

Resposta: [SubscriptionView[]](types.md#subscriptionview).

## POST /api/v1/subscriptions

Cria uma subscription diretamente por rules ou por template.

Argumentos: nenhum.

Payload para direct trigger subscription:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `template` | Não | Em direct mode normalmente é `null` ou omitido. |
| `rules` | Sim | Array de rules. É exigida pelo menos uma rule. |
| `rules[].trigger` | Sim | Trigger fullname. |
| `rules[].conditions` | Sim | Conditions object para filtrar a rule. |
| `resources` | Sim | Array de resource fullnames. |
| `actions` | Não | Delivery actions. |
| `meta.title` | Não | Subscription title. |
| `state` | Não | `on` ou `off`. |

Payload para template subscription:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `template.id` | Sim | Template id. |
| `template.inputs` | Sim | Valores para template input schema. |
| `template.topics` | Sim | Selected topic names. |
| `resources` | Sim | Array de resource fullnames. |
| `actions` | Não | Delivery actions. |
| `meta.title` | Não | Subscription title. |
| `state` | Não | `on` ou `off`. |

Resposta: [SubscriptionView](types.md#subscriptionview).

## GET /api/v1/subscriptions/:id

Devolve uma subscription.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: nenhum.

Resposta: [SubscriptionView](types.md#subscriptionview).

## POST /api/v1/subscriptions/:id

Atualiza uma subscription.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: mesma estrutura de `POST /api/v1/subscriptions`.

Resposta: [SubscriptionView](types.md#subscriptionview).

## DELETE /api/v1/subscriptions/:id

Elimina uma subscription.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## POST /api/v1/subscriptions/:id/state

Altera o state de uma subscription.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `state` | Sim | `on`, `off` ou `blocked`. |
| `issue` | Não | Motivo legível para humanos do bloqueio/desativação. |

Resposta: [SubscriptionView](types.md#subscriptionview).

## POST /api/v2/subscriptions/test

Testa uma subscription existente ou uma draft subscription.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `subscription` | Um de | Id de subscription existente. |
| `draft` | Um de | Draft payload com a mesma estrutura de `subscription.save.params`. |
| `ruleIndex` | Não | Índice da rule a testar. |
| `mode` | Não | `preview` ou `send`. |
| `input` | Não | Raw source item/test input. |
| `test.source` | Não | Source item object. |
| `test.itemIndex` | Não | Source item index. |
| `test.match.hash` | Não | Existing match hash. |
| `test.match.index` | Não | Existing match index. |

Resposta: [SubscriptionTestResult](types.md#subscriptiontestresult).

## GET /api/v2/subscriptions/alerts/history

Devolve subscription logs do workspace atual.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `limit` | Query | `50`, `100`, `250` ou `500`. |
| `status` | Query | `delivered`, `failed`, `rate_limited`, `blocked`. |
| `direction` | Query | `before` ou `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: nenhum.

Resposta: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).

## GET /api/v2/subscriptions/:id/alerts/history

Devolve logs de uma subscription específica.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Subscription id. |
| `limit` | Query | `50`, `100`, `250` ou `500`. |
| `status` | Query | Filtro opcional por status. |
| `direction` | Query | `before` ou `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: nenhum.

Resposta: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).
