# Project Transfers API

Project transfer endpoints mueven ownership de project entre workspaces mediante request/accept flow.

## POST /api/projects/:fullname/transfer/plan

Devuelve plan de transferencia de project sin aplicar cambios.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
La planificación se bloquea mientras el proyecto tenga una suscripción de
add-on en estado `draft`, `pending_activation`, `active`, `past_due` o
`cancel_at_period_end`. Cancela la suscripción o espera a que termine antes de
volver a planificar la transferencia. Así se evita trasladar implícitamente la
facturación recurrente entre propietarios.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Sí | Target workspace fullname. |
| `targetName` | No | Nuevo project name en target workspace. Si no se pasa, se mantiene el name actual. |

Respuesta: [ProjectTransferPlan](types.md#projecttransferplan).

## POST /api/projects/:fullname/transfer-requests

Crea transfer request. Project se moverá solo después de accept por parte del owner del target workspace.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
La creación de la solicitud se bloquea mientras el proyecto tenga una
suscripción de add-on en estado `draft`, `pending_activation`, `active`,
`past_due` o `cancel_at_period_end`. Cancela la suscripción o espera a que
termine antes de crear la solicitud de transferencia. Así se evita trasladar
implícitamente la facturación recurrente entre propietarios.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Sí | Target workspace fullname. |
| `targetName` | No | Nuevo project name en target workspace. |
| `expectedPlanHash` | No | Hash del plan recibido de `/transfer/plan`. Si se pasa y el plan cambió, request no se creará. |

Respuesta: [ProjectTransferRequest](types.md#projecttransferrequest).

## GET /api/project-transfer-requests

Devuelve incoming/outgoing transfer requests.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` o `outgoing`. |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Payload: ninguno.

Respuesta: [ProjectTransferRequest[]](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/accept

Acepta incoming transfer request y aplica transferencia de project.

<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->
La aceptación se bloquea mientras el proyecto tenga una suscripción de add-on
en estado `draft`, `pending_activation`, `active`, `past_due` o
`cancel_at_period_end`. Cancela la suscripción o espera a que termine antes de
aceptar la solicitud. Así se evita trasladar implícitamente la facturación
recurrente entre propietarios.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload: optional action object.

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional comment/reason. |

Respuesta: [ProjectTransferAcceptResult](types.md#projecttransferacceptresult).

## POST /api/project-transfer-requests/:id/reject

Rechaza incoming transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional rejection reason. |

Respuesta: [ProjectTransferRequest](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/cancel

Cancela outgoing transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | No | Optional cancellation reason. |

Respuesta: [ProjectTransferRequest](types.md#projecttransferrequest).
