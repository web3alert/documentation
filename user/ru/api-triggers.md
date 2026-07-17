# Triggers API

Endpoints Triggers управляют trigger definitions, drafts, bulk operations и test helpers.

## GET /api/triggers

Возвращает triggers с опциональными filters.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `project` | Query | Фильтр по project fullname. |
| `workspace` | Query | Фильтр по workspace fullname. |

Тело запроса: нет.

Ответ: [TriggerView[]](types.md#triggerview).

## GET /api/triggers/:fullname

Возвращает trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса: нет.

Ответ: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname

Создает или полностью сохраняет trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя trigger внутри project. |
| `fullname` | Да | Trigger fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `backend` | Да | Backend object. Обычно `{ type: "sdk", trigger, values }`. |
| `inputs` | Да | Input schema. |
| `meta.title` | Да | Видимое название. |
| `meta.description` | Нет | Описание. |
| `defaults` | Нет | Notification defaults. |
| `triggerSpec` | Нет | Source matching spec или `null`. |
| `providers` | Нет | Массив provider definitions. |
| `filtersSchema` | Нет | Опциональная filters schema. |
| `outputSchema` | Нет | Human/raw output schema. |
| `transform` | Нет | JavaScript transform или `null`. |
| `activation` | Нет | JavaScript activation condition или `null`. |
| `executionPolicy` | Нет | Объект runtime limits override или `null`. |
| `status` | Нет | `{ status, issue, source, updatedAt }`. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |

Ответ: [TriggerDraftView](types.md#triggerdraftview).

## PATCH /api/triggers/:fullname

Частично изменяет trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `set` | Один из вариантов | Объект с dotted paths и значениями для установки. |
| `unset` | Один из вариантов | Массив dotted paths для удаления. |
| `dryRun` | Нет | Если `true`, проверяет patch без сохранения. |

Ответ: [TriggerPatchResult](types.md#triggerpatchresult).

## DELETE /api/triggers/:fullname

Удаляет trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## POST /api/triggers/patch

Массово изменяет несколько triggers.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `items` | Да | Массив `{ fullname, set?, unset? }`. |
| `dryRun` | Нет | Проверить без сохранения. |

Ответ: [TriggerBulkPatchResult](types.md#triggerbulkpatchresult).

## POST /api/triggers/remove

Массово удаляет несколько triggers.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `fullnames` | Да | Массив trigger fullnames. |
| `dryRun` | Нет | Проверить без удаления. |

Ответ: [TriggerBulkRemoveResult](types.md#triggerbulkremoveresult).

## GET /api/triggers/:fullname/draft

Возвращает draft view trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса: нет.

Ответ: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname/draft

Сохраняет draft trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса: такая же структура, как в `PUT /api/triggers/:fullname`.

Ответ: [TriggerDraftView](types.md#triggerdraftview).

## POST /api/triggers/:fullname/draft/validate

Проверяет draft trigger без финального сохранения.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Тело запроса: такая же структура, как у payload сохранения trigger.

Ответ: [TriggerValidationResult](types.md#triggervalidationresult).

## GET /api/triggers/:fullname/logs

Возвращает агрегированные ошибки delivery и события source pressure для trigger.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname trigger. |
| `limit` | Query | Опциональное максимальное число записей. |
| `status` | Query | Опциональный фильтр по статусу delivery. |
| `direction` | Query | Опциональное направление пагинации: `before` или `after`. |
| `datetime` | Query | ISO timestamp, используемый вместе с `direction`. |

Тело запроса: нет.

Ответ содержит данные trigger, статистику subscriptions и нормализованные логи.

## POST /api/triggers/:fullname/reset-test-status

Сбрасывает статус тестирования trigger в `not_tested`.

Аргументы: `fullname` в path.

Тело запроса: нет.

Ответ: [TriggerPatchResult](types.md#triggerpatchresult).

## POST /api/triggers/preview

Проверяет definitions providers, выполняет опциональную activation и raw/human
transforms над переданным input, затем валидирует полученный output. Trigger при
этом не сохраняется.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `providers` | Да | Provider definitions. |
| `activation` | Нет | JavaScript activation condition или `null`. |
| `transform` | Да | JavaScript transform object. |
| `input` | Да | Source item/input для preview. |
| `inputs` | Нет | Значения trigger inputs. |
| `providersData` | Нет | Заранее вычисленные provider values для activation и transforms. |
| `outputSchema` | Нет | Output schema для валидации результата preview. |

Ответ: [TriggerPreviewResult](types.md#triggerpreviewresult).

## POST /api/triggers/test

Тестирует trigger definition на sample source item.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `providers` | Да | Provider definitions. |
| `transform` | Да | JavaScript transform. |
| `outputSchema` | Да | Output schema. |
| `activation` | Нет | Activation condition. |
| `inputs` | Нет | Значения inputs. |
| `input` | Один из вариантов | Direct test input. |
| `test` | Один из вариантов | Test source/match object. |

Ответ: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/test-block

Тестирует trigger на конкретном block.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `providers` | Да | Provider definitions. |
| `transform` | Да | JavaScript transform. |
| `outputSchema` | Да | Output schema. |
| `block` | Да | Номер block. |
| `itemIndex` | Нет | Индекс source item внутри block. |
| `activation` | Нет | Activation condition. |
| `filtersSchema` | Нет | Filters schema. |
| `inputs` | Нет | Значения inputs. |

Ответ: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/providers/test

Тестирует один provider.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `triggerSpec` | Да | Source matching spec. |
| `provider` | Да | Provider definition. |
| `project` | Нет | Project fullname. |
| `workspace` | Нет | Workspace fullname. |
| `templateValues` | Нет | Template values для provider placeholders. |

Ответ: [ProviderTestResult](types.md#providertestresult).

## GET /api/triggers/hypercore/actions

Возвращает каталог HyperCore actions, доступный trigger builder.

Аргументы: нет.

Тело запроса: нет.

Ответ содержит массив `actions`.

## GET /api/triggers/runtime-sources

Возвращает runtime data sources, доступные для trigger builder.

Аргументы: нет.

Тело запроса: нет.

Ответ: [RuntimeSource[]](types.md#runtimesource).

## POST /api/triggers/find-latest-block

Находит latest block/test input для trigger testing.

Аргументы: нет.

Тело запроса: trigger/source-specific search object.

Ответ: [LatestBlockResult](types.md#latestblockresult).

## Trigger Spec

`triggerSpec` описывает source matching.

Поддерживаемые варианты:

| Тип | Обязательные поля | Опциональные поля |
| --- | --- | --- |
| `evm_log` | `type`, `dataSource` | `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput` |
| `evm_transaction` | `type`, `dataSource` | `testInput` |
| `substrate_event` | `type`, `dataSource` | `pallet`, `event`, `testInput` |
| `solana_event` | `type`, `dataSource` | `programId`, `event`, `idl`, `testInput` |
| `timer` | `type`, `interval` | `testInput` |

## Provider Definition

У каждого provider есть `id`, `type`, опциональный `weight`, опциональный `timeoutMs` и опциональный `outputSchema`.

Поддерживаемые типы providers:

| Тип | Обязательные поля | Основные опциональные поля |
| --- | --- | --- |
| `http` | `id`, `type`, `url` | `method`, `headers`, `queryParams`, `body` |
| `graphql` | `id`, `type`, `url`, `query` | `headers`, `variables` |
| `rpc` with `transport: "endpoint"` | `id`, `type`, `url`, `method` | `headers`, `params`, `body` |
| `rpc` with `transport: "source"` | `id`, `type`, `transport`, `method` | `params` |
| `substrate_storage` | `id`, `type`, `module`, `entry` | `source`, `args`, `block` |
| `evm_read` | `id`, `type`, `contract`, `method`, `abiFragment` | `source`, `abiContract`, `args` |
| `solana_account` | `id`, `type`, `account` | `source`, `idl`, `programId`, `accountName`, `pda` |
| `state_window` | `id`, `type`, `dedupeBy`, `value`, `keepLast` | `partitionBy`, `valueType`, `aggregate` |
| `javascript` | `id`, `type`, `source` | `variables` |
