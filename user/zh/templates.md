# Templates

`Templates` 是 project 内预先准备好的 subscription 场景。它们帮助 project owner 把技术性的 [triggers](triggers.md) 转换成用户容易理解的选项：到底可以追踪什么、需要填写哪些参数，以及可以选择哪些 topics。

如果 trigger 回答的是“读取哪个事件，以及如何处理它”，那么 template 回答的是“用户如何方便地订阅这个事件”。Template 不会替代 trigger，而是把一个或多个 triggers 组织成更清晰的 subscription flow。

## Templates 用来做什么

当 project 不仅要方便 integration owner，也要方便 marketplace 用户时，就需要 templates。

没有 template 时，用户会直接选择 trigger，并更接近技术配置：inputs、filters、defaults 和 action settings。这对精确或高级场景是正常的。

有 template 时，project owner 可以提前准备一条更简单的路径：

- 把相关场景分组到一个 template；
- 定义清楚的 topics；
- 只把必要 inputs 留给用户；
- 把 topics 与 triggers 和 filters 连接起来；
- 可以选择默认启用哪些 topics。

## Template 由什么组成

### Project

Template 总是属于某个具体的 [project](projects.md)。它使用该 project 的 triggers，并显示在 project 页面上的 `Templates` tab 中。

### Template metadata

Metadata 描述 template 本身：可见 title、内部 name 和 description。这些数据会显示在 templates 列表中，帮助用户理解自己正在选择哪个 subscription 场景。

### Inputs

Inputs 是用户通过 template 创建 subscription 时填写的值。

例如，template 可以要求填写 address、token id、threshold amount 或其他参数。之后这些值可以在 rules 中作为 filtering conditions 使用。重要的是：如果所选 topic/rule 使用了 inputs，那么这些 inputs 就是必填的。

### Topics

Topic 是 template 内部的一个独立选项，用户在创建 subscription 时可以启用或关闭它。

例如，一个 `Token activity` template 可以包含 `Transfers`、`Mints` 和 `Burns` topics。用户选择一个或多个 topics，而 template 已经知道每个 topic 背后有哪些 triggers 和 conditions。

### Rules

Rule 把 topic 与具体 trigger 连接起来。

如果 topic 基于一个 trigger，可以使用一条 rule；如果 topic 需要包含多个相似 events，可以使用多条 rules。在 rule 中选择 trigger，并在需要时配置 filters。

### Filters

Rule 内的 filters 会限制哪些 trigger results 符合所选 topic。

Filter value 可以直接设置，也可以通过 `Use inputs` 连接到 template input。第二种情况下，用户在创建 subscription 时填写 input，rule 会在 condition 中使用该值。

## Templates 如何用于 subscriptions

当用户在 template 上点击 `Subscribe` 时，界面会打开 [subscription creation](subscription-wizard.md)，并已经选好 project/template/topic。

如果 template 有带 `Selected by default` 的 topics，它们会被自动选中。如果没有，界面会选择第一个可用 topic。

用户可以：

- 选择 topics；
- 填写所选 rules 需要的 inputs；
- 在 subscription wizard 中配置 actions 和 notification overrides；
- 之后修改 subscription，而不改变 template 本身。

## Template vs Trigger

当需要精确技术控制或单一场景时，可以直接使用 trigger。

当需要给用户一个准备好的选择时，template 更方便：多个 topics、清晰的 inputs，以及构建在 triggers 之上的预配置 rules。

两种方式都正常。选择哪一种取决于谁会创建 subscription，以及这个过程需要有多技术化。

## 状态和错误

如果 template 的 rule 或关联 trigger 有问题，列表中可能会显示 `Needs review`。这样的 template 需要检查并修复，用户才能正常通过它订阅。

常见原因：

- trigger 被删除或重命名；
- rule 指向不存在的 topic；
- filter 不再匹配 trigger schema；
- template 还没有包含 topics。

## 管理

在 `Templates` tab 中，project owner 可以：

- 通过 [Add template](template-wizard.md) 创建 template；
- 打开已有 template 进行编辑；
- 删除一个或多个 templates；
- 如果 template 有效且包含 topics，通过 `Subscribe` 打开 subscription creation。

详细创建流程见 [Add template / Edit template](template-wizard.md)。
