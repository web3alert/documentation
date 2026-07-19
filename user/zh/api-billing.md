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

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->
使用钱包余额购买项目免费访问 add-on。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `projectFullname` | 是 | 获得 add-on 的项目完整名称。 |
| `addonCode` | 是 | add-on 标识符：`project-free-access`。 |
| `durationMonths` | 是 | 计费周期：`1`、`3`、`6` 或 `12` 个月。 |
| `autoRenew` | 否 | 生成的订阅是否自动续费。省略时默认为 `false`。 |
| `requestId` | 否 | 由 8-128 个 RFC 3986 unreserved 字符组成的幂等键：`A-Z`、`a-z`、`0-9`、`.`、`_`、`~` 和 `-`。为兼容旧客户端可省略，但建议提供。 |

一次经用户确认的购买意图应使用一个稳定的 `requestId`。如果发生 timeout
或其他结果未知的情况，请使用相同的 `requestId` 和完整 payload 重试，其中包括
`projectFullname`、`addonCode`、`durationMonths` 和 `autoRenew`。完全相同的重试会
返回原始 `subscriptionId` 和 `invoiceId`，不会再次扣除钱包余额。使用相同
`requestId` 但更改上述任一字段的请求会被拒绝。新的购买意图必须生成新的
`requestId`。不提供 `requestId` 时，为兼容旧客户端仍会接受请求，但不同的 HTTP
尝试不具备 retry-safe 或幂等保证。

| 幂等场景 | 必需行为 |
| --- | --- |
| `same-intent` | 使用 `same-requestId` 和 `same-full-payload`：`projectFullname`、`addonCode`、`durationMonths`、`autoRenew`。 |
| `exact-replay` | 返回 `original-subscriptionId` 和 `original-invoiceId`，并保证 `no-second-debit`。 |
| `conflicting-payload` | 更改 `projectFullname`、`addonCode`、`durationMonths` 或 `autoRenew` 会被 `rejected`。 |
| `new-intent` | 生成 `new-requestId`。 |
| `missing-requestId` | 保持 `backward-compatible`，但为 `not-retry-safe` 且 `not-idempotent-across-HTTP-attempts`。 |

响应：HTTP 200 OK。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `subscriptionId` | 是 | 已激活项目 add-on 订阅的标识符。 |
| `invoiceId` | 是 | 已支付发票的标识符。 |

## POST /api/billing/project-addon/checkout

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
为项目 add-on 创建 checkout。

如果对应的托管 checkout 仍处于待处理状态，重试会返回现有的
`subscriptionId`、`invoiceId` 和 `externalReference`，以及新签名的 `checkout`
表单。请提交最近一次返回的表单。

| Checkout 场景 | 必需行为 |
| --- | --- |
| `pending-hosted-retry` | 返回现有的 `subscriptionId`、`invoiceId` 和 `externalReference`，以及新签名的 `checkout` 表单。 |

## POST /api/billing/project-addon/crypto-checkout

<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->
为项目 add-on 创建直接加密货币 checkout。

如果待处理 checkout 已关联支付服务商订单，重试会返回相同的
`providerOrderId` 和 `paymentUrl`。如果创建订单或保存关联关系的结果不明确，
checkout 会保持待处理并以 fail-closed 方式阻止新尝试；请先取消该 checkout 或等待
协调处理。

| Checkout 场景 | 必需行为 |
| --- | --- |
| `pending-linked-order-retry` | 返回相同的 `providerOrderId` 和 `paymentUrl`。 |
| `ambiguous-provider-creation-or-linkage` | 保持 `fail-closed-pending`；要求 `cancel-or-reconcile-before-new-attempt`。 |

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

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
刷新加密货币 checkout 状态。

对于项目 add-on，在取消 checkout 或转移项目后收到的延迟付款不会重新激活订阅或
项目访问权限，而是进入协调或退款处理。

| 生命周期场景 | 必需行为 |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | 保持 `no-reactivation`；执行 `reconciliation-or-refund`。 |

## POST /api/billing/crypto-checkout/cancel

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
取消加密货币 checkout。

取消操作对项目 add-on 的激活是终止性的。如果之后才观察到付款，包括项目已转移的
情况，订阅和项目访问权限都不会重新激活，该付款会进入协调或退款处理。

| 生命周期场景 | 必需行为 |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | 保持 `no-reactivation`；执行 `reconciliation-or-refund`。 |
