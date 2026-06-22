# Create Subscription

`Create subscription` - wizard, который создает новую subscription для активного workspace. В нем пользователь выбирает, на что подписаться, задает условия и выбирает actions для доставки alerts.

Wizard можно открыть из общего раздела [Subscriptions](subscriptions.md), со страницы [project](projects.md) или через кнопку `Subscribe` у [template](templates.md). Если wizard открыт из project/template, часть выбора уже заполнена заранее.

## Общая структура wizard

Wizard состоит из двух основных частей:

- `Trigger` - выбор project/template/trigger, topics, inputs и filters;
- `Action` - выбор канала доставки и настройка параметров action.

Если wizard открыт из общего раздела `Subscriptions`, сначала нужно выбрать project. Если wizard открыт со страницы project, выбор project пропускается.

## Step 1. Project

Этот шаг появляется, когда subscription создается из общего раздела, без заранее выбранного project.

### Project picker

Позволяет выбрать project, на который нужно подписаться.

После выбора project wizard переходит к настройке trigger/template. Если project уже передан в URL, например со страницы project или template, этот шаг пропускается.

## Step 2. Trigger

На этом шаге выбирается, что именно будет запускать alerts.

Если project поддерживает templates и прямые triggers, wizard показывает выбор способа создания subscription.

### Templates

`Templates` - готовые сценарии подписки, подготовленные владельцем project.

Этот путь обычно проще: пользователь выбирает template, затем topic и заполняет только те inputs, которые нужны выбранным topics.

### Events and calls

`Events and calls` - прямой выбор trigger.

Этот путь ближе к технической настройке: пользователь выбирает trigger category, конкретный trigger и сам задает inputs/filters, если они доступны.

## Template flow

Template flow используется, если выбран способ `Templates` или пользователь нажал `Subscribe` на template.

### Choose a template

Если в project несколько templates, wizard предлагает выбрать нужный template.

Если template один, wizard может сразу перейти к выбору его topics.

### Choose a category

Внутри template topics могут быть сгруппированы по category/template group.

Пользователь выбирает группу, чтобы увидеть связанные topics и inputs.

### Pick the triggers and fill in the required fields

На этом шаге пользователь выбирает topics и заполняет inputs.

Topics - это чекбоксы внутри template. Можно выбрать один или несколько topics.

Inputs могут быть:

- common - общие для нескольких выбранных topics;
- unique - относятся только к конкретному topic.

Если topic требует input, его нужно заполнить перед переходом к actions.

## Direct trigger flow

Direct trigger flow используется, если выбран способ `Events and calls`.

### Trigger category

Triggers сгруппированы по категориям. В project flow категории обычно соответствуют группам triggers проекта.

### Trigger

Конкретный trigger, который будет использовать subscription.

После выбора trigger wizard показывает description, если она есть, и открывает параметры trigger.

### Inputs

Inputs - обязательные или опциональные значения, которые trigger ожидает от пользователя.

Например, trigger может попросить адрес, порог суммы или другой параметр. Поля строятся по schema trigger.

### Filters

Filters позволяют сузить alerts и не получать лишние уведомления.

Если filters не нужны, их можно не добавлять. Если добавить несколько filters, их можно объединять логикой `AND` и `OR`:

- `AND` - событие должно пройти все условия группы;
- `OR` - событие должно пройти хотя бы одну группу условий.

### Add a filter

Добавляет новое условие.

Для filter выбирается поле, оператор и значение. Доступные поля зависят от trigger schema.

### Delivery type

Определяет, как часто subscription доставляет alerts после того, как inputs и filters совпали.

- `Every match` отправляет каждое событие, прошедшее filters.
- `Once` отправляет только первое совпавшее событие для этой subscription.
- `Once per key` отправляет первое совпавшее событие для каждого выбранного output value. Выбирайте стабильный `Key path`, например поле market, event, account или user. Не используйте уникальные технические значения вроде transaction hash или block number, если только каждое событие не должно считаться новым key.

## Step 3. Action

На этом шаге выбирается, куда отправлять alerts.

### Simple mode

Simple mode показывает доступные resources и позволяет выбрать один или несколько каналов доставки.

Это основной сценарий для обычного создания subscription: выбрать Telegram, Discord, webhook или другой ресурс, который уже подключен к workspace.

### Add new resource

Открывает форму создания resource, если нужного канала еще нет.

Подробнее resources описаны в разделе [Resources](resources.md).

### Advanced mode

Advanced mode доступен для прямого trigger flow. Он позволяет выбрать action type вручную, заполнить action parameters и, если action поддерживает это, настроить notification overrides.

Для template flow используется простой выбор resources, потому что template уже задает пользовательский сценарий подписки.

### Choose the action type

Выбор конкретного action, например отправка в Telegram, Discord или другой канал.

### Set parameters

Параметры выбранного action. Обычно среди них есть resource, куда нужно отправлять alert, и дополнительные поля, если action их требует.

## Notification overrides

Если action поддерживает overrides, можно включить отдельные поля и заменить defaults уведомления.

### Title

Заголовок уведомления.

### Short

Короткий текст уведомления.

### Message

Длинный текст уведомления.

### Icon

URL иконки.

### Cover

URL обложки.

### Avatar

URL аватара уведомления.

### Links

Ссылки в уведомлении. Для каждой ссылки задается title и URL.

Overrides поддерживают Handlebars/template syntax и Markdown там, где это доступно в action. Значения рендерятся от trigger output, поэтому можно использовать поля raw/human output и helper-ы, описанные в [Defaults](trigger-wizard.md#handlebars-helpers).

## Test run

На финальном шаге доступен `Test run`.

Test run позволяет проверить draft subscription перед сохранением: выбранные rules, filters, inputs и actions. В результате можно увидеть, совпало ли событие с условиями и какие actions были бы выполнены.

Если test run показывает issues, лучше исправить subscription до сохранения.

## Save alert

`Save alert` создает или обновляет subscription.

После успешного сохранения wizard возвращает пользователя:

- в общий раздел [Subscriptions](subscriptions.md), если subscription создавалась оттуда;
- на вкладку [Subscriptions](projects.md#subscriptions) конкретного project, если wizard был открыт из project flow;
- на исходную страницу, если wizard был открыт со специальным `returnTo`.

## Edit, duplicate и delete

Уже созданную subscription можно открыть на редактирование из списка [Subscriptions](subscriptions.md).

`Duplicate` открывает wizard с настройками существующей subscription, но сохраняет результат как новую subscription.

`Delete` удаляет subscription. После удаления alerts по этой subscription больше не отправляются.
