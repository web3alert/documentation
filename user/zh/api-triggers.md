# Triggers API

Trigger endpoints 用于管理 trigger definitions、drafts、bulk operations 和 test helpers。

## GET /api/triggers

返回带 optional filters 的 triggers。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: 无。

响应：[TriggerView[]](types.md#triggerview)。

## GET /api/triggers/:fullname

返回 trigger。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: 无。

响应：[TriggerDraftView](types.md#triggerdraftview)。

## PUT /api/triggers/:fullname

创建或完整保存 trigger。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. 必须与 `payload.fullname` 一致。 |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | 是 | project 内的 Trigger name。 |
| `fullname` | 是 | Trigger fullname. |
| `project` | 是 | Project fullname. |
| `workspace` | 是 | Workspace fullname. |
| `backend` | 是 | Backend object。通常是 `{ type: "sdk", trigger, values }`。 |
| `inputs` | 是 | Input schema. |
| `meta.title` | 是 | 可见标题。 |
| `meta.description` | 否 | 描述。 |
| `defaults` | 否 | Notification defaults. |
| `triggerSpec` | 否 | Source matching spec 或 `null`。 |
| `providers` | 否 | Array of provider definitions. |
| `filtersSchema` | 否 | Optional filters schema. |
| `outputSchema` | 否 | Human/raw output schema. |
| `transform` | 否 | JavaScript transform 或 `null`。 |
| `activation` | 否 | JavaScript activation condition 或 `null`。 |
| `executionPolicy` | 否 | Runtime limits override object 或 `null`。 |
| `status` | 否 | `{ status, issue, source, updatedAt }`. |
| `tags` | 否 | Tags. |
| `labels` | 否 | Labels. |

响应：[TriggerDraftView](types.md#triggerdraftview)。

## PATCH /api/triggers/:fullname

部分修改 trigger。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `set` | One of | Object with dotted paths and values to set. |
| `unset` | One of | Array of dotted paths to remove. |
| `dryRun` | 否 | If `true`, validate patch without saving. |

响应：[TriggerPatchResult](types.md#triggerpatchresult)。

## DELETE /api/triggers/:fullname

删除 trigger。

直接删除需要工作区所有者权限，密钥还需要 `manage`。若有同一工作区的启用（`on`）订阅使用该触发器，则返回 `409 trigger_in_use`。删除成功时会阻止依赖订阅继续投递，包括其他工作区的订阅。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## POST /api/triggers/patch

对多个 triggers 执行 bulk patch。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | 是 | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | 否 | Validate without saving. |

响应：[TriggerBulkPatchResult](types.md#triggerbulkpatchresult)。

## POST /api/triggers/remove

对多个 triggers 执行 bulk remove。

系统会检查每个触发器所在工作区的启用（`on`）订阅。任一目标正在使用时返回 `409 trigger_in_use`。删除项目、工作区或账户会阻止受影响的订阅继续投递。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | 是 | Array of trigger fullnames. |
| `dryRun` | 否 | Validate without deleting. |

响应：[TriggerBulkRemoveResult](types.md#triggerbulkremoveresult)。

## GET /api/triggers/:fullname/draft

返回 trigger draft view。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: 无。

响应：[TriggerDraftView](types.md#triggerdraftview)。

## PUT /api/triggers/:fullname/draft

保存 trigger draft。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/triggers/:fullname`.

响应：[TriggerDraftView](types.md#triggerdraftview)。

## POST /api/triggers/:fullname/draft/validate

验证 trigger draft，但不执行最终保存。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

响应：[TriggerValidationResult](types.md#triggervalidationresult)。

## GET /api/triggers/:fullname/logs

返回 trigger 的聚合 delivery 失败和 source-pressure 事件。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname。 |
| `limit` | Query | 可选的最大日志条数。 |
| `status` | Query | 可选的 delivery 状态筛选。 |
| `direction` | Query | 可选的分页方向：`before` 或 `after`。 |
| `datetime` | Query | 与 `direction` 一起使用的 ISO 时间。 |

Payload: 无。

响应包含 trigger 信息、subscription 统计和规范化日志。

## POST /api/triggers/:fullname/reset-test-status

将 trigger 测试状态重置为 `not_tested`。

参数：path 中的 `fullname`。

Payload: 无。

响应：[TriggerPatchResult](types.md#triggerpatchresult)。

## POST /api/triggers/preview

验证 provider definitions，在给定 input 上运行可选 activation 和 raw/human
transforms，并验证结果 output。此操作不会保存 trigger。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | 是 | Provider definitions. |
| `activation` | 否 | JavaScript activation condition 或 `null`。 |
| `transform` | 是 | JavaScript transform object. |
| `input` | 是 | Source item/input for preview. |
| `inputs` | 否 | Trigger input values. |
| `providersData` | 否 | 供 activation 和 transforms 使用的预计算 provider values。 |
| `outputSchema` | 否 | 用于验证 preview 结果的 output schema。 |

响应：[TriggerPreviewResult](types.md#triggerpreviewresult)。

## POST /api/triggers/test

在 sample source item 上测试 trigger definition。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | 是 | Source matching spec. |
| `providers` | 是 | Provider definitions. |
| `transform` | 是 | JavaScript transform. |
| `outputSchema` | 是 | Output schema. |
| `activation` | 否 | Activation condition. |
| `inputs` | 否 | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

响应：[TriggerTestResult](types.md#triggertestresult)。

## POST /api/triggers/test-block

在指定 block 上测试 trigger。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | 是 | Source matching spec. |
| `providers` | 是 | Provider definitions. |
| `transform` | 是 | JavaScript transform. |
| `outputSchema` | 是 | Output schema. |
| `block` | 是 | Block number. |
| `itemIndex` | 否 | Source item index inside block. |
| `activation` | 否 | Activation condition. |
| `filtersSchema` | 否 | Filters schema. |
| `inputs` | 否 | Input values. |

响应：[TriggerTestResult](types.md#triggertestresult)。

## POST /api/triggers/providers/test

测试一个 provider。

Arguments: 无。

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | 是 | Source matching spec. |
| `provider` | 是 | Provider definition. |
| `project` | 否 | Project fullname. |
| `workspace` | 否 | Workspace fullname. |
| `templateValues` | 否 | Template values for provider placeholders. |

响应：[ProviderTestResult](types.md#providertestresult)。

## GET /api/triggers/hypercore/actions

返回 trigger builder 可用的 HyperCore action 目录。

参数：无。

Payload: 无。

响应包含 `actions` 数组。

## GET /api/triggers/runtime-sources

返回 trigger builder 可用的 runtime data sources。

Arguments: 无。

Payload: 无。

响应：[RuntimeSource[]](types.md#runtimesource)。

## GET /api/template-helpers

返回 trigger defaults 和订阅 action 模板可用的公开 Handlebars helper 元数据。无需身份验证。

参数：无。

请求体：无。

响应包含 `handlebars.helpers` 数组。每个 helper 都有唯一的 `name` 和 `description`；块 helper 还包含 `block: true`，带命名选项的 helper 则包含由 `name` 和 `type` 组成的 `params` 数组。

## POST /api/triggers/find-latest-block

为 trigger testing 查找 latest block/test input。

Arguments: 无。

Payload: trigger/source-specific search object.

响应：[LatestBlockResult](types.md#latestblockresult)。

## 智能体构建触发器

五个构建端点均接受当前工作区的账户会话令牌或智能体密钥。调用账户需要 Advanced 或 Pro，否则返回 `403 plan_required`。查找和测试需要工作区查看权限。规划、激活和删除需要工作区编辑权限。

关闭构建功能时，这些端点返回 HTTP `400`，`error.message` 为 `builder is disabled`。

## POST /api/agent/build/contracts

密钥需要 `read` 权限。发送 `chain`，并指定 `address`（EVM）、`program`（Solana）或 `pallet`（Substrate）中的一项。仅支持 Web3alert 内置链源。可以使用简称，如 `ethereum`、`base`、`arbitrum-one`、`polkadot` 或 `solana`，也可以使用 `common.<chain>` 或 `common.source.<chain>`。若无法识别链，API 返回 `404 not_found`，并在 `error.details.chains` 中列出该目标类型支持的简称。链数据暂时不可用时返回 `503 retryable`。 合约没有已验证的 ABI、Solana 程序没有 IDL，或 Substrate pallet 未知时，也会返回 `404 not_found`。

返回 `{ chain, source, events, recentBlocks, functions? }`，其中包含准确的事件签名。对于 EVM，每个事件的 `recentCount` 统计最近 `recentBlocks` 个区块中的日志，最多 1,000 个区块。如果提供方拒绝大范围查询，API 会缩小查询窗口重试，返回的覆盖范围可能更短。未能读取任何区块或链源为 Solana 或 Substrate 时，`recentBlocks` 为 `null`。`recentCount` 为 `null` 表示计数不可用或不适用。

## POST /api/agent/build/drafts

密钥需要 `manage` 权限。`chain` 使用[合约查找端点](#post-api-agent-build-contracts)支持的格式，同时传入目标，并在 `event` 中提供名称或准确签名。可选 `title` 和 `description`。返回 `{ draftId, fullnamePreview, inputs, filterable, outputSchema, expiresAt }`。草稿有效期为七天。若无法识别链，返回 `404 not_found` 和 `error.details.chains`。事件未知时也返回 `404 not_found`。链数据暂时不可用时返回 `503 retryable`。

合约没有已验证的 ABI、Solana 程序没有 IDL，或 Substrate pallet 未知时，也会返回 `404 not_found`。 传入重载事件的名称会返回 HTTP `400`。请使用准确的事件签名。

## POST /api/agent/build/drafts/:draftId/test

密钥需要 `read` 权限。可选 `block`（EVM 或 Substrate）或 `slot`（Solana）。均省略时会在近期的有限范围内搜索。返回 `{ result, block?, slot?, output? }`，其中结果为 `matched`、`no_match`、`invalid` 或 `retryable`。草稿不可用时返回 `404 not_found`，若过期但仍存储，则返回 `410 draft_expired`。

对 EVM 或 Substrate 传入 `slot`、或对 Solana 传入 `block` 时，返回 `result: "invalid"`。

## POST /api/agent/build/drafts/:draftId/activate

密钥需要 `manage` 权限。发送 `{ requestId }`，重试时沿用。返回工作区智能体私有项目的 `{ trigger, project }`。若最近测试结果并非 `matched`，则返回 `409 not_tested`。超出套餐上限时返回 `403 private_project_limit` 或 `403 trigger_limit`。草稿可用性错误与测试相同。

首次成功激活会创建私有项目 `agent-triggers`，同名时会另加后缀。该项目计入账户的私有项目上限。Advanced 只有一个名额。若已用完，创建智能体项目时会返回 `403 private_project_limit`。在同一工作区对同一草稿沿用 `requestId` 会返回原结果。为其他草稿复用此 ID 会返回 `409 request_id_conflict`。

## DELETE /api/agent/build/triggers/:fullname

密钥需要 `manage` 权限。删除工作区智能体私有项目的触发器。成功时返回 `204 No Content`，触发器不在该项目内时返回 `404 not_found`，同一工作区有启用（`on`）的订阅使用它时返回 `409 trigger_in_use`。

## Trigger Spec

`triggerSpec` describes source matching.

Supported variants:

| Type | Required fields | Optional fields |
| --- | --- | --- |
| `evm_log` | `type`, `dataSource` | `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput` |
| `evm_transaction` | `type`, `dataSource` | `testInput` |
| `substrate_event` | `type`, `dataSource` | `pallet`, `event`, `testInput` |
| `solana_event` | `type`, `dataSource` | `programId`, `event`, `idl`, `testInput` |
| `timer` | `type`, `interval` | `testInput` |

## Provider Definition

Each provider has `id`, `type`, optional `weight`, optional `timeoutMs`, and optional `outputSchema`.

Supported provider types:

| Type | Required fields | Main optional fields |
| --- | --- | --- |
| `http` | `id`, `type`, `url` | `method`, `headers`, `queryParams`, `body` |
| `graphql` | `id`, `type`, `url`, `query` | `headers`, `variables` |
| `rpc` with `transport: "endpoint"` | `id`, `type`, `url`, `method` | `headers`, `params`, `body` |
| `rpc` with `transport: "source"` | `id`, `type`, `transport`, `method` | `params` |
| `substrate_storage` | `id`, `type`, `module`, `entry` | `source`, `args`, `block` |
| `evm_read` | `id`, `type`, `contract`, `method`, `abiFragment` | `source`, `abiContract`, `args` |
| `solana_account` | `id`, `type`, `account` | `source`, `idl`, `programId`, `accountName`, `pda` |
| `state_window` | `id`, `type`, `dedupeBy`, `value`, `keepLast` | `partitionBy`, `valueType`, `aggregate` |
| `javascript` | `id`, `type`, `source` | `variables` |
