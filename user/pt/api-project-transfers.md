# Project Transfers API

Project transfer endpoints movem ownership de project entre workspaces através de request/accept flow.

## POST /api/projects/:fullname/transfer/plan

Devolve plano de transferência do project sem aplicar alterações.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Sim | Target workspace fullname. |
| `targetName` | Não | Novo project name no target workspace. Se não for passado, mantém-se o name atual. |

Resposta: [ProjectTransferPlan](types.md#projecttransferplan).

## POST /api/projects/:fullname/transfer-requests

Cria transfer request. Project será movido apenas depois de accept pelo owner do target workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Source project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `targetWorkspace` | Sim | Target workspace fullname. |
| `targetName` | Não | Novo project name no target workspace. |
| `expectedPlanHash` | Não | Hash do plano recebido de `/transfer/plan`. Se for passado e o plano tiver mudado, request não será criado. |

Resposta: [ProjectTransferRequest](types.md#projecttransferrequest).

## GET /api/project-transfer-requests

Devolve incoming/outgoing transfer requests.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` ou `outgoing`. |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Payload: nenhum.

Resposta: [ProjectTransferRequest[]](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/accept

Aceita incoming transfer request e aplica a transferência do project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload: optional action object.

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Não | Optional comment/reason. |

Resposta: [ProjectTransferAcceptResult](types.md#projecttransferacceptresult).

## POST /api/project-transfer-requests/:id/reject

Rejeita incoming transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Não | Optional rejection reason. |

Resposta: [ProjectTransferRequest](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/cancel

Cancela outgoing transfer request.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `reason` | Não | Optional cancellation reason. |

Resposta: [ProjectTransferRequest](types.md#projecttransferrequest).
