# Workspaces API

Workspace endpoints gestionan workspaces, miembros y workspace avatar.

## GET /api/v2/workspaces

Devuelve la lista de workspaces disponibles para el account actual.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [WorkspaceViewShort[]](types.md#workspaceviewshort).

## GET /api/v2/workspaces/:fullname

Devuelve un workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [WorkspaceView](types.md#workspaceview).

## PUT /api/v2/workspaces/:fullname

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

## DELETE /api/v2/workspaces/:fullname

Elimina workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## POST /api/v2/workspaces/:fullname/avatar

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

Respuesta: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/v2/workspaces/:workspace/acl

Devuelve lista de members/ACL entries del workspace.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: ninguno.

Respuesta: [WorkspaceAclEntry[]](types.md#workspaceaclentry).

## POST /api/v2/workspaces/:workspace/acl

Crea invite o ACL entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `invite` | Sí | Invite id/token. |

Respuesta: [WorkspaceAclEntry](types.md#workspaceaclentry).

## PUT /api/v2/workspaces/:workspace/acl/:entryId

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

Respuesta: [WorkspaceAclEntry](types.md#workspaceaclentry).

## DELETE /api/v2/workspaces/:workspace/acl/:entryId

Elimina member/ACL entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).
