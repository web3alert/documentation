# Templates API

Template endpoints управляют root template project, groups, topics and rules.

## GET /api/v2/projects/:fullname/templates

Возвращает templates project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: нет.

Response: array of templates.

## GET /api/v2/projects/:fullname/template

Возвращает root template project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: нет.

Response: root template or not found.

## POST /api/v2/projects/:fullname/templates

Создает template/group for project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `schema` | Да | Template inputs schema. |
| `groups` | Да | Array of template groups. |
| `topics` | Да | Array of topics. |
| `rules` | Да | Array of rules binding topics to triggers. |
| `meta.title` | Да | Template title. |
| `meta.description` | Да | Template description. |

Response: created template.

## GET /api/v2/projects/:fullname/templates/:id

Возвращает template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: нет.

Response: template.

## PUT /api/v2/projects/:fullname/templates/:id

Обновляет template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: same shape as `POST /api/v2/projects/:fullname/templates`.

Response: updated template.

## DELETE /api/v2/projects/:fullname/templates/:id

Удаляет template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: нет.

Response: operation result.

## Template Payload Details

### groups

Each group:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Group name. |
| `meta.title` | Да | Visible title. |
| `meta.description` | Да | Description. |

### topics

Each topic:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Да | Topic name. |
| `group` | Да | Group name/fullname. |
| `selectedByDefault` | Да | Whether topic is selected by default in subscription wizard. |
| `meta.title` | Да | Visible title. |
| `meta.description` | Нет | Description. |

### rules

Each rule:

| Field | Required | Description |
| --- | --- | --- |
| `id` | Да | Rule id. |
| `trigger` | Да | Trigger fullname. |
| `topic` | Да | Topic name. |
| `inputs` | Нет | Static input mapping or `null`. |
| `policy` | Нет | `{ type: "filter" | "monitor", key? }` or `null`. |
| `conditions` | Нет | Conditions object or `null`. |
| `deprecated` | Да | Whether rule is deprecated. |
| `requiredValues` | Да | Input keys required by this rule. |
