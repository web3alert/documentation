# Subscriptions API

Subscription endpoints управляют workspace subscriptions, их состоянием, тестированием и delivery logs.

## GET /api/v1/subscriptions

Возвращает subscriptions текущего workspace/account.

Arguments: нет. Список фильтруется backend-ом по текущему selected workspace.

Payload: нет.

Response: array of subscription views.

## POST /api/v1/subscriptions

Создает subscription напрямую по rules или по template.

Arguments: нет.

Payload for direct trigger subscription:

| Field | Required | Description |
| --- | --- | --- |
| `template` | Нет | Для direct mode обычно `null` или отсутствует. |
| `rules` | Да | Array of rules. Минимум один rule. |
| `rules[].trigger` | Да | Trigger fullname. |
| `rules[].conditions` | Да | Conditions object для фильтрации rule. |
| `resources` | Да | Array of resource fullnames. |
| `actions` | Нет | Delivery actions. |
| `meta.title` | Нет | Subscription title. |
| `state` | Нет | `on` или `off`. |

Payload for template subscription:

| Field | Required | Description |
| --- | --- | --- |
| `template.id` | Да | Template id. |
| `template.inputs` | Да | Values for template input schema. |
| `template.topics` | Да | Selected topic names. |
| `resources` | Да | Array of resource fullnames. |
| `actions` | Нет | Delivery actions. |
| `meta.title` | Нет | Subscription title. |
| `state` | Нет | `on` или `off`. |

Response: created subscription view.

## GET /api/v1/subscriptions/:id

Возвращает subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: нет.

Response: subscription view.

## POST /api/v1/subscriptions/:id

Обновляет subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: same shape as `POST /api/v1/subscriptions`.

Response: updated subscription view.

## DELETE /api/v1/subscriptions/:id

Удаляет subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: нет.

Response: operation result.

## POST /api/v1/subscriptions/:id/state

Меняет state subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `state` | Да | `on`, `off` или `blocked`. |
| `issue` | Нет | Human-readable block/disable reason. |

Response: updated subscription view.

## POST /api/v2/subscriptions/test

Тестирует существующую subscription или draft subscription.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `subscription` | One of | Existing subscription id. |
| `draft` | One of | Draft payload same as `subscription.save.params`. |
| `ruleIndex` | Нет | Rule index to test. |
| `mode` | Нет | `preview` или `send`. |
| `input` | Нет | Raw source item/test input. |
| `test.source` | Нет | Source item object. |
| `test.itemIndex` | Нет | Source item index. |
| `test.match.hash` | Нет | Existing match hash. |
| `test.match.index` | Нет | Existing match index. |

Response: preview/send test result.

## GET /api/v2/subscriptions/alerts/history

Возвращает subscriptions logs текущего workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `status` | Query | `delivered`, `failed`, `rate_limited`, `blocked`. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: нет.

Response: log entries.

## GET /api/v2/subscriptions/:id/alerts/history

Возвращает logs конкретной subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `status` | Query | Optional status filter. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: нет.

Response: log entries.
