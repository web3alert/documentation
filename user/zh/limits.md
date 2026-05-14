# Limits

`Limits` 描述 Web3alert 中依赖 account tier 的限制，以及作为服务通用技术规则生效的限制。

主要 tiers：

- `Free`；
- `Advanced`；
- `Pro`。

如果表格中写着 `Unlimited`，表示在当前资费配置中没有明确的数值限制。其他技术检查、workspace 权限或实体状态仍然可能限制某个操作。

## 限制如何生效

Tier limit 本身并不授予操作权限。大多数操作需要同时满足两个条件：

- account tier 允许该操作；
- 用户在 [Workspace](workspaces.md) 中的 role 允许管理相应实体。

对于 projects 和 custom data sources，限制通常按实体的 owner 或 billing account 计算。对于 subscriptions，限制按创建 subscription 的 account 计算。

## Tier Summary

| 能力 | Free | Advanced | Pro |
| --- | ---: | ---: | ---: |
| 创建 projects | 否 | 是 | 是 |
| 创建 workspaces | Unlimited | Unlimited | Unlimited |
| 编辑 projects | 否 | 是 | 是 |
| 管理 triggers | 否 | 是 | 是 |
| 管理 templates | 否 | 是 | 是 |
| 管理 custom data sources | 否 | 是 | 是 |
| Test run | 否 | 是 | 是 |
| MCP server access | 否 | 是 | 是 |
| Active non-free subscriptions | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Private project 中的 triggers | 0 | 50 | 200 |
| Public/free project 中的 triggers | 0 | Unlimited | Unlimited |
| 每个 trigger 的 provider weight | 0 | 6 | 20 |
| 每个 subscription 的 runtime rate | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| 每个 workspace 的 runtime rate | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
| External API rate | 60/min | 300/min | 900/min |
| Subscriptions logs | 否 | 7 天 / 25,000 条记录 | 30 天 / 100,000 条记录 |
| Custom source logs | 否 | 7 天 / 25,000 条记录 | 30 天 / 100,000 条记录 |

## Projects

### Create Projects

创建 projects 仅对 `Advanced` 和 `Pro` 可用。

`Free` account 不能创建新的 projects。

### Edit Projects

编辑 project metadata 仅对付费 accounts 可用。

如果项目 owner 变为 `Free`，他不能编辑 project metadata。对于 public projects，仍然可以删除项目，但不能像以前一样管理项目设置。

### Private Projects

| Tier | Private projects 限制 |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Private project 会占用 owner account 的 private projects 限制 slot。

如果限制已经用完，可以：

- 将已有 private project 改为 public；
- upgrade 到更高 tier；
- 删除不再需要的 private project。

### Free Projects

Free project 可供所有用户订阅，并且不会消耗 non-free subscriptions 限制。

Free access 通过 [Account Billing](account.md#project-free-access-add-on) 中的 project free-access add-on 启用。

如果 add-on 未续费，project 会变为 public。之后，`Free` users 对该 project 的 subscriptions 会被计为 non-free subscriptions，如果超过 `Free` 限制，可能会被冻结。

## Subscriptions

### Counted Subscriptions

`Free` account 最多可以保留 5 个指向 non-free projects 的 active subscriptions。

`Advanced` 和 `Pro` 没有 counted subscriptions 数量限制。

| Tier | Active counted subscriptions |
| --- | ---: |
| Free | 5 |
| Advanced | Unlimited |
| Pro | Unlimited |

### 哪些 subscriptions 会被 counted

如果 subscription 属于 access level 不是 `Free` 的 project，它会被 counted。

会被 counted：

- 指向 `Public` projects 的 subscriptions；
- 指向 `Private` projects 的 subscriptions，前提是用户可以访问 source workspace。

不会被 counted：

- 指向 `Free` projects 的 subscriptions。

通过 template 创建的 subscription 计为一个 subscription。Template 内部 topics 或 rules 的数量不会放大这个限制。

### 超过 Free limit 时会发生什么

如果 `Free` account 尝试启用超过 5 个 counted subscriptions，额外的 subscriptions 会被阻止。

如果用户关闭一个 counted subscription，就可以在限制范围内启用另一个。

如果某个 project 原来是 `Free`，但 free-access add-on 结束后 project 变为 `Public`，`Free` users 对该 project 的 subscriptions 会开始计为 counted。如果之后超过限制，额外 subscriptions 会被冻结，原因会说明 Free tier 限制。

### Frozen Private Projects

如果 private project owner 变为 `Free`，private project 会被冻结。

与 frozen project 相关的 subscriptions 会被阻止，原因是 trigger/project frozen。这是单独的阻止原因，不会替代普通 counted subscriptions 限制。

### Subscriptions Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | 不可用 | 不可用 |
| Advanced | 7 天 | 25,000 |
| Pro | 30 天 | 100,000 |

如果 tier 不支持 subscriptions logs，backend 不会为该 workspace owner tier 的 subscriptions 保存 logs。

在 UI 中，日志可以按 50、100、250 或 500 条记录分页读取。

## API and MCP

### MCP Server Access

MCP server 仅对 `Advanced` 和 `Pro` 可用。

### External API Rate

External API rate 适用于使用 account-token 的 API requests，但不包括来自 Web3alert web UI 的请求，也不包括来自 Web3alert MCP server 的请求。

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

来自 web UI 和 MCP server 的 requests 不受此规则限制。

## Triggers

### Manage Triggers

创建、导入和编辑 triggers 仅在 owner 具有 `Advanced` 或 `Pro` tier 的 projects 中可用。

| Tier | Manage triggers |
| --- | --- |
| Free | 否 |
| Advanced | 是 |
| Pro | 是 |

### Project Triggers

| Tier | Private project | Public/free project |
| --- | ---: | ---: |
| Free | 0 | 0 |
| Advanced | 50 | Unlimited |
| Pro | 200 | Unlimited |

Private project limits 只应用于 private projects。

`Free` account 不能管理自己 projects 中的 triggers。如果这个 account 被加入到付费 workspace，并拥有允许编辑 project internals 的 role，它可以在该 workspace 中创建、导入和编辑 triggers。

对于 `Advanced` 和 `Pro`，public/free project 当前没有单独的 trigger 数量限制。

## Templates

### Manage Templates

创建和编辑 templates 仅在 owner 具有 `Advanced` 或 `Pro` tier 的 projects 中可用。

| Tier | Manage templates |
| --- | --- |
| Free | 否 |
| Advanced | 是 |
| Pro | 是 |

`Free` account 不能管理自己 projects 中的 templates。如果这个 account 被加入到付费 workspace，并拥有允许编辑 project internals 的 role，它可以在该 workspace 中创建和编辑 templates。

删除 template 需要 workspace 中的 owner-role。

## Data Sources

### Manage Custom Data Sources

创建和编辑 custom data sources 仅对付费 accounts 可用。

| Tier | Manage custom data sources |
| --- | --- |
| Free | 否 |
| Advanced | 是 |
| Pro | 是 |

### Private Custom Data Sources

| Tier | Private custom data sources |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

该限制按 account 创建的 private custom sources 计算。

Public/system sources 不占用 private custom source slots。

### Public Custom Source Registration

Public custom sources 有一个通用 anti-spam 限制：24 小时内最多 5 次 public registrations。

这个限制不依赖 tier。

Public source 还会通过网络唯一性检查。对于 Substrate sources，服务比较 genesis block hash；对于 EVM sources，比较 chain ID。同一个 blockchain source 不能再次作为新的 public source 发布。

### Endpoints per Custom Source

一个 custom source 可以有 1 到 10 个 endpoints。

这个限制不依赖 tier。

### Runtime Settings

Custom source 有 runtime settings：

| Setting | Default | Maximum |
| --- | ---: | ---: |
| `blockProcessingConcurrency` | 1 | 32 |
| `maxQueuedBlocks` | 10,000 | 100,000 |
| `batchMaxCount` for EVM | 3 | 100 |

Advanced runtime settings 可由 `Pro` 配置。其他 tiers 使用 default values 或已经保存的值。

### Custom Source Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | 不可用 | 不可用 |
| Advanced | 7 天 | 25,000 |
| Pro | 30 天 | 100,000 |

在 UI 中，source logs 可以按 50、100、250 或 500 条记录分页读取。

读取 custom source logs 时，backend 还会额外限制 tail read：每次 tail read 最多 96 KB，最多 200 lines。

## Providers

Providers 在 trigger execution 中使用，用来用外部数据或 state-derived 数据补充 source item。

### Provider Weights

Provider weight 取决于 tier：

| Tier | Provider weight per trigger |
| --- | ---: |
| Free | 0 |
| Advanced | 6 |
| Pro | 20 |

Provider weight 是 provider 在 trigger execution budget 中的成本。一个 provider 可能占用超过一个条件 slot。

每个 provider 都有 weight。

| Provider type | Weight |
| --- | ---: |
| HTTP | 2 |
| GraphQL | 2 |
| RPC endpoint | 2 |
| RPC source transport | 1 |
| State source: Substrate storage | 1 |
| State source: EVM read | 1 |
| Value history | 1 |
| JavaScript | 2 |

如果 provider 明确定义 `weight`，它必须是正 integer。大于 100 的值会被截断为 100。

### Provider Timeout

Provider timeout 是 10 秒。

这是通用 runtime limit。在 UI 中，该参数不会作为普通设置展示给用户。

### Provider Response Size

Provider response 的最大大小是 256 KB。

这是通用 runtime limit。

### Provider URL Policy

对于 external endpoint providers，只允许 `https`。

Local 和 private-network hosts 被禁止：例如 `localhost`、`.local`、private IPv4 ranges 和 loopback IPv6。

## Tests

### Test Run Access

| Tier | Test run |
| --- | --- |
| Free | 否 |
| Advanced | 是 |
| Pro | 是 |

Test run 用于检查 triggers、providers 和 subscriptions。

### Test Rate Limit

| Tier | Rate |
| --- | ---: |
| Free | 不可用 |
| Advanced | 1 test / second |
| Pro | 5 tests / second |

该限制应用于 test endpoints，用于保护 backend 和 runtime，避免过于频繁的运行。

## Alert Delivery

Alert delivery 通过 rate limits 限制，防止单个 account/workspace 使 delivery runtime 过载。

### Per-Subscription Notification Rate

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` 允许处理短时间 alert 峰值。

`Sustained rate` 表示 bucket 随时间恢复多少 alerts。

`Queue cutoff` 是 subscription 队列的最大大小，超过后 delivery 会开始丢弃或 rate-limit events。

### Per-Workspace Notification Rate

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit 保护 workspace 内部的整体 alerts 流量。

## Project Transfer

Project transfer requests 有 anti-spam limits。

| Limit | Value |
| --- | ---: |
| Pending request lifetime | 7 天 |
| Requests by one account per hour | 5 |
| Requests by one account per day | 20 |
| Requests from one account to the same target workspace per day | 2 |
| Pending transfer requests per project | 1 |

这些限制不依赖 tier。
