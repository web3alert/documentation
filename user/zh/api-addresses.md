# Addresses API

Address book endpoints 用于管理可在 workspace/account 中复用的 addresses。

## GET /api/addresses

返回 address book。

参数：无。

Payload: 无。

响应：[AddressEntry[]](types.md#addressentry)。

## POST /api/addresses

创建 address book entry。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `type` | 是 | `plain`、`ss58`、`evm`、`bitcoin` 或 `cosmos`。 |
| `address` | 是 | Address 值。 |
| `alias` | 是 | 人类可读 alias。 |

响应：[AddressEntry](types.md#addressentry)。

## PUT /api/addresses/:id

更新 address book entry。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Address entry id。 |

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `type` | 是 | Address 类型。 |
| `address` | 是 | Address 值。 |
| `alias` | 是 | 人类可读 alias。 |

响应：[AddressEntry](types.md#addressentry)。

## DELETE /api/addresses/:id

删除 address book entry。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `id` | Path | Address entry id。 |

Payload: 无。

响应：[OperationResult](types.md#operationresult)。
