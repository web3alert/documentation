# API

Web3alert API позволяет работать с теми же сущностями, что и web UI: workspaces, projects, triggers, templates, subscriptions, resources, data sources и addresses.

Базовый URL:

```text
https://web3alert.io
```

Основная версия API для marketplace и builder-функционала - `v2`. Часть account/subscription/address book endpoints пока остается в `v1`.

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
| `GET` | `/api/v1/me` | Получить текущий account, identity, tier и memberships. |
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
| `GET` | `/api/v2/workspaces` | Список workspaces текущего account. |
| `GET` | `/api/v2/workspaces/:fullname` | Получить workspace. |
| `PUT` | `/api/v2/workspaces/:fullname` | Создать или обновить workspace. |
| `DELETE` | `/api/v2/workspaces/:fullname` | Удалить workspace. |
| `POST` | `/api/v2/workspaces/:fullname/avatar` | Загрузить аватар workspace. |
| `GET` | `/api/v2/workspaces/:workspace/acl` | Получить members/ACL workspace. |
| `POST` | `/api/v2/workspaces/:workspace/acl` | Создать invite или ACL entry. |
| `PUT` | `/api/v2/workspaces/:workspace/acl/:entryId` | Изменить роль member. |
| `DELETE` | `/api/v2/workspaces/:workspace/acl/:entryId` | Удалить member/ACL entry. |

## Projects

Подробно: [Projects API](api-projects.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/v2/projects` | Список доступных projects. |
| `GET` | `/api/v2/projects/create-capability` | Проверить возможность создания project. |
| `GET` | `/api/v2/projects/:fullname` | Получить project. |
| `PUT` | `/api/v2/projects/:fullname` | Создать или обновить project. |
| `DELETE` | `/api/v2/projects/:fullname` | Удалить project. |
| `GET` | `/api/v2/projects/by-link/:token` | Открыть private project по access link. |
| `POST` | `/api/v2/projects/:fullname/access-links` | Создать access link для project. |
| `POST` | `/api/v2/projects/:fullname/assets/images` | Загрузить project icon или cover. |
| `DELETE` | `/api/v2/projects/:fullname/images/:asset` | Удалить загруженное изображение project. |

## Project Transfers

Подробно: [Project Transfers API](api-project-transfers.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/v2/projects/:fullname/transfer/plan` | Получить план переноса project. |
| `POST` | `/api/v2/projects/:fullname/transfer-requests` | Создать transfer request. |
| `GET` | `/api/v2/project-transfer-requests` | Список incoming/outgoing transfer requests. |
| `POST` | `/api/v2/project-transfer-requests/:id/accept` | Принять transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/reject` | Отклонить transfer request. |
| `POST` | `/api/v2/project-transfer-requests/:id/cancel` | Отменить outgoing transfer request. |

## Triggers

Подробно: [Triggers API](api-triggers.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/v2/triggers` | Список triggers с фильтрами. |
| `GET` | `/api/v2/triggers/:fullname` | Получить trigger. |
| `PUT` | `/api/v2/triggers/:fullname` | Создать или полностью сохранить trigger. |
| `PATCH` | `/api/v2/triggers/:fullname` | Частично изменить trigger. |
| `DELETE` | `/api/v2/triggers/:fullname` | Удалить trigger. |
| `POST` | `/api/v2/triggers/patch` | Массово изменить triggers. |
| `POST` | `/api/v2/triggers/remove` | Массово удалить triggers. |
| `GET` | `/api/v2/triggers/:fullname/draft` | Получить draft view trigger. |
| `PUT` | `/api/v2/triggers/:fullname/draft` | Сохранить draft trigger. |
| `POST` | `/api/v2/triggers/:fullname/draft/validate` | Проверить draft trigger. |
| `POST` | `/api/v2/triggers/preview` | Предпросмотр выполнения trigger. |
| `POST` | `/api/v2/triggers/test` | Тест trigger на sample source item. |
| `POST` | `/api/v2/triggers/test-block` | Тест trigger на конкретном block. |
| `POST` | `/api/v2/triggers/providers/test` | Тест одного provider. |
| `GET` | `/api/v2/triggers/runtime-sources` | Список runtime data sources. |
| `POST` | `/api/v2/triggers/find-latest-block` | Найти или подготовить test input/block для trigger. |

## Trigger Import

Подробно: [Trigger Import API](api-trigger-import.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `POST` | `/api/v2/triggers/import/evm` | Загрузить EVM ABI entries. |
| `POST` | `/api/v2/triggers/import/evm/abi` | Найти или загрузить ABI по адресу contract. |
| `POST` | `/api/v2/triggers/import/evm/drafts` | Сгенерировать EVM trigger drafts. |
| `POST` | `/api/v2/triggers/import/substrate/drafts` | Сгенерировать Substrate trigger drafts. |
| `GET` | `/api/v2/triggers/substrate/source` | Получить Substrate source info. |
| `GET` | `/api/v2/triggers/substrate/pallets` | Получить список Substrate pallets. |
| `GET` | `/api/v2/triggers/substrate/pallet` | Получить metadata одного Substrate pallet. |

## Templates

Подробно: [Templates API](api-templates.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/v2/projects/:fullname/templates` | Список templates project. |
| `GET` | `/api/v2/projects/:fullname/template` | Получить root template project. |
| `POST` | `/api/v2/projects/:fullname/templates` | Создать template/group. |
| `GET` | `/api/v2/projects/:fullname/templates/:id` | Получить template. |
| `PUT` | `/api/v2/projects/:fullname/templates/:id` | Обновить template. |
| `DELETE` | `/api/v2/projects/:fullname/templates/:id` | Удалить template. |

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
| `POST` | `/api/v2/subscriptions/test` | Тест subscription. |
| `GET` | `/api/v2/subscriptions/alerts/history` | Subscriptions logs workspace. |
| `GET` | `/api/v2/subscriptions/:id/alerts/history` | Logs конкретной subscription. |

## Resources

Подробно: [Resources API](api-resources.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/v2/resources` | Список resources. |
| `GET` | `/api/v2/resources/:fullname` | Получить resource. |
| `PUT` | `/api/v2/resources/:fullname` | Создать или обновить resource. |
| `DELETE` | `/api/v2/resources/:fullname` | Удалить resource. |
| `GET` | `/api/v2/resources/external/:token` | Открыть external resource setup по токену. |
| `POST` | `/api/v2/resources/external/:token` | Отправить payload external resource setup. |

## Data Sources

Подробно: [Data Sources API](api-data-sources.md).

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| `GET` | `/api/v2/custom-sources` | Список custom data sources. |
| `GET` | `/api/v2/custom-sources/create-capability` | Проверить возможность создания custom source. |
| `POST` | `/api/v2/custom-sources/verify` | Проверить custom source config. |
| `GET` | `/api/v2/custom-sources/:fullname` | Получить custom source. |
| `PUT` | `/api/v2/custom-sources/:fullname` | Создать или обновить custom source. |
| `DELETE` | `/api/v2/custom-sources/:fullname` | Удалить custom source. |
| `GET` | `/api/v2/custom-sources/:fullname/logs` | Получить custom source logs. |
| `POST` | `/api/v2/custom-sources/:fullname/test-status` | Проверить status custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/restart` | Перезапустить custom source. |
| `POST` | `/api/v2/custom-sources/:fullname/reset-lag` | Сбросить lag custom source. |

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
| `GET` | `/api/v2/apps` | Список apps. |
| `GET` | `/api/v2/apps/:fullname` | Получить app. |
| `PUT` | `/api/v2/apps/:fullname` | Создать или обновить app. |
| `DELETE` | `/api/v2/apps/:fullname` | Удалить app. |
| `GET` | `/api/v2/actions` | Список actions. |
| `GET` | `/api/v2/actions/:fullname` | Получить action. |
| `PUT` | `/api/v2/actions/:fullname` | Создать или обновить action. |
| `DELETE` | `/api/v2/actions/:fullname` | Удалить action. |
| `GET` | `/api/v2/blueprints` | Список blueprints. |
| `GET` | `/api/v2/blueprints/:fullname` | Получить blueprint. |
| `PUT` | `/api/v2/blueprints/:fullname` | Создать или обновить blueprint. |
| `DELETE` | `/api/v2/blueprints/:fullname` | Удалить blueprint. |
| `GET` | `/api/v2/types` | Список shared types. |
| `GET` | `/api/v2/types/:fullname` | Получить shared type. |
| `PUT` | `/api/v2/types/:fullname` | Создать или обновить shared type. |
| `DELETE` | `/api/v2/types/:fullname` | Удалить shared type. |
