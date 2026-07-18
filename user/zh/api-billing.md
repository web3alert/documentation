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

使用钱包余额购买或升级账号套餐。

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
