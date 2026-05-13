# Trigger Import API

Trigger import endpoints помогают сгенерировать trigger drafts из внешних описаний: EVM ABI, Substrate metadata/pallets and source metadata.

## POST /api/v2/triggers/import/evm

Загружает и нормализует EVM ABI entries.

Arguments: нет.

Payload: EVM ABI import input. Обычно содержит ABI JSON или ABI entries.

| Field | Required | Description |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | EVM source name/fullname. |
| `contract` | Required if `abi` is missing | Contract address. |
| `abi` | Required if `contract` is missing | ABI JSON string. |

Response: parsed ABI entries.

## POST /api/v2/triggers/import/evm/abi

Пытается загрузить ABI по contract address.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | Да | EVM source name/fullname. |
| `contract` | Да | EVM contract address. |

Response: ABI JSON or detect/load error.

## POST /api/v2/triggers/import/evm/drafts

Генерирует EVM trigger drafts из ABI.

Arguments: нет.

Payload: EVM import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | EVM source name/fullname. |
| `category` | Нет | Category for generated triggers. |
| `contract` | Нет | Contract address. |
| `abi` | Нет | ABI JSON string. |
| `abiSourceOverride` | Нет | `provided` или `auto`. |
| `includeEvents` | Нет | Whether to generate event triggers. |
| `includeCalls` | Нет | Whether to generate call/transaction triggers. |

Response: generated trigger drafts.

## POST /api/v2/triggers/import/substrate/drafts

Генерирует Substrate trigger drafts из metadata/pallet selection.

Arguments: нет.

Payload: Substrate import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `source` | Да | Substrate source name/fullname. |
| `pallets` | One of | Selected pallets/modules. |
| `entries` | One of | Selected entries: `{ pallet, kind, name }`, where `kind` is `event` or `call`. |
| `includeEvents` | Нет | Whether pallet import includes events. |
| `includeCalls` | Нет | Whether pallet import includes calls. |
| `defaultsTemplate` | Нет | Defaults template override object. |
| `metaTemplate` | Нет | Metadata template override object. |
| `labelsTemplate` | Нет | Labels template override object. |
| `executionPolicy` | Нет | Execution policy override for generated drafts. |

Response: generated trigger drafts.

## GET /api/v2/triggers/substrate/source

Возвращает Substrate source info used by import wizard.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: нет.

Response: source metadata summary.

## GET /api/v2/triggers/substrate/pallets

Возвращает список Substrate pallets для выбранного source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: нет.

Response: array of pallets.

## GET /api/v2/triggers/substrate/pallet

Возвращает metadata конкретного Substrate pallet.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: нет.

Response: pallet events/calls/storage metadata used for draft generation.
