# Templates API

Template endpoints 用于管理 project 的 root template、groups、topics 和 rules。

## GET /api/v2/projects/:fullname/templates

返回 project templates。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |

Payload: 无。

响应：[ProjectTemplate[]](types.md#projecttemplate)。

## GET /api/v2/projects/:fullname/template

返回 project root template。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |

Payload: 无。

响应：[ProjectTemplate](types.md#projecttemplate)，或 not found。

## POST /api/v2/projects/:fullname/templates

为 project 创建 template/group。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `project` | 是 | Project fullname。 |
| `schema` | 是 | Template inputs schema。 |
| `groups` | 是 | Template groups 数组。 |
| `topics` | 是 | Topics 数组。 |
| `rules` | 是 | 将 topics 绑定到 triggers 的 rules 数组。 |
| `meta.title` | 是 | Template title。 |
| `meta.description` | 是 | Template description。 |

响应：[ProjectTemplate](types.md#projecttemplate)。

## GET /api/v2/projects/:fullname/templates/:id

返回 template。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |
| `id` | Path | Template id。 |

Payload: 无。

响应：[ProjectTemplate](types.md#projecttemplate)。

## PUT /api/v2/projects/:fullname/templates/:id

更新 template。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |
| `id` | Path | Template id。 |

Payload: 与 `POST /api/v2/projects/:fullname/templates` 相同结构。

响应：[ProjectTemplate](types.md#projecttemplate)。

## DELETE /api/v2/projects/:fullname/templates/:id

删除 template。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Project fullname。 |
| `id` | Path | Template id。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## Template Payload Details

### groups

每个 group:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Group name。 |
| `meta.title` | 是 | 可见标题。 |
| `meta.description` | 是 | 描述。 |

### topics

每个 topic:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Topic name。 |
| `group` | 是 | Group name/fullname。 |
| `selectedByDefault` | 是 | Topic 是否在 subscription wizard 中默认选中。 |
| `meta.title` | 是 | 可见标题。 |
| `meta.description` | 否 | 描述。 |

### rules

每个 rule:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | Rule id。 |
| `trigger` | 是 | Trigger fullname。 |
| `topic` | 是 | Topic name。 |
| `inputs` | 否 | Static input mapping 或 `null`。 |
| `policy` | 否 | `{ type: "filter" | "monitor", key? }` 或 `null`。 |
| `conditions` | 否 | Conditions object 或 `null`。 |
| `deprecated` | 是 | Rule 是否 deprecated。 |
| `requiredValues` | 是 | 此 rule 需要的 input keys。 |
