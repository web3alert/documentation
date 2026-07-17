# API

Web3alert API permite trabajar con las mismas entidades que la web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources y addresses.

Base URL:

```text
https://web3alert.io
```

Los endpoints de Marketplace y builder usan rutas canónicas `/api/*`. Un
conjunto limitado de endpoints de account, subscription y address book sigue
temporalmente en rutas públicas de compatibilidad `/api/v1/*` hasta su
migración canónica. Los endpoints entre servicios no forman parte de esta
referencia pública.

## Auth

Las peticiones de usuario usan personal access token:

```http
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Token puede obtenerse en [Account parameters](account.md#personal-access-token).

El acceso a endpoint depende de:

- account tier;
- rol del usuario en workspace;
- access level de project/data source/resource;
- estado de la entidad.

External API requests están limitadas por tier. Los valores detallados se describen en [Limits](limits.md#api-and-mcp).

## Response format

Un response correcto devuelve JSON del endpoint.

Las estructuras detalladas del response body están descritas en [Types](types.md).

El error se devuelve en este formato:

```json
{
  "error": {
    "message": "error message",
    "details": {}
  }
}
```

Al superar el límite de external API se devuelve `429` y headers:

```http
Retry-After: 10
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Detalles: [Account API](api-account.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/token` | Crear u obtener API token después de auth flow. |
| `GET` | `/api/me` | Obtener account actual, identity, tier y memberships. |
| `DELETE` | `/api/v1/me` | Eliminar account actual. |
| `PUT` | `/api/v1/me/meta` | Actualizar account metadata. |
| `POST` | `/api/v1/me/avatar` | Subir avatar del account actual. |
| `GET` | `/api/v1/me/workspace` | Obtener workspace account actual. |
| `POST` | `/api/v1/me/workspace` | Cambiar workspace account actual. |
| `GET` | `/api/v1/account/settings` | Obtener account settings. |
| `POST` | `/api/v1/account/settings` | Guardar account settings. |

## Workspaces

Detalles: [Workspaces API](api-workspaces.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/workspaces` | Listar workspaces del account actual. |
| `GET` | `/api/workspaces/:fullname` | Obtener workspace. |
| `PUT` | `/api/workspaces/:fullname` | Crear o actualizar workspace. |
| `DELETE` | `/api/workspaces/:fullname` | Eliminar workspace. |
| `POST` | `/api/workspaces/:fullname/avatar` | Subir workspace avatar. |
| `GET` | `/api/workspaces/:workspace/acl` | Obtener members/ACL del workspace. |
| `POST` | `/api/workspaces/:workspace/acl` | Crear invite o ACL entry. |
| `PUT` | `/api/workspaces/:workspace/acl/:entryId` | Cambiar rol de member. |
| `DELETE` | `/api/workspaces/:workspace/acl/:entryId` | Eliminar member/ACL entry. |

## Projects

Detalles: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | Listar projects disponibles. |
| `GET` | `/api/projects/create-capability` | Comprobar capacidad de crear project. |
| `GET` | `/api/projects/:fullname` | Obtener project. |
| `PUT` | `/api/projects/:fullname` | Crear o actualizar project. |
| `DELETE` | `/api/projects/:fullname` | Eliminar project. |
| `GET` | `/api/projects/by-link/:token` | Abrir private project por access link. |
| `POST` | `/api/projects/:fullname/access-links` | Crear access link para project. |
| `POST` | `/api/projects/:fullname/assets/images` | Subir project icon o cover. |
| `DELETE` | `/api/projects/:fullname/images/:asset` | Eliminar uploaded project image. |

## Project Transfers

Detalles: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects/:fullname/transfer/plan` | Obtener plan de transferencia de project. |
| `POST` | `/api/projects/:fullname/transfer-requests` | Crear transfer request. |
| `GET` | `/api/project-transfer-requests` | Listar incoming/outgoing transfer requests. |
| `POST` | `/api/project-transfer-requests/:id/accept` | Aceptar transfer request. |
| `POST` | `/api/project-transfer-requests/:id/reject` | Rechazar transfer request. |
| `POST` | `/api/project-transfer-requests/:id/cancel` | Cancelar outgoing transfer request. |

## Triggers

Detalles: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/triggers` | Listar triggers con filters. |
| `GET` | `/api/triggers/:fullname` | Obtener trigger. |
| `PUT` | `/api/triggers/:fullname` | Crear o guardar trigger completo. |
| `PATCH` | `/api/triggers/:fullname` | Actualizar trigger parcialmente. |
| `DELETE` | `/api/triggers/:fullname` | Eliminar trigger. |
| `POST` | `/api/triggers/patch` | Bulk patch de triggers. |
| `POST` | `/api/triggers/remove` | Bulk remove de triggers. |
| `GET` | `/api/triggers/:fullname/draft` | Obtener draft view de trigger. |
| `PUT` | `/api/triggers/:fullname/draft` | Guardar trigger draft. |
| `POST` | `/api/triggers/:fullname/draft/validate` | Validar trigger draft. |
| `GET` | `/api/triggers/:fullname/logs` | Obtener logs agregados de delivery y source pressure. |
| `POST` | `/api/triggers/:fullname/reset-test-status` | Restablecer el estado de test del trigger. |
| `POST` | `/api/triggers/preview` | Preview de activation y transforms sobre un input. |
| `POST` | `/api/triggers/test` | Test de trigger con sample source item. |
| `POST` | `/api/triggers/test-block` | Test de trigger en block concreto. |
| `POST` | `/api/triggers/providers/test` | Test de un provider. |
| `GET` | `/api/triggers/hypercore/actions` | Listar actions de HyperCore disponibles en el builder. |
| `GET` | `/api/triggers/runtime-sources` | Listar runtime data sources. |
| `POST` | `/api/triggers/find-latest-block` | Buscar o preparar test input/block para trigger. |

## Trigger Import

Detalles: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/triggers/import/evm` | Cargar EVM ABI entries sin guardar triggers. |
| `POST` | `/api/triggers/import/evm/abi` | Detectar/cargar ABI por contract address. |
| `POST` | `/api/triggers/import/evm/drafts` | Generar EVM trigger drafts. |
| `POST` | `/api/triggers/import/hypercore/drafts` | Generar HyperCore trigger drafts. |
| `POST` | `/api/triggers/import/solana/idl` | Cargar metadata de Solana IDL. |
| `POST` | `/api/triggers/import/solana/drafts` | Generar Solana trigger drafts. |
| `POST` | `/api/triggers/import/substrate/drafts` | Generar Substrate trigger drafts. |
| `GET` | `/api/triggers/substrate/source` | Obtener Substrate source info. |
| `GET` | `/api/triggers/substrate/pallets` | Obtener lista de Substrate pallets. |
| `GET` | `/api/triggers/substrate/pallet` | Obtener metadata de un Substrate pallet. |

## Templates

Detalles: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/:fullname/templates` | Listar templates del project. |
| `GET` | `/api/projects/:fullname/template` | Obtener root template del project. |
| `POST` | `/api/projects/:fullname/templates` | Crear template/group. |
| `GET` | `/api/projects/:fullname/templates/:id` | Obtener template. |
| `PUT` | `/api/projects/:fullname/templates/:id` | Actualizar template. |
| `DELETE` | `/api/projects/:fullname/templates/:id` | Eliminar template. |

## Subscriptions

Detalles: [Subscriptions API](api-subscriptions.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/subscriptions` | Listar subscriptions del workspace/account actual. |
| `POST` | `/api/v1/subscriptions` | Crear subscription. |
| `GET` | `/api/v1/subscriptions/:id` | Obtener subscription. |
| `POST` | `/api/v1/subscriptions/:id` | Actualizar subscription. |
| `DELETE` | `/api/v1/subscriptions/:id` | Eliminar subscription. |
| `POST` | `/api/v1/subscriptions/:id/state` | Activar o desactivar subscription. |
| `POST` | `/api/subscriptions/test` | Test de subscription. |
| `GET` | `/api/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/subscriptions/:id/alerts/history` | Logs de una subscription concreta. |

## Resources

Detalles: [Resources API](api-resources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/resources` | Listar resources. |
| `GET` | `/api/resources/:fullname` | Obtener resource. |
| `PUT` | `/api/resources/:fullname` | Crear o actualizar resource. |
| `DELETE` | `/api/resources/:fullname` | Eliminar resource. |
| `POST` | `/api/resources/:fullname/setup-sessions` | Iniciar una setup session de destino Telegram. |
| `GET` | `/api/resources/:fullname/setup-sessions/:id` | Obtener el estado de la setup session. |
| `DELETE` | `/api/resources/:fullname/setup-sessions/:id` | Cancelar la setup session. |
| `GET` | `/api/resources/external/:token` | Abrir external resource setup por token. |
| `POST` | `/api/resources/external/:token` | Enviar external resource setup payload. |

Las tres rutas de setup session solo están disponibles cuando el setup seguro
del destino Telegram está habilitado en el servidor.

## Data Sources

Detalles: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/custom-sources` | Listar custom data sources. |
| `GET` | `/api/custom-sources/create-capability` | Comprobar capacidad de crear custom source. |
| `POST` | `/api/custom-sources/verify` | Verificar custom source config. |
| `GET` | `/api/custom-sources/:fullname` | Obtener custom source. |
| `PUT` | `/api/custom-sources/:fullname` | Crear o actualizar custom source. |
| `DELETE` | `/api/custom-sources/:fullname` | Eliminar custom source. |
| `GET` | `/api/custom-sources/:fullname/logs` | Obtener custom source logs. |
| `POST` | `/api/custom-sources/:fullname/test-status` | Comprobar status de custom source. |
| `POST` | `/api/custom-sources/:fullname/restart` | Reiniciar custom source. |
| `POST` | `/api/custom-sources/:fullname/reset-lag` | Resetear lag de custom source. |

## Facturación

Detalles: [API de facturación](api-billing.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/billing/overview` | Obtener el resumen de facturación de la cuenta. |
| `GET` | `/api/billing/wallet/overview` | Obtener el resumen del saldo y del monedero. |
| `POST` | `/api/billing/wallet/crypto-topup` | Crear una recarga de saldo con criptomonedas. |
| `POST` | `/api/billing/wallet/topup/refresh` | Actualizar el estado de una recarga. |
| `POST` | `/api/billing/account-plan/balance-purchase` | Comprar o mejorar un plan con saldo. |
| `POST` | `/api/billing/account-plan/checkout` | Crear un checkout para un plan de cuenta. |
| `POST` | `/api/billing/account-plan/crypto-checkout` | Crear un checkout directo con criptomonedas para un plan. |
| `POST` | `/api/billing/project-addon/balance-purchase` | Comprar un add-on de proyecto con saldo. |
| `POST` | `/api/billing/project-addon/checkout` | Crear un checkout para un add-on de proyecto. |
| `POST` | `/api/billing/project-addon/crypto-checkout` | Crear un checkout directo con criptomonedas para un add-on. |
| `POST` | `/api/billing/coupon/redeem` | Canjear un cupón. |
| `POST` | `/api/billing/coupon/gift-purchase` | Comprar un cupón regalo con saldo. |
| `GET` | `/api/billing/referral/overview` | Obtener el resumen de saldo y enlace de referidos. |
| `POST` | `/api/billing/referral/link/create` | Crear un enlace de referido. |
| `POST` | `/api/billing/referral/claim` | Reclamar un código de referido. |
| `POST` | `/api/billing/subscription/update-renewal` | Actualizar la renovación automática. |
| `POST` | `/api/billing/crypto-checkout/refresh` | Actualizar el estado de un crypto checkout. |
| `POST` | `/api/billing/crypto-checkout/cancel` | Cancelar un crypto checkout. |

## Addresses

Detalles: [Addresses API](api-addresses.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/addressbook` | Listar addresses. |
| `POST` | `/api/v1/addressbook` | Crear address. |
| `POST` | `/api/v1/addressbook/:id` | Actualizar address. |
| `DELETE` | `/api/v1/addressbook/:id` | Eliminar address. |

## Apps, Actions, Blueprints and Types

Detalles: [Apps, Actions, Blueprints and Types API](api-builder-registry.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/apps` | Listar apps. |
| `GET` | `/api/apps/:fullname` | Obtener app. |
| `PUT` | `/api/apps/:fullname` | Crear o actualizar app. |
| `DELETE` | `/api/apps/:fullname` | Eliminar app. |
| `GET` | `/api/actions` | Listar actions. |
| `GET` | `/api/actions/:fullname` | Obtener action. |
| `PUT` | `/api/actions/:fullname` | Crear o actualizar action. |
| `DELETE` | `/api/actions/:fullname` | Eliminar action. |
| `GET` | `/api/blueprints` | Listar blueprints. |
| `GET` | `/api/blueprints/:fullname` | Obtener blueprint. |
| `PUT` | `/api/blueprints/:fullname` | Crear o actualizar blueprint. |
| `DELETE` | `/api/blueprints/:fullname` | Eliminar blueprint. |
| `GET` | `/api/types` | Listar shared types. |
| `GET` | `/api/types/lookup` | Resolver opciones dinámicas de tipos. |
| `GET` | `/api/types/:fullname` | Obtener shared type. |
| `PUT` | `/api/types/:fullname` | Crear o actualizar shared type. |
| `DELETE` | `/api/types/:fullname` | Eliminar shared type. |
