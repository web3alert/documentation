# 类型

## 通用

### OperationResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| - | `{}` 或空响应体 | Endpoint 已成功完成。 |

### TokenResponse

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `token` | `string` | 用于后续 API/MCP 请求的 Bearer token。 |

### AvatarUploadResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 已上传 avatar 的 URL。 |
| `fileName` | `string` | 保存后的文件名。 |
| `extension` | `string` | 文件扩展名。 |
| `size` | `number` | 文件大小，单位为字节。 |

### TagsAndLabels

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tags` | `string[]` | 用于过滤和分组的短 tags。 |
| `labels` | `Record<string, string>` | 机器可读 labels。 |

## 账户

### Me

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id account. |
| `newid` | `string` | 兼容的 legacy account id 字段。 |
| `tier` | `"free" \| "advanced" \| "pro"` | 当前 account tier。 |
| `settings` | `object` | Account settings。 |
| `meta.nickname` | `string` | Account 显示名称。 |
| `meta.avatar` | `string?` | Account avatar URL。 |
| `token.identity` | `string` | 当前 token 绑定的 identity。 |
| `workspace` | `WorkspaceView \| null` | 当前选中的 workspace。 |
| `memberships` | `UserMembership[]` | 该 account 参与的 workspaces。 |
| `addressbook` | `AddressEntry[]` | 当前 workspace/account 上下文中的 addresses。 |
| `subscriptions` | `Record<string, number>` | 按 source/project key 聚合的 subscription 计数。 |
| `counters.subscriptions` | `SubscriptionCounter[]` | 聚合后的 subscription 计数。 |

### UserMembership

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id membership/ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | 在 workspace 中的角色。 |
| `workspace` | `WorkspaceViewShort` | 该 membership 所属的 workspace。 |

### AccountSettings

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| - | `object` | 当前 UI 版本的 settings 对象。字段集合可能会扩展。 |

### CurrentWorkspaceResponse

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `workspace` | `WorkspaceView \| null` | 当前选中的 workspace，或 `null`。 |

## 工作空间

### WorkspaceView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | 唯一 workspace name。 |
| `invite` | `string?` | Invite token。仅当 caller 可以查看 workspace 私有数据时返回。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string?` | Workspace 可见标题。 |
| `meta.avatar` | `string?` | Workspace avatar URL。 |

### WorkspaceViewShort

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Workspace fullname。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta` | `object?` | Workspace metadata。 |

### WorkspaceAclEntry

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | 角色。 |
| `user` | `UserViewShort` | 如果该 entry 已关联 account，则为对应 user。 |
| `object` | `{ type: string, id: string }?` | Workspace 引用。可能出现在 raw ACL 响应中。 |
| `subject` | `{ type: string, id: string }?` | User/invite 引用。可能出现在 raw ACL 响应中。 |

## 项目

### ProjectView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id project. |
| `createdAt` | `string?` | ISO 格式的创建日期。 |
| `updatedAt` | `string?` | ISO 格式的更新日期。 |
| `createdByAccountId` | `string?` | Owner account id。 |
| `billingAccountId` | `string?` | Billing owner account id。 |
| `name` | `string` | Workspace 内的 project name。 |
| `fullname` | `string` | Canonical project fullname。 |
| `workspace` | `string` | Owner workspace fullname。 |
| `public` | `boolean` | Legacy public 标记。 |
| `visibility` | `"public" \| "private_link" \| "personal"?` | Storage visibility。 |
| `accessLevel` | `"private" \| "public" \| "free"?` | Product access level。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string` | 可见标题。 |
| `meta.description` | `string` | 完整描述。 |
| `meta.shortDescription` | `string?` | 短描述。 |
| `meta.links` | `{ title: string, url: string }[]?` | 有用链接。 |
| `meta.icon` | `string?` | URL icon. |
| `meta.avatar` | `string?` | Avatar URL，通常与 icon 相同。 |
| `meta.cover` | `string?` | URL cover. |
| `ownerTitle` | `string?` | Workspace/account owner 的可见标题。 |
| `triggerLimits.maxProvidersPerTrigger` | `number \| null` | 每个 trigger 的 provider weight 限制。字段名为 API 兼容性保留。 |

### ProjectCreateCapability

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | 当前 account tier。 |
| `canCreateProjects` | `boolean` | 是否可以创建 project。 |
| `privateProjectsUsed` | `number` | 已有多少 private projects 计入限制。 |
| `privateProjectsLimit` | `number \| null` | Private projects 限制；`null` 表示无限制。 |
| `canCreatePrivateProjects` | `boolean` | 是否可以在限制内创建 private project。 |

### ProjectAccessLink

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `token` | `string` | Access link token。 |
| `project` | `string` | Project fullname。 |
| `maxUsages` | `number?` | 最大使用次数。 |
| `usages` | `number?` | 当前使用次数。 |
| `expiresAt` | `string?` | ISO 格式的过期日期。 |
| `createdAt` | `string?` | ISO 格式的创建日期。 |

### ProjectImageUploadResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 已上传图片的 URL。 |
| `fileName` | `string` | 保存后的文件名。 |
| `extension` | `string` | 文件扩展名。 |
| `size` | `number` | 文件大小，单位为字节。 |

## 项目转移

### ProjectTransferPlan

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | `"dry-run"` | Plan 预览模式。 |
| `source` | `ProjectTransferProjectRef` | 源 project。 |
| `target` | `ProjectTransferTargetRef` | 目标 workspace、name 和 fullname。 |
| `counts` | `ProjectTransferCounts` | 将被转移内容的计数。 |
| `changes` | `ProjectTransferChanges` | 计划变更的详细列表。 |
| `conflicts` | `ProjectTransferConflict[]` | 阻塞性冲突。 |
| `notes` | `string[]` | 附加说明。 |
| `planHash` | `string?` | Plan hash；如果创建 request 的 endpoint 随 plan 返回该值。 |

### ProjectTransferCounts

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `triggers` | `number` | 要转移的 triggers。 |
| `templates` | `number` | 要转移的 template records。 |
| `templateGroups` | `number` | Template groups。 |
| `templateTopics` | `number` | Template topics。 |
| `subscriptions` | `number` | 引用会受影响的 subscriptions。 |
| `scopedEntities` | `number` | 绑定到该 project 的 apps/actions/resources/types/blueprints。 |
| `projectAccessLinks` | `number` | 要更新的 access links。 |
| `aliasWrites` | `number` | 要创建或更新的 entity aliases。 |
| `aliasMissing` | `number` | 要创建的缺失 aliases。 |
| `aliasStale` | `number` | 要更新的过期 aliases。 |
| `conflicts` | `number` | 冲突数量。 |

### ProjectTransferRequest

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id request. |
| `sourceProjectId` | `string` | 源 project id。 |
| `sourceProjectFullname` | `string` | 源 project fullname。 |
| `sourceWorkspace` | `string` | 源 workspace fullname。 |
| `targetWorkspace` | `string` | 目标 workspace fullname。 |
| `targetName` | `string` | 目标 workspace 中的 project name。 |
| `targetFullname` | `string` | 目标 workspace 中的 project fullname。 |
| `status` | `"pending" \| "accepted" \| "rejected" \| "cancelled" \| "expired" \| "failed"` | Request status。 |
| `requestedByAccountId` | `string` | 创建 request 的 account。 |
| `sourceOwnerAccountId` | `string` | 当前 source owner account。 |
| `targetOwnerAccountId` | `string` | 目标 owner account。 |
| `planHash` | `string` | 已接受的 plan hash。 |
| `planCounts` | `Record<string, number>` | Plan counters 快照。 |
| `expiresAt` | `string` | ISO 格式的过期日期。 |
| `createdAt` | `string` | ISO 格式的创建日期。 |
| `updatedAt` | `string` | ISO 格式的更新日期。 |
| `decidedAt` | `string?` | ISO 格式的决定日期。 |
| `decidedByAccountId` | `string?` | 接受、拒绝或取消 request 的 account。 |
| `appliedAt` | `string?` | ISO 格式的应用日期。 |
| `rejectedReason` | `string?` | 拒绝原因。 |
| `failureReason` | `string?` | 失败原因。 |

### ProjectTransferAcceptResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request` | `ProjectTransferRequest` | 已接受的 request。 |
| `transfer` | `ProjectTransferApplyResult` | 已应用 transfer 的详情。 |

### ProjectTransferApplyResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | `"apply"` | 应用模式。 |
| `appliedAt` | `string` | ISO 格式的应用日期。 |
| `writes.projects` | `number` | 已更新的 project records。 |
| `writes.triggers` | `number` | 已更新的 triggers。 |
| `writes.triggerProviders` | `number` | 已更新的 trigger providers。 |
| `writes.triggerTransforms` | `number` | 已更新的 trigger transforms。 |
| `writes.templates` | `number` | 已更新的 templates。 |
| `writes.subscriptions` | `number` | 已更新的 subscriptions。 |
| `writes.scopedEntities` | `number` | 已更新的 project-scoped entities。 |
| `writes.projectAccessLinks` | `number` | 已更新的 access links。 |
| `writes.aliases` | `number` | 已写入的 aliases。 |

## 触发器

### TriggerView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Trigger id。 |
| `createdAt` | `string?` | ISO 格式的创建日期。 |
| `updatedAt` | `string?` | ISO 格式的更新日期。 |
| `name` | `string` | Project 内的 trigger name。 |
| `fullname` | `string` | Canonical trigger fullname。 |
| `projectId` | `string?` | Id project. |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Legacy public 标记。 |
| `backend` | `{ type: "sdk", trigger: string, values?: object }` | Backend runtime 引用。 |
| `inputs` | `Record<string, TypeSchema>` | 必填 subscription inputs。 |
| `defaults` | `EventDefaults?` | 推荐的 notification defaults。 |
| `output` | `Record<string, TypeSchema>?` | Legacy output schema. |
| `triggerSpec` | `TriggerSpec?` | Source matching 规范。 |
| `filtersSchema` | `Record<string, TriggerOutputSchemaField>?` | 可选 subscription filters。 |
| `outputSchema` | `Record<string, TriggerOutputSchemaField>?` | Raw/human output schema。 |
| `activation` | `TriggerActivation \| null?` | 可选 activation condition。 |
| `executionPolicy` | `object?` | Runtime policy overrides。 |
| `status` | `TriggerStatusDetails` | Test/runtime status。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string` | 可见标题。 |
| `meta.description` | `string?` | 说明. |
| `hasProviders` | `boolean?` | 如果 providers 存在，则为 `true`。 |
| `hasTransform` | `boolean?` | 如果 transform 存在，则为 `true`。 |

### TriggerDraftView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `providers` | `TriggerProvider[]?` | 完整 provider definitions。 |
| `transform` | `TriggerTransform?` | JavaScript raw/human transform。 |

### TriggerStatusDetails

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `status` | `"not_tested" \| "ready" \| "broken"` | 当前 status。 |
| `issue` | `string?` | 人类可读 issue。 |
| `source` | `"edit" \| "test" \| "runtime" \| "dependency"?` | Status source。 |
| `updatedAt` | `string?` | ISO 格式的更新日期。 |

### TriggerSpec

| 变体 | 主要字段 |
| --- | --- |
| `evm_log` | `type`, `dataSource`, 可选 `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput`. |
| `evm_transaction` | `type`, `dataSource`, 可选 `testInput`. |
| `substrate_event` | `type`, `dataSource`, 可选 `pallet`, `event`, `testInput`. |
| `solana_event` | `type`, `dataSource`, 可选 `programId`, `event`, `idl`, `testInput`. 对于 calls，`event` 字段保存带 `call:` 前缀的值。 |
| `timer` | `type`, `interval`, 可选 `testInput`. |

### TriggerTransform

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `language` | `"javascript"` | Transform 语言。 |
| `source` | `string?` | Legacy source。 |
| `rawSource` | `string?` | 转换为 raw output。 |
| `humanSource` | `string?` | 将 raw output 转换为 human output。 |

### TriggerActivation

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `language` | `"javascript"` | Activation 语言。 |
| `source` | `string` | JavaScript condition 源码。 |

### TriggerValidationResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Draft 是否有效。 |
| `issues` | `string[]` | Validation issues。 |
| `trigger` | `TriggerDraftView?` | 如果 endpoint 返回，则为 normalized trigger draft。 |

### TriggerPatchResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | 如果仅验证变更，则为 `true`。 |
| `updated` | `boolean` | Trigger 是否已更改。 |
| `changedPaths` | `string[]` | 已更改的 dotted paths。 |
| `trigger` | `TriggerDraftView` | Patch 后的 trigger，或 normalized dry-run view。 |

### TriggerBulkPatchResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `dryRun` | `boolean?` | 如果 bulk patch 是 dry run，则为 `true`。 |
| `totalCount` | `number` | 已处理 items 数量。 |
| `updatedCount` | `number` | 已更改 items 数量。 |
| `items` | `TriggerBulkPatchItem[]` | 按 trigger 分组的结果。 |

### TriggerBulkPatchItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | 如果 item 是 dry run，则为 `true`。 |
| `updated` | `boolean` | Trigger 是否已更改。 |
| `changedPaths` | `string[]` | 已更改 paths。 |
| `status` | `string?` | Patch 后的 trigger status。 |
| `statusUpdatedAt` | `string?` | Status 更新日期。 |
| `unsetPaths` | `string[]` | 已删除的 paths。 |

### TriggerBulkRemoveResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `dryRun` | `boolean?` | 如果 bulk remove 是 dry run，则为 `true`。 |
| `totalCount` | `number` | 已处理 triggers 数量。 |
| `deletedCount` | `number` | 已删除 triggers 数量。 |
| `items` | `TriggerBulkRemoveItem[]` | 按 trigger 分组的结果。 |

### TriggerBulkRemoveItem

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fullname` | `string` | Trigger fullname. |
| `dryRun` | `boolean?` | 如果 item 是 dry run，则为 `true`。 |
| `deleted` | `boolean` | Trigger 是否已删除。 |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |

### TriggerPreviewResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Preview 是否成功。 |
| `issues` | `string[]` | Issues。 |
| `output` | `unknown?` | Output preview。 |
| `debug` | `Record<string, unknown>?` | Debug details. |

### TriggerTestResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Test 是否成功。 |
| `issues` | `string[]` | Test issues。 |
| `input` | `unknown?` | Test 使用的 source item。 |
| `output` | `unknown?` | Raw/human output。 |
| `sourceEventsCount` | `number?` | 找到的 source items 数量。 |
| `debug` | `Record<string, unknown>?` | Debug details. |

### ProviderTestResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Provider test 是否成功。 |
| `issues` | `string[]` | Issues。 |
| `result` | `unknown?` | Provider output。 |
| `debug` | `Record<string, unknown>?` | Debug details. |

### RuntimeSource

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `app` | `string` | Runtime app name. |
| `network` | `string` | Network/source name。 |
| `plugin` | `"evm" \| "substrate" \| "solana"` | Runtime plugin 类型。 |
| `instance` | `string` | Runtime instance. |
| `status` | `"running" \| "degraded" \| "error"` | Runtime status。 |
| `updatedAt` | `string` | ISO 格式的更新日期。 |
| `latestSeenBlock` | `number?` | Runtime 看到的 last block。 |
| `lastProcessedBlock` | `number?` | Last processed block。 |
| `blockLag` | `number?` | 当前 block lag。 |
| `lastFailedBlock` | `number?` | Last failed block。 |
| `errorsLastHour` | `number?` | 过去一小时 errors 数量。 |

### LatestBlockResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Lookup 是否成功。 |
| `issues` | `string[]` | Lookup issues。 |
| `latestBlock` | `number?` | 找到的 latest block。 |
| `matched` | `boolean` | 是否找到匹配的 source item。 |
| `matchedBlock` | `number?` | 找到 match 的 block。 |
| `checkedBlocks` | `number` | 已检查 blocks 数量。 |
| `sourceEventsCount` | `number?` | Source event count。 |
| `itemIndex` | `number?` | 找到的 item index。 |
| `input` | `unknown?` | 找到的 input。 |
| `source` | `string?` | Lookup source。 |
| `details` | `unknown?` | 附加详情。 |

## 触发器导入

### EvmAbiImportResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `events` | `unknown[]?` | 已解析 ABI event entries。 |
| `calls` | `unknown[]?` | 已解析 ABI call/function entries。 |
| `items` | `unknown[]?` | 如果 runtime 返回扁平列表，则为解析 entries 的统一列表。 |
| `error` | `string?` | 如果 runtime 无法解析 ABI，则为错误消息。 |

### EvmAbiResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `abi` | `unknown[]?` | 如果 ABI 已加载，则为 ABI JSON entries。 |
| `source` | `string?` | ABI source marker。 |
| `contract` | `string?` | Contract address。 |
| `error` | `string?` | 如果 ABI 无法加载，则为错误消息。 |

### TriggerImportDraftsResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `abiSource` | `"provided" \| "auto"?` | EVM import 使用的 ABI source。 |
| `drafts` | `TriggerDraftView[]` | 生成的 trigger drafts。 |

### SubstrateSourceInfo

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ss58Prefix` | `number` | Substrate source 的 SS58 prefix。 |

### SubstratePalletSummary

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | Pallet name。 |
| `docs` | `string[]` | Pallet 文档。 |
| `hasEvents` | `boolean` | Pallet 是否有 events。 |
| `hasCalls` | `boolean` | Pallet 是否有 calls。 |
| `eventCount` | `number` | Events 数量。 |
| `callCount` | `number` | Calls 数量。 |

## 模板

### ProjectTemplate

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `project` | `string` | Project fullname。 |
| `schema` | `Record<string, TypeSchema>` | Template-level input schema。 |
| `groups` | `TemplateGroup[]` | 向用户显示为 templates 的 groups。 |
| `topics` | `TemplateTopic[]` | Groups 内的 topics。 |
| `rules` | `TemplateRule[]` | Topics 的 trigger rules。 |
| `meta` | `Record<string, unknown>` | Template metadata. |
| `issue` | `string?` | Template 同步问题。 |

### TemplateGroup

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | Group id。 |
| `meta.title` | `string` | 可见标题。 |
| `meta.description` | `string` | 说明. |

### TemplateTopic

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | Id topic. |
| `group` | `string` | Parent group id。 |
| `selectedByDefault` | `boolean` | Topic 是否在 subscription wizard 中默认选中。 |
| `meta.title` | `string` | 可见标题。 |

### TemplateRule

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Rule id。 |
| `trigger` | `string` | Trigger fullname. |
| `topic` | `string` | Topic name。 |
| `inputs` | `object?` | Rule 的 input mapping/defaults。 |
| `policy` | `object?` | Execution policy。 |
| `conditions` | `Condition \| null?` | Condition rule。 |
| `deprecated` | `boolean` | Rule 是否标记为 deprecated。 |
| `requiredValues` | `string[]` | 必填 template values。 |
| `issue` | `string?` | Missing trigger or sync issue. |

## 订阅

### SubscriptionView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id subscription. |
| `targetWorkspaceFullname` | `string?` | 拥有 subscription 的 workspace。 |
| `createdByAccountId` | `string?` | 创建 subscription 的 account。 |
| `sourceProjectId` | `string?` | 源 project id。 |
| `sourceProjectFullname` | `string?` | 源 project fullname。 |
| `countsTowardsTierQuota` | `boolean?` | Subscription 是否计入 Free tier quota。 |
| `state` | `"on" \| "off" \| "blocked"` | Subscription state。 |
| `createdAt` | `string` | ISO 格式的创建日期。 |
| `updatedAt` | `string` | ISO 格式的更新日期。 |
| `template` | `SubscriptionTemplateReference \| null` | Template reference；direct trigger subscription 时为 `null`。 |
| `rules` | `SubscriptionRule[]` | Trigger rules。 |
| `resources` | `string[]` | Actions 使用的 resource fullnames。 |
| `actions` | `SubscriptionAction[]?` | Notification actions。 |
| `references` | `SubscriptionReferences` | 到 source/project/trigger 的 denormalized references。 |
| `meta.title` | `string?` | 可见标题。 |
| `meta.issue` | `string?` | Block/entitlement/migration 问题。 |

### SubscriptionTemplateReference

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `inputs` | `Record<string, string \| number>` | Template input values。 |
| `groups` | `{ name: string, meta: { title: string } }[]` | 已选择的 groups。 |
| `topics` | `string[]` | 已选择的 topics。 |
| `rules` | `{ id: string, group: string }[]` | 已选择的 rule references。 |

### SubscriptionRule

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `triggerId` | `string?` | Trigger id。 |
| `trigger` | `RuleTriggerReference` | Trigger reference。 |
| `inputs` | `object?` | Input values。 |
| `policy` | `object?` | Execution policy。 |
| `conditions` | `Condition \| null?` | Condition rule。 |

### SubscriptionAction

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `action` | `string` | Action fullname. |
| `values` | `Record<string, unknown>` | Action values。 |
| `overrides` | `EventDefaults?` | Notification override 字段。 |

### SubscriptionReferences

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sources` | `string[]` | References to data sources. |
| `projects` | `string[]` | Project fullnames。 |
| `triggers` | `string[]` | Trigger fullnames。 |
| `projectIds` | `string[]?` | Project ids。 |
| `triggerIds` | `string[]?` | Trigger ids。 |

### SubscriptionTestResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `valid` | `boolean` | Test 是否有效。 |
| `issues` | `string[]` | Test issues。 |
| `preview` | `unknown?` | Notification preview/send 结果。 |
| `subscription` | `SubscriptionView?` | Test 使用的 draft subscription。 |

### SubscriptionAlertLog

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Log id。 |
| `subscriptionId` | `string` | Id subscription. |
| `workspaceId` | `string` | Id workspace. |
| `projectFullname` | `string?` | Project fullname。 |
| `triggerFullname` | `string?` | Trigger fullname. |
| `eventName` | `string` | Event/trigger name。 |
| `createdAt` | `string` | ISO 格式的创建日期。 |
| `status` | `"delivered" \| "failed" \| "rate_limited" \| "blocked"` | Delivery status。 |
| `testInput` | `Record<string, unknown>?` | Test input. |
| `itemIndex` | `number?` | Source item index。 |
| `replayMatch` | `{ hash?: string \| null, index?: number \| null }?` | Replay match 信息。 |
| `sourceItemsCount` | `number?` | Source items 数量。 |
| `channels` | `SubscriptionAlertLogChannel[]` | Delivery channels。 |
| `failureReasonCode` | `string?` | Error code。 |
| `failureReasonMessage` | `string?` | 错误消息。 |
| `expireAt` | `string` | Log 过期日期。 |

## 资源

### ResourceView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id resource. |
| `name` | `string` | Resource name. |
| `fullname` | `string` | Resource fullname. |
| `project` | `string?` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Public 标记。 |
| `blueprint` | `string` | Blueprint fullname. |
| `token` | `string?` | Secret token。仅当 caller 可以查看 resource 私有字段时返回。 |
| `ready` | `boolean` | Resource 是否 ready。 |
| `remark` | `string \| null` | Resource status 备注。 |
| `data` | `object \| null?` | Resource setup data。 |
| `destinationSummary` | `TelegramResourceDestinationSummary?` | 经过清理的 destination 信息。仅在已配置的外部 Telegram resource 的 owner-private view 中返回；public 和 short views 中不会返回。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string?` | 可见标题。 |

### TelegramResourceDestinationSummary

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `service` | `"telegram"` | Delivery service。 |
| `title` | `string` | Destination 可见标题。 |
| `kind` | `"private" \| "group" \| "supergroup" \| "channel"?` | Telegram destination 类型（如可用）。 |
| `topic` | `object?` | 已选择的 forum topic（如已配置）。 |
| `topic.messageThreadId` | `number` | Telegram forum topic thread id。 |
| `topic.title` | `string?` | Forum topic 可见标题。 |

### ExternalResourceView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `blocks` | `{ type: "markdown", text: string }[]` | External app 返回的 UI content blocks。 |

## 数据源

### CustomSourceListView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `workspace` | `string` | Owner workspace fullname。 |
| `name` | `string` | Source name. |
| `fullname` | `string` | Source fullname。 |
| `public` | `boolean` | Public 标记。 |
| `kind` | `"evm" \| "substrate" \| "solana"` | Source type。 |
| `meta` | `CustomSourceMeta` | Metadata。 |
| `createdAt` | `string` | ISO 格式的创建日期。 |
| `updatedAt` | `string` | ISO 格式的更新日期。 |
| `deployerTitle` | `string?` | Deployer/owner 可见标题。 |

### CustomSource

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `createdByAccountId` | `string?` | Creator account id. |
| `endpoints` | `string[]` | Runtime RPC endpoints。 |
| `substrate` | `object?` | Substrate extensions/types/RPC config。 |
| `batchMaxCount` | `number?` | 最大 EVM batch size。 |
| `blockProcessingConcurrency` | `number?` | Block processing concurrency。 |
| `maxQueuedBlocks` | `number?` | 最大 queued blocks。 |
| `logs` | `{ retentionMs: number, maxCount: number \| null }?` | Policy log runtime. |
| `runtime` | `CustomSourceRuntimeMetadata?` | Runtime metadata。 |

### CustomSourceMeta

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 可见标题。 |
| `description` | `string?` | 说明. |
| `icons.default` | `string?` | Default icon URL. |
| `og` | `object?` | OpenGraph metadata。 |

### CustomSourceRuntimeMetadata

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `evm.chainId` | `number?` | EVM chain id。 |
| `evm.latestBlock` | `number?` | Latest EVM block. |
| `evm.blockHash` | `string?` | Block hash。 |
| `evm.fetchedAt` | `string` | Metadata fetch date. |
| `substrate.ss58Prefix` | `number?` | SS58 prefix. |
| `substrate.latestBlock` | `number?` | Latest Substrate block. |
| `substrate.fetchedAt` | `string` | Metadata fetch date. |
| `solana.genesisHash` | `string?` | Solana network genesis hash. |
| `solana.latestBlock` | `number?` | Latest Solana slot/block. |
| `solana.blockHash` | `string?` | Block hash. |
| `solana.fetchedAt` | `string` | Metadata fetch date. |

### CustomSourceCreateCapability

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Account tier. |
| `canCreateCustomSources` | `boolean` | 当前 account 是否可以创建 custom sources。 |
| `customSourcesUsed` | `number` | 当前 private custom sources 数量。 |
| `customSourcesLimit` | `number \| null` | 限制；`null` 表示无限制。 |

### CustomSourceVerifyResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | `boolean` | Verification 是否成功。 |
| `logs` | `{ level: "info" \| "error", message: string }[]` | Verification log messages。 |
| `details` | `Record<string, unknown>?` | Runtime/public duplicate check 详情。 |
| `error` | `string?` | Verification error。 |

### CustomSourceLogsResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `exists` | `boolean` | Log file 是否存在。 |
| `lines` | `string[]` | 已编辑 log lines。 |
| `truncated` | `boolean` | Output 是否被截断。 |
| `updatedAt` | `string?` | Log file 更新日期。 |

### CustomSourceRuntimeActionResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | `true` | Runtime action 是否成功。 |
| `sourceFullname` | `string` | Source fullname。 |
| `revision` | `number` | Restart/reset 后的 runtime revision。 |

### CustomSourceResetLagResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | `true` | Reset 是否成功。 |
| `latestBlock` | `number` | 作为新 lag baseline 使用的 last block。 |

### CustomSourceStatusTestResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ok` | `true` | Test event 已发送。 |
| `eventName` | `string` | 生成的 status trigger name。 |
| `subscriptionsTested` | `number` | 已测试的 subscriptions。 |
| `matched` | `number` | Matched subscriptions 数量。 |
| `delivered` | `number` | 已送达 alerts。 |
| `event` | `CustomSourceStatusEvent` | Test status event。 |

### CustomSourceStatusEvent

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `"status_changed" \| "error" \| "recovered"` | Event type。 |
| `sourceFullname` | `string` | Source fullname。 |
| `sourceName` | `string` | Source name. |
| `sourceTitle` | `string` | 可见标题。 |
| `workspace` | `string` | Workspace fullname。 |
| `kind` | `"evm" \| "substrate" \| "solana"` | Source type。 |
| `status` | `"running" \| "error" \| "degraded"` | 新 status。 |
| `previousStatus` | `"running" \| "error" \| "degraded"?` | 上一 status。 |
| `severity` | `"info" \| "warning" \| "error"` | Severity。 |
| `message` | `string` | 人类可读消息。 |
| `code` | `string?` | 机器可读 code。 |
| `details` | `Record<string, unknown>?` | 附加详情。 |
| `timestamp` | `string` | ISO 格式的 event time。 |

## 地址

### AddressEntry

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id address entry. |
| `type` | `"plain" \| "ss58" \| "evm" \| "bitcoin" \| "cosmos"` | 类型 address. |
| `address` | `string` | Address value。 |
| `alias` | `string` | 可见 alias。 |

## Builder Registry

### AppView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id app. |
| `name` | `string` | App name. |
| `fullname` | `string` | App fullname. |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Public 标记。 |
| `url` | `string?` | App URL。仅当 caller 可以查看私有字段时返回。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |

### ActionView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id action. |
| `name` | `string` | Action name. |
| `fullname` | `string` | Action fullname. |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Public 标记。 |
| `backend` | `{ type: "sdk", action: string }` | Action backend。 |
| `values` | `Record<string, TypeSchema>` | Action values schema。 |
| `overrides` | `Array<keyof EventDefaults>` | Action 可覆盖的 notification fields。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string` | 可见标题。 |
| `meta.description` | `string?` | 说明. |

### BlueprintView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id blueprint. |
| `name` | `string` | Blueprint name. |
| `fullname` | `string` | Blueprint fullname. |
| `app` | `string` | App fullname. |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Public 标记。 |
| `type` | `string` | Blueprint type。 |
| `data` | `object?` | Blueprint object spec。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string?` | 可见标题。 |
| `meta.description` | `string?` | 说明. |

### SharedTypeView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | Id shared type. |
| `name` | `string` | Shared type name。 |
| `fullname` | `string` | Shared type fullname. |
| `project` | `string` | Project fullname。 |
| `workspace` | `string` | Workspace fullname。 |
| `public` | `boolean` | Public 标记。 |
| `schemas` | `Record<string, TypeSchema>` | 命名 schemas。 |
| `tags` | `string[]` | Tags。 |
| `labels` | `Record<string, string>` | Labels。 |
| `meta.title` | `string?` | 可见标题。 |
| `meta.description` | `string?` | 说明. |

## 支持类型

### EventDefaults

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string?` | Notification title template。 |
| `short` | `string?` | Short markdown text template。 |
| `long` | `string?` | Long markdown text template。 |
| `icon` | `string \| null?` | Icon URL template。 |
| `cover` | `string \| null?` | Cover URL template。 |
| `avatar` | `string \| null?` | Avatar URL template。 |
| `links` | `{ title: string, url: string }[]?` | Notification links。 |
