# Resources API

Resources endpoints manage delivery resources and their public setup flows. All
routes on this page use the canonical `/api` namespace.

## GET /api/resources

Returns resources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `project` | Query | Optional project fullname filter. |

Payload: none.

Response: [ResourceView[]](types.md#resourceview).

## GET /api/resources/:fullname

Returns a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Response: [ResourceView](types.md#resourceview).

## PUT /api/resources/:fullname

Creates or updates a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Must match `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Resource name. |
| `fullname` | Yes | Resource fullname. |
| `workspace` | Yes | Workspace fullname. |
| `project` | No | Project fullname, if the resource is linked to a project. |
| `blueprint` | Yes | Blueprint fullname that defines setup/action behavior. |
| `data` | No | Resource-specific data. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta.title` | No | Visible title. |

Response: [ResourceView](types.md#resourceview).

## DELETE /api/resources/:fullname

Deletes a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## POST /api/resources/:fullname/setup-sessions

Starts a secure Telegram destination setup session. The authenticated account
must own the resource workspace, and the resource must use the Telegram
external blueprint.

Only one setup session can be active for a resource. Starting a new session
supersedes the previous active session without changing the resource's current
destination.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname. |

Payload: none.

Response:

| Field | Description |
| --- | --- |
| `id` | Setup session id used to check or cancel the session. |
| `status` | `pending`. |
| `setupToken` | One-time secret used to open the Telegram bot setup flow. It is returned only by this response and must not be logged or persisted. |
| `expiresAt` | ISO timestamp. The session and `setupToken` expire 15 minutes after creation. |

The existing destination continues receiving alerts until Telegram confirms the
new destination and the session becomes `completed`.

## GET /api/resources/:fullname/setup-sessions/:id

Returns the public state of a Telegram destination setup session. The response
never contains `setupToken`.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname. |
| `id` | Path | Setup session id. |

Payload: none.

Response:

| Field | Description |
| --- | --- |
| `id` | Setup session id. |
| `resourceFullname` | Resource fullname. |
| `status` | `pending`, `claimed`, `completed`, `cancelled`, `expired`, or `superseded`. |
| `expiresAt` | ISO expiry timestamp. |

## DELETE /api/resources/:fullname/setup-sessions/:id

Cancels an active Telegram destination setup session. Cancellation is safe for
an already configured resource: its current destination remains unchanged.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Telegram resource fullname. |
| `id` | Path | Setup session id. |

Payload: none.

Response: empty success response.

## GET /api/resources/external/:token

Opens external resource setup by token.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | External setup token. |

Payload: none.

Response: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Sends payload for external resource setup.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | External setup token. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `transform` | Yes | Object or `null`, resource/app-specific transform/setup result. |

Response: [OperationResult](types.md#operationresult).
