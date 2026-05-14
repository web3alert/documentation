# API

Web3alert API 允许使用与 web UI 相同的实体：workspaces、projects、triggers、templates、subscriptions、resources、data sources 和 addresses。

Base URL:

```text
https://web3alert.io
```

marketplace 和 builder 功能的主要 API 版本是 `v2`。部分 account/subscription/address book endpoints 目前仍保留在 `v1`。

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
| `POST` | `/api/v1/token` | auth flow 后创建或获取 API token。 |
| `GET` | `/api/v1/me` | 获取当前 account、identity、tier 和 memberships。 |
| `DELETE` | `/api/v1/me` | 删除当前 account。 |
| `PUT` | `/api/v1/me/meta` | 更新 account metadata。 |
| `POST` | `/api/v1/me/avatar` | 上传当前 account avatar。 |
| `GET` | `/api/v1/me/workspace` | 获取当前 workspace account。 |
| `POST` | `/api/v1/me/workspace` | 切换当前 workspace account。 |
| `GET` | `/api/v1/account/settings` | 获取 account settings。 |
| `POST` | `/api/v1/account/settings` | 保存 account settings。 |

## Workspaces

详情：[Workspaces API](api-workspaces.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/workspaces` | 当前 account 的 workspaces 列表。 |
| `GET` | `/api/v2/workspaces/:fullname` | 获取 workspace。 |
| `PUT` | `/api/v2/workspaces/:fullname` | 创建或更新 workspace。 |
| `DELETE` | `/api/v2/workspaces/:fullname` | 删除 workspace。 |
| `POST` | `/api/v2/workspaces/:fullname/avatar` | 上传 workspace avatar。 |
| `GET` | `/api/v2/workspaces/:workspace/acl` | 获取 workspace members/ACL。 |
| `POST` | `/api/v2/workspaces/:workspace/acl` | 创建 invite 或 ACL entry。 |
| `PUT` | `/api/v2/workspaces/:workspace/acl/:entryId` | 修改 member role。 |
| `DELETE` | `/api/v2/workspaces/:workspace/acl/:entryId` | 删除 member/ACL entry。 |

## Projects

详情：[Projects API](api-projects.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects` | 可用 projects 列表。 |
| `GET` | `/api/v2/projects/create-capability` | 检查 project 创建能力。 |
| `GET` | `/api/v2/projects/:fullname` | 获取 project。 |
| `PUT` | `/api/v2/projects/:fullname` | 创建或更新 project。 |
| `DELETE` | `/api/v2/projects/:fullname` | 删除 project。 |
| `GET` | `/api/v2/projects/by-link/:token` | 通过 access link 打开 private project。 |
| `POST` | `/api/v2/projects/:fullname/access-links` | 为 project 创建 access link。 |
| `POST` | `/api/v2/projects/:fullname/assets/images` | 上传 project icon 或 cover。 |
| `DELETE` | `/api/v2/projects/:fullname/images/:asset` | 删除 uploaded project image。 |

## Project Transfers

详情：[Project Transfers API](api-project-transfers.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/projects/:fullname/transfer/plan` | 获取 project transfer plan。 |
| `POST` | `/api/v2/projects/:fullname/transfer-requests` | 创建 transfer request。 |
| `GET` | `/api/v2/project-transfer-requests` | incoming/outgoing transfer requests 列表。 |
| `POST` | `/api/v2/project-transfer-requests/:id/accept` | 接受 transfer request。 |
| `POST` | `/api/v2/project-transfer-requests/:id/reject` | 拒绝 transfer request。 |
| `POST` | `/api/v2/project-transfer-requests/:id/cancel` | 取消 outgoing transfer request。 |

## Triggers

详情：[Triggers API](api-triggers.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/triggers` | 带 filters 的 triggers 列表。 |
| `GET` | `/api/v2/triggers/:fullname` | 获取 trigger。 |
| `PUT` | `/api/v2/triggers/:fullname` | 创建或完整保存 trigger。 |
| `PATCH` | `/api/v2/triggers/:fullname` | 部分更新 trigger。 |
| `DELETE` | `/api/v2/triggers/:fullname` | 删除 trigger。 |
| `POST` | `/api/v2/triggers/patch` | Bulk patch triggers。 |
| `POST` | `/api/v2/triggers/remove` | Bulk remove triggers。 |
| `GET` | `/api/v2/triggers/:fullname/draft` | 获取 trigger draft view。 |
| `PUT` | `/api/v2/triggers/:fullname/draft` | 保存 trigger draft。 |
| `POST` | `/api/v2/triggers/:fullname/draft/validate` | 验证 trigger draft。 |
| `POST` | `/api/v2/triggers/preview` | Preview trigger execution。 |
| `POST` | `/api/v2/triggers/test` | 在 sample source item 上 test trigger。 |
| `POST` | `/api/v2/triggers/test-block` | 在指定 block 上 test trigger。 |
| `POST` | `/api/v2/triggers/providers/test` | Test 单个 provider。 |
| `GET` | `/api/v2/triggers/runtime-sources` | runtime data sources 列表。 |
| `POST` | `/api/v2/triggers/find-latest-block` | 为 trigger 查找或准备 test input/block。 |

## Trigger Import

详情：[Trigger Import API](api-trigger-import.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/triggers/import/evm` | 加载 EVM ABI entries。 |
| `POST` | `/api/v2/triggers/import/evm/abi` | 按 contract address detect/load ABI。 |
| `POST` | `/api/v2/triggers/import/evm/drafts` | 生成 EVM trigger drafts。 |
| `POST` | `/api/v2/triggers/import/substrate/drafts` | 生成 Substrate trigger drafts。 |
| `GET` | `/api/v2/triggers/substrate/source` | 获取 Substrate source info。 |
| `GET` | `/api/v2/triggers/substrate/pallets` | 获取 Substrate pallets 列表。 |
| `GET` | `/api/v2/triggers/substrate/pallet` | 获取一个 Substrate pallet 的 metadata。 |

## Templates

详情：[Templates API](api-templates.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects/:fullname/templates` | project templates 列表。 |
| `GET` | `/api/v2/projects/:fullname/template` | 获取 project root template。 |
| `POST` | `/api/v2/projects/:fullname/templates` | 创建 template/group。 |
| `GET` | `/api/v2/projects/:fullname/templates/:id` | 获取 template。 |
| `PUT` | `/api/v2/projects/:fullname/templates/:id` | 更新 template。 |
| `DELETE` | `/api/v2/projects/:fullname/templates/:id` | 删除 template。 |

## Subscriptions

详情：[Subscriptions API](api-subscriptions.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/subscriptions` | 当前 workspace/account subscriptions 列表。 |
| `POST` | `/api/v1/subscriptions` | 创建 subscription。 |
| `GET` | `/api/v1/subscriptions/:id` | 获取 subscription。 |
| `POST` | `/api/v1/subscriptions/:id` | 更新 subscription。 |
| `DELETE` | `/api/v1/subscriptions/:id` | 删除 subscription。 |
| `POST` | `/api/v1/subscriptions/:id/state` | 启用或关闭 subscription。 |
| `POST` | `/api/v2/subscriptions/test` | Test subscription。 |
| `GET` | `/api/v2/subscriptions/alerts/history` | Workspace subscription logs。 |
| `GET` | `/api/v2/subscriptions/:id/alerts/history` | 指定 subscription 的 logs。 |

## Resources

详情：[Resources API](api-resources.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/resources` | resources 列表。 |
| `GET` | `/api/v2/resources/:fullname` | 获取 resource。 |
| `PUT` | `/api/v2/resources/:fullname` | 创建或更新 resource。 |
| `DELETE` | `/api/v2/resources/:fullname` | 删除 resource。 |
| `GET` | `/api/v2/resources/external/:token` | 通过 token 打开 external resource setup。 |
| `POST` | `/api/v2/resources/external/:token` | 发送 external resource setup payload。 |

## Data Sources

详情：[Data Sources API](api-data-sources.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/custom-sources` | custom data sources 列表。 |
| `GET` | `/api/v2/custom-sources/create-capability` | 检查 custom source 创建能力。 |
| `POST` | `/api/v2/custom-sources/verify` | 验证 custom source config。 |
| `GET` | `/api/v2/custom-sources/:fullname` | 获取 custom source。 |
| `PUT` | `/api/v2/custom-sources/:fullname` | 创建或更新 custom source。 |
| `DELETE` | `/api/v2/custom-sources/:fullname` | 删除 custom source。 |
| `GET` | `/api/v2/custom-sources/:fullname/logs` | 获取 custom source logs。 |
| `POST` | `/api/v2/custom-sources/:fullname/test-status` | 检查 custom source status。 |
| `POST` | `/api/v2/custom-sources/:fullname/restart` | 重启 custom source。 |
| `POST` | `/api/v2/custom-sources/:fullname/reset-lag` | reset custom source lag。 |

## Addresses

详情：[Addresses API](api-addresses.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/addressbook` | addresses 列表。 |
| `POST` | `/api/v1/addressbook` | 创建 address。 |
| `POST` | `/api/v1/addressbook/:id` | 更新 address。 |
| `DELETE` | `/api/v1/addressbook/:id` | 删除 address。 |

## Apps, Actions, Blueprints and Types

详情：[Apps, Actions, Blueprints and Types API](api-builder-registry.md)。

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/apps` | apps 列表。 |
| `GET` | `/api/v2/apps/:fullname` | 获取 app。 |
| `PUT` | `/api/v2/apps/:fullname` | 创建或更新 app。 |
| `DELETE` | `/api/v2/apps/:fullname` | 删除 app。 |
| `GET` | `/api/v2/actions` | actions 列表。 |
| `GET` | `/api/v2/actions/:fullname` | 获取 action。 |
| `PUT` | `/api/v2/actions/:fullname` | 创建或更新 action。 |
| `DELETE` | `/api/v2/actions/:fullname` | 删除 action。 |
| `GET` | `/api/v2/blueprints` | blueprints 列表。 |
| `GET` | `/api/v2/blueprints/:fullname` | 获取 blueprint。 |
| `PUT` | `/api/v2/blueprints/:fullname` | 创建或更新 blueprint。 |
| `DELETE` | `/api/v2/blueprints/:fullname` | 删除 blueprint。 |
| `GET` | `/api/v2/types` | shared types 列表。 |
| `GET` | `/api/v2/types/:fullname` | 获取 shared type。 |
| `PUT` | `/api/v2/types/:fullname` | 创建或更新 shared type。 |
| `DELETE` | `/api/v2/types/:fullname` | 删除 shared type。 |
