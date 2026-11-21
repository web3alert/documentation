# 面向智能体

Web3alert 目录提供 EVM、Substrate、Solana 和 HyperCore 上已解码的链上事件。智能体可以通过 [10 个 MCP 工具](mcp-server.md#agent-endpoint) 查找并订阅触发器，然后在自己的 Webhook 上接收符合条件的 JSON 事件。

## 即将推出

- 支持钱包登录，让智能体自行开设账户。
- 通过 x402 充值 USDC。
- 用于查看错过事件的收件箱。

## 1. 获取令牌

由用户登录 [Web3alert](https://web3alert.io)，在[账户设置](account.md#personal-access-token)中复制个人访问令牌。智能体目前还不能自行创建账户。请在应用中选择你拥有或管理的工作区。添加 Webhook、创建订阅和查看投递历史需要 `owner` 或 `admin` 角色。

## 2. 连接 MCP 客户端

通过 Streamable HTTP 连接 `https://web3alert.io/mcp/agent`，并在每次请求中发送 `Authorization: Bearer <token>`。

### Claude Code

在终端中将令牌设为变量 `WEB3ALERT_TOKEN` 的值，然后运行以下命令。

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

### Claude Desktop 和 Cursor

将配置项添加到 Claude Desktop 的 `claude_desktop_config.json`（Settings → Developer → Edit Config）或 Cursor 的个人配置文件 `~/.cursor/mcp.json` 的 `mcpServers` 中。此示例通过 `npx` 运行 `mcp-remote` 桥接工具。请将示例中的占位符替换为令牌。

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

## 3. 创建第一个订阅

在本示例中，将尖括号内的值替换为前面调用的结果。将示例地址替换为自己控制的 Webhook HTTPS 地址，地址中不能包含用户名或密码。选择事件触发器，并提供 `get_trigger` 返回的必填 `inputs`。此示例假设触发器没有必填输入。

1. `get_account({})` → 账户、套餐、当前工作区、以 EUR 计的余额、套餐限制以及可用的订阅计数。
2. `find_triggers({"kind":"event","limit":5})` → 已发布目录和当前工作区中符合条件的触发器，包括各自的 `fullname`。
3. `get_trigger({"trigger":"<trigger-fullname>"})` → 触发器的运行时输入、事件字段和可用于筛选的字段。
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → 已注册 Webhook 的 `fullname`、名称和 URL。 签名密钥仅在 `add_webhook` 的回复中以 `signingSecret` 字段显示。之后轮换密钥会替换该端点所有接收方使用的密钥。请保存密钥供接收端使用。
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → 订阅的 ID、标题、最终状态、触发器和 Webhook。
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → 投递结果，以及有更多结果时返回的 `nextCursor`。告警历史按工作区访问列表中第一个具有所有者角色的账户的套餐检查。如果没有这样的账户，API 会检查请求方账户的套餐。如果该套餐不含历史记录，工具返回 `not_in_plan`。

   如果有 500 条或更多投递记录使用同一时间戳，导致游标无法继续翻页，工具会返回 `api_error`。请缩小筛选范围，例如按状态筛选，然后不带游标重新查询。

确认返回的订阅 `state` 为 `on`。之后，符合条件的事件即可投递。请使用新的 Webhook 名称，或通过 `list_webhooks` 查找已注册的 Webhook。

## Webhook 请求体

你的 Webhook 会收到包含事件 ID 的 JSON 请求体。新建的 Webhook 会收到已签名的投递，Web3alert 会自动重试符合条件的失败投递。请求体格式、签名验证、重试和去重方式，请参阅 [Webhook](webhooks.md)。

## 限制

Free 账户在所有工作区中，最多可保留 **5 个由该账户创建且针对非 Free 项目的启用订阅**。Free 项目的订阅不计入上限。

智能体端点创建的订阅只向 Webhook 投递告警。在 Free 套餐中，每个此类订阅的默认突发上限为 12 条，持续速率为每秒 1 条，队列上限为 15 条。此类订阅不占用工作区的投递额度。

Free 套餐每分钟允许 60 次外部 API 请求。订阅测试和告警历史在 Advanced 和 Pro 套餐中可用。两项功能均按工作区首位所有者的套餐检查，找不到所有者时按第 6 步所述规则处理。完整数值见[限制](limits.md)。

MCP 服务器默认允许每个账户每分钟调用工具 120 次。每个服务进程中的两个端点共享此额度。`get_account` 返回账户套餐以及与 `GET /api/me` 相同的[套餐限制](api-account.md#me-limits)。API 未提供套餐限制时，工具返回的 `limits` 为 `null`。MCP 最多可使用缓存的 `/me` 响应 30 秒，因此套餐变更最多可能需要 30 秒才会反映在 `get_account` 中。

## 机器可读资料

- [llms.txt](https://web3alert.io/llms.txt) 提供连接信息和文档链接。
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) 描述面向智能体的 HTTP API。
