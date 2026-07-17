# Templates API

Os endpoints Template gerem o root template do project, groups, topics e rules.

## GET /api/projects/:fullname/templates

Devolve os templates do project.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: nenhum.

Resposta: [ProjectTemplate[]](types.md#projecttemplate).

## GET /api/projects/:fullname/template

Devolve o root template do project.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload: nenhum.

Resposta: [ProjectTemplate](types.md#projecttemplate), ou not found.

## POST /api/projects/:fullname/templates

Cria um template/group para o project.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `project` | Sim | Project fullname. |
| `schema` | Sim | Template inputs schema. |
| `groups` | Sim | Array de template groups. |
| `topics` | Sim | Array de topics. |
| `rules` | Sim | Array de rules que ligam topics a triggers. |
| `meta.title` | Sim | Template title. |
| `meta.description` | Sim | Template description. |

Resposta: [ProjectTemplate](types.md#projecttemplate).

## GET /api/projects/:fullname/templates/:id

Devolve um template.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: nenhum.

Resposta: [ProjectTemplate](types.md#projecttemplate).

## PUT /api/projects/:fullname/templates/:id

Atualiza um template.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: mesma estrutura de `POST /api/projects/:fullname/templates`.

Resposta: [ProjectTemplate](types.md#projecttemplate).

## DELETE /api/projects/:fullname/templates/:id

Elimina um template.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## Detalhes do payload de template

### groups

Cada group:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Group name. |
| `meta.title` | Sim | Título visível. |
| `meta.description` | Sim | Descrição. |

### topics

Cada topic:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `name` | Sim | Topic name. |
| `group` | Sim | Group name/fullname. |
| `selectedByDefault` | Sim | Indica se o topic é selecionado por padrão no subscription wizard. |
| `meta.title` | Sim | Título visível. |
| `meta.description` | Não | Descrição. |

### rules

Cada rule:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `id` | Sim | Rule id. |
| `trigger` | Sim | Trigger fullname. |
| `topic` | Sim | Topic name. |
| `inputs` | Não | Static input mapping ou `null`. |
| `policy` | Não | `{ type: "filter" | "monitor", key? }` ou `null`. |
| `conditions` | Não | Conditions object ou `null`. |
| `deprecated` | Sim | Indica se a rule está deprecated. |
| `requiredValues` | Sim | Input keys exigidos por esta rule. |
