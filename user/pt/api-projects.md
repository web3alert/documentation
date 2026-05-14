# Projects API

Project endpoints gerem marketplace integrations: metadata, visibility/access level, links e uploaded icon/cover images.

## GET /api/v2/projects

Devolve lista de projects disponíveis para current account.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `scope` | Query | Optional scope: `all`, `marketplace`, `backend`. |

Payload: nenhum.

Resposta: [ProjectView[]](types.md#projectview).

## GET /api/v2/projects/create-capability

Verifica se current account/workspace pode criar project.

Arguments: nenhum.

Payload: nenhum.

Resposta: [ProjectCreateCapability](types.md#projectcreatecapability).

## GET /api/v2/projects/:fullname

Devolve project por fullname.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: nenhum.

Resposta: [ProjectView](types.md#projectview).

## PUT /api/v2/projects/:fullname

Cria ou atualiza project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Sim | Project name dentro do workspace. |
| `fullname` | Sim | Fullname no formato `<workspace>.<name>`. |
| `workspace` | Sim | Workspace fullname. |
| `public` | Sim | Legacy public flag. Para código novo, é melhor passar também `accessLevel`. |
| `visibility` | Não | Storage visibility: `public`, `private_link`, `personal`. |
| `accessLevel` | Não | Product access level: `private`, `public`, `free`. |
| `tags` | Não | Project tags. |
| `labels` | Não | Project labels. |
| `meta.title` | Sim | Título visível do project. |
| `meta.description` | Sim | Descrição completa. |
| `meta.shortDescription` | Não | Descrição curta. |
| `meta.links` | Não | Array de `{ title, url }` useful links. |
| `meta.icon` | Não | Icon URL. Pode ser uploaded asset URL. |
| `meta.avatar` | Não | Avatar URL. Normalmente coincide com `icon`. |
| `meta.cover` | Não | Cover URL. Pode ser uploaded asset URL. |

Resposta: [ProjectView](types.md#projectview).

## DELETE /api/v2/projects/:fullname

Elimina project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## GET /api/v2/projects/by-link/:token

Abre private project por access link.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Access link token. |

Payload: nenhum.

Resposta: [ProjectView](types.md#projectview).

## POST /api/v2/projects/:fullname/access-links

Cria access link para private project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `maxUsages` | Não | Maximum link usages. |
| `expiresAt` | Não | Expiration date-time. |

Resposta: [ProjectAccessLink](types.md#projectaccesslink).

## POST /api/v2/projects/:fullname/assets/images

Envia project image para `icon` ou `cover`.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Sim | Original filename. |
| `contentType` | Sim | MIME type da imagem. |
| `data` | Sim | Base64 image data. |
| `target` | Sim | `icon` ou `cover`. |

Resposta: [ProjectImageUploadResult](types.md#projectimageuploadresult). Este URL depois é passado em `meta.icon` ou `meta.cover` ao guardar project.

## DELETE /api/v2/projects/:fullname/images/:asset

Elimina uploaded project image.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `asset` | Path | Asset filename, por exemplo `icon.png` ou draft asset name. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).
