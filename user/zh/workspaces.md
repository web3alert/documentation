# Workspaces

`Workspace` 是 Web3alert 的工作空间，团队在其中保存和配置自己的 projects、subscriptions、delivery resources、data sources 和 address book。

简单来说，account 负责用户的个人登录、个人资料和 billing，而 workspace 负责协作和服务中的工作数据。

一个 account 可以属于多个 workspaces。Active workspace 在左侧菜单中选择，它决定用户在服务主要章节中看到哪些实体：

- [Projects](projects.md) - 在 workspace 中创建的项目，以及可用的 marketplace projects；
- [Subscriptions](subscriptions.md) - 当前 workspace 的 subscriptions；
- [Resources](resources.md) - 当前 workspace 的投递渠道和外部 endpoints；
- [Data sources](data-sources.md) - 当前 workspace 的 custom data sources 和可用的 system sources；
- [Addresses](addresses.md) - 当前 workspace 的 address book。

## Workspace 和 Account

不要把 workspace 和 account 混在一起。

### Account

`Account` 是用户的个人实体。

Account 包含：

- 授权方式；
- 用户个人资料和 avatar；
- billing profile；
- balance；
- 当前 tier；
- tiers 和 project free-access add-ons 的购买记录；
- 用户在不同 workspaces 中的个人成员关系。

### Workspace

`Workspace` 是团队或用户的工作实体。

Workspace 包含：

- workspace 的 title、avatar 和 name；
- workspace 成员及其 roles；
- 用于添加成员的 invite link；
- 在该 workspace 中创建的 projects；
- project transfer requests；
- workspace subscriptions；
- workspace resources；
- workspace custom data sources；
- workspace address book；
- workspace subscription logs。

当用户切换 active workspace 时，account 仍然是同一个，但看到的是另一个工作上下文。

## Workspace 左侧菜单

左侧菜单中有一个独立的 `Workspace` 区块。

### Current Workspace

区块顶部行显示当前 workspace：它的 avatar 或名称首字母、title 和展开箭头。

点击这一行会打开 workspace-menu。

### Parameters

打开 `Workspace parameters`，也就是当前 workspace 的设置页面。

Workspace 参数、成员、transfer requests 和 subscription logs 都在这里管理。

### Switch Workspaces

显示当前 account 所属的其他 workspaces。

点击另一个 workspace 会切换 active workspace。切换后，如果可能，界面会停留在同一个章节。例如，用户可以从一个 workspace 的 `Projects` 切换到另一个 workspace 的 `Projects`。如果当前详情页在新的 workspace 中不存在，界面会把用户带回项目列表。

### Add Workspace

打开新 workspace 创建流程。

## 创建 Workspace

新 workspace 通过左侧菜单创建：`Workspace` -> `Add workspace`。

创建后，界面会将用户切换到新的 workspace，并打开 [Projects](projects.md)。

### Title

Workspace 的可见名称。

Title 显示在左侧菜单、workspace 设置，以及其他需要可读 workspace 名称的界面位置。

Title 是必填项。

### Name

Workspace 的稳定 slug。

Name 用作 workspace 的技术名称，并会进入属于该 workspace 的实体 fullname。例如，一个项目可以获得类似 `<workspace>.<project-name>` 的 fullname。

Name 是必填项，必须是 kebab-case：拉丁字母、数字和连字符。

在用户手动修改 `Name` 之前，表单会尝试从 `Title` 生成它。如果 title 包含不支持的字符，就需要手动填写 name。

### Reserved Names

一些名称由平台保留。

例如，与 `common` 或 `web3alert` 相关的 workspace names 和 titles 不能用于普通用户 workspaces。

### Cancel

取消 workspace 创建，并把用户带回主界面。

## Workspace Roles

Workspace 成员拥有其中一个 role。

### Owner

Workspace 的主要 owner。

Owner 可以管理 workspace settings、成员和 project transfers。只有 owner 可以把项目从 workspace 中 transfer 出去。

### Admin

Workspace 管理员。

Admin 可以管理 workspace settings 和成员，但不能代表 owner 发起 project transfer。

### Developer

处理 workspace 技术实体的成员。

具体访问权限取决于 projects 和服务章节的权限。在 workspace settings 中，developer 不管理成员和 transfer requests。

### User

Workspace 的基础成员。

通常使用已经准备好的 projects、subscriptions 和 resources，但不管理 workspace settings。

## Workspace Parameters

`Workspace parameters` 是 active workspace 的设置菜单。

标签页集合取决于用户 role 和 workspace 本身。例如，`Project transfers` 只对 owner 可用。

## Information

`Information` 标签页包含 workspace 的主要参数。

### Workspace

Workspace 资料面板。

面板中显示：

- workspace avatar；
- workspace title；
- title 编辑按钮。

### Avatar

Workspace avatar 显示在左侧菜单中，以及需要在视觉上区分不同 workspace 的地方。

要替换 avatar，请点击当前图片。支持最大 1 MB 的 `JPG` 和 `PNG` 文件。

上传时会打开 crop tool。Workspace 使用 rounded-square crop，因为 workspace avatar 在界面中显示为圆角方形。

### Title

Title 可以直接在 workspace 面板中编辑。

保存后，新名称会显示在左侧菜单和 workspace settings 中。

Title 不能为空。

### Name

Workspace 的 read-only 名称。

Name 不能从 settings 中编辑，因为它参与实体 fullnames 和 links。

## Members

`Members` 标签页管理 workspace 成员。

它对可以管理 workspace 的用户可用。通常是 owner 和 admin。

### Invite New Members

对于普通 workspaces，该标签页会显示 invite link。

可以复制这个 link 并发送给需要加入 workspace 的用户。用户通过 invite link 进入时，如果尚未登录 Web3alert，会先完成授权，然后点击 `Join` 并进入 workspace。

### Workspace Members

Workspace 成员列表。

每个成员会显示：

- avatar 或名称首字母；
- display name；
- 如果是当前用户，会显示 `You` 标记；
- 当前 role；
- 如果当前用户可以移除成员，会显示删除按钮。

### Role Select

允许修改成员 role。

选择 role 后会立即应用修改。

可用 roles：

- `Owner`；
- `Admin`；
- `Developer`；
- `User`。

### Remove Member

从 workspace 中移除成员。

移除前会显示确认。如果用户移除自己，这个操作等同于 `Leave workspace`。

### Members Access

如果用户没有管理成员的权限，该标签页会显示 read-only 状态。

在这种模式下，用户会看到只有 owner 或 admin 可以邀请成员、修改 roles 和移除人员。

## Project Transfers

`Project transfers` 标签页管理 projects 在 workspaces 之间的 transfer。

它只对当前 workspace 的 owner 可用。

Transfer 不会立刻移动项目。首先创建 request，然后目标 workspace 的 owner 接受或拒绝它。只有 request 被接受后，项目才会变更 owner。

### Create Transfer Request

用于准备 transfer request 的表单。

### Project

需要 transfer 的项目。

列表包含当前 workspace 中可 transfer 的 projects。

### Target Workspace

应该接收项目的 workspace name。

仅知道 workspace name 不足以移动项目：request 仍然必须由目标 workspace 的 owner 接受。

### Target Project Name

项目在目标 workspace 中的新名称。

如果字段为空或保持当前值，项目会保留自己的 name。如果需要在 transfer 时重命名项目，这里填写新的 project name。

### Get Plan

在创建 request 前构建 transfer plan。

Plan 显示将被影响的内容：

- triggers 数量；
- templates 数量；
- topics 数量；
- subscriptions 数量；
- 需要更新的 aliases 数量。

如果发现 conflicts，必须先修复它们，才能创建 request。

### Conflicts

阻止 transfer 的问题列表。

例如：

- target workspace 未找到或不能接受 transfer；
- target workspace 中已经有同名项目；
- target trigger fullnames 与现有 triggers 冲突；
- aliases 已被其他实体占用。

### Request Transfer

基于最近一次构建的 plan 创建 transfer request。

如果 plan 构建之后数据发生变化，backend 可能会拒绝 request，并要求重新构建 plan。

### Outgoing Requests

从当前 workspace 发出的 requests。

每个 request 显示：

- source project 和 target project；
- 创建日期；
- 过期时间；
- status；
- triggers/templates 的简短数量。

Pending request 可以用 `Cancel` 取消。

### Incoming Requests

当前 workspace 收到的 requests。

Pending request 可以用 `Accept` 接受，或用 `Reject` 拒绝。

接受后，backend 会应用 transfer：修改项目的 workspace，更新相关 fullnames 和 aliases，然后 request 获得最终 status。

## Subscription Logs

`Subscription logs` 标签页显示当前 workspace subscriptions 的 alerts 历史。

这是投递工作日志：它帮助理解哪些 subscription alerts 已发送、被阻止、被 rate limit 限制，或以错误结束。

### Last Entries

限制日志中的记录数量。

可用值：

- `50`；
- `100`；
- `250`；
- `500`。

### Auto-Refresh

启用日志自动刷新。

可用值：

- `Off`；
- `5s`；
- `10s`；
- `30s`。

当 auto-refresh 启用时，日期过滤器会隐藏，因为日志会作为最近事件的 live-view 工作。

### Before / After

时间过滤器。

`Before` 显示所选日期和时间之前的记录。`After` 显示所选日期和时间之后的记录。

### Date and Time

为 `Before` 或 `After` 过滤器选择日期和时间。

在 popover 中可以选择 day、hour 和 minute。`Now` 按钮填入当前时间，`Clear` 清除过滤器。

### Refresh

手动刷新日志。

### Time

Log entry 创建时间列。

表头按钮按时间排序记录：从新到旧，或从旧到新。

### Subscription

Alert 路由列。

它显示 project、trigger 或 template context，以及投递渠道。如果 subscription 有 inputs 或 filters，旁边可能会显示带有简短提示的 details badge。

### Status

Status 过滤器和列。

可用 statuses：

- `Delivered`；
- `Failed`；
- `Rate limited`；
- `Blocked`。

### Expanded Log Row

点击一行会展开详情：

- `Reason` - 错误原因或补充信息；
- `Input` - replay/test input，如果存在；
- `Test run` - 基于 log entry 数据执行的 subscription test run，如果该记录有可用的关联 subscription。

## Danger Zone

`Danger zone` 标签页包含离开 workspace。

### Leave Workspace

将当前用户从 workspace 中移除。

离开前会显示确认。

如果用户是 workspace 中唯一的成员，离开后 workspace 会被删除。

### Last Workspace

如果这是用户唯一的 workspace，用户不能离开。

在这种情况下，`Leave` 按钮会被禁用，标签页显示 `You cannot leave your last workspace`。
