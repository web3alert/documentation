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

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->
Purchases or upgrades an account plan using the wallet balance.

Request body:

| Field | Required | Description |
| --- | --- | --- |
| `planId` | Yes | Target plan: `advanced` or `pro`. |
| `durationMonths` | Yes | Billing period: `1`, `3`, `6`, or `12` months. |
| `autoRenew` | No | Whether the resulting subscription renews automatically. Defaults to `false` when omitted. |
| `requestId` | No | Idempotency key containing 8-128 RFC 3986 unreserved characters: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~`, and `-`. It may be omitted for backward compatibility, but is recommended. |

Use one stable `requestId` for one confirmed user intent. If a timeout or
another unknown result occurs, retry with the same payload and `requestId`.
An exact replay returns the original `subscriptionId` and `invoiceId` without
a second wallet debit. Reusing that `requestId` with a different `planId`,
`durationMonths`, or `autoRenew` is rejected. Generate a new `requestId` for a
new purchase intent. Without `requestId`, the request remains accepted for
backward compatibility, but separate HTTP attempts are neither retry-safe nor
idempotent.

| Idempotency case | Required behavior |
| --- | --- |
| `same-intent` | Send the `same-requestId` with the `same-payload`. |
| `exact-replay` | Return the `original-subscriptionId` and `original-invoiceId` with `no-second-debit`. |
| `conflicting-payload` | The request is `rejected`. |
| `new-intent` | Generate a `new-requestId`. |
| `missing-requestId` | Remains `backward-compatible`, but is `not-retry-safe` and `not-idempotent-across-HTTP-attempts`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| `subscriptionId` | Yes | Identifier of the activated subscription. |
| `invoiceId` | Yes | Identifier of the paid invoice. |

## POST /api/billing/account-plan/checkout

Creates a checkout for an account plan.

## POST /api/billing/account-plan/crypto-checkout

Creates a direct crypto checkout for an account plan.

## POST /api/billing/project-addon/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->
Purchases a project free-access add-on using the wallet balance.

Request body:

| Field | Required | Description |
| --- | --- | --- |
| `projectFullname` | Yes | Fully qualified name of the project receiving the add-on. |
| `addonCode` | Yes | Add-on identifier: `project-free-access`. |
| `durationMonths` | Yes | Billing period: `1`, `3`, `6`, or `12` months. |
| `autoRenew` | No | Whether the resulting subscription renews automatically. Defaults to `false` when omitted. |
| `requestId` | No | Idempotency key containing 8-128 RFC 3986 unreserved characters: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~`, and `-`. It may be omitted for backward compatibility, but is recommended. |

Use one stable `requestId` for one confirmed user intent. If a timeout or
another unknown result occurs, retry with the same `requestId` and the same
full payload, including `projectFullname`, `addonCode`, `durationMonths`, and
`autoRenew`. An exact replay returns the original `subscriptionId` and
`invoiceId` without a second wallet debit. Reusing that `requestId` after
changing any of those payload fields is rejected. Generate a new `requestId`
for a new purchase intent. Without `requestId`, the request remains accepted
for backward compatibility, but separate HTTP attempts are neither retry-safe
nor idempotent.

| Idempotency case | Required behavior |
| --- | --- |
| `same-intent` | Send the `same-requestId` with the `same-full-payload`: `projectFullname`, `addonCode`, `durationMonths`, and `autoRenew`. |
| `exact-replay` | Return the `original-subscriptionId` and `original-invoiceId` with `no-second-debit`. |
| `conflicting-payload` | Changing `projectFullname`, `addonCode`, `durationMonths`, or `autoRenew` is `rejected`. |
| `new-intent` | Generate a `new-requestId`. |
| `missing-requestId` | Remains `backward-compatible`, but is `not-retry-safe` and `not-idempotent-across-HTTP-attempts`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| `subscriptionId` | Yes | Identifier of the activated project add-on subscription. |
| `invoiceId` | Yes | Identifier of the paid invoice. |

## POST /api/billing/project-addon/checkout

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
Creates a checkout for a project add-on.

When the matching hosted checkout is still pending, a retry returns the existing
`subscriptionId`, `invoiceId`, and `externalReference`, together with a newly
signed `checkout` form. Submit the latest returned form.

| Checkout case | Required behavior |
| --- | --- |
| `pending-hosted-retry` | Return the existing `subscriptionId`, `invoiceId`, and `externalReference` with a fresh signed `checkout` form. |

## POST /api/billing/project-addon/crypto-checkout

<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->
Creates a direct crypto checkout for a project add-on.

If a pending checkout is already linked to a provider order, retrying returns
the same `providerOrderId` and `paymentUrl`. If provider order creation or
linkage has an ambiguous result, the checkout remains pending and fails closed:
do not start another checkout until the pending one is canceled or reconciled.

| Checkout case | Required behavior |
| --- | --- |
| `pending-linked-order-retry` | Return the same `providerOrderId` and `paymentUrl`. |
| `ambiguous-provider-creation-or-linkage` | Keep `fail-closed-pending`; require `cancel-or-reconcile-before-new-attempt`. |

## POST /api/billing/coupon/redeem

<!-- api-contract: code=required-trim-case-insensitive; same-account-retry=same-couponId-same-subscriptionId-same-invoiceId-without-second-application; redeemed-by-another-account-deleted-invalid-or-unsafe-subscription-lineage=fail-closed; paid-account-plan-period=extend-overlay-or-new-term-as-applicable; response=couponId-subscriptionId-invoiceId -->
Redeems a coupon for a paid account plan.

Request body:

| Field | Required | Description |
| --- | --- | --- |
| `code` | Yes | Coupon code. Leading and trailing whitespace is removed (`trim`), and matching is `case-insensitive`. |

The coupon's paid account-plan period is applied once. Depending on the
current paid plan period, redemption extends it, overlays the applicable
period, or starts a new term.

| Redemption case | Required behavior |
| --- | --- |
| `code-normalization` | Apply `trim` and `case-insensitive` matching. |
| `same-account-retry` | Return `same-couponId`, `same-subscriptionId`, and `same-invoiceId` with `no-second-application`. |
| `unavailable-or-unsafe` | A coupon that is `redeemed-by-another-account`, `deleted`, `invalid`, or has an `unsafe-subscription-lineage` must `fail-closed`. |
| `paid-account-plan-period` | `extend`, `overlay`, or start a `new-term`, `as-applicable`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| `couponId` | Yes | Identifier of the redeemed coupon. |
| `subscriptionId` | Yes | Identifier of the resulting account-plan subscription. |
| `invoiceId` | Yes | Identifier of the paid coupon invoice. |

## POST /api/billing/coupon/gift-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; same-intent=same-requestId-planId-durationMonths; exact-replay=same-couponId-and-code-without-second-debit-or-referral-reward; conflicting-payload=rejected; new-intent=new-requestId; response=couponId-code -->
Purchases a gift coupon using the wallet balance.

Request body:

| Field | Required | Description |
| --- | --- | --- |
| `planId` | Yes | Paid account plan: `advanced` or `pro`. |
| `durationMonths` | Yes | Coupon duration: `1`, `3`, `6`, or `12` months. |
| `requestId` | No | Idempotency key containing 8-128 RFC 3986 unreserved characters: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~`, and `-`. It may be omitted for backward compatibility, but is recommended. |

Within the same account, use one stable `requestId` for one confirmed gift
purchase. If a timeout or another unknown result occurs, retry with the same
plan and duration.

| Purchase case | Required behavior |
| --- | --- |
| `same-intent` | Send the `same-requestId`, `same-planId`, and `same-durationMonths`. |
| `exact-replay` | Return the `same-couponId` and `same-code` with `no-second-debit` and `no-second-referral-reward`. |
| `conflicting-payload` | Reusing the request identifier with a different plan or duration is `rejected`. |
| `new-intent` | Generate a `new-requestId`. |
| `missing-requestId` | Remains `backward-compatible`, but is `not-retry-safe` and `not-idempotent-across-HTTP-attempts`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| `couponId` | Yes | Identifier of the purchased gift coupon. |
| `code` | Yes | Code to give to the coupon recipient. |

## GET /api/billing/referral/overview

Returns the referral balance and link summary.

## POST /api/billing/referral/link/create

Creates a referral link.

## POST /api/billing/referral/claim

Claims a referral code.

## POST /api/billing/subscription/update-renewal

Updates automatic billing renewal.

## POST /api/billing/crypto-checkout/refresh

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Refreshes the state of a crypto checkout.

For a project add-on, a late payment after checkout cancellation or project
transfer does not reactivate the subscription or project access. The payment is
handled through reconciliation or refund instead.

| Lifecycle case | Required behavior |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Preserve `no-reactivation`; use `reconciliation-or-refund`. |

## POST /api/billing/crypto-checkout/cancel

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Cancels a crypto checkout.

Cancellation is terminal for project add-on activation. If payment is observed
later, including after the project was transferred, it does not reactivate the
subscription or project access and is handled through reconciliation or refund.

| Lifecycle case | Required behavior |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Preserve `no-reactivation`; use `reconciliation-or-refund`. |
