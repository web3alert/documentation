# 面向智能体

Web3alert 目录提供来自 EVM 和 Substrate 链的已解码链上事件，涵盖以太坊（Ethereum）、Polkadot 和 Kusama 等链。智能体可以通过 [14 个 MCP 工具](mcp-server.md#agent-endpoint) 查找并订阅触发器，然后通过 Webhook 或收件箱接收符合条件的 JSON 事件。

## 1. 获取智能体密钥

### 在应用中创建密钥

登录 [Web3alert](https://web3alert.io)，选择你已加入的工作区，然后在 [Agents 页面](https://web3alert.io/agents)创建密钥。密钥在该工作区内沿用你的角色，并受你授予的权限范围限制。请在密钥显示时复制，它只显示一次。

每个密钥都包含 `read` 权限。添加 `manage` 可注册 Webhook、创建订阅或请求充值报价。添加 `spend` 可使用欧元余额购买套餐。你可以设置[每月支出上限](limits.md#agent-payments)，也可以设置 30、90 或 365 天的有效期，两项均可留空。

现有会话令牌可用到服务器撤销它们为止。新连接请使用智能体密钥。

### 使用以太坊钱包注册

持有以太坊外部账户（EOA）的智能体可以自行创建 Free 账户。先请求一个一次性 nonce。两个 SIWE 请求均可公开访问。

```http
POST /api/agent/siwe/nonce
Host: web3alert.io
```

```json
{
  "nonce": "exampleNonce123456",
  "issuedAt": "<ISO-8601 timestamp>",
  "expiresAt": "<ISO-8601 timestamp>"
}
```

使用返回的 nonce 和 `issuedAt` 构建 EIP-4361 消息，替换钱包地址，然后用钱包签署完整消息。nonce 有效期为 10 分钟。验证时，`issuedAt` 与服务器时间的差值不得超过 5 分钟。

```http
POST /api/agent/siwe/verify
Host: web3alert.io
Content-Type: application/json

{
  "message": "web3alert.io wants you to sign in with your Ethereum account:\n<your Ethereum address>\n\n\nURI: https://web3alert.io\nVersion: 1\nChain ID: 1\nNonce: <nonce>\nIssued At: <issuedAt>",
  "signature": "<wallet signature>"
}
```

以下是 `200` 响应示例，其中 `key` 对象已简写。

```json
{
  "account": { "id": "<account-id>", "created": true },
  "key": { "id": "<key-id>", "scopes": ["read", "manage", "spend"] },
  "secret": "w3a_<key-secret>",
  "claimUrl": "https://web3alert.io/claim/<claim-token>"
}
```

每次登录成功都会为初始工作区签发新密钥，包含三种权限，无支出上限和过期时间。使用 `secret` 作为 Bearer 凭据。验证只在创建账户或没有有效链接时返回认领链接。若已有有效链接，`claimUrl` 为 `null`。账户由用户通过 Telegram 或 Google 认领后，钱包登录会返回 `403 account_claimed`。请向该用户索取智能体密钥。

请私下将认领链接交给要接管账户的人。页面会显示钱包、账户创建日期和链接到期时间，并提供 Telegram 和 Google 登录选项。登录后会转到 Agents 页面，可查看和管理密钥，以及查看套餐、余额和支出。如果所选登录方式已关联到另一个 Web3alert 账户，请使用其他账号。最新链接在七天内有效。可用[`POST /api/agent/claim-link`](api-account.md#post-api-agent-claim-link)替换该链接。

## 2. 连接 MCP 客户端

使用 Streamable HTTP 连接 `https://web3alert.io/mcp/agent`。发现工具无需令牌。调用工具时发送 `Authorization: Bearer <agent-key>`。

### Claude Code

在终端中将智能体密钥设为变量 `WEB3ALERT_KEY` 的值，然后运行以下命令。

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop 和 Cursor

将配置项添加到 Claude Desktop 的 `claude_desktop_config.json`（Settings → Developer → Edit Config）或 Cursor 的个人配置文件 `~/.cursor/mcp.json` 的 `mcpServers` 中。此示例通过 `npx` 运行 `mcp-remote` 桥接工具。请将示例中的占位符替换为智能体密钥。

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

## 3. 充值并购买套餐

1. 使用 `manage` 权限调用 `get_topup_requirements({"amountEur":5})`。可在 Base 网络用 USDC 充值 5–500 欧元。Web3alert 使用欧洲央行的美元参考汇率，按 1 USDC 等于 1 USD 换算，不加价。
2. 使用自己的 x402 v2 客户端和钱包支付。向返回的 `url` 发送 `POST` 请求，带上返回的 `body`、Bearer 凭据及 `PAYMENT-SIGNATURE` 中的付款签名。等待[充值](api-billing.md#post-api-billing-wallet-x402-topup)结算并计入欧元余额。
3. 余额充足时，使用 `spend` 权限调用 `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"first-plan-001"})`。可购买 1、3、6 或 12 个月的 Advanced 或 Pro，且不会自动续订。重试同一笔购买时沿用 `requestId` 和原参数。 若已有启用自动续订的有效套餐，购买会返回 `key_not_allowed`。请让账户持有人在应用中更改套餐。

## 4. 创建第一个订阅

可以投递到公开的 HTTPS Webhook，也可以在 Advanced 或 Pro 套餐中投递到工作区收件箱。添加 Webhook、创建订阅、读取收件箱或投递历史需要 `owner` 或 `admin` 角色。

### Webhook 投递

在本示例中，将尖括号内的值替换为前面调用的结果。将示例地址替换为自己控制的 Webhook HTTPS 地址，地址中不能包含用户名或密码。选择事件触发器，并提供 `get_trigger` 返回的必填 `inputs`。此示例假设触发器没有必填输入。

1. `get_account({})` → 账户、套餐、当前工作区、以 EUR 计的余额、套餐限制以及可用的订阅计数。
2. `find_triggers({"kind":"event","limit":5})` → 已发布目录和当前工作区中符合条件的触发器，包括各自的 `fullname`。
3. `get_trigger({"trigger":"<trigger-fullname>"})` → 触发器的运行时输入、事件字段和可用于筛选的字段。
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → 已注册 Webhook 的 `fullname`、名称和 URL。 签名密钥仅在 `add_webhook` 的回复中以 `signingSecret` 字段显示。之后轮换密钥会替换该端点所有接收方使用的密钥。请保存密钥供接收端使用。
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → 订阅的 ID、标题、最终状态、触发器和 Webhook。
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → 投递结果，以及有更多结果时返回的 `nextCursor`。告警历史按工作区访问列表中第一个具有所有者角色的账户的套餐检查。如果没有这样的账户，API 会检查请求方账户的套餐。如果该套餐不含历史记录，工具返回 `not_in_plan`。

   如果有 500 条或更多投递记录使用同一时间戳，导致游标无法继续翻页，工具会返回 `api_error`。请缩小筛选范围，例如按状态筛选，然后不带游标重新查询。

确认返回的订阅 `state` 为 `on`。之后，符合条件的事件即可投递。请使用新的 Webhook 名称，或通过 `list_webhooks` 查找已注册的 Webhook。

### Webhook 请求体

你的 Webhook 会收到包含事件 ID 的 JSON 请求体。新建的 Webhook 会收到已签名的投递，Web3alert 会自动重试符合条件的失败投递。请求体格式、签名验证、重试和去重方式，请参阅 [Webhook](webhooks.md)。

### 收件箱投递

找到触发器，用 `get_trigger` 查看输入，然后调用 `create_subscription({"trigger":"<trigger-fullname>","inbox":true,"state":"on"})`。传入必填的 `inputs`。每次调用只能指定一个投递目标。该工具会创建或复用工作区收件箱。

调用 `read_events({})` 从保留的最旧事件开始读取。若 `nextCursor` 非空，保存该值并在下次调用中作为 `after`。当 `hasMore` 为真时继续读取，并在同一工作区沿用游标。`gap: true` 表示游标与第一条返回的事件之间有事件已超出保留范围，也可能表示此前已保存游标之后的事件，但本页为空。使用事件的 `id` 去重。

是否保存事件以及保留时长取决于工作区所有者的套餐。若无所有者，则使用订阅创建者的套餐。Advanced 最多保留 **7 天或 25,000 条事件**，Pro 最多保留 **30 天或 100,000 条事件**。不含告警历史的套餐不会保存事件。创建和读取收件箱时检查工作区所有者的套餐，若无所有者则检查调用者的套餐。若该套餐不包含告警历史，则返回 `not_in_plan`。

## 5. 构建触发器

在 Advanced 或 Pro 套餐下，使用同一个 Bearer 请求头连接 `https://web3alert.io/mcp/agent/build`。服务端根据 EVM 合约 ABI、Solana IDL 或 Substrate 元数据生成触发器，无需编写代码。

1. 调用 `find_contract`，指定平台支持的链以及合约地址、Solana 程序或 Substrate pallet。`chain` 可用简称，如 `ethereum`、`base`、`arbitrum-one`、`polkadot` 或 `solana`，也可用 `common.<chain>` 或 `common.source.<chain>`。若无法识别链，请查看工具错误中 `Supported:` 后的可用名称。

   对于 EVM，`recentBlocks` 表示每个事件的 `recentCount` 涵盖的近期区块数，最多 1,000 个。如果提供方拒绝大范围查询，覆盖范围可能缩小。值为 `null` 表示未能读取任何区块。
2. 将同一条链、同一目标和准确的事件签名传给 `plan_trigger`，保存返回的 `draftId`。草稿七天后过期。
3. 对草稿运行 `test_trigger`。可让服务端查找近期样本，也可提供区块或 slot。最近一次结果为 `matched` 后即可继续。

   如果 EVM 在可读取的日志区间内未找到匹配项，而提供方拒绝查询更早的区间，则返回 `no_match`。如果查找因超时、传输故障或原因不明的运行时错误而中断，则返回 `retryable`。对于 EVM 或 Substrate 测试，可显式指定近期的 `block` 来跳过查找。

4. 用原 `draftId` 和自己的 `requestId` 调用 `activate_trigger`。重试时沿用该 ID。触发器将保存到工作区的智能体私有项目。把返回的完整名称传给 `create_subscription`。

`find_contract` 和 `test_trigger` 需要 `read`。规划和激活需要 `manage`。参见[构建工具参考](mcp-server.md#build-endpoint)。

## 限制

Free 账户在所有工作区中，最多可保留 **5 个由该账户创建且针对非 Free 项目的启用订阅**。Free 项目的订阅不计入上限。

在 Free 套餐中，仅向内置 Webhook 投递的订阅的默认突发上限为 12 条，持续速率为每秒 1 条，队列上限为 15 条。此类订阅不占用工作区的投递额度。

Free 套餐每分钟允许 60 次外部 API 请求。订阅测试和告警历史在 Advanced 和 Pro 套餐中可用。两项功能均按工作区首位所有者的套餐检查，找不到所有者时按第 6 步所述规则处理。完整数值见[限制](limits.md)。

MCP 服务器默认允许每个账户每分钟调用工具 120 次。每个服务进程中的三个端点共享此额度。`get_account` 返回账户套餐以及与 `GET /api/me` 相同的[套餐限制](api-account.md#me-limits)。API 未提供套餐限制时，工具返回的 `limits` 为 `null`。MCP 最多可使用缓存的 `/me` 响应 30 秒，因此套餐变更最多可能需要 30 秒才会反映在 `get_account` 中。

## 机器可读资料

- [llms.txt](https://web3alert.io/llms.txt) 提供连接信息和文档链接。
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) 描述面向智能体的 HTTP API。
