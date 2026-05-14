# Resources API

Resources endpoints manage delivery resources and the external setup flow.

## GET /api/v2/resources

Returns resources.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `workspace` | Query | Optional workspace fullname filter. |
| `project` | Query | Optional project fullname filter. |

Payload: none.

Response: [ResourceView[]](types.md#resourceview).

## GET /api/v2/resources/:fullname

Returns a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Response: [ResourceView](types.md#resourceview).

## PUT /api/v2/resources/:fullname

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

## DELETE /api/v2/resources/:fullname

Deletes a resource.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## GET /api/v2/resources/external/:token

Opens external resource setup by token.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `token` | Path | External setup token. |

Payload: none.

Response: [ExternalResourceView](types.md#externalresourceview).

## POST /api/v2/resources/external/:token

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
