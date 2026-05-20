# Limits

`Limits` описывает ограничения Web3alert, которые зависят от тарифа account или применяются как общие технические правила сервиса.

Основные тарифы:

- `Free`;
- `Advanced`;
- `Pro`.

Если в таблице указано `Unlimited`, это значит, что в текущей тарифной конфигурации явного численного лимита нет. Другие технические проверки, права workspace или состояние сущности все равно могут ограничить действие.

## Как применяются лимиты

Tier limit сам по себе не дает права на действие. Для большинства операций должны совпасть два условия:

- account tier разрешает действие;
- роль пользователя в [Workspace](workspaces.md) дает право управлять нужной сущностью.

Для проектов и custom data sources лимиты обычно считаются по owner или billing account сущности. Для subscriptions лимит считается по account, который создал subscription.

## Tier Summary

| Возможность | Free | Advanced | Pro |
| --- | ---: | ---: | ---: |
| Цена | Free | €15.00 / месяц; скидка 5% при оплате за 6 месяцев; скидка 10% при оплате за 12 месяцев | €50.00 / месяц; скидка 5% при оплате за 6 месяцев; скидка 10% при оплате за 12 месяцев |
| Создание projects | Нет | Да | Да |
| Создание workspaces | Unlimited | Unlimited | Unlimited |
| Редактирование projects | Нет | Да | Да |
| Управление triggers | Нет | Да | Да |
| Управление templates | Нет | Да | Да |
| Управление custom data sources | Нет | Да | Да |
| Test run | Нет | Да | Да |
| MCP server access | Нет | Да | Да |
| Активные non-free subscriptions | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Triggers в private project | 0 | 50 | 200 |
| Triggers в public/free project | 0 | Unlimited | Unlimited |
| Provider weight на trigger | 0 | 6 | 20 |
| Runtime rate на subscription | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| Runtime rate на workspace | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
| External API rate | 60/min | 300/min | 900/min |
| Subscriptions logs | Нет | 7 дней / 25 000 записей | 30 дней / 100 000 записей |
| Custom source logs | Нет | 7 дней / 25 000 записей | 30 дней / 100 000 записей |

## Projects

### Create projects

Создание проектов доступно только `Advanced` и `Pro`.

`Free` account не может создавать новые projects.

### Edit projects

Редактирование project metadata доступно только платным аккаунтам.

Если owner проекта становится `Free`, он не может редактировать project metadata. Для public projects остается возможность удалить проект, но не управлять его настройками как раньше.

### Private projects

| Tier | Лимит private projects |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Private project занимает слот в лимите private projects owner account.

Если лимит исчерпан, можно:

- перевести существующий private project в public;
- upgrade на более высокий тариф;
- удалить ненужный private project.

### Free projects

Free project доступен для подписки всем пользователям без расходования лимита non-free subscriptions.

Free access включается через project free-access add-on в [Account Billing](account.md#project-free-access-add-on).

Если add-on не продлить, project становится public. После этого подписки `Free` users на такой project считаются non-free subscriptions и могут быть заморожены, если превышен лимит `Free`.

## Subscriptions

### Counted subscriptions

`Free` account может держать до 5 активных subscriptions на non-free projects.

`Advanced` и `Pro` не имеют численного лимита counted subscriptions.

| Tier | Активные counted subscriptions |
| --- | ---: |
| Free | 5 |
| Advanced | Unlimited |
| Pro | Unlimited |

### Какие subscriptions считаются counted

Subscription считается counted, если она относится к project с access level не `Free`.

То есть counted:

- subscriptions на `Public` projects;
- subscriptions на `Private` projects, если пользователь имеет доступ к source workspace.

Не counted:

- subscriptions на `Free` projects.

Subscription, созданная через template, считается как одна subscription. Количество topics или rules внутри template не умножает лимит.

### Что происходит при превышении Free limit

Если `Free` account пытается включить больше 5 counted subscriptions, лишние subscriptions блокируются.

Если пользователь выключит одну counted subscription, он сможет включить другую в пределах лимита.

Если project был `Free`, но free-access add-on закончился и project стал `Public`, subscriptions `Free` users на этот project начинают считаться counted. Если после этого лимит превышен, лишние subscriptions будут заморожены с причиной про лимит Free tier.

### Frozen private projects

Если owner private project становится `Free`, private project замораживается.

Subscriptions, связанные с frozen project, блокируются с причиной, что trigger/project frozen. Это отдельная причина блокировки и она не заменяет обычный лимит counted subscriptions.

### Subscriptions logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Недоступно | Недоступно |
| Advanced | 7 дней | 25 000 |
| Pro | 30 дней | 100 000 |

Если subscriptions logs недоступны для tier, backend не сохраняет logs для subscriptions этого workspace owner tier.

В UI журнал можно читать порциями по 50, 100, 250 или 500 записей.

## API and MCP

### MCP server access

MCP server доступен только для `Advanced` и `Pro`.

### External API rate

External API rate применяется к account-token API requests, которые приходят не с web UI Web3alert и не от Web3alert MCP server.

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

Запросы с web UI и MCP server не лимитируются этим правилом.

## Triggers

### Manage triggers

Создание, импорт и редактирование triggers доступно в projects, owner которых имеет тариф `Advanced` или `Pro`.

| Tier | Manage triggers |
| --- | --- |
| Free | Нет |
| Advanced | Да |
| Pro | Да |

### Project triggers

| Tier | Private project | Public/free project |
| --- | ---: | ---: |
| Free | 0 | 0 |
| Advanced | 50 | Unlimited |
| Pro | 200 | Unlimited |

Private project limits применяются только к private projects.

`Free` account не может управлять triggers в собственных projects. Если такой account добавлен в платный workspace в роли, которая дает право редактировать project internals, он может создавать, импортировать и редактировать triggers в этом workspace.

Для `Advanced` и `Pro` public/free project сейчас не имеет отдельного численного лимита triggers.

## Templates

### Manage templates

Создание и редактирование templates доступно в projects, owner которых имеет тариф `Advanced` или `Pro`.

| Tier | Manage templates |
| --- | --- |
| Free | Нет |
| Advanced | Да |
| Pro | Да |

`Free` account не может управлять templates в собственных projects. Если такой account добавлен в платный workspace в роли, которая дает право редактировать project internals, он может создавать и редактировать templates в этом workspace.

Удаление template требует owner-role в workspace.

## Data Sources

### Manage custom data sources

Создание и редактирование custom data sources доступно только платным аккаунтам.

| Tier | Manage custom data sources |
| --- | --- |
| Free | Нет |
| Advanced | Да |
| Pro | Да |

### Private custom data sources

| Tier | Private custom data sources |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Лимит считается по private custom sources, созданным account.

Public/system sources не занимают private custom source slots.

### Public custom source registration

Для public custom sources действует общий anti-spam лимит: не больше 5 public registrations за 24 часа.

Этот лимит не является тарифным.

Также public source проходит проверку уникальности сети. Для Substrate источников сервис сравнивает genesis block hash, для EVM источников - chain ID. Один и тот же blockchain source нельзя повторно опубликовать как новый public source.

### Endpoints per custom source

Один custom source может иметь от 1 до 10 endpoints.

Этот лимит не является тарифным.

### Runtime settings

У custom source есть runtime settings:

| Setting | Default | Maximum |
| --- | ---: | ---: |
| `blockProcessingConcurrency` | 1 | 32 |
| `maxQueuedBlocks` | 10 000 | 100 000 |
| `batchMaxCount` для EVM | 3 | 100 |

Настраивать advanced runtime settings может `Pro`. Для остальных тарифов используются default values или уже сохраненные значения.

### Custom source logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Недоступно | Недоступно |
| Advanced | 7 дней | 25 000 |
| Pro | 30 дней | 100 000 |

В UI source logs можно читать порциями по 50, 100, 250 или 500 записей.

При чтении custom source logs backend дополнительно ограничивает tail read: до 96 KB и до 200 lines за чтение tail.

## Providers

Providers используются в trigger execution, чтобы дополнить source item внешними или state-derived данными.

### Provider weights

Provider weight зависит от tier:

| Tier | Provider weight на trigger |
| --- | ---: |
| Free | 0 |
| Advanced | 6 |
| Pro | 20 |

Provider weight - это стоимость provider в trigger execution budget. Один provider может занимать больше одного условного slot.

У каждого provider есть вес.

| Provider type | Weight |
| --- | ---: |
| HTTP | 2 |
| GraphQL | 2 |
| RPC endpoint | 2 |
| RPC source transport | 1 |
| State source: Substrate storage | 1 |
| State source: EVM read | 1 |
| Value history | 1 |
| JavaScript | 2 |

Если provider явно задает `weight`, он должен быть положительным integer. Значение больше 100 обрезается до 100.

### Provider timeout

Provider timeout - 10 секунд.

Это общий runtime limit. В UI этот параметр не выводится пользователю как обычная настройка.

### Provider response size

Максимальный размер provider response - 256 KB.

Это общий runtime limit.

### Provider URL policy

Для внешних endpoint providers разрешен только `https`.

Локальные и private-network hosts запрещены: например `localhost`, `.local`, private IPv4 ranges и loopback IPv6.

## Tests

### Test run access

| Tier | Test run |
| --- | --- |
| Free | Нет |
| Advanced | Да |
| Pro | Да |

Test run используется для проверки triggers, providers и subscriptions.

### Test rate limit

| Tier | Rate |
| --- | ---: |
| Free | Недоступно |
| Advanced | 1 test / second |
| Pro | 5 tests / second |

Лимит применяется к test endpoints, чтобы защитить backend и runtime от слишком частых запусков.

## Alert Delivery

Alert delivery ограничивается rate limits, чтобы один account/workspace не мог перегрузить delivery runtime.

### Per-subscription notification rate

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` позволяет обработать короткий всплеск alerts.

`Sustained rate` - сколько alerts восстанавливается в bucket за время.

`Queue cutoff` - максимальный размер очереди для subscription перед тем, как delivery начнет отбрасывать или rate-limit events.

### Per-workspace notification rate

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit защищает общий поток alerts внутри workspace.

## Project Transfer

Project transfer requests имеют anti-spam limits.

| Limit | Value |
| --- | ---: |
| Pending request lifetime | 7 дней |
| Requests by one account per hour | 5 |
| Requests by one account per day | 20 |
| Requests from one account to the same target workspace per day | 2 |
| Pending transfer requests per project | 1 |

Эти лимиты не зависят от tier.
