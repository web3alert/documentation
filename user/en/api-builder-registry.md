# Apps, Actions, Blueprints and Types API

These endpoints describe the builder/registry layer: apps, actions, blueprints, and shared types. They are used for service integrations and reusable resource/action definitions.

## Apps

### GET /api/v2/apps

Returns apps.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: none.

Response: [AppView[]](types.md#appview).

### GET /api/v2/apps/:fullname

Returns an app.

Arguments: `fullname` path argument.

Payload: none.

Response: [AppView](types.md#appview).

### PUT /api/v2/apps/:fullname

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

### DELETE /api/v2/apps/:fullname

Deletes an app.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Actions

### GET /api/v2/actions

Returns actions.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project filter. |
| `workspace` | Query | Optional workspace filter. |

Payload: none.

Response: [ActionView[]](types.md#actionview).

### GET /api/v2/actions/:fullname

Returns an action.

Arguments: `fullname` path argument.

Payload: none.

Response: [ActionView](types.md#actionview).

### PUT /api/v2/actions/:fullname

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

### DELETE /api/v2/actions/:fullname

Deletes an action.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/v2/blueprints

Returns blueprints.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `app` | Query | Optional app fullname filter. |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: none.

Response: [BlueprintView[]](types.md#blueprintview).

### GET /api/v2/blueprints/:fullname

Returns a blueprint.

Arguments: `fullname` path argument.

Payload: none.

Response: [BlueprintView](types.md#blueprintview).

### PUT /api/v2/blueprints/:fullname

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

### DELETE /api/v2/blueprints/:fullname

Deletes a blueprint.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Types

### GET /api/v2/types

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

### GET /api/v2/types/:fullname

Returns a shared type.

Arguments: `fullname` path argument.

Payload: none.

Response: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/v2/types/:fullname

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

### DELETE /api/v2/types/:fullname

Deletes a shared type.

Arguments: `fullname` path argument.

Payload: none.

Response: [OperationResult](types.md#operationresult).
