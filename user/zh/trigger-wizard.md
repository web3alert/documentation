# 添加 Trigger / 编辑 Trigger

`Add trigger` 会打开详细的 trigger 创建向导。这个向导定义事件的完整生命周期：从读取 source item 到最终的通知默认模板。

编辑已有 trigger 使用同一个向导，只是表单会预先填入已有值。

如果需要从 ABI 或 metadata 快速创建大量相似 triggers，请使用 [Import triggers](import-triggers.md)。这是建立在通用 trigger 创建流程之上的简化批量场景。

## Step 1. Description

在这一步，trigger 会获得清晰的名称和简短说明。这样之后在 project、templates、subscriptions 以及其他需要选择或检查场景的位置，都能更快识别它。

### Title

必填的可见 trigger 名称。用户选择、查看或检查 trigger 时都会看到它，因此最好保持简短、清楚。

### ID

project 内部的系统 trigger slug。它会根据 title 自动生成，并以 disabled field 显示在表单中。用户可以看到未来的标识符，但不能手动修改。

### Description

可选的 trigger 描述。当仅靠 title 无法清楚说明追踪哪个事件、使用哪些数据，或在哪个场景下需要这个 trigger 时，建议开启。

### Category

必填的 trigger 分类。它帮助在表格、templates 和 rules 中对 triggers 分组，让大型 project 仍然容易理解和搜索。

## Step 2. Source

在这一步选择什么会启动 trigger：定时器，或来自 blockchain data source 的事件。选择的类型会决定后续面板集合。

### Trigger Type

必填的基础 trigger 类型。

`timer` 用于按固定间隔触发的场景。`blockchain` 用于来自 [Data sources](data-sources.md) 的 events、extrinsics、calls、blocks 或 transactions。

### Timer

#### Interval

trigger 应该触发的必填时间间隔。

间隔格式：数字和时间单位，例如：

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Blockchain

#### Source

必填的数据源选择，trigger 会从这里读取 blockchain/runtime 数据。

列表显示当前 project 可用的 sources。如果没有合适的 source，可以进入 [Add new source](data-sources.md#add-data-source)。

选中的 source 决定下一步配置分支：EVM、Substrate 或 Solana。

### Blockchain - EVM

#### Source Item

必填，选择 trigger 从 EVM source 接收的数据类型：`event`、`call`、`block` 或 `transaction`。

对于 `event` 和 `call`，向导还会配置 ABI 和 signature。对于 `block` 和 `transaction`，不需要 ABI 和 signature。

#### ABI Contract Address

合约地址，向导会尝试通过它加载 ABI 并建议可用的 events 或 calls。

如果开启 `Use as trigger filter`，trigger 只会对这个合约地址触发。如果关闭该开关，这个地址只用于加载 ABI，trigger 本身可以匹配任何具有所选 signature 的合约。

#### Event Signature / Call Signature

必填，选择应启动 trigger 的事件或方法 signature。

如果 ABI 加载成功，可以从列表中选择 signature。如果找不到 ABI、合约是动态的，或列表中缺少需要的 signature，也可以手动输入。

### Blockchain - Substrate

#### Source Item

必填，选择 Substrate item 类型：`event`、`call`/`extrinsic` 或 `block`。

对于 `event` 和 `call`，向导还会建议选择 pallet 和具体 entry。对于 `block`，不需要 pallet 和 event/extrinsic。

#### Pallet

必填，来自所选 Substrate source runtime metadata 的 pallet。

列表从 metadata source 加载。它只在 `event` 和 `call`/`extrinsic` selection modes 下可用。

#### Event / Extrinsic

所选 pallet 内的必填 entry。

对于 `event`，选择 pallet event。对于 `call`/`extrinsic`，选择 extrinsic。向导会显示 runtime version，因此可以清楚知道可用选项来自哪个 metadata。

### Blockchain - Solana

#### Source Item

必填，选择 Solana item 类型：`event` 或 `call`。

`event` 对应从 logs 解码的 program event。`call` 对应所选 program 的 Solana instruction。

#### Program ID

必填的 Solana program public key。

#### IDL

所选 program 的 JSON IDL。Wizard 可以尝试从 Anchor IDL account 或 Program Metadata 自动加载。如果无法自动加载，需要手动粘贴。没有 IDL 时无法可靠创建 Solana event/call trigger。

#### Event / Call

IDL 中的必填 entry。`event` 选择 `events` 中的项；`call` 选择 `instructions` 中的 instruction。Instruction 的 accounts 会作为 `source.accounts.*` 可用。

### Types Source

`Types source` 是 trigger 级别的可选设置。它告诉 wizard 从哪里加载类型目录，这个目录会被 schema 中 `lookup` 类型的字段使用。

Lookup 字段不会把完整的嵌套 schema 直接写进字段里，而是保存一个指向目录中命名类型的引用。当 subscription wizard 或 trigger editor 需要展示这个 lookup 类型内部的字段时，会按当前 trigger 请求类型目录并解析这个引用。这对 Substrate runtime metadata、Solana IDL custom types、导入的 catalogs，以及对象很大、在多处复用或递归的 schemas 很有用。使用 lookup 可以避免把深层结构复制到每个字段中，也能避免递归类型在 UI 中无限展开。

如果关闭 `Types source`，会使用默认行为：backend 会先尝试 trigger-specific types，如果没有，再在可以从所选 source 推断时 fallback 到 project/source types。Timer trigger 通常没有可推断的 source，所以除非启用这个设置，否则目录为空。

可用模式：

- `Source node` - 选择一个 data source，并使用从该 source 的 runtime 或 metadata 导入的类型目录。
- `API / imported catalog` - 调用返回类型目录的 HTTP endpoint。Endpoint 可以返回完整 types 列表、`{ schemas: ... }` 对象、`{ types: [...] }`/`{ data: [...] }` 包装对象，或导入的 `{ id, schema }` item 列表。
- `Inline / manual` - 粘贴一个 JSON object，其中 keys 是类型名称，values 是类似 JSON Schema 的类型定义。

对于 `cascade` 这样的动态 filter control，API catalog 也可以提供 lookup endpoint。Wizard 会调用它，为所选 `Lookup ref` 加载 option 列表，包括 series -> event -> market 这样的依赖列表。保存后的 subscription condition 仍然只保存一个普通 filter value。

当 trigger 从一个 source 接收数据，但 schema editor 需要从另一个 source、导入目录或手动维护的类型集合解析 lookups 时，可以使用这个设置。

### Source Payload

所选 source item 会定义稍后在向导中可用的 `source.*` 结构：inputs/templates、providers、activation condition、filters、data transform 和 defaults 都会用到它。

#### Timer

| Path | Type | Description |
| --- | --- | --- |
| `source.now` | `string` | 当前 timer run 的 ISO 时间戳。 |
| `source.timestampMs` | `number` | 当前 timer run 的 Unix 毫秒时间戳。 |

#### EVM Event

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | 发出事件的合约地址。 |
| `source.blockNumber` | `number` | 找到该事件的区块号。 |
| `source.blockHash` | `string` | 找到该事件的区块 hash。 |
| `source.transactionHash` | `string` | 包含该事件的 transaction hash。 |
| `source.transactionIndex` | `number` | transaction 在区块中的索引。 |
| `source.index` | `number` | event/log 在 transaction 或 block 中的索引。 |
| `source.data` | `string` | 原始编码后的 event data。 |
| `source.topics` | `array<string>` | EVM log topics。 |
| `source.args` | `array` | 按位置顺序解码的 ABI arguments。如果 ABI 已知，向导还会根据 argument names 建议 `source.args[index]`。 |

#### EVM Call

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | 与匹配 call 关联的合约地址。 |
| `source.blockNumber` | `number` | 找到该 call 的区块号。 |
| `source.blockHash` | `string` | 找到该 call 的区块 hash。 |
| `source.transactionHash` | `string` | 包含该 call 的 transaction hash。 |
| `source.transactionIndex` | `number` | transaction 在区块中的索引。 |
| `source.index` | `number` | call/source item 索引。 |
| `source.from` | `address` | 调用者地址。 |
| `source.to` | `address` | 目标合约地址。 |
| `source.data` | `string` | 原始编码后的 calldata。 |
| `source.args` | `array` | 按位置顺序解码的 ABI arguments。如果 ABI 已知，向导还会根据 argument names 建议 `source.args[index]`。 |

#### EVM Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | 区块号。 |
| `source.hash` | `string \| null` | 区块 hash。 |
| `source.timestamp` | `number` | 区块时间戳。 |
| `source.transactionsCount` | `number` | 区块中的 transactions 数量。 |
| `source.gasLimit` | `string \| null` | 如果 source 提供，则为区块 gas limit 的 raw units。 |
| `source.gasUsed` | `string \| null` | 如果 source 提供，则为区块内所有 transactions 使用的 gas。 |
| `source.baseFeePerGas` | `string \| null` | 如果 source 提供，则为该区块的 base fee per gas。 |
| `source.blobGasUsed` | `string \| null` | 如果 source 提供，则为该区块使用的 blob gas。 |
| `source.excessBlobGas` | `string \| null` | 如果 source 提供，则为该区块的 excess blob gas。 |

#### EVM Transaction

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | transaction 被包含的区块号。 |
| `source.block.hash` | `string \| null` | transaction 被包含的区块 hash。 |
| `source.block.timestamp` | `number` | 区块时间戳。 |
| `source.index` | `number` | transaction 在区块中的索引。 |
| `source.hash` | `string` | transaction hash。 |
| `source.type` | `string` | 规范化的 transaction type，例如 `legacy` 或 `eip1559`。 |
| `source.from` | `address` | 发送者地址。 |
| `source.to` | `address \| null` | 接收者地址，合约创建时为 `null`。 |
| `source.nonce` | `number` | transaction account nonce。 |
| `source.gasLimit` | `string` | raw units 中的 gas limit。 |
| `source.gasPrice` | `string` | raw units 中的 gas price。 |
| `source.maxPriorityFeePerGas` | `string \| null` | 如果可用，则为 EIP-1559 max priority fee。 |
| `source.maxFeePerGas` | `string \| null` | 如果可用，则为 EIP-1559 max fee。 |
| `source.maxFeePerBlobGas` | `string \| null` | 如果可用，则为 blob gas fee。 |
| `source.input` | `string` | 原始 transaction input calldata。 |
| `source.value` | `string` | native token amount，raw base units。 |
| `source.methodId` | `string \| null` | 如果存在，则为 calldata selector 的前 4 bytes。 |

#### Substrate Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | 找到该 event 的区块号。 |
| `source.block.hash` | `string` | 找到该 event 的区块 hash。 |
| `source.block.timestamp` | `number` | 毫秒级区块时间戳。 |
| `source.index` | `number` | event 在区块中的索引。 |
| `source.module` | `string` | pallet/module 名称。 |
| `source.event` | `string` | pallet 内的 event 名称。 |
| `source.type` | `string \| null` | event phase type。 |
| `source.extrinsic` | `number \| null` | `ApplyExtrinsic` events 对应的 extrinsic 索引。 |
| `source.data` | `array` | 按位置顺序解码的 event data。向导还会根据 metadata 中的 argument names 建议 `source.data[index]`。 |

#### Substrate Extrinsic

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | 找到该 extrinsic 的区块号。 |
| `source.block.hash` | `string` | 找到该 extrinsic 的区块 hash。 |
| `source.block.timestamp` | `number` | 毫秒级区块时间戳。 |
| `source.index` | `number` | extrinsic 在区块中的索引。 |
| `source.module` | `string` | pallet/module 名称。 |
| `source.call` | `string` | extrinsic method 名称。 |
| `source.args` | `array` | 按位置顺序解码的 extrinsic arguments。向导还会根据 metadata 中的 argument names 建议 `source.args[index]`。 |
| `source.result` | `string \| null` | 匹配 extrinsic 的执行结果。 |
| `source.sender` | `address \| null` | 发送该 extrinsic 的 origin account。 |
| `source.signature` | `object \| null` | extrinsic signature data。 |
| `source.signature.nonce` | `number` | signature 中的 nonce。 |
| `source.signature.digest` | `string` | signature digest。 |
| `source.path` | `string` | 匹配 extrinsic 的 nested call path。 |

#### Substrate Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | 区块号。 |
| `source.hash` | `string` | 区块 hash。 |
| `source.parentHash` | `string` | 父区块 hash。 |
| `source.timestamp` | `number` | 毫秒级区块时间戳。 |
| `source.stateRoot` | `string` | 区块 state root。 |
| `source.extrinsicsRoot` | `string` | 区块 extrinsics root。 |

#### Solana Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | 找到 event 的 slot。 |
| `source.block.hash` | `string \| null` | 该 slot 的 block hash（如果可用）。 |
| `source.block.timestamp` | `number \| null` | Block timestamp（如果可用）。 |
| `source.transaction.index` | `number` | Transaction 在 block 内的索引。 |
| `source.transaction.signature` | `string` | Solana transaction signature。 |
| `source.transaction.success` | `boolean` | Transaction 是否成功。Source 会跳过 failed transactions。 |
| `source.transaction.error` | `unknown` | Transaction error；成功 transaction 为 `null`。 |
| `source.index` | `number` | Matched event 在 source output 内的索引。 |
| `source.programId` | `address` | Trigger 中选择的 Program ID。 |
| `source.event` | `string` | IDL 中的 event name。 |
| `source.data` | `object` | Decoded event data，key 来自 IDL field names。 |

#### Solana Call

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | 找到 instruction 的 slot。 |
| `source.block.hash` | `string \| null` | 该 slot 的 block hash（如果可用）。 |
| `source.block.timestamp` | `number \| null` | Block timestamp（如果可用）。 |
| `source.transaction.index` | `number` | Transaction 在 block 内的索引。 |
| `source.transaction.signature` | `string` | Solana transaction signature。 |
| `source.transaction.success` | `boolean` | Transaction 是否成功。Source 会跳过 failed transactions。 |
| `source.transaction.error` | `unknown` | Transaction error；成功 transaction 为 `null`。 |
| `source.index` | `number` | Matched call 在 source output 内的索引。 |
| `source.programId` | `address` | Trigger 中选择的 Program ID。 |
| `source.call` | `string` | IDL 中的 instruction name。 |
| `source.signers` | `array<string>` | 匹配 instruction 所在 transaction 的 signer 地址。 |
| `source.args` | `object` | Decoded instruction arguments，key 来自 IDL arg names。 |
| `source.accounts` | `object` | Instruction account addresses，按 IDL account name keyed；可用时会添加 token account owner aliases。 |
| `source.accountsMeta` | `object` | Token account metadata，按 IDL account name keyed（可用时）。Metadata fields 可包含 `address`、`owner`、`mint`、`programId`、`decimals`、`rawAmount`、`uiAmount` 和 `uiAmountString`。 |
| `source.accountsRaw` | `array<string>` | 按 transaction instruction 顺序排列的 account addresses。 |
| `source.path` | `string` | Instruction path，包含 nested inner instructions。 |
| `source.inner` | `boolean` | 如果 matched instruction 是 inner instruction，则为 `true`。 |

## Step 3. Inputs Schema

`Inputs schema` 描述用户在创建 subscription 时提供的参数。

Inputs 和 filters 很相似，因此容易混淆。关键区别是：inputs 是必填项，定义没有它 subscription 就无法工作的基础数据。Filters 是可选项，用于在必填 inputs 填好之后进行额外个性化。

编辑器支持两种模式：

- `UI mode` - 通过可视化 Schema editor 添加字段；
- `JSON mode` - 以 JSON 方式编辑 schema。

<a id="schema-editor"></a>

### Schema Editor

Schema editor 会在向导的多个步骤中使用。在 `Inputs schema` 中，它描述用户创建 subscription 时填写的字段；在 `Filters schema` 和 `Output schema` 中，也使用相同的编辑原则。

在 `UI mode` 中，schema 由 properties 组成。每个 property 都可以展开、折叠、删除，并通过一组面板配置。

#### Property

`Name` - schema 内部的技术字段名。它会用于 paths、templates 和 JavaScript code，因此应当简短、稳定且清楚。对于 object properties，name 会成为 object key。对于 array item，name 不会使用，因为 array 描述的是一种通用 item type。

`Type` - value type。所选 type 决定下方会出现哪些额外面板。

`Source path` - 到原始 `source.*` path 的可选链接。当 schema field 的名称不同于 source item field，但 engine 需要知道用哪个 source value 做早期过滤时使用。`Source path` 最常用于 filters，有时也可用于 inputs，但不会用于 output schema。

#### Property Types

`string` - 字符串值。

`number` - 数值。

`boolean` - boolean 值 `true`/`false`。

`null` - 显式空值。

`address` - blockchain address。需要选择 `Address type`：`EVM` 或 `SS58 (Substrate)`。对于 SS58 address，可以指定 `SS58 prefix`，让界面和后续逻辑知道地址格式。

`object` - 包含 nested properties 的对象。选择该类型后，会出现 `Properties` 面板，并在内部使用同一个 schema editor。

`array` - 同一种类型 item 的数组。选择该类型后，会出现嵌套的 `Item` editor，用于定义数组中每个元素的类型。

`tuple` - 具有固定位置集合的数组。选择该类型后，会出现 `Items` 面板，每个位置都单独描述。

`balance` 和 `currency` 可能会作为 metadata layer 的额外提示出现在导入的 Substrate schemas 中。手动描述 schema 时，通常更容易从实际 value type 出发：amount 可以是 `string` 或 `number`，asset/currency id 也可以是 `string` 或 `number`。schema 本身不需要决定通知中如何格式化该值：raw data 来自 source，trigger owner 会在 transform 或 providers 中完成需要的转换。

`enum` - variants 集合，每个 variant 有名称和自己的 type。这个类型可用于 output schema，但在 trigger inputs 和 filters 中禁用。Inputs 和 filters 需要定义一个具体值，用于让 subscription 比较或过滤 source item；enum variants 对这个场景来说过于模糊。

`lookup` - 对 metadata/IDL 类型的引用，例如 Substrate runtime type 或 Solana custom defined type。需要选择 `Lookup ref`。当需要保留与 runtime/source type 的关系，而不是手动描述结构时，这个类型很有用。

`cascade` - UI helper，用多个 lookup 步骤选择一个 `string` value。它适合用于 filters：最终值不适合手动输入，但可以通过一个顺序找到，例如先选择一个 group，再选择该 group 内的 item。每个步骤都有 `ID` 和 `Lookup ref`；可选的 `Label` 只影响 subscription wizard UI。步骤顺序会自动定义依赖关系：第一个步骤之后的每个步骤都会用上一个步骤的值来加载。Trigger schema 中它仍保存为带有 `io.ryabina.notify.type: "cascade"` 的 `string`，subscriptions 仍然在原始 filter field 上保存普通 condition。

## Step 4. Data Providers

`Data providers` 是可选步骤。Providers 会从上到下执行，让你在 transform 之前用外部或 runtime 数据补充 source item。

在 templates 和 provider fields 中，可以使用：

- `{{source.*}}` - source event 的数据；
- `{{inputs.*}}` - subscription values；
- `{{providers.providerId.*}}` - 前面 providers 的结果。

每个 provider 都有 weight。保存 trigger 时，服务会计算所有 providers 的总 weight，并对照 trigger limit 检查。Limits 在 [Limits](./limits.md#provider-weights) 中有详细说明。

每个 provider 的通用字段：

- `Type` - provider type；
- `ID` - 结果作为 `providers.ID` 可用时使用的名称；
- provider test button；
- provider delete button。

所有 providers 都使用 10 秒 timeout。

可用的 provider types：

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Chain State`;
- `Value history`;
- `JavaScript`.

---

### HTTP <Badge type="info" text="Weight: 2" />

#### Method

HTTP method。目前从支持的方法中选择。

#### URL

provider 发送 HTTP request 的 endpoint。

#### Headers

headers 的 key-value 列表。Values 支持 template substitutions。

#### Query Params

query parameters 的 key-value 列表。Values 支持 template substitutions。

#### Body

POST request 的可选 JSON/template body。Body 支持 template substitutions。

#### Retry until ready

可选的非阻塞 readiness 轮询。当外部 API 延迟索引数据时使用：on-chain 事件已经到达，但其元数据要在几秒后才会出现在 API 中。没有 retry 时，provider 会返回空的或不完整的响应，transform 会使用 fallback 值，针对 output 字段的 subscription 过滤器将无法匹配。

当 provider 响应「未就绪」时，执行会被挂起并在稍后自动重试。等待期间 worker 不会被阻塞，事件保持其原始标识，用户最多只会收到一条通知。Retry 在 transform 之前、在 subscription 过滤器之前执行，因此过滤器看到的是已补全的数据。等待 retry 的 trigger 不会被视为 broken。

字段：

- `Enabled` - 为 provider 启用 retry；
- `Attempts` - 最大重试次数，1 到 20；
- `Delay, ms` - 两次尝试之间的基础间隔，250 到 60000；
- `Backoff` - 间隔的增长方式：`Fixed` - 每次相同，`Linear` - 间隔 × 尝试序号，`Exponential` - 每次尝试间隔翻倍；
- `When exhausted` - 尝试用尽后的行为：
  - `Continue with last response` - 按原样使用最后一次响应继续；transform 应用自己的 fallback；
  - `Fail the provider` - 将 provider 视为失败：`Optional` provider 产生空结果，必需的 provider 则结束执行且不产生 output；
- `Retry when` - 将响应标记为「未就绪」的条件：
  - `Empty array` - 响应是空数组；
  - `Missing path` - `Ready when path` 指定的路径上没有值；
  - `HTTP error` - request 因网络错误或非 2xx 状态失败；不开启此项时这些错误仍是普通的 provider 错误；
- `Ready when path` - 响应中必须存在的字段路径；路径段用点分隔，数组索引用数字表示；
- `Equals` - 可选值，`Ready when path` 指定的字段必须与其相等；支持 template substitutions，hex 字符串比较不区分大小写。

Provider 测试只执行一次尝试，不会等待 readiness - 轮询只发生在 runtime 中。

通过 API/MCP 的配置示例：

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

API/MCP 还接受 `maxDelayMs`（单次间隔上限）和 `maxElapsedMs`（总等待预算）；这两个字段不会显示在 UI 中。

---

### GraphQL <Badge type="info" text="Weight: 2" />

#### Endpoint

GraphQL endpoint URL。

#### Headers

key-value headers。Values 支持 template substitutions。

#### Variables

GraphQL query 的 key-value variables。Values 支持 template substitutions。

#### Query

GraphQL query document。

#### Retry until ready

GraphQL provider 支持 retry policy。字段与行为见 [HTTP -> Retry until ready](#retry-until-ready)。

---

### Chain State <Badge type="info" text="Weight: 1" />

`Chain State` 从 blockchain source 读取 state data，并把结果添加到 provider output。

#### State Type

读取类型：`EVM contract`、`Substrate storage` 或 `Solana account`。

#### EVM Contract <Badge type="tip" text="state type" />

执行 EVM 合约方法的 view/pure read call。

##### Source

EVM source。默认使用 trigger source。

##### Target Contract

实际 read-call 的合约地址。支持 template，例如 `{{ source.address }}`。

##### ABI Contract Address

应使用其 ABI 加载 methods 的合约地址。当 target contract 是动态地址时需要填写。

##### Read Method

read method selection mode：`Auto` 或 `Manual`。

在 `Auto` 模式下，向导会从 ABI 加载 view/pure methods，并建议选择一个 method。在 `Manual` 模式下，可以手动插入 signature 和 ABI fragment；args 与 output schema 会从 ABI fragment 同步。

##### Method Arguments

如果所选 method 接受 args，会显示 argument fields。

#### Substrate Storage <Badge type="tip" text="state type" />

从 Substrate runtime 读取 storage entry。

##### Source

Substrate source。默认使用 trigger source。

##### Module

pallet/module。

##### Storage Entry

module 内的 storage item。

如果 storage entry 有 args，向导会为每个 arg 创建单独面板。Optional args 可以通过 `Optional` switch 开启或关闭。

##### Storage Arguments

所选 storage entry 的 argument fields。

##### Block

可选的 block number/hash/template。

#### Solana Account <Badge type="tip" text="state type" />

读取 Solana account 并解码其内容。

##### Source

Solana source。默认使用 trigger source。

##### Account

需要读取 state 的 account public key。支持 templates，例如 `{{ source.accounts.base_mint }}`。

##### IDL

可选的 IDL JSON，包含 account definitions。启用后，provider 会严格按该 IDL 解码。如果禁用，会通过 `jsonParsed`、SPL Token/Metaplex Metadata 等 built-in layouts，或 Anchor/Program Metadata 自动 IDL 来解析 schema。

结果可作为 `providers.<id>` 使用，包含 account 基础字段以及找到 schema 时的 decoded `data`。成功结果会短时间缓存，避免对同一 account 重复发起 RPC requests。

---

### Value History <Badge type="info" text="Weight: 1" />

`Value history` 保存最近 values 的窗口，并计算 aggregates。

#### Partition By

可选 key，用于把 history 拆分为独立窗口。例如指定 `{{ source.address }}` 时，provider 会为每个 address 保存独立的 value history，而不是为所有 source items 共用一个 history。

#### Dedupe By

当前 item 的必填唯一 id，用于避免同一个 event 被重复计数。

#### Keep Last

窗口大小。

#### Value Type

窗口中 value 的类型。

#### Value

添加到 history 的 value。可以指定简单 template string，例如 `{{ source.amount }}`，也可以指定 JSON value：object、array、string、number、boolean/null。

JSON values 内部可以使用 template substitutions。例如 object 可以把多个 source item fields 合并成一个 value：

```json
{
  "account": "{{ source.account }}",
  "amount": "{{ source.amount }}",
  "asset": "{{ source.asset }}"
}
```

如果 `Value type` 选择为 `number`，最终值必须能转换为数字；对于 object/array，通常选择对应的 `Value type`。

#### Aggregates

numeric values 的额外 aggregates。

---

### RPC <Badge type="info" text="Weight: 1-2" />

Weight: 如果使用 source runtime transport，则为 `1`。如果使用 direct endpoint transport，则为 `2`。

#### Transport

发送 RPC request 的方式：通过 source runtime，或通过 direct endpoint。

如果 transport 通过 source runtime，direct endpoint 不需要填写。

#### Method

RPC method name。

#### Endpoint

选择 endpoint transport 时使用的 URL。

#### Headers

endpoint transport 的 JSON object headers。

#### Params

JSON array params。

#### Custom Body

endpoint transport 的可选完整 JSON-RPC body。

#### Retry until ready

RPC provider 支持 retry policy。字段与行为见 [HTTP -> Retry until ready](#retry-until-ready)。

---

### JavaScript <Badge type="info" text="Weight: 2" />

#### Variables

function 的 key-value variables。

#### Source

JavaScript function source。

当额外 value 更容易基于 source、inputs 和 previous providers 用代码计算时，可以使用 JavaScript provider。

---

### Test Provider

Provider 有 `Test Provider` dialog。

在其中只填写该 provider 实际使用的 template values。前面 providers 的 values 可以通过 `providers.*` paths 手动传入。如果 provider 不包含 template references，可以立即运行测试。

## Step 5. Activation Condition

`Activation condition` 是可选 JavaScript condition。

它通过 `Optional` switch 开启。如果 condition 关闭，默认会返回 `true`：trigger 会对所有通过 source matching 的 source items 视为 active。

如果 condition 开启，代码必须返回一个值，engine 会据此决定是否继续激活后续处理。这适合那些无法只靠 filters schema 或 template rules 表达的逻辑。

例如，自定义 trigger 可能基于一个技术上会捕获较宽泛事件集合的 source event。source 可以提供所需数据，但无法完整描述 activation 的业务逻辑：需要检查多个字段、比较值、考虑 provider result，或通过额外规则跳过某些 events。在这种情况下，source matching 保持宽泛，而 `Activation condition` 描述 trigger 实际应当触发的最终条件。

## Step 6. Filters Schema

`Filters schema` 描述 subscriptions 可以用来过滤 trigger output 的字段。

Filters 和 inputs 很相似，但使用方式不同。如果基础 subscription 场景已经足够，用户可以让 filters 为空。如果需要更精确的个性化，filters 可以缩小或细化 activation conditions。

编辑器支持：

- `UI mode`;
- `JSON mode`;
- `Add property`;
- 与 `Inputs schema` 相同的 [schema editor](#schema-editor)。

当 output field 的名称与原始 source item field 不同时，需要使用 `Source path`。Engine 会分两阶段应用 filters：先按 source data 做早期 pre-filter，再按形成后的 output 做 conditions。如果名称不同，请在这里指定原始字段路径。

## Step 7. Output Schema

`Output schema` 由两个面板组成：

- `Raw output`;
- `Human output`.

`Raw output` 描述 trigger transform 的机器结果。这些字段会用于 rules、filters、templates 和后续逻辑。

`Human output` 描述通知的人类可读结果。它可以：

- 保持为 `Use same as raw`;
- 从 `Use same as raw` 切换关闭，并配置自定义 schema。

Schema editor 支持 `UI mode` 和 `JSON mode`。

对于 `Raw output` 和 `Human output`，使用与 `Inputs schema` 相同的 [schema editor](#schema-editor)，但没有 `Source path`：output schema 描述的是已经形成的 trigger result，而不是按原始 source item 进行 matching。不同于 inputs 和 filters，output schema 可以使用 `enum`。

## Step 8. Transform

这一步从 `Output mode` 开始。

在 `Single output` 模式中，这一步包含两个 JavaScript 面板：

- `Raw transform`;
- `Human transform`.

`Raw transform` 接收 source、inputs 和 providers，并返回匹配 `Raw output` 的 object。

`Human transform` 接收 source、inputs、providers 和 raw output，并返回匹配 `Human output` 的 object。

在 `Multi-output` 模式中，这一步包含一个 JavaScript 面板：`Output items transform`。当一次 source tick 或 provider query 可以产生多个独立 alert items 时使用它。Transform 应返回：

```js
{
  outputs: [
    {
      raw: { /* 匹配 Raw output 的字段 */ },
      human: { /* 匹配 Human output 的字段 */ },
    },
  ],
}
```

`outputs` 中的每个 item 都会作为单独的 trigger output 发出。`Raw output` 和 `Human output` schemas 描述的是一个被发出的 item，每个 item 都会按这些 schemas 验证。

编辑器会建议可用 context，并在 JavaScript 无效时显示 validation error。

## Step 9. Defaults

`Defaults` 定义推荐的默认通知模板。这是 trigger creator 给创建 subscription 的用户的建议：通知标题应该如何显示、short 和 long text 中应该包含哪些数据，以及使用哪个 icon、cover 或 links。

这些值不是强制的。创建 subscription 时，用户可以保留 defaults，也可以完全覆盖通知外观和文本以适配自己的场景。

所有面板都是可选的，并通过独立 switch 开启。

#### Title

通知标题。

#### Short

短 markdown 文本。

#### Long

长 markdown 文本。

#### Icon

Icon URL。

#### Cover

Cover URL。

#### Avatar

通知 avatar URL。默认使用与 `Icon` 相同的 URL。

#### Links

链接数组。

每一行包含：

- `Title`;
- `Url`;
- delete button；
- 用于添加 link 的 `Add item`。

保存时，每个 link 都必须同时有 title 和 URL。

字段使用 autocomplete 和 Handlebars/template helpers。Defaults 会从 trigger output 渲染，因此这里不使用 `source`、`inputs` 或 `providers` context。

Autocomplete 会建议：

- `block` - output 中存在时为 block number；
- `index` - output 中存在时为 item/event index；
- `hash` - output 中存在时为 transaction/block hash；
- `meta` - trigger metadata：`description`、`name`、`kind`、`scope`；
- `raw.*` - raw output fields；
- `human.*` - human output fields。

#### Handlebars Helpers

Defaults 使用 Handlebars 语法：`{{human.amount}}`、`{{#if human.amount}}...{{/if}}`、`{{round human.price digits=2}}`。Expressions、blocks、paths 和 sub-expressions 的通用规则可以参考官方 Handlebars 文档：[Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html)。

##### Built-in Helpers

`if` - 条件 block。如果 value 不是 falsy，则渲染内容。

`unless` - 反向 `if`。如果 value 是 falsy，则渲染内容。

`each` - 遍历 array/object。在 block 内可以使用 `this`，以及 Handlebars service values，例如 array 的 `@index` 和 object 的 `@key`。

`with` - 在 block 内改变当前 context。当需要多次引用同一个 nested object 时很有用。

`lookup` - 按 key 动态获取 value。当 field name 或 index 存在另一个变量里时很有用。

##### Web3alert Helpers

`round` - 对 number 或 numeric string 四舍五入。`digits` 参数定义小数位数；`fixed=true` 会返回固定小数位数的 string。

```handlebars
{{round human.price digits=2}}
{{round human.price digits=2 fixed=true}}
```

`format` - 使用 token decimals 格式化 raw integer amount。例如，值 `1000000000000000000` 搭配 `decimals=18` 会变成 `1`。

```handlebars
{{format raw.value decimals=18}}
```

`substr` - 返回字符串的一部分。`start` 定义起始位置；负数 `start` 从字符串末尾倒数；`len` 限制长度。

```handlebars
{{substr hash start=0 len=10}}
{{substr hash start=-8}}
```

`address` - 为通知格式化 blockchain address。如果该 address 存在于 workspace address book 中，则返回 alias；否则把已知 address 缩短为紧凑形式。

```handlebars
{{address raw.from}}
```

`make` - 递归地把 object、array 或 string 内部可识别的地址替换为 address book 中的值。适合展示包含多个地址的结构。

```handlebars
{{yaml (make raw.participants)}}
```

`includes` - 检查 array 是否包含指定 string value。通常在 `if` 内使用。

```handlebars
{{#if (includes raw.tags "whale")}}Whale transfer{{/if}}
```

`lowercase` - 将 string 转为小写。

```handlebars
{{lowercase meta.name}}
```

`uppercase` - 将 string 转为大写。

```handlebars
{{uppercase meta.scope}}
```

`titlecase` - 将 string 转为 Title Case。

```handlebars
{{titlecase meta.name}}
```

`oneline` - 用空格替换换行。

```handlebars
{{oneline human.summary}}
```

`yaml` - 将 object/array 序列化为 YAML string。

```handlebars
{{yaml human}}
```

## Step 10. Test & Save

最后一步允许在保存前检查 trigger。

如果 trigger 有 inputs schema，会先显示 test inputs fields。

对于 blockchain trigger，需要指定：

- `Block` - 用于 simulation 的 block number；
- `Item index` - 如果在该 block 中找到多个匹配 events，则可选指定 item index。

对于 timer trigger，会使用当前 timestamp。

测试运行后，界面会显示：

- `Valid result` 或 `Invalid result` status；
- `Source items on block`;
- issues list，如果结果无效；
- `Source input`;
- `Trigger output`;
- `Debug`.

成功检查后，或有意识地跳过检查后，就可以保存 trigger。Test run 是否可用可能取决于 pricing plan/account tier。
