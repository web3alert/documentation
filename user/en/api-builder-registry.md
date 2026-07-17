# Apps, Actions, Blueprints and Types API

These endpoints describe the builder/registry layer: apps, actions, blueprints, and shared types. They are used for service integrations and reusable resource/action definitions.

## Apps

### GET /api/apps

Returns apps.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: none.

Response: [AppView[]](types.md#appview).

### GET /api/apps/:fullname

Returns an app.

Arguments: `fullname` path argument.

Payload: none.

Response: [AppView](types.md#appview).

### PUT /api/apps/:fullname

Creates or updates an app.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | App name. |
| `fullname` | Yes | App fullname. |
| `project` | Yes | Project fullname. |
| `workspace` | Yes | Workspace fullname. |
| `url` | Yes | App URL. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |

Response: [AppView](types.md#appview).

### DELETE /api/apps/:fullname

Deletes an app.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Actions

### GET /api/actions

Returns actions.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project filter. |
| `workspace` | Query | Optional workspace filter. |

Payload: none.

Response: [ActionView[]](types.md#actionview).

### GET /api/actions/:fullname

Returns an action.

Arguments: `fullname` path argument.

Payload: none.

Response: [ActionView](types.md#actionview).

### PUT /api/actions/:fullname

Creates or updates an action.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Action name. |
| `fullname` | Yes | Action fullname. |
| `project` | Yes | Project fullname. |
| `workspace` | Yes | Workspace fullname. |
| `backend` | Yes | Action backend definition. |
| `values` | Yes | Action values schema. |
| `overrides` | Yes | Fields that action can override. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta` | Yes | Action metadata. |

Response: [ActionView](types.md#actionview).

### DELETE /api/actions/:fullname

Deletes an action.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/blueprints

Returns blueprints.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `app` | Query | Optional app fullname filter. |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: none.

Response: [BlueprintView[]](types.md#blueprintview).

### GET /api/blueprints/:fullname

Returns a blueprint.

Arguments: `fullname` path argument.

Payload: none.

Response: [BlueprintView](types.md#blueprintview).

### PUT /api/blueprints/:fullname

Creates or updates a blueprint.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Blueprint name. |
| `fullname` | Yes | Blueprint fullname. |
| `app` | Yes | App fullname. |
| `project` | Yes | Project fullname. |
| `workspace` | Yes | Workspace fullname. |
| `type` | Yes | `plain` or `external`. |
| `data` | No | Object spec. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta.title` | No | Visible title. |
| `meta.description` | No | Description. |

Response: [BlueprintView](types.md#blueprintview).

### DELETE /api/blueprints/:fullname

Deletes a blueprint.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Types

### GET /api/types

Returns shared types.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project filter. |
| `workspace` | Query | Optional workspace filter. |
| `status` | Query | `not_tested`, `ready`, or `broken`. |
| `pallet` | Query | Optional pallet filter. |
| `kind` | Query | `event`, `call`, `transaction`, or `timer`. |
| `dataSource` | Query | Optional data source filter. |

Payload: none.

Response: [SharedTypeView[]](types.md#sharedtypeview).

### GET /api/types/lookup

Resolves dynamic type options for a trigger-scoped catalog.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `trigger` | Query | Trigger fullname. |
| `ref` | Query | Type schema reference to resolve. |
| `q` | Query | Optional text search. |
| `value` | Query | Optional exact value. |
| `limit` | Query | Optional result limit. |
| Additional fields | Query | Optional dependency values such as `series` or `event`. |

Payload: none.

Response contains `ref`, normalized `items` with `label`, `value`, optional
`parents`, and an optional `nextCursor`.

### GET /api/types/:fullname

Returns a shared type.

Arguments: `fullname` path argument.

Payload: none.

Response: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/types/:fullname

Creates or updates a shared type.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Shared type collection name. |
| `fullname` | Yes | Shared type fullname. |
| `project` | Yes | Project fullname. |
| `workspace` | Yes | Workspace fullname. |
| `schemas` | Yes | Object with named type schemas. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta` | No | Metadata object. |

Response: [SharedTypeView](types.md#sharedtypeview).

### DELETE /api/types/:fullname

Deletes a shared type.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).
