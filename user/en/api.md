# API

Web3alert API lets you work with the same entities as the web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources, and addresses.

Base URL:

```text
https://web3alert.io
```

The main API version for marketplace and builder functionality is `v2`. Some account/subscription/address book endpoints still remain in `v1`.

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
| `POST` | `/api/v1/token` | Create or get API token after auth flow. |
| `GET` | `/api/v1/me` | Get current account, identity, tier, and memberships. |
| `DELETE` | `/api/v1/me` | Delete current account. |
| `PUT` | `/api/v1/me/meta` | Update account metadata. |
| `POST` | `/api/v1/me/avatar` | Upload current account avatar. |
| `GET` | `/api/v1/me/workspace` | Get current workspace account. |
| `POST` | `/api/v1/me/workspace` | Change current workspace account. |
| `GET` | `/api/v1/account/settings` | Get account settings. |
| `POST` | `/api/v1/account/settings` | Save account settings. |

## Workspaces

Details: [Workspaces API](api-workspaces.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/workspaces` | List current account workspaces. |
| `GET` | `/api/v2/workspaces/:fullname` | Get workspace. |
| `PUT` | `/api/v2/workspaces/:fullname` | Create or update workspace. |
| `DELETE` | `/api/v2/workspaces/:fullname` | Delete workspace. |
| `POST` | `/api/v2/workspaces/:fullname/avatar` | Upload workspace avatar. |
| `GET` | `/api/v2/workspaces/:workspace/acl` | Get workspace members/ACL. |
| `POST` | `/api/v2/workspaces/:workspace/acl` | Create invite or ACL entry. |
| `PUT` | `/api/v2/workspaces/:workspace/acl/:entryId` | Change member role. |
| `DELETE` | `/api/v2/workspaces/:workspace/acl/:entryId` | Delete member/ACL entry. |

## Projects

Details: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects` | List available projects. |
| `GET` | `/api/v2/projects/create-capability` | Check project creation capability. |
| `GET` | `/api/v2/projects/:fullname` | Get project. |
| `PUT` | `/api/v2/projects/:fullname` | Create or update project. |
| `DELETE` | `/api/v2/projects/:fullname` | Delete project. |
| `GET` | `/api/v2/projects/by-link/:token` | Open private project by access link. |
| `POST` | `/api/v2/projects/:fullname/access-links` | Create project access link. |
| `POST` | `/api/v2/projects/:fullname/assets/images` | Upload project icon or cover. |
| `DELETE` | `/api/v2/projects/:fullname/images/:asset` | Delete uploaded project image. |

## Project Transfers

Details: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/projects/:fullname/transfer/plan` | Get project transfer plan. |
| `POST` | `/api/v2/projects/:fullname/transfer-requests` | Create transfer request. |
| `GET` | `/api/v2/project-transfer-requests` | List incoming/outgoing transfer requests. |
| `POST` | `/api/v2/project-transfer-requests/:id/accept` | Accept transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/reject` | Reject transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/cancel` | Cancel outgoing transfer request. |

## Triggers

Details: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/triggers` | List triggers with filters. |
| `GET` | `/api/v2/triggers/:fullname` | Get trigger. |
| `PUT` | `/api/v2/triggers/:fullname` | Create or fully save trigger. |
| `PATCH` | `/api/v2/triggers/:fullname` | Partially update trigger. |
| `DELETE` | `/api/v2/triggers/:fullname` | Delete trigger. |
| `POST` | `/api/v2/triggers/patch` | Bulk patch triggers. |
| `POST` | `/api/v2/triggers/remove` | Bulk remove triggers. |
| `GET` | `/api/v2/triggers/:fullname/draft` | Get trigger draft view. |
| `PUT` | `/api/v2/triggers/:fullname/draft` | Save trigger draft. |
| `POST` | `/api/v2/triggers/:fullname/draft/validate` | Validate trigger draft. |
| `POST` | `/api/v2/triggers/preview` | Preview trigger execution. |
| `POST` | `/api/v2/triggers/test` | Test trigger on sample source item. |
| `POST` | `/api/v2/triggers/test-block` | Test trigger on a specific block. |
| `POST` | `/api/v2/triggers/providers/test` | Test one provider. |
| `GET` | `/api/v2/triggers/runtime-sources` | List runtime data sources. |
| `POST` | `/api/v2/triggers/find-latest-block` | Find or prepare test input/block for trigger. |

## Trigger Import

Details: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/triggers/import/evm` | Load EVM ABI entries. |
| `POST` | `/api/v2/triggers/import/evm/abi` | Detect/load ABI by contract address. |
| `POST` | `/api/v2/triggers/import/evm/drafts` | Generate EVM trigger drafts. |
| `POST` | `/api/v2/triggers/import/substrate/drafts` | Generate Substrate trigger drafts. |
| `GET` | `/api/v2/triggers/substrate/source` | Get Substrate source info. |
| `GET` | `/api/v2/triggers/substrate/pallets` | Get Substrate pallet list. |
| `GET` | `/api/v2/triggers/substrate/pallet` | Get metadata of one Substrate pallet. |

## Templates

Details: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects/:fullname/templates` | List project templates. |
| `GET` | `/api/v2/projects/:fullname/template` | Get project root template. |
| `POST` | `/api/v2/projects/:fullname/templates` | Create template/group. |
| `GET` | `/api/v2/projects/:fullname/templates/:id` | Get template. |
| `PUT` | `/api/v2/projects/:fullname/templates/:id` | Update template. |
| `DELETE` | `/api/v2/projects/:fullname/templates/:id` | Delete template. |

## Subscriptions

Details: [Subscriptions API](api-subscriptions.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/subscriptions` | List current workspace/account subscriptions. |
| `POST` | `/api/v1/subscriptions` | Create subscription. |
| `GET` | `/api/v1/subscriptions/:id` | Get subscription. |
| `POST` | `/api/v1/subscriptions/:id` | Update subscription. |
| `DELETE` | `/api/v1/subscriptions/:id` | Delete subscription. |
| `POST` | `/api/v1/subscriptions/:id/state` | Enable or disable subscription. |
| `POST` | `/api/v2/subscriptions/test` | Test subscription. |
| `GET` | `/api/v2/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/v2/subscriptions/:id/alerts/history` | Logs for a specific subscription. |

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

## Data Sources

Details: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/custom-sources` | List custom data sources. |
| `GET` | `/api/v2/custom-sources/create-capability` | Check custom source creation capability. |
| `POST` | `/api/v2/custom-sources/verify` | Verify custom source config. |
| `GET` | `/api/v2/custom-sources/:fullname` | Get custom source. |
| `PUT` | `/api/v2/custom-sources/:fullname` | Create or update custom source. |
| `DELETE` | `/api/v2/custom-sources/:fullname` | Delete custom source. |
| `GET` | `/api/v2/custom-sources/:fullname/logs` | Get custom source logs. |
| `POST` | `/api/v2/custom-sources/:fullname/test-status` | Check custom source status. |
| `POST` | `/api/v2/custom-sources/:fullname/restart` | Restart custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/reset-lag` | Reset custom source lag. |

## Addresses

Details: [Addresses API](api-addresses.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/addressbook` | List addresses. |
| `POST` | `/api/v1/addressbook` | Create address. |
| `POST` | `/api/v1/addressbook/:id` | Update address. |
| `DELETE` | `/api/v1/addressbook/:id` | Delete address. |

## Apps, Actions, Blueprints and Types

Details: [Apps, Actions, Blueprints and Types API](api-builder-registry.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/apps` | List apps. |
| `GET` | `/api/v2/apps/:fullname` | Get app. |
| `PUT` | `/api/v2/apps/:fullname` | Create or update app. |
| `DELETE` | `/api/v2/apps/:fullname` | Delete app. |
| `GET` | `/api/v2/actions` | List actions. |
| `GET` | `/api/v2/actions/:fullname` | Get action. |
| `PUT` | `/api/v2/actions/:fullname` | Create or update action. |
| `DELETE` | `/api/v2/actions/:fullname` | Delete action. |
| `GET` | `/api/v2/blueprints` | List blueprints. |
| `GET` | `/api/v2/blueprints/:fullname` | Get blueprint. |
| `PUT` | `/api/v2/blueprints/:fullname` | Create or update blueprint. |
| `DELETE` | `/api/v2/blueprints/:fullname` | Delete blueprint. |
| `GET` | `/api/v2/types` | List shared types. |
| `GET` | `/api/v2/types/:fullname` | Get shared type. |
| `PUT` | `/api/v2/types/:fullname` | Create or update shared type. |
| `DELETE` | `/api/v2/types/:fullname` | Delete shared type. |
