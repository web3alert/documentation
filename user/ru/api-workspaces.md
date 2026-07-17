# Workspaces API

Endpoints Workspaces управляют рабочими пространствами, участниками и аватаром workspace.

## GET /api/workspaces

Возвращает список workspaces, доступных текущему account.

Аргументы: нет.

Тело запроса: нет.

Ответ: [WorkspaceViewShort[]](types.md#workspaceviewshort).

## GET /api/workspaces/:fullname

Возвращает один workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Тело запроса: нет.

Ответ: [WorkspaceView](types.md#workspaceview).

## PUT /api/workspaces/:fullname

Создает новый workspace или обновляет существующий.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `fullname` | Да | Workspace fullname. |
| `createOnly` | Нет | Если `true`, endpoint вернет ошибку, если workspace уже существует. |
| `resetInvite` | Нет | Перегенерировать invite state. |
| `tags` | Нет | Массив tags. |
| `labels` | Нет | Объект строковых labels. |
| `meta.title` | Нет | Видимое название workspace. |
| `meta.avatar` | Нет | URL avatar. |

Ответ: [WorkspaceView](types.md#workspaceview).

## DELETE /api/workspaces/:fullname

Удаляет workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## POST /api/workspaces/:fullname/avatar

Загружает avatar workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `filename` | Да | Исходное имя файла. |
| `contentType` | Да | MIME-тип изображения. |
| `data` | Да | Данные изображения в Base64. |

Ответ: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/workspaces/:workspace/acl

Возвращает список members/ACL entries workspace.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Тело запроса: нет.

Ответ: [WorkspaceAclEntry[]](types.md#workspaceaclentry).

## POST /api/workspaces/:workspace/acl

Создает invite или ACL entry.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `invite` | Да | Invite id/token. |

Ответ: [WorkspaceAclEntry](types.md#workspaceaclentry).

## PUT /api/workspaces/:workspace/acl/:entryId

Меняет роль member.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `level` | Да | Одна из ролей: `owner`, `admin`, `developer`, `user`. |

Ответ: [WorkspaceAclEntry](types.md#workspaceaclentry).

## DELETE /api/workspaces/:workspace/acl/:entryId

Удаляет member/ACL entry.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).
