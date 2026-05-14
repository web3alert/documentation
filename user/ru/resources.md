# Resources

`Resources` - это подключенные каналы доставки и внешние endpoints, которые workspace использует для отправки alerts.

Проще говоря, subscription определяет, на что подписаться, а resource отвечает на вопрос “куда отправить результат”: в Telegram chat, Discord channel, Slack channel или на webhook URL.

## Для чего нужны resources

Resource хранит подключение к конкретному каналу или endpoint. Благодаря этому один и тот же канал можно использовать в разных [subscriptions](subscriptions.md), не вводя его заново каждый раз.

Например, workspace может создать:

- Telegram resource для основного чата команды;
- Discord resource для канала мониторинга;
- Webhook resource для собственного backend endpoint;
- Slack resource для рабочего канала.

После этого при создании [subscription](subscription-wizard.md) пользователь просто выбирает нужный resource в шаге `Action`.

## Как resources связаны с actions

`Action` описывает способ отправки уведомления: Telegram message, Discord webhook, Slack webhook или HTTP webhook.

`Resource` хранит конкретную цель для этого action:

- для Telegram - подключенный chat;
- для Discord - webhook URL канала;
- для Slack - webhook URL канала;
- для Webhook - URL вашего endpoint.

В простом режиме создания subscription интерфейс показывает resources как список доступных каналов доставки. В advanced mode action может попросить выбрать resource как один из параметров.

## Workspace scope

Resources принадлежат текущему workspace. Если переключить workspace, список resources тоже изменится.

Управлять resources могут пользователи с правами управления workspace. Если у пользователя нет таких прав, раздел `Resources` будет недоступен для просмотра и редактирования.

## Resource blueprint

Каждый resource создается по blueprint. Blueprint определяет тип resource, иконку, название в UI и поля, которые нужно заполнить.

Сейчас доступны четыре типа resources.

### Telegram

Telegram resource используется для отправки alerts в Telegram chat.

Это external resource: при создании сервис сначала выдает инструкции. Пользователь следует этим инструкциям в Telegram, после чего resource становится ready и его можно выбирать в subscriptions.

Такой flow нужен потому, что Web3alert должен получить подтвержденную связь с конкретным chat, group или channel, а не просто произвольную строку.

### Discord

Discord resource используется для отправки alerts в Discord channel через webhook.

В форме указывается `URL` Discord webhook. Его нужно создать в настройках нужного канала Discord и вставить в resource.

### Slack

Slack resource используется для отправки alerts в Slack channel через Incoming WebHook.

В форме указывается `URL` Slack webhook. Его нужно создать в настройках Slack workspace/channel и вставить в resource.

### Webhook

Webhook resource используется для отправки alerts на произвольный HTTP endpoint.

В форме указывается `URL`, на который Web3alert будет отправлять notification payload. Этот тип удобен, если alerts нужно передавать в собственный backend, automation system или другой внешний сервис.

## Список resources

В разделе `Resources` отображаются resources текущего workspace.

Для каждого resource показываются:

### Icon

Иконка типа resource. Она берется из blueprint.

### Title

Человекочитаемое название resource. Его можно использовать как короткое понятное имя канала, например `Main Telegram`, `Ops Discord` или `Backend webhook`.

### State

Текстовый статус resource, если он есть.

Для external resources статус помогает понять, завершено ли подключение. Например, Telegram resource может быть недоступен для выбора в subscription, пока подключение не подтверждено.

### Actions

У resource есть меню управления. Через него можно открыть редактирование или удалить resource.

## Add resource

`Add resource` открывает форму создания resource.

### Type

Сначала выбирается тип resource: Telegram, Discord, Slack или Webhook.

Если форма открыта из [Create subscription](subscription-wizard.md), список типов может быть ограничен теми resources, которые подходят выбранному action.

### Title

Видимое название resource в интерфейсе.

Лучше выбирать название по смыслу канала, а не по техническому типу: например `Alerts channel`, `DAO ops`, `Main backend webhook`.

### Name

Стабильный slug resource внутри workspace.

Name входит в fullname resource и используется как внутренний идентификатор. Обычно он заполняется автоматически из title, но его можно отредактировать до сохранения.

После создания resource name уже нельзя менять.

### URL

Поле появляется у Discord, Slack и Webhook resources.

В него вставляется webhook URL соответствующего сервиса. Для Discord и Slack URL валидируется по формату конкретной платформы.

### Get instructions

Для Telegram вместо URL используется кнопка `Get instructions`.

После нажатия сервис создает draft resource и показывает инструкции подключения. Когда Telegram подтверждает подключение, resource становится ready и появляется в списке доступных каналов доставки.

### Add a resource

Для Discord, Slack и Webhook кнопка `Add a resource` сразу создает resource, если все обязательные поля заполнены корректно.

## Edit resource

`Edit` открывает форму редактирования существующего resource.

Можно изменить title и поля подключения, если тип resource это поддерживает. Name остается read-only, потому что он является частью стабильного fullname.

Если resource используется в subscriptions, изменение URL или подключения повлияет на все subscriptions, которые отправляют alerts в этот resource.

## Delete resource

`Delete` удаляет resource из workspace.

Перед удалением важно проверить, не используется ли resource в активных subscriptions. Если удалить канал доставки, subscriptions, которые ссылались на него, больше не смогут отправлять alerts через этот resource.
