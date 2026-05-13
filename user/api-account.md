# Account API

Account endpoints работают с текущим пользователем, его metadata, avatar и выбранным workspace.

Все endpoints требуют `Authorization: Bearer <token>`, кроме случаев, когда token создается после внешнего auth flow.

## POST /api/v1/token

Создает или возвращает API token для authenticated identity.

Arguments: нет path/query arguments.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `app` | Да | Auth app/provider name. |
| `credentials` | Да | Provider-specific credentials object. |

Response: token/account context для дальнейших API-запросов.

## GET /api/v1/me

Возвращает текущий account, identity, tier, memberships и выбранный workspace.

Arguments: нет.

Payload: нет.

Response: account view.

## DELETE /api/v1/me

Удаляет текущий account.

Arguments: нет.

Payload: нет.

Response: operation result.

## PUT /api/v1/me/meta

Обновляет пользовательские metadata.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `nickname` | Нет | Display name пользователя, 2-80 символов. |

Response: updated account view.

## POST /api/v1/me/avatar

Загружает avatar текущего account.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Да | Original filename. |
| `contentType` | Да | MIME type изображения. |
| `data` | Да | Base64 image data. |

Response: account view или avatar upload result с новым avatar URL.

## GET /api/v1/me/workspace

Возвращает выбранный workspace текущего account.

Arguments: нет.

Payload: нет.

Response: workspace account/current workspace context.

## POST /api/v1/me/workspace

Меняет выбранный workspace текущего account.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `workspace` | Да | Workspace fullname или `null`, чтобы сбросить выбор. |

Response: updated current workspace context.

## GET /api/v1/account/settings

Возвращает account settings.

Arguments: нет.

Payload: нет.

Response: account settings.

## POST /api/v1/account/settings

Сохраняет account settings.

Arguments: нет.

Payload: settings object. Конкретный набор полей зависит от текущей версии account settings UI.

Response: updated account settings.
