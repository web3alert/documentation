# Account

`Account` - это личная сущность пользователя в Web3alert.

Account отвечает за то, кто именно вошел в сервис, как выглядит личный профиль, какой тариф активен, какой баланс доступен для оплат и какие billing/referral действия принадлежат конкретному пользователю.

Account не заменяет [Workspace](workspaces.md). Workspace хранит рабочие сущности: проекты, подписки, resources, data sources, addresses и участников. Account хранит личный доступ, профиль и billing-контекст.

## Account и Workspace

### Что принадлежит Account

К account относятся:

- личный avatar и account title;
- user id;
- personal access token;
- billing profile;
- internal balance;
- account tier;
- auto-renewal тарифа;
- покупки account plans;
- покупки project free-access add-ons для проектов, которыми account может управлять в billing;
- personal coupons и gift coupons;
- referral link, referral code и referral rewards;
- удаление аккаунта.

Если пользователь переключает active workspace, account остается тем же. Меняются только рабочие данные, которые относятся к выбранному workspace.

Подробнее workspace и его настройки описаны в разделе [Workspaces](workspaces.md).

## Открыть Account parameters

`Account parameters` открываются из меню пользователя в правом верхнем углу интерфейса.

В этом меню доступны:

- `Account parameters`;
- `Log out`.

`Log out` завершает текущую сессию. Перед выходом показывается подтверждение.

## Account parameters

`Account parameters` содержит четыре вкладки:

- `Information`;
- `Billing`;
- `Referral`;
- `Danger zone`.

## Information

Вкладка `Information` содержит личные параметры account.

### Account

Панель профиля account.

В ней отображаются:

- avatar пользователя;
- account title;
- кнопка редактирования account title;
- подсказка для загрузки avatar.

### Avatar

Avatar используется в user menu и в местах интерфейса, где нужно показать текущего пользователя.

Чтобы заменить avatar, нужно нажать на текущую картинку. Поддерживаются `JPG` и `PNG` до 1 MB.

### Account title

Видимое имя пользователя.

Title можно изменить через кнопку редактирования рядом с именем. Во время редактирования:

- `Enter` сохраняет значение;
- `Escape` отменяет редактирование;
- потеря фокуса тоже сохраняет значение.

Ограничения:

- минимум 2 символа;
- максимум 80 символов;
- пустое значение сохранить нельзя.

### User ID

Read-only id текущего пользователя.

Он нужен для диагностики, поддержки и точной идентификации account в случаях, когда одного display name недостаточно.

### Personal access token

Личный access token текущей сессии.

По этому token пользователь получает доступ к Web3alert [API](api.md) и [MCP servers](mcp-server.md). Уровень доступных API/MCP возможностей зависит от текущего тарифа account.

Token следует считать секретом: не стоит отправлять его в публичные чаты, screenshots или документацию.

Token относится к account, а не к workspace.

## Billing

Вкладка `Billing` управляет балансом, тарифом, оплатами и coupons account.

Billing действия применяются к account, но некоторые покупки могут влиять на проекты, которыми account управляет.

### Balance

Internal balance account в EUR.

Баланс можно использовать для:

- покупки account plans;
- покупки project free-access add-ons;
- покупки gift coupons.

### Top up

Открывает пополнение баланса.

В dialog нужно указать amount в EUR и перейти к checkout платежного провайдера.

После подтверждения оплаты у провайдера средства появляются на internal balance.

### Current tier

Текущий тариф account.

В карточке показывается:

- название тарифа;
- дата, до которой account имеет entitlement;
- переключатель `Renew automatically`, если активен платный тариф.

### Renew automatically

Управляет автоматическим продлением активного тарифа.

Если переключатель включен, следующий период может быть оплачен автоматически выбранной payment strategy. Если выключен, тариф продолжает действовать до конца оплаченного периода, но не продлевается автоматически.

### Account plans

Список тарифов account.

Полный список лимитов и возможностей каждого тарифа описан на странице [Limits](limits.md).

### Free

Базовый тариф.

Дает unlimited access к free projects и ограниченное количество активных подписок на non-free project triggers.

### Advanced

Платный тариф для пользователей, которым нужен доступ к public/private project triggers и базовая возможность создавать собственные marketplace-сущности.

В текущем UI для Advanced отображаются основные возможности:

- access к public и private project triggers;
- один private project;
- один custom data source.

### Pro

Расширенный платный тариф.

В текущем UI для Pro отображаются основные возможности:

- access к public и private project triggers;
- до 5 private projects;
- до 5 custom data sources.

### Duration

Длительность покупки платного тарифа.

Доступные варианты зависят от billing pricing, обычно это 1, 3, 6 или 12 месяцев. Для некоторых длительностей может показываться discount.

### Pay / Upgrade

Кнопка действия на карточке тарифа.

В зависимости от текущего состояния она может означать:

- купить тариф;
- продлить текущий тариф на более длинный срок;
- upgrade на более высокий тариф;
- показать, что тариф уже активен;
- показать, что тариф заблокирован до конца текущего оплаченного периода.

Оплата через эту кнопку списывает средства с internal balance, поэтому balance должен быть достаточным.

### Project free-access add-on

Add-on, который открывает бесплатный доступ к project для всех пользователей сервиса.

Этот сценарий нужен, если владелец проекта хочет оплатить доступ к alerts для своего community. Пользователи смогут подписываться на такой проект как на free project, пока add-on активен.

Если add-on не продлить, проект автоматически станет public project. Подписки Free users на этот проект будут заморожены, если они превышают лимиты Free tier для non-free projects.

В списке отображаются проекты, которыми account может управлять в billing.

### Project card

Карточка project free-access add-on показывает:

- icon и title проекта;
- текущий status add-on;
- duration;
- `Renew automatically`;
- кнопку оплаты или текущий статус.

Если add-on активен, показывается дата окончания текущего периода. Если ожидается подтверждение оплаты, показывается состояние `Awaiting confirmation`.

### Coupons

Раздел coupons позволяет активировать coupon для себя или купить gift coupon для другого пользователя.

### Redeem coupon

Поле для ввода coupon code.

Если code активен, соответствующий plan применяется к account.

### Gift coupon

Покупка coupon code для другого пользователя.

Нужно выбрать:

- tier: `Advanced` или `Pro`;
- duration.

После подтверждения покупки сумма списывается с internal balance, а сервис показывает coupon code, который можно передать другому человеку.

### Your gift coupons

Список gift coupons, купленных текущим account.

Для каждого coupon показываются:

- code;
- tier;
- duration;
- status;
- кнопка copy для code.

### Recent invoices

Список последних billing attempts по account plans и project add-ons.

Для каждого invoice показываются:

- название invoice;
- amount;
- status;
- дата обновления.

Статус invoice помогает понять, была ли оплата успешной, ожидает подтверждения, завершилась ошибкой или была отменена.

## Referral

Вкладка `Referral` управляет referral link и referral rewards account.

### Referral rate

Процент reward, который начисляется от покупок приглашенных пользователей.

### Referred users

Количество accounts, связанных с referral code текущего пользователя.

### Earned total

Сумма referral rewards, начисленная на internal balance.

### Referral link

Shareable link для приглашения новых пользователей.

Если referral link еще не создан, кнопка `Generate link` создает его. После создания доступны:

- `Copy link`;
- `Copy code`.

Новые пользователи, которые приходят по referral link, связываются с referral account.

### Claim referral code

Позволяет вручную указать referral code, если пользователь пришел по приглашению, но code не был привязан автоматически.

Code можно отправить через кнопку `Claim code`. После успешной привязки поле очищается, а интерфейс показывает success message.

## Danger zone

Вкладка `Danger zone` содержит удаление account.

### Delete account

Удаляет account и все его subscriptions.

Перед удалением показывается подтверждение `Are you sure you want to delete this account?`.

После удаления текущая сессия завершается.

Это необратимое действие. Его стоит использовать только если account действительно больше не нужен.
