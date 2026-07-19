# API de faturação

Estes endpoints públicos permitem gerir planos de conta, saldo, add-ons de
projeto, cupões, referências e renovação. Os callbacks do fornecedor de
pagamentos não fazem parte da API pública.

## GET /api/billing/overview

Devolve a visão geral da faturação da conta atual.

## GET /api/billing/wallet/overview

Devolve a visão geral do saldo e da carteira da conta.

## POST /api/billing/wallet/crypto-topup

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
Cria um carregamento de saldo com criptomoeda. Quando `returnUrl` ou
`cancelUrl` é fornecido, a API define o parâmetro de consulta
`externalReference` com a referência exata do carregamento criado, substituindo
qualquer valor anterior. Preserve essa referência durante o redirecionamento do
fornecedor.

## POST /api/billing/wallet/topup/refresh

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
Atualiza o estado do carregamento identificado por `topupId` ou
`externalReference`. Use um identificador devolvido pela resposta de criação ou
pelo URL de retorno; não deduza o destino a partir do carregamento mais recente.
Uma página de retorno não deve pedir a atualização se o identificador estiver
ausente, repetido ou em conflito com outro identificador.

## POST /api/billing/account-plan/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->
Compra ou atualiza um plano de conta usando o saldo da carteira.

Corpo do pedido:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `planId` | Sim | Plano de destino: `advanced` ou `pro`. |
| `durationMonths` | Sim | Período de faturação: `1`, `3`, `6` ou `12` meses. |
| `autoRenew` | Não | Indica se a subscrição resultante é renovada automaticamente. Quando omitida, o valor predefinido é `false`. |
| `requestId` | Não | Chave de idempotência com 8-128 caracteres unreserved do RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` e `-`. Pode ser omitida para compatibilidade com clientes anteriores, mas é recomendada. |

Use um `requestId` estável para uma única intenção confirmada pelo utilizador.
Se ocorrer um timeout ou outro resultado desconhecido, repita o pedido com o
mesmo payload e `requestId`. Uma repetição exata devolve os `subscriptionId` e
`invoiceId` originais sem um segundo débito na carteira. A reutilização desse
`requestId` com outro `planId`, `durationMonths` ou `autoRenew` é rejeitada.
Gere um novo `requestId` para uma nova intenção de compra. Sem `requestId`, o
pedido continua a ser aceite para compatibilidade com clientes anteriores, mas
tentativas HTTP separadas não são retry-safe nem idempotentes.

| Caso de idempotência | Comportamento obrigatório |
| --- | --- |
| `same-intent` | Envie o `same-requestId` com o `same-payload`. |
| `exact-replay` | Devolve `original-subscriptionId` e `original-invoiceId` com `no-second-debit`. |
| `conflicting-payload` | O pedido é `rejected`. |
| `new-intent` | Gere um `new-requestId`. |
| `missing-requestId` | Mantém `backward-compatible`, mas é `not-retry-safe` e `not-idempotent-across-HTTP-attempts`. |

Resposta: HTTP 200 OK.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `subscriptionId` | Sim | Identificador da subscrição ativada. |
| `invoiceId` | Sim | Identificador da fatura paga. |

## POST /api/billing/account-plan/checkout

Cria um checkout para um plano de conta.

## POST /api/billing/account-plan/crypto-checkout

Cria um checkout direto com criptomoeda para um plano de conta.

## POST /api/billing/project-addon/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->
Compra com saldo um add-on de acesso gratuito para um projeto.

Corpo do pedido:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `projectFullname` | Sim | Nome completo do projeto que recebe o add-on. |
| `addonCode` | Sim | Identificador do add-on: `project-free-access`. |
| `durationMonths` | Sim | Período de faturação: `1`, `3`, `6` ou `12` meses. |
| `autoRenew` | Não | Indica se a subscrição resultante é renovada automaticamente. Quando omitida, o valor predefinido é `false`. |
| `requestId` | Não | Chave de idempotência com 8-128 caracteres unreserved do RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` e `-`. Pode ser omitida para compatibilidade com clientes anteriores, mas é recomendada. |

Use um `requestId` estável para uma única intenção confirmada pelo utilizador.
Se ocorrer um timeout ou outro resultado desconhecido, repita o pedido com o
mesmo `requestId` e o mesmo payload completo, incluindo `projectFullname`,
`addonCode`, `durationMonths` e `autoRenew`. Uma repetição exata devolve os
`subscriptionId` e `invoiceId` originais sem um segundo débito na carteira. A
reutilização desse `requestId` depois de alterar qualquer um desses campos é
rejeitada. Gere um novo `requestId` para uma nova intenção de compra. Sem
`requestId`, o pedido continua a ser aceite para compatibilidade com clientes
anteriores, mas tentativas HTTP separadas não são retry-safe nem idempotentes.

| Caso de idempotência | Comportamento obrigatório |
| --- | --- |
| `same-intent` | Envie o `same-requestId` com o `same-full-payload`: `projectFullname`, `addonCode`, `durationMonths` e `autoRenew`. |
| `exact-replay` | Devolve `original-subscriptionId` e `original-invoiceId` com `no-second-debit`. |
| `conflicting-payload` | Alterar `projectFullname`, `addonCode`, `durationMonths` ou `autoRenew` faz com que o pedido seja rejeitado (`rejected`). |
| `new-intent` | Gere um `new-requestId`. |
| `missing-requestId` | Mantém `backward-compatible`, mas é `not-retry-safe` e `not-idempotent-across-HTTP-attempts`. |

Resposta: HTTP 200 OK.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `subscriptionId` | Sim | Identificador da subscrição ativada do add-on do projeto. |
| `invoiceId` | Sim | Identificador da fatura paga. |

## POST /api/billing/project-addon/checkout

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
Cria um checkout para um add-on de projeto.

Se o checkout alojado correspondente continuar pendente, uma nova tentativa
devolve os `subscriptionId`, `invoiceId` e `externalReference` existentes,
juntamente com um novo formulário `checkout` assinado. Envie o último formulário
devolvido.

| Caso do checkout | Comportamento obrigatório |
| --- | --- |
| `pending-hosted-retry` | Devolve os `subscriptionId`, `invoiceId` e `externalReference` existentes com um novo formulário `checkout` assinado. |

## POST /api/billing/project-addon/crypto-checkout

<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->
Cria um checkout direto com criptomoeda para um add-on de projeto.

Se um checkout pendente já estiver associado a uma ordem do fornecedor, a nova
tentativa devolve os mesmos `providerOrderId` e `paymentUrl`. Se a criação ou
associação da ordem tiver um resultado ambíguo, o checkout permanece pendente e
falha de forma fechada: não inicie outro até cancelar ou reconciliar o checkout
pendente.

| Caso do checkout | Comportamento obrigatório |
| --- | --- |
| `pending-linked-order-retry` | Devolve os mesmos `providerOrderId` e `paymentUrl`. |
| `ambiguous-provider-creation-or-linkage` | Mantém `fail-closed-pending` e exige `cancel-or-reconcile-before-new-attempt`. |

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

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Atualiza o estado de um checkout com criptomoeda.

Para um add-on de projeto, um pagamento tardio após o cancelamento do checkout
ou a transferência do projeto não reativa a subscrição nem o acesso ao projeto.
O pagamento segue para reconciliação ou reembolso.

| Caso do ciclo de vida | Comportamento obrigatório |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Preserva `no-reactivation` e usa `reconciliation-or-refund`. |

## POST /api/billing/crypto-checkout/cancel

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Cancela um checkout com criptomoeda.

O cancelamento é definitivo para a ativação do add-on do projeto. Se o pagamento
for observado mais tarde, incluindo depois da transferência do projeto, não
reativa a subscrição nem o acesso e segue para reconciliação ou reembolso.

| Caso do ciclo de vida | Comportamento obrigatório |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Preserva `no-reactivation` e usa `reconciliation-or-refund`. |
