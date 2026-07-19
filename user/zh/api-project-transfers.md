# Project Transfers API

Project transfer endpoints 通过 request/accept flow 在 workspaces 之间转移 project ownership。

## POST /api/projects/:fullname/transfer/plan

返回 project transfer plan，但不应用任何更改。

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
如果项目 add-on 订阅处于 `draft`、`pending_activation`、`active`、`past_due`
或 `cancel_at_period_end` 状态，则无法生成转移计划。请先取消订阅或等待订阅结束，
然后再规划转移。这样可以避免在所有者之间隐式转移周期性计费。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | 是 | Target workspace fullname. |
| `targetName` | 否 | target workspace 中的新 project name。如果未传入，则保留当前 name。 |

响应：[ProjectTransferPlan](types.md#projecttransferplan)。

## POST /api/projects/:fullname/transfer-requests

创建 transfer request。只有 target workspace owner accept 后，project 才会被转移。

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
如果项目 add-on 订阅处于 `draft`、`pending_activation`、`active`、`past_due`
或 `cancel_at_period_end` 状态，则无法创建转移请求。请先取消订阅或等待订阅结束，
然后再创建请求。这样可以避免在所有者之间隐式转移周期性计费。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | 是 | Target workspace fullname. |
| `targetName` | 否 | target workspace 中的新 project name。 |
| `expectedPlanHash` | 否 | 从 `/transfer/plan` 获得的 plan hash。如果传入且 plan 已变化，则不会创建 request。 |

响应：[ProjectTransferRequest](types.md#projecttransferrequest)。

## GET /api/project-transfer-requests

返回 incoming/outgoing transfer requests。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` 或 `outgoing`。 |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Payload: 无。

响应：[ProjectTransferRequest[]](types.md#projecttransferrequest)。

## POST /api/project-transfer-requests/:id/accept

接受 incoming transfer request 并应用 project transfer。

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
如果项目 add-on 订阅处于 `draft`、`pending_activation`、`active`、`past_due`
或 `cancel_at_period_end` 状态，则无法接受转移请求。请先取消订阅或等待订阅结束，
然后再接受请求。这样可以避免在所有者之间隐式转移周期性计费。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload: optional action object.

| Field | Required | Description |
| --- | --- | --- |
| `reason` | 否 | Optional comment/reason. |

响应：[ProjectTransferAcceptResult](types.md#projecttransferacceptresult)。

## POST /api/project-transfer-requests/:id/reject

拒绝 incoming transfer request。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | 否 | Optional rejection reason. |

响应：[ProjectTransferRequest](types.md#projecttransferrequest)。

## POST /api/project-transfer-requests/:id/cancel

取消 outgoing transfer request。

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | 否 | Optional cancellation reason. |

响应：[ProjectTransferRequest](types.md#projecttransferrequest)。
