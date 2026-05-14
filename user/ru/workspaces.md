# Workspaces

`Workspace` - это рабочее пространство Web3alert, внутри которого команда хранит и настраивает свои проекты, подписки, ресурсы доставки, источники данных и адресную книгу.

Проще говоря, аккаунт отвечает за личный вход пользователя, профиль и биллинг, а workspace отвечает за совместную работу и за рабочие данные сервиса.

Один аккаунт может состоять в нескольких workspaces. Активный workspace выбирается в левом меню, и от него зависит, какие сущности пользователь видит в основных разделах сервиса:

- [Projects](projects.md) - проекты, созданные в workspace, а также доступные marketplace-проекты;
- [Subscriptions](subscriptions.md) - подписки именно текущего workspace;
- [Resources](resources.md) - каналы доставки и внешние endpoints текущего workspace;
- [Data sources](data-sources.md) - custom data sources текущего workspace и доступные system sources;
- [Addresses](addresses.md) - address book текущего workspace.

## Workspace и Account

Важно не смешивать workspace с account.

### Account

`Account` - это личная сущность пользователя.

К account относятся:

- способы авторизации;
- личный профиль и avatar пользователя;
- billing profile;
- баланс;
- текущий тариф;
- покупки тарифов и project free-access add-ons;
- личное участие пользователя в разных workspaces.

### Workspace

`Workspace` - это рабочая сущность команды или пользователя.

К workspace относятся:

- title, avatar и name workspace;
- участники workspace и их роли;
- invite link для добавления участников;
- проекты, созданные в этом workspace;
- project transfer requests;
- подписки workspace;
- resources workspace;
- custom data sources workspace;
- address book workspace;
- subscription logs workspace.

Если пользователь переключает active workspace, он остается тем же account, но видит другой рабочий контекст.

## Левое меню Workspace

В левом меню есть отдельный блок `Workspace`.

### Current workspace

В верхней строке блока показывается текущий workspace: его avatar или первая буква названия, title и стрелка раскрытия.

Нажатие на строку раскрывает workspace-menu.

### Parameters

Открывает `Workspace parameters` - страницу настроек текущего workspace.

Именно здесь редактируются параметры workspace, участники, transfer requests и subscription logs.

### Switch workspaces

Показывает другие workspaces, в которых состоит текущий account.

Нажатие на другой workspace переключает active workspace. После переключения интерфейс остается в том же разделе, если это возможно. Например, пользователь может переключиться из `Projects` одного workspace в `Projects` другого. Если текущая детальная страница больше не существует в новом workspace, интерфейс возвращает пользователя к списку проектов.

### Add workspace

Открывает создание нового workspace.

## Создание workspace

Новый workspace создается через левое меню: `Workspace` -> `Add workspace`.

После создания интерфейс переключает пользователя в новый workspace и открывает раздел [Projects](projects.md).

### Title

Видимое название workspace.

Title показывается в левом меню, настройках workspace и других местах интерфейса, где нужно человекочитаемое имя рабочего пространства.

Title обязателен.

### Name

Стабильный slug workspace.

Name используется как техническое имя workspace и входит в fullname сущностей, которые принадлежат workspace. Например, проект может получить fullname вида `<workspace>.<project-name>`.

Name обязателен и должен быть в kebab-case: латинские буквы, цифры и дефисы.

Пока пользователь не менял `Name` вручную, форма пытается сгенерировать его из `Title`. Если title содержит неподходящие символы, name нужно заполнить вручную.

### Reserved names

Некоторые имена зарезервированы платформой.

Например, workspace names и titles, связанные с `common` или `web3alert`, нельзя использовать для обычных пользовательских workspaces.

### Cancel

Отменяет создание workspace и возвращает пользователя в основной интерфейс.

## Workspace roles

Участник workspace имеет одну из ролей.

### Owner

Главный владелец workspace.

Owner может управлять настройками workspace, участниками и project transfers. Transfer проекта из workspace доступен только owner.

### Admin

Администратор workspace.

Admin может управлять workspace settings и участниками, но не может инициировать project transfer от имени владельца.

### Developer

Участник, который работает с техническими сущностями workspace.

Конкретный доступ зависит от прав на проекты и разделы сервиса. В настройках workspace developer не управляет участниками и transfer requests.

### User

Базовый участник workspace.

Обычно использует готовые проекты, подписки и ресурсы, но не управляет настройками workspace.

## Workspace parameters

`Workspace parameters` - это меню настроек активного workspace.

Набор вкладок зависит от роли пользователя и от самого workspace. Например, `Project transfers` доступен только owner.

На узких экранах вкладки отображаются как compact select, но состав вкладок остается тем же.

## Information

Вкладка `Information` содержит основные параметры workspace.

### Workspace

Панель профиля workspace.

В ней отображаются:

- avatar workspace;
- title workspace;
- кнопка редактирования title.

### Avatar

Avatar workspace отображается в левом меню и в местах, где нужно визуально отличить один workspace от другого.

Чтобы заменить avatar, нужно нажать на текущую картинку. Поддерживаются `JPG` и `PNG` до 1 MB.

При загрузке открывается crop tool. Для workspace используется rounded-square crop, потому что avatar workspace в интерфейсе отображается как квадрат со скругленными углами.

### Title

Title можно редактировать прямо в панели workspace.

После сохранения новое название появляется в левом меню и в workspace settings.

Title не может быть пустым.

### Name

Read-only имя workspace.

Name нельзя редактировать из настроек, потому что оно участвует в fullname сущностей и ссылках.

## Members

Вкладка `Members` управляет участниками workspace.

Она доступна пользователям, которые могут управлять workspace. Обычно это owner и admin.

### Invite new members

Для обычных workspaces вкладка показывает invite link.

Этот link можно скопировать и отправить пользователю, которого нужно добавить в workspace. По invite link пользователь сначала авторизуется, если он еще не вошел в Web3alert, затем нажимает `Join` и попадает в workspace.

### Workspace members

Список участников workspace.

Для каждого участника показываются:

- avatar или первая буква имени;
- display name;
- отметка `You`, если это текущий пользователь;
- текущая role;
- кнопка удаления, если текущий пользователь может удалять участников.

### Role select

Позволяет изменить роль участника.

Изменение применяется сразу после выбора роли.

Доступные роли:

- `Owner`;
- `Admin`;
- `Developer`;
- `User`.

### Remove member

Удаляет участника из workspace.

Перед удалением показывается подтверждение. Если пользователь удаляет самого себя, действие работает как `Leave workspace`.

### Members access

Если у пользователя нет прав на управление участниками, вкладка показывает read-only состояние.

В этом режиме пользователь видит, что приглашать участников, менять роли и удалять людей могут только owner или admin.

## Project transfers

Вкладка `Project transfers` управляет переносом проектов между workspaces.

Она доступна только owner текущего workspace.

Transfer не переносит проект сразу. Сначала создается request, затем owner целевого workspace принимает или отклоняет его. Проект меняет владельца только после принятия request.

### Create transfer request

Форма подготовки transfer request.

### Project

Проект, который нужно перенести.

Список содержит проекты текущего workspace, доступные для transfer.

### Target workspace

Name workspace, который должен получить проект.

Самого знания workspace name недостаточно для переноса: request все равно должен быть принят owner целевого workspace.

### Target project name

Новое имя проекта в целевом workspace.

Если оставить поле пустым или оставить текущее значение, проект сохранит свой name. Если нужно перенести проект с переименованием, здесь указывается новый project name.

### Get plan

Строит transfer plan до создания request.

Plan показывает, что именно будет затронуто:

- количество triggers;
- количество templates;
- количество topics;
- количество subscriptions;
- количество aliases, которые нужно обновить.

Если обнаружены конфликты, request нельзя создать до их исправления.

### Conflicts

Список проблем, которые мешают переносу.

Например:

- target workspace не найден или не может принять transfer;
- в target workspace уже есть проект с таким именем;
- целевые trigger fullnames конфликтуют с существующими triggers;
- aliases уже заняты другими сущностями.

### Request transfer

Создает transfer request по последнему построенному plan.

Если после построения plan данные изменились, backend может отклонить request и попросить построить plan заново.

### Outgoing requests

Запросы, отправленные из текущего workspace.

Для каждого request показываются:

- source project и target project;
- дата создания;
- срок истечения;
- status;
- краткое количество triggers/templates.

Pending request можно отменить кнопкой `Cancel`.

### Incoming requests

Запросы, пришедшие в текущий workspace.

Pending request можно принять кнопкой `Accept` или отклонить кнопкой `Reject`.

После принятия backend применяет transfer: меняет workspace проекта, обновляет связанные fullnames и aliases, а затем request получает финальный status.

## Subscription logs

Вкладка `Subscription logs` показывает историю alerts для подписок текущего workspace.

Это рабочий журнал доставки: он помогает понять, какие subscription alerts были отправлены, заблокированы, ограничены rate limit или завершились ошибкой.

### Last entries

Ограничивает количество записей в журнале.

Доступные значения:

- `50`;
- `100`;
- `250`;
- `500`.

### Auto-refresh

Включает автоматическое обновление журнала.

Доступные значения:

- `Off`;
- `5s`;
- `10s`;
- `30s`.

Когда auto-refresh включен, фильтр по дате скрывается, потому что журнал работает как live-view последних событий.

### Before / After

Фильтр по времени.

`Before` показывает записи до выбранной даты и времени. `After` показывает записи после выбранной даты и времени.

### Date and time

Выбор даты и времени для фильтра `Before` или `After`.

В popover можно выбрать день, hour и minute. Кнопка `Now` подставляет текущее время, `Clear` очищает фильтр.

### Refresh

Ручное обновление журнала.

### Time

Колонка времени создания log entry.

Кнопка в заголовке сортирует записи по времени: от новых к старым или от старых к новым.

### Subscription

Колонка с маршрутом alert.

В ней отображается project, trigger или template context, а также каналы доставки. Если у подписки были inputs или filters, рядом может отображаться details badge с краткой подсказкой.

### Status

Фильтр и колонка статуса.

Доступные статусы:

- `Delivered`;
- `Failed`;
- `Rate limited`;
- `Blocked`.

### Expanded log row

Нажатие на строку раскрывает детали:

- `Reason` - причина ошибки или дополнительная информация;
- `Input` - replay/test input, если он есть;
- `Test run` - запуск теста подписки на основе данных log entry, если для этой записи доступна связанная subscription.

## Danger zone

Вкладка `Danger zone` содержит выход из workspace.

### Leave workspace

Удаляет текущего пользователя из workspace.

Перед выходом показывается подтверждение.

Если пользователь является единственным участником workspace, после выхода workspace будет удален.

### Last workspace

Если это единственный workspace пользователя, покинуть его нельзя.

В этом случае кнопка `Leave` отключена, а вкладка показывает состояние `You cannot leave your last workspace`.
