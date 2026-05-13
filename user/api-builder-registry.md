# Apps, Actions, Blueprints and Types API

Эти endpoints описывают builder/registry layer: apps, actions, blueprints and shared types. Они используются для service integrations и reusable resource/action definitions.

## Apps

### GET /api/v2/apps

Возвращает apps.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: нет.

Response: array of apps.

### GET /api/v2/apps/:fullname

Возвращает app.

Arguments: `fullname` path argument.

Payload: нет.

Response: app object.

### PUT /api/v2/apps/:fullname

Создает или обновляет app.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | App name. |
| `fullname` | Да | App fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `url` | Да | App URL. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |

Response: saved app.

### DELETE /api/v2/apps/:fullname

Удаляет app.

Arguments: `fullname` path argument.

Payload: нет.

Response: operation result.

## Actions

### GET /api/v2/actions

Возвращает actions.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project filter. |
| `workspace` | Query | Optional workspace filter. |

Payload: нет.

Response: array of actions.

### GET /api/v2/actions/:fullname

Возвращает action.

Arguments: `fullname` path argument.

Payload: нет.

Response: action object.

### PUT /api/v2/actions/:fullname

Создает или обновляет action.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Action name. |
| `fullname` | Да | Action fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `backend` | Да | Action backend definition. |
| `values` | Да | Action values schema. |
| `overrides` | Да | Fields that action can override. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta` | Да | Action metadata. |

Response: saved action.

### DELETE /api/v2/actions/:fullname

Удаляет action.

Arguments: `fullname` path argument.

Payload: нет.

Response: operation result.

## Blueprints

### GET /api/v2/blueprints

Возвращает blueprints.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `app` | Query | Optional app fullname filter. |
| `project` | Query | Optional project fullname filter. |
| `workspace` | Query | Optional workspace fullname filter. |

Payload: нет.

Response: array of blueprints.

### GET /api/v2/blueprints/:fullname

Возвращает blueprint.

Arguments: `fullname` path argument.

Payload: нет.

Response: blueprint object.

### PUT /api/v2/blueprints/:fullname

Создает или обновляет blueprint.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Blueprint name. |
| `fullname` | Да | Blueprint fullname. |
| `app` | Да | App fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `type` | Да | `plain` или `external`. |
| `data` | Нет | Object spec. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta.title` | Нет | Visible title. |
| `meta.description` | Нет | Description. |

Response: saved blueprint.

### DELETE /api/v2/blueprints/:fullname

Удаляет blueprint.

Arguments: `fullname` path argument.

Payload: нет.

Response: operation result.

## Types

### GET /api/v2/types

Возвращает shared types.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Optional project filter. |
| `workspace` | Query | Optional workspace filter. |
| `status` | Query | `not_tested`, `ready` or `broken`. |
| `pallet` | Query | Optional pallet filter. |
| `kind` | Query | `event`, `call`, `transaction` or `timer`. |
| `dataSource` | Query | Optional data source filter. |

Payload: нет.

Response: array of shared types.

### GET /api/v2/types/:fullname

Возвращает shared type.

Arguments: `fullname` path argument.

Payload: нет.

Response: shared type object.

### PUT /api/v2/types/:fullname

Создает или обновляет shared type.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Shared type collection name. |
| `fullname` | Да | Shared type fullname. |
| `project` | Да | Project fullname. |
| `workspace` | Да | Workspace fullname. |
| `schemas` | Да | Object with named type schemas. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta` | Нет | Metadata object. |

Response: saved shared type.

### DELETE /api/v2/types/:fullname

Deletes shared type.

Arguments: `fullname` path argument.

Payload: нет.

Response: operation result.
