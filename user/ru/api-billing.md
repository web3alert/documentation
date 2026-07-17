# API биллинга

Эти публичные endpoints управляют тарифом account, балансом, project add-ons,
купонами, referral-программой и продлением. Callback-ручки платежных провайдеров
не входят в публичный API.

## GET /api/billing/overview

Возвращает обзор биллинга текущего account.

## GET /api/billing/wallet/overview

Возвращает обзор баланса и кошелька account.

## POST /api/billing/wallet/crypto-topup

Создает пополнение баланса криптовалютой.

## POST /api/billing/wallet/topup/refresh

Обновляет статус пополнения баланса.

## POST /api/billing/account-plan/balance-purchase

Покупает или улучшает тариф account за баланс кошелька.

## POST /api/billing/account-plan/checkout

Создает checkout для тарифа account.

## POST /api/billing/account-plan/crypto-checkout

Создает прямой crypto checkout для тарифа account.

## POST /api/billing/project-addon/balance-purchase

Покупает add-on бесплатного доступа к project за баланс кошелька.

## POST /api/billing/project-addon/checkout

Создает checkout для project add-on.

## POST /api/billing/project-addon/crypto-checkout

Создает прямой crypto checkout для project add-on.

## POST /api/billing/coupon/redeem

Активирует купон.

## POST /api/billing/coupon/gift-purchase

Покупает подарочный купон за баланс кошелька.

## GET /api/billing/referral/overview

Возвращает обзор referral-баланса и ссылки.

## POST /api/billing/referral/link/create

Создает referral-ссылку.

## POST /api/billing/referral/claim

Активирует referral-код.

## POST /api/billing/subscription/update-renewal

Обновляет настройку автоматического продления.

## POST /api/billing/crypto-checkout/refresh

Обновляет статус crypto checkout.

## POST /api/billing/crypto-checkout/cancel

Отменяет crypto checkout.
