# Templates API

Los endpoints Template gestionan el root template del project, groups, topics y rules.

## GET /api/projects/:fullname/templates

Devuelve los templates del project.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: ninguno.

Respuesta: [ProjectTemplate[]](types.md#projecttemplate).

## GET /api/projects/:fullname/template

Devuelve el root template del project.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: ninguno.

Respuesta: [ProjectTemplate](types.md#projecttemplate), o not found.

## POST /api/projects/:fullname/templates

Crea un template/group para el project.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `project` | Sí | Project fullname. |
| `schema` | Sí | Template inputs schema. |
| `groups` | Sí | Array de template groups. |
| `topics` | Sí | Array de topics. |
| `rules` | Sí | Array de rules que vinculan topics con triggers. |
| `meta.title` | Sí | Template title. |
| `meta.description` | Sí | Template description. |

Respuesta: [ProjectTemplate](types.md#projecttemplate).

## GET /api/projects/:fullname/templates/:id

Devuelve un template.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: ninguno.

Respuesta: [ProjectTemplate](types.md#projecttemplate).

## PUT /api/projects/:fullname/templates/:id

Actualiza un template.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: misma estructura que `POST /api/projects/:fullname/templates`.

Respuesta: [ProjectTemplate](types.md#projecttemplate).

## DELETE /api/projects/:fullname/templates/:id

Elimina un template.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).

## Detalles del payload de template

### groups

Cada group:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Group name. |
| `meta.title` | Sí | Título visible. |
| `meta.description` | Sí | Descripción. |

### topics

Cada topic:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `name` | Sí | Topic name. |
| `group` | Sí | Group name/fullname. |
| `selectedByDefault` | Sí | Indica si el topic se selecciona por defecto en el subscription wizard. |
| `meta.title` | Sí | Título visible. |
| `meta.description` | No | Descripción. |

### rules

Cada rule:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `id` | Sí | Rule id. |
| `trigger` | Sí | Trigger fullname. |
| `topic` | Sí | Topic name. |
| `inputs` | No | Static input mapping o `null`. |
| `policy` | No | `{ type: "filter" | "monitor", key? }` o `null`. |
| `conditions` | No | Conditions object o `null`. |
| `deprecated` | Sí | Indica si la rule está deprecated. |
| `requiredValues` | Sí | Input keys requeridos por esta rule. |
