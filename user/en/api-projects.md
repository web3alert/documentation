# Projects API

Project endpoints manage marketplace integrations: metadata, visibility/access level, links, and uploaded icon/cover images.

## GET /api/v2/projects

Returns list of projects available to current account.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `scope` | Query | Optional scope: `all`, `marketplace`, `backend`. |

Payload: none.

Response: [ProjectView[]](types.md#projectview).

## GET /api/v2/projects/create-capability

Checks whether current account/workspace can create project.

Arguments: none.

Payload: none.

Response: [ProjectCreateCapability](types.md#projectcreatecapability).

## GET /api/v2/projects/:fullname

Returns project by fullname.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: none.

Response: [ProjectView](types.md#projectview).

## PUT /api/v2/projects/:fullname

Creates or updates project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. Must match `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Project name inside workspace. |
| `fullname` | Yes | Fullname in `<workspace>.<name>` format. |
| `workspace` | Yes | Workspace fullname. |
| `public` | Yes | Legacy public flag. For new code, it is better to also pass `accessLevel`. |
| `visibility` | No | Storage visibility: `public`, `private_link`, `personal`. |
| `accessLevel` | No | Product access level: `private`, `public`, `free`. |
| `tags` | No | Project tags. |
| `labels` | No | Project labels. |
| `meta.title` | Yes | Visible project title. |
| `meta.description` | Yes | Full description. |
| `meta.shortDescription` | No | Short description. |
| `meta.links` | No | Array of `{ title, url }` useful links. |
| `meta.icon` | No | Icon URL. Can be uploaded asset URL. |
| `meta.avatar` | No | Avatar URL. Usually same as `icon`. |
| `meta.cover` | No | Cover URL. Can be uploaded asset URL. |

Response: [ProjectView](types.md#projectview).

## DELETE /api/v2/projects/:fullname

Deletes project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## GET /api/v2/projects/by-link/:token

Opens private project by access link.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Access link token. |

Payload: none.

Response: [ProjectView](types.md#projectview).

## POST /api/v2/projects/:fullname/access-links

Creates access link for private project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `maxUsages` | No | Maximum link usages. |
| `expiresAt` | No | Expiration date-time. |

Response: [ProjectAccessLink](types.md#projectaccesslink).

## POST /api/v2/projects/:fullname/assets/images

Uploads project image for `icon` or `cover`.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Yes | Original filename. |
| `contentType` | Yes | Image MIME type. |
| `data` | Yes | Base64 image data. |
| `target` | Yes | `icon` or `cover`. |

Response: [ProjectImageUploadResult](types.md#projectimageuploadresult). This URL is then passed to `meta.icon` or `meta.cover` when saving project.

## DELETE /api/v2/projects/:fullname/images/:asset

Deletes uploaded project image.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Asset filename, for example `icon.png` or draft asset name. |

Payload: none.

Response: [OperationResult](types.md#operationresult).
