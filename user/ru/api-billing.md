# API биллинга

Эти публичные endpoints управляют тарифом account, балансом, project add-ons,
купонами, referral-программой и продлением. Callback-ручки платежных провайдеров
не входят в публичный API.

## GET /api/billing/overview

Возвращает обзор биллинга текущего account.

## GET /api/billing/wallet/overview

Возвращает обзор баланса и кошелька account.

## POST /api/billing/wallet/crypto-topup

<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->
Создает пополнение баланса криптовалютой. Если передан `returnUrl` или
`cancelUrl`, API устанавливает в нём query-параметр `externalReference` с
точным идентификатором созданного пополнения, заменяя прежнее значение.
Сохраните этот идентификатор при возврате от платежного провайдера.

## POST /api/billing/wallet/topup/refresh

<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->
Обновляет статус пополнения, точно указанного через `topupId` или
`externalReference`. Используйте идентификатор из ответа создания или URL
возврата; не определяйте пополнение как самое последнее. Страница возврата не
должна вызывать refresh, если идентификатор отсутствует, повторяется или
конфликтует с другим идентификатором.

## POST /api/billing/account-plan/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->
Покупает или улучшает тариф account за баланс кошелька.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `planId` | Да | Целевой тариф: `advanced` или `pro`. |
| `durationMonths` | Да | Период оплаты: `1`, `3`, `6` или `12` месяцев. |
| `autoRenew` | Нет | Включать ли автоматическое продление полученной подписки. Если поле не передано, используется `false`. |
| `requestId` | Нет | Ключ идемпотентности из 8-128 unreserved-символов RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` и `-`. Его можно не передавать для обратной совместимости, но для новых клиентов он рекомендуется. |

Используйте один стабильный `requestId` для одного подтверждённого
пользователем намерения. После timeout или другого неопределённого результата
повторите запрос с теми же payload и `requestId`. Точный повтор возвращает
исходные `subscriptionId` и `invoiceId` без второго списания с кошелька.
Повторное использование этого `requestId` с другими `planId`,
`durationMonths` или `autoRenew` отклоняется. Для нового намерения покупки
создайте новый `requestId`. Без `requestId` запрос по-прежнему принимается для
обратной совместимости, но отдельные HTTP-попытки не являются retry-safe и
идемпотентными.

| Случай | Обязательное поведение |
| --- | --- |
| `same-intent` | Передать `same-requestId` с `same-payload`. |
| `exact-replay` | Вернуть `original-subscriptionId` и `original-invoiceId` с `no-second-debit`. |
| `conflicting-payload` | Запрос `rejected`. |
| `new-intent` | Создать `new-requestId`. |
| `missing-requestId` | Сохраняется `backward-compatible`, но запрос `not-retry-safe` и `not-idempotent-across-HTTP-attempts`. |

Ответ: HTTP 200 OK.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `subscriptionId` | Да | Идентификатор активированной подписки. |
| `invoiceId` | Да | Идентификатор оплаченного счёта. |

## POST /api/billing/account-plan/checkout

Создает checkout для тарифа account.

## POST /api/billing/account-plan/crypto-checkout

Создает прямой crypto checkout для тарифа account.

## POST /api/billing/project-addon/balance-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->
Покупает add-on бесплатного доступа к project за баланс кошелька.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `projectFullname` | Да | Полное имя project, для которого приобретается add-on. |
| `addonCode` | Да | Идентификатор add-on: `project-free-access`. |
| `durationMonths` | Да | Период оплаты: `1`, `3`, `6` или `12` месяцев. |
| `autoRenew` | Нет | Включать ли автоматическое продление полученной подписки. Если поле не передано, используется `false`. |
| `requestId` | Нет | Ключ идемпотентности из 8-128 unreserved-символов RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` и `-`. Его можно не передавать для обратной совместимости, но для новых клиентов он рекомендуется. |

Используйте один стабильный `requestId` для одного подтверждённого
пользователем намерения. После timeout или другого неопределённого результата
повторите запрос с тем же `requestId` и тем же полным payload, включая
`projectFullname`, `addonCode`, `durationMonths` и `autoRenew`. Точный повтор
возвращает исходные `subscriptionId` и `invoiceId` без второго списания с
кошелька. Повторное использование этого `requestId` после изменения любого из
перечисленных полей отклоняется. Для нового намерения покупки создайте новый
`requestId`. Без `requestId` запрос по-прежнему принимается для обратной
совместимости, но отдельные HTTP-попытки не являются retry-safe и
идемпотентными.

| Случай | Обязательное поведение |
| --- | --- |
| `same-intent` | Передать `same-requestId` с `same-full-payload`: `projectFullname`, `addonCode`, `durationMonths` и `autoRenew`. |
| `exact-replay` | Вернуть `original-subscriptionId` и `original-invoiceId` с `no-second-debit`. |
| `conflicting-payload` | Запрос с изменённым `projectFullname`, `addonCode`, `durationMonths` или `autoRenew` отклоняется (`rejected`). |
| `new-intent` | Создать `new-requestId`. |
| `missing-requestId` | Сохраняется `backward-compatible`, но запрос `not-retry-safe` и `not-idempotent-across-HTTP-attempts`. |

Ответ: HTTP 200 OK.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `subscriptionId` | Да | Идентификатор активированной подписки add-on проекта. |
| `invoiceId` | Да | Идентификатор оплаченного счёта. |

## POST /api/billing/project-addon/checkout

<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->
Создает checkout для project add-on.

Если соответствующий hosted checkout всё ещё ожидает оплаты, повторный запрос
возвращает существующие `subscriptionId`, `invoiceId` и `externalReference`
вместе с новой подписанной формой `checkout`. Отправляйте последнюю полученную
форму.

| Случай | Обязательное поведение |
| --- | --- |
| `pending-hosted-retry` | Вернуть существующие `subscriptionId`, `invoiceId` и `externalReference` с новой подписанной формой `checkout`. |

## POST /api/billing/project-addon/crypto-checkout

<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->
Создает прямой crypto checkout для project add-on.

Если ожидающий checkout уже связан с заказом провайдера, повторный запрос
возвращает те же `providerOrderId` и `paymentUrl`. Если создание заказа или
сохранение связи завершилось с неопределённым результатом, checkout остаётся в
pending-состоянии и блокирует новую попытку. Сначала отмените его или дождитесь
reconciliation.

| Случай | Обязательное поведение |
| --- | --- |
| `pending-linked-order-retry` | Вернуть те же `providerOrderId` и `paymentUrl`. |
| `ambiguous-provider-creation-or-linkage` | Сохранить `fail-closed-pending`; требуется `cancel-or-reconcile-before-new-attempt`. |

## POST /api/billing/coupon/redeem

<!-- api-contract: code=required-trim-case-insensitive; same-account-retry=same-couponId-same-subscriptionId-same-invoiceId-without-second-application; redeemed-by-another-account-deleted-invalid-or-unsafe-subscription-lineage=fail-closed; paid-account-plan-period=extend-overlay-or-new-term-as-applicable; response=couponId-subscriptionId-invoiceId -->
Активирует купон для платного тарифа аккаунта.

Тело запроса:

| Поле | Обязательно | Описание |
| --- | --- | --- |
| `code` | Да | Код купона. Начальные и конечные пробелы удаляются (`trim`), регистр не учитывается (`case-insensitive`). |

Оплаченный купоном период тарифа применяется только один раз. В зависимости
от текущего оплаченного периода активация продлевает его, накладывает
применимый период или начинает новый период.

| Сценарий активации | Обязательное поведение |
| --- | --- |
| `code-normalization` | Применяются `trim` и сопоставление `case-insensitive`. |
| `same-account-retry` | Возвращаются `same-couponId`, `same-subscriptionId` и `same-invoiceId` с `no-second-application`. |
| `unavailable-or-unsafe` | Купон со статусом `redeemed-by-another-account`, `deleted`, `invalid` или с `unsafe-subscription-lineage` должен завершаться как `fail-closed`. |
| `paid-account-plan-period` | Выполняется `extend`, `overlay` или начинается `new-term`, `as-applicable`. |

Ответ: HTTP 200 OK.

| Поле | Обязательно | Описание |
| --- | --- | --- |
| `couponId` | Да | Идентификатор активированного купона. |
| `subscriptionId` | Да | Идентификатор полученной подписки на тариф аккаунта. |
| `invoiceId` | Да | Идентификатор оплаченного купоном счёта. |

## POST /api/billing/coupon/gift-purchase

<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; same-intent=same-requestId-planId-durationMonths; exact-replay=same-couponId-and-code-without-second-debit-or-referral-reward; conflicting-payload=rejected; new-intent=new-requestId; response=couponId-code -->
Покупает подарочный купон за баланс кошелька.

Тело запроса:

| Поле | Обязательно | Описание |
| --- | --- | --- |
| `planId` | Да | Платный тариф аккаунта: `advanced` или `pro`. |
| `durationMonths` | Да | Срок действия купона: `1`, `3`, `6` или `12` месяцев. |
| `requestId` | Нет | Ключ идемпотентности из 8-128 unreserved-символов RFC 3986: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~` и `-`. Его можно не передавать для обратной совместимости, но для новых клиентов он рекомендуется. |

В рамках одного аккаунта используйте один стабильный `requestId` для одной
подтверждённой покупки подарка. После таймаута или другого неизвестного
результата повторите запрос с тем же тарифом и сроком.

| Сценарий покупки | Обязательное поведение |
| --- | --- |
| `same-intent` | Передать `same-requestId`, `same-planId` и `same-durationMonths`. |
| `exact-replay` | Возвращаются `same-couponId` и `same-code` с `no-second-debit` и `no-second-referral-reward`. |
| `conflicting-payload` | Повторное использование идентификатора запроса с другим тарифом или сроком будет `rejected`. |
| `new-intent` | Создать `new-requestId`. |
| `missing-requestId` | Сохраняется `backward-compatible`, но запрос `not-retry-safe` и `not-idempotent-across-HTTP-attempts`. |

Ответ: HTTP 200 OK.

| Поле | Обязательно | Описание |
| --- | --- | --- |
| `couponId` | Да | Идентификатор купленного подарочного купона. |
| `code` | Да | Код для передачи получателю купона. |

## GET /api/billing/referral/overview

Возвращает обзор referral-баланса и ссылки.

## POST /api/billing/referral/link/create

Создает referral-ссылку.

## POST /api/billing/referral/claim

Активирует referral-код.

## POST /api/billing/subscription/update-renewal

Обновляет настройку автоматического продления.

## POST /api/billing/crypto-checkout/refresh

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Обновляет статус crypto checkout.

Для project add-on поздняя оплата после отмены checkout или переноса project не
активирует повторно подписку и бесплатный доступ. Платёж направляется на
reconciliation или refund.

| Случай жизненного цикла | Обязательное поведение |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Сохранить `no-reactivation`; применить `reconciliation-or-refund`. |

## POST /api/billing/crypto-checkout/cancel

<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->
Отменяет crypto checkout.

Отмена окончательна для активации project add-on. Если оплата обнаружена позже,
в том числе после переноса project, подписка и бесплатный доступ не
активируются повторно, а платёж направляется на reconciliation или refund.

| Случай жизненного цикла | Обязательное поведение |
| --- | --- |
| `late-payment-after-cancel-or-project-transfer` | Сохранить `no-reactivation`; применить `reconciliation-or-refund`. |
