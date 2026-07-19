# Project Transfers API

Project transfer endpoints move project ownership between workspaces through request/accept flow.

## POST /api/projects/:fullname/transfer/plan

Returns project transfer plan without applying changes.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
Planning is blocked while the project has a project add-on subscription in
`draft`, `pending_activation`, `active`, `past_due`, or
`cancel_at_period_end`. Cancel the subscription or wait until it has ended
before planning the transfer again. This prevents recurring billing from moving
implicitly between owners.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Yes | Target workspace fullname. |
| `targetName` | No | New project name in target workspace. If omitted, current name is kept. |

Response: [ProjectTransferPlan](types.md#projecttransferplan).

## POST /api/projects/:fullname/transfer-requests

Creates transfer request. Project will be moved only after accept from target workspace owner.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
Request creation is blocked while the project has a project add-on subscription
in `draft`, `pending_activation`, `active`, `past_due`, or
`cancel_at_period_end`. Cancel the subscription or wait until it has ended
before creating the transfer request. This prevents recurring billing from
moving implicitly between owners.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Yes | Target workspace fullname. |
| `targetName` | No | New project name in target workspace. |
| `expectedPlanHash` | No | Plan hash received from `/transfer/plan`. If passed and plan changed, request will not be created. |

Response: [ProjectTransferRequest](types.md#projecttransferrequest).

## GET /api/project-transfer-requests

Returns incoming/outgoing transfer requests.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` or `outgoing`. |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Payload: none.

Response: [ProjectTransferRequest[]](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/accept

Accepts incoming transfer request and applies project transfer.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
Acceptance is blocked while the project has a project add-on subscription in
`draft`, `pending_activation`, `active`, `past_due`, or
`cancel_at_period_end`. Cancel the subscription or wait until it has ended
before accepting the request. This prevents recurring billing from moving
implicitly between owners.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload: optional action object.

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional comment/reason. |

Response: [ProjectTransferAcceptResult](types.md#projecttransferacceptresult).

## POST /api/project-transfer-requests/:id/reject

Rejects incoming transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional rejection reason. |

Response: [ProjectTransferRequest](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/cancel

Cancels outgoing transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional cancellation reason. |

Response: [ProjectTransferRequest](types.md#projecttransferrequest).
