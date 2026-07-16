# Types

## Common

### OperationResult

| Field | Type | Description |
| --- | --- | --- |
| - | `{}` or empty response body | The endpoint completed successfully. |

### TokenResponse

| Field | Type | Description |
| --- | --- | --- |
| `token` | `string` | Bearer token for subsequent API/MCP requests. |

### AvatarUploadResult

| Field | Type | Description |
| --- | --- | --- |
| `url` | `string` | Uploaded avatar URL. |
| `fileName` | `string` | Stored file name. |
| `extension` | `string` | File extension. |
| `size` | `number` | File size in bytes. |

### TagsAndLabels

| Field | Type | Description |
| --- | --- | --- |
| `tags` | `string[]` | Short tags for filtering and grouping. |
| `labels` | `Record<string, string>` | Machine-readable labels. |

## Account

### Me

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id account. |
| `newid` | `string` | Compatible legacy account id field. |
| `tier` | `"free" \| "advanced" \| "pro"` | Current account tier. |
| `settings` | `object` | Account settings. |
| `meta.nickname` | `string` | Account display name. |
| `meta.avatar` | `string?` | Account avatar URL. |
| `token.identity` | `string` | Identity bound to the current token. |
| `workspace` | `WorkspaceView \| null` | Currently selected workspace. |
| `memberships` | `UserMembership[]` | Workspaces where the account is a member. |
| `addressbook` | `AddressEntry[]` | Addresses from the current workspace/account context. |
| `subscriptions` | `Record<string, number>` | Subscription counters by source/project key. |
| `counters.subscriptions` | `SubscriptionCounter[]` | Aggregated subscription counters. |

### UserMembership

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id membership/ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Role in the workspace. |
| `workspace` | `WorkspaceViewShort` | Workspace for this membership. |

### AccountSettings

| Field | Type | Description |
| --- | --- | --- |
| - | `object` | Settings object for the current UI version. The field set may expand. |

### CurrentWorkspaceResponse

| Field | Type | Description |
| --- | --- | --- |
| `workspace` | `WorkspaceView \| null` | Currently selected workspace or `null`. |

## Workspaces

### WorkspaceView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Unique workspace name. |
| `invite` | `string?` | Invite token. Returned only when the caller can see the private workspace data. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Visible workspace title. |
| `meta.avatar` | `string?` | Workspace avatar URL. |

### WorkspaceViewShort

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Workspace fullname. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta` | `object?` | Workspace metadata. |

### WorkspaceAclEntry

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Role. |
| `user` | `UserViewShort` | User if the entry is already linked to an account. |
| `object` | `{ type: string, id: string }?` | Workspace reference. May be present in the raw ACL response. |
| `subject` | `{ type: string, id: string }?` | User/invite reference. May be present in the raw ACL response. |

## Projects

### ProjectView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id project. |
| `createdAt` | `string?` | Creation date in ISO format. |
| `updatedAt` | `string?` | Update date in ISO format. |
| `createdByAccountId` | `string?` | Owner account id. |
| `billingAccountId` | `string?` | Billing owner account id. |
| `name` | `string` | Project name inside the workspace. |
| `fullname` | `string` | Canonical project fullname. |
| `workspace` | `string` | Owner workspace fullname. |
| `public` | `boolean` | Legacy public flag. |
| `visibility` | `"public" \| "private_link" \| "personal"?` | Storage visibility. |
| `accessLevel` | `"private" \| "public" \| "free"?` | Product access level. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Visible title. |
| `meta.description` | `string` | Full description. |
| `meta.shortDescription` | `string?` | Short description. |
| `meta.links` | `{ title: string, url: string }[]?` | Useful links. |
| `meta.icon` | `string?` | URL icon. |
| `meta.avatar` | `string?` | Avatar URL, usually the same as icon. |
| `meta.cover` | `string?` | URL cover. |
| `ownerTitle` | `string?` | Visible workspace/account owner title. |
| `triggerLimits.maxProvidersPerTrigger` | `number \| null` | Provider weight limit per trigger. The field name is preserved for API compatibility. |

### ProjectCreateCapability

| Field | Type | Description |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Current account tier. |
| `canCreateProjects` | `boolean` | Whether a project can be created. |
| `privateProjectsUsed` | `number` | How many private projects already count toward the limit. |
| `privateProjectsLimit` | `number \| null` | Private projects limit; `null` means unlimited. |
| `canCreatePrivateProjects` | `boolean` | Whether a private project can be created within the limit. |

### ProjectAccessLink

| Field | Type | Description |
| --- | --- | --- |
| `token` | `string` | Access link token. |
| `project` | `string` | Project fullname. |
| `maxUsages` | `number?` | Maximum number of uses. |
| `usages` | `number?` | Current number of uses. |
| `expiresAt` | `string?` | Expiration date in ISO format. |
| `createdAt` | `string?` | Creation date in ISO format. |

### ProjectImageUploadResult

| Field | Type | Description |
| --- | --- | --- |
| `url` | `string` | Uploaded image URL. |
| `fileName` | `string` | Stored file name. |
| `extension` | `string` | File extension. |
| `size` | `number` | File size in bytes. |

## Project Transfers

### ProjectTransferPlan

| Field | Type | Description |
| --- | --- | --- |
| `mode` | `"dry-run"` | Plan preview mode. |
| `source` | `ProjectTransferProjectRef` | Source project. |
| `target` | `ProjectTransferTargetRef` | Target workspace, name, and fullname. |
| `counts` | `ProjectTransferCounts` | Counters for what will be transferred. |
| `changes` | `ProjectTransferChanges` | Detailed list of planned changes. |
| `conflicts` | `ProjectTransferConflict[]` | Blocking conflicts. |
| `notes` | `string[]` | Additional notes. |
| `planHash` | `string?` | Plan hash, if the request creation endpoint returns it with the plan. |

### ProjectTransferCounts

| Field | Type | Description |
| --- | --- | --- |
| `triggers` | `number` | Triggers to transfer. |
| `templates` | `number` | Template records to transfer. |
| `templateGroups` | `number` | Template groups. |
| `templateTopics` | `number` | Template topics. |
| `subscriptions` | `number` | Subscriptions whose references will be affected. |
| `scopedEntities` | `number` | Apps/actions/resources/types/blueprints scoped to the project. |
| `projectAccessLinks` | `number` | Access links to update. |
| `aliasWrites` | `number` | Entity aliases to create or update. |
| `aliasMissing` | `number` | Missing aliases to create. |
| `aliasStale` | `number` | Stale aliases to update. |
| `conflicts` | `number` | Number of conflicts. |

### ProjectTransferRequest

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id request. |
| `sourceProjectId` | `string` | Source project id. |
| `sourceProjectFullname` | `string` | Source project fullname. |
| `sourceWorkspace` | `string` | Source workspace fullname. |
| `targetWorkspace` | `string` | Target workspace fullname. |
| `targetName` | `string` | Project name in the target workspace. |
| `targetFullname` | `string` | Project fullname in the target workspace. |
| `status` | `"pending" \| "accepted" \| "rejected" \| "cancelled" \| "expired" \| "failed"` | Request status. |
| `requestedByAccountId` | `string` | Account that created the request. |
| `sourceOwnerAccountId` | `string` | Current source owner account. |
| `targetOwnerAccountId` | `string` | Target owner account. |
| `planHash` | `string` | Accepted plan hash. |
| `planCounts` | `Record<string, number>` | Snapshot of plan counters. |
| `expiresAt` | `string` | Expiration date in ISO format. |
| `createdAt` | `string` | Creation date in ISO format. |
| `updatedAt` | `string` | Update date in ISO format. |
| `decidedAt` | `string?` | Decision date in ISO format. |
| `decidedByAccountId` | `string?` | Account that accepted, rejected, or cancelled the request. |
| `appliedAt` | `string?` | Apply date in ISO format. |
| `rejectedReason` | `string?` | Rejection reason. |
| `failureReason` | `string?` | Failure reason. |

### ProjectTransferAcceptResult

| Field | Type | Description |
| --- | --- | --- |
| `request` | `ProjectTransferRequest` | Accepted request. |
| `transfer` | `ProjectTransferApplyResult` | Details of the applied transfer. |

### ProjectTransferApplyResult

| Field | Type | Description |
| --- | --- | --- |
| `mode` | `"apply"` | Apply mode. |
| `appliedAt` | `string` | Apply date in ISO format. |
| `writes.projects` | `number` | Updated project records. |
| `writes.triggers` | `number` | Updated triggers. |
| `writes.triggerProviders` | `number` | Updated trigger providers. |
| `writes.triggerTransforms` | `number` | Updated trigger transforms. |
| `writes.templates` | `number` | Updated templates. |
| `writes.subscriptions` | `number` | Updated subscriptions. |
| `writes.scopedEntities` | `number` | Updated entities scoped to the project. |
| `writes.projectAccessLinks` | `number` | Updated access links. |
| `writes.aliases` | `number` | Written aliases. |

## Triggers

### TriggerView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Trigger id. |
| `createdAt` | `string?` | Creation date in ISO format. |
| `updatedAt` | `string?` | Update date in ISO format. |
| `name` | `string` | Trigger name inside the project. |
| `fullname` | `string` | Canonical trigger fullname. |
| `projectId` | `string?` | Id project. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Legacy public flag. |
| `backend` | `{ type: "sdk", trigger: string, values?: object }` | Backend runtime reference. |
| `inputs` | `Record<string, TypeSchema>` | Required subscription inputs. |
| `defaults` | `EventDefaults?` | Recommended notification defaults. |
| `output` | `Record<string, TypeSchema>?` | Legacy output schema. |
| `triggerSpec` | `TriggerSpec?` | Source matching specification. |
| `filtersSchema` | `Record<string, TriggerOutputSchemaField>?` | Optional subscription filters. |
| `outputSchema` | `Record<string, TriggerOutputSchemaField>?` | Raw/human output schema. |
| `activation` | `TriggerActivation \| null?` | Optional activation condition. |
| `executionPolicy` | `object?` | Runtime policy overrides. |
| `status` | `TriggerStatusDetails` | Test/runtime status. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Visible title. |
| `meta.description` | `string?` | Description. |
| `hasProviders` | `boolean?` | `true` if providers exist. |
| `hasTransform` | `boolean?` | `true` if transform exists. |

### TriggerDraftView

| Field | Type | Description |
| --- | --- | --- |
| `providers` | `TriggerProvider[]?` | Full provider definitions. |
| `transform` | `TriggerTransform?` | JavaScript raw/human transform. |

### TriggerStatusDetails

| Field | Type | Description |
| --- | --- | --- |
| `status` | `"not_tested" \| "ready" \| "broken"` | Current status. |
| `issue` | `string?` | Human-readable issue. |
| `source` | `"edit" \| "test" \| "runtime" \| "dependency"?` | Status source. |
| `updatedAt` | `string?` | Update date in ISO format. |

### TriggerSpec

| Variant | Main fields |
| --- | --- |
| `evm_log` | `type`, `dataSource`, optionally `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput`. |
| `evm_transaction` | `type`, `dataSource`, optionally `testInput`. |
| `substrate_event` | `type`, `dataSource`, optionally `pallet`, `event`, `testInput`. |
| `solana_event` | `type`, `dataSource`, optionally `programId`, `event`, `idl`, `testInput`. For calls, the `event` field stores a value prefixed with `call:`. |
| `timer` | `type`, `interval`, optionally `testInput`. |

### TriggerTransform

| Field | Type | Description |
| --- | --- | --- |
| `language` | `"javascript"` | Transform language. |
| `source` | `string?` | Legacy source. |
| `rawSource` | `string?` | Transform to raw output. |
| `humanSource` | `string?` | Transform raw output to human output. |

### TriggerActivation

| Field | Type | Description |
| --- | --- | --- |
| `language` | `"javascript"` | Activation language. |
| `source` | `string` | JavaScript condition source code. |

### TriggerValidationResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether the draft is valid. |
| `issues` | `string[]` | Validation issues. |
| `trigger` | `TriggerDraftView?` | Normalized trigger draft if the endpoint returns it. |

### TriggerPatchResult

| Field | Type | Description |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | `true` if changes were only validated. |
| `updated` | `boolean` | Whether the trigger was changed. |
| `changedPaths` | `string[]` | Dotted paths that were changed. |
| `trigger` | `TriggerDraftView` | Trigger after patch or normalized dry-run view. |

### TriggerBulkPatchResult

| Field | Type | Description |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` if the bulk patch was a dry run. |
| `totalCount` | `number` | Number of processed items. |
| `updatedCount` | `number` | Number of changed items. |
| `items` | `TriggerBulkPatchItem[]` | Results by trigger. |

### TriggerBulkPatchItem

| Field | Type | Description |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | `true` if the item was a dry run. |
| `updated` | `boolean` | Whether the trigger was changed. |
| `changedPaths` | `string[]` | Changed paths. |
| `status` | `string?` | Trigger status after patch. |
| `statusUpdatedAt` | `string?` | Status update date. |
| `unsetPaths` | `string[]` | Paths that were removed. |

### TriggerBulkRemoveResult

| Field | Type | Description |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` if the bulk remove was a dry run. |
| `totalCount` | `number` | Number of processed triggers. |
| `deletedCount` | `number` | Number of removed triggers. |
| `items` | `TriggerBulkRemoveItem[]` | Results by trigger. |

### TriggerBulkRemoveItem

| Field | Type | Description |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | `true` if the item was a dry run. |
| `deleted` | `boolean` | Whether the trigger was removed. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |

### TriggerPreviewResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether preview succeeded. |
| `issues` | `string[]` | Issues. |
| `output` | `unknown?` | Output preview. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### TriggerTestResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether the test succeeded. |
| `issues` | `string[]` | Test issues. |
| `input` | `unknown?` | Source item used for the test. |
| `output` | `unknown?` | Raw/human output. |
| `sourceEventsCount` | `number?` | Number of found source items. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### ProviderTestResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether the provider test succeeded. |
| `issues` | `string[]` | Issues. |
| `result` | `unknown?` | Provider output. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### RuntimeSource

| Field | Type | Description |
| --- | --- | --- |
| `app` | `string` | Runtime app name. |
| `network` | `string` | Network/source name. |
| `plugin` | `"evm" \| "substrate" \| "solana"` | Runtime plugin type. |
| `instance` | `string` | Runtime instance. |
| `status` | `"running" \| "degraded" \| "error"` | Runtime status. |
| `updatedAt` | `string` | Update date in ISO format. |
| `latestSeenBlock` | `number?` | Last block seen by runtime. |
| `lastProcessedBlock` | `number?` | Last processed block. |
| `blockLag` | `number?` | Current block lag. |
| `lastFailedBlock` | `number?` | Last failed block. |
| `errorsLastHour` | `number?` | Error count in the last hour. |

### LatestBlockResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether lookup succeeded. |
| `issues` | `string[]` | Lookup issues. |
| `latestBlock` | `number?` | Found latest block. |
| `matched` | `boolean` | Whether a matching source item was found. |
| `matchedBlock` | `number?` | Block where the match was found. |
| `checkedBlocks` | `number` | Number of checked blocks. |
| `sourceEventsCount` | `number?` | Source event count. |
| `itemIndex` | `number?` | Found item index. |
| `input` | `unknown?` | Found input. |
| `source` | `string?` | Lookup source. |
| `details` | `unknown?` | Additional details. |

## Trigger Import

### EvmAbiImportResult

| Field | Type | Description |
| --- | --- | --- |
| `events` | `unknown[]?` | Parsed ABI event entries. |
| `calls` | `unknown[]?` | Parsed ABI call/function entries. |
| `items` | `unknown[]?` | Unified list of parsed entries if runtime returns a flat list. |
| `error` | `string?` | Error message if runtime could not parse ABI. |

### EvmAbiResult

| Field | Type | Description |
| --- | --- | --- |
| `abi` | `unknown[]?` | ABI JSON entries if ABI was loaded. |
| `source` | `string?` | ABI source marker. |
| `contract` | `string?` | Contract address. |
| `error` | `string?` | Error message if ABI could not be loaded. |

### TriggerImportDraftsResult

| Field | Type | Description |
| --- | --- | --- |
| `abiSource` | `"provided" \| "auto"?` | ABI source used for EVM import. |
| `drafts` | `TriggerDraftView[]` | Generated trigger drafts. |

### SubstrateSourceInfo

| Field | Type | Description |
| --- | --- | --- |
| `ss58Prefix` | `number` | SS58 prefix for the Substrate source. |

### SubstratePalletSummary

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Pallet name. |
| `docs` | `string[]` | Pallet documentation. |
| `hasEvents` | `boolean` | Whether the pallet has events. |
| `hasCalls` | `boolean` | Whether the pallet has calls. |
| `eventCount` | `number` | Number of events. |
| `callCount` | `number` | Number of calls. |

## Templates

### ProjectTemplate

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `project` | `string` | Project fullname. |
| `schema` | `Record<string, TypeSchema>` | Template-level input schema. |
| `groups` | `TemplateGroup[]` | Groups shown to users as templates. |
| `topics` | `TemplateTopic[]` | Topics inside groups. |
| `rules` | `TemplateRule[]` | Trigger rules for topics. |
| `meta` | `Record<string, unknown>` | Template metadata. |
| `issue` | `string?` | Template sync issue. |

### TemplateGroup

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Group id. |
| `meta.title` | `string` | Visible title. |
| `meta.description` | `string` | Description. |

### TemplateTopic

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Id topic. |
| `group` | `string` | Parent group id. |
| `selectedByDefault` | `boolean` | Whether the topic is selected by default in the subscription wizard. |
| `meta.title` | `string` | Visible title. |

### TemplateRule

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Rule id. |
| `trigger` | `string` | Trigger fullname. |
| `topic` | `string` | Topic name. |
| `inputs` | `object?` | Input mapping/defaults for the rule. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |
| `deprecated` | `boolean` | Whether the rule is marked as deprecated. |
| `requiredValues` | `string[]` | Required template values. |
| `issue` | `string?` | Missing trigger or sync issue. |

## Subscriptions

### SubscriptionView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id subscription. |
| `targetWorkspaceFullname` | `string?` | Workspace that owns the subscription. |
| `createdByAccountId` | `string?` | Account that created the subscription. |
| `sourceProjectId` | `string?` | Source project id. |
| `sourceProjectFullname` | `string?` | Source project fullname. |
| `countsTowardsTierQuota` | `boolean?` | Whether the subscription counts toward the Free tier quota. |
| `state` | `"on" \| "off" \| "blocked"` | Subscription state. |
| `createdAt` | `string` | Creation date in ISO format. |
| `updatedAt` | `string` | Update date in ISO format. |
| `template` | `SubscriptionTemplateReference \| null` | Template reference or `null` for a direct trigger subscription. |
| `rules` | `SubscriptionRule[]` | Trigger rules. |
| `resources` | `string[]` | Resource fullnames used by actions. |
| `actions` | `SubscriptionAction[]?` | Notification actions. |
| `references` | `SubscriptionReferences` | Denormalized references to source/project/trigger. |
| `meta.title` | `string?` | Visible title. |
| `meta.issue` | `string?` | Block/entitlement/migration issue. |

### SubscriptionTemplateReference

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `inputs` | `Record<string, string \| number>` | Template input values. |
| `groups` | `{ name: string, meta: { title: string } }[]` | Selected groups. |
| `topics` | `string[]` | Selected topics. |
| `rules` | `{ id: string, group: string }[]` | Selected rule references. |

### SubscriptionRule

| Field | Type | Description |
| --- | --- | --- |
| `triggerId` | `string?` | Trigger id. |
| `trigger` | `RuleTriggerReference` | Trigger reference. |
| `inputs` | `object?` | Input values. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |

### SubscriptionAction

| Field | Type | Description |
| --- | --- | --- |
| `action` | `string` | Action fullname. |
| `values` | `Record<string, unknown>` | Action values. |
| `overrides` | `EventDefaults?` | Notification override fields. |

### SubscriptionReferences

| Field | Type | Description |
| --- | --- | --- |
| `sources` | `string[]` | References to data sources. |
| `projects` | `string[]` | Project fullnames. |
| `triggers` | `string[]` | Trigger fullnames. |
| `projectIds` | `string[]?` | Project ids. |
| `triggerIds` | `string[]?` | Trigger ids. |

### SubscriptionTestResult

| Field | Type | Description |
| --- | --- | --- |
| `valid` | `boolean` | Whether the test is valid. |
| `issues` | `string[]` | Test issues. |
| `preview` | `unknown?` | Notification preview/send result. |
| `subscription` | `SubscriptionView?` | Draft subscription used for the test. |

### SubscriptionAlertLog

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Log id. |
| `subscriptionId` | `string` | Id subscription. |
| `workspaceId` | `string` | Id workspace. |
| `projectFullname` | `string?` | Project fullname. |
| `triggerFullname` | `string?` | Trigger fullname. |
| `eventName` | `string` | Event/trigger name. |
| `createdAt` | `string` | Creation date in ISO format. |
| `status` | `"delivered" \| "failed" \| "rate_limited" \| "blocked"` | Delivery status. |
| `testInput` | `Record<string, unknown>?` | Test input. |
| `itemIndex` | `number?` | Source item index. |
| `replayMatch` | `{ hash?: string \| null, index?: number \| null }?` | Replay match information. |
| `sourceItemsCount` | `number?` | Number of source items. |
| `channels` | `SubscriptionAlertLogChannel[]` | Delivery channels. |
| `failureReasonCode` | `string?` | Error code. |
| `failureReasonMessage` | `string?` | Error message. |
| `expireAt` | `string` | Log expiration date. |

## Resources

### ResourceView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id resource. |
| `name` | `string` | Resource name. |
| `fullname` | `string` | Resource fullname. |
| `project` | `string?` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Public flag. |
| `blueprint` | `string` | Blueprint fullname. |
| `token` | `string?` | Secret token. Returned only when the caller can see private resource fields. |
| `ready` | `boolean` | Whether the resource is ready. |
| `remark` | `string \| null` | Resource status remark. |
| `data` | `object \| null?` | Resource setup data. |
| `destinationSummary` | `TelegramResourceDestinationSummary?` | Sanitized destination details. Present only in the owner-private view of a configured Telegram external resource; omitted from public and short views. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Visible title. |

### TelegramResourceDestinationSummary

| Field | Type | Description |
| --- | --- | --- |
| `service` | `"telegram"` | Delivery service. |
| `title` | `string` | Visible destination title. |
| `kind` | `"private" \| "group" \| "supergroup" \| "channel"?` | Telegram destination kind, when available. |
| `topic` | `object?` | Selected forum topic, when configured. |
| `topic.messageThreadId` | `number` | Telegram forum topic thread id. |
| `topic.title` | `string?` | Visible forum topic title. |

### ExternalResourceView

| Field | Type | Description |
| --- | --- | --- |
| `blocks` | `{ type: "markdown", text: string }[]` | UI content blocks returned by the external app. |

## Data Sources

### CustomSourceListView

| Field | Type | Description |
| --- | --- | --- |
| `workspace` | `string` | Owner workspace fullname. |
| `name` | `string` | Source name. |
| `fullname` | `string` | Source fullname. |
| `public` | `boolean` | Public flag. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Source type. |
| `meta` | `CustomSourceMeta` | Metadata. |
| `createdAt` | `string` | Creation date in ISO format. |
| `updatedAt` | `string` | Update date in ISO format. |
| `deployerTitle` | `string?` | Visible deployer/owner title. |

### CustomSource

| Field | Type | Description |
| --- | --- | --- |
| `createdByAccountId` | `string?` | Creator account id. |
| `endpoints` | `string[]` | Runtime RPC endpoints. |
| `substrate` | `object?` | Substrate extensions/types/RPC config. |
| `batchMaxCount` | `number?` | Maximum EVM batch size. |
| `blockProcessingConcurrency` | `number?` | Block processing concurrency. |
| `maxQueuedBlocks` | `number?` | Maximum queued blocks. |
| `logs` | `{ retentionMs: number, maxCount: number \| null }?` | Policy log runtime. |
| `runtime` | `CustomSourceRuntimeMetadata?` | Runtime metadata. |

### CustomSourceMeta

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | Visible title. |
| `description` | `string?` | Description. |
| `icons.default` | `string?` | Default icon URL. |
| `og` | `object?` | OpenGraph metadata. |

### CustomSourceRuntimeMetadata

| Field | Type | Description |
| --- | --- | --- |
| `evm.chainId` | `number?` | EVM chain id. |
| `evm.latestBlock` | `number?` | Latest EVM block. |
| `evm.blockHash` | `string?` | Block hash. |
| `evm.fetchedAt` | `string` | Metadata fetch date. |
| `substrate.ss58Prefix` | `number?` | SS58 prefix. |
| `substrate.latestBlock` | `number?` | Latest Substrate block. |
| `substrate.fetchedAt` | `string` | Metadata fetch date. |
| `solana.genesisHash` | `string?` | Solana network genesis hash. |
| `solana.latestBlock` | `number?` | Latest Solana slot/block. |
| `solana.blockHash` | `string?` | Block hash. |
| `solana.fetchedAt` | `string` | Metadata fetch date. |

### CustomSourceCreateCapability

| Field | Type | Description |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Account tier. |
| `canCreateCustomSources` | `boolean` | Whether the current account can create custom sources. |
| `customSourcesUsed` | `number` | Current number of private custom sources. |
| `customSourcesLimit` | `number \| null` | Limit; `null` means unlimited. |

### CustomSourceVerifyResult

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `boolean` | Whether verification succeeded. |
| `logs` | `{ level: "info" \| "error", message: string }[]` | Verification log messages. |
| `details` | `Record<string, unknown>?` | Runtime/public duplicate check details. |
| `error` | `string?` | Verification error. |

### CustomSourceLogsResult

| Field | Type | Description |
| --- | --- | --- |
| `exists` | `boolean` | Whether the log file exists. |
| `lines` | `string[]` | Edited log lines. |
| `truncated` | `boolean` | Whether output was truncated. |
| `updatedAt` | `string?` | Log file update date. |

### CustomSourceRuntimeActionResult

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `true` | Whether the runtime action succeeded. |
| `sourceFullname` | `string` | Source fullname. |
| `revision` | `number` | Runtime revision after restart/reset. |

### CustomSourceResetLagResult

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `true` | Whether reset succeeded. |
| `latestBlock` | `number` | Last block used as the new lag baseline. |

### CustomSourceStatusTestResult

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `true` | Test event sent. |
| `eventName` | `string` | Generated status trigger name. |
| `subscriptionsTested` | `number` | Tested subscriptions. |
| `matched` | `number` | Number of matched subscriptions. |
| `delivered` | `number` | Delivered alerts. |
| `event` | `CustomSourceStatusEvent` | Test status event. |

### CustomSourceStatusEvent

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"status_changed" \| "error" \| "recovered"` | Event type. |
| `sourceFullname` | `string` | Source fullname. |
| `sourceName` | `string` | Source name. |
| `sourceTitle` | `string` | Visible title. |
| `workspace` | `string` | Workspace fullname. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Source type. |
| `status` | `"running" \| "error" \| "degraded"` | New status. |
| `previousStatus` | `"running" \| "error" \| "degraded"?` | Previous status. |
| `severity` | `"info" \| "warning" \| "error"` | Severity. |
| `message` | `string` | Human-readable message. |
| `code` | `string?` | Machine-readable code. |
| `details` | `Record<string, unknown>?` | Additional details. |
| `timestamp` | `string` | Event time in ISO format. |

## Addresses

### AddressEntry

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id address entry. |
| `type` | `"plain" \| "ss58" \| "evm" \| "bitcoin" \| "cosmos"` | Type address. |
| `address` | `string` | Address value. |
| `alias` | `string` | Visible alias. |

## Builder Registry

### AppView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id app. |
| `name` | `string` | App name. |
| `fullname` | `string` | App fullname. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Public flag. |
| `url` | `string?` | App URL. Returned only when the caller can see private fields. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |

### ActionView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id action. |
| `name` | `string` | Action name. |
| `fullname` | `string` | Action fullname. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Public flag. |
| `backend` | `{ type: "sdk", action: string }` | Action backend. |
| `values` | `Record<string, TypeSchema>` | Action values schema. |
| `overrides` | `Array<keyof EventDefaults>` | Notification fields the action can override. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Visible title. |
| `meta.description` | `string?` | Description. |

### BlueprintView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id blueprint. |
| `name` | `string` | Blueprint name. |
| `fullname` | `string` | Blueprint fullname. |
| `app` | `string` | App fullname. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Public flag. |
| `type` | `string` | Blueprint type. |
| `data` | `object?` | Blueprint object spec. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Visible title. |
| `meta.description` | `string?` | Description. |

### SharedTypeView

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Id shared type. |
| `name` | `string` | Shared type name. |
| `fullname` | `string` | Shared type fullname. |
| `project` | `string` | Project fullname. |
| `workspace` | `string` | Workspace fullname. |
| `public` | `boolean` | Public flag. |
| `schemas` | `Record<string, TypeSchema>` | Named schemas. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Visible title. |
| `meta.description` | `string?` | Description. |

## Supporting Types

### EventDefaults

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string?` | Notification title template. |
| `short` | `string?` | Short markdown text template. |
| `long` | `string?` | Long markdown text template. |
| `icon` | `string \| null?` | Icon URL template. |
| `cover` | `string \| null?` | Cover URL template. |
| `avatar` | `string \| null?` | Avatar URL template. |
| `links` | `{ title: string, url: string }[]?` | Notification links. |
