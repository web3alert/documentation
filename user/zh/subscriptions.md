# Subscriptions

`Subscriptions` 是用户接收 alerts 的规则。Subscription 把所选 project、trigger 或 template、用户参数、过滤条件，以及 Web3alert 发送通知所使用的 actions 连接在一起。

简单来说，project 描述可用的 integration，[triggers](triggers.md) 和 [templates](templates.md) 描述可以订阅什么，而 subscription 则是 workspace 中的具体设置：到底追踪什么、在什么条件下追踪，以及把结果发送到哪里。

## Subscription 连接什么

### Workspace

Subscription 属于当前 active workspace。因此 subscriptions 列表显示的是当前 workspace 的设置，而不只是当前用户的设置。

如果用户切换 workspace，就会看到并管理另一组 subscriptions。

### Project

每个 subscription 都与 project 关联。Project 定义 marketplace integration、可用 triggers、templates、metadata 和 access level。

在 project 页面中，[Subscriptions](projects.md#subscriptions) tab 显示的列表与通用 [Subscriptions](subscriptions.md) section 相同，只是已经按具体 project 过滤。

### Trigger 或 template

Subscription 可以通过两种方式创建：

- 通过 [template](templates.md)，用户选择预先准备好的场景和 topics；
- 直接通过 [trigger](triggers.md)，用户需要更精确地配置 event、inputs 和 filters。

Subscription 内部的 template 会展开成 rules。Rule 指定使用哪个 trigger，以及应用哪些 conditions。

### Inputs 和 filters

Inputs 是用户创建 subscription 时填写的值。它们可能直接被 trigger 需要，也可能被 template rules 需要。

Filters 是限制 alerts 流的额外条件。例如，可以只接收某个具体 address、token id 或 amount 的通知。

对于 template subscriptions，部分 filters 可能已经由 project owner 准备好。此时用户只填写容易理解的 inputs，template 会在 rules 中应用它们。

### Actions

Actions 定义通知发送到哪里，以及如何发送。

Action 通常关联到一个 [resource](resources.md)：Telegram chat、Discord channel、webhook 或其他 delivery channel。一个 subscription 可以有一个或多个 actions。

### Notification overrides

对于某些 actions，可以覆盖通知外观：title、short/long message、icon、cover、avatar 和 links。

如果没有设置 overrides，会使用 trigger/template defaults。Defaults 是 trigger creator 的建议，而不是硬性规则：用户可以保留它们，也可以按自己的场景替换。

## Subscription 如何工作

当 source 带来新事件时，Web3alert 会检查 project triggers。如果 trigger 形成 output，engine 会应用 subscription rules：inputs、filters、template conditions 和 activation logic。

如果事件匹配 subscription，Web3alert 会形成 notification payload，并把它发送到所选 actions。

如果事件没有通过条件，则不会发送 notification。

## Subscription 状态

### On

Subscription 处于 active 状态，可以发送 alerts。

### Off

Subscription 被用户关闭，或创建时就是关闭状态。它会保留设置，但不会发送 alerts。

### Blocked

Subscription 被服务阻止。通常这与权限、limits、project/trigger/template 可用性，或其他需要修复的原因有关。

Blocked subscription 不应被视为已删除：设置仍然保留，但 alerts 发送会暂停，直到原因被解决。

## Subscriptions 列表

在 `Subscriptions` section 中，可以：

- 按 address、event 或 filter 搜索 subscriptions；
- 启用和关闭 subscription；
- 打开编辑；
- 复制 subscription；
- 运行 test run；
- 分享设置链接；
- 删除 subscription。

表格会显示：

- `Triggers` - 所选 trigger/template、topics、inputs 和 filters；
- `Actions` - delivery channels；
- `Settings` - 状态和管理 actions。

## 创建

详细创建流程见 [Create subscription](subscription-wizard.md)。
