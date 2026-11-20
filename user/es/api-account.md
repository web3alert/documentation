# Account API

Account endpoints trabajan con el usuario actual, sus metadata, avatar y workspace seleccionado.

Todos los endpoints de Account, excepto `POST /api/token`, requieren `Authorization: Bearer <token>`.

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

## DELETE /api/token

Revoca el token usado para autenticar esta solicitud.

Envía la solicitud sin argumentos path/query y sin cuerpo. Los parámetros adicionales no permiten seleccionar otro token ni otro account.

```http
DELETE /api/token
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Si la solicitud tiene éxito, el servidor devuelve `204 No Content` con el cuerpo vacío. Este endpoint está disponible incluso si el account ha alcanzado su límite de solicitudes a la API.

## DELETE /api/tokens

Revoca todos los tokens del account autenticado, incluido el token usado para esta solicitud.

Envía la solicitud sin argumentos path/query y sin cuerpo. Los parámetros adicionales no permiten seleccionar otro token ni otro account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Si la solicitud tiene éxito, el servidor devuelve `204 No Content` con el cuerpo vacío. Este endpoint está disponible incluso si el account ha alcanzado su límite de solicitudes a la API.

## GET /api/me

Devuelve el account actual, identity, tier, memberships y workspace seleccionado.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [Me](types.md#me).

### Límites del plan {#me-limits}

La respuesta también incluye `limits` para el plan de la cuenta autenticada.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Máximo de suscripciones activas que cuentan para el plan. `null` significa que no hay límite. |
| `limits.canRunTests` | `boolean` | Indica si el plan permite ejecutar pruebas. |
| `limits.alertHistory` | `object \| null` | Límites del historial de alertas. `null` significa que el plan no incluye historial. |
| `limits.alertHistory.retentionDays` | `number` | Retención del historial de alertas en días. |
| `limits.alertHistory.maxRecords` | `number \| null` | Número máximo de registros conservados. `null` significa que no hay límite de registros. |

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
