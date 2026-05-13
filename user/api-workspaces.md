# Workspaces API

Workspace endpoints управляют рабочими пространствами, участниками и avatar workspace.

## GET /api/v2/workspaces

Возвращает список workspaces, доступных текущему account.

Arguments: нет.

Payload: нет.

Response: array of workspace views.

## GET /api/v2/workspaces/:fullname

Возвращает один workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: нет.

Response: workspace view.

## PUT /api/v2/workspaces/:fullname

Создает новый workspace или обновляет существующий.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. Должен совпадать с `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullname` | Да | Workspace fullname. |
| `createOnly` | Нет | Если `true`, endpoint вернет ошибку, если workspace уже существует. |
| `resetInvite` | Нет | Перегенерировать invite state. |
| `tags` | Нет | Array of tags. |
| `labels` | Нет | Object with string labels. |
| `meta.title` | Нет | Видимое название workspace. |
| `meta.avatar` | Нет | Avatar URL. |

Response: workspace view.

## DELETE /api/v2/workspaces/:fullname

Удаляет workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: нет.

Response: operation result.

## POST /api/v2/workspaces/:fullname/avatar

Загружает avatar workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Да | Original filename. |
| `contentType` | Да | MIME type изображения. |
| `data` | Да | Base64 image data. |

Response: workspace view или avatar upload result с новым avatar URL.

## GET /api/v2/workspaces/:workspace/acl

Возвращает список members/ACL entries workspace.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: нет.

Response: ACL entries.

## POST /api/v2/workspaces/:workspace/acl

Создает invite или ACL entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `invite` | Да | Invite id/token. |

Response: created ACL entry.

## PUT /api/v2/workspaces/:workspace/acl/:entryId

Меняет роль member.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `level` | Да | One of `owner`, `admin`, `developer`, `user`. |

Response: updated ACL entry.

## DELETE /api/v2/workspaces/:workspace/acl/:entryId

Удаляет member/ACL entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: нет.

Response: operation result.
