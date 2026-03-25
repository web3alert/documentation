# Marketplace Billing Architecture for xMoney

Status: proposed target architecture for implementation in the monorepo as of 22 March 2026.

## Goals

- Use xMoney as the single payment provider.
- Support recurring monthly billing for `Advanced`, `Pro`, and the paid `free project` add-on.
- Accept card payments and wallet payments (`Apple Pay`, `Google Pay`) for the initial recurring checkout.
- Support one-off crypto payments for manual billing cycles.
- Keep product entitlements inside Web3Alert, not inside xMoney.

## What xMoney gives us

From the current xMoney docs:

- Fiat recurring billing is supported through `POST /order` with `orderType=recurring`, `intervalType`, and `intervalValue`.
- xMoney recommends `saveCard` on the initial payment and then reusing `cardId` for future payments.
- Hosted Checkout is the simplest PCI-light integration and supports redirect plus server-to-server notification.
- Hosted or Embedded Checkout can show `Apple Pay` and `Google Pay` buttons when enabled on the merchant account.
- Fiat payment notifications use encrypted `opensslResult` payloads and must be acknowledged with `HTTP 200` and body `OK`.
- Crypto payments are a separate API surface (`/stores/orders`) with asynchronous confirmation, HMAC-signed webhooks, and confirmation times that can take up to 2 hours.

## Core billing model

There are 2 billable product families:

1. Account plan
   - `Free`
   - `Advanced` = 15 EUR / month
   - `Pro` = 50 EUR / month

2. Project add-on
   - `Free Project Access` = 150 EUR / month per project

There are also 2 payment strategies:

1. `xmoney-recurring`
   - Used for card-based recurring subscriptions.
   - Initial checkout may expose card, Apple Pay, or Google Pay.
   - Ongoing rebills are treated as xMoney recurring orders.

2. `xmoney-crypto-manual`
   - Used for one-off crypto renewal payments.
   - No auto-renew promise.
   - Each billing cycle creates a payable invoice; the user manually pays it in crypto.

This means the system must treat recurring entitlement and crypto entitlement as the same internal subscription model with different settlement strategies.

## Internal source of truth

Web3Alert should be the source of truth for entitlements.

xMoney should be treated as:

- payment rail
- tokenization vault for card-based flows
- recurring charge executor for fiat
- crypto order processor for one-off crypto renewals

Do not derive account tier or project free-access only from xMoney order state.

Instead:

- xMoney events update internal billing records
- internal billing records project into product entitlements

## Recommended collections

### `billing_customer`

One row per account.

Suggested fields:

- `id`
- `accountId`
- `provider = xmoney`
- `providerCustomerId`
- `providerCustomerIdentifier`
- `defaultCardId`
- `defaultPaymentMethodType`
- `email`
- `country`
- `meta`
- `createdAt`
- `updatedAt`

Purpose:

- map Web3Alert account to xMoney customer
- store reusable `cardId`
- remember the default payment instrument for recurring charges

### `billing_subscription`

One row per billable item.

Examples:

- one account-plan subscription for `Advanced`
- one account-plan subscription for `Pro`
- one project-addon subscription for project `workspace.project-a`

Suggested fields:

- `id`
- `provider = xmoney`
- `kind = account-plan | project-addon`
- `status = draft | pending_activation | active | past_due | cancel_at_period_end | canceled`
- `paymentStrategy = xmoney-recurring | xmoney-crypto-manual`
- `accountId`
- `workspaceFullname`
- `projectFullname`
- `planId`
- `addonCode`
- `currency`
- `amountMinor`
- `interval`
- `providerOrderId`
- `providerCustomerId`
- `providerCardId`
- `paymentMethodType`
- `externalReference`
- `currentPeriodStartAt`
- `currentPeriodEndAt`
- `nextBillingAt`
- `cancelAtPeriodEnd`
- `meta`
- `createdAt`
- `updatedAt`

Purpose:

- primary billing contract inside the product
- input into entitlement projection

### `billing_invoice`

One row per billing cycle or one-off payment request.

Suggested fields:

- `id`
- `provider = xmoney`
- `mode = fiat | crypto`
- `status = draft | pending_payment | paid | failed | voided | refunded`
- `kind = account-plan | project-addon`
- `accountId`
- `workspaceFullname`
- `projectFullname`
- `subscriptionId`
- `currency`
- `amountMinor`
- `paymentMethodType`
- `externalReference`
- `providerOrderId`
- `providerTransactionId`
- `dueAt`
- `paidAt`
- `voidedAt`
- `meta`
- `createdAt`
- `updatedAt`

Purpose:

- auditable invoice/payment state
- unify fiat and crypto outcomes
- support future refund and accounting tooling

### `billing_event`

Raw idempotent webhook inbox.

Suggested fields:

- `id`
- `provider = xmoney`
- `mode = fiat | crypto`
- `externalReference`
- `providerOrderId`
- `providerTransactionId`
- `eventType`
- `status = received | processed | ignored | failed`
- `payload`
- `error`
- `receivedAt`
- `processedAt`

Purpose:

- dedupe webhooks
- keep raw audit trail
- make retry-safe processing possible

## Entitlement projection

### Account tier

Projected from the latest active `billing_subscription` of kind `account-plan`.

Rules:

- no active paid subscription -> `Free`
- active `Advanced` subscription -> `Advanced`
- active `Pro` subscription -> `Pro`
- past-due or canceled paid subscription after grace period -> downgrade to `Free`

### Free project access

Projected from the latest active `billing_subscription` of kind `project-addon` for the specific project.

Rules:

- active paid add-on -> project `accessLevel = free`
- unpaid / canceled / expired add-on -> project falls back to `public` or `private`, depending on stored product setting

Important:

`accessLevel = free` must remain blocked until there is an active paid add-on. This matches the current backend guard already added in the API.

## Checkout flows

### Flow A: account plan via recurring fiat

1. User selects `Advanced` or `Pro`.
2. Backend creates internal `billing_subscription` in `pending_activation`.
3. Backend creates xMoney fiat order:
   - `orderType = recurring`
   - `intervalType = month`
   - `intervalValue = 1`
   - `currency = EUR`
   - `saveCard = true`
   - `description = plan label`
   - `customData` includes internal subscription and account identifiers
4. Frontend redirects user to xMoney Hosted Checkout.
5. Checkout displays card plus enabled wallets.
6. User completes initial payment.
7. Browser returns to `backUrl` for UX only.
8. Server-to-server fiat webhook decrypts `opensslResult`.
9. If transaction is successful, mark invoice paid, subscription active, and project entitlements.

### Flow B: project add-on via recurring fiat

Exactly the same as Flow A, except:

- `kind = project-addon`
- `projectFullname` is required
- `amountMinor = 15000`
- entitlement toggles project-level `free` access

This should be one recurring subscription per project, not one quantity aggregate.

Reason:

- easier cancel/resume per project
- easier audit trail
- cleaner entitlement rollback when a single project stops being paid

### Flow C: account plan via one-off crypto

1. User selects `Advanced` or `Pro` and chooses crypto.
2. Backend creates or reuses a `billing_subscription` with `paymentStrategy = xmoney-crypto-manual`.
3. Backend creates a `billing_invoice` for one month.
4. Backend creates xMoney crypto order for that invoice.
5. Frontend redirects to xMoney crypto widget.
6. Customer returns to the app after wallet submission.
7. Do not activate entitlement on return redirect.
8. Wait for crypto webhook `ORDER.PAYMENT.RECEIVED`.
9. When confirmed, mark invoice paid and extend the billing period by one month.

### Flow D: project add-on via one-off crypto

Same as Flow C, but invoice/subscription targets one specific project.

## Webhook architecture

Use two different webhook handlers.

### Fiat webhook

Endpoint example:

- `POST /api/v1/billing/xmoney/fiat/webhook`

Handling rules:

- decrypt `opensslResult`
- acknowledge with `HTTP 200` and body `OK`
- dedupe by transaction/order identity and payload hash
- update `billing_event`
- update `billing_invoice`
- update `billing_subscription`
- recompute entitlements

Do not trust `backUrl` redirect for entitlement activation.

### Crypto webhook

Endpoint example:

- `POST /api/v1/billing/xmoney/crypto/webhook`

Handling rules:

- verify HMAC SHA256 signature
- acknowledge with HTTP 2xx JSON
- dedupe by `event_type` and order reference
- update `billing_event`
- update `billing_invoice`
- update `billing_subscription`
- recompute entitlements

Because xMoney crypto confirmation can take up to 2 hours, this webhook is the only reliable activation point.

## xMoney-specific integration notes

### 1. Prefer Hosted Checkout first

Hosted Checkout is the safest MVP because:

- lower PCI burden
- simplest redirect-based integration
- built-in wallet presentation
- consistent flow with xMoney docs

Embedded Checkout can be added later if conversion improvements justify it.

### 2. Use internal references everywhere

Every xMoney order should include an internal reference in `customData`.

Recommended keys:

- `billingSubscriptionId`
- `billingInvoiceId`
- `accountId`
- `workspaceFullname`
- `projectFullname`
- `billableKind`
- `planId`
- `addonCode`

### 3. Separate fiat and crypto processors in code

Do not share webhook verification logic between them.

Reason:

- fiat uses encrypted `opensslResult`
- crypto uses HMAC-signed JSON payloads
- retry behavior is different
- state transitions are different

### 4. Apple Pay and Google Pay need sandbox validation for recurring token reuse

Inference from docs:

- xMoney clearly supports wallets in checkout
- xMoney clearly supports recurring billing via saved `cardId`

What is not explicitly documented on the pages above:

- whether every wallet-origin initial recurring payment reliably yields a reusable recurring instrument in exactly the same way as direct card tokenization

So MVP should:

- allow wallets in initial hosted checkout
- treat recurring rebills as xMoney recurring/card-token flow
- validate wallet-origin recurring behavior in sandbox before production rollout

## Product rules to enforce in billing code

- Only one active paid account plan per account.
- Only one active paid free-project add-on per project.
- `Free` plan has no recurring subscription row unless needed for history.
- Upgrades:
  - MVP recommendation: activate immediately and reset billing cycle from now.
- Downgrades:
  - MVP recommendation: schedule for period end.
- Cancelation:
  - recurring fiat: stop future rebills and preserve access until current period end
  - crypto manual: simply do not generate the next invoice automatically

## Rollout order

### Phase 1

- internal billing collections
- billing catalog
- fiat recurring checkout for `Advanced` and `Pro`
- fiat recurring checkout for project add-on
- fiat webhook processing
- entitlement projector

### Phase 2

- crypto one-off invoices for account plan renewals
- crypto one-off invoices for project add-on renewals
- crypto webhook processing
- billing UI timeline and invoices list

### Phase 3

- refunds and admin tooling
- payment method update flow
- dunning UX
- scheduled downgrade jobs

## Recommended next implementation slice

1. Add billing collections and entity classes in `api`.
2. Add billing catalog import points from `@web3alert/billing-types`.
3. Create fiat checkout init endpoint for account-plan subscriptions.
4. Create fiat webhook endpoint with xMoney payload decryption.
5. Project internal billing state into:
   - `account.tier`
   - project `accessLevel = free` eligibility
