# Projects API

Project endpoints управляют marketplace integrations: metadata, visibility/access level, links and uploaded icon/cover images.

## GET /api/v2/projects

Возвращает список projects, доступных текущему account.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `scope` | Query | Optional scope: `all`, `marketplace`, `backend`. |

Payload: нет.

Response: array of projects.

## GET /api/v2/projects/create-capability

Проверяет, может ли текущий account/workspace создать project.

Arguments: нет.

Payload: нет.

Response: capability object with tier/limit information.

## GET /api/v2/projects/:fullname

Возвращает project по fullname.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: нет.

Response: project object.

## PUT /api/v2/projects/:fullname

Создает или обновляет project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. Должен совпадать с `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Project name внутри workspace. |
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
| `meta.links` | Нет | Array of `{ title, url }` useful links. |
| `meta.icon` | Нет | Icon URL. Может быть uploaded asset URL. |
| `meta.avatar` | Нет | Avatar URL. Обычно совпадает с `icon`. |
| `meta.cover` | Нет | Cover URL. Может быть uploaded asset URL. |

Response: project object.

## DELETE /api/v2/projects/:fullname

Удаляет project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: нет.

Response: operation result.

## GET /api/v2/projects/by-link/:token

Открывает private project по access link.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Access link token. |

Payload: нет.

Response: project view.

## POST /api/v2/projects/:fullname/access-links

Создает access link для private project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `maxUsages` | Нет | Maximum link usages. |
| `expiresAt` | Нет | Expiration date-time. |

Response: created access link.

## POST /api/v2/projects/:fullname/assets/images

Загружает project image для `icon` или `cover`.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Да | Original filename. |
| `contentType` | Да | MIME type изображения. |
| `data` | Да | Base64 image data. |
| `target` | Да | `icon` или `cover`. |

Response: uploaded image URL. Этот URL затем передается в `meta.icon` или `meta.cover` при сохранении project.

## DELETE /api/v2/projects/:fullname/images/:asset

Удаляет uploaded project image.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Asset filename, например `icon.png` или draft asset name. |

Payload: нет.

Response: operation result.
