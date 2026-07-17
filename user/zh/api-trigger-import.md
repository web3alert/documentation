# Trigger Import API

Trigger import endpoints 帮助根据外部描述生成 trigger drafts：EVM ABI、Substrate metadata/pallets、Solana IDL 和 source metadata。

## POST /api/triggers/import/evm

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

此 endpoint 只返回 ABI import entries，不会保存 triggers。请另行使用
`PUT /api/triggers/:fullname` 保存选中的 drafts。

## POST /api/triggers/import/evm/abi

尝试按 contract address 加载 ABI。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | 是 | EVM source name/fullname. |
| `contract` | 是 | EVM contract address. |

响应：[EvmAbiResult](types.md#evmabiresult)。

## POST /api/triggers/import/evm/drafts

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

## POST /api/triggers/import/hypercore/drafts

根据所选 runtime source 和 actions 生成 HyperCore trigger drafts。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `project` | 是 | Project fullname。 |
| `source` | 是 | HyperCore runtime source。 |
| `actionTypes` | 否 | 要包含的 action 类型。 |

响应包含 `drafts` 数组。

## POST /api/triggers/import/solana/idl

尝试按 Program ID 加载 Solana IDL。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | 是 | Solana source name/fullname. |
| `programId` | 是 | Solana program public key. |

响应：Solana IDL metadata object，包含 `source`、`programId`、IDL/metadata account address 和 `idl`。

## POST /api/triggers/import/solana/drafts

根据 IDL 生成 Solana trigger drafts。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `project` | 是 | Project fullname. |
| `source` | 是 | Solana source name/fullname. |
| `programId` | 是 | Solana program public key. |
| `idl` | 是 | Solana IDL JSON object 或 string. |
| `category` | 否 | Generated triggers 的 category. |
| `includeEvents` | 否 | 是否包含 program events. |
| `includeCalls` | 否 | 是否包含 instructions/calls. |

响应：[TriggerImportDraftsResult](types.md#triggerimportdraftsresult)。

## POST /api/triggers/import/substrate/drafts

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

## GET /api/triggers/substrate/source

返回 import wizard 使用的 Substrate source info。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: 无。

响应：[SubstrateSourceInfo](types.md#substratesourceinfo)。

## GET /api/triggers/substrate/pallets

返回所选 source 的 Substrate pallets 列表。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: 无。

响应：[SubstratePalletSummary[]](types.md#substratepalletsummary)。

## GET /api/triggers/substrate/pallet

返回指定 Substrate pallet 的 metadata。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: 无。

响应：[SubstratePalletMetadata](types.md#substratepalletmetadata)。
