# API

Web3alert API позволяет работать с теми же сущностями, что и web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources и addresses.

Базовый URL:

```text
https://web3alert.io
```

Marketplace- и builder-ручки используют канонические пути `/api/*`.
Ограниченный набор ручек account, subscription и address book временно
остаётся на публичных compatibility-путях `/api/v1/*` до их канонической
миграции. Межсервисные ручки не входят в эту публичную документацию.

## Auth

Для пользовательских запросов используется personal access token:

```http
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

Токен можно получить в [Account parameters](account.md#personal-access-token).

Доступ к endpoint зависит от:

- account tier;
- роли пользователя в workspace;
- access level project/data source/resource;
- состояния сущности.

Внешние API-запросы лимитируются по tier. Подробные значения описаны в [Limits](limits.md#api-and-mcp).

## Формат ответа

Успешный response возвращает JSON endpoint-а.

Подробные структуры response body описаны в [Types](types.md).

Ошибка возвращается в формате:

```json
{
  "error": {
    "message": "error message",
    "details": {}
  }
}
```

При превышении external API лимита возвращается `429` и headers:

```http
Retry-After: 10
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Window: 60000
```

## Account

Подробно: [Account API](api-account.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/v1/token` | Создать или получить API-токен после процесса авторизации. |
| `GET` | `/api/me` | Получить текущий account, identity, tier и memberships. |
| `DELETE` | `/api/v1/me` | Удалить текущий account. |
| `PUT` | `/api/v1/me/meta` | Обновить метаданные account. |
| `POST` | `/api/v1/me/avatar` | Загрузить аватар текущего account. |
| `GET` | `/api/v1/me/workspace` | Получить текущий workspace account. |
| `POST` | `/api/v1/me/workspace` | Сменить текущий workspace account. |
| `GET` | `/api/v1/account/settings` | Получить account settings. |
| `POST` | `/api/v1/account/settings` | Сохранить account settings. |

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
| `POST` | `/api/triggers/find-latest-block` | Найти или подготовить test input/block для trigger. |

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
| `GET` | `/api/v1/subscriptions` | Список subscriptions текущего workspace/account. |
| `POST` | `/api/v1/subscriptions` | Создать subscription. |
| `GET` | `/api/v1/subscriptions/:id` | Получить subscription. |
| `POST` | `/api/v1/subscriptions/:id` | Обновить subscription. |
| `DELETE` | `/api/v1/subscriptions/:id` | Удалить subscription. |
| `POST` | `/api/v1/subscriptions/:id/state` | Включить или выключить subscription. |
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
| `GET` | `/api/v1/addressbook` | Список addresses. |
| `POST` | `/api/v1/addressbook` | Создать address. |
| `POST` | `/api/v1/addressbook/:id` | Обновить address. |
| `DELETE` | `/api/v1/addressbook/:id` | Удалить address. |

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
