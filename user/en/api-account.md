# Account API

Account endpoints work with current user, metadata, avatar, and selected workspace.

All endpoints require `Authorization: Bearer <token>`, except cases when token is created after an external auth flow.

## POST /api/token

Creates or returns API token for authenticated identity.

Arguments: no path/query arguments.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `app` | Yes | Auth app/provider name. |
| `credentials` | Yes | Provider-specific credentials object. |

Response: [TokenResponse](types.md#tokenresponse).

## GET /api/me

Returns current account, identity, tier, memberships, and selected workspace.

Arguments: none.

Payload: none.

Response: [Me](types.md#me).

## DELETE /api/me

Deletes current account.

Arguments: none.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## PUT /api/me/meta

Updates user metadata.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `nickname` | Yes | User display name, 2-80 characters. Leading and trailing whitespace is trimmed before the value is saved and returned. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| `nickname` | Yes | Trimmed nickname that was saved. |

## POST /api/me/avatar

Uploads current account avatar.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `filename` | Yes | Original filename. |
| `contentType` | Yes | Image MIME type. |
| `data` | Yes | Base64 image data. |

Response: [AvatarUploadResult](types.md#avataruploadresult).

## GET /api/me/workspace

Returns selected workspace of current account.

Arguments: none.

Payload: none.

Response: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## PUT /api/me/workspace

Changes selected workspace of current account.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `workspace` | Yes | Workspace fullname or `null` to reset selection. |

Response: [CurrentWorkspaceResponse](types.md#currentworkspaceresponse).

## GET /api/account/settings

Returns account settings.

Arguments: none.

Payload: none.

Response: [AccountSettings](types.md#accountsettings).

## PUT /api/account/settings

Saves account settings.

Arguments: none.

Payload: settings object. The concrete set of fields depends on the current account settings UI version.

Response: [AccountSettings](types.md#accountsettings).
