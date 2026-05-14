# Add Template / Edit Template

`Add template` 会打开 project 内的 template 创建 wizard。这个 wizard 帮助在已有 [triggers](triggers.md) 之上组装面向用户的 subscription 场景：描述 template、定义 inputs、创建 topics，并通过 rules 把每个 topic 与 triggers 连接起来。

编辑已有 template 使用同一个流程，但表单会打开已保存的值。

创建 template 之前，通常应先准备 triggers：通过 [Add trigger / Edit trigger](trigger-wizard.md) 手动创建，或通过 [Import triggers](import-triggers.md) 生成。Template 本身不会创建 trigger，而是使用 project 中已经存在的 triggers。

## Step 1. Metadata

这一步定义 template 的主要数据。它们会显示在 project 的 `Templates` tab 中，帮助用户理解该 template 适用于哪个场景。

### Template title

template 的可见标题。最好简短并有明确含义，例如 `Token transfers`、`Governance events`、`Validator activity`。

### Template name

project 内部的 template slug。它根据 title 生成，但可以手动编辑。

Name 应保持稳定：它会用于 URL 以及 topics/rules 的关联。template 发布后，除非必要，最好不要修改 name。

### Description

template 描述。这里应说明用户可以通过该 template 收到哪些 alerts，以及什么时候应该选择它。

## Step 2. Inputs

这一步描述用户通过 template 创建 subscription 时需要填写的 inputs。

Inputs 并不总是需要。如果 topic 不需要用户参数，并且所有 rules 都使用固定条件，template 可以没有 inputs。

如果 input 通过 `Use inputs` 在 rule 中使用，用户就必须在 subscription wizard 中填写它。

### Input

每个 input 描述一个可供该 template 的 topics/rules 使用的值。

### Name

input 的技术名称。它在 rules 中以 `inputs.<name>` 使用，因此应当简短、稳定且清楚。

### Type

用户将输入的 value type。

可用类型：

- `string` - 普通字符串；
- `number` - 数字；
- `boolean` - true/false；
- `null` - 空值；
- `object` - 带 nested fields 的对象；
- `array` - 同类型 values 的数组；
- `tuple` - 带固定元素集合的数组；
- `address` - blockchain address；
- `balance` - token/native balance；
- `currency` - 金额值。

对于大多数 template inputs，建议选择简单类型。input 越简单，用户创建 subscription 就越容易理解。

input 的其他属性通过与 [Add trigger / Edit trigger](trigger-wizard.md) 中相同的 [schema editor](trigger-wizard.md#schema-editor) 配置。那里描述了 field metadata、address/balance 设置，以及 object、array 和 tuple 的 nested structures。

## Step 3. Topics

这一步显示 template 内的 topics 列表，以及管理它们的 actions。

Topic 是 template 内的 subscription 选项。用户在创建 subscription 时可以选择一个或多个 topics。

### Add topic

打开 topic 创建 wizard。

如果 template 还没有保存，界面会先保存 template 的修改，然后打开 topic 创建。

### Topics table

表格显示当前 template 的 topics。

列：

- `Topic` - topic 的 title 和 name；
- `Description` - topic 描述；
- `Rules` - 第一个关联 trigger/rule，以及额外 rules 的数量；
- `Actions` - edit/delete actions。

### Edit topic

为所选 topic 打开 topic wizard。

### Delete topic

从 template 中删除 topic 以及与它关联的 rules。删除前会显示确认。

## Topic wizard

Topic wizard 从 template wizard 的 Step 3 打开。它既用于创建 topic，也用于编辑 topic。

## Topic Step 1. Metadata

这一步定义 topic 在 subscription wizard 中对用户的显示方式。

### Title

topic 的可见标题。

例如：`Transfers`、`Mints`、`Burns`、`Large deposits`。

### Name

topic 的内部名称。它根据 title 生成，但可以编辑。

Topic name 会由界面规范化：空格和分隔符会转换为点，例如 `Balances transfer` 会变成 `balances.transfer`。这不是整个服务中所有 slugs 的通用格式，而是目前专门用于 topic keys 的格式，因为 topics 通常看起来像事件 namespace。主要要求是 name 必须简短、清楚且稳定。

### Description

可选的 topic 描述。它说明如果用户启用这个 topic，会发生什么变化。

### Selected by default

定义打开 subscription wizard 时是否自动选中该 topic。

这对 template 中的主要或最常用 topic 很方便。如果默认选中太多 topics，subscription 可能会变得太嘈杂，因此最好只选择真正基础的 topics。

## Topic Step 2. Rules

这一步把 topic 与一个或多个 triggers 连接起来。

Rule 表示：使用哪个 trigger，以及 event 需要满足哪些条件才能进入这个 topic。

### Rule

一条 rule 把 topic 与一个 trigger 连接起来。

如果 topic 应该对多个 triggers 生效，可以通过 `Add rule` 添加多条 rules。

### Trigger category

按 category 过滤 triggers 列表。它帮助在大型 project 中更快找到需要的 trigger。

### Trigger

rule 将使用的具体 trigger。

选择 trigger 后，wizard 会从 trigger schema 加载 filters 可用字段。

### Filters

rule 的可选条件。

如果没有设置 filters，rule 会使用所选 trigger 的所有 events。如果设置了 filters，只有满足条件的 event 才会进入 topic。

### Add a filter

添加过滤条件。

在 filter 中选择 trigger output 或 filters schema 中的字段、operator 和 value。

### Select filter

用于过滤 event 的 trigger 字段。

对于 object fields，可以进入结构内部并选择 nested field。

### Operator

比较 operator。

可用选项：

- equals;
- not equal;
- greater than;
- greater or equal;
- less than;
- less or equal.

对于数字条件，UI 会显示紧凑的 operator switches。

### Value

用于与所选字段比较的值。

Value 可以通过两种方式设置：

- literal value - rule 内直接设置的固定值；
- template input - 用户在创建 subscription 时填写的 inputs 中的值。

### Use inputs

把 filter 从固定值切换为来自 template inputs 的值。

例如，template 可以有 input `wallet`。那么 rule 可以按 `{{ inputs.wallet }}` 过滤字段 `from` 或 `to`。用户只需在 subscription wizard 中输入一次地址，topic rule 就会把它作为条件使用。

### AND / OR logic

同一组内的多个 filters 作为 `AND` 工作：event 必须通过该组的所有条件。

如果通过 `OR` 分隔条件，wizard 会创建多个组：event 至少需要通过其中一个组。

### Remove all filters

删除 rule 的所有 filters。之后 rule 会再次接受所选 trigger 的所有 events。

### Add rule

向 topic 添加另一条 rule。

当一个 topic 需要组合多个 triggers 时会用到它。例如 topic `Token activity` 可以包含 transfer、mint 和 burn events 的独立 rules。

## Save

`Save template` 保存 metadata、inputs、topics 和 rules。

`Save topic` 保存 topic 并把用户带回 template flow。

保存后，template 会出现在 project 的 [Templates](projects.md#templates) tab 中。如果 template 至少包含一个 topic 且没有 issues，用户就可以打开 `Subscribe` 并通过该 template [create a subscription](subscription-wizard.md)。
