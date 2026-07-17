# 链接 API

链接 endpoints 为 Web3alert 站内目标创建短 key，并通过 key 解析目标。
两个 endpoint 都是公开的，不需要 Bearer token。

## POST /api/links

创建持久短链接。
<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->

身份验证：无。

参数：无。

Payload:

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `uri` | 是 | Web3alert 站内路径。必须以 `/` 开头，且不得以 `/link/` 开头；不接受外部绝对 URL。 |

前端重定向前缀 `/link/` 为保留路径，不是 API endpoint，也不能作为目标
提交。

```http
POST /api/links
Content-Type: application/json

{
  "uri": "/common.ethereum"
}
```

响应：HTTP 200 OK，正文为 `Link` 对象。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `key` | 是 | 生成的短链接 key。 |
| `uri` | 是 | 已保存的 Web3alert 站内路径。 |

```json
{
  "key": "AbC123",
  "uri": "/common.ethereum"
}
```

无效的 `uri` 返回 HTTP 400 Bad Request，错误消息为 `invalid uri`。

## GET /api/links/:key

解析短链接 key。
<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->

身份验证：无。

参数：

| 参数 | 位置 | 说明 |
| --- | --- | --- |
| `key` | Path | 生成的短链接 key。 |

Payload: 无。

响应：HTTP 200 OK，正文为已保存的 `Link` 对象。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `key` | 是 | 短链接 key。 |
| `uri` | 是 | 已保存的 Web3alert 站内路径。 |

如果 key 不存在，endpoint 返回 HTTP 400 Bad Request，错误消息为
`shortcut not found`。
