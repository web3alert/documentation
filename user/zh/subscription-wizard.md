# Create Subscription

`Create subscription` 是为当前 active workspace 创建新 subscription 的 wizard。在这里，用户选择订阅什么、设置条件，并选择用于发送 alerts 的 actions。

Wizard 可以从通用 [Subscriptions](subscriptions.md) section、[project](projects.md) 页面，或 [template](templates.md) 上的 `Subscribe` 按钮打开。如果 wizard 从 project/template 打开，部分选择会提前填好。

## Wizard 的整体结构

Wizard 由两个主要部分组成：

- `Trigger` - 选择 project/template/trigger、topics、inputs 和 filters；
- `Action` - 选择 delivery channel 并配置 action 参数。

如果 wizard 从通用 `Subscriptions` section 打开，需要先选择 project。如果 wizard 从 project 页面打开，则跳过 project 选择。

## Step 1. Project

当 subscription 从通用 section 创建，并且没有预先选择 project 时，会出现这一步。

### Project picker

允许选择要订阅的 project。

选择 project 后，wizard 会进入 trigger/template 配置。如果 project 已经通过 URL 传入，例如来自 project 或 template 页面，则跳过这一步。

## Step 2. Trigger

这一步选择到底什么会触发 alerts。

如果 project 同时支持 templates 和 direct triggers，wizard 会显示 subscription 创建方式的选择。

### Templates

`Templates` 是 project owner 准备好的订阅场景。

这条路径通常更简单：用户选择 template，然后选择 topic，并只填写所选 topics 需要的 inputs。

### Events and calls

`Events and calls` 是直接选择 trigger。

这条路径更接近技术配置：用户选择 trigger category、具体 trigger，并在可用时自己设置 inputs/filters。

## Template flow

当选择 `Templates`，或用户在 template 上点击 `Subscribe` 时，会使用 Template flow。

### Choose a template

如果 project 中有多个 templates，wizard 会要求选择需要的 template。

如果只有一个 template，wizard 可以直接进入其 topics 选择。

### Choose a category

在 template 内，topics 可以按 category/template group 分组。

用户选择 group，以查看相关 topics 和 inputs。

### Pick the triggers and fill in the required fields

这一步中，用户选择 topics 并填写 inputs。

Topics 是 template 内的 checkboxes。可以选择一个或多个 topics。

Inputs 可以是：

- common - 多个所选 topics 共用；
- unique - 只属于某个具体 topic。

如果 topic 需要 input，必须先填写它才能进入 actions。

## Direct trigger flow

当选择 `Events and calls` 时，会使用 Direct trigger flow。

### Trigger category

Triggers 按 categories 分组。在 project flow 中，categories 通常对应 project 的 trigger groups。

### Trigger

subscription 将使用的具体 trigger。

选择 trigger 后，wizard 会在 description 存在时显示它，并打开 trigger 参数。

### Inputs

Inputs 是 trigger 期望用户提供的必填或可选 values。

例如，trigger 可能要求 address、amount threshold 或其他参数。字段会根据 trigger schema 构建。

### Filters

Filters 用于缩小 alerts 范围，避免收到多余通知。

如果不需要 filters，可以不添加。如果添加多个 filters，可以用 `AND` 和 `OR` 逻辑组合：

- `AND` - event 必须通过该组的所有条件；
- `OR` - event 至少必须通过一组条件。

### Add a filter

添加新条件。

对于 filter，需要选择字段、operator 和 value。可用字段取决于 trigger schema。

### Delivery type

控制 inputs 和 filters 匹配后，subscription 发送 alerts 的频率。

- `Every match` 会发送每个通过 filters 的 event。
- `Once` 只会为该 subscription 发送第一个匹配的 event。
- `Once per key` 会为每个选中的 output value 发送第一个匹配的 event。请选择稳定的 `Key path`，例如 market、event、account 或 user 字段。除非每个 event 都应该被视为新的 key，否则避免使用 transaction hash 或 block number 这类唯一技术值。

## Step 3. Action

这一步选择 alerts 发送到哪里。

### Simple mode

Simple mode 显示可用 resources，并允许选择一个或多个 delivery channels。

这是普通创建 subscription 的主要场景：选择已经连接到 workspace 的 Telegram、Discord、webhook 或其他 resource。

### Add new resource

如果还没有所需 channel，会打开 resource 创建表单。

Resources 在 [Resources](resources.md) 中有详细说明。

### Advanced mode

Advanced mode 可用于 direct trigger flow。它允许手动选择 action type，填写 action parameters，并在 action 支持时配置 notification overrides。

Template flow 使用简单的 resource 选择，因为 template 已经定义了面向用户的 subscription 场景。

### Choose the action type

选择具体 action，例如发送到 Telegram、Discord 或其他 channel。

### Set parameters

所选 action 的参数。通常包括 alert 应发送到的 resource，以及 action 需要的额外字段。

## Notification overrides

如果 action 支持 overrides，可以开启独立字段并替换通知 defaults。

### Title

通知标题。

### Short

通知短文本。

### Message

通知长文本。

### Icon

Icon URL。

### Cover

Cover URL。

### Avatar

通知 avatar URL。

### Links

通知中的 links。每个 link 都包含 title 和 URL。

Overrides 支持 Handlebars/template syntax，并在 action 支持时支持 Markdown。Values 会从 trigger output 渲染，因此可以使用 raw/human output fields 和 [Defaults](trigger-wizard.md#handlebars-helpers) 中描述的 helpers。

## Test run

最后一步可以使用 `Test run`。

Test run 允许在保存前检查 draft subscription：所选 rules、filters、inputs 和 actions。结果中可以看到 event 是否匹配条件，以及哪些 actions 本会被执行。

如果 test run 显示 issues，最好在保存前修复 subscription。

## Save alert

`Save alert` 创建或更新 subscription。

成功保存后，wizard 会把用户带回：

- 通用 [Subscriptions](subscriptions.md) section，如果 subscription 是从那里创建的；
- 具体 project 的 [Subscriptions](projects.md#subscriptions) tab，如果 wizard 从 project flow 打开；
- 原始页面，如果 wizard 是通过特殊的 `returnTo` 打开的。

## Edit, duplicate 和 delete

已创建的 subscription 可以从 [Subscriptions](subscriptions.md) 列表打开编辑。

`Duplicate` 会用已有 subscription 的设置打开 wizard，但保存结果时会创建新的 subscription。

`Delete` 会删除 subscription。删除后，这个 subscription 不再发送 alerts。
