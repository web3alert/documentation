# Account

`Account` 是 Web3alert 中的用户个人实体。

Account 表示谁登录了服务、个人资料如何显示、当前启用了哪个 tier、可用于支付的 balance 是多少，以及哪些 billing/referral 操作属于这个用户。

Account 不会替代 [Workspace](workspaces.md)。Workspace 保存工作实体：projects、subscriptions、resources、data sources、addresses 和成员。Account 保存个人访问、个人资料和 billing 上下文。

## Account 和 Workspace

### Account 包含什么

Account 包含：

- 个人 avatar 和 account title；
- user id；
- personal access token；
- billing profile；
- internal balance；
- account tier；
- tier auto-renewal；
- account plans 的购买记录；
- 该 account 可以在 billing 中管理的项目的 project free-access add-on 购买记录；
- personal coupons 和 gift coupons；
- referral link、referral code 和 referral rewards；
- account 删除。

当用户切换 active workspace 时，account 本身保持不变。变化的只是与所选 workspace 相关的工作数据。

Workspace 及其设置在 [Workspaces](workspaces.md) 中有更详细的说明。

## 打开 Account Parameters

`Account parameters` 可以从界面右上角的用户菜单打开。

这个菜单包含：

- `Account parameters`；
- `Log out`。

`Log out` 会结束当前会话。退出前会显示确认。

## Account Parameters

`Account parameters` 包含四个标签页：

- `Information`；
- `Billing`；
- `Referral`；
- `Danger zone`。

## Information

`Information` 标签页包含 account 的个人设置。

### Account

Account 资料面板。

面板中显示：

- 用户 avatar；
- account title；
- 编辑 account title 的按钮；
- avatar 上传提示。

### Avatar

Avatar 用于 user menu，以及界面中需要显示当前用户的地方。

要替换 avatar，请点击当前图片。支持最大 1 MB 的 `JPG` 和 `PNG` 文件。

### Account Title

用户的可见名称。

Title 可以通过名称旁边的编辑按钮修改。编辑时：

- `Enter` 保存值；
- `Escape` 取消编辑；
- 失去焦点也会保存值。

限制：

- 最少 2 个字符；
- 最多 80 个字符；
- 不能保存空值。

### User ID

当前用户的 read-only id。

当 display name 不足以精确识别 account 时，它用于诊断、支持和准确识别 account。

### Personal Access Token

当前会话的个人 access token。

用户可以通过这个 token 访问 Web3alert [API](api.md) 和 [MCP servers](mcp-server.md)。可用的 API/MCP 能力取决于当前 account tier。

Token 应被视为秘密：不要把它发送到公开聊天、screenshots 或文档中。

Token 属于 account，而不是 workspace。

## Billing

`Billing` 标签页管理 account 的 balance、tier、支付和 coupons。

Billing 操作应用于 account，但某些购买可能会影响该 account 管理的 projects。

### Balance

Account 的 internal balance，以 EUR 计价。

Balance 可以用于：

- 购买 account plans；
- 购买 project free-access add-ons；
- 购买 gift coupons。

### Top Up

打开 balance 充值。

在 dialog 中填写 EUR 金额，然后继续前往支付提供商的 checkout。

支付提供商确认付款后，资金会出现在 internal balance 中。

### Current Tier

当前 account tier。

卡片显示：

- tier 名称；
- account 拥有 entitlement 的截止日期；
- 如果有已激活的付费 tier，会显示 `Renew automatically` 开关。

### Renew Automatically

控制当前 tier 的自动续费。

如果开关开启，下一周期可以通过所选 payment strategy 自动支付。如果关闭，tier 会持续到已付款周期结束，但不会自动续费。

### Account Plans

Account tiers 列表。

每个 tier 的完整限制和能力列表在 [Limits](limits.md) 页面中说明。

### Free

基础 tier。

提供对 free projects 的 unlimited access，以及对 non-free project triggers 的有限数量 active subscriptions。

### Advanced

付费 tier，适合需要访问 public/private project triggers，并需要基本能力来创建自己的 marketplace 实体的用户。

在当前 UI 中，Advanced 显示的主要能力包括：

- 访问 public 和 private project triggers；
- 一个 private project；
- 一个 custom data source。

### Pro

扩展付费 tier。

在当前 UI 中，Pro 显示的主要能力包括：

- 访问 public 和 private project triggers；
- 最多 5 个 private projects；
- 最多 5 个 custom data sources。

### Duration

付费 tier 的购买时长。

可用选项取决于 billing pricing，通常是 1、3、6 或 12 个月。某些时长可能会显示 discount。

### Pay / Upgrade

Tier 卡片上的操作按钮。

根据当前状态，它可能表示：

- 购买 tier；
- 以更长时长续费当前 tier；
- upgrade 到更高 tier；
- 显示该 tier 已经激活；
- 显示该 tier 在当前已付款周期结束前被锁定。

通过这个按钮支付会从 internal balance 扣款，因此 balance 必须充足。

### Project Free-Access Add-On

为所有服务用户开放某个 project 免费访问的 add-on。

这个场景适用于项目 owner 想为自己的 community 支付 alerts 访问费用。Add-on 激活期间，用户可以像订阅 free project 一样订阅这个项目。

如果 add-on 未续费，项目会自动变为 public project。如果 Free users 对该项目的 subscriptions 超过 Free tier 对 non-free projects 的限制，这些 subscriptions 会被冻结。

列表中显示 account 可以在 billing 中管理的 projects。

### Project Card

Project free-access add-on 卡片显示：

- project icon 和 title；
- add-on 当前 status；
- duration；
- `Renew automatically`；
- 支付按钮或当前 status。

如果 add-on 已激活，会显示当前周期的结束日期。如果正在等待支付确认，会显示 `Awaiting confirmation` 状态。

### Coupons

Coupons 区域允许为自己激活 coupon，或为其他用户购买 gift coupon。

### Redeem Coupon

用于输入 coupon code 的字段。

如果 code 有效，对应的 plan 会应用到 account。

### Gift Coupon

为其他用户购买 coupon code。

需要选择：

- tier：`Advanced` 或 `Pro`；
- duration。

确认购买后，金额会从 internal balance 扣除，服务会显示可以分享给其他人的 coupon code。

### Your Gift Coupons

当前 account 购买的 gift coupons 列表。

每个 coupon 显示：

- code；
- tier；
- duration；
- status；
- 用于 code 的 copy 按钮。

### Recent Invoices

Account plans 和 project add-ons 的最近 billing attempts 列表。

每个 invoice 显示：

- invoice 名称；
- amount；
- status；
- 更新日期。

Invoice status 可以帮助判断付款是否成功、是否等待确认、是否失败或已取消。

## Referral

`Referral` 标签页管理 account 的 referral link 和 referral rewards。

### Referral Rate

从受邀用户购买中获得的 reward 百分比。

### Referred Users

与当前用户 referral code 关联的 accounts 数量。

### Earned Total

已计入 internal balance 的 referral rewards 总额。

### Referral Link

用于邀请新用户的 shareable link。

如果 referral link 尚未创建，`Generate link` 按钮会创建它。创建后可以使用：

- `Copy link`；
- `Copy code`。

通过 referral link 进入的新用户会与 referral account 关联。

### Claim Referral Code

如果用户是通过邀请来的，但 code 没有自动绑定，可以手动填写 referral code。

可以通过 `Claim code` 按钮提交 code。绑定成功后，字段会被清空，界面会显示 success message。

## Danger Zone

`Danger zone` 标签页包含 account 删除功能。

### Delete Account

删除 account 以及它的所有 subscriptions。

删除前会显示确认：`Are you sure you want to delete this account?`。

删除后，当前会话会结束。

这个操作不可逆。只有在确实不再需要该 account 时才应使用。
