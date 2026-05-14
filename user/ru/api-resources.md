# Resources API

Endpoints Resources управляют delivery resources и external setup flow.

## GET /api/v2/resources

Возвращает resources.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |
| `project` | Query | Опциональный фильтр по project fullname. |

Тело запроса: нет.

Ответ: [ResourceView[]](types.md#resourceview).

## GET /api/v2/resources/:fullname

Возвращает resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Ответ: [ResourceView](types.md#resourceview).

## PUT /api/v2/resources/:fullname

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

## DELETE /api/v2/resources/:fullname

Удаляет resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## GET /api/v2/resources/external/:token

Открывает external resource setup по token.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Токен external setup. |

Тело запроса: нет.

Ответ: [ExternalResourceView](types.md#externalresourceview).

## POST /api/v2/resources/external/:token

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
