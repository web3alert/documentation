# Subscriptions API

Endpoints Subscriptions управляют subscriptions workspace, их состоянием, тестированием и delivery logs.

## GET /api/subscriptions

Возвращает subscriptions текущего workspace/account.

Аргументы: нет. Список фильтруется backend-ом по текущему selected workspace.

Тело запроса: нет.

Ответ: [SubscriptionView[]](types.md#subscriptionview).

## POST /api/subscriptions

Создает subscription напрямую по rules или по template.

Аргументы: нет.

Тело запроса для direct trigger subscription:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `template` | Нет | Для direct mode обычно `null` или отсутствует. |
| `rules` | Да | Массив rules. Минимум одна rule. |
| `rules[].trigger` | Да | Trigger fullname. |
| `rules[].conditions` | Да | Conditions object для фильтрации rule. |
| `resources` | Да | Массив resource fullnames. |
| `actions` | Нет | Delivery actions. |
| `meta.title` | Нет | Название subscription. |
| `state` | Нет | `on` или `off`. |

Тело запроса для template subscription:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `template.id` | Да | Template id. |
| `template.inputs` | Да | Значения для template input schema. |
| `template.topics` | Да | Имена выбранных topics. |
| `resources` | Да | Массив resource fullnames. |
| `actions` | Нет | Delivery actions. |
| `meta.title` | Нет | Название subscription. |
| `state` | Нет | `on` или `off`. |

Ответ: [SubscriptionView](types.md#subscriptionview).

## GET /api/subscriptions/:id

Возвращает subscription.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Тело запроса: нет.

Ответ: [SubscriptionView](types.md#subscriptionview).

## PUT /api/subscriptions/:id

Обновляет subscription.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Тело запроса: такая же структура, как в `POST /api/subscriptions`.

Ответ: [SubscriptionView](types.md#subscriptionview).

## DELETE /api/subscriptions/:id

Удаляет subscription.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## PUT /api/subscriptions/:id/state

Меняет state subscription.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Subscription id. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `state` | Да | `on`, `off` или `blocked`. |
| `issue` | Нет | Человекочитаемая причина блокировки или выключения. |

Ответ: [SubscriptionView](types.md#subscriptionview).

## POST /api/subscriptions/test

Тестирует существующую subscription или draft subscription.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `subscription` | Один из вариантов | Id существующей subscription. |
| `draft` | Один из вариантов | Draft payload в той же структуре, что и `subscription.save.params`. |
| `ruleIndex` | Нет | Индекс rule для тестирования. |
| `mode` | Нет | `preview` или `send`. |
| `input` | Нет | Raw source item/test input. |
| `test.source` | Нет | Объект source item. |
| `test.itemIndex` | Нет | Индекс source item. |
| `test.match.hash` | Нет | Existing match hash. |
| `test.match.index` | Нет | Existing match index. |

Ответ: [SubscriptionTestResult](types.md#subscriptiontestresult).

## GET /api/subscriptions/alerts/history

Возвращает subscriptions logs текущего workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `status` | Query | `delivered`, `failed`, `rate_limited`, `blocked`. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Дата и время cursor. |

Тело запроса: нет.

Ответ: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).

## GET /api/subscriptions/:id/alerts/history

Возвращает logs конкретной subscription.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Subscription id. |
| `limit` | Query | `50`, `100`, `250` или `500`. |
| `status` | Query | Опциональный фильтр по status. |
| `direction` | Query | `before` или `after`. |
| `datetime` | Query | Дата и время cursor. |

Тело запроса: нет.

Ответ: [SubscriptionAlertLog[]](types.md#subscriptionalertlog).
