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

Compra o mejora un plan de cuenta usando el saldo del monedero.

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
