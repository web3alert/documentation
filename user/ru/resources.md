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

Telegram resource отправляет alerts в личный chat с ботом, group, topic forum-группы или channel.

Запустить setup или сменить этот destination может только владелец Web3alert
workspace. Это требование к роли в Web3alert отдельно от прав администратора
Telegram chat, описанных ниже.

Для него используется безопасная external setup session. Откройте Telegram из
формы resource и выберите в боте один из вариантов:

- личный chat с ботом;
- group или supergroup;
- channel;
- `General` или конкретный topic в forum-группе.

Для подключения group, forum или channel пользователь, который выполняет setup,
должен быть владельцем или администратором с правом добавить и повысить бота до
администратора. Бот Web3alert также должен быть администратором. В channel ему
требуется право публиковать сообщения, а в group или forum — право управлять
чатом и отправлять сообщения.

После выбора forum нажмите `Use General`, чтобы отправлять alerts в General. Для
другого topic откройте его в Telegram и отправьте в нем команду `/bindtopic`.

Подтверждение не позволяет сохранить произвольный chat id как destination.
Setup session истекает через 15 минут.

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

### Configure in Telegram

Для Telegram вместо URL используется кнопка `Configure in Telegram`. У уже
настроенного resource тот же flow доступен через `Change destination`.

Сервис создает setup session на 15 минут и открывает бота Web3alert. Одноразовую
setup-ссылку нельзя сохранять или добавлять в логи. Завершите выбор destination в
Telegram и вернитесь в Web3alert; resource станет ready после подтверждения ботом.

Перепривязка атомарна. Пока setup не завершен, существующие alerts продолжают
отправляться в текущий destination. Target меняется только после успешного
подтверждения; отмена, истечение session или ошибка оставляют старый target без
изменений.

### Add a resource

Для Discord, Slack и Webhook кнопка `Add a resource` сразу создает resource, если все обязательные поля заполнены корректно.

## Edit resource

`Edit` открывает форму редактирования существующего resource.

Можно изменить title и поля подключения, если тип resource это поддерживает. Name остается read-only, потому что он является частью стабильного fullname.

Если resource используется в subscriptions, изменение URL или подключения повлияет на все subscriptions, которые отправляют alerts в этот resource. Для Telegram предыдущий destination продолжает работать до успешного завершения новой setup session.

## Delete resource

`Delete` удаляет resource из workspace.

Перед удалением важно проверить, не используется ли resource в активных subscriptions. Если удалить канал доставки, subscriptions, которые ссылались на него, больше не смогут отправлять alerts через этот resource.
