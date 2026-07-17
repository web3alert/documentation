# Workspaces API

Workspace endpoints gerem workspaces, members e workspace avatar.

## GET /api/workspaces

Devolve a lista de workspaces disponíveis para o account atual.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [WorkspaceViewShort[]](types.md#workspaceviewshort).

## GET /api/workspaces/:fullname

Devolve um workspace.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: nenhum.

Resposta: [WorkspaceView](types.md#workspaceview).

## PUT /api/workspaces/:fullname

Cria novo workspace ou atualiza existente.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `fullname` | Sim | Workspace fullname. |
| `createOnly` | Não | Se `true`, endpoint devolve erro se workspace já existir. |
| `resetInvite` | Não | Regenera invite state. |
| `tags` | Não | Array de tags. |
| `labels` | Não | Objeto com labels string. |
| `meta.title` | Não | Título visível do workspace. |
| `meta.avatar` | Não | Avatar URL. |

Resposta: [WorkspaceView](types.md#workspaceview).

## DELETE /api/workspaces/:fullname

Elimina workspace.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## POST /api/workspaces/:fullname/avatar

Envia o avatar do workspace.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Workspace fullname. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `filename` | Sim | Nome original do ficheiro. |
| `contentType` | Sim | MIME type da imagem. |
| `data` | Sim | Dados da imagem em Base64. |

Resposta: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/workspaces/:workspace/acl

Devolve lista de members/ACL entries do workspace.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload: nenhum.

Resposta: [WorkspaceAclEntry[]](types.md#workspaceaclentry).

## POST /api/workspaces/:workspace/acl

Cria invite ou ACL entry.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `invite` | Sim | Invite id/token. |

Resposta: [WorkspaceAclEntry](types.md#workspaceaclentry).

## PUT /api/workspaces/:workspace/acl/:entryId

Altera papel de member.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `level` | Sim | Um de `owner`, `admin`, `developer`, `user`. |

Resposta: [WorkspaceAclEntry](types.md#workspaceaclentry).

## DELETE /api/workspaces/:workspace/acl/:entryId

Elimina member/ACL entry.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `workspace` | Path | Workspace fullname. |
| `entryId` | Path | ACL entry id. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).
