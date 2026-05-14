# Trigger Import API

Trigger import endpoints 帮助根据外部描述生成 trigger drafts：EVM ABI、Substrate metadata/pallets 和 source metadata。

## POST /api/v2/triggers/import/evm

加载并规范化 EVM ABI entries。

Arguments: 无。

Payload: EVM ABI import input。通常包含 ABI JSON 或 ABI entries。

| Field | Required | Description |
| --- | --- | --- |
| `project` | 是 | Project fullname. |
| `source` | 是 | EVM source name/fullname. |
| `contract` | Required if `abi` is missing | Contract address. |
| `abi` | Required if `contract` is missing | ABI JSON string. |

响应：[EvmAbiImportResult](types.md#evmabiimportresult)。

## POST /api/v2/triggers/import/evm/abi

尝试按 contract address 加载 ABI。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | 是 | EVM source name/fullname. |
| `contract` | 是 | EVM contract address. |

响应：[EvmAbiResult](types.md#evmabiresult)。

## POST /api/v2/triggers/import/evm/drafts

根据 ABI 生成 EVM trigger drafts。

Arguments: 无。

Payload: import wizard 中的 EVM import config。

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | 是 | Project fullname. |
| `source` | 是 | EVM source name/fullname. |
| `category` | 否 | Category for generated triggers. |
| `contract` | 否 | Contract address. |
| `abi` | 否 | ABI JSON string. |
| `abiSourceOverride` | 否 | `provided` 或 `auto`。 |
| `includeEvents` | 否 | Whether to generate event triggers. |
| `includeCalls` | 否 | Whether to generate call/transaction triggers. |

响应：[TriggerImportDraftsResult](types.md#triggerimportdraftsresult)。

## POST /api/v2/triggers/import/substrate/drafts

根据 metadata/pallet selection 生成 Substrate trigger drafts。

Arguments: 无。

Payload: import wizard 中的 Substrate import config。

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | 是 | Project fullname. |
| `source` | 是 | Substrate source name/fullname. |
| `pallets` | One of | Selected pallets/modules. |
| `entries` | One of | Selected entries: `{ pallet, kind, name }`, where `kind` is `event` or `call`. |
| `includeEvents` | 否 | Whether pallet import includes events. |
| `includeCalls` | 否 | Whether pallet import includes calls. |
| `defaultsTemplate` | 否 | Defaults template override object. |
| `metaTemplate` | 否 | Metadata template override object. |
| `labelsTemplate` | 否 | Labels template override object. |
| `executionPolicy` | 否 | Execution policy override for generated drafts. |

响应：[TriggerImportDraftsResult](types.md#triggerimportdraftsresult)。

## GET /api/v2/triggers/substrate/source

返回 import wizard 使用的 Substrate source info。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: 无。

响应：[SubstrateSourceInfo](types.md#substratesourceinfo)。

## GET /api/v2/triggers/substrate/pallets

返回所选 source 的 Substrate pallets 列表。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: 无。

响应：[SubstratePalletSummary[]](types.md#substratepalletsummary)。

## GET /api/v2/triggers/substrate/pallet

返回指定 Substrate pallet 的 metadata。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: 无。

响应：[SubstratePalletMetadata](types.md#substratepalletmetadata)。
