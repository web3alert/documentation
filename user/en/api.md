# API

Web3alert API lets you work with the same entities as the web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources, and addresses.

Base URL:

```text
https://web3alert.io
```

All public client endpoints use canonical `/api/*` paths. Service-to-service
endpoints are not part of this public API reference.

## Auth

User requests use personal access token:

```http
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Token can be obtained in [Account parameters](account.md#personal-access-token).

Endpoint access depends on:

- account tier;
- user role in workspace;
- project/data source/resource access level;
- entity state.

External API requests are limited by tier. Detailed values are described in [Limits](limits.md#api-and-mcp).

## Response format

Successful response returns endpoint JSON.

Detailed response body structures are described in [Types](types.md).

Error is returned in this format:

```json
{
  "error": {
    "message": "error message",
    "details": {}
  }
}
```

When external API limit is exceeded, `429` is returned with headers:

```http
Retry-After: 10
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Details: [Account API](api-account.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/token` | Create or get API token after auth flow. |
| `GET` | `/api/me` | Get current account, identity, tier, and memberships. |
| `DELETE` | `/api/me` | Delete current account. |
| `PUT` | `/api/me/meta` | Update account metadata. |
| `POST` | `/api/me/avatar` | Upload current account avatar. |
| `GET` | `/api/me/workspace` | Get current workspace account. |
| `PUT` | `/api/me/workspace` | Change current workspace account. |
| `GET` | `/api/account/settings` | Get account settings. |
| `PUT` | `/api/account/settings` | Save account settings. |

## Workspaces

Details: [Workspaces API](api-workspaces.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/workspaces` | List current account workspaces. |
| `GET` | `/api/workspaces/:fullname` | Get workspace. |
| `PUT` | `/api/workspaces/:fullname` | Create or update workspace. |
| `DELETE` | `/api/workspaces/:fullname` | Delete workspace. |
| `POST` | `/api/workspaces/:fullname/avatar` | Upload workspace avatar. |
| `GET` | `/api/workspaces/:workspace/acl` | Get workspace members/ACL. |
| `POST` | `/api/workspaces/:workspace/acl` | Create invite or ACL entry. |
| `PUT` | `/api/workspaces/:workspace/acl/:entryId` | Change member role. |
| `DELETE` | `/api/workspaces/:workspace/acl/:entryId` | Delete member/ACL entry. |

## Projects

Details: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | List available projects. |
| `GET` | `/api/projects/create-capability` | Check project creation capability. |
| `GET` | `/api/projects/:fullname` | Get project. |
| `PUT` | `/api/projects/:fullname` | Create or update project. |
| `DELETE` | `/api/projects/:fullname` | Delete project. |
| `GET` | `/api/projects/by-link/:token` | Open private project by access link. |
| `POST` | `/api/projects/:fullname/access-links` | Create project access link. |
| `POST` | `/api/projects/:fullname/assets/images` | Upload project icon or cover. |
| `DELETE` | `/api/projects/:fullname/images/:asset` | Delete uploaded project image. |

## Project Transfers

Details: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects/:fullname/transfer/plan` | Get project transfer plan. |
| `POST` | `/api/projects/:fullname/transfer-requests` | Create transfer request. |
| `GET` | `/api/project-transfer-requests` | List incoming/outgoing transfer requests. |
| `POST` | `/api/project-transfer-requests/:id/accept` | Accept transfer request. |
| `POST` | `/api/project-transfer-requests/:id/reject` | Reject transfer request. |
| `POST` | `/api/project-transfer-requests/:id/cancel` | Cancel outgoing transfer request. |

## Triggers

Details: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/triggers` | List triggers with filters. |
| `GET` | `/api/triggers/:fullname` | Get trigger. |
| `PUT` | `/api/triggers/:fullname` | Create or fully save trigger. |
| `PATCH` | `/api/triggers/:fullname` | Partially update trigger. |
| `DELETE` | `/api/triggers/:fullname` | Delete trigger. |
| `POST` | `/api/triggers/patch` | Bulk patch triggers. |
| `POST` | `/api/triggers/remove` | Bulk remove triggers. |
| `GET` | `/api/triggers/:fullname/draft` | Get trigger draft view. |
| `PUT` | `/api/triggers/:fullname/draft` | Save trigger draft. |
| `POST` | `/api/triggers/:fullname/draft/validate` | Validate trigger draft. |
| `GET` | `/api/triggers/:fullname/logs` | Get aggregated trigger delivery and source-pressure logs. |
| `POST` | `/api/triggers/:fullname/reset-test-status` | Reset trigger test status. |
| `POST` | `/api/triggers/preview` | Preview activation and transforms against an input. |
| `POST` | `/api/triggers/test` | Test trigger on sample source item. |
| `POST` | `/api/triggers/test-block` | Test trigger on a specific block. |
| `POST` | `/api/triggers/providers/test` | Test one provider. |
| `GET` | `/api/triggers/hypercore/actions` | List HyperCore actions available to the builder. |
| `GET` | `/api/triggers/runtime-sources` | List runtime data sources. |
| `POST` | `/api/triggers/find-latest-block` | Find or prepare test input/block for trigger. |

## Trigger Import

Details: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/triggers/import/evm` | Load EVM ABI entries without saving triggers. |
| `POST` | `/api/triggers/import/evm/abi` | Detect/load ABI by contract address. |
| `POST` | `/api/triggers/import/evm/drafts` | Generate EVM trigger drafts. |
| `POST` | `/api/triggers/import/hypercore/drafts` | Generate HyperCore trigger drafts. |
| `POST` | `/api/triggers/import/solana/idl` | Load Solana IDL metadata. |
| `POST` | `/api/triggers/import/solana/drafts` | Generate Solana trigger drafts. |
| `POST` | `/api/triggers/import/substrate/drafts` | Generate Substrate trigger drafts. |
| `GET` | `/api/triggers/substrate/source` | Get Substrate source info. |
| `GET` | `/api/triggers/substrate/pallets` | Get Substrate pallet list. |
| `GET` | `/api/triggers/substrate/pallet` | Get metadata of one Substrate pallet. |

## Templates

Details: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/:fullname/templates` | List project templates. |
| `GET` | `/api/projects/:fullname/template` | Get project root template. |
| `POST` | `/api/projects/:fullname/templates` | Create template/group. |
| `GET` | `/api/projects/:fullname/templates/:id` | Get template. |
| `PUT` | `/api/projects/:fullname/templates/:id` | Update template. |
| `DELETE` | `/api/projects/:fullname/templates/:id` | Delete template. |

## Subscriptions

Details: [Subscriptions API](api-subscriptions.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/subscriptions` | List current workspace/account subscriptions. |
| `POST` | `/api/subscriptions` | Create subscription. |
| `GET` | `/api/subscriptions/:id` | Get subscription. |
| `PUT` | `/api/subscriptions/:id` | Update subscription. |
| `DELETE` | `/api/subscriptions/:id` | Delete subscription. |
| `PUT` | `/api/subscriptions/:id/state` | Enable or disable subscription. |
| `POST` | `/api/subscriptions/test` | Test subscription. |
| `GET` | `/api/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/subscriptions/:id/alerts/history` | Logs for a specific subscription. |

## Resources

Details: [Resources API](api-resources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/resources` | List resources. |
| `GET` | `/api/resources/:fullname` | Get resource. |
| `PUT` | `/api/resources/:fullname` | Create or update resource. |
| `DELETE` | `/api/resources/:fullname` | Delete resource. |
| `POST` | `/api/resources/:fullname/setup-sessions` | Start a Telegram destination setup session. |
| `GET` | `/api/resources/:fullname/setup-sessions/:id` | Get setup-session status. |
| `DELETE` | `/api/resources/:fullname/setup-sessions/:id` | Cancel a setup session. |
| `GET` | `/api/resources/external/:token` | Open external resource setup by token. |
| `POST` | `/api/resources/external/:token` | Submit external resource setup payload. |

The three setup-session routes are available only when secure Telegram
destination setup is enabled on the server.

## Data Sources

Details: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/custom-sources` | List custom data sources. |
| `GET` | `/api/custom-sources/create-capability` | Check custom source creation capability. |
| `POST` | `/api/custom-sources/verify` | Verify custom source config. |
| `GET` | `/api/custom-sources/:fullname` | Get custom source. |
| `PUT` | `/api/custom-sources/:fullname` | Create or update custom source. |
| `DELETE` | `/api/custom-sources/:fullname` | Delete custom source. |
| `GET` | `/api/custom-sources/:fullname/logs` | Get custom source logs. |
| `POST` | `/api/custom-sources/:fullname/test-status` | Check custom source status. |
| `POST` | `/api/custom-sources/:fullname/restart` | Restart custom source. |
| `POST` | `/api/custom-sources/:fullname/reset-lag` | Reset custom source lag. |

## Billing

Details: [Billing API](api-billing.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/billing/overview` | Get the current account billing overview. |
| `GET` | `/api/billing/wallet/overview` | Get the balance and wallet overview. |
| `POST` | `/api/billing/wallet/crypto-topup` | Create a crypto balance top-up. |
| `POST` | `/api/billing/wallet/topup/refresh` | Refresh top-up state. |
| `POST` | `/api/billing/account-plan/balance-purchase` | Purchase or upgrade an account plan from balance. |
| `POST` | `/api/billing/account-plan/checkout` | Create an account-plan checkout. |
| `POST` | `/api/billing/account-plan/crypto-checkout` | Create a direct crypto checkout for an account plan. |
| `POST` | `/api/billing/project-addon/balance-purchase` | Purchase a project add-on from balance. |
| `POST` | `/api/billing/project-addon/checkout` | Create a project add-on checkout. |
| `POST` | `/api/billing/project-addon/crypto-checkout` | Create a direct crypto checkout for a project add-on. |
| `POST` | `/api/billing/coupon/redeem` | Redeem a coupon. |
| `POST` | `/api/billing/coupon/gift-purchase` | Purchase a gift coupon from balance. |
| `GET` | `/api/billing/referral/overview` | Get the referral balance and link summary. |
| `POST` | `/api/billing/referral/link/create` | Create a referral link. |
| `POST` | `/api/billing/referral/claim` | Claim a referral code. |
| `POST` | `/api/billing/subscription/update-renewal` | Update automatic billing renewal. |
| `POST` | `/api/billing/crypto-checkout/refresh` | Refresh crypto checkout state. |
| `POST` | `/api/billing/crypto-checkout/cancel` | Cancel a crypto checkout. |

## Addresses

Details: [Addresses API](api-addresses.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/addresses` | List addresses. |
| `POST` | `/api/addresses` | Create address. |
| `PUT` | `/api/addresses/:id` | Update address. |
| `DELETE` | `/api/addresses/:id` | Delete address. |

## Apps, Actions, Blueprints and Types

Details: [Apps, Actions, Blueprints and Types API](api-builder-registry.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/apps` | List apps. |
| `GET` | `/api/apps/:fullname` | Get app. |
| `PUT` | `/api/apps/:fullname` | Create or update app. |
| `DELETE` | `/api/apps/:fullname` | Delete app. |
| `GET` | `/api/actions` | List actions. |
| `GET` | `/api/actions/:fullname` | Get action. |
| `PUT` | `/api/actions/:fullname` | Create or update action. |
| `DELETE` | `/api/actions/:fullname` | Delete action. |
| `GET` | `/api/blueprints` | List blueprints. |
| `GET` | `/api/blueprints/:fullname` | Get blueprint. |
| `PUT` | `/api/blueprints/:fullname` | Create or update blueprint. |
| `DELETE` | `/api/blueprints/:fullname` | Delete blueprint. |
| `GET` | `/api/types` | List shared types. |
| `GET` | `/api/types/lookup` | Resolve dynamic type lookup options. |
| `GET` | `/api/types/:fullname` | Get shared type. |
| `PUT` | `/api/types/:fullname` | Create or update shared type. |
| `DELETE` | `/api/types/:fullname` | Delete shared type. |
