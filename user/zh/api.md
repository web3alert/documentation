# API

Web3alert API 允许使用与 web UI 相同的实体：workspaces、projects、triggers、templates、subscriptions、resources、data sources 和 addresses。

Base URL:

```text
https://web3alert.io
```

所有公开客户端 endpoints 都使用规范的 `/api/*` 路径。服务间 endpoints
不属于此公开 API 文档。

## OpenAPI

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/openapi.json` | [面向智能体的 API 的 OpenAPI 3.1 JSON 文档。](api-openapi.md) |

## Auth

大多数端点接受账户会话令牌或智能体密钥作为 Bearer 凭据。可以在 [Agents 页面](https://web3alert.io/agents)创建密钥，也可以[用以太坊钱包登录](agents.md)。

```http
Authorization: Bearer YOUR_AGENT_KEY
```

每个密钥沿用账户在所属工作区的角色。`read` 可读取数据，`manage` 可创建订阅或请求充值报价等，`spend` 可用欧元余额购买套餐或项目附加项。管理密钥、撤销令牌、切换工作区、创建或更新工作区、购买礼品券，以及创建、接受、拒绝或取消项目转移请求，均需要账户会话。具体端点见下文及面向智能体的 [OpenAPI 文档](api-openapi.md)。

没有 `manage` 权限的密钥不会收到外部资源写入令牌。账单响应会对所有智能体密钥隐藏未使用的优惠券和礼品券代码。

使用密钥的请求可能返回 HTTP `403`。权限不足时返回 `insufficient_scope`，操作要求账户会话时返回 `key_not_allowed`，购买将超出月度上限时返回 `spend_cap_exceeded`。

Endpoint access 取决于：

- account tier；
- 用户在 workspace 中的角色；
- project/data source/resource access level；
- 实体状态。

每个账户有三个相互独立的 API 限流桶。所有智能体密钥共用一个桶，速率按账户套餐计算。外部会话请求共用另一个桶，速率与前者相同。第一方网页会话使用第三个桶，每分钟 1,200 次请求。受信任的 MCP 会话流量不受这些限制。`DELETE /api/token` 和 `DELETE /api/tokens` 均不受 account 请求限额约束，因此即使 account 已用完配额，仍可撤销 token。详细数值见 [Limits](limits.md#api-and-mcp)。

## Response format

带响应体的成功响应会返回 JSON。删除 subscription 或撤销 token 等操作返回 `204 No Content` 时，响应没有正文。收到 `204` 时请跳过 JSON 解析。

详细的 response body 结构见 [Types](types.md)。

JSON 格式的 API 错误通常包含 `error.message`，还可能包含 `error.code` 和 `error.details`。

```json
{
  "error": {
    "message": "This key lacks the \"manage\" scope.",
    "code": "insufficient_scope"
  }
}
```

智能体端点会返回具体的 HTTP 状态码，例如 `401`、`403`、`404`、`409`、`410`、`429` 和 `503`。请同时读取状态码和 `error.code` 来处理响应。[x402 充值](api-billing.md#post-api-billing-wallet-x402-topup)的 `402` 响应会包含 x402 v2 `PaymentRequired` 报价，或者包含字符串 `error` 的付款失败结果。

如果请求体中的 JSON 格式有误，API 可能在调用路由处理程序之前拒绝请求，并返回纯文本 `400 Bad Request`。将响应解析为 JSON 前，请先检查响应的 `Content-Type`。

请求超出 external API 限额时，API 会返回 `429`，并附带示例中的这类 headers。请读取 `Retry-After`，了解重试前需要等待的秒数。

```http
Retry-After: 1
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

详情：[Account API](api-account.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/token` | 使用 provider `credentials` 验证 identity 并创建新的持久化 Bearer token；无需现有 Bearer token。 <!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent --> |
| `DELETE` | `/api/token` | 撤销请求使用的 token。 |
| `DELETE` | `/api/tokens` | 撤销已通过身份验证的 account 的所有 tokens。 |
| `GET` | `/api/me` | 获取当前 account、identity、tier 和 memberships。 |
| `POST` | `/api/keys` | 在当前工作区创建密钥。仅限会话令牌。 |
| `GET` | `/api/keys` | 列出账户在所有工作区的密钥。仅限会话令牌。 |
| `PATCH` | `/api/keys/:id` | 修改密钥名称或月度上限。仅限会话令牌。 |
| `DELETE` | `/api/keys/:id` | 撤销密钥。仅限会话令牌。 |
| `DELETE` | `/api/me` | 删除当前 account。 |
| `PUT` | `/api/me/meta` | 更新 account metadata。 |
| `POST` | `/api/me/avatar` | 上传当前 account avatar。 |
| `GET` | `/api/me/workspace` | 获取当前 workspace account。 |
| `PUT` | `/api/me/workspace` | 切换当前 workspace account。 |
| `GET` | `/api/account/settings` | 获取 account settings。 |
| `PUT` | `/api/account/settings` | 保存 account settings。 |

## 钱包登录与认领

详见[账户 API](api-account.md)。

| 方法 | 端点 | 用途 |
| --- | --- | --- |
| `POST` | `/api/agent/siwe/nonce` | 获取一次性 SIWE nonce。公开。 |
| `POST` | `/api/agent/siwe/verify` | 验证已签名的 SIWE 消息并签发密钥。公开。 |
| `POST` | `/api/agent/claim-link` | 创建或替换认领链接。需要有 `manage` 权限的智能体密钥。 |
| `GET` | `/api/agent/claims/:token` | 查看认领详情。持有链接即可访问。 |

## 链接

详情：[链接 API](api-links.md)。

| 方法 | Endpoint | 用途 |
| --- | --- | --- |
| `POST` | `/api/links` | 为 Web3alert 站内路径创建匿名短链接。 |
| `GET` | `/api/links/:key` | 解析匿名短链接 key；未知 key 返回 `400`。 |

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

## 智能体构建触发器

详见[触发器 API](api-triggers.md)。

| 方法 | 端点 | 用途 |
| --- | --- | --- |
| `POST` | `/api/agent/build/contracts` | 查找事件签名。需要会话令牌或有 `read` 权限的密钥。 |
| `POST` | `/api/agent/build/drafts` | 生成触发器草稿。需要会话令牌或有 `manage` 权限的密钥。 |
| `POST` | `/api/agent/build/drafts/:draftId/test` | 测试草稿。需要会话令牌或有 `read` 权限的密钥。 |
| `POST` | `/api/agent/build/drafts/:draftId/activate` | 激活测试匹配的草稿。需要会话令牌或有 `manage` 权限的密钥。 |
| `DELETE` | `/api/agent/build/triggers/:fullname` | 删除私有智能体触发器。需要会话令牌或有 `manage` 权限的密钥。 |

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
| `POST` | `/api/resources/:fullname/signing-secret` | 生成或轮换 Webhook 签名密钥。 |
| `PUT` | `/api/inbox` | 创建或返回工作区收件箱。需要会话令牌或有 `manage` 权限的密钥。 |
| `GET` | `/api/events` | 读取保留的收件箱事件。需要会话令牌或有 `read` 权限的密钥。 |
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
| `POST` | `/api/billing/wallet/x402-topup` | 通过 x402 在 Base 网络用 USDC 充值欧元余额。需要会话令牌或有 `manage` 权限的密钥。 |
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
