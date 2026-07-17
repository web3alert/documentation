# Trigger Import API

Endpoints Trigger Import помогают сгенерировать trigger drafts из внешних описаний: EVM ABI, Substrate metadata/pallets, Solana IDL и source metadata.

## POST /api/triggers/import/evm

Загружает и нормализует EVM ABI entries.

Аргументы: нет.

Тело запроса: input для EVM ABI import. Обычно содержит ABI JSON или ABI entries.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | EVM source name/fullname. |
| `contract` | Обязательно, если нет `abi` | Адрес contract. |
| `abi` | Обязательно, если нет `contract` | ABI JSON string. |

Ответ: [EvmAbiImportResult](types.md#evmabiimportresult).

Этот endpoint только возвращает ABI import entries и не сохраняет triggers.
Выбранные drafts сохраняются отдельно через `PUT /api/triggers/:fullname`.

## POST /api/triggers/import/evm/abi

Пытается загрузить ABI по адресу contract.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `source` | Да | EVM source name/fullname. |
| `contract` | Да | Адрес EVM contract. |

Ответ: [EvmAbiResult](types.md#evmabiresult).

## POST /api/triggers/import/evm/drafts

Генерирует EVM trigger drafts из ABI.

Аргументы: нет.

Тело запроса: конфигурация EVM import из import wizard.

Общие поля:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | EVM source name/fullname. |
| `category` | Нет | Category для сгенерированных triggers. |
| `contract` | Нет | Адрес contract. |
| `abi` | Нет | ABI JSON string. |
| `abiSourceOverride` | Нет | `provided` или `auto`. |
| `includeEvents` | Нет | Генерировать ли event triggers. |
| `includeCalls` | Нет | Генерировать ли call/transaction triggers. |

Ответ: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/hypercore/drafts

Генерирует HyperCore trigger drafts из выбранных runtime source и actions.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Fullname project. |
| `source` | Да | HyperCore runtime source. |
| `actionTypes` | Нет | Типы action, которые нужно включить. |

Ответ содержит массив `drafts`.

## POST /api/triggers/import/solana/idl

Пытается загрузить Solana IDL по Program ID.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `source` | Да | Solana source name/fullname. |
| `programId` | Да | Public key Solana program. |

Ответ: Solana IDL metadata object с `source`, `programId`, адресом IDL/metadata account и `idl`.

## POST /api/triggers/import/solana/drafts

Генерирует Solana trigger drafts из IDL.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | Solana source name/fullname. |
| `programId` | Да | Public key Solana program. |
| `idl` | Да | Solana IDL JSON object или string. |
| `category` | Нет | Category для сгенерированных triggers. |
| `includeEvents` | Нет | Включать ли program events. |
| `includeCalls` | Нет | Включать ли instructions/calls. |

Ответ: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/substrate/drafts

Генерирует Substrate trigger drafts из metadata/pallet selection.

Аргументы: нет.

Тело запроса: конфигурация Substrate import из import wizard.

Общие поля:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | Substrate source name/fullname. |
| `pallets` | Один из вариантов | Выбранные pallets/modules. |
| `entries` | Один из вариантов | Выбранные entries: `{ pallet, kind, name }`, где `kind` равен `event` или `call`. |
| `includeEvents` | Нет | Включать ли events в pallet import. |
| `includeCalls` | Нет | Включать ли calls в pallet import. |
| `defaultsTemplate` | Нет | Override object для defaults template. |
| `metaTemplate` | Нет | Override object для metadata template. |
| `labelsTemplate` | Нет | Override object для labels template. |
| `executionPolicy` | Нет | Execution policy override для сгенерированных drafts. |

Ответ: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## GET /api/triggers/substrate/source

Возвращает Substrate source info, которое использует import wizard.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Тело запроса: нет.

Ответ: [SubstrateSourceInfo](types.md#substratesourceinfo).

## GET /api/triggers/substrate/pallets

Возвращает список Substrate pallets для выбранного source.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Тело запроса: нет.

Ответ: [SubstratePalletSummary[]](types.md#substratepalletsummary).

## GET /api/triggers/substrate/pallet

Возвращает metadata конкретного Substrate pallet.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Тело запроса: нет.

Ответ: [SubstratePalletMetadata](types.md#substratepalletmetadata).
