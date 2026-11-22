# Account API

Account endpoints work with current user, metadata, avatar, and selected workspace.

Send a bearer credential for authenticated requests. Key management and account session changes require an account session token. The public sign-in and claim routes are marked below.

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
| `claim` | No | Token from a wallet account's claim link, for Telegram or Google sign-in. |

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

With `claim`, a successful sign-in attaches the login to the wallet account, consumes the claim link, and issues a session token for that account. `409 login_already_linked` means the login belongs to another account and the link remains usable. An invalid claim returns `404 claim_not_found` and creates no account.

Claiming the account leaves previously issued wallet keys active. After signing in, review the keys on the [Agents page](https://web3alert.io/agents) and revoke any you do not want to keep.

## DELETE /api/token

Revokes the token used to authenticate this request.

Requires an account session token. Logging out in the app calls this operation for the current browser session.

Send the request with no path or query arguments and no body. Extra parameters cannot select another token or account.

```http
DELETE /api/token
Authorization: Bearer YOUR_SESSION_TOKEN
```

On success, the server returns `204 No Content` with an empty body. This endpoint is available even when the account has reached its API rate limit.

## DELETE /api/tokens

Revokes every token belonging to the authenticated account, including the token used for this request.

Requires an account session token. Agent keys are revoked individually through `DELETE /api/keys/:id`.

Send the request with no path or query arguments and no body. Extra parameters cannot select another token or account.

```http
DELETE /api/tokens
Authorization: Bearer YOUR_SESSION_TOKEN
```

On success, the server returns `204 No Content` with an empty body. This endpoint is available even when the account has reached its API rate limit.

## GET /api/me

Returns current account, identity, tier, memberships, and selected workspace.

An agent-key request requires `read` and adds `key` with `id`, `name`, `scopes`, `monthlyCapEur`, `spentThisMonthEur` and `expiresAt`. It lists only the key's workspace in `memberships`.

Arguments: none.

Payload: none.

Response: [Me](types.md#me).

### Tier limits {#me-limits}

The response also includes `limits` for the authenticated account's tier.

| Field | Type | Description |
| --- | --- | --- |
| `limits.maxSubscriptions` | `number \| null` | Account-wide cap on active subscriptions you created to non-Free projects across all workspaces. Subscriptions to Free projects are exempt. `null` means unlimited. |
| `limits.canRunTests` | `boolean` | Whether the tier allows test runs. |
| `limits.alertHistory` | `object \| null` | Alert history limits. `null` means the tier has no alert history. |
| `limits.alertHistory.retentionDays` | `number` | Alert history retention in days. |
| `limits.alertHistory.maxRecords` | `number \| null` | Maximum records retained. `null` means there is no record cap. |

## POST /api/keys

Any member of the current workspace can create a key. The key acts with the account's role in that workspace.

Requires an account session token. Creates a key bound to the current workspace. Send `{ name, scopes, monthlyCapEur?, expiresInDays? }`. The name is 1–64 characters. Include `read` and optionally `manage` and `spend`. A cap can be €0–€10,000 with up to two decimal places, and expiry can be 30, 90 or 365 days. Omit either optional field or pass `null` for no limit of that kind.

Returns `201` with `{ key, secret }`. Copy `secret` now. The response is the only time it is shown.

## GET /api/keys

Requires an account session token. Returns `{ keys }` for the account across its workspaces, newest first, including revoked keys. Each view includes the workspace, scopes, cap, this month's spend, expiry, status and `connectedBy`.

## PATCH /api/keys/:id

Requires an account session token. Send `{ name?, monthlyCapEur? }` to update a key belonging to the account. Use `null` to clear the cap. Returns `{ key }` or `404` if the key is unavailable to the account.

## DELETE /api/keys/:id

Requires an account session token. Revokes a key belonging to the account. Returns `204 No Content` on success, including a repeated revocation, or `404` if the key is unavailable to the account.

## POST /api/agent/siwe/nonce

Public. Takes no body. Returns `{ nonce, issuedAt, expiresAt }`. The nonce can be used once and expires after 10 minutes.

The nonce and verify endpoints share a per-IP edge limit of 1 request per second with a burst of 10. Edge `429` responses do not contain the API's `signup_limited` body. Honor `Retry-After` and get a fresh nonce if the signed message has gone stale.

## POST /api/agent/siwe/verify

Public. Send `{ message, signature }` signed by an Ethereum externally owned account (EOA). Use an EIP-4361 version `1` message with the returned nonce, the `web3alert.io` sign-in domain, a URI on that origin and an `issuedAt` within five minutes of the server clock. Any chain ID is accepted.

Returns `{ account: { id, created }, key, secret, claimUrl }`. A first sign-in creates a Free account and workspace. Each success issues a fresh key with all scopes and no cap or expiry. Use `secret` as the bearer credential. Wallet verification issues a claim link when it creates the account or when there is no active link. With an active link, `claimUrl` is `null`. Use `POST /api/agent/claim-link` to replace it.

After a person claims the account with Telegram or Google, wallet sign-in returns `403 account_claimed` and issues no key or link. Ask that person for an agent key.

Failed verification returns `401 invalid_siwe`. New accounts are limited to 10 per IP per rolling hour and 200 overall per rolling day. Hitting a limit returns `429 signup_limited` with `Retry-After`. See the [SIWE example](agents.md).

## POST /api/agent/claim-link

Requires an agent key with `manage`. Takes no body. Returns `{ claimUrl, expiresAt }`. The newest link replaces the previous one and expires in seven days. The route returns `403 agent_key_required` for a session token and `409 already_claimed` when a Telegram or Google login is linked.

## GET /api/agent/claims/:token

Public to the link holder. Returns `{ wallet, account: { name }, createdAt, expiresAt }`. An unknown, expired, replaced or used link returns `404 claim_not_found`. Complete the claim with the optional `claim` field in `POST /api/token`.

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
