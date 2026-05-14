# Projects API

Project endpoints gestionan marketplace integrations: metadata, visibility/access level, links y uploaded icon/cover images.

## GET /api/v2/projects

Devuelve lista de projects disponibles para current account.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `scope` | Query | Optional scope: `all`, `marketplace`, `backend`. |

Payload: ninguno.

Respuesta: [ProjectView[]](types.md#projectview).

## GET /api/v2/projects/create-capability

Comprueba si current account/workspace puede crear project.

Arguments: ninguno.

Payload: ninguno.

Respuesta: [ProjectCreateCapability](types.md#projectcreatecapability).

## GET /api/v2/projects/:fullname

Devuelve project por fullname.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: ninguno.

Respuesta: [ProjectView](types.md#projectview).

## PUT /api/v2/projects/:fullname

Crea o actualiza project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. Debe coincidir con `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Sí | Project name dentro de workspace. |
| `fullname` | Sí | Fullname en formato `<workspace>.<name>`. |
| `workspace` | Sí | Workspace fullname. |
| `public` | Sí | Legacy public flag. Para código nuevo, es mejor pasar también `accessLevel`. |
| `visibility` | No | Storage visibility: `public`, `private_link`, `personal`. |
| `accessLevel` | No | Product access level: `private`, `public`, `free`. |
| `tags` | No | Project tags. |
| `labels` | No | Project labels. |
| `meta.title` | Sí | Título visible del project. |
| `meta.description` | Sí | Descripción completa. |
| `meta.shortDescription` | No | Descripción corta. |
| `meta.links` | No | Array de `{ title, url }` useful links. |
| `meta.icon` | No | Icon URL. Puede ser uploaded asset URL. |
| `meta.avatar` | No | Avatar URL. Normalmente coincide con `icon`. |
| `meta.cover` | No | Cover URL. Puede ser uploaded asset URL. |

Respuesta: [ProjectView](types.md#projectview).

## DELETE /api/v2/projects/:fullname

Elimina project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## GET /api/v2/projects/by-link/:token

Abre private project por access link.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Access link token. |

Payload: ninguno.

Respuesta: [ProjectView](types.md#projectview).

## POST /api/v2/projects/:fullname/access-links

Crea access link para private project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `maxUsages` | No | Maximum link usages. |
| `expiresAt` | No | Expiration date-time. |

Respuesta: [ProjectAccessLink](types.md#projectaccesslink).

## POST /api/v2/projects/:fullname/assets/images

Sube project image para `icon` o `cover`.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Sí | Original filename. |
| `contentType` | Sí | MIME type de la imagen. |
| `data` | Sí | Base64 image data. |
| `target` | Sí | `icon` o `cover`. |

Respuesta: [ProjectImageUploadResult](types.md#projectimageuploadresult). Este URL se pasa después en `meta.icon` o `meta.cover` al guardar project.

## DELETE /api/v2/projects/:fullname/images/:asset

Elimina uploaded project image.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Asset filename, por ejemplo `icon.png` o draft asset name. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).
