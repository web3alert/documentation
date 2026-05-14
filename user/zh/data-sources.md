# Data Sources

`Data sources` 是 blockchain/runtime 数据来源，Web3alert 会从中接收 blocks、transactions、events、extrinsics、calls 和 metadata。

简单来说，data source 回答“从哪里读取数据”，而 [trigger](triggers.md) 回答“这些数据中的哪个事件算是匹配，以及如何把它转换成 subscription 的 output”。

## Data sources 用来做什么

Data source 会在服务的多个位置使用：

- 在 [Add trigger / Edit trigger](trigger-wizard.md) 中，当 trigger 选择 blockchain source 时；
- 在 [Import triggers](import-triggers.md) 中，当 wizard 根据 ABI、pallet metadata 或其他描述生成 triggers 时；
- 在 runtime engine 中，它会连接 endpoint、读取新区块，并把 source items 传给 triggers；
- 在 monitoring 中，可以查看 source status、lag 和 logs。

如果多个 projects 和 triggers 适合同一个网络或 runtime，一个 data source 可以被它们共同使用。

## System 和 custom sources

列表中可能显示两类 sources。

### System sources

System sources 是 Web3alert 已经支持的 sources。它们属于平台，通常作为共享 marketplace data sources 可用。

这些 sources 不能从 workspace 编辑。它们出现在列表中，是为了让用户看到当前注册了哪些 runtime sources，以及它们处于什么状态。

### Custom sources

Custom sources 是在 workspace 内创建的 sources。

它们可以用于自己的 projects、自定义 integrations，以及测试新网络。如果需要让 source 更广泛可用，可以把 custom source 设为 private 或 public。

不是所有套餐都可以创建 custom sources。Free accounts 不能创建自己的 data sources；需要付费 tier。不同 tier 也可能限制 custom sources 的数量。

## Custom source 类型

目前 wizard 支持两种 custom data source 类型。

### EVM

EVM source 用于兼容 Ethereum JSON-RPC 的 networks 和 endpoints。

它适合 EVM events、transactions、blocks、contract logs 和 contract reads，之后可用于 triggers 和 providers。

对于 EVM source，通常指定一个或多个 HTTP RPC endpoints 就足够。

### Substrate

Substrate source 用于 Polkadot/Substrate-compatible 网络。

它适合 runtime events、extrinsics、calls、blocks、storage reads，以及基于 metadata 的 trigger import。

Substrate source 通常使用 WebSocket endpoint。如果网络需要非标准 signed extensions、runtime types 或 RPC definitions，可以在 `Extensions` 步骤添加。

## Data sources 列表

`Data Sources` section 显示 sources 表格。

Sources 会按 type 或 runtime category 分组，例如 `EVM`、`Substrate` 或其他 plugin/runtime type。

### Name

source 的可见 title 和短技术 name。

### Deployer

创建 source 的 workspace 或 platform owner。

对于 system sources，通常显示 `common`。对于 custom sources，显示拥有该 source 的 workspace。

### Access

source 的访问级别。

`System` 表示平台 source。`Private` 表示当前 workspace 的 source。`Public` 表示发布给更广泛用途的 custom source。

### Created at

custom source 的创建日期。

对于 system/runtime-only sources，日期可能不存在。

### Lag

source 相对最后看到区块的延迟。

如果 source 已处理所有可用区块，会显示 `Up to date`。如果有 backlog，会显示 lag blocks 数量。

### Status

当前 runtime source 状态。

可能的状态：

- `Running` - source 正在运行；
- `Degraded` - source 正在运行，但有问题或错误；
- `Error` - source 处于错误状态；
- `Pending` - custom source 已保存，但 runtime registration 尚未完成；
- `Registered` - source 已注册，但 runtime status 没有返回 active state。

### Settings

source 的 action menu。

可用项目取决于用户权限和 source 类型。

## Source actions

### Logs

打开 custom source logs。

Logs 帮助理解 runtime 是否连接到 endpoint、正在处理哪些 blocks，以及发生了哪些错误。

### System alerts

打开关于 source 的系统通知 subscription 创建流程。

这样可以在 source 进入 error、恢复或开始 lag 时收到 alerts。

### Test system alerts

发送测试系统事件，用于检查 alert flow。

这个功能不是所有 tiers 都可用，通常是 source owners/administrators 需要使用。

### Edit

打开 source wizard 来编辑 custom source。

System sources 不能编辑。

### Restart source

重启 runtime worker source。

当 source 看起来卡住，但需要从已保存位置继续处理时，这很有用。

### Reset lag

丢弃 backlog，并从当前网络 head 继续处理。

这种 reset 之后被跳过的 blocks 不会再处理。只有当旧 backlog 不再需要，或阻止 source 追上最新状态时，才应使用这个 action。

### Delete

删除 custom source。

删除前，重要的是检查 source 是否被 triggers 或 imports 使用。如果删除 source，关联 triggers 和 projects 可能会失去数据来源。

## Add data source

`Add new source` 打开 custom source 创建 wizard。

Wizard 由四个步骤组成：`Details`、`Extensions`、`Test deployment` 和 `Deploy`。

## Step 1. Details

这一步定义 source 的基础配置：title、access、network type、endpoints 和 runtime processing settings。

### Title

source 的人类可读 title。

它显示在列表中，帮助区分不同 sources。例如：`Ethereum archive node`、`Polkadot private RPC`、`Base mainnet`。

### Name

workspace 内稳定的 source slug。

Name 根据 title 生成，但保存前可以修改。它只能包含 lowercase letters、numbers 和 dashes。

source 创建后，name 会成为 `<workspace>.source.<name>` 形式 fullname 的一部分。

### Access level

定义 custom source 的可用范围。

`Private` 适合当前 workspace 的 sources 和私有 integrations。`Public` 用于 source 需要更广泛可用，并且在其他 projects 或 users 拥有相应权限时可以使用的情况。

### Type

blockchain/runtime source 类型。

目前可用 `EVM` 和 `Substrate`。

### Endpoints

runtime 将连接的 RPC endpoints 列表。

可以指定一个或多个 endpoints。多个 endpoints 适合做冗余：如果一个 endpoint 不稳定，runtime 可以使用另一个。

EVM 通常使用 HTTP RPC URL。Substrate 通常使用 WebSocket URL。

### Batch max count

EVM source 的可选设置。

它控制读取数据时 batch requests 的最大数量。如果不启用该字段，会使用默认值。

这个设置属于 advanced runtime settings，只有标准行为不适合时才需要。

### Block processing concurrency

可选的 block processing concurrency 设置。

更大的值可能加快处理速度，但会增加 endpoint 和 runtime 负载。如果不启用该字段，会使用默认值。

### Max queued blocks

可选的 blocks 队列限制。

它限制 source 可以在处理队列中保留多少 blocks。如果不启用该字段，会使用默认值。

## Step 2. Extensions

这一步配置额外的 runtime extensions。

对于 EVM sources，这一步通常不需要任何内容：在这个 flow 中，EVM data sources 不使用 signed extensions、custom runtime types 或 RPC extension definitions。

对于 Substrate sources，只有在标准 metadata 不足以支持某些网络时才需要 extensions。

### Extensions

optional extensions 的总开关。

如果 endpoint 普通，并且 metadata 无需额外设置即可读取，这一步可以保持关闭。

### Preset

已知 Substrate runtime cases 的预设配置。

目前可用：

- `No preset`;
- `Avail`;
- `Polkadot Asset Hub / Statemint`;
- `Kusama Asset Hub / Statemine`.

如果选择 preset，wizard 会使用准备好的设置，不需要手动填写 signed extensions、types 和 RPC。

### Signed extensions

描述 custom signed extensions 的 JSON array。

对于 extrinsics 使用非标准 extensions，runtime 如果没有额外描述就无法正确解码的 Substrate 网络，需要这个配置。

### Types

包含 custom runtime types 的 JSON object。

当 metadata 或 RPC 返回 runtime 无法自动识别的类型时，需要这个配置。

### RPC

包含 custom RPC methods 的 JSON object。

当 trigger/provider 需要调用 Substrate node 的非标准 RPC sections 或 methods 时，需要这个配置。

## Step 3. Test deployment

这一步在保存前检查 runtime 是否能连接到 source。

### Deployment test

显示未来 source 的 summary：workspace、fullname 和 type。

`Run test deployment` 按钮会启动 endpoints 和 runtime configuration 检查。

### Logs

显示 test deployment 结果。

如果 test deployment 出错，最好先修复 endpoints 或 extensions，再保存 source。

只有成功检查后才能继续。

## Step 4. Deploy

最后一步保存 source，并等待 runtime registration。

### Deploy source

显示将要保存的 configuration summary。

对于 Substrate source，还会显示 extensions summary：preset、signed extensions、custom types 和 RPC methods。

`Create source` 按钮创建新 source。编辑已有 source 时，按钮名为 `Update source`。

### Deploy logs

显示保存和 runtime registration 过程。

保存成功后，source 会出现在 `Data Sources` 列表中。如果 runtime registration 尚未完成，source 可能会在 `Pending` 状态停留一段时间。

## Edit data source

编辑 custom source 使用同一个 wizard。

可以修改 title、access level、endpoints、extensions 和 runtime settings。编辑时 name 会被锁定，因为它是稳定 fullname 的一部分。

source 更新后，runtime registration 可能需要一些时间。
