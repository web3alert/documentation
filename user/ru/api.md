# API

Web3alert API позволяет работать с теми же сущностями, что и web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources и addresses.

Базовый URL:

```text
https://web3alert.io
```

Все публичные клиентские ручки используют канонические пути `/api/*`.
Межсервисные ручки не входят в эту публичную документацию.

## OpenAPI

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/openapi.json` | [Документ OpenAPI 3.1 в формате JSON для API агентов.](api-openapi.md) |

## Auth

Большинство эндпоинтов принимает токен сессии или ключ агента как Bearer-учётные данные. Создайте ключ на [странице Agents](https://web3alert.io/agents) или [войдите с кошельком Ethereum](agents.md).

```http
Authorization: Bearer YOUR_AGENT_KEY
```

Ключ действует с ролью аккаунта в одном рабочем пространстве. Право `read` даёт доступ на чтение, `manage` позволяет создавать подписки или запрашивать котировки, а `spend` — покупать тарифы и дополнения проектов с баланса в EUR. Сессия нужна для управления ключами, отзыва токенов, смены, создания или обновления пространства, покупки подарочных купонов и создания, принятия, отклонения или отмены запросов на перенос проектов. См. эндпоинты ниже и [документ OpenAPI](api-openapi.md) для агентов.

Ключи без `manage` не получают токены записи во внешние ресурсы. Ответы биллинга скрывают неиспользованные коды купонов, включая подарочные, для всех ключей агентов.

Запрос с ключом может вернуть HTTP `403` с кодом `insufficient_scope`, если не хватает права, `key_not_allowed`, если операция требует сессии, или `spend_cap_exceeded`, если покупка превысит месячный лимит ключа.

Доступ к endpoint зависит от:

- account tier;
- роли пользователя в workspace;
- access level project/data source/resource;
- состояния сущности.

У каждого аккаунта три независимые квоты запросов к API. Все ключи агента используют общую квоту по тарифу аккаунта. Внешние запросы с токенами сессий используют вторую квоту с тем же лимитом. Сессии собственного веб-интерфейса используют третью квоту в 1 200 запросов в минуту. На доверенные запросы MCP с токенами сессий эти лимиты не распространяются. Лимит запросов account никогда не применяется к `DELETE /api/token` и `DELETE /api/tokens`, поэтому токены можно отозвать даже после исчерпания лимита. Подробные значения описаны в [Limits](limits.md#api-and-mcp).

## Формат ответа

Успешный ответ с телом содержит JSON. У ответа `204 No Content`, например после удаления subscription или отзыва токенов, тела нет. При `204` пропустите разбор JSON.

Подробные структуры response body описаны в [Types](types.md).

Ответы API с ошибкой в формате JSON обычно содержат `error.message` и необязательные `error.code` и `error.details`.

```json
{
  "error": {
    "message": "This key lacks the \"manage\" scope.",
    "code": "insufficient_scope"
  }
}
```

Эндпоинты для агентов могут возвращать разные статусы HTTP, например `401`, `403`, `404`, `409`, `410`, `429` и `503`. Учитывайте статус и `error.code` вместе при обработке ответа. Для [пополнений через x402](api-billing.md#post-api-billing-wallet-x402-topup) ответ `402` содержит котировку x402 v2 `PaymentRequired` или ошибку платежа со строкой `error`.

Запрос с некорректным JSON в теле может быть отклонён до запуска обработчика маршрута с ответом `400 Bad Request` в виде обычного текста. Проверьте `Content-Type` ответа перед разбором JSON.

Если запрос превышает лимит external API, API возвращает `429` с заголовками, как в примере. Прочитайте `Retry-After`, чтобы узнать, сколько секунд подождать до повторного запроса.

```http
Retry-After: 1
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Подробно: [Account API](api-account.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/token` | Подтвердить identity через `credentials` provider и создать новый постоянный Bearer-токен; существующий Bearer-токен не нужен. <!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent --> |
| `DELETE` | `/api/token` | Отозвать токен, использованный в запросе. |
| `DELETE` | `/api/tokens` | Отозвать все токены аутентифицированного account. |
| `GET` | `/api/me` | Получить текущий account, identity, tier и memberships. |
| `POST` | `/api/keys` | Создать ключ в текущем пространстве. Только сессия. |
| `GET` | `/api/keys` | Получить ключи аккаунта во всех пространствах. Только сессия. |
| `PATCH` | `/api/keys/:id` | Изменить имя или месячный лимит ключа. Только сессия. |
| `DELETE` | `/api/keys/:id` | Отозвать ключ. Только сессия. |
| `DELETE` | `/api/me` | Удалить текущий account. |
| `PUT` | `/api/me/meta` | Обновить метаданные account. |
| `POST` | `/api/me/avatar` | Загрузить аватар текущего account. |
| `GET` | `/api/me/workspace` | Получить текущий workspace account. |
| `PUT` | `/api/me/workspace` | Сменить текущий workspace account. |
| `GET` | `/api/account/settings` | Получить account settings. |
| `PUT` | `/api/account/settings` | Сохранить account settings. |

## Вход с кошельком и получение доступа

Подробнее в [API аккаунта](api-account.md).

| Метод | Эндпоинт | Назначение |
| --- | --- | --- |
| `POST` | `/api/agent/siwe/nonce` | Запросить одноразовый nonce SIWE. Публичный. |
| `POST` | `/api/agent/siwe/verify` | Проверить подписанное сообщение SIWE и выдать ключ. Публичный. |
| `POST` | `/api/agent/claim-link` | Создать или заменить ссылку для получения доступа. Ключ агента с `manage`. |
| `GET` | `/api/agent/claims/:token` | Посмотреть данные для получения доступа. Публичный для владельца ссылки. |

## Ссылки

Подробнее: [API ссылок](api-links.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/links` | Создать анонимную короткую ссылку для внутреннего пути Web3alert. |
| `GET` | `/api/links/:key` | Разрешить анонимный ключ; неизвестный ключ возвращает `400`. |

## Workspaces

Подробно: [Workspaces API](api-workspaces.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/workspaces` | Список workspaces текущего account. |
| `GET` | `/api/workspaces/:fullname` | Получить workspace. |
| `PUT` | `/api/workspaces/:fullname` | Создать или обновить workspace. |
| `DELETE` | `/api/workspaces/:fullname` | Удалить workspace. |
| `POST` | `/api/workspaces/:fullname/avatar` | Загрузить аватар workspace. |
| `GET` | `/api/workspaces/:workspace/acl` | Получить members/ACL workspace. |
| `POST` | `/api/workspaces/:workspace/acl` | Создать invite или ACL entry. |
| `PUT` | `/api/workspaces/:workspace/acl/:entryId` | Изменить роль member. |
| `DELETE` | `/api/workspaces/:workspace/acl/:entryId` | Удалить member/ACL entry. |

## Projects

Подробно: [Projects API](api-projects.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/projects` | Список доступных projects. |
| `GET` | `/api/projects/create-capability` | Проверить возможность создания project. |
| `GET` | `/api/projects/:fullname` | Получить project. |
| `PUT` | `/api/projects/:fullname` | Создать или обновить project. |
| `DELETE` | `/api/projects/:fullname` | Удалить project. |
| `GET` | `/api/projects/by-link/:token` | Открыть private project по access link. |
| `POST` | `/api/projects/:fullname/access-links` | Создать access link для project. |
| `POST` | `/api/projects/:fullname/assets/images` | Загрузить project icon или cover. |
| `DELETE` | `/api/projects/:fullname/images/:asset` | Удалить загруженное изображение project. |

## Project Transfers

Подробно: [Project Transfers API](api-project-transfers.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/projects/:fullname/transfer/plan` | Получить план переноса project. |
| `POST` | `/api/projects/:fullname/transfer-requests` | Создать transfer request. |
| `GET` | `/api/project-transfer-requests` | Список incoming/outgoing transfer requests. |
| `POST` | `/api/project-transfer-requests/:id/accept` | Принять transfer request. |
| `POST` | `/api/project-transfer-requests/:id/reject` | Отклонить transfer request. |
| `POST` | `/api/project-transfer-requests/:id/cancel` | Отменить outgoing transfer request. |

## Triggers

Подробно: [Triggers API](api-triggers.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/triggers` | Список triggers с фильтрами. |
| `GET` | `/api/triggers/:fullname` | Получить trigger. |
| `PUT` | `/api/triggers/:fullname` | Создать или полностью сохранить trigger. |
| `PATCH` | `/api/triggers/:fullname` | Частично изменить trigger. |
| `DELETE` | `/api/triggers/:fullname` | Удалить trigger. |
| `POST` | `/api/triggers/patch` | Массово изменить triggers. |
| `POST` | `/api/triggers/remove` | Массово удалить triggers. |
| `GET` | `/api/triggers/:fullname/draft` | Получить draft view trigger. |
| `PUT` | `/api/triggers/:fullname/draft` | Сохранить draft trigger. |
| `POST` | `/api/triggers/:fullname/draft/validate` | Проверить draft trigger. |
| `GET` | `/api/triggers/:fullname/logs` | Получить сводные delivery и source-pressure логи. |
| `POST` | `/api/triggers/:fullname/reset-test-status` | Сбросить статус тестирования trigger. |
| `POST` | `/api/triggers/preview` | Preview activation и transforms над input. |
| `POST` | `/api/triggers/test` | Тест trigger на sample source item. |
| `POST` | `/api/triggers/test-block` | Тест trigger на конкретном block. |
| `POST` | `/api/triggers/providers/test` | Тест одного provider. |
| `GET` | `/api/triggers/hypercore/actions` | Получить HyperCore actions для builder. |
| `GET` | `/api/triggers/runtime-sources` | Список runtime data sources. |
| `GET` | `/api/template-helpers` | Получить публичные метаданные helper-функций Handlebars для шаблонов triggers и actions. |
| `POST` | `/api/triggers/find-latest-block` | Найти или подготовить test input/block для trigger. |

## Сборка триггеров для агентов

Подробнее в [API триггеров](api-triggers.md).

| Метод | Эндпоинт | Назначение |
| --- | --- | --- |
| `POST` | `/api/agent/build/contracts` | Найти сигнатуры событий. Сессия или ключ с `read`. |
| `POST` | `/api/agent/build/drafts` | Создать черновик триггера. Сессия или ключ с `manage`. |
| `POST` | `/api/agent/build/drafts/:draftId/test` | Проверить черновик. Сессия или ключ с `read`. |
| `POST` | `/api/agent/build/drafts/:draftId/activate` | Активировать черновик после успешного теста. Сессия или ключ с `manage`. |
| `DELETE` | `/api/agent/build/triggers/:fullname` | Удалить приватный триггер агента. Сессия или ключ с `manage`. |

## Trigger Import

Подробно: [Trigger Import API](api-trigger-import.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/triggers/import/evm` | Загрузить EVM ABI entries без сохранения triggers. |
| `POST` | `/api/triggers/import/evm/abi` | Найти или загрузить ABI по адресу contract. |
| `POST` | `/api/triggers/import/evm/drafts` | Сгенерировать EVM trigger drafts. |
| `POST` | `/api/triggers/import/hypercore/drafts` | Сгенерировать HyperCore trigger drafts. |
| `POST` | `/api/triggers/import/solana/idl` | Загрузить metadata Solana IDL. |
| `POST` | `/api/triggers/import/solana/drafts` | Сгенерировать Solana trigger drafts. |
| `POST` | `/api/triggers/import/substrate/drafts` | Сгенерировать Substrate trigger drafts. |
| `GET` | `/api/triggers/substrate/source` | Получить Substrate source info. |
| `GET` | `/api/triggers/substrate/pallets` | Получить список Substrate pallets. |
| `GET` | `/api/triggers/substrate/pallet` | Получить metadata одного Substrate pallet. |

## Templates

Подробно: [Templates API](api-templates.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/projects/:fullname/templates` | Список templates project. |
| `GET` | `/api/projects/:fullname/template` | Получить root template project. |
| `POST` | `/api/projects/:fullname/templates` | Создать template/group. |
| `GET` | `/api/projects/:fullname/templates/:id` | Получить template. |
| `PUT` | `/api/projects/:fullname/templates/:id` | Обновить template. |
| `DELETE` | `/api/projects/:fullname/templates/:id` | Удалить template. |

## Subscriptions

Подробно: [Subscriptions API](api-subscriptions.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/subscriptions` | Список subscriptions текущего workspace/account. |
| `POST` | `/api/subscriptions` | Создать subscription. |
| `GET` | `/api/subscriptions/:id` | Получить subscription. |
| `PUT` | `/api/subscriptions/:id` | Обновить subscription. |
| `DELETE` | `/api/subscriptions/:id` | Удалить subscription. |
| `PUT` | `/api/subscriptions/:id/state` | Включить или выключить subscription. |
| `POST` | `/api/subscriptions/test` | Тест subscription. |
| `GET` | `/api/subscriptions/alerts/history` | Subscriptions logs workspace. |
| `GET` | `/api/subscriptions/:id/alerts/history` | Logs конкретной subscription. |

## Resources

Подробно: [Resources API](api-resources.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/resources` | Список resources. |
| `GET` | `/api/resources/:fullname` | Получить resource. |
| `PUT` | `/api/resources/:fullname` | Создать или обновить resource. |
| `POST` | `/api/resources/:fullname/signing-secret` | Создать или заменить секрет подписи вебхука. |
| `PUT` | `/api/inbox` | Создать или вернуть inbox рабочего пространства. Сессия или ключ с `manage`. |
| `GET` | `/api/events` | Прочитать сохранённые входящие события. Сессия или ключ с `read`. |
| `DELETE` | `/api/resources/:fullname` | Удалить resource. |
| `POST` | `/api/resources/:fullname/setup-sessions` | Создать Telegram destination setup session. |
| `GET` | `/api/resources/:fullname/setup-sessions/:id` | Получить статус setup session. |
| `DELETE` | `/api/resources/:fullname/setup-sessions/:id` | Отменить setup session. |
| `GET` | `/api/resources/external/:token` | Открыть external resource setup по токену. |
| `POST` | `/api/resources/external/:token` | Отправить payload external resource setup. |

Три setup-session routes доступны, только когда на сервере включена безопасная
настройка Telegram destination.

## Data Sources

Подробно: [Data Sources API](api-data-sources.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/custom-sources` | Список custom data sources. |
| `GET` | `/api/custom-sources/create-capability` | Проверить возможность создания custom source. |
| `POST` | `/api/custom-sources/verify` | Проверить custom source config. |
| `GET` | `/api/custom-sources/:fullname` | Получить custom source. |
| `PUT` | `/api/custom-sources/:fullname` | Создать или обновить custom source. |
| `DELETE` | `/api/custom-sources/:fullname` | Удалить custom source. |
| `GET` | `/api/custom-sources/:fullname/logs` | Получить custom source logs. |
| `POST` | `/api/custom-sources/:fullname/test-status` | Проверить status custom source. |
| `POST` | `/api/custom-sources/:fullname/restart` | Перезапустить custom source. |
| `POST` | `/api/custom-sources/:fullname/reset-lag` | Сбросить lag custom source. |

## Биллинг

Подробно: [API биллинга](api-billing.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/billing/overview` | Получить обзор биллинга account. |
| `GET` | `/api/billing/wallet/overview` | Получить обзор баланса и кошелька. |
| `POST` | `/api/billing/wallet/crypto-topup` | Создать пополнение баланса криптовалютой. |
| `POST` | `/api/billing/wallet/x402-topup` | Пополнить баланс в EUR через x402 в USDC в сети Base. Сессия или ключ с `manage`. |
| `POST` | `/api/billing/wallet/topup/refresh` | Обновить статус пополнения. |
| `POST` | `/api/billing/account-plan/balance-purchase` | Купить или улучшить тариф за баланс. |
| `POST` | `/api/billing/account-plan/checkout` | Создать checkout тарифа account. |
| `POST` | `/api/billing/account-plan/crypto-checkout` | Создать прямой crypto checkout тарифа. |
| `POST` | `/api/billing/project-addon/balance-purchase` | Купить project add-on за баланс. |
| `POST` | `/api/billing/project-addon/checkout` | Создать checkout для project add-on. |
| `POST` | `/api/billing/project-addon/crypto-checkout` | Создать прямой crypto checkout для project add-on. |
| `POST` | `/api/billing/coupon/redeem` | Активировать купон. |
| `POST` | `/api/billing/coupon/gift-purchase` | Купить подарочный купон за баланс. |
| `GET` | `/api/billing/referral/overview` | Получить обзор referral-баланса и ссылки. |
| `POST` | `/api/billing/referral/link/create` | Создать referral-ссылку. |
| `POST` | `/api/billing/referral/claim` | Активировать referral-код. |
| `POST` | `/api/billing/subscription/update-renewal` | Обновить автоматическое продление. |
| `POST` | `/api/billing/crypto-checkout/refresh` | Обновить статус crypto checkout. |
| `POST` | `/api/billing/crypto-checkout/cancel` | Отменить crypto checkout. |

## Addresses

Подробно: [Addresses API](api-addresses.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/addresses` | Список addresses. |
| `POST` | `/api/addresses` | Создать address. |
| `PUT` | `/api/addresses/:id` | Обновить address. |
| `DELETE` | `/api/addresses/:id` | Удалить address. |

## Apps, Actions, Blueprints и Types

Подробно: [Apps, Actions, Blueprints и Types API](api-builder-registry.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/apps` | Список apps. |
| `GET` | `/api/apps/:fullname` | Получить app. |
| `PUT` | `/api/apps/:fullname` | Создать или обновить app. |
| `DELETE` | `/api/apps/:fullname` | Удалить app. |
| `GET` | `/api/actions` | Список actions. |
| `GET` | `/api/actions/:fullname` | Получить action. |
| `PUT` | `/api/actions/:fullname` | Создать или обновить action. |
| `DELETE` | `/api/actions/:fullname` | Удалить action. |
| `GET` | `/api/blueprints` | Список blueprints. |
| `GET` | `/api/blueprints/:fullname` | Получить blueprint. |
| `PUT` | `/api/blueprints/:fullname` | Создать или обновить blueprint. |
| `DELETE` | `/api/blueprints/:fullname` | Удалить blueprint. |
| `GET` | `/api/types` | Список shared types. |
| `GET` | `/api/types/lookup` | Получить динамические варианты типов. |
| `GET` | `/api/types/:fullname` | Получить shared type. |
| `PUT` | `/api/types/:fullname` | Создать или обновить shared type. |
| `DELETE` | `/api/types/:fullname` | Удалить shared type. |
