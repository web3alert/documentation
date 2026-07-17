# Trigger Import API

Trigger import endpoints ajudam a gerar trigger drafts a partir de descrições externas: EVM ABI, Substrate metadata/pallets, Solana IDL e source metadata.

## POST /api/triggers/import/evm

Carrega e normaliza EVM ABI entries.

Arguments: nenhum.

Payload: EVM ABI import input. Normalmente contém ABI JSON ou ABI entries.

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sim | Project fullname. |
| `source` | Sim | EVM source name/fullname. |
| `contract` | Required if `abi` is missing | Contract address. |
| `abi` | Required if `contract` is missing | ABI JSON string. |

Resposta: [EvmAbiImportResult](types.md#evmabiimportresult).

Este endpoint apenas devolve ABI import entries. Não guarda triggers; os drafts
selecionados são guardados separadamente com `PUT /api/triggers/:fullname`.

## POST /api/triggers/import/evm/abi

Tenta carregar ABI por contract address.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `source` | Sim | EVM source name/fullname. |
| `contract` | Sim | EVM contract address. |

Resposta: [EvmAbiResult](types.md#evmabiresult).

## POST /api/triggers/import/evm/drafts

Gera EVM trigger drafts a partir de ABI.

Arguments: nenhum.

Payload: EVM import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sim | Project fullname. |
| `source` | Sim | EVM source name/fullname. |
| `category` | Não | Category for generated triggers. |
| `contract` | Não | Contract address. |
| `abi` | Não | ABI JSON string. |
| `abiSourceOverride` | Não | `provided` ou `auto`. |
| `includeEvents` | Não | Whether to generate event triggers. |
| `includeCalls` | Não | Whether to generate call/transaction triggers. |

Resposta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/hypercore/drafts

Gera HyperCore trigger drafts a partir do runtime source e das actions selecionadas.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `project` | Sim | Fullname do project. |
| `source` | Sim | Runtime source HyperCore. |
| `actionTypes` | Não | Tipos de action a incluir. |

A resposta contém um array `drafts`.

## POST /api/triggers/import/solana/idl

Tenta carregar Solana IDL por Program ID.

Corpo do request:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `source` | Sim | Solana source name/fullname. |
| `programId` | Sim | Public key do Solana program. |

Resposta: metadata de Solana IDL com `source`, `programId`, endereço da IDL/metadata account e `idl`.

## POST /api/triggers/import/solana/drafts

Gera Solana trigger drafts a partir de IDL.

Corpo do request:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `project` | Sim | Project fullname. |
| `source` | Sim | Solana source name/fullname. |
| `programId` | Sim | Public key do Solana program. |
| `idl` | Sim | Solana IDL JSON object ou string. |
| `category` | Não | Category para os triggers gerados. |
| `includeEvents` | Não | Incluir program events. |
| `includeCalls` | Não | Incluir instructions/calls. |

Resposta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## POST /api/triggers/import/substrate/drafts

Gera Substrate trigger drafts a partir de metadata/pallet selection.

Arguments: nenhum.

Payload: Substrate import config from import wizard.

Common fields:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Sim | Project fullname. |
| `source` | Sim | Substrate source name/fullname. |
| `pallets` | One of | Selected pallets/modules. |
| `entries` | One of | Selected entries: `{ pallet, kind, name }`, where `kind` is `event` or `call`. |
| `includeEvents` | Não | Whether pallet import includes events. |
| `includeCalls` | Não | Whether pallet import includes calls. |
| `defaultsTemplate` | Não | Defaults template override object. |
| `metaTemplate` | Não | Metadata template override object. |
| `labelsTemplate` | Não | Labels template override object. |
| `executionPolicy` | Não | Execution policy override for generated drafts. |

Resposta: [TriggerImportDraftsResult](types.md#triggerimportdraftsresult).

## GET /api/triggers/substrate/source

Devolve Substrate source info usada pelo import wizard.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: nenhum.

Resposta: [SubstrateSourceInfo](types.md#substratesourceinfo).

## GET /api/triggers/substrate/pallets

Devolve lista de Substrate pallets para o source selecionado.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |

Payload: nenhum.

Resposta: [SubstratePalletSummary[]](types.md#substratepalletsummary).

## GET /api/triggers/substrate/pallet

Devolve metadata de um Substrate pallet específico.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `source` | Query | Substrate data source fullname/name. |
| `pallet` | Query | Pallet/module name. |

Payload: nenhum.

Resposta: [SubstratePalletMetadata](types.md#substratepalletmetadata).
