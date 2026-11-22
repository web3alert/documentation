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

Для прямого удаления требуются права владельца пространства и `manage` для ключей. Если триггер использует активная (`on`) подписка из того же пространства, сервер возвращает `409 trigger_in_use`. При успешном удалении зависимые подписки блокируются, включая подписки из других пространств.

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

Сервер проверяет активные (`on`) подписки в рабочем пространстве каждого триггера. Если один из них используется, возвращается `409 trigger_in_use`. При удалении проекта, пространства или аккаунта затронутые подписки блокируются.

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

## GET /api/template-helpers

Возвращает публичные метаданные helper-функций Handlebars, доступных в defaults trigger и шаблонах actions подписки. Аутентификация не требуется.

Аргументы: нет.

Тело запроса: нет.

Ответ содержит массив `handlebars.helpers`. У каждой helper-функции есть уникальный `name` и `description`; у блочных helpers также указано `block: true`, а helpers с именованными параметрами содержат массив `params` с полями `name` и `type`.

## POST /api/triggers/find-latest-block

Находит latest block/test input для trigger testing.

Аргументы: нет.

Тело запроса: trigger/source-specific search object.

Ответ: [LatestBlockResult](types.md#latestblockresult).

## Сборка триггеров для агентов

Для всех пяти эндпоинтов используйте сессию аккаунта или ключ агента в текущем пространстве. Аккаунту нужен Advanced или Pro, иначе сервер вернёт `403 plan_required`. Поиск и тестирование требуют права просмотра пространства. Планирование, активация и удаление требуют права редактирования.

Если сборка отключена, эндпоинты возвращают HTTP `400` со значением `builder is disabled` в `error.message`.

## POST /api/agent/build/contracts

Для ключей нужно право `read`. Передайте `chain` и одно из полей `address` (EVM), `program` (Solana) или `pallet` (Substrate). Укажите встроенный источник Web3alert коротким именем, например `ethereum`, `base`, `arbitrum-one`, `polkadot` или `solana`, либо именем в формате `common.<chain>` или `common.source.<chain>`. Для неизвестной сети ответ `404 not_found` содержит в `error.details.chains` короткие имена, поддерживаемые для указанного типа цели. Временный сбой данных сети даёт `503 retryable`.

Контракт EVM без проверенного ABI даёт `404 not_found`. Для программы Solana без IDL или неизвестного паллета Substrate API возвращает `404 not_found`, если среда выполнения указала причину. Если она сообщила только об общей ошибке, API возвращает `503 retryable`. Перегруженный обозреватель также может вернуть `not_found` для ABI. Если контракт в обозревателе верифицирован, повторите запрос через минуту.

Возвращает `{ chain, source, events, recentBlocks, functions? }` с точными сигнатурами событий. Для EVM поле `recentCount` каждого события содержит число логов за последние `recentBlocks` блоков, максимум 1 000. Если провайдер отклоняет запрос по широкому диапазону, API повторяет его по меньшим диапазонам и может вернуть число для меньшего количества блоков. `recentBlocks` равно `null`, если прочитать блоки не удалось, а также для Solana или Substrate. `recentCount` равно `null`, когда подсчёт недоступен или неприменим.

## POST /api/agent/build/drafts

Для ключей нужно право `manage`. Передайте `chain` в одном из форматов [поиска контрактов](#post-api-agent-build-contracts), цель и имя или точную сигнатуру в поле `event`. Можно добавить `title` и `description`. Возвращает `{ draftId, fullnamePreview, inputs, filterable, outputSchema, expiresAt }`. Черновик действует семь дней. Для неизвестной сети API возвращает `404 not_found` с `error.details.chains`. Неизвестное событие также даёт `404 not_found`. Временный сбой данных сети даёт `503 retryable`.

При планировании черновика действуют те же [ошибки поиска схемы контракта](#post-api-agent-build-contracts). Имя перегруженного события даёт HTTP `400`. Передайте точную сигнатуру.

## POST /api/agent/build/drafts/:draftId/test

Для ключей нужно право `read`. Можно передать `block` (EVM или Substrate) или `slot` (Solana). Если опустить оба, поиск выполняется в ограниченном диапазоне недавних блоков или слотов. Возвращает `{ result, block?, slot?, output? }` с результатом `matched`, `no_match`, `invalid` или `retryable`. Для недоступного черновика возвращается `404 not_found`, а для истёкшего черновика, который всё ещё хранится, — `410 draft_expired`.

Передача `slot` для EVM или Substrate либо `block` для Solana возвращает `result: "invalid"`.

Если поиск в EVM уже прочитал часть диапазонов логов, отказ или ошибка среды выполнения без конкретной причины на более старом диапазоне могут завершить поиск с `no_match`. Результат охватывает только прочитанные диапазоны. Если известно, что событие произошло, передайте его `block` в `test_trigger`. Тайм-аут, ошибка соединения или невозможность прочитать любой диапазон дают `retryable`. Для EVM или Substrate можно пропустить поиск, явно указав недавний `block`.

## POST /api/agent/build/drafts/:draftId/activate

Для ключей нужно право `manage`. Передайте `{ requestId }` и сохраните его для повторных запросов. Возвращает `{ trigger, project }` для приватного проекта агента. Если последний тест не дал `matched`, возвращает `409 not_tested`. Ограничения тарифа дают `403 private_project_limit` или `403 trigger_limit`. Ошибки доступности черновика те же, что при тестировании.

При первой успешной активации создаётся приватный проект `agent-triggers`. Если имя занято, к нему добавляется суффикс. Проект входит в лимит приватных проектов аккаунта. На Advanced доступно одно место. Если оно уже занято, создание проекта агента даёт `403 private_project_limit`. Повтор с тем же `requestId` для того же черновика в пространстве возвращает исходный результат. Использование этого ID для другого черновика даёт `409 request_id_conflict`.

Если проект агента в пространстве создал другой участник, при активации учитывается тариф создателя проекта для проверки единиц триггеров. Если этот тариф больше не разрешает управление триггерами, возвращается `plan_required`.

## DELETE /api/agent/build/triggers/:fullname

Для ключей нужно право `manage`. Удаляет триггер из приватного проекта агента. Возвращает `204 No Content`, `404 not_found` для триггера вне проекта или `409 trigger_in_use`, если триггер используется активной (`on`) подпиской в его пространстве.

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
