# Projects

`Projects` 是 blockchain networks、protocols 和 dApp integrations 的目录，Web3alert 可以从这些项目收集事件，用户也可以基于它们创建 subscriptions。

在 Next 版本中，`Project` 不再只是“列表中的网络”。它是一个容器，保存 integration 的完整公开和技术配置：

- project metadata：名称、描述、tags、icons、cover 和外部 links；
- [Triggers](triggers.md)：技术规则，描述从 data source 读取哪些事件、如何过滤、用什么数据补充，以及转换成什么 output；
- [Templates](templates.md)：面向用户的 subscription 场景，构建在 triggers 之上，并按易懂的 topics 分组；
- [Subscriptions](subscriptions.md)：基于项目创建的 workspace subscriptions；
- 与 [Data sources](data-sources.md) 的关联：triggers 从这些 blockchain data sources 接收 events、blocks、calls 或 runtime metadata。

普通用户通常打开 `Projects` 是为了找到需要的网络或协议并创建 subscription。管理员或项目 owner 使用这一章节配置整个 integration surface。

## 项目列表

`Projects` 页面显示可用 projects 的目录。

### Search

搜索字段会按多个属性过滤 projects：

- project 的可见标题；
- project `fullname`；
- 内部 `id`；
- workspace 或 author；
- tags。

搜索既适合用户场景（“找到 Polkadot Asset Hub”），也适合管理场景（“按 slug/fullname 找到项目”）。

### Only This Workspace

`Only this workspace` 开关会让列表只保留当前 workspace 的 projects。

如果 account 可以访问多个空间，这一点很重要：例如 public marketplace 可以显示很多 projects，而 workspace filter 可以只显示自己的 private 或工作 integrations。

### Tags 过滤器

搜索行下方会显示可用 tags。选择某个 tag 后，目录中只保留带有该 tag 的 projects。

`Clear filters` 按钮会重置搜索、workspace filter 和已选择的 tags。

### Project Card

每个 project card 显示：

- project icon；
- title；
- 带创建或更新时间的服务行；
- author 或 workspace；
- short description；
- triggers 数量；
- 你对该 project 的 subscriptions 数量；
- 最多四个 tags；
- `Open` 按钮；
- 如果当前用户可以编辑 project，会显示 `Edit` 按钮。

如果当前过滤器没有找到任何内容，目录会显示空状态并提示重置 filters。如果完全没有 projects，会显示目录空状态。

### Create New Project

创建 projects 对 `Advanced` 及以上 tier 的用户可用。

每个 tier 都有自己的 private projects 数量限制。在限制未用完时，新 project 默认创建为 private：可以安心配置、测试 triggers，并在发布前准备 templates。

如果 private projects 限制已用完，有两个选择：upgrade tier，或将某个已有 private project 改为 public。Public project 不再占用 private projects 限制 slot，所以发布后会释放一个 slot 给新的 private project。

Project 可以有三种 access levels：

- `Private` - 用于准备和封闭 integrations 的工作模式。Project 只对可以访问其 workspace/account 的用户可见。这类 project 会占用 private projects 限制 slot。
- `Public` - 已发布的 marketplace project。其他用户可以找到并打开它，owner 继续管理 triggers、templates 和 metadata。Public project 不占用 private projects 限制 slot。
- `Free` - public project，其 subscriptions 对所有 Web3alert 用户免费。这个级别通常适用于希望为自己的 community 支付通知访问费用的项目和团队。Web3alert 团队也可以定期将重要或有趣的 projects 作为 `Free` 发布给全体服务用户。

## 创建和编辑项目

创建和编辑表单管理 project metadata。它不会创建 triggers 和 templates 本身，但会定义 project 在目录和 project 页面中的显示方式。

新 project 创建成功后，界面会打开带有已输入 metadata 的 project 页面。之后 owner 自己选择下一步：[import triggers](import-triggers.md)、[手动创建 trigger](trigger-wizard.md)、准备 [templates](#templates)，或使用 AI agent 配置项目。

### 权限和 read-only 模式

如果用户可以管理 triggers 和 templates，但不是 metadata owner，表单会显示 `Metadata is read-only`。

在这种模式下，如果权限允许，仍然可以继续处理 project 的技术部分，但不能修改 title、description、images、tags 或其他 metadata 字段。

### Title

`Title` 是必填的 project 可见标题。

限制：最多 32 个字符。

在 `Name` 字段被手动修改之前，`Title` 会自动用于生成 `Name`。

### Name

`Name` 是必填的 project slug。

创建时，它由 title 生成：

- 转为小写；
- 空格替换为 `-`；
- 连续连字符合并；
- 开头和结尾的连字符删除。

编辑已有 project 时，`Name` 会被锁定，因为它参与 identifiers 和 links。

### Access Level

`Access level` 在创建或编辑 project 时选择，并决定谁能在 marketplace 中看到 project。

对于大多数 project owners，基本路径是：先将 project 创建为 `Private`，准备好后再切换为 `Public`。`Free` 模式表示 project 仍然公开，但用户的 subscription access 是免费的。通常这是项目团队付费提供给自己 community 的免费通知服务。

### Short Description

`Short description` 是用于 cards 和界面紧凑区域的短描述。

该字段可选。限制：最多 256 个字符。

### Description

`Description` 是用于 `Overview` 标签页的完整 markdown project 描述。

该字段可选。限制：最多 4096 个字符。

编辑器为选中文本提供 floating toolbar：

- `Bold`；
- `Italic`；
- `Link`；
- `Heading`；
- `Code`。

### Tags

`Tags` 帮助搜索和过滤 projects。

要添加 tag，请在 `Add tag and press Enter` 字段中输入它，然后按 `Enter` 或添加按钮。

Tags 规则：

- 只允许小写拉丁字母、数字和连字符；
- 空格会规范化为连字符；
- 单个 tag 最大长度为 20 个字符；
- 不会添加重复项。

### Links

`Links` 是 project 的外部 links。

每个 link 包含：

- `Title`；
- `URL`；
- 删除该行的按钮。

`+ Add link` 按钮添加新行。保存时，只会使用同时填写了 title 和 URL 的 links。

在 project 页面中，这些 links 显示在 `Useful links` 区块。

### Icon 和 Cover

这些字段允许为 project 的视觉元素设置独立 URL：

- `Icon` - project 的紧凑 icon。它用于目录、project 页面、wizards，并作为 notification avatar 的默认值；
- `Cover` - project 页面的宽 cover。

每个字段都可以选择填写方式：

- `URL` - 手动粘贴图片 link；
- `Upload` - 通过 Web3alert 上传文件。

在 `Upload` 模式中，每个字段单独选择文件。如果上传新的 `Icon` 或 `Cover`，保存 project 后它会替换同类型的旧图片。

Upload 限制：

- 格式：`jpg`、`jpeg`、`png`、`webp`；
- 最大文件大小：5 MB。

如果选择了文件，但未保存 project 就离开页面，上传不会应用到 project。

### Delete Project

编辑已有 project 时，owner 可以通过 delete action 删除 project。删除前会显示确认对话框。

删除 project 是危险操作：project 与 triggers、templates 和 subscriptions 相关联，因此只有在 project 确实不再需要时才应使用。

## Quick Actions

Quick actions 的集合取决于标签页和用户权限：

- 在 `Overview`：如果用户可以编辑 metadata，显示 `Edit metadata`；
- 在 [Subscriptions](subscriptions.md)：如果用户可以管理当前 workspace 的 subscriptions，显示 [Create subscription](subscription-wizard.md)；
- 在 [Triggers](triggers.md)：如果用户可以编辑 project，显示 [Import triggers](import-triggers.md) 和 [Add trigger](trigger-wizard.md)；
- 在 [Templates](templates.md)：如果用户可以编辑 project，显示 [Add template](template-wizard.md)；对于带 topics 的有效 templates，显示 [Subscribe](subscription-wizard.md)。

## Overview

`Overview` 标签页显示面向用户的 project 描述。

主要区块：

- `About` - 来自 metadata 的完整 markdown 描述；
- `Project details` - triggers 数量、你的 subscriptions 数量、project id、创建日期和更新日期；
- `Tags` - project tags；
- `Useful links` - project 的有用外部 links。

如果 resource URL 以 `http://`、`https://`、`mailto:` 或 `tel:` 开头，link 会原样使用。其他情况下，界面会添加 `https://`。

## Subscriptions

`Subscriptions` 标签页显示与该 project 相关的 active workspace subscriptions。

这是主 [Subscriptions](subscriptions.md) 章节中同一组 subscriptions，但这里已经按当前 project 过滤。

它只在当前用户可以管理 active workspace 时可用。如果没有 subscriptions，会显示空状态并提示创建 subscription。

## Triggers

`Triggers` 标签页显示 project triggers 表格。

在查看模式中，可以打开 trigger details。在编辑模式中，owner 可以：

- 选择一个或多个 triggers；
- 删除已选择的 triggers；
- 打开具体 trigger 的编辑；
- 通过 [Add trigger](trigger-wizard.md) 创建新的 trigger；
- 通过 [Import triggers](import-triggers.md) 批量生成 triggers。

## Templates

`Templates` 标签页显示 project templates。

Template 是 triggers 之上的用户包装层：它把 inputs、topics 和 rules 分组，让用户无需了解内部 trigger configuration 就能创建 subscription。Templates 在 [Templates](templates.md) 中有更详细说明。

Templates 列表显示：

- title；
- key/id；
- description；
- topics 数量；
- 如果 template 有 issue，显示 `Needs review` 警告；
- 如果用户可以编辑，显示 `Edit` 和 `Delete` 操作；
- 如果 template 有效且包含 topics，显示 `Subscribe`。

点击 `Subscribe` 后，界面会打开带有所选 project/template/topic 的 [subscription 创建](subscription-wizard.md)。如果 template 有 `selectedByDefault` topics，它们会自动被选中；否则使用第一个可用 topic。
