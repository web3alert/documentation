# Account API

Endpoints Account работают с текущим пользователем, его метаданными, аватаром и выбранным workspace.

Все endpoints требуют `Authorization: Bearer <token>`, кроме случаев, когда токен создается после внешнего процесса авторизации.

## POST /api/token

Создает или возвращает API-токен для авторизованной identity.

Аргументы: path/query аргументов нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `app` | Да | Имя auth app/provider. |
| `credentials` | Да | Учетные данные выбранного provider. |

Ответ: [TokenResponse](types.md#tokenresponse).

## GET /api/me

Возвращает текущий account, identity, tier, memberships и выбранный workspace.

Аргументы: нет.

Тело запроса: нет.

Ответ: [Me](types.md#me).

## DELETE /api/me

Удаляет текущий account.

Аргументы: нет.

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## PUT /api/me/meta

Обновляет пользовательские метаданные.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `nickname` | Да | Отображаемое имя пользователя, 2-80 символов. Перед сохранением и возвратом удаляются начальные и конечные пробельные символы. |

Ответ: HTTP 200 OK.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `nickname` | Да | Сохраненный nickname без начальных и конечных пробельных символов. |

## POST /api/me/avatar

Загружает avatar текущего account.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `filename` | Да | Исходное имя файла. |
| `contentType` | Да | MIME-тип изображения. |
| `data` | Да | Данные изображения в Base64. |

Ответ: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/me/workspace

Возвращает выбранный workspace текущего account.

Аргументы: нет.

Тело запроса: нет.

Ответ: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## PUT /api/me/workspace

Меняет выбранный workspace текущего account.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `workspace` | Да | Workspace fullname или `null`, чтобы сбросить выбор. |

Ответ: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## GET /api/account/settings

Возвращает account settings.

Аргументы: нет.

Тело запроса: нет.

Ответ: [AccountSettings](types.md#accountsettings).

## PUT /api/account/settings

Сохраняет account settings.

Аргументы: нет.

Тело запроса: объект settings. Конкретный набор полей зависит от текущей версии account settings UI.

Ответ: [AccountSettings](types.md#accountsettings).
