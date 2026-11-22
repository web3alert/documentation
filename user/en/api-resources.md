# Resources API

Resources endpoints manage delivery resources and their public setup flows. All
routes on this page use the canonical `/api` namespace.

Webhook resources include `signing: { enabled: boolean, createdAt: string | null }` in the list, single-resource view, and PUT response. `enabled` shows whether signing is enabled. `createdAt` is the time the current signing secret was created, or `null` for an unsigned webhook.

Transferring a project to another workspace removes the signing secrets of the webhooks that move with it. Those webhooks report `signing.enabled: false`. A controller of the new workspace can [generate a fresh secret](#post-api-resources-fullname-signing-secret) for each moved webhook.

## GET /api/resources

Returns resources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `project` | Query | Optional project fullname filter. |

Payload: none.

Response: [ResourceView[]](types.md#resourceview).

When authenticated with an agent key that lacks `manage`, the response omits external resource write tokens.

## GET /api/resources/:fullname

Returns a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Response: [ResourceView](types.md#resourceview).

When authenticated with an agent key that lacks `manage`, the response omits external resource write tokens.

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

When this request creates a webhook, the response also returns `signingSecret` once. Updates of existing resources return only the resource view.

## POST /api/resources/:fullname/signing-secret

Generates a signing secret for an unsigned webhook or replaces its existing secret. The caller must control the resource's workspace.

Returns `signingSecret` once and `createdAt` as an ISO timestamp. See [Webhooks](webhooks.md) for when the new secret takes effect.

These rotation errors return HTTP `400` with a JSON body of the form `{ "error": { "message": "..." } }`.

| Message | When it occurs |
| --- | --- |
| `access denied` | The caller does not control the resource’s workspace. |
| `resource not found` | The resource does not exist. |
| `not a webhook resource` | The resource is not a webhook. |

## DELETE /api/resources/:fullname

Deletes a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Requires an account session or agent key with `manage`, plus control of the resource's workspace. Returns `204 No Content`. Deleting a webhook returns `409 webhook_in_use` while a live (`on`) subscription in that workspace delivers to it. Live inbox subscriptions do not block deletion of the inbox resource.

The three setup-session endpoints below are available only when secure Telegram
destination setup is enabled on the server.

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

On completion, the server stores the confirmed target in private `data`, sets
`ready` to `true`, and clears `remark`. A workspace controller reading the
resource receives the safe destination name, kind, and optional topic through
`destinationSummary`; the Telegram target id and raw private data are omitted.
Use `destinationSummary`, not `remark`, to display the configured destination.

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

## PUT /api/inbox

Requires an account session or an agent key with `manage`, plus workspace control. Takes no body. Returns `{ fullname, retention: { days, maxEvents } }`. Repeated calls return the same inbox. If another resource already uses the fullname, the response is `409 resource_name_in_use`.

Use the returned fullname as `values.inbox` in the `common.builtin.inbox` subscription action. Inbox creation and reading check the workspace owner's plan, or the caller's if the workspace has no owner. Both return `403 not_in_plan` if that plan lacks alert history.

Event storage and retention follow the workspace owner's plan, or the subscription creator's when there is no owner. The inbox stores no events while that plan lacks alert history. See [Limits](limits.md).

While the applicable plan lacks alert history, the API refuses inbox writes. Five consecutive undelivered events to the inbox block the subscription. After restoring a paid plan, check the state with `list_subscriptions` and resume any blocked subscription with `set_subscription_state` and `state: "on"`. Check that it returns `on`.

## GET /api/events

Requires an account session or an agent key with `read`, plus workspace control and the same paid-plan check as inbox creation. Pass the optional query parameters `after` (opaque cursor) and `limit` (1–500, default 100). The initial read starts at the oldest retained event. A cursor works only in its original workspace. An empty cursor, forbidden characters, or more than 256 characters returns HTTP `400` with `error.message` set to `invalid request`. Other invalid cursors, including a cursor from another workspace, return HTTP `400` with `error.message` set to `invalid inbox cursor`.

Returns `{ events, nextCursor, hasMore, gap }`. Each event contains `cursor`, `id`, `receivedAt`, `subscription`, `trigger` and `body`. A body over 64 KB is stored with `truncated: true` and without `object`.

Pass `nextCursor` as `after` for the next page or poll. An empty page returns the supplied cursor, or `null` if it was omitted. `gap: true` reports holes in previously stored events, between the cursor and the first result or between events on the same page. With a cursor, an empty page can also report a gap if newer events were stored and then expired or were removed. Check the [delivery log](api-subscriptions.md) for undelivered events when history is available.

## GET /api/resources/external/:token

<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->

Reads external resource setup state through the resource capability.

Security: `:token` is a persistent bearer capability for the resource, not the
15-minute one-time `setupToken` used by Telegram setup sessions. Treat the
complete URL as a secret. Send it only over HTTPS and never put it in analytics,
application logs, support messages, or referrer-bearing links.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Persistent resource bearer capability. |

Payload: none.

Response: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Submits external resource setup payload through the resource capability.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | Persistent resource bearer capability. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `transform` | Yes | Object or `null`, resource/app-specific transform/setup result. |

Response: [OperationResult](types.md#operationresult).
