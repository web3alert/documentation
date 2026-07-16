# API

A Web3alert API permite trabalhar com as mesmas entidades da web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources e addresses.

Base URL:

```text
https://web3alert.io
```

A versão principal da API para marketplace e builder functionality é `v2`. Alguns endpoints de account/subscription/address book ainda permanecem em `v1`.

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
| `GET` | `/api/v1/me` | Obter account atual, identity, tier e memberships. |
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
| `GET` | `/api/v2/workspaces` | Listar workspaces do account atual. |
| `GET` | `/api/v2/workspaces/:fullname` | Obter workspace. |
| `PUT` | `/api/v2/workspaces/:fullname` | Criar ou atualizar workspace. |
| `DELETE` | `/api/v2/workspaces/:fullname` | Eliminar workspace. |
| `POST` | `/api/v2/workspaces/:fullname/avatar` | Enviar workspace avatar. |
| `GET` | `/api/v2/workspaces/:workspace/acl` | Obter members/ACL do workspace. |
| `POST` | `/api/v2/workspaces/:workspace/acl` | Criar invite ou ACL entry. |
| `PUT` | `/api/v2/workspaces/:workspace/acl/:entryId` | Alterar papel de member. |
| `DELETE` | `/api/v2/workspaces/:workspace/acl/:entryId` | Eliminar member/ACL entry. |

## Projects

Detalhes: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects` | Listar projects disponíveis. |
| `GET` | `/api/v2/projects/create-capability` | Verificar capacidade de criar project. |
| `GET` | `/api/v2/projects/:fullname` | Obter project. |
| `PUT` | `/api/v2/projects/:fullname` | Criar ou atualizar project. |
| `DELETE` | `/api/v2/projects/:fullname` | Eliminar project. |
| `GET` | `/api/v2/projects/by-link/:token` | Abrir private project por access link. |
| `POST` | `/api/v2/projects/:fullname/access-links` | Criar access link para project. |
| `POST` | `/api/v2/projects/:fullname/assets/images` | Enviar project icon ou cover. |
| `DELETE` | `/api/v2/projects/:fullname/images/:asset` | Eliminar uploaded project image. |

## Project Transfers

Detalhes: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/projects/:fullname/transfer/plan` | Obter plano de transferência do project. |
| `POST` | `/api/v2/projects/:fullname/transfer-requests` | Criar transfer request. |
| `GET` | `/api/v2/project-transfer-requests` | Listar incoming/outgoing transfer requests. |
| `POST` | `/api/v2/project-transfer-requests/:id/accept` | Aceitar transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/reject` | Rejeitar transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/cancel` | Cancelar outgoing transfer request. |

## Triggers

Detalhes: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/triggers` | Listar triggers com filters. |
| `GET` | `/api/v2/triggers/:fullname` | Obter trigger. |
| `PUT` | `/api/v2/triggers/:fullname` | Criar ou guardar trigger completo. |
| `PATCH` | `/api/v2/triggers/:fullname` | Atualizar trigger parcialmente. |
| `DELETE` | `/api/v2/triggers/:fullname` | Eliminar trigger. |
| `POST` | `/api/v2/triggers/patch` | Bulk patch de triggers. |
| `POST` | `/api/v2/triggers/remove` | Bulk remove de triggers. |
| `GET` | `/api/v2/triggers/:fullname/draft` | Obter draft view do trigger. |
| `PUT` | `/api/v2/triggers/:fullname/draft` | Guardar trigger draft. |
| `POST` | `/api/v2/triggers/:fullname/draft/validate` | Validar trigger draft. |
| `POST` | `/api/v2/triggers/preview` | Preview da execução de trigger. |
| `POST` | `/api/v2/triggers/test` | Testar trigger com sample source item. |
| `POST` | `/api/v2/triggers/test-block` | Testar trigger num block específico. |
| `POST` | `/api/v2/triggers/providers/test` | Testar um provider. |
| `GET` | `/api/v2/triggers/runtime-sources` | Listar runtime data sources. |
| `POST` | `/api/v2/triggers/find-latest-block` | Encontrar ou preparar test input/block para trigger. |

## Trigger Import

Detalhes: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/triggers/import/evm` | Carregar EVM ABI entries. |
| `POST` | `/api/v2/triggers/import/evm/abi` | Detetar/carregar ABI por contract address. |
| `POST` | `/api/v2/triggers/import/evm/drafts` | Gerar EVM trigger drafts. |
| `POST` | `/api/v2/triggers/import/substrate/drafts` | Gerar Substrate trigger drafts. |
| `GET` | `/api/v2/triggers/substrate/source` | Obter Substrate source info. |
| `GET` | `/api/v2/triggers/substrate/pallets` | Obter lista de Substrate pallets. |
| `GET` | `/api/v2/triggers/substrate/pallet` | Obter metadata de um Substrate pallet. |

## Templates

Detalhes: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects/:fullname/templates` | Listar templates do project. |
| `GET` | `/api/v2/projects/:fullname/template` | Obter root template do project. |
| `POST` | `/api/v2/projects/:fullname/templates` | Criar template/group. |
| `GET` | `/api/v2/projects/:fullname/templates/:id` | Obter template. |
| `PUT` | `/api/v2/projects/:fullname/templates/:id` | Atualizar template. |
| `DELETE` | `/api/v2/projects/:fullname/templates/:id` | Eliminar template. |

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
| `POST` | `/api/v2/subscriptions/test` | Testar subscription. |
| `GET` | `/api/v2/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/v2/subscriptions/:id/alerts/history` | Logs de uma subscription específica. |

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

## Data Sources

Detalhes: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/custom-sources` | Listar custom data sources. |
| `GET` | `/api/v2/custom-sources/create-capability` | Verificar capacidade de criar custom source. |
| `POST` | `/api/v2/custom-sources/verify` | Verificar custom source config. |
| `GET` | `/api/v2/custom-sources/:fullname` | Obter custom source. |
| `PUT` | `/api/v2/custom-sources/:fullname` | Criar ou atualizar custom source. |
| `DELETE` | `/api/v2/custom-sources/:fullname` | Eliminar custom source. |
| `GET` | `/api/v2/custom-sources/:fullname/logs` | Obter custom source logs. |
| `POST` | `/api/v2/custom-sources/:fullname/test-status` | Verificar status de custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/restart` | Reiniciar custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/reset-lag` | Fazer reset do lag de custom source. |

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
| `GET` | `/api/v2/apps` | Listar apps. |
| `GET` | `/api/v2/apps/:fullname` | Obter app. |
| `PUT` | `/api/v2/apps/:fullname` | Criar ou atualizar app. |
| `DELETE` | `/api/v2/apps/:fullname` | Eliminar app. |
| `GET` | `/api/v2/actions` | Listar actions. |
| `GET` | `/api/v2/actions/:fullname` | Obter action. |
| `PUT` | `/api/v2/actions/:fullname` | Criar ou atualizar action. |
| `DELETE` | `/api/v2/actions/:fullname` | Eliminar action. |
| `GET` | `/api/v2/blueprints` | Listar blueprints. |
| `GET` | `/api/v2/blueprints/:fullname` | Obter blueprint. |
| `PUT` | `/api/v2/blueprints/:fullname` | Criar ou atualizar blueprint. |
| `DELETE` | `/api/v2/blueprints/:fullname` | Eliminar blueprint. |
| `GET` | `/api/v2/types` | Listar shared types. |
| `GET` | `/api/v2/types/:fullname` | Obter shared type. |
| `PUT` | `/api/v2/types/:fullname` | Criar ou atualizar shared type. |
| `DELETE` | `/api/v2/types/:fullname` | Eliminar shared type. |
