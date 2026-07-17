# Templates API

Template endpoints manage the project root template, groups, topics, and rules.

## GET /api/projects/:fullname/templates

Returns project templates.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: none.

Response: [ProjectTemplate[]](types.md#projecttemplate).

## GET /api/projects/:fullname/template

Returns the project root template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: none.

Response: [ProjectTemplate](types.md#projecttemplate), or not found.

## POST /api/projects/:fullname/templates

Creates a template/group for the project.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project fullname. |
| `schema` | Yes | Template inputs schema. |
| `groups` | Yes | Array of template groups. |
| `topics` | Yes | Array of topics. |
| `rules` | Yes | Array of rules binding topics to triggers. |
| `meta.title` | Yes | Template title. |
| `meta.description` | Yes | Template description. |

Response: [ProjectTemplate](types.md#projecttemplate).

## GET /api/projects/:fullname/templates/:id

Returns a template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: none.

Response: [ProjectTemplate](types.md#projecttemplate).

## PUT /api/projects/:fullname/templates/:id

Updates a template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: same shape as `POST /api/projects/:fullname/templates`.

Response: [ProjectTemplate](types.md#projecttemplate).

## DELETE /api/projects/:fullname/templates/:id

Deletes a template.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: none.

Response: [OperationResult](types.md#operationresult).

## Template Payload Details

### groups

Each group:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Group name. |
| `meta.title` | Yes | Visible title. |
| `meta.description` | Yes | Description. |

### topics

Each topic:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Topic name. |
| `group` | Yes | Group name/fullname. |
| `selectedByDefault` | Yes | Whether the topic is selected by default in the subscription wizard. |
| `meta.title` | Yes | Visible title. |
| `meta.description` | No | Description. |

### rules

Each rule:

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Rule id. |
| `trigger` | Yes | Trigger fullname. |
| `topic` | Yes | Topic name. |
| `inputs` | No | Static input mapping or `null`. |
| `policy` | No | `{ type: "filter" | "monitor", key? }` or `null`. |
| `conditions` | No | Conditions object or `null`. |
| `deprecated` | Yes | Whether the rule is deprecated. |
| `requiredValues` | Yes | Input keys required by this rule. |
