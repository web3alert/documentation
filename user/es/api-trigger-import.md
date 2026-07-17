# Trigger Import API

Trigger import endpoints ayudan a generar trigger drafts desde descripciones externas: EVM ABI, Substrate metadata/pallets, Solana IDL y source metadata.

## POST /api/triggers/import/evm

Carga y normaliza EVM ABI entries.

Arguments: ninguno.

Payload: EVM ABI import input. Normalmente contiene ABI JSON o ABI entries.

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sí | Project fullname. |
| `source` | Sí | EVM source name/fullname. |
| `contract` | Required if `abi` is missing | Contract address. |
| `abi` | Required if `contract` is missing | ABI JSON string. |

Respuesta: [EvmAbiImportResult](types.md#evmabiimportresult).

Este endpoint solo devuelve ABI import entries. No guarda triggers; los drafts
seleccionados se guardan por separado con `PUT /api/triggers/:fullname`.

## POST /api/triggers/import/evm/abi

Intenta cargar ABI por contract address.

Arguments: ninguno.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | Sí | EVM source name/fullname. |
| `contract` | Sí | EVM contract address. |

Respuesta: [EvmAbiResult](types.md#evmabiresult).

## POST /api/triggers/import/evm/drafts

Genera EVM trigger drafts desde ABI.

Arguments: ninguno.

Payload: EVM import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sí | Project fullname. |
| `source` | Sí | EVM source name/fullname. |
| `category` | No | Category for generated triggers. |
| `contract` | No | Contract address. |
| `abi` | No | ABI JSON string. |
| `abiSourceOverride` | No | `provided` o `auto`. |
| `includeEvents` | No | Whether to generate event triggers. |
| `includeCalls` | No | Whether to generate call/transaction triggers. |

Respuesta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/hypercore/drafts

Genera HyperCore trigger drafts desde el runtime source y las actions seleccionadas.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `project` | Sí | Fullname del project. |
| `source` | Sí | Runtime source de HyperCore. |
| `actionTypes` | No | Tipos de action que se incluirán. |

La respuesta contiene un array `drafts`.

## POST /api/triggers/import/solana/idl

Intenta cargar Solana IDL por Program ID.

Cuerpo de request:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `source` | Sí | Solana source name/fullname. |
| `programId` | Sí | Public key del Solana program. |

Respuesta: metadata de Solana IDL con `source`, `programId`, dirección de IDL/metadata account e `idl`.

## POST /api/triggers/import/solana/drafts

Genera Solana trigger drafts desde IDL.

Cuerpo de request:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `project` | Sí | Project fullname. |
| `source` | Sí | Solana source name/fullname. |
| `programId` | Sí | Public key del Solana program. |
| `idl` | Sí | Solana IDL JSON object o string. |
| `category` | No | Category para los triggers generados. |
| `includeEvents` | No | Incluir program events. |
| `includeCalls` | No | Incluir instructions/calls. |

Respuesta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/substrate/drafts

Genera Substrate trigger drafts desde metadata/pallet selection.

Arguments: ninguno.

Payload: Substrate import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sí | Project fullname. |
| `source` | Sí | Substrate source name/fullname. |
| `pallets` | One of | Selected pallets/modules. |
| `entries` | One of | Selected entries: `{ pallet, kind, name }`, where `kind` is `event` or `call`. |
| `includeEvents` | No | Whether pallet import includes events. |
| `includeCalls` | No | Whether pallet import includes calls. |
| `defaultsTemplate` | No | Defaults template override object. |
| `metaTemplate` | No | Metadata template override object. |
| `labelsTemplate` | No | Labels template override object. |
| `executionPolicy` | No | Execution policy override for generated drafts. |

Respuesta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## GET /api/triggers/substrate/source

Devuelve Substrate source info usada por import wizard.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: ninguno.

Respuesta: [SubstrateSourceInfo](types.md#substratesourceinfo).

## GET /api/triggers/substrate/pallets

Devuelve lista de Substrate pallets para el source elegido.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: ninguno.

Respuesta: [SubstratePalletSummary[]](types.md#substratepalletsummary).

## GET /api/triggers/substrate/pallet

Devuelve metadata de un Substrate pallet concreto.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: ninguno.

Respuesta: [SubstratePalletMetadata](types.md#substratepalletmetadata).
