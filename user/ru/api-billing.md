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

Покупает add-on бесплатного доступа к project за баланс кошелька.

## POST /api/billing/project-addon/checkout

Создает checkout для project add-on.

## POST /api/billing/project-addon/crypto-checkout

Создает прямой crypto checkout для project add-on.

## POST /api/billing/coupon/redeem

Активирует купон.

## POST /api/billing/coupon/gift-purchase

Покупает подарочный купон за баланс кошелька.

## GET /api/billing/referral/overview

Возвращает обзор referral-баланса и ссылки.

## POST /api/billing/referral/link/create

Создает referral-ссылку.

## POST /api/billing/referral/claim

Активирует referral-код.

## POST /api/billing/subscription/update-renewal

Обновляет настройку автоматического продления.

## POST /api/billing/crypto-checkout/refresh

Обновляет статус crypto checkout.

## POST /api/billing/crypto-checkout/cancel

Отменяет crypto checkout.
