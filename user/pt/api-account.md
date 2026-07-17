# Account API

Account endpoints trabalham com o utilizador atual, metadata, avatar e workspace selecionado.

Todos os endpoints de Account, exceto `POST /api/token`, exigem `Authorization: Bearer <token>`.

## POST /api/token

`POST /api/token` não exige um header `Authorization: Bearer <token>` existente. As `credentials` específicas do provider autenticam a identity através do `app` selecionado.

Cada pedido bem-sucedido cria um novo Bearer token persistente; não reutiliza nem devolve um token anterior. No primeiro login bem-sucedido de uma identity, o serviço também pode criar um account e um workspace.

<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent; first-login=may-provision-account-workspace -->

Argumentos: sem argumentos path/query.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `app` | Sim | Nome da auth app/provider. |
| `credentials` | Sim | Objeto credentials específico do provider. |

Resposta: [TokenResponse](types.md#tokenresponse).

Exemplo de pedido (a ausência do header `Authorization` é intencional):

```http
POST /api/token
Content-Type: application/json

{
  "app": "google",
  "credentials": {
    "credential": "<provider-issued-credential>"
  }
}
```

Exemplo de resposta:

```json
{
  "token": "<new-bearer-token>"
}
```

As credenciais do provider e o token devolvido são segredos. Envie-os apenas através de HTTPS; não os registe, publique nem inclua em commits.

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
