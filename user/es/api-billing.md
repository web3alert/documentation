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

Compra con saldo un add-on de acceso gratuito para un proyecto.

## POST /api/billing/project-addon/checkout

Crea un checkout para un add-on de proyecto.

## POST /api/billing/project-addon/crypto-checkout

Crea un checkout directo con criptomonedas para un add-on de proyecto.

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

Actualiza el estado de un checkout con criptomonedas.

## POST /api/billing/crypto-checkout/cancel

Cancela un checkout con criptomonedas.
