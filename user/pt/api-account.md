# Account API

Account endpoints trabalham com o utilizador atual, metadata, avatar e workspace selecionado.

Todos os endpoints exigem `Authorization: Bearer <token>`, exceto nos casos em que token é criado depois de um external auth flow.

## POST /api/v1/token

Cria ou devolve um API token para a identity autenticada.

Argumentos: sem argumentos path/query.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `app` | Sim | Nome da auth app/provider. |
| `credentials` | Sim | Objeto credentials específico do provider. |

Resposta: [TokenResponse](types.md#tokenresponse).

## GET /api/v1/me

Devolve o account atual, identity, tier, memberships e workspace selecionado.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [Me](types.md#me).

## DELETE /api/v1/me

Elimina o account atual.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## PUT /api/v1/me/meta

Atualiza metadata do utilizador.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `nickname` | Não | Display name do utilizador, 2-80 caracteres. |

Resposta: [Me](types.md#me).

## POST /api/v1/me/avatar

Envia o avatar do account atual.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `filename` | Sim | Nome original do ficheiro. |
| `contentType` | Sim | MIME type da imagem. |
| `data` | Sim | Dados da imagem em Base64. |

Resposta: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/v1/me/workspace

Devolve o workspace selecionado do account atual.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## POST /api/v1/me/workspace

Altera o workspace selecionado do account atual.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `workspace` | Sim | Workspace fullname ou `null` para repor seleção. |

Resposta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## GET /api/v1/account/settings

Devolve account settings.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [AccountSettings](types.md#accountsettings).

## POST /api/v1/account/settings

Guarda account settings.

Argumentos: nenhum.

Payload: objeto settings. O conjunto concreto de fields depende da versão atual da account settings UI.

Resposta: [AccountSettings](types.md#accountsettings).
