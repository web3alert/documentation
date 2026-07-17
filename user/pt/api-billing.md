# API de faturação

Estes endpoints públicos permitem gerir planos de conta, saldo, add-ons de
projeto, cupões, referências e renovação. Os callbacks do fornecedor de
pagamentos não fazem parte da API pública.

## GET /api/billing/overview

Devolve a visão geral da faturação da conta atual.

## GET /api/billing/wallet/overview

Devolve a visão geral do saldo e da carteira da conta.

## POST /api/billing/wallet/crypto-topup

Cria um carregamento de saldo com criptomoeda.

## POST /api/billing/wallet/topup/refresh

Atualiza o estado de um carregamento de saldo.

## POST /api/billing/account-plan/balance-purchase

Compra ou atualiza um plano de conta usando o saldo da carteira.

## POST /api/billing/account-plan/checkout

Cria um checkout para um plano de conta.

## POST /api/billing/account-plan/crypto-checkout

Cria um checkout direto com criptomoeda para um plano de conta.

## POST /api/billing/project-addon/balance-purchase

Compra com saldo um add-on de acesso gratuito para um projeto.

## POST /api/billing/project-addon/checkout

Cria um checkout para um add-on de projeto.

## POST /api/billing/project-addon/crypto-checkout

Cria um checkout direto com criptomoeda para um add-on de projeto.

## POST /api/billing/coupon/redeem

Resgata um cupão.

## POST /api/billing/coupon/gift-purchase

Compra um cupão-presente usando o saldo da carteira.

## GET /api/billing/referral/overview

Devolve o resumo do saldo e da ligação de referência.

## POST /api/billing/referral/link/create

Cria uma ligação de referência.

## POST /api/billing/referral/claim

Resgata um código de referência.

## POST /api/billing/subscription/update-renewal

Atualiza a renovação automática da faturação.

## POST /api/billing/crypto-checkout/refresh

Atualiza o estado de um checkout com criptomoeda.

## POST /api/billing/crypto-checkout/cancel

Cancela um checkout com criptomoeda.
