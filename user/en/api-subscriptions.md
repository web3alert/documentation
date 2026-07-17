# Subscriptions API

Subscription endpoints manage workspace subscriptions, their state, testing, and delivery logs.

## GET /api/subscriptions

Returns subscriptions for the current workspace/account.

Arguments: none. The list is filtered by the backend using the current selected workspace.

Payload: none.

Response: [SubscriptionView[]](types.md#subscriptionview).

## POST /api/subscriptions

Creates a subscription directly by rules or by template.

Arguments: none.

Payload for direct trigger subscription:

| Field | Required | Description |
| --- | --- | --- |
| `template` | No | Usually `null` or omitted in direct mode. |
| `rules` | Yes | Array of rules. At least one rule is required. |
| `rules[].trigger` | Yes | Trigger fullname. |
| `rules[].conditions` | Yes | Conditions object for rule filtering. |
| `resources` | Yes | Array of resource fullnames. |
| `actions` | No | Delivery actions. |
| `meta.title` | No | Subscription title. |
| `state` | No | `on` or `off`. |

Payload for template subscription:

| Field | Required | Description |
| --- | --- | --- |
| `template.id` | Yes | Template id. |
| `template.inputs` | Yes | Values for template input schema. |
| `template.topics` | Yes | Selected topic names. |
| `resources` | Yes | Array of resource fullnames. |
| `actions` | No | Delivery actions. |
| `meta.title` | No | Subscription title. |
| `state` | No | `on` or `off`. |

Response: [SubscriptionView](types.md#subscriptionview).

## GET /api/subscriptions/:id

Returns a subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: none.

Response: [SubscriptionView](types.md#subscriptionview).

## PUT /api/subscriptions/:id

Updates a subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: same shape as `POST /api/subscriptions`.

Response: [SubscriptionView](types.md#subscriptionview).

## DELETE /api/subscriptions/:id

Deletes a subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## PUT /api/subscriptions/:id/state

Changes subscription state.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `state` | Yes | Desired subscription state: `on` or `off`. |

Response:

| Field | Required | Description |
| --- | --- | --- |
| `state` | Yes | Effective subscription state: `on`, `off`, or `blocked`. |
| `issue` | No | Current-state issue or status reason, when available. |

## POST /api/subscriptions/test

Tests an existing subscription or a draft subscription.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `subscription` | One of | Existing subscription id. |
| `draft` | One of | Draft payload with the same shape as `subscription.save.params`. |
| `ruleIndex` | No | Rule index to test. |
| `mode` | No | `preview` or `send`. |
| `input` | No | Raw source item/test input. |
| `test.source` | No | Source item object. |
| `test.itemIndex` | No | Source item index. |
| `test.match.hash` | No | Existing match hash. |
| `test.match.index` | No | Existing match index. |

Response: [SubscriptionTestResult](types.md#subscriptiontestresult).

## GET /api/subscriptions/alerts/history

Returns subscription logs for the current workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `limit` | Query | `50`, `100`, `250`, or `500`. |
| `status` | Query | `delivered`, `failed`, `rate_limited`, `blocked`. |
| `direction` | Query | `before` or `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: none.

Response: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).

## GET /api/subscriptions/:id/alerts/history

Returns logs for a specific subscription.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Subscription id. |
| `limit` | Query | `50`, `100`, `250`, or `500`. |
| `status` | Query | Optional status filter. |
| `direction` | Query | `before` or `after`. |
| `datetime` | Query | Cursor date-time. |

Payload: none.

Response: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).
