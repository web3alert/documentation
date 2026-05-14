# Addresses

`Addresses` 是当前 workspace 的 address book。

它保存 blockchain addresses 以及对应的清晰 aliases，让 subscriptions 和通知中不仅可以使用很长的技术地址，也可以使用人类可读名称：`Treasury`、`Main wallet`、`Alice validator`、`Ops multisig`。

## Addresses 用来做什么

Addresses 主要帮助三个场景。

### 更快填写 subscriptions

当 [Create subscription](subscription-wizard.md) 中有 address 字段时，界面可以从 address book 推荐地址。

如果 workspace 经常订阅同一批 wallets、contracts、validators 或 accounts，这会很方便。

### 更清楚地阅读 subscriptions

address book 中的地址在 inputs 和 filters 中更容易识别。

例如，不需要每次都记住很长的 `0x...` 背后是哪一个 wallet，可以保存 alias `Treasury`，并把它作为清晰名称使用。

### 改善 notification defaults

在 [notification defaults](trigger-wizard.md#defaults) 中，可以使用 Handlebars helpers `address` 和 `make`。

它们会从 trigger output 中取出地址，如果该地址存在于当前 workspace 的 address book 中，就输出 alias。如果找不到 alias，helper 会保持原地址，或将其缩短为紧凑形式。

这对包含多个地址的通知尤其有用：sender、receiver、contract、validator、delegator 或 multisig。

## Workspace scope

Address book 属于当前 workspace。

如果切换 workspace，addresses 列表也会改变。这很重要：一个 workspace 中的 address `Treasury` 和另一个 workspace 中的 address `Treasury` 可能是不同实体。

拥有 workspace 管理权限的用户可以管理 addresses。如果用户没有这些权限，`Addresses` section 将无法查看和编辑。

Address book 不确认地址所有权，也不提供 wallet 访问权限。它只是一个 aliases 目录，用于更方便地设置和显示 alerts。

## Address types

添加 address 时，首先选择类型。类型用于 validation，也用于渲染通知时正确查找 alias。

### Plain

任意字符串值。

当需要保存的不是标准 blockchain address，而是另一个同样适合用 alias 标记的 identifier 时使用。

### Substrate (ss58 format)

SS58 format 的 Substrate/Polkadot ecosystem address。

保存时，UI 会把 SS58 address 规范化为内部 canonical format，并在列表中再显示为 SS58。这样即使同一个 account 以不同 SS58 variants 输入，也能进行匹配。

### Bitcoin

Bitcoin address。

适合 Bitcoin subscriptions 和通知中使用的 Bitcoin-style addresses。

### Ethereum (EVM)

`0x...` format 的 EVM address。

适合 Ethereum-compatible 网络：Ethereum、Polygon、Base、Arbitrum、Optimism、Celo 和其他 EVM networks。

查找 alias 时，EVM addresses 会忽略大小写进行比较。

### Cosmos

Cosmos/Bech32 address。

保存时，UI 会把 Bech32 address 规范化为基础 `cosmos` prefix，让同一个 address 更稳定地匹配。

## Addresses 列表

`Addresses` section 显示当前 workspace 的 address book。

### Alias

address 的人类可读名称。

Alias 会显示在列表中，被 helpers 使用，并帮助在 subscriptions 和通知中识别 address。

### Type

address 类型：`plain`、`ss58`、`bitcoin`、`evm` 或 `cosmos`。

### Address

address 本身。

在列表中，它可能以格式化形式显示。对于长地址，界面可能会在窄屏上缩短中间部分，但复制时使用完整 address。

### Network icons

如果 address 被 subscriptions 使用，旁边可能会出现相关 networks/projects 的 icons。

这有助于理解某个具体 address 已经在哪里使用。

### Copy

按钮会复制完整 address。

### Edit

允许修改 alias。

Address 和 type 保持不变：如果需要替换 address 本身，最好删除旧记录并添加新记录。

### Delete

从 address book 中删除 address。

删除不会删除 subscriptions，但删除后 alias 不会再出现在 suggestions 和 notification helpers 中。

## Add address

`Add address` 打开新记录创建表单。

### Address type

第一步选择 address type。

选择类型后，会出现 `Name` 和 `Address` 字段。

### Name

可选 alias。

如果 name 为空，alias 将等于 address 本身。如果填写 name，它必须至少三字符，并且不能与同类型其他 address 的 alias 重复。

最好选择简短清楚、在通知中看起来正常的名称：`Treasury`、`Bridge hot wallet`、`Validator stash`。

### Address

包含 address value 的必填字段。

Address 不能包含空格，必须通过所选类型的 validation，并且不能与同类型已经保存的 address 重复。

### Add address

把记录保存到当前 workspace 的 address book。

保存后，form 会重置，新 address 会出现在列表中。

## 在 subscription wizard 中使用

Address book 会用于 schema 描述为 address 的字段。

当用户在 subscription inputs 或 filters 中输入 address 时，界面可以显示 address book 中匹配的记录。可以选择已保存 address，而不是手动复制。

如果 dropdown 中出现不需要的记录，可以直接从 address input 删除它。这会从 workspace address book 中删除该记录。

## 在 notification templates 中使用

Address book 对通知 defaults 和 overrides 尤其有用。

### address helper

`address` 接受一个值。

如果该值是已知 blockchain address，并且在 address book 中找到，helper 会返回 alias。如果找不到 alias，已知 address 会被缩短为紧凑形式。

示例：

```handlebars
{{address raw.from}}
```

### make helper

`make` 接受 string、object 或 array，并递归地把找到的 addresses 替换为 aliases。

当 output 包含多个地址的结构时，这很方便。

示例：

```handlebars
{{make raw}}
```

如果 `raw` 内部包含 address book 中的 addresses，通知中会显示 aliases。
