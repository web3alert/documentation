# MCP Server

Web3alert 提供三个 Streamable HTTP 路径。

| 路径 | 工具集 | 身份验证 |
| --- | --- | --- |
| `/mcp/agent` | [14 个工具](#agent-endpoint)，涵盖账户、账单、订阅与投递 | 可公开发现工具。调用需要 Bearer 密钥。 |
| `/mcp/agent/build` | 19 个工具，包括上述 14 个工具和 [5 个构建工具](#build-endpoint) | 可公开发现工具。调用需要 Bearer 密钥。构建工具需要 Advanced 或 Pro。 |
| `/mcp` | [完整的创作工具集](#remote-mcp-endpoint) | 每个请求都需要 Bearer 密钥。 |

MCP Registry 中的 `io.web3alert/agent` 条目将 `Authorization` 请求头标记为可选。服务器详情见 [MCP 公开仓库](https://github.com/web3alert/mcp)。

## 身份验证

两个智能体路径均可在没有令牌时接受单独的 `initialize`、`ping`、`tools/list` 和通知消息。工具调用和批量请求需要 `Authorization: Bearer <agent-key>`。每批最多 20 条消息。完整的创作路径在发现工具时也需要此请求头。三个路径都会验证收到的凭据，凭据无效时返回 HTTP `401`。

在 [Agents 页面](https://web3alert.io/agents)创建密钥，或[用钱包注册](agents.md)。密钥代表账户在绑定的工作区执行操作。可用操作取决于密钥权限、适用套餐和账户在该工作区的权限。

Token 撤销后，API 会立即拒绝该 token。MCP 仍有验证缓存时，到达 API 的 agent 工具调用会返回 `access_denied`。携带已撤销 token 的 `initialize` 和 `tools/list` 请求在验证结果仍有缓存时可能成功，最长持续 30 秒。MCP 重新验证已撤销的 token 时会返回 HTTP `401`。

| HTTP 状态码 | 处理方式 |
| --- | --- |
| `401` | 缺少必需的 Bearer token，或所提供的 token 无效、无法识别或已撤销。请通过 header 发送有效的 token。如果没有 token，或 server 已无法识别该 token，请获取新 token。 |
| `403` | Server 拒绝了 client 的来源（`forbidden_origin`），或 account 未通过 MCP 访问检查（`mcp_access_denied`）。请根据错误检查 client 的 `Origin` header 或 account 信息。 |
| `429` | API 对 token 验证进行了限流。请等待 `Retry-After` 指定的时间后重试。 |
| `503` | Token 验证暂时不可用。请等待 `Retry-After` 指定的时间，再用同一个 token 重试。 |

每个服务器进程默认允许每个账户每分钟调用工具 120 次。三个端点和该账户的所有凭据共用此额度。额度用完后，工具返回 `rate_limited`，并在 `retryAfter` 中给出等待秒数。

工具错误与 HTTP 身份验证错误独立返回。

| 工具错误 | 含义 |
| --- | --- |
| `insufficient_scope` | 密钥缺少所需权限。 |
| `key_not_allowed` | 操作需要账户会话。 |
| `spend_cap_exceeded` | 购买将超过该密钥的欧元月度支出上限。 |
| `not_in_plan` | 适用的工作区套餐不包含收件箱或投递历史。 |
| `plan_required` | 构建操作需要 Advanced 或 Pro 账户。 |

## 升级现有客户端

请通过请求头 `Authorization: Bearer <agent-key>` 发送密钥。`/mcp` 的每个请求都需要此请求头。服务器采用无状态模式。请从 URL 和请求体中移除凭据。

现有会话令牌可用到持有人退出登录或撤销令牌为止。

在使用 Web3alert 的 Claude Code 项目中运行以下命令。

1. 运行 `claude mcp list`，查看列表中是否有要替换的名称。运行 `claude mcp get web3alert` 或 `claude mcp get web3alert-agent` 查看所列条目的作用域。
2. 指定作用域来移除条目，例如运行 `claude mcp remove --scope user web3alert` 或 `claude mcp remove --scope local web3alert`。移除后，其他作用域的同名条目可能会出现在列表中。重复步骤 1 和 2，直到列表中不再出现该名称。
3. 运行对应端点的 `claude mcp add` 示例命令，添加新条目。

在 Claude Desktop、Cursor 和 VS Code 中，直接修改现有条目的 URL 和请求头。参见[远程端点配置示例](#remote-mcp-endpoint)。

## Agent Endpoint {#agent-endpoint}

工具在密钥绑定的工作区内运行。如需在其他工作区操作，请在该工作区创建密钥。

| 工具 | 用途 |
| --- | --- |
| `get_account` | 返回账户 ID、名称、套餐、欧元余额、套餐限制和可用的订阅计数，以及密钥权限、有效期、月度上限和本月支出。 |
| `get_topup_requirements` | 获取 5–500 欧元的 USDC 充值报价。使用自己的 x402 客户端和钱包付款。需要 `manage`。 |
| `buy_plan` | 使用欧元余额购买 Advanced 或 Pro，无自动续订。重试时沿用 `requestId`。需要 `spend`。 |
| `find_triggers` | 在公开目录中搜索 EVM 和 Substrate 链的触发器，也会搜索当前工作区中的触发器。 |
| `get_trigger` | 查看 trigger 的运行时 inputs、投递的事件字段以及可在 `conditions` 中使用的字段。 |
| `list_webhooks` | 列出 workspace 中已注册的 webhooks 的 `fullname`、名称和 URL。 `signed` 字段表示该 Webhook 是否有签名密钥。 |
| `add_webhook` | 注册使用 HTTPS 且不含凭据的 Webhook。如果检查时发现工作区已有同名资源，工具会拒绝请求并返回 `webhook_exists`。 签名密钥仅在 `add_webhook` 的回复中以 `signingSecret` 字段显示。之后轮换密钥会替换该端点所有接收方使用的密钥。 |
| `remove_webhook` | 按完整名称删除当前工作区的 Webhook。如果同一工作区有启用的订阅使用该 Webhook，则返回 `webhook_in_use`。需要 `manage`。 |
| `create_subscription` | 创建一个订阅并选择一个投递目标，`webhook` 或 `inbox: true`。传入必填输入及可选的 `conditions`。 |
| `list_subscriptions` | 列出 subscriptions 的 ID、标题、状态、triggers、webhooks 和创建时间。 |
| `set_subscription_state` | 暂停（`off`）或恢复（`on`）subscription。 |
| `remove_subscription` | 删除订阅。Webhook 重试会在约 10 秒内停止。在此期间到期的尝试仍可能发出。 |
| `read_events` | 在付费工作区从最旧的事件开始读取收件箱。轮询时将 `nextCursor` 作为 `after`。 `gap` 表示有事件超出保留范围。需要 `read`。 |
| `get_delivery_log` | 查看工作区或单个订阅的投递结果。 告警历史按工作区访问列表中第一个具有所有者角色的账户的套餐检查。如果没有这样的账户，API 会检查请求方账户的套餐。如果该套餐不含历史记录，工具返回 `not_in_plan`。 Webhook 渠道条目包含 `eventId` 和 `attempt`。`nextAttemptAt` 是写入该条目时为下一次尝试安排的时间，采用 ISO 格式。如果条目未记录已安排的重试，则为 `null`。 |

即使重试已经执行或取消，`nextAttemptAt` 也保持不变。要查看投递结果，请查找具有相同 `eventId` 的后续条目。如果订阅被暂停或删除导致重试停止，或重试已过期，Web3alert 不会写入最终条目，因此缺少最终条目时，无法确定投递结果或重试是否仍待执行。

`limits.maxSubscriptions` 限制账户在所有工作区内创建的非 Free 项目启用订阅数。Free 套餐的上限为 5 个。Free 项目的订阅不计入上限。

达到 tier 的 subscriptions 限额时，`create_subscription` 可能返回 `subscription_limit_reached` 错误。成功创建或恢复投递（调用 `set_subscription_state` 并传入 `on`）时，仍可能返回 `state: "blocked"` 和 `blockedReason: "subscription_limit_reached"`。请先确认返回的 `state` 为 `on`，再判断投递是否已启用。

使用[构建端点](#build-endpoint)根据链上事件创建私有触发器。

### Claude Code

```bash
printf 'Web3alert 智能体密钥： ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_KEY"
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
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```

### VS Code

如果由编辑器管理连接，请将配置项添加到 `.vscode/mcp.json` 的 `servers` 中，并确保 VS Code 进程的环境中有 `WEB3ALERT_KEY`。

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_KEY}"
      }
    }
  }
}
```

## 构建端点 {#build-endpoint}

使用相同的客户端设置和 Bearer 请求头连接 `https://web3alert.io/mcp/agent/build`。工具列表包括上述 14 个工具和以下 5 个工具。Free 账户可以发现这些工具，调用时会收到 `plan_required`。

| 工具 | 权限 | 功能 |
| --- | --- | --- |
| `find_contract` | `read` | 从合约 ABI、Solana IDL 或 Substrate 元数据查找准确的事件签名。EVM 结果还包含函数和可用的近期日志数量。 |
| `plan_trigger` | `manage` | 无需编写代码即可生成事件草稿。返回 `draftId`、完整名称预览、输入、可筛选字段、输出结构和有效期。 |
| `test_trigger` | `read` | 用近期样本测试草稿，或重放指定区块或 slot。 |
| `activate_trigger` | `manage` | 将最近一次测试匹配的草稿保存到智能体的私有项目。重试时沿用 `requestId`。可用返回的完整名称创建订阅。 |
| `remove_my_trigger` | `manage` | 删除该项目中的触发器。如果同一工作区有启用的订阅使用该触发器，则返回 `trigger_in_use`。 |

直接删除触发器或 Webhook 时，系统检查它所在工作区中已启用（`on`）的订阅。请先暂停或删除这些订阅，再重试。删除项目、工作区或账户会阻止受影响的订阅继续投递。其他工作区中订阅公开触发器的启用订阅不会阻止直接删除该触发器。

## Remote MCP Endpoint

用 `https://web3alert.io/mcp` 访问完整的项目、触发器、模板、订阅、资源、数据源和诊断工具。发送经过身份验证的 `tools/list` 请求获取完整列表。

如需将该端点添加到 Claude Code，请在 Bash 或 Zsh 中运行命令，然后在隐藏提示中输入智能体密钥。

```bash
printf 'Web3alert 智能体密钥： ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_KEY"
```

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
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```
