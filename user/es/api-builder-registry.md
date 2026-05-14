# Apps, Actions, Blueprints y Types API

Estos endpoints describen el builder/registry layer: apps, actions, blueprints y shared types. Se usan para service integrations y definiciones reutilizables de resource/action.

## Apps

### GET /api/v2/apps

Devuelve apps.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project fullname. |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: ninguno.

Respuesta: [AppView[]](types.md#appview).

### GET /api/v2/apps/:fullname

Devuelve una app.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [AppView](types.md#appview).

### PUT /api/v2/apps/:fullname

Crea o actualiza una app.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | App name. |
| `fullname` | Sí | App fullname. |
| `project` | Sí | Project fullname. |
| `workspace` | Sí | Workspace fullname. |
| `url` | Sí | App URL. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |

Respuesta: [AppView](types.md#appview).

### DELETE /api/v2/apps/:fullname

Elimina una app.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## Actions

### GET /api/v2/actions

Devuelve actions.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project. |
| `workspace` | Query | Filtro opcional por workspace. |

Payload: ninguno.

Respuesta: [ActionView[]](types.md#actionview).

### GET /api/v2/actions/:fullname

Devuelve una action.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [ActionView](types.md#actionview).

### PUT /api/v2/actions/:fullname

Crea o actualiza una action.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Action name. |
| `fullname` | Sí | Action fullname. |
| `project` | Sí | Project fullname. |
| `workspace` | Sí | Workspace fullname. |
| `backend` | Sí | Action backend definition. |
| `values` | Sí | Action values schema. |
| `overrides` | Sí | Campos que la action puede sobrescribir. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta` | Sí | Action metadata. |

Respuesta: [ActionView](types.md#actionview).

### DELETE /api/v2/actions/:fullname

Elimina una action.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/v2/blueprints

Devuelve blueprints.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `app` | Query | Filtro opcional por app fullname. |
| `project` | Query | Filtro opcional por project fullname. |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: ninguno.

Respuesta: [BlueprintView[]](types.md#blueprintview).

### GET /api/v2/blueprints/:fullname

Devuelve un blueprint.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [BlueprintView](types.md#blueprintview).

### PUT /api/v2/blueprints/:fullname

Crea o actualiza un blueprint.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Blueprint name. |
| `fullname` | Sí | Blueprint fullname. |
| `app` | Sí | App fullname. |
| `project` | Sí | Project fullname. |
| `workspace` | Sí | Workspace fullname. |
| `type` | Sí | `plain` o `external`. |
| `data` | No | Object spec. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta.title` | No | Título visible. |
| `meta.description` | No | Descripción. |

Respuesta: [BlueprintView](types.md#blueprintview).

### DELETE /api/v2/blueprints/:fullname

Elimina un blueprint.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## Types

### GET /api/v2/types

Devuelve shared types.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project. |
| `workspace` | Query | Filtro opcional por workspace. |
| `status` | Query | `not_tested`, `ready` o `broken`. |
| `pallet` | Query | Filtro opcional por pallet. |
| `kind` | Query | `event`, `call`, `transaction` o `timer`. |
| `dataSource` | Query | Filtro opcional por data source. |

Payload: ninguno.

Respuesta: [SharedTypeView[]](types.md#sharedtypeview).

### GET /api/v2/types/:fullname

Devuelve un shared type.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/v2/types/:fullname

Crea o actualiza un shared type.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Shared type collection name. |
| `fullname` | Sí | Shared type fullname. |
| `project` | Sí | Project fullname. |
| `workspace` | Sí | Workspace fullname. |
| `schemas` | Sí | Objeto con named type schemas. |
| `tags` | No | Tags. |
| `labels` | No | Labels. |
| `meta` | No | Metadata object. |

Respuesta: [SharedTypeView](types.md#sharedtypeview).

### DELETE /api/v2/types/:fullname

Elimina un shared type.

Argumentos: `fullname` como path argument.

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).
