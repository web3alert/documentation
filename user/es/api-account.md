# Account API

Account endpoints trabajan con el usuario actual, sus metadata, avatar y workspace seleccionado.

Todos los endpoints requieren `Authorization: Bearer <token>`, excepto los casos en los que token se crea después de un external auth flow.

## POST /api/token

Crea o devuelve un API token para la identity autenticada.

Argumentos: no hay argumentos path/query.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `app` | Sí | Nombre de auth app/provider. |
| `credentials` | Sí | Objeto credentials específico del provider. |

Respuesta: [TokenResponse](types.md#tokenresponse).

## GET /api/me

Devuelve el account actual, identity, tier, memberships y workspace seleccionado.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [Me](types.md#me).

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
| `nickname` | No | Display name del usuario, 2-80 caracteres. |

Respuesta: [Me](types.md#me).

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
