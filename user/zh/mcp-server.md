# MCP Server

MCP 适用于 `Free`、`Advanced` 和 `Pro` tiers。

- 使用 `https://web3alert.io/mcp/agent` 订阅已解码的链上事件，并通过 webhook 接收这些事件。
- 使用 `https://web3alert.io/mcp` 访问完整工具集，在 Web3alert marketplace 中创建和编辑 projects、triggers、templates、subscriptions、resources 和 data sources，并读取诊断数据。

## Token

连接需要来自 [Account parameters](account.md#personal-access-token) 的 personal access token。

Token 让 MCP server 可以代表当前 account 访问 Web3alert API。可用操作级别取决于 account tier 和用户在 workspace 中的 roles。

每个 HTTP 请求都必须通过 `Authorization: Bearer <token>` header 发送 token。Server 不接受 query string 或请求体中的 token。

Token 撤销后，API 会立即拒绝该 token。MCP 仍有验证缓存时，到达 API 的 agent 工具调用会返回 `access_denied`。使用缓存的验证结果时，`initialize` 和 `tools/list` 仍可能成功，最长持续 30 秒。MCP 重新验证已撤销的 token 时会返回 HTTP `401`。

| HTTP 状态码 | 处理方式 |
| --- | --- |
| `401` | Bearer token 缺失、无效、无法识别或已撤销。请通过 header 发送有效的 token。如果没有 token，或 server 已无法识别该 token，请获取新 token。 |
| `403` | Server 拒绝了 client 的来源（`forbidden_origin`），或 account 未通过 MCP 访问检查（`mcp_access_denied`）。请根据错误检查 client 的 `Origin` header 或 account 信息。 |
| `429` | API 对 token 验证进行了限流。请等待 `Retry-After` 指定的时间后重试。 |
| `503` | Token 验证暂时不可用。请等待 `Retry-After` 指定的时间，再用同一个 token 重试。 |

默认情况下，每个 server 进程允许每个 account 每分钟调用工具 120 次。两个 endpoints 和该 account 的所有 tokens 共享此限额。达到限额后，工具会返回 `rate_limited`，并在 `retryAfter` 中给出需要等待的秒数。

## Agent Endpoint

Agent 工具在 account 当前选中的 workspace 中执行操作。如需让下一次调用使用其他 workspace，请在 Web3alert 应用中切换。

| 工具 | 用途 |
| --- | --- |
| `get_account` | 返回账户 ID、名称、套餐、以 EUR 计的余额、套餐限制，以及可用的当前工作区启用订阅数和订阅总数。 |
| `find_triggers` | 搜索已发布的目录和当前 workspace 中的 triggers。 |
| `get_trigger` | 查看 trigger 的运行时 inputs、投递的事件字段以及可在 `conditions` 中使用的字段。 |
| `list_webhooks` | 列出 workspace 中已注册的 webhooks 的 `fullname`、名称和 URL。 |
| `add_webhook` | 注册使用 HTTPS 且不含凭据的 Webhook。如果检查时发现工作区已有同名资源，工具会拒绝请求并返回 `webhook_exists`。 |
| `create_subscription` | 创建 subscription，将一个 trigger 的事件投递到一个 webhook。请提供必需的 inputs，也可通过 `conditions` 筛选事件。 |
| `list_subscriptions` | 列出 subscriptions 的 ID、标题、状态、triggers、webhooks 和创建时间。 |
| `set_subscription_state` | 暂停（`off`）或恢复（`on`）subscription。 |
| `remove_subscription` | 删除 subscription 并停止投递。 |
| `get_delivery_log` | 查看工作区或单个订阅的投递结果。 告警历史按工作区访问列表中第一个具有所有者角色的账户的套餐检查。如果没有这样的账户，API 会检查请求方账户的套餐。如果该套餐不含历史记录，工具返回 `not_in_plan`。 |

达到 tier 的 subscriptions 限额时，`create_subscription` 可能返回 `subscription_limit_reached` 错误。成功创建或恢复投递（调用 `set_subscription_state` 并传入 `on`）时，仍可能返回 `state: "blocked"` 和 `blockedReason: "subscription_limit_reached"`。请先确认返回的 `state` 为 `on`，再判断投递是否已启用。

通过此 endpoint，agent 无法创建、编辑或删除 triggers、projects、templates 或 data sources。Agent 也无法更改账单、套餐或付款、管理 tokens、删除 accounts 或 workspaces、切换 workspace、将 subscriptions 设为 `blocked`，或管理 webhooks 之外的 resources。

### Claude Code

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
```

### Claude Desktop 和 Cursor

在 Claude Desktop 中，将配置项添加到 `claude_desktop_config.json` 的 `mcpServers` 中。在 Cursor 中，请使用个人配置文件 `~/.cursor/mcp.json`。

```json
{
  "mcpServers": {
    "web3alert-agent": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp/agent",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### VS Code

如果由编辑器管理连接，请将配置项添加到 `.vscode/mcp.json` 的 `servers` 中，并确保 VS Code 进程的环境中有 `WEB3ALERT_TOKEN`。

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_TOKEN}"
      }
    }
  }
}
```

## Remote MCP Endpoint

使用同一个 Claude Desktop 或 Cursor 配置文件。对于 [VS Code](#vs-code)，使用同一份 `servers` 示例，并将 URL 改为 `https://web3alert.io/mcp`。

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
