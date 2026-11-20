# Account API

Account endpoints work with current user, metadata, avatar, and selected workspace.

All Account endpoints except `POST /api/token` require `Authorization: Bearer <token>`.

## POST /api/token

`POST /api/token` does not require an existing `Authorization: Bearer <token>` header. The provider-specific `credentials` authenticate the identity through the selected `app`.

Every successful request creates a fresh persistent Bearer token; it does not reuse or return an earlier token. On the first successful login for an identity, the service may also create an account and workspace.

<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent; first-login=may-provision-account-workspace -->

Arguments: no path/query arguments.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `app` | Yes | Auth app/provider name. |
| `credentials` | Yes | Provider-specific credentials object. |

Response: [TokenResponse](types.md#tokenresponse).

Example request (the missing `Authorization` header is intentional):

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

Example response:

```json
{
  "token": "<new-bearer-token>"
}
```

Provider credentials and the returned token are secrets. Send them only over HTTPS; never log, publish, or commit them.

## DELETE /api/token

Revokes the token used to authenticate this request.

Send the request with no path or query arguments and no body. Extra parameters cannot select another token or account.

```http
DELETE /api/token
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

On success, the server returns `204 No Content` with an empty body. This endpoint is available even when the account has reached its API rate limit.

## DELETE /api/tokens

Revokes every token belonging to the authenticated account, including the token used for this request.

Send the request with no path or query arguments and no body. Extra parameters cannot select another token or account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

On success, the server returns `204 No Content` with an empty body. This endpoint is available even when the account has reached its API rate limit.

## GET /api/me

Returns current account, identity, tier, memberships, and selected workspace.

Arguments: none.

Payload: none.

Response: [Me](types.md#me).

### Tier limits {#me-limits}

The response also includes `limits` for the authenticated account's tier.

| Field | Type | Description |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Maximum active subscriptions counted toward the plan. `null` means unlimited. |
| `limits.canRunTests` | `boolean` | Whether the tier allows test runs. |
| `limits.alertHistory` | `object \| null` | Alert history limits. `null` means the tier has no alert history. |
| `limits.alertHistory.retentionDays` | `number` | Alert history retention in days. |
| `limits.alertHistory.maxRecords` | `number \| null` | Maximum records retained. `null` means there is no record cap. |

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
