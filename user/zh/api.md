# API

Web3alert API 允许使用与 web UI 相同的实体：workspaces、projects、triggers、templates、subscriptions、resources、data sources 和 addresses。

Base URL:

```text
https://web3alert.io
```

所有公开客户端 endpoints 都使用规范的 `/api/*` 路径。服务间 endpoints
不属于此公开 API 文档。

## Auth

用户请求使用 personal access token：

```http
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Token 可以在 [Account parameters](account.md#personal-access-token) 中获取。

Endpoint access 取决于：

- account tier；
- 用户在 workspace 中的角色；
- project/data source/resource access level；
- 实体状态。

External API requests 会按 tier 限制。详细数值见 [Limits](limits.md#api-and-mcp)。

## Response format

成功 response 会返回 endpoint JSON。

详细的 response body 结构见 [Types](types.md)。

错误返回格式：

```json
{
  "error": {
    "message": "error message",
    "details": {}
  }
}
```

超过 external API limit 时，会返回 `429` 和 headers：

```http
Retry-After: 10
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

详情：[Account API](api-account.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/token` | auth flow 后创建或获取 API token。 |
| `GET` | `/api/me` | 获取当前 account、identity、tier 和 memberships。 |
| `DELETE` | `/api/me` | 删除当前 account。 |
| `PUT` | `/api/me/meta` | 更新 account metadata。 |
| `POST` | `/api/me/avatar` | 上传当前 account avatar。 |
| `GET` | `/api/me/workspace` | 获取当前 workspace account。 |
| `PUT` | `/api/me/workspace` | 切换当前 workspace account。 |
| `GET` | `/api/account/settings` | 获取 account settings。 |
| `PUT` | `/api/account/settings` | 保存 account settings。 |

## Workspaces

详情：[Workspaces API](api-workspaces.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/workspaces` | 当前 account 的 workspaces 列表。 |
| `GET` | `/api/workspaces/:fullname` | 获取 workspace。 |
| `PUT` | `/api/workspaces/:fullname` | 创建或更新 workspace。 |
| `DELETE` | `/api/workspaces/:fullname` | 删除 workspace。 |
| `POST` | `/api/workspaces/:fullname/avatar` | 上传 workspace avatar。 |
| `GET` | `/api/workspaces/:workspace/acl` | 获取 workspace members/ACL。 |
| `POST` | `/api/workspaces/:workspace/acl` | 创建 invite 或 ACL entry。 |
| `PUT` | `/api/workspaces/:workspace/acl/:entryId` | 修改 member role。 |
| `DELETE` | `/api/workspaces/:workspace/acl/:entryId` | 删除 member/ACL entry。 |

## Projects

详情：[Projects API](api-projects.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | 可用 projects 列表。 |
| `GET` | `/api/projects/create-capability` | 检查 project 创建能力。 |
| `GET` | `/api/projects/:fullname` | 获取 project。 |
| `PUT` | `/api/projects/:fullname` | 创建或更新 project。 |
| `DELETE` | `/api/projects/:fullname` | 删除 project。 |
| `GET` | `/api/projects/by-link/:token` | 通过 access link 打开 private project。 |
| `POST` | `/api/projects/:fullname/access-links` | 为 project 创建 access link。 |
| `POST` | `/api/projects/:fullname/assets/images` | 上传 project icon 或 cover。 |
| `DELETE` | `/api/projects/:fullname/images/:asset` | 删除 uploaded project image。 |

## Project Transfers

详情：[Project Transfers API](api-project-transfers.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects/:fullname/transfer/plan` | 获取 project transfer plan。 |
| `POST` | `/api/projects/:fullname/transfer-requests` | 创建 transfer request。 |
| `GET` | `/api/project-transfer-requests` | incoming/outgoing transfer requests 列表。 |
| `POST` | `/api/project-transfer-requests/:id/accept` | 接受 transfer request。 |
| `POST` | `/api/project-transfer-requests/:id/reject` | 拒绝 transfer request。 |
| `POST` | `/api/project-transfer-requests/:id/cancel` | 取消 outgoing transfer request。 |

## Triggers

详情：[Triggers API](api-triggers.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/triggers` | 带 filters 的 triggers 列表。 |
| `GET` | `/api/triggers/:fullname` | 获取 trigger。 |
| `PUT` | `/api/triggers/:fullname` | 创建或完整保存 trigger。 |
| `PATCH` | `/api/triggers/:fullname` | 部分更新 trigger。 |
| `DELETE` | `/api/triggers/:fullname` | 删除 trigger。 |
| `POST` | `/api/triggers/patch` | Bulk patch triggers。 |
| `POST` | `/api/triggers/remove` | Bulk remove triggers。 |
| `GET` | `/api/triggers/:fullname/draft` | 获取 trigger draft view。 |
| `PUT` | `/api/triggers/:fullname/draft` | 保存 trigger draft。 |
| `POST` | `/api/triggers/:fullname/draft/validate` | 验证 trigger draft。 |
| `GET` | `/api/triggers/:fullname/logs` | 获取聚合的 delivery 和 source-pressure 日志。 |
| `POST` | `/api/triggers/:fullname/reset-test-status` | 重置 trigger 测试状态。 |
| `POST` | `/api/triggers/preview` | 在 input 上 preview activation 和 transforms。 |
| `POST` | `/api/triggers/test` | 在 sample source item 上 test trigger。 |
| `POST` | `/api/triggers/test-block` | 在指定 block 上 test trigger。 |
| `POST` | `/api/triggers/providers/test` | Test 单个 provider。 |
| `GET` | `/api/triggers/hypercore/actions` | 获取 builder 可用的 HyperCore actions。 |
| `GET` | `/api/triggers/runtime-sources` | runtime data sources 列表。 |
| `GET` | `/api/template-helpers` | 获取用于 trigger 和 action 模板的公开 Handlebars helper 元数据。 |
| `POST` | `/api/triggers/find-latest-block` | 为 trigger 查找或准备 test input/block。 |

## Trigger Import

详情：[Trigger Import API](api-trigger-import.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/triggers/import/evm` | 加载 EVM ABI entries，但不保存 triggers。 |
| `POST` | `/api/triggers/import/evm/abi` | 按 contract address detect/load ABI。 |
| `POST` | `/api/triggers/import/evm/drafts` | 生成 EVM trigger drafts。 |
| `POST` | `/api/triggers/import/hypercore/drafts` | 生成 HyperCore trigger drafts。 |
| `POST` | `/api/triggers/import/solana/idl` | 加载 Solana IDL metadata。 |
| `POST` | `/api/triggers/import/solana/drafts` | 生成 Solana trigger drafts。 |
| `POST` | `/api/triggers/import/substrate/drafts` | 生成 Substrate trigger drafts。 |
| `GET` | `/api/triggers/substrate/source` | 获取 Substrate source info。 |
| `GET` | `/api/triggers/substrate/pallets` | 获取 Substrate pallets 列表。 |
| `GET` | `/api/triggers/substrate/pallet` | 获取一个 Substrate pallet 的 metadata。 |

## Templates

详情：[Templates API](api-templates.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/:fullname/templates` | project templates 列表。 |
| `GET` | `/api/projects/:fullname/template` | 获取 project root template。 |
| `POST` | `/api/projects/:fullname/templates` | 创建 template/group。 |
| `GET` | `/api/projects/:fullname/templates/:id` | 获取 template。 |
| `PUT` | `/api/projects/:fullname/templates/:id` | 更新 template。 |
| `DELETE` | `/api/projects/:fullname/templates/:id` | 删除 template。 |

## Subscriptions

详情：[Subscriptions API](api-subscriptions.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/subscriptions` | 当前 workspace/account subscriptions 列表。 |
| `POST` | `/api/subscriptions` | 创建 subscription。 |
| `GET` | `/api/subscriptions/:id` | 获取 subscription。 |
| `PUT` | `/api/subscriptions/:id` | 更新 subscription。 |
| `DELETE` | `/api/subscriptions/:id` | 删除 subscription。 |
| `PUT` | `/api/subscriptions/:id/state` | 启用或关闭 subscription。 |
| `POST` | `/api/subscriptions/test` | Test subscription。 |
| `GET` | `/api/subscriptions/alerts/history` | Workspace subscription logs。 |
| `GET` | `/api/subscriptions/:id/alerts/history` | 指定 subscription 的 logs。 |

## Resources

详情：[Resources API](api-resources.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/resources` | resources 列表。 |
| `GET` | `/api/resources/:fullname` | 获取 resource。 |
| `PUT` | `/api/resources/:fullname` | 创建或更新 resource。 |
| `DELETE` | `/api/resources/:fullname` | 删除 resource。 |
| `POST` | `/api/resources/:fullname/setup-sessions` | 启动 Telegram destination setup session。 |
| `GET` | `/api/resources/:fullname/setup-sessions/:id` | 获取 setup session 状态。 |
| `DELETE` | `/api/resources/:fullname/setup-sessions/:id` | 取消 setup session。 |
| `GET` | `/api/resources/external/:token` | 通过 token 打开 external resource setup。 |
| `POST` | `/api/resources/external/:token` | 发送 external resource setup payload。 |

这三个 setup-session routes 仅在服务器启用安全 Telegram destination setup 时可用。

## Data Sources

详情：[Data Sources API](api-data-sources.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/custom-sources` | custom data sources 列表。 |
| `GET` | `/api/custom-sources/create-capability` | 检查 custom source 创建能力。 |
| `POST` | `/api/custom-sources/verify` | 验证 custom source config。 |
| `GET` | `/api/custom-sources/:fullname` | 获取 custom source。 |
| `PUT` | `/api/custom-sources/:fullname` | 创建或更新 custom source。 |
| `DELETE` | `/api/custom-sources/:fullname` | 删除 custom source。 |
| `GET` | `/api/custom-sources/:fullname/logs` | 获取 custom source logs。 |
| `POST` | `/api/custom-sources/:fullname/test-status` | 检查 custom source status。 |
| `POST` | `/api/custom-sources/:fullname/restart` | 重启 custom source。 |
| `POST` | `/api/custom-sources/:fullname/reset-lag` | reset custom source lag。 |

## 计费

详情：[计费 API](api-billing.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/billing/overview` | 获取当前账号的计费概览。 |
| `GET` | `/api/billing/wallet/overview` | 获取余额和钱包概览。 |
| `POST` | `/api/billing/wallet/crypto-topup` | 创建加密货币余额充值。 |
| `POST` | `/api/billing/wallet/topup/refresh` | 刷新充值状态。 |
| `POST` | `/api/billing/account-plan/balance-purchase` | 使用余额购买或升级账号套餐。 |
| `POST` | `/api/billing/account-plan/checkout` | 创建账号套餐 checkout。 |
| `POST` | `/api/billing/account-plan/crypto-checkout` | 创建账号套餐的直接加密货币 checkout。 |
| `POST` | `/api/billing/project-addon/balance-purchase` | 使用余额购买项目 add-on。 |
| `POST` | `/api/billing/project-addon/checkout` | 创建项目 add-on checkout。 |
| `POST` | `/api/billing/project-addon/crypto-checkout` | 创建项目 add-on 的直接加密货币 checkout。 |
| `POST` | `/api/billing/coupon/redeem` | 兑换优惠券。 |
| `POST` | `/api/billing/coupon/gift-purchase` | 使用余额购买礼品优惠券。 |
| `GET` | `/api/billing/referral/overview` | 获取推荐余额和链接摘要。 |
| `POST` | `/api/billing/referral/link/create` | 创建推荐链接。 |
| `POST` | `/api/billing/referral/claim` | 领取推荐码。 |
| `POST` | `/api/billing/subscription/update-renewal` | 更新自动续费设置。 |
| `POST` | `/api/billing/crypto-checkout/refresh` | 刷新加密货币 checkout 状态。 |
| `POST` | `/api/billing/crypto-checkout/cancel` | 取消加密货币 checkout。 |

## Addresses

详情：[Addresses API](api-addresses.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/addresses` | addresses 列表。 |
| `POST` | `/api/addresses` | 创建 address。 |
| `PUT` | `/api/addresses/:id` | 更新 address。 |
| `DELETE` | `/api/addresses/:id` | 删除 address。 |

## Apps, Actions, Blueprints and Types

详情：[Apps, Actions, Blueprints and Types API](api-builder-registry.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/apps` | apps 列表。 |
| `GET` | `/api/apps/:fullname` | 获取 app。 |
| `PUT` | `/api/apps/:fullname` | 创建或更新 app。 |
| `DELETE` | `/api/apps/:fullname` | 删除 app。 |
| `GET` | `/api/actions` | actions 列表。 |
| `GET` | `/api/actions/:fullname` | 获取 action。 |
| `PUT` | `/api/actions/:fullname` | 创建或更新 action。 |
| `DELETE` | `/api/actions/:fullname` | 删除 action。 |
| `GET` | `/api/blueprints` | blueprints 列表。 |
| `GET` | `/api/blueprints/:fullname` | 获取 blueprint。 |
| `PUT` | `/api/blueprints/:fullname` | 创建或更新 blueprint。 |
| `DELETE` | `/api/blueprints/:fullname` | 删除 blueprint。 |
| `GET` | `/api/types` | shared types 列表。 |
| `GET` | `/api/types/lookup` | 解析动态类型选项。 |
| `GET` | `/api/types/:fullname` | 获取 shared type。 |
| `PUT` | `/api/types/:fullname` | 创建或更新 shared type。 |
| `DELETE` | `/api/types/:fullname` | 删除 shared type。 |
