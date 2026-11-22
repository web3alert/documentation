# Account API

Account endpoints trabalham com o utilizador atual, metadata, avatar e workspace selecionado.

Envie uma credencial Bearer nos pedidos autenticados. Gerir chaves e alterar sessões requer um token de sessão de conta. As rotas públicas de início de sessão e reivindicação estão assinaladas abaixo.

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
| `claim` | Não | Token da ligação de reivindicação de uma conta criada com carteira, para iniciar sessão com Telegram ou Google. |

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

Com `claim`, um início de sessão bem-sucedido associa o acesso à conta da carteira, consome a ligação e emite um token de sessão para essa conta. `409 login_already_linked` significa que o acesso pertence a outra conta e a ligação continua válida. Uma reivindicação inválida devolve `404 claim_not_found` sem criar conta.

Reivindicar a conta mantém ativas as chaves emitidas anteriormente através da carteira. Após iniciar sessão, reveja as chaves na [página Agents](https://web3alert.io/agents) e revogue as que não quiser manter.

## DELETE /api/token

Revoga o token usado para autenticar este pedido.

Requer um token de sessão de conta. Ao terminar sessão, a aplicação chama esta operação para o navegador atual.

Envie o pedido sem argumentos path/query e sem corpo. Os parâmetros adicionais não permitem selecionar outro token nem outro account.

```http
DELETE /api/token
Authorization: Bearer YOUR_SESSION_TOKEN
```

Em caso de sucesso, o servidor devolve `204 No Content` com o corpo vazio. Este endpoint está disponível mesmo que o account tenha atingido o limite de pedidos à API.

## DELETE /api/tokens

Revoga todos os tokens do account autenticado, incluindo o token usado neste pedido.

Requer um token de sessão de conta. As chaves de agente são revogadas individualmente com `DELETE /api/keys/:id`.

Envie o pedido sem argumentos path/query e sem corpo. Os parâmetros adicionais não permitem selecionar outro token nem outro account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_SESSION_TOKEN
```

Em caso de sucesso, o servidor devolve `204 No Content` com o corpo vazio. Este endpoint está disponível mesmo que o account tenha atingido o limite de pedidos à API.

## GET /api/me

Devolve o account atual, identity, tier, memberships e workspace selecionado.

Um pedido com chave requer `read` e acrescenta `key` com `id`, `name`, `scopes`, `monthlyCapEur`, `spentThisMonthEur` e `expiresAt`. Em `memberships`, só aparece o espaço associado à chave.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [Me](types.md#me).

### Limites do plano {#me-limits}

A resposta também inclui `limits` para o plano da conta autenticada.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Limite por conta das subscrições ativas que criou para projetos que não sejam Free, somadas entre todos os espaços de trabalho. As subscrições de projetos Free ficam fora do limite. `null` significa que não há limite. |
| `limits.canRunTests` | `boolean` | Indica se o plano permite executar testes. |
| `limits.alertHistory` | `object \| null` | Limites do histórico de alertas. `null` significa que o plano não inclui histórico. |
| `limits.alertHistory.retentionDays` | `number` | Retenção do histórico de alertas em dias. |
| `limits.alertHistory.maxRecords` | `number \| null` | Número máximo de registos guardados. `null` significa que não há limite de registos. |

## POST /api/keys

Qualquer membro do espaço atual pode criar uma chave. A chave atua com a função da conta nesse espaço.

Requer um token de sessão. Cria uma chave associada ao espaço de trabalho atual. Envie `{ name, scopes, monthlyCapEur?, expiresInDays? }`. O nome tem 1–64 caracteres. Inclua `read` e, se necessário, `manage` e `spend`. O limite pode ser de 0 € a 10 000 € com até duas casas decimais e a validade de 30, 90 ou 365 dias. Omita esses campos ou envie `null` para os deixar por definir.

Devolve `201` com `{ key, secret }`. Copie `secret`, que só aparece nesta resposta.

## GET /api/keys

Requer um token de sessão. Devolve `{ keys }` de todos os espaços da conta, das mais recentes para as mais antigas, incluindo as revogadas. Cada chave inclui espaço, permissões, limite, gastos do mês, validade, estado e `connectedBy`.

## PATCH /api/keys/:id

Requer um token de sessão. Envie `{ name?, monthlyCapEur? }` para editar uma chave da conta. Use `null` para retirar o limite. Devolve `{ key }` ou `404` se a chave não estiver disponível para a conta.

## DELETE /api/keys/:id

Requer um token de sessão. Revoga uma chave da conta. Devolve `204 No Content` se a revogação tiver êxito ou se a chave já estiver revogada. Devolve `404` se a chave não estiver disponível para a conta.

## POST /api/agent/siwe/nonce

Público. Sem corpo de pedido. Devolve `{ nonce, issuedAt, expiresAt }`. O nonce expira em 10 minutos e pode ser usado uma vez.

Os endpoints de nonce e verificação partilham um limite por IP na camada de entrada de 1 pedido por segundo, com um pico de 10. Os `429` dessa camada não incluem o corpo `signup_limited` da API. Respeite `Retry-After` e peça um novo nonce se a mensagem assinada já não for válida.

## POST /api/agent/siwe/verify

Público. Envie `{ message, signature }` assinado por uma conta externa (EOA) Ethereum. Use uma mensagem EIP-4361 versão `1`, o nonce recebido, o domínio `web3alert.io`, um URI dessa origem e um `issuedAt` dentro de cinco minutos do relógio do servidor. Qualquer ID de cadeia é aceite.

Devolve `{ account: { id, created }, key, secret, claimUrl }`. O primeiro início de sessão cria uma conta Free e o seu espaço. Cada início bem-sucedido emite uma chave com todas as permissões, sem limite nem validade. Use `secret` como credencial Bearer. A verificação emite uma ligação ao criar a conta ou quando não há uma ligação ativa. Se já houver uma, `claimUrl` fica a `null`. Use `POST /api/agent/claim-link` para a substituir.

Quando uma pessoa reivindica a conta com Telegram ou Google, o início de sessão com carteira devolve `403 account_claimed` e não emite chave nem ligação. Peça a essa pessoa uma chave de agente.

Uma verificação falhada devolve `401 invalid_siwe`. São permitidas 10 novas contas por IP numa hora móvel e 200 no total num dia móvel. Ao atingir o limite, devolve `429 signup_limited` com `Retry-After`. Consulte o [exemplo SIWE](agents.md).

## POST /api/agent/claim-link

Requer chave de agente com `manage`. Sem corpo de pedido. Devolve `{ claimUrl, expiresAt }`. A nova ligação substitui a anterior e expira em sete dias. Um token de sessão recebe `403 agent_key_required`. Se Telegram ou Google já estiver associado, devolve `409 already_claimed`.

## GET /api/agent/claims/:token

Público para quem tem a ligação. Devolve `{ wallet, account: { name }, createdAt, expiresAt }`. Uma ligação desconhecida, expirada, substituída ou usada devolve `404 claim_not_found`. Complete a reivindicação com o campo opcional `claim` de `POST /api/token`.

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
