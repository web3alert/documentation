# 计费 API

这些面向客户端的 endpoints 用于管理账号套餐、余额、项目 add-on、优惠券、推荐和续费设置。支付服务商的 callback 不属于公开 API。

## GET /api/billing/overview

返回当前账号的计费概览。

## GET /api/billing/wallet/overview

返回账号余额和钱包概览。

## POST /api/billing/wallet/crypto-topup

创建加密货币余额充值。

## POST /api/billing/wallet/topup/refresh

刷新余额充值状态。

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
