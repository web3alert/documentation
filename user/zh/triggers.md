# Triggers

`Triggers` 是 project 的技术规则，用来定义 Web3alert 从 data source 读取哪些事件、如何检查触发条件，以及为 subscription 和相关 actions 生成什么结果。

Triggers 可以直接使用，也可以通过 templates 使用。直接使用 trigger 适合用户需要精确配置 source、inputs、filters 和 defaults 的场景。Template 适合 project owner 想把一个或多个 triggers 组合成现成的 subscription 场景，并提供易懂的 topic 和预设 rules 的场景。选择哪条路径取决于具体 case。

Trigger 连接服务中的几个部分：

- [Projects](projects.md) - trigger 创建和显示所在的 project；
- [Data sources](data-sources.md) - blockchain/runtime 数据来源；
- [Subscriptions](subscriptions.md) - 直接使用 trigger 或通过 template rules 使用 trigger 的用户 subscriptions；
- [Resources](resources.md) 和 [Addresses](addresses.md) - 可以用于 inputs、filters 或 notification defaults 的外部实体。

## 如何创建 triggers

有两种主要路径：

- [Add trigger / Edit trigger](trigger-wizard.md) - 主要的详细 wizard。它用于从 source 到 notification defaults 的手动 trigger 创建和编辑；
- [Import triggers](import-triggers.md) - 简化的批量 wizard。它会根据指定 configs 或 metadata 生成一组 triggers，例如根据 EVM contract ABI、Substrate pallet metadata 或 Solana program IDL，然后允许选择要保存哪些。

如果需要配置一个精确场景或编辑已有 trigger，通常使用 [Add trigger / Edit trigger](trigger-wizard.md)。如果需要从外部 contract 或 pallet 描述快速获得大量同类 triggers，更适合从 [Import triggers](import-triggers.md) 开始。

Project 有 trigger 数量限制。如果 project 已经达到限制，新的 triggers 将无法保存，直到提高限制或删除部分已有 triggers。详情见 [Limits](limits.md#project-triggers)。
