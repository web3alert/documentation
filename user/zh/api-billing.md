# 计费 API

这些面向客户端的 endpoints 用于管理账号套餐、余额、项目 add-on、优惠券、推荐和续费设置。支付服务商的 callback 不属于公开 API。

## GET /api/billing/overview

返回当前账号的计费概览。

## GET /api/billing/wallet/overview

返回账号余额和钱包概览。

## POST /api/billing/wallet/crypto-topup

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
创建加密货币余额充值。提供 `returnUrl` 或 `cancelUrl` 时，API 会将其中的
`externalReference` 查询参数设置为本次充值的准确引用，并替换旧值。请在支付服务商
重定向期间保留该引用。

## POST /api/billing/wallet/topup/refresh

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
刷新由 `topupId` 或 `externalReference` 准确标识的充值状态。请使用创建响应或返回
URL 中的标识符，不要根据“最近一次充值”推断目标。如果标识符缺失、重复或与另一个
标识符冲突，返回页面不得发起刷新请求。

## POST /api/billing/account-plan/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->
使用钱包余额购买或升级账号套餐。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `planId` | 是 | 目标套餐：`advanced` 或 `pro`。 |
| `durationMonths` | 是 | 计费周期：`1`、`3`、`6` 或 `12` 个月。 |
| `autoRenew` | 否 | 生成的订阅是否自动续费。省略时默认为 `false`。 |
| `requestId` | 否 | 由 8-128 个 RFC 3986 unreserved 字符组成的幂等键：`A-Z`、`a-z`、`0-9`、`.`、`_`、`~` 和 `-`。为兼容旧客户端可省略，但建议提供。 |

一次经用户确认的购买意图应使用一个稳定的 `requestId`。如果发生 timeout
或其他结果未知的情况，请使用相同的 payload 和 `requestId` 重试。完全相同的重试会
返回原始 `subscriptionId` 和 `invoiceId`，不会再次扣除钱包余额。使用相同
`requestId` 但更改 `planId`、`durationMonths` 或 `autoRenew` 的请求会被拒绝。
新的购买意图必须生成新的 `requestId`。不提供 `requestId` 时，为兼容旧客户端仍会
接受请求，但不同的 HTTP 尝试不具备 retry-safe 或幂等保证。

| 幂等场景 | 必需行为 |
| --- | --- |
| `same-intent` | 使用 `same-requestId` 和 `same-payload`。 |
| `exact-replay` | 返回 `original-subscriptionId` 和 `original-invoiceId`，并保证 `no-second-debit`。 |
| `conflicting-payload` | 请求被 `rejected`。 |
| `new-intent` | 生成 `new-requestId`。 |
| `missing-requestId` | 保持 `backward-compatible`，但为 `not-retry-safe` 且 `not-idempotent-across-HTTP-attempts`。 |

响应：HTTP 200 OK。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `subscriptionId` | 是 | 已激活订阅的标识符。 |
| `invoiceId` | 是 | 已支付发票的标识符。 |

## POST /api/billing/account-plan/checkout

为账号套餐创建 checkout。

## POST /api/billing/account-plan/crypto-checkout

为账号套餐创建直接加密货币 checkout。

## POST /api/billing/project-addon/balance-purchase

使用钱包余额购买项目免费访问 add-on。

## POST /api/billing/project-addon/checkout

为项目 add-on 创建 checkout。

## POST /api/billing/project-addon/crypto-checkout

为项目 add-on 创建直接加密货币 checkout。

## POST /api/billing/coupon/redeem

兑换优惠券。

## POST /api/billing/coupon/gift-purchase

使用钱包余额购买礼品优惠券。

## GET /api/billing/referral/overview

返回推荐余额和链接摘要。

## POST /api/billing/referral/link/create

创建推荐链接。

## POST /api/billing/referral/claim

领取推荐码。

## POST /api/billing/subscription/update-renewal

更新自动续费设置。

## POST /api/billing/crypto-checkout/refresh

刷新加密货币 checkout 状态。

## POST /api/billing/crypto-checkout/cancel

取消加密货币 checkout。
