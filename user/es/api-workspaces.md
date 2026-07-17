# Workspaces API

Workspace endpoints gestionan workspaces, miembros y workspace avatar.

## GET /api/workspaces

Devuelve la lista de workspaces disponibles para el account actual.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [WorkspaceViewShort[]](types.md#workspaceviewshort).

## GET /api/workspaces/:fullname

Devuelve un workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [WorkspaceView](types.md#workspaceview).

## PUT /api/workspaces/:fullname

Crea un nuevo workspace o actualiza uno existente.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. Debe coincidir con `payload.fullname`. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `fullname` | Sí | Workspace fullname. |
| `createOnly` | No | Si `true`, endpoint devuelve error si workspace ya existe. |
| `resetInvite` | No | Regenera invite state. |
| `tags` | No | Array de tags. |
| `labels` | No | Objeto con labels string. |
| `meta.title` | No | Título visible del workspace. |
| `meta.avatar` | No | Avatar URL. |

Respuesta: [WorkspaceView](types.md#workspaceview).

## DELETE /api/workspaces/:fullname

Elimina workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## POST /api/workspaces/:fullname/avatar

Sube el avatar del workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `filename` | Sí | Nombre original del archivo. |
| `contentType` | Sí | MIME type de la imagen. |
| `data` | Sí | Datos de imagen en Base64. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `url` | Sí | URL del avatar cargado. El mismo valor se guarda en `workspace.meta.avatar`. |
| `fileName` | Sí | Nombre del archivo guardado. |
| `extension` | Sí | Extensión del archivo. |
| `size` | Sí | Tamaño del archivo en bytes. |
| `workspace` | Sí | [WorkspaceView](types.md#workspaceview) actualizado, incluida la nueva metadata del avatar. |

## GET /api/workspaces/:workspace/acl

Devuelve lista de members/ACL entries del workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [WorkspaceAclEntry[]](types.md#workspaceaclentry).

## POST /api/workspaces/:workspace/acl

Crea invite o ACL entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `invite` | Sí | Invite id/token. |

Respuesta: HTTP 204 No Content con un cuerpo vacío.
<!-- api-contract: response=204; body=empty -->

## PUT /api/workspaces/:workspace/acl/:entryId

Cambia el rol de member.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `level` | Sí | Uno de `owner`, `admin`, `developer`, `user`. |

Respuesta: HTTP 204 No Content con un cuerpo vacío.
<!-- api-contract: response=204; body=empty -->

## DELETE /api/workspaces/:workspace/acl/:entryId

Elimina member/ACL entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).
