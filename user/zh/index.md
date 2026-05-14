# 欢迎使用 Web3alert

Web3alert 是一个用于创建和接收 Web3 通知的服务。

它可以把 blockchain/runtime 事件、外部数据和用户定义的条件转换成清晰的 alerts，并发送到 Telegram、Discord、Slack、webhooks 和其他投递渠道。

## 你可以做什么

作为用户，你可以：

- 订阅 marketplace 中已经准备好的 integrations；
- 为自己的 workspace 创建 subscriptions；
- 在同一个工作上下文中保存 addresses、resources 和 data sources；
- 接收关于事件、地址、合约、runtime calls 或自定义条件的 alerts。

作为项目或集成的 owner，你可以：

- 创建 project；
- 描述从 blockchain 或 timer sources 读取数据的 triggers；
- 添加 providers、filters、transforms 和 defaults；
- 创建 templates 和 topics，让其他用户更容易订阅；
- 从 ABI、Substrate metadata 或其他受支持的描述中导入 triggers。

## 核心概念

Web3alert 由几类核心实体组成。

`Projects` 描述 integrations。一个 project 可以是 blockchain network、protocol、contract、community project，或者一组 custom events。

`Triggers` 描述读取哪些 source items、如何过滤、如何补充数据，以及最终生成什么 output。

`Templates` 把 triggers 转换成用户容易理解的订阅场景。

`Subscriptions` 把选中的 trigger/template 与 workspace、inputs、filters、resources 和 delivery settings 连接起来。

`Resources` 管理投递渠道和相关的外部连接。

`Data sources` 描述数据来源：blockchain endpoints、runtime metadata 和 custom source runtime。

`Addresses` 用于在 subscriptions 和 filters 中保存并复用地址。

## 从哪里开始

如果你想使用现成的 alerts，请从 [Subscriptions](subscriptions.md) 和 [Create subscription](subscription-wizard.md) 开始。

如果你想创建自己的 integration，请从 [Projects](projects.md)、[Triggers](triggers.md) 和 [Templates](templates.md) 开始。

如果你要把 Web3alert 连接到 external tools 或 AI agents，请查看 [MCP Server](mcp-server.md) 和 [API](api.md)。
