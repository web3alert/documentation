# Trigger Import API

Trigger import endpoints help generate trigger drafts from external descriptions: EVM ABI, Substrate metadata/pallets, and source metadata.

## POST /api/v2/triggers/import/evm

Loads and normalizes EVM ABI entries.

Arguments: none.

Payload: EVM ABI import input. Usually contains ABI JSON or ABI entries.

| Field | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project fullname. |
| `source` | Yes | EVM source name/fullname. |
| `contract` | Required if `abi` is missing | Contract address. |
| `abi` | Required if `contract` is missing | ABI JSON string. |

Response: [EvmAbiImportResult](types.md#evmabiimportresult).

## POST /api/v2/triggers/import/evm/abi

Tries to load ABI by contract address.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | Yes | EVM source name/fullname. |
| `contract` | Yes | EVM contract address. |

Response: [EvmAbiResult](types.md#evmabiresult).

## POST /api/v2/triggers/import/evm/drafts

Generates EVM trigger drafts from ABI.

Arguments: none.

Payload: EVM import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project fullname. |
| `source` | Yes | EVM source name/fullname. |
| `category` | No | Category for generated triggers. |
| `contract` | No | Contract address. |
| `abi` | No | ABI JSON string. |
| `abiSourceOverride` | No | `provided` or `auto`. |
| `includeEvents` | No | Whether to generate event triggers. |
| `includeCalls` | No | Whether to generate call/transaction triggers. |

Response: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/v2/triggers/import/substrate/drafts

Generates Substrate trigger drafts from metadata/pallet selection.

Arguments: none.

Payload: Substrate import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project fullname. |
| `source` | Yes | Substrate source name/fullname. |
| `pallets` | One of | Selected pallets/modules. |
| `entries` | One of | Selected entries: `{ pallet, kind, name }`, where `kind` is `event` or `call`. |
| `includeEvents` | No | Whether pallet import includes events. |
| `includeCalls` | No | Whether pallet import includes calls. |
| `defaultsTemplate` | No | Defaults template override object. |
| `metaTemplate` | No | Metadata template override object. |
| `labelsTemplate` | No | Labels template override object. |
| `executionPolicy` | No | Execution policy override for generated drafts. |

Response: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## GET /api/v2/triggers/substrate/source

Returns Substrate source info used by import wizard.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: none.

Response: [SubstrateSourceInfo](types.md#substratesourceinfo).

## GET /api/v2/triggers/substrate/pallets

Returns list of Substrate pallets for selected source.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: none.

Response: [SubstratePalletSummary[]](types.md#substratepalletsummary).

## GET /api/v2/triggers/substrate/pallet

Returns metadata of a specific Substrate pallet.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: none.

Response: [SubstratePalletMetadata](types.md#substratepalletmetadata).
