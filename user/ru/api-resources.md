# Resources API

Endpoints Resources управляют delivery resources и их публичными setup flows.
Все маршруты на этой странице используют канонический namespace `/api`.

## GET /api/resources

Возвращает resources.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |
| `project` | Query | Опциональный фильтр по project fullname. |

Тело запроса: нет.

Ответ: [ResourceView[]](types.md#resourceview).

## GET /api/resources/:fullname

Возвращает resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Ответ: [ResourceView](types.md#resourceview).

## PUT /api/resources/:fullname

Создает или обновляет resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя resource. |
| `fullname` | Да | Resource fullname. |
| `workspace` | Да | Workspace fullname. |
| `project` | Нет | Project fullname, если resource привязан к project. |
| `blueprint` | Да | Blueprint fullname, который задает setup/action behavior. |
| `data` | Нет | Данные конкретного resource. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta.title` | Нет | Видимое название. |

Ответ: [ResourceView](types.md#resourceview).

## DELETE /api/resources/:fullname

Удаляет resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## POST /api/resources/:fullname/setup-sessions

Создает безопасную setup session для выбора Telegram destination. Авторизованный
account должен быть владельцем workspace, которому принадлежит resource, а сам
resource должен использовать внешний Telegram blueprint.

У resource может быть только одна активная setup session. Новая session переводит
предыдущую активную session в статус `superseded`, но не меняет текущий destination
resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |

Тело запроса: нет.

Ответ:

| Поле | Описание |
| --- | --- |
| `id` | ID setup session для проверки статуса или отмены. |
| `status` | `pending`. |
| `setupToken` | Одноразовый секрет для запуска setup flow в Telegram-боте. Возвращается только в этом ответе; его нельзя логировать или сохранять. |
| `expiresAt` | ISO timestamp. Session и `setupToken` истекают через 15 минут после создания. |

Старый destination продолжает получать alerts, пока Telegram не подтвердит новую
цель и session не перейдет в статус `completed`.

## GET /api/resources/:fullname/setup-sessions/:id

Возвращает публичный статус Telegram destination setup session. Ответ никогда не
содержит `setupToken`.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |
| `id` | Path | ID setup session. |

Тело запроса: нет.

Ответ:

| Поле | Описание |
| --- | --- |
| `id` | ID setup session. |
| `resourceFullname` | Fullname resource. |
| `status` | `pending`, `claimed`, `completed`, `cancelled`, `expired` или `superseded`. |
| `expiresAt` | ISO timestamp окончания session. |

## DELETE /api/resources/:fullname/setup-sessions/:id

Отменяет активную Telegram destination setup session. Для уже настроенного
resource отмена безопасна: его текущий destination не изменяется.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |
| `id` | Path | ID setup session. |

Тело запроса: нет.

Ответ: пустой успешный ответ.

## GET /api/resources/external/:token

Открывает external resource setup по token.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Токен external setup. |

Тело запроса: нет.

Ответ: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Отправляет payload для external resource setup.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Токен external setup. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `transform` | Да | Объект или `null`, resource/app-specific результат transform/setup. |

Ответ: [OperationResult](types.md#operationresult).
