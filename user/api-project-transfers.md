# Project Transfers API

Project transfer endpoints переносят ownership project между workspaces через request/accept flow.

## POST /api/v2/projects/:fullname/transfer/plan

Возвращает план переноса project без применения изменений.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Да | Target workspace fullname. |
| `targetName` | Нет | Новое project name в target workspace. Если не передано, сохраняется текущее name. |

Response: transfer plan with counts, conflicts, aliases to update and plan hash.

## POST /api/v2/projects/:fullname/transfer-requests

Создает transfer request. Project будет перенесен только после accept со стороны owner target workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Да | Target workspace fullname. |
| `targetName` | Нет | Новое project name в target workspace. |
| `expectedPlanHash` | Нет | Hash плана, полученный из `/transfer/plan`. Если передан и план изменился, request не будет создан. |

Response: created transfer request.

## GET /api/v2/project-transfer-requests

Возвращает incoming/outgoing transfer requests.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` или `outgoing`. |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Payload: нет.

Response: array of transfer requests.

## POST /api/v2/project-transfer-requests/:id/accept

Принимает incoming transfer request и применяет перенос project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload: optional action object.

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Нет | Optional comment/reason. |

Response: accepted request and transfer result.

## POST /api/v2/project-transfer-requests/:id/reject

Отклоняет incoming transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Нет | Optional rejection reason. |

Response: updated request.

## POST /api/v2/project-transfer-requests/:id/cancel

Отменяет outgoing transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Нет | Optional cancellation reason. |

Response: updated request.
