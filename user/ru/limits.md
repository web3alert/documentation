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

Для проектов и custom data sources лимиты обычно считаются по owner или billing account сущности. Лимит подписок применяется к создавшему их аккаунту и учитывает подписки во всех воркспейсах.

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
| MCP server access | Да | Да | Да |
| Активные подписки на проекты без статуса Free (на создавший их аккаунт) | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Triggers в private project | 0 | 50 | 200 |
| Triggers в public/free project | 0 | Unlimited | Unlimited |
| Provider weight на trigger | 0 | 6 | 20 |
| Частота на подписку (другие способы доставки) | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| Частота на подписку (только встроенные вебхуки) | 12 burst, 1/sec, queue 15 | 40 burst, 4/sec, queue 50 | 80 burst, 12/sec, queue 150 |
| Частота на воркспейс (другие способы доставки) | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
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

На тарифе Free аккаунт может иметь до 5 созданных им активных подписок на проекты без статуса Free суммарно во всех воркспейсах. Подписки на проекты Free не входят в лимит.

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

Если аккаунт Free уже исчерпал лимит, API отклоняет создание ещё одной учитываемой подписки с состоянием `on`.

Если пользователь выключит одну counted subscription, он сможет включить другую в пределах лимита.

Сохранённая подписка может перейти в состояние `blocked`, когда API пересчитывает доступ по тарифу. Например, если у проекта истёк срок действия дополнения для бесплатного доступа, подписки на него начинают учитываться в лимите Free, а подписки сверх лимита могут перейти в `blocked`.

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

MCP server доступен для `Free`, `Advanced` и `Pro`.

### External API rate

Лимиты в таблице применяются к внешним API-запросам, которые используют токен account для аутентификации. Лимит запросов account никогда не применяется к `DELETE /api/token` и `DELETE /api/tokens`, поэтому токены можно отозвать даже после исчерпания лимита.

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

Для запросов из web UI действует отдельный лимит. К доверенным запросам от MCP server к API внешний лимит не применяется. Для вызовов инструментов MCP по умолчанию действует собственный лимит в 120 вызовов в минуту на account. В каждом процессе сервера этот лимит общий для всех трёх эндпоинтов MCP.

## Платежи агентов {#agent-payments}

Через x402 можно пополнять баланс в USDC в сети Base на сумму от 5 до 500 € с точностью до двух знаков в EUR.

Для каждого ключа агента можно задать месячный лимит расходов от 0 до 10 000 € с точностью до двух знаков. Если оставить поле пустым, лимита не будет. Учитываются успешные покупки с баланса, сделанные этим ключом в текущем календарном месяце по UTC. Повтор с тем же `requestId` учитывается один раз. Автопродления в расчёт не входят.

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

Базовые значения в таблице действуют для подписок с другими способами доставки.

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` позволяет обработать короткий всплеск alerts.

`Sustained rate` - сколько alerts восстанавливается в bucket за время.

`Queue cutoff` - максимальный размер очереди для subscription перед тем, как delivery начнет отбрасывать или rate-limit events.

### Подписки с доставкой только на встроенные вебхуки

По умолчанию для подписок с доставкой только на встроенные вебхуки, включая созданные через эндпоинт для агентов, движок увеличивает допустимый всплеск и постоянную скорость в четыре раза. Предел очереди сохраняется. Лимит на подписку определяется тарифом создавшего её аккаунта.

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 12 | 1 / second | 15 |
| Advanced | 40 | 4 / second | 50 |
| Pro | 80 | 12 / second | 150 |

### Per-workspace notification rate

Подписки с доставкой только на встроенные вебхуки не расходуют эту квоту воркспейса.

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit защищает общий поток alerts внутри workspace.

### Хранение входящих событий

| Тариф | Срок хранения | Максимум событий |
| --- | --- | ---: |
| Free | Недоступно | — |
| Advanced | 7 дней | 25 000 |
| Pro | 30 дней | 100 000 |

В рабочем пространстве хранятся самые новые события в пределах обоих ограничений. Сохранение и срок хранения определяет тариф владельца пространства, а при его отсутствии — тариф создателя подписки. Тариф без истории оповещений не сохраняет события. При создании или чтении inbox в пространстве без владельца используется тариф вызывающего аккаунта.

Каждое событие сохраняет срок годности, заданный при записи. Лимит по количеству применяется после записи. После понижения тарифа событий может быть больше нового лимита до следующей записи.

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
