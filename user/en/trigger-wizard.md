# Add Trigger / Edit Trigger

`Add trigger` opens the detailed trigger creation wizard. This wizard defines the full event lifecycle: from reading source item to final notification defaults.

Editing an existing trigger uses the same wizard, but with already filled values.

If you need to quickly create many similar triggers from ABI or metadata, use [Import triggers](import-triggers.md). It is a simplified bulk scenario built on top of the general trigger creation idea.

## Step 1. Description

At this step, trigger receives a clear name and a short explanation of what it does. This helps later quickly recognize the trigger in the project, templates, subscriptions, and other places where the correct scenario needs to be selected or checked.

### Title

Required visible trigger name. It is shown in the interface wherever the user selects, views, or checks trigger, so it is better to keep it short and clear.

### ID

System trigger slug inside the project. It is generated automatically from the title and shown in the form as a disabled field, so the user can see the future identifier but cannot change it manually.

### Description

Optional trigger description. It is worth enabling when title alone does not make it obvious which event is tracked, which data is used, or in which scenario this trigger is needed.

### Category

Required trigger category. It helps group triggers in tables, templates, and rules so large projects remain understandable and easy to search.

## Step 2. Source

At this step, you choose what starts the trigger: a regular timer or an event from a blockchain data source. The selected type determines the set of following panels.

### Trigger Type

Required selection of the base trigger type.

`timer` is used for regular interval-based activations. `blockchain` is used for events, extrinsics, calls, blocks, or transactions from [Data sources](data-sources.md).

### Timer

#### Interval

Required interval with which the timer trigger should activate.

Interval format: number and time unit, for example:

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Blockchain

#### Source

Required data source selection from which trigger will read blockchain/runtime data.

The list shows project sources that are available. If there is no suitable source, you can go to [Add new source](data-sources.md#add-data-source).

The selected source determines the next configuration branch: EVM, Substrate, or Solana.

### Blockchain - EVM

#### Source Item

Required selection of the data type that trigger receives from EVM source: `event`, `call`, `block`, or `transaction`.

For `event` and `call`, the wizard additionally configures ABI and signature. For `block` and `transaction`, ABI and signature are not required.

#### ABI Contract Address

Contract address by which the wizard tries to load ABI and suggest available events or calls.

If `Use as trigger filter` is enabled, trigger will activate only for this contract address. If the switch is disabled, the address is used only to load ABI, and the trigger itself can match any contract with the selected signature.

#### Event Signature / Call Signature

Required signature of the event or method that should start the trigger.

If ABI is loaded successfully, signature can be selected from the list. If ABI is not found, the contract is dynamic, or the required signature is missing from the list, the value can be entered manually.

### Blockchain - Substrate

#### Source Item

Required selection of Substrate item type: `event`, `call`/`extrinsic`, or `block`.

For `event` and `call`, the wizard additionally suggests selecting pallet and concrete entry. For `block`, pallet and event/extrinsic are not required.

#### Pallet

Required pallet from runtime metadata of the selected Substrate source.

The list is loaded from metadata source. It is available only for `event` and `call`/`extrinsic` selection modes.

#### Event / Extrinsic

Required entry inside the selected pallet.

For `event`, a pallet event is selected. For `call`/`extrinsic`, an extrinsic is selected. The wizard shows runtime version so it is clear which metadata provided the available options.

### Blockchain - Solana

#### Source Item

Required selection of Solana item type: `event` or `call`.

`event` corresponds to a program event decoded from logs. `call` corresponds to a Solana instruction of the selected program. The UI uses the common `call` term to keep one language across source types.

#### Program ID

Required public key of the Solana program.

Program ID is used as the runtime filter: the source looks only for events/instructions of this program.

#### IDL

JSON IDL of the selected program.

The wizard can try to load IDL automatically by Program ID from an Anchor IDL account or Program Metadata. If IDL cannot be loaded automatically, it must be pasted manually. Without IDL, a Solana event/call trigger cannot be created because the source cannot reliably decode payload, arguments, and accounts.

When saving a trigger, the wizard keeps only the IDL fragment needed for the selected event/call and dependent custom types, so the trigger does not have to store the full IDL of the whole program.

#### Event / Call

Required entry from IDL.

For `event`, an event from `events` is selected. For `call`, an instruction from `instructions` is selected. If `call` is selected, accounts from IDL become available as named fields under `source.accounts.*`.

### Types Source

`Types source` is an optional trigger-level setting that tells the wizard where to load the type catalog used by schema fields with type `lookup`.

Lookup fields do not inline the whole nested schema. Instead, they store a reference to a named type from a catalog. When the subscription wizard or trigger editor needs to show fields inside that lookup type, it requests the catalog for the selected trigger and resolves the reference. This is useful for Substrate runtime metadata, Solana IDL custom types, imported catalogs, and other schemas where objects are large, reused in many places, or recursive. Keeping them as lookups avoids copying deep structures into every field and prevents recursive types from expanding endlessly in the UI.

If `Types source` is disabled, the trigger uses the default behavior: the backend first tries trigger-specific types if they exist, then falls back to project/source types when they can be inferred from the selected source. Timer triggers usually have no inferred source, so the catalog is empty unless this setting is enabled.

Available modes:

- `Source node` - choose a data source and use the type catalog imported from that source runtime or metadata.
- `API / imported catalog` - call an HTTP endpoint that returns a type catalog. The endpoint can return a full types list, a `{ schemas: ... }` object, a `{ types: [...] }`/`{ data: [...] }` wrapper, or an imported list of `{ id, schema }` items.
- `Inline / manual` - paste a JSON object where keys are type names and values are JSON Schema-like type definitions.

For dynamic filter controls such as `cascade`, an API catalog can also provide a lookup endpoint. The wizard calls it to load option lists for selected `Lookup ref` values, including dependent lists such as series -> event -> market. The saved subscription condition still stores one normal filter value.

Use this setting when a trigger receives data from one source but its schema editor should resolve lookups from another source, from an imported catalog, or from a manually maintained set of types.

### Source Payload

The selected source item defines the `source.*` structure that will be available later in the wizard: in inputs/templates, providers, activation condition, filters, data transform, and defaults.

#### Timer

| Path | Type | Description |
| --- | --- | --- |
| `source.now` | `string` | ISO timestamp of the current timer run. |
| `source.timestampMs` | `number` | Unix timestamp in milliseconds for the current timer run. |

#### EVM Event

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address that emitted the event. |
| `source.blockNumber` | `number` | Block number where the event was found. |
| `source.blockHash` | `string` | Block hash where the event was found. |
| `source.transactionHash` | `string` | Transaction hash that contained the event. |
| `source.transactionIndex` | `number` | Transaction index inside the block. |
| `source.index` | `number` | Event/log index inside the transaction or block. |
| `source.data` | `string` | Raw encoded event data. |
| `source.topics` | `array<string>` | Topics from EVM log. |
| `source.args` | `array` | Decoded ABI arguments in positional order. If ABI is known, the wizard additionally suggests `source.args[index]` with argument names. |

#### EVM Call

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address linked to the matched call. |
| `source.blockNumber` | `number` | Block number where the call was found. |
| `source.blockHash` | `string` | Block hash where the call was found. |
| `source.transactionHash` | `string` | Transaction hash that contained the call. |
| `source.transactionIndex` | `number` | Transaction index inside the block. |
| `source.index` | `number` | Call/source item index. |
| `source.from` | `address` | Caller address. |
| `source.to` | `address` | Target contract address. |
| `source.data` | `string` | Raw encoded calldata. |
| `source.args` | `array` | Decoded ABI arguments in positional order. If ABI is known, the wizard additionally suggests `source.args[index]` with argument names. |

#### EVM Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Block number. |
| `source.hash` | `string \| null` | Block hash. |
| `source.timestamp` | `number` | Block timestamp. |
| `source.transactionsCount` | `number` | Number of transactions in the block. |
| `source.gasLimit` | `string \| null` | Block gas limit in raw units, if source provides it. |
| `source.gasUsed` | `string \| null` | Gas used by all block transactions, if source provides it. |
| `source.baseFeePerGas` | `string \| null` | Base fee per gas for the block, if source provides it. |
| `source.blobGasUsed` | `string \| null` | Blob gas used by the block, if source provides it. |
| `source.excessBlobGas` | `string \| null` | Excess blob gas of the block, if source provides it. |

#### EVM Transaction

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Block number where the transaction was included. |
| `source.block.hash` | `string \| null` | Block hash where the transaction was included. |
| `source.block.timestamp` | `number` | Block timestamp. |
| `source.index` | `number` | Transaction index inside the block. |
| `source.hash` | `string` | Transaction hash. |
| `source.type` | `string` | Normalized transaction type, for example `legacy` or `eip1559`. |
| `source.from` | `address` | Sender address. |
| `source.to` | `address \| null` | Recipient address or `null` for contract creation. |
| `source.nonce` | `number` | Transaction account nonce. |
| `source.gasLimit` | `string` | Gas limit in raw units. |
| `source.gasPrice` | `string` | Gas price in raw units. |
| `source.maxPriorityFeePerGas` | `string \| null` | EIP-1559 max priority fee, if available. |
| `source.maxFeePerGas` | `string \| null` | EIP-1559 max fee, if available. |
| `source.maxFeePerBlobGas` | `string \| null` | Blob gas fee, if available. |
| `source.input` | `string` | Raw transaction input calldata. |
| `source.value` | `string` | Native token amount in raw base units. |
| `source.methodId` | `string \| null` | First 4 bytes of calldata selector, if present. |

#### Substrate Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Block number where the event was found. |
| `source.block.hash` | `string` | Block hash where the event was found. |
| `source.block.timestamp` | `number` | Block timestamp in milliseconds. |
| `source.index` | `number` | Event index inside the block. |
| `source.module` | `string` | Pallet/module name. |
| `source.event` | `string` | Event name inside pallet. |
| `source.type` | `string \| null` | Event phase type. |
| `source.extrinsic` | `number \| null` | Extrinsic index for `ApplyExtrinsic` events. |
| `source.data` | `array` | Decoded event data in positional order. The wizard additionally suggests `source.data[index]` with argument names from metadata. |

#### Substrate Extrinsic

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Block number where the extrinsic was found. |
| `source.block.hash` | `string` | Block hash where the extrinsic was found. |
| `source.block.timestamp` | `number` | Block timestamp in milliseconds. |
| `source.index` | `number` | Extrinsic index inside the block. |
| `source.module` | `string` | Pallet/module name. |
| `source.call` | `string` | Extrinsic method name. |
| `source.args` | `array` | Decoded extrinsic arguments in positional order. The wizard additionally suggests `source.args[index]` with argument names from metadata. |
| `source.result` | `string \| null` | Execution result of the matched extrinsic. |
| `source.sender` | `address \| null` | Origin account that sent the extrinsic. |
| `source.signature` | `object \| null` | Extrinsic signature data. |
| `source.signature.nonce` | `number` | Nonce from signature. |
| `source.signature.digest` | `string` | Signature digest. |
| `source.path` | `string` | Nested call path for the matched extrinsic. |

#### Substrate Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Block number. |
| `source.hash` | `string` | Block hash. |
| `source.parentHash` | `string` | Parent block hash. |
| `source.timestamp` | `number` | Block timestamp in milliseconds. |
| `source.stateRoot` | `string` | Block state root. |
| `source.extrinsicsRoot` | `string` | Block extrinsics root. |

#### Solana Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot where the event was found. |
| `source.block.hash` | `string \| null` | Block hash for the slot, if available. |
| `source.block.timestamp` | `number \| null` | Block timestamp, if available. |
| `source.transaction.index` | `number` | Transaction index inside the block. |
| `source.transaction.signature` | `string` | Solana transaction signature. |
| `source.transaction.success` | `boolean` | Whether the transaction was successful. Failed transactions are skipped by the source. |
| `source.transaction.error` | `unknown` | Transaction error or `null` for a successful transaction. |
| `source.index` | `number` | Matched event index inside source output. |
| `source.programId` | `address` | Program ID selected in the trigger. |
| `source.event` | `string` | Event name from IDL. |
| `source.data` | `object` | Decoded event data, keyed by field names from IDL. |

#### Solana Call

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot where the instruction was found. |
| `source.block.hash` | `string \| null` | Block hash for the slot, if available. |
| `source.block.timestamp` | `number \| null` | Block timestamp, if available. |
| `source.transaction.index` | `number` | Transaction index inside the block. |
| `source.transaction.signature` | `string` | Solana transaction signature. |
| `source.transaction.success` | `boolean` | Whether the transaction was successful. Failed transactions are skipped by the source. |
| `source.transaction.error` | `unknown` | Transaction error or `null` for a successful transaction. |
| `source.index` | `number` | Matched call index inside source output. |
| `source.programId` | `address` | Program ID selected in the trigger. |
| `source.call` | `string` | Instruction name from IDL. |
| `source.signers` | `array<string>` | Transaction signer addresses for the matched instruction. |
| `source.args` | `object` | Decoded instruction arguments, keyed by arg names from IDL. |
| `source.accounts` | `object` | Instruction account addresses keyed by IDL account name, with token account owner aliases added when available. |
| `source.accountsMeta` | `object` | Token account metadata keyed by IDL account name when available. Metadata fields can include `address`, `owner`, `mint`, `programId`, `decimals`, `rawAmount`, `uiAmount`, and `uiAmountString`. |
| `source.accountsRaw` | `array<string>` | Account addresses in transaction instruction order. |
| `source.path` | `string` | Instruction path, including nested inner instructions. |
| `source.inner` | `boolean` | `true` if the matched instruction was an inner instruction. |

## Step 3. Inputs Schema

`Inputs schema` describes parameters that the user provides when creating a subscription.

Inputs are similar to filters, so they are easy to confuse. The key difference: inputs are required and define base data without which the subscription cannot work. Filters are optional and are used for additional personalization after required inputs are filled.

The editor supports two modes:

- `UI mode` - fields are added through the visual Schema editor;
- `JSON mode` - schema is edited as JSON.

<a id="schema-editor"></a>

### Schema Editor

Schema editor is used in several wizard steps. In `Inputs schema`, it describes fields that the user fills when creating a subscription; in `Filters schema` and `Output schema`, the same editing principle is used.

In `UI mode`, schema consists of properties. Each property can be expanded, collapsed, deleted, and configured through a set of panels.

#### Property

`Name` - technical field name inside schema. It is used in paths, templates, and JavaScript code, so it should be short, stable, and clear. For object properties, name becomes the object key. For array item, name is not used because array describes one common item type.

`Type` - value type. The selected type determines which additional panels appear below.

`Source path` - optional link to the original `source.*` path. It is needed when the schema field is named differently from the source item field, but engine should understand which source value to use for early filtering. Most often `Source path` is needed in filters, sometimes it can be useful in inputs, but it is not used in output schema.

#### Property Types

`string` - string value.

`number` - numeric value.

`boolean` - boolean value `true`/`false`.

`null` - explicit empty value.

`address` - blockchain address. It requires selecting `Address type`: `EVM` or `SS58 (Substrate)`. For SS58 address, `SS58 prefix` can be specified so the interface and downstream logic know the address format.

`object` - object with nested properties. After selecting this type, the `Properties` panel appears and uses the same schema editor inside.

`array` - array of items of one type. After selecting this type, the nested `Item` editor appears, where the type of each array element is defined.

`tuple` - array with a fixed set of positions. After selecting this type, the `Items` panel appears, where each position is described separately.

`balance` and `currency` can appear in imported Substrate schemas as additional hints from the metadata layer. For manual schema description, it is usually easier to think about the actual value type: amount can be `string` or `number`, asset/currency id can also be `string` or `number`. The schema itself does not have to decide how to format the value for notification: raw data comes from source, and the trigger owner performs the needed transformation in transform or providers.

`enum` - set of variants, where each variant has a name and its own type. This type is available in output schema, but disabled for trigger inputs and filters. Inputs and filters need to define a concrete value by which subscription can compare or filter source item; enum variants are too ambiguous for this scenario.

`lookup` - reference to a type from metadata/IDL, for example a Substrate runtime type or a Solana custom defined type. It requires selecting `Lookup ref`. This type is useful when you need to preserve a relation to runtime/source type rather than describe the structure manually.

`cascade` - UI helper for selecting one `string` value through several lookup steps. It is mainly useful for filters where the final value is hard to enter manually but can be found through a sequence, for example choosing a group first and then an item inside that group. Each step has an `ID` and a `Lookup ref`; optional `Label` only affects the subscription wizard UI. Step order defines dependencies automatically: every step after the first is loaded with the previous step value. The trigger schema is still saved as a `string` with `io.ryabina.notify.type: "cascade"`, and subscriptions still store a normal condition on the original filter field.

## Step 4. Data Providers

`Data providers` is an optional step. Providers run from top to bottom and let you enrich source item with external or runtime data before transform.

In templates and provider fields, you can use:

- `{{source.*}}` - data of the source event;
- `{{inputs.*}}` - subscription values;
- `{{providers.providerId.*}}` - result of previous providers.

Each provider has weight. When trigger is saved, the service calculates the total weight of all providers and checks it against the trigger limit. Limits are described in detail in [Limits](./limits.md#provider-weights).

Common fields of each provider:

- `Type` - provider type;
- `ID` - name by which the result is available as `providers.ID`;
- provider test button;
- provider delete button.

All providers use a 10 second timeout.

Available provider types:

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Chain State`;
- `Value history`;
- `JavaScript`.

---

### HTTP <Badge type="info" text="Weight: 2" />

#### Method

HTTP method. Currently selected from supported methods.

#### URL

Endpoint to which provider sends HTTP request.

#### Headers

Key-value list of headers. Values support template substitutions.

#### Query Params

Key-value list of query parameters. Values support template substitutions.

#### Body

Optional JSON/template body for POST request. Body supports template substitutions.

#### Retry until ready

Optional non-blocking readiness polling. Use it when an external API indexes data with a delay: the on-chain event has already arrived, but its metadata appears in the API only a few seconds later. Without retry the provider returns an empty or incomplete response, the transform falls back to placeholder values, and subscription filters on output fields do not match.

When the provider response is "not ready", the execution is parked and automatically retried later. The worker is not blocked while waiting, the event keeps its original identity, and the user receives at most one notification. Retry runs before the transform and before subscription filters, so filters see the enriched data. A trigger waiting for a retry is not considered broken.

Fields:

- `Enabled` - enables retry for the provider;
- `Attempts` - maximum number of retry attempts, from 1 to 20;
- `Delay, ms` - base pause between attempts, from 250 to 60000;
- `Backoff` - how the pause grows: `Fixed` - same pause every time, `Linear` - pause × attempt number, `Exponential` - pause doubles with each attempt;
- `When exhausted` - what to do after attempts run out:
  - `Continue with last response` - continue with the last response as is; the transform applies its own fallback;
  - `Fail the provider` - treat the provider as failed: an `Optional` provider yields an empty result, a required one ends the execution without output;
- `Retry when` - conditions that mark the response as "not ready":
  - `Empty array` - the response is an empty array;
  - `Missing path` - there is no value at `Ready when path`;
  - `HTTP error` - the request failed with a network error or a non-2xx status; without this flag such errors remain regular provider errors;
- `Ready when path` - path to a response field that must be present; segments are dot-separated, array indices are numbers;
- `Equals` - optional value the field at `Ready when path` must equal; supports template substitutions, hex strings are compared case-insensitively.

The provider test performs a single attempt and does not wait for readiness - polling only happens in the runtime.

Configuration example via API/MCP:

```json
{
  "id": "item",
  "type": "http",
  "url": "https://api.example.com/items",
  "queryParams": { "id": "{{ source.args.0 }}" },
  "retry": {
    "attempts": 8,
    "delayMs": 5000,
    "backoff": "linear",
    "retryOn": ["empty_array", "missing_path"],
    "until": { "path": "0.id", "equals": "{{ source.args.0 }}" }
  }
}
```

API/MCP additionally accept `maxDelayMs` (cap for a single pause) and `maxElapsedMs` (total waiting budget); these are not shown in the UI.

---

### GraphQL <Badge type="info" text="Weight: 2" />

#### Endpoint

GraphQL endpoint URL.

#### Headers

Key-value headers. Values support template substitutions.

#### Variables

Key-value variables for GraphQL query. Values support template substitutions.

#### Query

GraphQL query document.

#### Retry until ready

The GraphQL provider supports the retry policy. Fields and behavior are described in [HTTP -> Retry until ready](#retry-until-ready).

---

### Chain State <Badge type="info" text="Weight: 1" />

`Chain State` reads state data from blockchain source and adds the result to provider output.

#### State Type

Read type: `EVM contract`, `Substrate storage`, or `Solana account`.

#### EVM Contract <Badge type="tip" text="state type" />

Executes a view/pure read call of an EVM contract method.

##### Source

EVM source. By default, trigger source is used.

##### Target Contract

Contract address for the actual read-call. Supports template, for example `{{ source.address }}`.

##### ABI Contract Address

Contract address whose ABI should be used to load methods. Needed when target contract is dynamic.

##### Read Method

Read method selection mode: `Auto` or `Manual`.

In `Auto`, the wizard loads view/pure methods from ABI and suggests selecting a method. In `Manual`, signature and ABI fragment can be inserted manually; args and output schema are synchronized from ABI fragment.

##### Method Arguments

Argument fields appear if the selected method accepts args.

#### Substrate Storage <Badge type="tip" text="state type" />

Reads a storage entry from the Substrate runtime.

##### Source

Substrate source. By default, trigger source is used.

##### Module

Pallet/module.

##### Storage Entry

Storage item inside module.

If storage entry has args, the wizard creates a separate panel for each arg. Optional args can be enabled and disabled with the `Optional` switch.

##### Storage Arguments

Argument fields of the selected storage entry.

##### Block

Optional block number/hash/template.

#### Solana Account <Badge type="tip" text="state type" />

Reads a Solana account and decodes its contents.

##### Source

Solana source. By default, trigger source is used.

##### Account

Account public key whose state should be read. The field supports template substitutions, for example `{{ source.accounts.base_mint }}`.

Solana state is stored in accounts. Therefore the provider reads an account through source runtime and tries to decode its contents.

##### IDL

Optional JSON IDL with account definitions.

If IDL is enabled and filled, the provider decodes the account strictly with it. If decoding with manual IDL fails, the provider returns an error and does not switch to automatic recognition.

If IDL is disabled, the provider automatically resolves the schema from account data:

- first it uses `jsonParsed` if Solana RPC returns parsed account data;
- then it tries built-in layouts for common on-chain accounts, for example SPL Token mint/account and Metaplex Metadata;
- if the account owner is a program for which IDL is available, it tries to load IDL automatically through Anchor or Program Metadata and decode the account with it.

Provider result is available as `providers.<id>`. It returns base account fields (`account`, `exists`, `owner`, `lamports`, `executable`, `rentEpoch`, `slot`) and decoded `data` if schema was found.

Solana account provider caches successful results for a short time so several triggers/events reading the same account do not send redundant RPC requests.

---

### Value History <Badge type="info" text="Weight: 1" />

`Value history` stores a window of recent values and calculates aggregates.

#### Partition By

Optional key that splits history into independent windows. For example, if `{{ source.address }}` is specified, provider stores a separate value history for each address instead of one shared history for all source items.

#### Dedupe By

Required unique id of the current item so the same event is not counted twice.

#### Keep Last

Window size.

#### Value Type

Type of value in the window.

#### Value

Value added to history. You can specify a simple template string, for example `{{ source.amount }}`, or a JSON value: object, array, string, number, boolean/null.

Template substitutions can be used inside JSON values. For example, object can combine several source item fields into one value:

```json
{
  "account": "{{ source.account }}",
  "amount": "{{ source.amount }}",
  "asset": "{{ source.asset }}"
}
```

If `Value type` is selected as `number`, the final value must be convertible to a number; for object/array, usually select the corresponding `Value type`.

#### Aggregates

Additional aggregates for numeric values.

---

### RPC <Badge type="info" text="Weight: 1-2" />

Weight: `1` if source runtime transport is used. Weight: `2` if direct endpoint transport is used.

#### Transport

How to send RPC request: through source runtime or through direct endpoint.

If transport goes through source runtime, direct endpoint is not needed.

#### Method

RPC method name.

#### Endpoint

URL, if endpoint transport is selected.

#### Headers

JSON object headers for endpoint transport.

#### Params

JSON array params.

#### Custom Body

Optional full JSON-RPC body for endpoint transport.

#### Retry until ready

The RPC provider supports the retry policy. Fields and behavior are described in [HTTP -> Retry until ready](#retry-until-ready).

---

### JavaScript <Badge type="info" text="Weight: 2" />

#### Variables

Key-value variables for the function.

#### Source

JavaScript function source.

JavaScript provider is used when an additional value is easier to calculate with code based on source, inputs, and previous providers.

---

### Test Provider

Provider has a `Test Provider` dialog.

In it, fill only the template values that provider really uses. Values of previous providers can be passed manually through `providers.*` paths. If provider does not contain template references, the test can be run immediately.

## Step 5. Activation Condition

`Activation condition` is an optional JavaScript condition.

It is enabled with the `Optional` switch. If the condition is disabled, it returns `true` by default: trigger is considered active for all source items that passed source matching.

If the condition is enabled, code must return a value by which engine decides whether to activate further processing. This is useful for logic that cannot be expressed only with filters schema or template rules.

For example, a custom trigger can be based on a source event that technically catches a broad set of events. The source can provide the needed data, but cannot fully describe the business logic of activation: several fields need to be checked, values compared, provider result considered, or some events skipped by an additional rule. In such case, source matching remains broad, and `Activation condition` describes the final condition under which the trigger should actually activate.

## Step 6. Filters Schema

`Filters schema` describes fields by which subscriptions can filter trigger output.

Filters are similar to inputs, but used differently. The user can leave filters empty if the base subscription scenario is enough. If more precise personalization is needed, filters allow narrowing or refining activation conditions.

The editor supports:

- `UI mode`;
- `JSON mode`;
- `Add property`;
- the same [schema editor](#schema-editor) as in `Inputs schema`.

`Source path` is needed when the output field is named differently from the original source item field. Engine applies filters in two stages: early pre-filter by source data and then conditions by formed output. If names differ, specify the path to the original field here.

## Step 7. Output Schema

`Output schema` consists of two panels:

- `Raw output`;
- `Human output`.

`Raw output` describes the machine result of trigger transform. These fields are used in rules, filters, templates, and downstream logic.

`Human output` describes the human-readable result for notifications. It can be:

- left as `Use same as raw`;
- switched off from `Use same as raw` and configured with a custom schema.

Schema editor supports `UI mode` and `JSON mode`.

For `Raw output` and `Human output`, the same [schema editor](#schema-editor) as in `Inputs schema` is used, but without `Source path`: output schema describes the already formed trigger result, not matching by original source item. Unlike inputs and filters, output schema can use `enum`.

## Step 8. Transform

This step starts with `Output mode`.

In `Single output` mode the step contains two JavaScript panels:

- `Raw transform`;
- `Human transform`.

`Raw transform` receives source, inputs, and providers, and returns an object matching `Raw output`.

`Human transform` receives source, inputs, providers, and raw output, and returns an object matching `Human output`.

In `Multi-output` mode the step contains one JavaScript panel, `Output items transform`. It is used when one source tick or provider query can produce several independent alert items. The transform should return:

```js
{
  outputs: [
    {
      raw: { /* fields matching Raw output */ },
      human: { /* fields matching Human output */ },
    },
  ],
}
```

Each item in `outputs` is emitted as a separate trigger output. `Raw output` and `Human output` schemas describe one emitted item, and every item is validated against those schemas.

The editor suggests available context and shows validation error if JavaScript is invalid.

## Step 9. Defaults

`Defaults` defines recommended default notification templates. This is advice from the trigger creator to the user who will create a subscription: how to title the notification, which data to show in short and long text, which icon, cover, or links to use.

These values are not required. When creating a subscription, the user can keep defaults as is or fully override notification appearance and text for their scenario.

All panels are optional and enabled with separate switches.

#### Title

Notification title.

#### Short

Short markdown text.

#### Long

Long markdown text.

#### Icon

Icon URL.

#### Cover

Cover URL.

#### Avatar

Notification avatar URL. By default, the same URL as in `Icon` is used.

#### Links

Array of links.

Each row contains:

- `Title`;
- `Url`;
- delete button;
- `Add item` to add a link.

On save, each link must have both title and URL.

Fields use autocomplete and Handlebars/template helpers. Defaults are rendered from trigger output, so `source`, `inputs`, or `providers` context is not used here.

Autocomplete suggests:

- `block` - block number, if it exists in output;
- `index` - item/event index, if it exists in output;
- `hash` - transaction/block hash, if it exists in output;
- `meta` - trigger metadata: `description`, `name`, `kind`, `scope`;
- `raw.*` - raw output fields;
- `human.*` - human output fields.

#### Handlebars Helpers

Defaults use Handlebars syntax: `{{human.amount}}`, `{{#if human.amount}}...{{/if}}`, `{{round human.price digits=2}}`. General rules for expressions, blocks, paths, and sub-expressions are described in the official Handlebars documentation: [Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html).

##### Built-in Helpers

`if` - conditional block. Renders content if value is not falsy.

`unless` - reverse `if`. Renders content if value is falsy.

`each` - iterates over array/object. Inside the block, you can use `this`, and Handlebars service values like `@index` for array and `@key` for object.

`with` - changes current context inside the block. Useful when you need to reference the same nested object several times.

`lookup` - dynamically takes value by key. Useful when field name or index is stored in another variable.

##### Web3alert Helpers

`round` - rounds a number or numeric string. The `digits` parameter defines number of decimal places; `fixed=true` returns a string with a fixed number of decimal places.

```handlebars
{{round human.price digits=2}}
{{round human.price digits=2 fixed=true}}
```

`format` - formats raw integer amount using token decimals. For example, value `1000000000000000000` with `decimals=18` becomes `1`.

```handlebars
{{format raw.value decimals=18}}
```

`substr` - returns part of a string. `start` defines start position; negative `start` counts from the end of the string; `len` limits length.

```handlebars
{{substr hash start=0 len=10}}
{{substr hash start=-8}}
```

`address` - formats blockchain address for notification. If the address exists in workspace address book, returns alias; otherwise shortens known address to compact form.

```handlebars
{{address raw.from}}
```

`make` - recursively replaces addresses inside object, array, or string with values from address book where possible. Useful for displaying structures with several addresses.

```handlebars
{{yaml (make raw.participants)}}
```

`includes` - checks whether array contains the specified string value. Usually used inside `if`.

```handlebars
{{#if (includes raw.tags "whale")}}Whale transfer{{/if}}
```

`lowercase` - converts string to lowercase.

```handlebars
{{lowercase meta.name}}
```

`uppercase` - converts string to uppercase.

```handlebars
{{uppercase meta.scope}}
```

`titlecase` - converts string to Title Case.

```handlebars
{{titlecase meta.name}}
```

`oneline` - replaces line breaks with spaces.

```handlebars
{{oneline human.summary}}
```

`yaml` - serializes object/array into YAML string.

```handlebars
{{yaml human}}
```

## Step 10. Test & Save

The last step lets you check trigger before saving.

If trigger has inputs schema, test inputs fields are shown first.

For blockchain trigger, specify:

- `Block` - block number for simulation;
- `Item index` - optional item index, if several matching events were found in the block.

For timer trigger, current timestamp is used.

After test run, the interface shows:

- `Valid result` or `Invalid result` status;
- `Source items on block`;
- list of issues, if result is invalid;
- `Source input`;
- `Trigger output`;
- `Debug`.

After a successful check or conscious skip of the check, trigger can be saved. Test run availability can depend on pricing plan/account tier.
