# Projects API

Endpoints Projects управляют marketplace integrations: metadata, visibility/access level, links и загруженными icon/cover images.

## GET /api/v2/projects

Возвращает список projects, доступных текущему account.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |
| `scope` | Query | Опциональный scope: `all`, `marketplace`, `backend`. |

Тело запроса: нет.

Ответ: [ProjectView[]](types.md#projectview).

## GET /api/v2/projects/create-capability

Проверяет, может ли текущий account/workspace создать project.

Аргументы: нет.

Тело запроса: нет.

Ответ: [ProjectCreateCapability](types.md#projectcreatecapability).

## GET /api/v2/projects/:fullname

Возвращает project по fullname.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса: нет.

Ответ: [ProjectView](types.md#projectview).

## PUT /api/v2/projects/:fullname

Создает или обновляет project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя project внутри workspace. |
| `fullname` | Да | Fullname в формате `<workspace>.<name>`. |
| `workspace` | Да | Workspace fullname. |
| `public` | Да | Legacy public flag. Для нового кода лучше также передавать `accessLevel`. |
| `visibility` | Нет | Storage visibility: `public`, `private_link`, `personal`. |
| `accessLevel` | Нет | Product access level: `private`, `public`, `free`. |
| `tags` | Нет | Project tags. |
| `labels` | Нет | Project labels. |
| `meta.title` | Да | Видимое название project. |
| `meta.description` | Да | Полное описание. |
| `meta.shortDescription` | Нет | Короткое описание. |
| `meta.links` | Нет | Массив useful links в формате `{ title, url }`. |
| `meta.icon` | Нет | URL icon. Может быть uploaded asset URL. |
| `meta.avatar` | Нет | URL avatar. Обычно совпадает с `icon`. |
| `meta.cover` | Нет | URL cover. Может быть uploaded asset URL. |

Ответ: [ProjectView](types.md#projectview).

## DELETE /api/v2/projects/:fullname

Удаляет project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## GET /api/v2/projects/by-link/:token

Открывает private project по access link.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Токен access link. |

Тело запроса: нет.

Ответ: [ProjectView](types.md#projectview).

## POST /api/v2/projects/:fullname/access-links

Создает access link для private project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `maxUsages` | Нет | Максимальное количество использований ссылки. |
| `expiresAt` | Нет | Дата и время истечения срока действия. |

Ответ: [ProjectAccessLink](types.md#projectaccesslink).

## POST /api/v2/projects/:fullname/assets/images

Загружает изображение project для `icon` или `cover`.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `filename` | Да | Исходное имя файла. |
| `contentType` | Да | MIME-тип изображения. |
| `data` | Да | Данные изображения в Base64. |
| `target` | Да | `icon` или `cover`. |

Ответ: [ProjectImageUploadResult](types.md#projectimageuploadresult). Этот URL затем передается в `meta.icon` или `meta.cover` при сохранении project.

## DELETE /api/v2/projects/:fullname/images/:asset

Удаляет загруженное изображение project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Имя asset file, например `icon.png` или draft asset name. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).
