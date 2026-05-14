# Resources API

Resources endpoints 用于管理 delivery resources 和 external setup flow。

## GET /api/v2/resources

返回 resources。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `workspace` | Query | 可选 workspace fullname 过滤器。 |
| `project` | Query | 可选 project fullname 过滤器。 |

Payload: 无。

响应：[ResourceView[]](types.md#resourceview)。

## GET /api/v2/resources/:fullname

返回一个 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。 |

Payload: 无。

响应：[ResourceView](types.md#resourceview)。

## PUT /api/v2/resources/:fullname

创建或更新 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。必须与 `payload.fullname` 一致。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Resource 名称。 |
| `fullname` | 是 | Resource fullname。 |
| `workspace` | 是 | Workspace fullname。 |
| `project` | 否 | 如果 resource 绑定到 project，则为 project fullname。 |
| `blueprint` | 是 | 定义 setup/action behavior 的 blueprint fullname。 |
| `data` | 否 | Resource-specific data。 |
| `tags` | 否 | Tags。 |
| `labels` | 否 | Labels。 |
| `meta.title` | 否 | 可见标题。 |

响应：[ResourceView](types.md#resourceview)。

## DELETE /api/v2/resources/:fullname

删除 resource。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `fullname` | Path | Resource fullname。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。

## GET /api/v2/resources/external/:token

通过 token 打开 external resource setup。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | External setup token。 |

Payload: 无。

响应：[ExternalResourceView](types.md#externalresourceview)。

## POST /api/v2/resources/external/:token

发送 external resource setup payload。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `token` | Path | External setup token。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `transform` | 是 | 对象或 `null`，resource/app-specific transform/setup result。 |

响应：[OperationResult](types.md#operationresult)。
