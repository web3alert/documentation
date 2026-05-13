# Resources API

Resource endpoints manage delivery resources and external setup flow.

## GET /api/v2/resources

Возвращает resources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `project` | Query | Optional project fullname filter. |

Payload: нет.

Response: array of resources.

## GET /api/v2/resources/:fullname

Возвращает resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: нет.

Response: resource object.

## PUT /api/v2/resources/:fullname

Создает или обновляет resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Должен совпадать с `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Resource name. |
| `fullname` | Да | Resource fullname. |
| `workspace` | Да | Workspace fullname. |
| `project` | Нет | Project fullname, если resource привязан к project. |
| `blueprint` | Да | Blueprint fullname that defines setup/action behavior. |
| `data` | Нет | Resource-specific data. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta.title` | Нет | Visible title. |

Response: saved resource.

## DELETE /api/v2/resources/:fullname

Удаляет resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: нет.

Response: operation result.

## GET /api/v2/resources/external/:token

Открывает external resource setup по token.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | External setup token. |

Payload: нет.

Response: external setup context.

## POST /api/v2/resources/external/:token

Отправляет payload external resource setup.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | External setup token. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `transform` | Да | Object or `null`, resource/app-specific transform/setup result. |

Response: updated external resource setup result.
