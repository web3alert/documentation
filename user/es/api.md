# API

Web3alert API permite trabajar con las mismas entidades que la web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources y addresses.

Base URL:

```text
https://web3alert.io
```

Todos los endpoints públicos para clientes usan rutas canónicas `/api/*`.
Los endpoints entre servicios no forman parte de esta referencia pública.

## OpenAPI

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/openapi.json` | [Documento JSON OpenAPI 3.1 de la API para agentes.](api-openapi.md) |

## Auth

La mayoría de los endpoints admite una sesión de cuenta o una clave de agente como credencial Bearer. Crea una clave en la [página Agents](https://web3alert.io/agents) o [inicia sesión con una cartera de Ethereum](agents.md).

```http
Authorization: Bearer YOUR_AGENT_KEY
```

La clave actúa con el rol de la cuenta en un espacio de trabajo. El permiso `read` permite leer, `manage` permite operaciones como crear suscripciones o cotizar recargas, y `spend` permite comprar planes o complementos de proyecto con el saldo en EUR. Gestionar claves, revocar tokens, cambiar de espacio, crear o actualizar un espacio, comprar cupones regalo y crear, aceptar, rechazar o cancelar solicitudes de transferencia de proyectos requieren una sesión. Consulta los endpoints y el [documento OpenAPI](api-openapi.md) para agentes.

El permiso opcional `code` solo se exige en [estas ocho rutas de triggers](api-triggers.md#agent-key-permissions). Las fuentes personalizadas, los recursos, los proyectos, las plantillas y las suscripciones no requieren `code`.

Las claves sin `manage` no reciben tokens de escritura de recursos externos. Las respuestas de facturación ocultan los códigos de cupones sin usar, incluidos los de regalo, a todas las claves de agente.

Una solicitud con una clave puede devolver HTTP `403` con `insufficient_scope` si falta un permiso, `key_not_allowed` si la operación exige una sesión o `spend_cap_exceeded` si la compra supera el límite mensual de la clave.

Si la solicitud exige `code` y la clave carece de ese permiso, la API devuelve `403 insufficient_scope` con este `error.message`.

> This key may not write or run its own code; create a key with the "code" permission on the Agents page.

El acceso a endpoint depende de:

- account tier;
- rol del usuario en workspace;
- access level de project/data source/resource;
- estado de la entidad.

Cada cuenta tiene tres cuotas independientes para la API. Todas sus claves de agente comparten una cuota al ritmo del plan de la cuenta. Las solicitudes de sesión externas comparten otra cuota al mismo ritmo. Las sesiones de la interfaz web propia usan una tercera cuota de 1.200 solicitudes por minuto. El tráfico de sesión de confianza de MCP está exento de estos límites. El límite de solicitudes del account nunca se aplica a `DELETE /api/token` ni a `DELETE /api/tokens`, por lo que puedes revocar tokens aunque el account haya agotado su cuota. Los valores detallados se describen en [Limits](limits.md#api-and-mcp).

## Response format

Las respuestas correctas con cuerpo devuelven JSON. Una respuesta `204 No Content`, como la que sigue a la eliminación de una subscription o a la revocación de tokens, no tiene cuerpo. Omite el análisis de JSON cuando recibas `204`.

Las estructuras detalladas del response body están descritas en [Types](types.md).

Los errores JSON de la API suelen incluir `error.message` y los campos opcionales `error.code` y `error.details`.

```json
{
  "error": {
    "message": "This key lacks the \"manage\" scope.",
    "code": "insufficient_scope"
  }
}
```

Las rutas para agentes pueden devolver estados HTTP específicos, como `401`, `403`, `404`, `409`, `410`, `429` y `503`. Lee el estado junto con `error.code` para decidir cómo tratar la respuesta. En las [recargas x402](api-billing.md#post-api-billing-wallet-x402-topup), un `402` contiene una cotización x402 v2 `PaymentRequired` o un fallo de pago con `error` como cadena.

Si el cuerpo de la solicitud contiene JSON mal formado, la API puede rechazarlo antes de ejecutar el controlador de la ruta y devolver un `400 Bad Request` en texto plano. Comprueba el `Content-Type` de la respuesta antes de interpretarla como JSON.

Cuando una solicitud supera el límite de external API, la API devuelve `429` con headers como los del ejemplo. Lee `Retry-After` para saber cuántos segundos debes esperar antes de reintentar.

```http
Retry-After: 1
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Detalles: [Account API](api-account.md).

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/token` | Autenticar la identity con `credentials` del provider y crear un Bearer token nuevo y persistente; no requiere un Bearer token existente. <!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent --> |
| `DELETE` | `/api/token` | Revocar el token usado para la solicitud. |
| `DELETE` | `/api/tokens` | Revocar todos los tokens del account autenticado. |
| `GET` | `/api/me` | Obtener account actual, identity, tier y memberships. |
| `POST` | `/api/keys` | Crea una clave en el espacio actual. Solo sesión. |
| `GET` | `/api/keys` | Lista las claves de todos los espacios de la cuenta. Solo sesión. |
| `PATCH` | `/api/keys/:id` | Edita el nombre o límite mensual de una clave. Solo sesión. |
| `DELETE` | `/api/keys/:id` | Revoca una clave. Solo sesión. |
| `DELETE` | `/api/me` | Eliminar account actual. |
| `PUT` | `/api/me/meta` | Actualizar account metadata. |
| `POST` | `/api/me/avatar` | Subir avatar del account actual. |
| `GET` | `/api/me/workspace` | Obtener workspace account actual. |
| `PUT` | `/api/me/workspace` | Cambiar workspace account actual. |
| `GET` | `/api/account/settings` | Obtener account settings. |
| `PUT` | `/api/account/settings` | Guardar account settings. |

## Inicio de sesión con cartera y reclamación

Consulta la [API de Account](api-account.md).

| Método | Endpoint | Propósito |
| --- | --- | --- |
| `POST` | `/api/agent/siwe/nonce` | Solicita un nonce SIWE de un solo uso. Público. |
| `POST` | `/api/agent/siwe/verify` | Verifica un mensaje SIWE firmado y emite una clave. Público. |
| `POST` | `/api/agent/claim-link` | Crea o sustituye un enlace de reclamación. Clave de agente con `manage`. |
| `GET` | `/api/agent/claims/:token` | Consulta los datos de reclamación. Público para quien tenga el enlace. |

## Enlaces

Detalles: [API de enlaces](api-links.md).

| Método | Endpoint | Finalidad |
| --- | --- | --- |
| `POST` | `/api/links` | Crear un enlace corto anónimo para una ruta interna de Web3alert. |
| `GET` | `/api/links/:key` | Resolver una clave anónima; una clave desconocida devuelve `400`. |

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
| `GET` | `/api/template-helpers` | Listar metadatos públicos de helpers de Handlebars para plantillas de triggers y actions. |
| `POST` | `/api/triggers/find-latest-block` | Buscar o preparar test input/block para trigger. |

## Creación de triggers para agentes

Consulta la [API de Triggers](api-triggers.md).

| Método | Endpoint | Propósito |
| --- | --- | --- |
| `POST` | `/api/agent/build/contracts` | Busca firmas de eventos. Sesión o clave con `read`. |
| `POST` | `/api/agent/build/drafts` | Genera un borrador de trigger. Sesión o clave con `manage`. |
| `POST` | `/api/agent/build/drafts/:draftId/test` | Prueba un borrador. Sesión o clave con `read`. |
| `POST` | `/api/agent/build/drafts/:draftId/activate` | Activa un borrador cuya prueba coincidió. Sesión o clave con `manage`. |
| `DELETE` | `/api/agent/build/triggers/:fullname` | Elimina un trigger privado del agente. Sesión o clave con `manage`. |

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
| `GET` | `/api/subscriptions` | Listar subscriptions del workspace/account actual. |
| `POST` | `/api/subscriptions` | Crear subscription. |
| `GET` | `/api/subscriptions/:id` | Obtener subscription. |
| `PUT` | `/api/subscriptions/:id` | Actualizar subscription. |
| `DELETE` | `/api/subscriptions/:id` | Eliminar subscription. |
| `PUT` | `/api/subscriptions/:id/state` | Activar o desactivar subscription. |
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
| `POST` | `/api/resources/:fullname/signing-secret` | Generar o rotar un secreto de firma de webhook. |
| `PUT` | `/api/inbox` | Crea o devuelve la bandeja del espacio. Sesión o clave con `manage`. |
| `GET` | `/api/events` | Lee los eventos conservados. Sesión o clave con `read`. |
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
| `POST` | `/api/billing/wallet/x402-topup` | Recarga el saldo en EUR con USDC en Base por x402. Sesión o clave con `manage`. |
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
| `GET` | `/api/addresses` | Listar addresses. |
| `POST` | `/api/addresses` | Crear address. |
| `PUT` | `/api/addresses/:id` | Actualizar address. |
| `DELETE` | `/api/addresses/:id` | Eliminar address. |

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
