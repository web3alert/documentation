# Templates API

Endpoints Templates управляют root template project, groups, topics и rules.

## GET /api/v2/projects/:fullname/templates

Возвращает templates project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса: нет.

Ответ: [ProjectTemplate[]](types.md#projecttemplate).

## GET /api/v2/projects/:fullname/template

Возвращает root template project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса: нет.

Ответ: [ProjectTemplate](types.md#projecttemplate) или not found.

## POST /api/v2/projects/:fullname/templates

Создает template/group для project.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `project` | Да | Project fullname. |
| `schema` | Да | Template inputs schema. |
| `groups` | Да | Массив template groups. |
| `topics` | Да | Массив topics. |
| `rules` | Да | Массив rules, связывающих topics с triggers. |
| `meta.title` | Да | Название template. |
| `meta.description` | Да | Описание template. |

Ответ: [ProjectTemplate](types.md#projecttemplate).

## GET /api/v2/projects/:fullname/templates/:id

Возвращает template.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Тело запроса: нет.

Ответ: [ProjectTemplate](types.md#projecttemplate).

## PUT /api/v2/projects/:fullname/templates/:id

Обновляет template.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Тело запроса: такая же структура, как в `POST /api/v2/projects/:fullname/templates`.

Ответ: [ProjectTemplate](types.md#projecttemplate).

## DELETE /api/v2/projects/:fullname/templates/:id

Удаляет template.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Project fullname. |
| `id` | Path | Template id. |

Тело запроса: нет.

Ответ: [OperationResult](types.md#operationresult).

## Детали тела запроса Template

### groups

Каждая group:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя group. |
| `meta.title` | Да | Видимое название. |
| `meta.description` | Да | Описание. |

### topics

Каждый topic:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя topic. |
| `group` | Да | Group name/fullname. |
| `selectedByDefault` | Да | Признак того, что topic выбран по умолчанию в subscription wizard. |
| `meta.title` | Да | Видимое название. |
| `meta.description` | Нет | Описание. |

### rules

Каждая rule:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `id` | Да | Rule id. |
| `trigger` | Да | Trigger fullname. |
| `topic` | Да | Topic name. |
| `inputs` | Нет | Static input mapping или `null`. |
| `policy` | Нет | `{ type: "filter" | "monitor", key? }` или `null`. |
| `conditions` | Нет | Conditions object или `null`. |
| `deprecated` | Да | Признак устаревшей rule. |
| `requiredValues` | Да | Input keys, обязательные для этой rule. |
