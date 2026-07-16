# Resources

`Resources` 是 workspace 用来发送 alerts 的已连接 delivery channels 和 external endpoints。

简单来说，subscription 定义订阅什么，而 resource 回答“把结果发送到哪里”：Telegram chat、Discord channel、Slack channel 或 webhook URL。

## Resources 用来做什么

Resource 保存与具体 channel 或 endpoint 的连接。因此，同一个 channel 可以在不同 [subscriptions](subscriptions.md) 中复用，而不需要每次重新输入。

例如，一个 workspace 可以创建：

- 用于团队主聊天的 Telegram resource；
- 用于监控频道的 Discord resource；
- 用于自有 backend endpoint 的 Webhook resource；
- 用于工作频道的 Slack resource。

之后创建 [subscription](subscription-wizard.md) 时，用户只需在 `Action` 步骤选择需要的 resource。

## Resources 如何与 actions 关联

`Action` 描述通知的发送方式：Telegram message、Discord webhook、Slack webhook 或 HTTP webhook。

`Resource` 保存这个 action 的具体目标：

- Telegram - 已连接 chat；
- Discord - channel webhook URL；
- Slack - channel webhook URL；
- Webhook - 你的 endpoint URL。

在创建 subscription 的 simple mode 中，界面会把 resources 显示为可用 delivery channels 列表。在 advanced mode 中，action 可能会要求选择 resource 作为其中一个参数。

## Workspace scope

Resources 属于当前 workspace。如果切换 workspace，resources 列表也会改变。

拥有 workspace 管理权限的用户可以管理 resources。如果用户没有这些权限，`Resources` section 将无法查看和编辑。

## Resource blueprint

每个 resource 都根据 blueprint 创建。Blueprint 定义 resource type、icon、UI title，以及需要填写的字段。

目前有四种 resource types。

### Telegram

Telegram resource 可以向私聊、group、forum topic 或 channel 发送 alerts。

只有 Web3alert workspace 的 owner 才能启动 setup 或更换该 destination。这个
Web3alert 角色要求与下文的 Telegram chat administrator 权限是两项独立要求。

它使用安全的 external setup session。从 resource 表单打开 Telegram，然后在 bot 中选择以下 destination 之一：

- 与 bot 的私聊；
- group 或 supergroup；
- channel；
- forum group 的 `General` 或某个指定 topic。

连接 group、forum 或 channel 时，执行 setup 的用户必须是 owner，或是有权添加 bot 并将其提升为 administrator 的管理员。Web3alert bot 也必须是 administrator。在 channel 中，bot 需要发布消息的权限；在 group 或 forum 中，bot 必须能够管理 chat 并发送消息。

选择 forum 后，使用 `Use General` 将 alerts 发送到 General。若要使用其他 topic，请在 Telegram 中打开该 topic，并在其中发送 `/bindtopic`。

此确认流程可防止把任意 chat id 保存为 destination。Setup session 会在 15 分钟后过期。

### Discord

Discord resource 用于通过 webhook 向 Discord channel 发送 alerts。

表单中填写 Discord webhook 的 `URL`。它需要在目标 Discord channel 的设置中创建，然后粘贴到 resource 中。

### Slack

Slack resource 用于通过 Incoming WebHook 向 Slack channel 发送 alerts。

表单中填写 Slack webhook 的 `URL`。它需要在 Slack workspace/channel 设置中创建，然后粘贴到 resource 中。

### Webhook

Webhook resource 用于向任意 HTTP endpoint 发送 alerts。

表单中填写 `URL`，Web3alert 会向该地址发送 notification payload。如果 alerts 需要传给自己的 backend、automation system 或其他外部服务，这种类型很有用。

## Resources 列表

`Resources` section 显示当前 workspace 的 resources。

每个 resource 会显示：

### Icon

resource type 的 icon。它来自 blueprint。

### Title

resource 的人类可读名称。可以用作简短清晰的 channel 名称，例如 `Main Telegram`、`Ops Discord` 或 `Backend webhook`。

### State

resource 的文本状态，如果存在。

对于 external resources，状态帮助理解连接是否完成。例如，Telegram resource 在连接确认之前，可能无法在 subscription 中选择。

### Actions

resource 有管理菜单。通过它可以打开编辑或删除 resource。

## Add resource

`Add resource` 打开 resource 创建表单。

### Type

首先选择 resource type：Telegram、Discord、Slack 或 Webhook。

如果表单从 [Create subscription](subscription-wizard.md) 打开，type 列表可能会限制为适合所选 action 的 resources。

### Title

界面中显示的 resource 名称。

最好按 channel 的含义命名，而不是按技术类型命名：例如 `Alerts channel`、`DAO ops`、`Main backend webhook`。

### Name

workspace 内稳定的 resource slug。

Name 是 resource fullname 的一部分，并作为内部 identifier 使用。通常它会根据 title 自动填写，但保存前可以编辑。

resource 创建后，name 就不能再修改。

### URL

该字段会出现在 Discord、Slack 和 Webhook resources 中。

这里粘贴对应服务的 webhook URL。对于 Discord 和 Slack，URL 会按具体平台格式验证。

### Configure in Telegram

Telegram 不使用 URL，而是使用 `Configure in Telegram`。对于已配置的 resource，同一流程会显示为 `Change destination`。

服务会创建一个 15 分钟有效的 setup session，并打开 Web3alert bot。一次性 setup link 不应保存或写入日志。在 Telegram 中完成 destination 选择并返回 Web3alert；bot 确认后，resource 会变为 ready。

Rebind 是原子的。Setup 尚未完成时，现有 alerts 会继续使用当前 destination。只有确认成功后 target 才会切换；取消、session 过期或 setup 失败都不会改变旧 target。

### Add a resource

对于 Discord、Slack 和 Webhook，如果所有必填字段都正确填写，`Add a resource` 按钮会立即创建 resource。

## Edit resource

`Edit` 打开已有 resource 的编辑表单。

如果 resource type 支持，可以修改 title 和连接字段。Name 保持 read-only，因为它是稳定 fullname 的一部分。

如果 resource 正在被 subscriptions 使用，修改 URL 或连接会影响所有向该 resource 发送 alerts 的 subscriptions。Telegram 会继续使用旧 destination，直到新的 setup 成功完成。

## Delete resource

`Delete` 从 workspace 中删除 resource。

删除前，重要的是检查 resource 是否被 active subscriptions 使用。如果删除 delivery channel，引用它的 subscriptions 将无法再通过该 resource 发送 alerts。
