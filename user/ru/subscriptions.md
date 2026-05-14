# Subscriptions

`Subscriptions` - это пользовательские правила получения alerts. Subscription связывает выбранный project, trigger или template, пользовательские параметры, условия фильтрации и actions, через которые Web3alert отправляет уведомления.

Проще говоря, project описывает доступную интеграцию, [triggers](triggers.md) и [templates](templates.md) описывают, на что можно подписаться, а subscription - это уже конкретная настройка workspace: что именно отслеживать, с какими условиями и куда отправлять результат.

## Что объединяет subscription

### Workspace

Subscription принадлежит активному workspace. Поэтому список подписок показывает настройки именно текущего workspace, а не только текущего пользователя.

Если пользователь переключает workspace, он видит и управляет другим набором subscriptions.

### Project

Каждая subscription связана с project. Project определяет marketplace-интеграцию, доступные triggers, templates, metadata и access level.

На странице project вкладка [Subscriptions](projects.md#subscriptions) показывает тот же список subscriptions, что и общий раздел [Subscriptions](subscriptions.md), но уже отфильтрованный по конкретному project.

### Trigger или template

Subscription может быть создана двумя способами:

- через [template](templates.md), когда пользователь выбирает готовый сценарий и topics;
- напрямую через [trigger](triggers.md), когда пользователю нужна более точная настройка события, inputs и filters.

Template внутри subscription разворачивается в rules. Rule указывает, какой trigger использовать и какие conditions применить.

### Inputs и filters

Inputs - значения, которые пользователь заполняет при создании subscription. Они могут быть нужны trigger напрямую или template rules.

Filters - дополнительные условия, которые ограничивают поток alerts. Например, можно получать уведомления только по конкретному адресу, token id или сумме.

Для template subscriptions часть filters может быть уже подготовлена владельцем project. Пользователь тогда заполняет только понятные inputs, а template сам применяет их в rules.

### Actions

Actions определяют, куда и как отправлять уведомление.

Обычно action связан с [resource](resources.md): Telegram chat, Discord channel, webhook или другим каналом доставки. Subscription может иметь один или несколько actions.

### Notification overrides

Для некоторых actions можно переопределить внешний вид уведомления: title, short/long message, icon, cover, avatar и links.

Если overrides не заданы, используются defaults trigger/template. Defaults - это рекомендация от создателя trigger, а не жесткое правило: пользователь может оставить их или заменить под свой сценарий.

## Как работает subscription

Когда source приносит новое событие, Web3alert проверяет triggers проекта. Если trigger сформировал output, engine применяет rules subscription: inputs, filters, template conditions и activation logic.

Если событие подходит под subscription, Web3alert формирует notification payload и передает его в выбранные actions.

Если событие не проходит условия, notification не отправляется.

## Состояния subscription

### On

Subscription активна и может отправлять alerts.

### Off

Subscription выключена пользователем или создана в выключенном состоянии. Она хранит настройки, но не отправляет alerts.

### Blocked

Subscription заблокирована сервисом. Обычно это связано с правами, лимитами, доступностью project/trigger/template или другой причиной, которую нужно исправить.

Blocked subscription нельзя просто считать удаленной: настройки остаются, но отправка alerts остановлена до устранения причины.

## Список subscriptions

В разделе `Subscriptions` можно:

- искать подписки по address, event или filter;
- включать и выключать subscription;
- открывать редактирование;
- дублировать subscription;
- запускать test run;
- поделиться ссылкой на настройку;
- удалить subscription.

В таблице показываются:

- `Triggers` - выбранный trigger/template, topics, inputs и filters;
- `Actions` - каналы доставки;
- `Settings` - состояние и действия управления.

## Создание

Подробный процесс создания описан в разделе [Create subscription](subscription-wizard.md).
