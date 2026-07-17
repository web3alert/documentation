# Project Transfers API

Endpoints Project Transfers переносят ownership project между workspaces через request/accept flow.

## POST /api/projects/:fullname/transfer/plan

Возвращает план переноса project без применения изменений.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname исходного project. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `targetWorkspace` | Да | Fullname целевого workspace. |
| `targetName` | Нет | Новое имя project в целевом workspace. Если не передано, сохраняется текущее имя. |

Ответ: [ProjectTransferPlan](types.md#projecttransferplan).

## POST /api/projects/:fullname/transfer-requests

Создает transfer request. Project будет перенесен только после accept со стороны owner целевого workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname исходного project. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `targetWorkspace` | Да | Fullname целевого workspace. |
| `targetName` | Нет | Новое имя project в целевом workspace. |
| `expectedPlanHash` | Нет | Hash плана, полученный из `/transfer/plan`. Если передан и план изменился, request не будет создан. |

Ответ: [ProjectTransferRequest](types.md#projecttransferrequest).

## GET /api/project-transfer-requests

Возвращает incoming/outgoing transfer requests.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Workspace fullname. |
| `direction` | Query | `incoming` или `outgoing`. |
| `status` | Query | `pending`, `accepted`, `rejected`, `cancelled`, `expired`, `failed`. |

Тело запроса: нет.

Ответ: [ProjectTransferRequest[]](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/accept

Принимает incoming transfer request и применяет перенос project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Тело запроса: опциональный action object.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `reason` | Нет | Опциональный комментарий или причина. |

Ответ: [ProjectTransferAcceptResult](types.md#projecttransferacceptresult).

## POST /api/project-transfer-requests/:id/reject

Отклоняет incoming transfer request.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `reason` | Нет | Опциональная причина отклонения. |

Ответ: [ProjectTransferRequest](types.md#projecttransferrequest).

## POST /api/project-transfer-requests/:id/cancel

Отменяет outgoing transfer request.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Transfer request id. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `reason` | Нет | Опциональная причина отмены. |

Ответ: [ProjectTransferRequest](types.md#projecttransferrequest).
