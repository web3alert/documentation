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

## DELETE /api/token

Revoga o token usado para autenticar este pedido.

Envie o pedido sem argumentos path/query e sem corpo. Os parâmetros adicionais não permitem selecionar outro token nem outro account.

```http
DELETE /api/token
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Em caso de sucesso, o servidor devolve `204 No Content` com o corpo vazio. Este endpoint está disponível mesmo que o account tenha atingido o limite de pedidos à API.

## DELETE /api/tokens

Revoga todos os tokens do account autenticado, incluindo o token usado neste pedido.

Envie o pedido sem argumentos path/query e sem corpo. Os parâmetros adicionais não permitem selecionar outro token nem outro account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Em caso de sucesso, o servidor devolve `204 No Content` com o corpo vazio. Este endpoint está disponível mesmo que o account tenha atingido o limite de pedidos à API.

## GET /api/me

Devolve o account atual, identity, tier, memberships e workspace selecionado.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [Me](types.md#me).

### Limites do plano {#me-limits}

A resposta também inclui `limits` para o plano da conta autenticada.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Máximo de subscrições ativas que contam para o plano. `null` significa que não há limite. |
| `limits.canRunTests` | `boolean` | Indica se o plano permite executar testes. |
| `limits.alertHistory` | `object \| null` | Limites do histórico de alertas. `null` significa que o plano não inclui histórico. |
| `limits.alertHistory.retentionDays` | `number` | Retenção do histórico de alertas em dias. |
| `limits.alertHistory.maxRecords` | `number \| null` | Número máximo de registos guardados. `null` significa que não há limite de registos. |

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
