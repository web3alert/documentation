# API de facturación

Estos endpoints públicos permiten gestionar planes de cuenta, saldo, add-ons de
proyecto, cupones, referidos y la renovación. Los callbacks del proveedor de
pago no forman parte de la API pública.

## GET /api/billing/overview

Devuelve el resumen de facturación de la cuenta actual.

## GET /api/billing/wallet/overview

Devuelve el resumen del saldo y del monedero de la cuenta.

## POST /api/billing/wallet/crypto-topup

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
Crea una recarga de saldo con criptomonedas. Si se proporciona `returnUrl` o
`cancelUrl`, la API establece su parámetro de consulta `externalReference` con
la referencia exacta de la recarga creada y sustituye cualquier valor anterior.
Conserva esa referencia durante la redirección del proveedor.

## POST /api/billing/wallet/topup/refresh

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
Actualiza el estado de la recarga identificada por `topupId` o
`externalReference`. Usa un identificador devuelto por la respuesta de creación
o por la URL de retorno; no deduzcas el destino a partir de la recarga más
reciente. Una página de retorno no debe solicitar la actualización si falta el
identificador, está repetido o entra en conflicto con otro identificador.

## POST /api/billing/account-plan/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->
Compra o mejora un plan de cuenta usando el saldo del monedero.

Cuerpo de la solicitud:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `planId` | Sí | Plan de destino: `advanced` o `pro`. |
| `durationMonths` | Sí | Periodo de facturación: `1`, `3`, `6` o `12` meses. |
| `autoRenew` | No | Indica si la suscripción resultante se renueva automáticamente. Si se omite, su valor predeterminado es `false`. |
| `requestId` | No | Clave de idempotencia de 8-128 caracteres unreserved de RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` y `-`. Puede omitirse por compatibilidad con clientes anteriores, pero se recomienda usarla. |

Usa un `requestId` estable para una única intención confirmada por el usuario.
Si se produce un timeout u otro resultado desconocido, repite la solicitud con
el mismo payload y `requestId`. Una repetición exacta devuelve los
`subscriptionId` e `invoiceId` originales sin un segundo cargo al monedero. Se
rechaza la reutilización de ese `requestId` con otro `planId`, `durationMonths`
o `autoRenew`. Genera un `requestId` nuevo para una nueva intención de compra.
Sin `requestId`, la solicitud sigue aceptándose por compatibilidad con clientes
anteriores, pero los intentos HTTP separados no son retry-safe ni idempotentes.

| Caso de idempotencia | Comportamiento obligatorio |
| --- | --- |
| `same-intent` | Envía el `same-requestId` con el `same-payload`. |
| `exact-replay` | Devuelve `original-subscriptionId` y `original-invoiceId` con `no-second-debit`. |
| `conflicting-payload` | La solicitud es `rejected`. |
| `new-intent` | Genera un `new-requestId`. |
| `missing-requestId` | Mantiene `backward-compatible`, pero es `not-retry-safe` y `not-idempotent-across-HTTP-attempts`. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `subscriptionId` | Sí | Identificador de la suscripción activada. |
| `invoiceId` | Sí | Identificador de la factura pagada. |

## POST /api/billing/account-plan/checkout

Crea un checkout para un plan de cuenta.

## POST /api/billing/account-plan/crypto-checkout

Crea un checkout directo con criptomonedas para un plan de cuenta.

## POST /api/billing/project-addon/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->
Compra con saldo un add-on de acceso gratuito para un proyecto.

Cuerpo de la solicitud:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `projectFullname` | Sí | Nombre completo del proyecto que recibirá el add-on. |
| `addonCode` | Sí | Identificador del add-on: `project-free-access`. |
| `durationMonths` | Sí | Periodo de facturación: `1`, `3`, `6` o `12` meses. |
| `autoRenew` | No | Indica si la suscripción resultante se renueva automáticamente. Si se omite, su valor predeterminado es `false`. |
| `requestId` | No | Clave de idempotencia de 8-128 caracteres unreserved de RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` y `-`. Puede omitirse por compatibilidad con clientes anteriores, pero se recomienda usarla. |

Usa un `requestId` estable para una única intención confirmada por el usuario.
Si se produce un timeout u otro resultado desconocido, repite la solicitud con
el mismo `requestId` y el mismo payload completo, incluidos `projectFullname`,
`addonCode`, `durationMonths` y `autoRenew`. Una repetición exacta devuelve los
`subscriptionId` e `invoiceId` originales sin un segundo cargo al monedero. Se
rechaza la reutilización de ese `requestId` tras cambiar cualquiera de esos
campos. Genera un `requestId` nuevo para una nueva intención de compra. Sin
`requestId`, la solicitud sigue aceptándose por compatibilidad con clientes
anteriores, pero los intentos HTTP separados no son retry-safe ni idempotentes.

| Caso de idempotencia | Comportamiento obligatorio |
| --- | --- |
| `same-intent` | Envía el `same-requestId` con el `same-full-payload`: `projectFullname`, `addonCode`, `durationMonths` y `autoRenew`. |
| `exact-replay` | Devuelve `original-subscriptionId` y `original-invoiceId` con `no-second-debit`. |
| `conflicting-payload` | Cambiar `projectFullname`, `addonCode`, `durationMonths` o `autoRenew` hace que la solicitud sea rechazada (`rejected`). |
| `new-intent` | Genera un `new-requestId`. |
| `missing-requestId` | Mantiene `backward-compatible`, pero es `not-retry-safe` y `not-idempotent-across-HTTP-attempts`. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `subscriptionId` | Sí | Identificador de la suscripción activada del add-on del proyecto. |
| `invoiceId` | Sí | Identificador de la factura pagada. |

## POST /api/billing/project-addon/checkout

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
Crea un checkout para un add-on de proyecto.

Si el checkout alojado correspondiente sigue pendiente, un reintento devuelve
los `subscriptionId`, `invoiceId` y `externalReference` existentes junto con un
nuevo formulario `checkout` firmado. Envía el último formulario devuelto.

| Caso del checkout | Comportamiento obligatorio |
| --- | --- |
| `pending-hosted-retry` | Devuelve los `subscriptionId`, `invoiceId` y `externalReference` existentes con un nuevo formulario `checkout` firmado. |

## POST /api/billing/project-addon/crypto-checkout

<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->
Crea un checkout directo con criptomonedas para un add-on de proyecto.

Si un checkout pendiente ya está vinculado a una orden del proveedor, el
reintento devuelve los mismos `providerOrderId` y `paymentUrl`. Si la creación o
vinculación de la orden tiene un resultado ambiguo, el checkout permanece
pendiente y falla de forma cerrada: no inicies otro hasta cancelar o reconciliar
el pendiente.

| Caso del checkout | Comportamiento obligatorio |
| --- | --- |
| `pending-linked-order-retry` | Devuelve los mismos `providerOrderId` y `paymentUrl`. |
| `ambiguous-provider-creation-or-linkage` | Mantiene `fail-closed-pending` y exige `cancel-or-reconcile-before-new-attempt`. |

## POST /api/billing/coupon/redeem

Canjea un cupón.

## POST /api/billing/coupon/gift-purchase

Compra un cupón regalo usando el saldo del monedero.

## GET /api/billing/referral/overview

Devuelve el resumen del saldo y del enlace de referidos.

## POST /api/billing/referral/link/create

Crea un enlace de referido.

## POST /api/billing/referral/claim

Reclama un código de referido.

## POST /api/billing/subscription/update-renewal

Actualiza la renovación automática de la facturación.

## POST /api/billing/crypto-checkout/refresh

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Actualiza el estado de un checkout con criptomonedas.

Para un add-on de proyecto, un pago tardío tras cancelar el checkout o transferir
el proyecto no reactiva la suscripción ni el acceso al proyecto. El pago pasa a
reconciliación o reembolso.

| Caso del ciclo de vida | Comportamiento obligatorio |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Conserva `no-reactivation` y usa `reconciliation-or-refund`. |

## POST /api/billing/crypto-checkout/cancel

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Cancela un checkout con criptomonedas.

La cancelación es definitiva para la activación del add-on del proyecto. Si el
pago se detecta más tarde, incluso después de transferir el proyecto, no se
reactivan la suscripción ni el acceso y se aplica reconciliación o reembolso.

| Caso del ciclo de vida | Comportamiento obligatorio |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Conserva `no-reactivation` y usa `reconciliation-or-refund`. |
