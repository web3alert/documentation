# Billing API

These client-facing endpoints manage account plans, wallet funds, project
add-ons, coupons, referrals, and renewal settings. Billing-provider callbacks
are not part of the public API.

## GET /api/billing/overview

Returns the current account billing overview.

## GET /api/billing/wallet/overview

Returns the account balance and wallet overview.

## POST /api/billing/wallet/crypto-topup

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
Creates a crypto balance top-up. When `returnUrl` or `cancelUrl` is supplied,
the API sets its `externalReference` query parameter to the exact reference of
the created top-up, replacing any previous value. Preserve that reference
across the provider redirect.

## POST /api/billing/wallet/topup/refresh

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
Refreshes the state of the top-up identified by `topupId` or
`externalReference`. Use an identifier returned by the create response or the
redirect URL; do not infer the target from the most recent top-up. A return page
must not request a refresh when the identifier is missing, repeated, or
conflicts with another identifier.

## POST /api/billing/account-plan/balance-purchase

Purchases or upgrades an account plan using the wallet balance.

## POST /api/billing/account-plan/checkout

Creates a checkout for an account plan.

## POST /api/billing/account-plan/crypto-checkout

Creates a direct crypto checkout for an account plan.

## POST /api/billing/project-addon/balance-purchase

Purchases a project free-access add-on using the wallet balance.

## POST /api/billing/project-addon/checkout

Creates a checkout for a project add-on.

## POST /api/billing/project-addon/crypto-checkout

Creates a direct crypto checkout for a project add-on.

## POST /api/billing/coupon/redeem

Redeems a coupon.

## POST /api/billing/coupon/gift-purchase

Purchases a gift coupon using the wallet balance.

## GET /api/billing/referral/overview

Returns the referral balance and link summary.

## POST /api/billing/referral/link/create

Creates a referral link.

## POST /api/billing/referral/claim

Claims a referral code.

## POST /api/billing/subscription/update-renewal

Updates automatic billing renewal.

## POST /api/billing/crypto-checkout/refresh

Refreshes the state of a crypto checkout.

## POST /api/billing/crypto-checkout/cancel

Cancels a crypto checkout.
