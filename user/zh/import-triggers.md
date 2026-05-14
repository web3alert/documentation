# Import Triggers

`Import triggers` 是一个 wizard，用于根据指定 configs 或 metadata 快速生成一组 triggers，例如根据 EVM 合约 ABI 或 Substrate pallet metadata。

这是创建 triggers 的一个简化特殊场景。当需要创建许多同类 triggers 时很有用：例如 ERC20 合约的所有事件，或某个 pallet 的所有 events。如果需要一个精确场景并进行完整手动配置，请使用 [Add trigger / Edit trigger](trigger-wizard.md)。

Import triggers 是自动生成，因此导入后建议测试生成的 triggers，并确认 alerts 的显示正是预期效果。对于简单事件，生成结果通常可以直接使用；但对于复杂结构，最好额外配置 transform、human output 和 defaults：简化嵌套数据，格式化金额和地址，移除多余的技术字段，只在通知中保留真正对用户有用的内容。

## Step 1. Source

第一步选择 `Source network`。

列表中包含可用于生成的 [data sources](data-sources.md)：

- EVM sources;
- Substrate sources;
- custom sources，如果它们适合该 project。

[Add new source](data-sources.md#add-data-source) 选项会打开 [data source](data-sources.md) 创建流程，并返回 import wizard。

Wizard 会检查是否已选择 source，以及它是否有明确的 network type。

## Step 2.a. Generate for EVM

对于 EVM source，需要填写以下面板。

### Category

未来 triggers 的分类，例如 `Token transfers`。

### ABI contract address

需要从中加载 ABI 的合约地址。

### Use as trigger filter

决定是否把合约地址内置进 trigger filter 的开关。

### ABI

自动加载或手动粘贴的 JSON ABI。

### Load ABI from contract address

按钮会根据指定 contract address 启动 ABI 加载。

如果开启 `Use as trigger filter`，创建的 triggers 只会匹配该合约的 events。如果关闭，该地址只用于加载 ABI，triggers 本身会匹配任何具有所选 signature 的合约。

ABI 必须是 JSON array。如果 ABI 无法自动加载，可以手动粘贴。

## Step 2.b. Generate for Substrate

对于 Substrate source，选择 `Pallet`。

界面会显示：

- pallet 名称；
- metadata 中可用的 events/extrinsics 数量；
- runtime version；
- `Generate triggers from pallet` 按钮。

生成后，wizard 会根据所选 pallet 构建 draft triggers，并把用户带到 review。

## Step 3. Review & import

Review 中会显示候选项表格。

可用操作：

- 全选；
- 取消选择；
- 选择单个 triggers；
- 查看 trigger 名称；
- 查看 type；
- 查看 category；
- 查看 preview description/schema；
- 通过 `Create selected triggers` 只创建选中的 triggers。

成功导入后，界面会返回 project 的 [Triggers](projects.md#triggers) tab。
