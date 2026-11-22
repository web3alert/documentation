# API de facturación

Estos endpoints públicos permiten gestionar planes de cuenta, saldo, add-ons de
proyecto, cupones, referidos y la renovación. Los callbacks del proveedor de
pago no forman parte de la API pública.

## GET /api/billing/overview

Devuelve el resumen de facturación de la cuenta actual.

## GET /api/billing/wallet/overview

Devuelve el resumen del saldo y del monedero de la cuenta.

Con una clave de agente, la respuesta omite los códigos de los cupones regalo sin usar.

## POST /api/billing/wallet/crypto-topup

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
Crea una recarga de saldo con criptomonedas. Si se proporciona `returnUrl` o
`cancelUrl`, la API establece su parámetro de consulta `externalReference` con
la referencia exacta de la recarga creada y sustituye cualquier valor anterior.
Conserva esa referencia durante la redirección del proveedor.

## POST /api/billing/wallet/x402-topup

Requiere una sesión o clave de agente con `manage`. Envía `{ amountEur }` de 5 a 500 €, con hasta dos decimales. Paga en USDC en Base al tipo de referencia del BCE para el USD, usando 1 USDC = 1 USD sin recargo.

Antes de firmar, comprueba que la URL de pago sea exactamente `https://web3alert.io/api/billing/wallet/x402-topup`, la red sea Base (`eip155:8453`) y el activo sea USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`). Si falla alguna comprobación, detente. Envía la clave y la firma del pago únicamente a esa URL.

Una solicitud sin `PAYMENT-SIGNATURE` devuelve `402` con una cotización x402 v2 `PaymentRequired` en el cuerpo y la misma cotización codificada en base64 en `PAYMENT-REQUIRED`. La cotización dura 300 segundos. El importe en USDC se redondea hacia arriba al céntimo y `resource.url` usa el origen público configurado. Firma con tu cartera conservando `accepts[0].extra.quoteId` y envía el mismo cuerpo con `PAYMENT-SIGNATURE` en base64. Para un pago nuevo, una cotización caducada, que no coincide o de otro espacio devuelve una nueva cotización `402`.

Un pago liquidado devuelve `200` con `PAYMENT-RESPONSE` y `{ topupId, amountEur, usdcAmount, transaction, network, balanceEur }`.

Si recibes `202` con `{ status: "pending", topupId }`, reintenta un número limitado de veces con el mismo cuerpo y la misma firma en el mismo espacio. Si sigue pendiente, detente, guarda el `topupId` para que el operador lo concilie y no autorices otro pago para el mismo fin. El endpoint de actualización de recargas alojadas no se aplica a los registros x402.

Repetir un pago liquidado devuelve el resultado original. Un pago rechazado devuelve `402` con `error` como cadena en el cuerpo y los detalles del fallo en `PAYMENT-RESPONSE`. Los fallos de servicio devuelven `502 facilitator_unavailable`, `503 x402_unavailable` o `503 rate_unavailable`.

## POST /api/billing/wallet/topup/refresh

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
Actualiza el estado de la recarga identificada por `topupId` o
`externalReference`. Usa un identificador devuelto por la respuesta de creación
o por la URL de retorno; no deduzcas el destino a partir de la recarga más
reciente. Una página de retorno no debe solicitar la actualización si falta el
identificador, está repetido o entra en conflicto con otro identificador.

Este endpoint es para recargas alojadas. Para registros x402, sigue el [procedimiento de recarga x402](#post-api-billing-wallet-x402-topup).

## POST /api/billing/account-plan/balance-purchase

Las claves de agente requieren `spend` y deben usar `autoRenew: false`. Si la compra supera el límite mensual, devuelve `403 spend_cap_exceeded`. Comprar un plan con una clave mientras hay un plan activo con renovación automática devuelve `403 key_not_allowed` antes de efectuar el cargo. Un checkout pendiente o un plan superior activo también pueden bloquear la compra antes de efectuar un cargo. Resuelve primero el plan o el checkout existente.

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

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

Crea un checkout para un plan de cuenta.

## POST /api/billing/account-plan/crypto-checkout

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

Crea un checkout directo con criptomonedas para un plan de cuenta.

## POST /api/billing/project-addon/balance-purchase

Las claves de agente requieren `spend` y deben usar `autoRenew: false`. Si la compra supera el límite mensual, devuelve `403 spend_cap_exceeded`.

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

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
Crea un checkout para un add-on de proyecto.

Si el checkout alojado correspondiente sigue pendiente, un reintento devuelve
los `subscriptionId`, `invoiceId` y `externalReference` existentes junto con un
nuevo formulario `checkout` firmado. Envía el último formulario devuelto.

| Caso del checkout | Comportamiento obligatorio |
| --- | --- |
| `pending-hosted-retry` | Devuelve los `subscriptionId`, `invoiceId` y `externalReference` existentes con un nuevo formulario `checkout` firmado. |

## POST /api/billing/project-addon/crypto-checkout

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

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

<!-- api-contract: code=required-trim-case-insensitive; same-account-retry=same-couponId-same-subscriptionId-same-invoiceId-without-second-application; redeemed-by-another-account-deleted-invalid-or-unsafe-subscription-lineage=fail-closed; paid-account-plan-period=extend-overlay-or-new-term-as-applicable; response=couponId-subscriptionId-invoiceId -->
Canjea un cupón para un plan de cuenta de pago.

Cuerpo de la solicitud:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `code` | Sí | Código del cupón. Se eliminan los espacios iniciales y finales (`trim`) y la comparación es `case-insensitive`. |

El periodo pagado del plan de cuenta del cupón se aplica una sola vez. Según
el periodo de pago actual, el canje lo amplía, superpone el periodo aplicable
o inicia un periodo nuevo.

| Caso de canje | Comportamiento obligatorio |
| --- | --- |
| `code-normalization` | Aplica `trim` y comparación `case-insensitive`. |
| `same-account-retry` | Devuelve `same-couponId`, `same-subscriptionId` y `same-invoiceId` con `no-second-application`. |
| `unavailable-or-unsafe` | Un cupón `redeemed-by-another-account`, `deleted`, `invalid` o con `unsafe-subscription-lineage` debe hacer `fail-closed`. |
| `paid-account-plan-period` | Usa `extend`, `overlay` o inicia un `new-term`, `as-applicable`. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `couponId` | Sí | Identificador del cupón canjeado. |
| `subscriptionId` | Sí | Identificador de la suscripción resultante del plan de cuenta. |
| `invoiceId` | Sí | Identificador de la factura pagada del cupón. |

## POST /api/billing/coupon/gift-purchase

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; same-intent=same-requestId-planId-durationMonths; exact-replay=same-couponId-and-code-without-second-debit-or-referral-reward; conflicting-payload=rejected; new-intent=new-requestId; response=couponId-code -->
Compra un cupón regalo usando el saldo del monedero.

Cuerpo de la solicitud:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `planId` | Sí | Plan de cuenta de pago: `advanced` o `pro`. |
| `durationMonths` | Sí | Duración del cupón: `1`, `3`, `6` o `12` meses. |
| `requestId` | No | Clave de idempotencia de 8-128 caracteres unreserved de RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` y `-`. Puede omitirse por compatibilidad con clientes anteriores, pero se recomienda usarla. |

Dentro de la misma cuenta, usa un `requestId` estable para una única compra de
regalo confirmada. Si se produce un timeout u otro resultado desconocido,
repite la solicitud con el mismo plan y la misma duración.

| Caso de compra | Comportamiento obligatorio |
| --- | --- |
| `same-intent` | Envía el `same-requestId`, `same-planId` y `same-durationMonths`. |
| `exact-replay` | Devuelve el `same-couponId` y el `same-code` con `no-second-debit` y `no-second-referral-reward`. |
| `conflicting-payload` | Reutilizar el identificador de solicitud con otro plan o duración es `rejected`. |
| `new-intent` | Genera un `new-requestId`. |
| `missing-requestId` | Mantiene `backward-compatible`, pero es `not-retry-safe` y `not-idempotent-across-HTTP-attempts`. |

Respuesta: HTTP 200 OK.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `couponId` | Sí | Identificador del cupón regalo comprado. |
| `code` | Sí | Código que se entrega al destinatario del cupón. |

## GET /api/billing/referral/overview

Devuelve el resumen del saldo y del enlace de referidos.

## POST /api/billing/referral/link/create

Crea un enlace de referido.

## POST /api/billing/referral/claim

Reclama un código de referido.

## POST /api/billing/subscription/update-renewal

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

Actualiza la renovación automática de la facturación.

## POST /api/billing/crypto-checkout/refresh

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Actualiza el estado de un checkout con criptomonedas.

Para un add-on de proyecto, un pago tardío tras cancelar el checkout o transferir
el proyecto no reactiva la suscripción ni el acceso al proyecto. El pago pasa a
reconciliación o reembolso.

| Caso del ciclo de vida | Comportamiento obligatorio |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Conserva `no-reactivation` y usa `reconciliation-or-refund`. |

## POST /api/billing/crypto-checkout/cancel

Requiere un token de sesión de cuenta. Las claves de agente reciben `403 key_not_allowed`.

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Cancela un checkout con criptomonedas.

La cancelación es definitiva para la activación del add-on del proyecto. Si el
pago se detecta más tarde, incluso después de transferir el proyecto, no se
reactivan la suscripción ni el acceso y se aplica reconciliación o reembolso.

| Caso del ciclo de vida | Comportamiento obligatorio |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Conserva `no-reactivation` y usa `reconciliation-or-refund`. |
