# API

Web3alert API permite trabajar con las mismas entidades que la web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources y addresses.

Base URL:

```text
https://web3alert.io
```

La versión principal de API para marketplace y builder functionality es `v2`. Parte de los endpoints de account/subscription/address book todavía permanece en `v1`.

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
| `GET` | `/api/v1/me` | Obtener account actual, identity, tier y memberships. |
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
| `GET` | `/api/v2/workspaces` | Listar workspaces del account actual. |
| `GET` | `/api/v2/workspaces/:fullname` | Obtener workspace. |
| `PUT` | `/api/v2/workspaces/:fullname` | Crear o actualizar workspace. |
| `DELETE` | `/api/v2/workspaces/:fullname` | Eliminar workspace. |
| `POST` | `/api/v2/workspaces/:fullname/avatar` | Subir workspace avatar. |
| `GET` | `/api/v2/workspaces/:workspace/acl` | Obtener members/ACL del workspace. |
| `POST` | `/api/v2/workspaces/:workspace/acl` | Crear invite o ACL entry. |
| `PUT` | `/api/v2/workspaces/:workspace/acl/:entryId` | Cambiar rol de member. |
| `DELETE` | `/api/v2/workspaces/:workspace/acl/:entryId` | Eliminar member/ACL entry. |

## Projects

Detalles: [Projects API](api-projects.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects` | Listar projects disponibles. |
| `GET` | `/api/v2/projects/create-capability` | Comprobar capacidad de crear project. |
| `GET` | `/api/v2/projects/:fullname` | Obtener project. |
| `PUT` | `/api/v2/projects/:fullname` | Crear o actualizar project. |
| `DELETE` | `/api/v2/projects/:fullname` | Eliminar project. |
| `GET` | `/api/v2/projects/by-link/:token` | Abrir private project por access link. |
| `POST` | `/api/v2/projects/:fullname/access-links` | Crear access link para project. |
| `POST` | `/api/v2/projects/:fullname/assets/images` | Subir project icon o cover. |
| `DELETE` | `/api/v2/projects/:fullname/images/:asset` | Eliminar uploaded project image. |

## Project Transfers

Detalles: [Project Transfers API](api-project-transfers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/projects/:fullname/transfer/plan` | Obtener plan de transferencia de project. |
| `POST` | `/api/v2/projects/:fullname/transfer-requests` | Crear transfer request. |
| `GET` | `/api/v2/project-transfer-requests` | Listar incoming/outgoing transfer requests. |
| `POST` | `/api/v2/project-transfer-requests/:id/accept` | Aceptar transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/reject` | Rechazar transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/cancel` | Cancelar outgoing transfer request. |

## Triggers

Detalles: [Triggers API](api-triggers.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/triggers` | Listar triggers con filters. |
| `GET` | `/api/v2/triggers/:fullname` | Obtener trigger. |
| `PUT` | `/api/v2/triggers/:fullname` | Crear o guardar trigger completo. |
| `PATCH` | `/api/v2/triggers/:fullname` | Actualizar trigger parcialmente. |
| `DELETE` | `/api/v2/triggers/:fullname` | Eliminar trigger. |
| `POST` | `/api/v2/triggers/patch` | Bulk patch de triggers. |
| `POST` | `/api/v2/triggers/remove` | Bulk remove de triggers. |
| `GET` | `/api/v2/triggers/:fullname/draft` | Obtener draft view de trigger. |
| `PUT` | `/api/v2/triggers/:fullname/draft` | Guardar trigger draft. |
| `POST` | `/api/v2/triggers/:fullname/draft/validate` | Validar trigger draft. |
| `POST` | `/api/v2/triggers/preview` | Preview de ejecución de trigger. |
| `POST` | `/api/v2/triggers/test` | Test de trigger con sample source item. |
| `POST` | `/api/v2/triggers/test-block` | Test de trigger en block concreto. |
| `POST` | `/api/v2/triggers/providers/test` | Test de un provider. |
| `GET` | `/api/v2/triggers/runtime-sources` | Listar runtime data sources. |
| `POST` | `/api/v2/triggers/find-latest-block` | Buscar o preparar test input/block para trigger. |

## Trigger Import

Detalles: [Trigger Import API](api-trigger-import.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v2/triggers/import/evm` | Cargar EVM ABI entries. |
| `POST` | `/api/v2/triggers/import/evm/abi` | Detectar/cargar ABI por contract address. |
| `POST` | `/api/v2/triggers/import/evm/drafts` | Generar EVM trigger drafts. |
| `POST` | `/api/v2/triggers/import/substrate/drafts` | Generar Substrate trigger drafts. |
| `GET` | `/api/v2/triggers/substrate/source` | Obtener Substrate source info. |
| `GET` | `/api/v2/triggers/substrate/pallets` | Obtener lista de Substrate pallets. |
| `GET` | `/api/v2/triggers/substrate/pallet` | Obtener metadata de un Substrate pallet. |

## Templates

Detalles: [Templates API](api-templates.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/projects/:fullname/templates` | Listar templates del project. |
| `GET` | `/api/v2/projects/:fullname/template` | Obtener root template del project. |
| `POST` | `/api/v2/projects/:fullname/templates` | Crear template/group. |
| `GET` | `/api/v2/projects/:fullname/templates/:id` | Obtener template. |
| `PUT` | `/api/v2/projects/:fullname/templates/:id` | Actualizar template. |
| `DELETE` | `/api/v2/projects/:fullname/templates/:id` | Eliminar template. |

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
| `POST` | `/api/v2/subscriptions/test` | Test de subscription. |
| `GET` | `/api/v2/subscriptions/alerts/history` | Workspace subscription logs. |
| `GET` | `/api/v2/subscriptions/:id/alerts/history` | Logs de una subscription concreta. |

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

## Data Sources

Detalles: [Data Sources API](api-data-sources.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v2/custom-sources` | Listar custom data sources. |
| `GET` | `/api/v2/custom-sources/create-capability` | Comprobar capacidad de crear custom source. |
| `POST` | `/api/v2/custom-sources/verify` | Verificar custom source config. |
| `GET` | `/api/v2/custom-sources/:fullname` | Obtener custom source. |
| `PUT` | `/api/v2/custom-sources/:fullname` | Crear o actualizar custom source. |
| `DELETE` | `/api/v2/custom-sources/:fullname` | Eliminar custom source. |
| `GET` | `/api/v2/custom-sources/:fullname/logs` | Obtener custom source logs. |
| `POST` | `/api/v2/custom-sources/:fullname/test-status` | Comprobar status de custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/restart` | Reiniciar custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/reset-lag` | Resetear lag de custom source. |

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
| `GET` | `/api/v2/apps` | Listar apps. |
| `GET` | `/api/v2/apps/:fullname` | Obtener app. |
| `PUT` | `/api/v2/apps/:fullname` | Crear o actualizar app. |
| `DELETE` | `/api/v2/apps/:fullname` | Eliminar app. |
| `GET` | `/api/v2/actions` | Listar actions. |
| `GET` | `/api/v2/actions/:fullname` | Obtener action. |
| `PUT` | `/api/v2/actions/:fullname` | Crear o actualizar action. |
| `DELETE` | `/api/v2/actions/:fullname` | Eliminar action. |
| `GET` | `/api/v2/blueprints` | Listar blueprints. |
| `GET` | `/api/v2/blueprints/:fullname` | Obtener blueprint. |
| `PUT` | `/api/v2/blueprints/:fullname` | Crear o actualizar blueprint. |
| `DELETE` | `/api/v2/blueprints/:fullname` | Eliminar blueprint. |
| `GET` | `/api/v2/types` | Listar shared types. |
| `GET` | `/api/v2/types/:fullname` | Obtener shared type. |
| `PUT` | `/api/v2/types/:fullname` | Crear o actualizar shared type. |
| `DELETE` | `/api/v2/types/:fullname` | Eliminar shared type. |
