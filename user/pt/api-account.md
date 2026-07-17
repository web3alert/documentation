# Account API

Account endpoints trabalham com o utilizador atual, metadata, avatar e workspace selecionado.

Todos os endpoints exigem `Authorization: Bearer <token>`, exceto nos casos em que token é criado depois de um external auth flow.

## POST /api/token

Cria ou devolve um API token para a identity autenticada.

Argumentos: sem argumentos path/query.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `app` | Sim | Nome da auth app/provider. |
| `credentials` | Sim | Objeto credentials específico do provider. |

Resposta: [TokenResponse](types.md#tokenresponse).

## GET /api/me

Devolve o account atual, identity, tier, memberships e workspace selecionado.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [Me](types.md#me).

## DELETE /api/me

Elimina o account atual.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## PUT /api/me/meta

Atualiza metadata do utilizador.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `nickname` | Sim | Display name do utilizador, 2-80 caracteres. O whitespace inicial e final é removido antes de guardar e devolver o valor. |

Resposta: HTTP 200 OK.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `nickname` | Sim | Nickname normalizado que foi guardado. |

## POST /api/me/avatar

Envia o avatar do account atual.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `filename` | Sim | Nome original do ficheiro. |
| `contentType` | Sim | MIME type da imagem. |
| `data` | Sim | Dados da imagem em Base64. |

Resposta: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/me/workspace

Devolve o workspace selecionado do account atual.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## PUT /api/me/workspace

Altera o workspace selecionado do account atual.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `workspace` | Sim | Workspace fullname ou `null` para repor seleção. |

Resposta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## GET /api/account/settings

Devolve account settings.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [AccountSettings](types.md#accountsettings).

## PUT /api/account/settings

Guarda account settings.

Argumentos: nenhum.

Payload: objeto settings. O conjunto concreto de fields depende da versão atual da account settings UI.

Resposta: [AccountSettings](types.md#accountsettings).
