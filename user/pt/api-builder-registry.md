# Apps, Actions, Blueprints e Types API

Estes endpoints descrevem o builder/registry layer: apps, actions, blueprints e shared types. São usados para service integrations e definições reutilizáveis de resource/action.

## Apps

### GET /api/v2/apps

Devolve apps.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project fullname. |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: nenhum.

Resposta: [AppView[]](types.md#appview).

### GET /api/v2/apps/:fullname

Devolve uma app.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [AppView](types.md#appview).

### PUT /api/v2/apps/:fullname

Cria ou atualiza uma app.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | App name. |
| `fullname` | Sim | App fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `url` | Sim | App URL. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |

Resposta: [AppView](types.md#appview).

### DELETE /api/v2/apps/:fullname

Elimina uma app.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## Actions

### GET /api/v2/actions

Devolve actions.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project. |
| `workspace` | Query | Filtro opcional por workspace. |

Payload: nenhum.

Resposta: [ActionView[]](types.md#actionview).

### GET /api/v2/actions/:fullname

Devolve uma action.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [ActionView](types.md#actionview).

### PUT /api/v2/actions/:fullname

Cria ou atualiza uma action.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Action name. |
| `fullname` | Sim | Action fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `backend` | Sim | Action backend definition. |
| `values` | Sim | Action values schema. |
| `overrides` | Sim | Campos que a action pode sobrescrever. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |
| `meta` | Sim | Action metadata. |

Resposta: [ActionView](types.md#actionview).

### DELETE /api/v2/actions/:fullname

Elimina uma action.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## Blueprints

### GET /api/v2/blueprints

Devolve blueprints.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `app` | Query | Filtro opcional por app fullname. |
| `project` | Query | Filtro opcional por project fullname. |
| `workspace` | Query | Filtro opcional por workspace fullname. |

Payload: nenhum.

Resposta: [BlueprintView[]](types.md#blueprintview).

### GET /api/v2/blueprints/:fullname

Devolve um blueprint.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [BlueprintView](types.md#blueprintview).

### PUT /api/v2/blueprints/:fullname

Cria ou atualiza um blueprint.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Blueprint name. |
| `fullname` | Sim | Blueprint fullname. |
| `app` | Sim | App fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `type` | Sim | `plain` ou `external`. |
| `data` | Não | Object spec. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |
| `meta.title` | Não | Título visível. |
| `meta.description` | Não | Descrição. |

Resposta: [BlueprintView](types.md#blueprintview).

### DELETE /api/v2/blueprints/:fullname

Elimina um blueprint.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## Types

### GET /api/v2/types

Devolve shared types.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `project` | Query | Filtro opcional por project. |
| `workspace` | Query | Filtro opcional por workspace. |
| `status` | Query | `not_tested`, `ready` ou `broken`. |
| `pallet` | Query | Filtro opcional por pallet. |
| `kind` | Query | `event`, `call`, `transaction` ou `timer`. |
| `dataSource` | Query | Filtro opcional por data source. |

Payload: nenhum.

Resposta: [SharedTypeView[]](types.md#sharedtypeview).

### GET /api/v2/types/:fullname

Devolve um shared type.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [SharedTypeView](types.md#sharedtypeview).

### PUT /api/v2/types/:fullname

Cria ou atualiza um shared type.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Shared type collection name. |
| `fullname` | Sim | Shared type fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `schemas` | Sim | Objeto com named type schemas. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |
| `meta` | Não | Metadata object. |

Resposta: [SharedTypeView](types.md#sharedtypeview).

### DELETE /api/v2/types/:fullname

Elimina um shared type.

Argumentos: `fullname` como path argument.

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).
