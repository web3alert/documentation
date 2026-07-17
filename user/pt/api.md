# API

A Web3alert API permite trabalhar com as mesmas entidades da web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources e addresses.

Base URL:

```text
https://web3alert.io
```

Os endpoints de Marketplace e do builder usam rotas canónicas `/api/*`. Um
conjunto limitado de endpoints de account, subscription e address book
permanece temporariamente nas rotas públicas de compatibilidade `/api/v1/*`
até à migração canónica. Os endpoints entre serviços não fazem parte desta
referência pública.

## Auth

Pedidos de utilizador usam personal access token:

```http
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Token pode ser obtido em [Account parameters](account.md#personal-access-token).

O acesso ao endpoint depende de:

- account tier;
- papel do utilizador no workspace;
- access level de project/data source/resource;
- estado da entidade.

External API requests são limitadas por tier. Os valores detalhados estão descritos em [Limits](limits.md#api-and-mcp).

## Response format

Um response bem-sucedido devolve JSON do endpoint.

As estruturas detalhadas do response body estão descritas em [Types](types.md).

Erro é devolvido neste formato:

```json
{
  "error": {
    "message": "error message",
    "details": {}
  }
}
```

Ao exceder o limite de external API, é devolvido `429` com headers:

```http
Retry-After: 10
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Detalhes: [Account API](api-account.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/token` | Criar ou obter API token depois de auth flow. |
| `GET` | `/api/me` | Obter account atual, identity, tier e memberships. |
| `DELETE` | `/api/v1/me` | Eliminar account atual. |
| `PUT` | `/api/v1/me/meta` | Atualizar account metadata. |
| `POST` | `/api/v1/me/avatar` | Enviar avatar do account atual. |
| `GET` | `/api/v1/me/workspace` | Obter workspace account atual. |
| `POST` | `/api/v1/me/workspace` | Alterar workspace account atual. |
| `GET` | `/api/v1/account/settings` | Obter account settings. |
| `POST` | `/api/v1/account/settings` | Guardar account settings. |

## Workspaces

Detalhes: [Workspaces API](api-workspaces.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/workspaces` | Listar workspaces do account atual. |
| `GET` | `/api/workspaces/:fullname` | Obter workspace. |
| `PUT` | `/api/workspaces/:fullname` | Criar ou atualizar workspace. |
| `DELETE` | `/api/workspaces/:fullname` | Eliminar workspace. |
| `POST` | `/api/workspaces/:fullname/avatar` | Enviar workspace avatar. |
| `GET` | `/api/workspaces/:workspace/acl` | Obter members/ACL do workspace. |
| `POST` | `/api/workspaces/:workspace/acl` | Criar invite ou ACL entry. |
| `PUT` | `/api/workspaces/:workspace/acl/:entryId` | Alterar papel de member. |
| `DELETE` | `/api/workspaces/:workspace/acl/:entryId` | Eliminar member/ACL entry. |

## Projects

Detalhes: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | Listar projects disponíveis. |
| `GET` | `/api/projects/create-capability` | Verificar capacidade de criar project. |
| `GET` | `/api/projects/:fullname` | Obter project. |
| `PUT` | `/api/projects/:fullname` | Criar ou atualizar project. |
| `DELETE` | `/api/projects/:fullname` | Eliminar project. |
| `GET` | `/api/projects/by-link/:token` | Abrir private project por access link. |
| `POST` | `/api/projects/:fullname/access-links` | Criar access link para project. |
| `POST` | `/api/projects/:fullname/assets/images` | Enviar project icon ou cover. |
| `DELETE` | `/api/projects/:fullname/images/:asset` | Eliminar uploaded project image. |

## Project Transfers

Detalhes: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects/:fullname/transfer/plan` | Obter plano de transferência do project. |
| `POST` | `/api/projects/:fullname/transfer-requests` | Criar transfer request. |
| `GET` | `/api/project-transfer-requests` | Listar incoming/outgoing transfer requests. |
| `POST` | `/api/project-transfer-requests/:id/accept` | Aceitar transfer request. |
| `POST` | `/api/project-transfer-requests/:id/reject` | Rejeitar transfer request. |
| `POST` | `/api/project-transfer-requests/:id/cancel` | Cancelar outgoing transfer request. |

## Triggers

Detalhes: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/triggers` | Listar triggers com filters. |
| `GET` | `/api/triggers/:fullname` | Obter trigger. |
| `PUT` | `/api/triggers/:fullname` | Criar ou guardar trigger completo. |
| `PATCH` | `/api/triggers/:fullname` | Atualizar trigger parcialmente. |
| `DELETE` | `/api/triggers/:fullname` | Eliminar trigger. |
| `POST` | `/api/triggers/patch` | Bulk patch de triggers. |
| `POST` | `/api/triggers/remove` | Bulk remove de triggers. |
| `GET` | `/api/triggers/:fullname/draft` | Obter draft view do trigger. |
| `PUT` | `/api/triggers/:fullname/draft` | Guardar trigger draft. |
| `POST` | `/api/triggers/:fullname/draft/validate` | Validar trigger draft. |
| `GET` | `/api/triggers/:fullname/logs` | Obter logs agregados de delivery e source pressure. |
| `POST` | `/api/triggers/:fullname/reset-test-status` | Repor o estado de teste do trigger. |
| `POST` | `/api/triggers/preview` | Preview da activation e dos transforms sobre um input. |
| `POST` | `/api/triggers/test` | Testar trigger com sample source item. |
| `POST` | `/api/triggers/test-block` | Testar trigger num block específico. |
| `POST` | `/api/triggers/providers/test` | Testar um provider. |
| `GET` | `/api/triggers/hypercore/actions` | Listar actions HyperCore disponíveis no builder. |
| `GET` | `/api/triggers/runtime-sources` | Listar runtime data sources. |
| `POST` | `/api/triggers/find-latest-block` | Encontrar ou preparar test input/block para trigger. |

## Trigger Import

Detalhes: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/triggers/import/evm` | Carregar EVM ABI entries sem guardar triggers. |
| `POST` | `/api/triggers/import/evm/abi` | Detetar/carregar ABI por contract address. |
| `POST` | `/api/triggers/import/evm/drafts` | Gerar EVM trigger drafts. |
| `POST` | `/api/triggers/import/hypercore/drafts` | Gerar HyperCore trigger drafts. |
| `POST` | `/api/triggers/import/solana/idl` | Carregar metadata de Solana IDL. |
| `POST` | `/api/triggers/import/solana/drafts` | Gerar Solana trigger drafts. |
| `POST` | `/api/triggers/import/substrate/drafts` | Gerar Substrate trigger drafts. |
| `GET` | `/api/triggers/substrate/source` | Obter Substrate source info. |
| `GET` | `/api/triggers/substrate/pallets` | Obter lista de Substrate pallets. |
| `GET` | `/api/triggers/substrate/pallet` | Obter metadata de um Substrate pallet. |

## Templates

Detalhes: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/:fullname/templates` | Listar templates do project. |
| `GET` | `/api/projects/:fullname/template` | Obter root template do project. |
| `POST` | `/api/projects/:fullname/templates` | Criar template/group. |
| `GET` | `/api/projects/:fullname/templates/:id` | Obter template. |
| `PUT` | `/api/projects/:fullname/templates/:id` | Atualizar template. |
| `DELETE` | `/api/projects/:fullname/templates/:id` | Eliminar template. |

## Subscriptions

Detalhes: [Subscriptions API](api-subscriptions.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/subscriptions` | Listar subscriptions do workspace/account atual. |
| `POST` | `/api/v1/subscriptions` | Criar subscription. |
| `GET` | `/api/v1/subscriptions/:id` | Obter subscription. |
| `POST` | `/api/v1/subscriptions/:id` | Atualizar subscription. |
| `DELETE` | `/api/v1/subscriptions/:id` | Eliminar subscription. |
| `POST` | `/api/v1/subscriptions/:id/state` | Ativar ou desativar subscription. |
| `POST` | `/api/subscriptions/test` | Testar subscription. |
| `GET` | `/api/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/subscriptions/:id/alerts/history` | Logs de uma subscription específica. |

## Resources

Detalhes: [Resources API](api-resources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/resources` | Listar resources. |
| `GET` | `/api/resources/:fullname` | Obter resource. |
| `PUT` | `/api/resources/:fullname` | Criar ou atualizar resource. |
| `DELETE` | `/api/resources/:fullname` | Eliminar resource. |
| `POST` | `/api/resources/:fullname/setup-sessions` | Iniciar uma setup session de destino Telegram. |
| `GET` | `/api/resources/:fullname/setup-sessions/:id` | Obter o estado da setup session. |
| `DELETE` | `/api/resources/:fullname/setup-sessions/:id` | Cancelar a setup session. |
| `GET` | `/api/resources/external/:token` | Abrir external resource setup por token. |
| `POST` | `/api/resources/external/:token` | Enviar external resource setup payload. |

As três rotas de setup session só estão disponíveis quando o setup seguro do
destino Telegram está ativado no servidor.

## Data Sources

Detalhes: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/custom-sources` | Listar custom data sources. |
| `GET` | `/api/custom-sources/create-capability` | Verificar capacidade de criar custom source. |
| `POST` | `/api/custom-sources/verify` | Verificar custom source config. |
| `GET` | `/api/custom-sources/:fullname` | Obter custom source. |
| `PUT` | `/api/custom-sources/:fullname` | Criar ou atualizar custom source. |
| `DELETE` | `/api/custom-sources/:fullname` | Eliminar custom source. |
| `GET` | `/api/custom-sources/:fullname/logs` | Obter custom source logs. |
| `POST` | `/api/custom-sources/:fullname/test-status` | Verificar status de custom source. |
| `POST` | `/api/custom-sources/:fullname/restart` | Reiniciar custom source. |
| `POST` | `/api/custom-sources/:fullname/reset-lag` | Fazer reset do lag de custom source. |

## Faturação

Detalhes: [API de faturação](api-billing.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/billing/overview` | Obter a visão geral da faturação da conta. |
| `GET` | `/api/billing/wallet/overview` | Obter a visão geral do saldo e da carteira. |
| `POST` | `/api/billing/wallet/crypto-topup` | Criar um carregamento de saldo com criptomoeda. |
| `POST` | `/api/billing/wallet/topup/refresh` | Atualizar o estado de um carregamento. |
| `POST` | `/api/billing/account-plan/balance-purchase` | Comprar ou atualizar um plano com saldo. |
| `POST` | `/api/billing/account-plan/checkout` | Criar um checkout para um plano de conta. |
| `POST` | `/api/billing/account-plan/crypto-checkout` | Criar um checkout direto com criptomoeda para um plano. |
| `POST` | `/api/billing/project-addon/balance-purchase` | Comprar um add-on de projeto com saldo. |
| `POST` | `/api/billing/project-addon/checkout` | Criar um checkout para um add-on de projeto. |
| `POST` | `/api/billing/project-addon/crypto-checkout` | Criar um checkout direto com criptomoeda para um add-on. |
| `POST` | `/api/billing/coupon/redeem` | Resgatar um cupão. |
| `POST` | `/api/billing/coupon/gift-purchase` | Comprar um cupão-presente com saldo. |
| `GET` | `/api/billing/referral/overview` | Obter o resumo do saldo e da ligação de referência. |
| `POST` | `/api/billing/referral/link/create` | Criar uma ligação de referência. |
| `POST` | `/api/billing/referral/claim` | Resgatar um código de referência. |
| `POST` | `/api/billing/subscription/update-renewal` | Atualizar a renovação automática. |
| `POST` | `/api/billing/crypto-checkout/refresh` | Atualizar o estado de um crypto checkout. |
| `POST` | `/api/billing/crypto-checkout/cancel` | Cancelar um crypto checkout. |

## Addresses

Detalhes: [Addresses API](api-addresses.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/addressbook` | Listar addresses. |
| `POST` | `/api/v1/addressbook` | Criar address. |
| `POST` | `/api/v1/addressbook/:id` | Atualizar address. |
| `DELETE` | `/api/v1/addressbook/:id` | Eliminar address. |

## Apps, Actions, Blueprints and Types

Detalhes: [Apps, Actions, Blueprints and Types API](api-builder-registry.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/apps` | Listar apps. |
| `GET` | `/api/apps/:fullname` | Obter app. |
| `PUT` | `/api/apps/:fullname` | Criar ou atualizar app. |
| `DELETE` | `/api/apps/:fullname` | Eliminar app. |
| `GET` | `/api/actions` | Listar actions. |
| `GET` | `/api/actions/:fullname` | Obter action. |
| `PUT` | `/api/actions/:fullname` | Criar ou atualizar action. |
| `DELETE` | `/api/actions/:fullname` | Eliminar action. |
| `GET` | `/api/blueprints` | Listar blueprints. |
| `GET` | `/api/blueprints/:fullname` | Obter blueprint. |
| `PUT` | `/api/blueprints/:fullname` | Criar ou atualizar blueprint. |
| `DELETE` | `/api/blueprints/:fullname` | Eliminar blueprint. |
| `GET` | `/api/types` | Listar shared types. |
| `GET` | `/api/types/lookup` | Resolver opções dinâmicas de tipos. |
| `GET` | `/api/types/:fullname` | Obter shared type. |
| `PUT` | `/api/types/:fullname` | Criar ou atualizar shared type. |
| `DELETE` | `/api/types/:fullname` | Eliminar shared type. |
