# Account API

Account endpoints trabajan con el usuario actual, sus metadata, avatar y workspace seleccionado.

Envía una credencial Bearer en las solicitudes autenticadas. Gestionar claves o cambiar la sesión requiere un token de sesión de cuenta. Las rutas públicas de inicio de sesión y reclamación se indican a continuación.

## POST /api/token

`POST /api/token` no requiere un header `Authorization: Bearer <token>` existente. Las `credentials` específicas del provider autentican la identity mediante el `app` seleccionado.

Cada solicitud exitosa crea un Bearer token nuevo y persistente; no reutiliza ni devuelve un token anterior. En el primer inicio de sesión exitoso de una identity, el servicio también puede crear un account y un workspace.

<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent; first-login=may-provision-account-workspace -->

Argumentos: no hay argumentos path/query.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `app` | Sí | Nombre de auth app/provider. |
| `credentials` | Sí | Objeto credentials específico del provider. |
| `claim` | No | Token del enlace de reclamación de una cuenta creada con cartera, para iniciar sesión con Telegram o Google. |

Respuesta: [TokenResponse](types.md#tokenresponse).

Ejemplo de solicitud (la ausencia del header `Authorization` es intencional):

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

Ejemplo de respuesta:

```json
{
  "token": "<new-bearer-token>"
}
```

Las credenciales del provider y el token devuelto son secretos. Envíalos solo mediante HTTPS; no los registres, publiques ni incluyas en commits.

Con `claim`, un inicio de sesión correcto vincula el acceso a la cuenta de la cartera, consume el enlace y emite un token de sesión para esa cuenta. `409 login_already_linked` significa que el acceso pertenece a otra cuenta y el enlace sigue válido. Una reclamación inválida devuelve `404 claim_not_found` sin crear una cuenta.

Reclamar la cuenta deja activas las claves emitidas previamente mediante la cartera. Después de iniciar sesión, revisa las claves en la [página Agents](https://web3alert.io/agents) y revoca las que no quieras conservar.

## DELETE /api/token

Revoca el token usado para autenticar esta solicitud.

Requiere un token de sesión de cuenta. Al cerrar sesión, la aplicación llama a esta operación para el navegador actual.

Envía la solicitud sin argumentos path/query y sin cuerpo. Los parámetros adicionales no permiten seleccionar otro token ni otro account.

```http
DELETE /api/token
Authorization: Bearer YOUR_SESSION_TOKEN
```

Si la solicitud tiene éxito, el servidor devuelve `204 No Content` con el cuerpo vacío. Este endpoint está disponible incluso si el account ha alcanzado su límite de solicitudes a la API.

## DELETE /api/tokens

Revoca todos los tokens del account autenticado, incluido el token usado para esta solicitud.

Requiere un token de sesión de cuenta. Las claves de agente se revocan individualmente mediante `DELETE /api/keys/:id`.

Envía la solicitud sin argumentos path/query y sin cuerpo. Los parámetros adicionales no permiten seleccionar otro token ni otro account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_SESSION_TOKEN
```

Si la solicitud tiene éxito, el servidor devuelve `204 No Content` con el cuerpo vacío. Este endpoint está disponible incluso si el account ha alcanzado su límite de solicitudes a la API.

## GET /api/me

Devuelve el account actual, identity, tier, memberships y workspace seleccionado.

Una solicitud con clave exige `read` y añade `key` con `id`, `name`, `scopes`, `monthlyCapEur`, `spentThisMonthEur` y `expiresAt`. En `memberships` solo aparece el espacio vinculado a la clave.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [Me](types.md#me).

### Límites del plan {#me-limits}

La respuesta también incluye `limits` para el plan de la cuenta autenticada.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Límite por cuenta de las suscripciones activas que has creado a proyectos que no sean Free, sumadas entre todos los espacios de trabajo. Las suscripciones a proyectos Free quedan fuera del límite. `null` significa que no hay límite. |
| `limits.canRunTests` | `boolean` | Indica si el plan permite ejecutar pruebas. |
| `limits.alertHistory` | `object \| null` | Límites del historial de alertas. `null` significa que el plan no incluye historial. |
| `limits.alertHistory.retentionDays` | `number` | Retención del historial de alertas en días. |
| `limits.alertHistory.maxRecords` | `number \| null` | Número máximo de registros conservados. `null` significa que no hay límite de registros. |

## POST /api/keys

Cualquier miembro del espacio actual puede crear una clave. La clave actúa con el rol de la cuenta en ese espacio.

Requiere un token de sesión. Crea una clave vinculada al espacio de trabajo actual. Envía `{ name, scopes, monthlyCapEur?, expiresInDays? }`. El nombre admite 1–64 caracteres. Incluye `read` y, si procede, `manage` y `spend`. Puedes fijar un límite de 0 a 10.000 € con hasta dos decimales y un vencimiento de 30, 90 o 365 días. Omite esos campos o usa `null` para dejarlos sin límite.

Devuelve `201` con `{ key, secret }`. Copia `secret`, que solo se muestra en esa respuesta.

## GET /api/keys

Requiere un token de sesión. Devuelve `{ keys }` de todos los espacios de la cuenta, de las más recientes a las más antiguas, incluidas las revocadas. Cada clave incluye espacio, permisos, límite, gasto del mes, vencimiento, estado y `connectedBy`.

## PATCH /api/keys/:id

Requiere un token de sesión. Envía `{ name?, monthlyCapEur? }` para editar una clave de la cuenta. Usa `null` para quitar el límite. Devuelve `{ key }` o `404` si la clave no está disponible para la cuenta.

## DELETE /api/keys/:id

Requiere un token de sesión. Revoca una clave de la cuenta. Si se revoca o ya está revocada, devuelve `204 No Content`. Si la clave no está disponible para la cuenta, devuelve `404`.

## POST /api/agent/siwe/nonce

Público. No requiere cuerpo. Devuelve `{ nonce, issuedAt, expiresAt }`. El nonce caduca en 10 minutos y se usa una sola vez.

Los endpoints de nonce y verificación comparten un límite por IP en el perímetro de 1 solicitud por segundo, con una ráfaga de 10. Los `429` del perímetro no incluyen el cuerpo `signup_limited` de la API. Respeta `Retry-After` y pide un nonce nuevo si el mensaje firmado ha quedado desactualizado.

## POST /api/agent/siwe/verify

Público. Envía `{ message, signature }` firmado con una cuenta externa (EOA) de Ethereum. Usa un mensaje EIP-4361 versión `1`, el nonce, el dominio `web3alert.io`, una URI de ese origen y un `issuedAt` dentro de los cinco minutos del reloj del servidor. Se acepta cualquier ID de cadena.

Devuelve `{ account: { id, created }, key, secret, claimUrl }`. El primer inicio crea una cuenta Free y su espacio de trabajo. Cada inicio correcto emite una clave con todos los permisos, sin límite ni vencimiento. Usa `secret` como credencial Bearer. La verificación emite un enlace cuando crea la cuenta o cuando no hay un enlace activo. Si ya existe uno, `claimUrl` vale `null`. Usa `POST /api/agent/claim-link` para sustituirlo.

Cuando una persona reclama la cuenta con Telegram o Google, el inicio de sesión con cartera devuelve `403 account_claimed` y no emite clave ni enlace. Pídele una clave de agente.

Una verificación fallida devuelve `401 invalid_siwe`. Se admiten 10 cuentas nuevas por IP en una hora móvil y 200 en total en un día móvil. Al alcanzar el límite, devuelve `429 signup_limited` con `Retry-After`. Consulta el [ejemplo SIWE](agents.md).

## POST /api/agent/claim-link

Requiere una clave de agente con `manage`. No requiere cuerpo. Devuelve `{ claimUrl, expiresAt }`. El enlace nuevo sustituye al anterior y vence en siete días. Un token de sesión recibe `403 agent_key_required`. Si Telegram o Google ya está vinculado, devuelve `409 already_claimed`.

## GET /api/agent/claims/:token

Público para quien tenga el enlace. Devuelve `{ wallet, account: { name }, createdAt, expiresAt }`. Un enlace desconocido, caducado, sustituido o usado devuelve `404 claim_not_found`. Completa la reclamación con el campo opcional `claim` de `POST /api/token`.

## DELETE /api/me

Elimina el account actual.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## PUT /api/me/meta

Actualiza metadata del usuario.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `nickname` | Sí | Display name del usuario, 2-80 caracteres. El whitespace inicial y final se elimina antes de guardar y devolver el valor. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `nickname` | Sí | Nickname normalizado que se guardó. |

## POST /api/me/avatar

Sube el avatar del account actual.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `filename` | Sí | Nombre original del archivo. |
| `contentType` | Sí | MIME type de la imagen. |
| `data` | Sí | Datos de imagen en Base64. |

Respuesta: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/me/workspace

Devuelve el workspace seleccionado del account actual.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## PUT /api/me/workspace

Cambia el workspace seleccionado del account actual.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `workspace` | Sí | Workspace fullname o `null` para resetear la selección. |

Respuesta: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## GET /api/account/settings

Devuelve account settings.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [AccountSettings](types.md#accountsettings).

## PUT /api/account/settings

Guarda account settings.

Argumentos: ninguno.

Payload: objeto settings. El conjunto concreto de fields depende de la versión actual de account settings UI.

Respuesta: [AccountSettings](types.md#accountsettings).
