# Карта структуры сервиса Web3alert

Статус: черновик инвентаризации для новой документации.

Документ описывает текущую структуру сервиса по новому UI и API-ручкам, которые этот UI использует. Старые файлы пользовательской документации и seed-контент не использовались как источник истины.

## Источники анализа

- UI-маршруты и навигация: `ui/app/(protected)/(with-shell)`.
- UI-модели и сторы: `ui/app/(protected)/(with-shell)/_models`, `ui/app/_models`.
- UI-сервисы и API-клиенты: `ui/app/(protected)/(with-shell)/_services`, `ui/app/_services`.
- Компоненты проектов, триггеров, шаблонов, источников данных, биллинга, аккаунта и workspace.
- API routes: `api/src/web/api/v1`, `api/src/web/api/v2`.
- Entity/database modules как вспомогательный контекст: `api/src/notify-database`, `api/src/notify`.

## Базовая модель продукта

Основная цепочка сервиса:

1. Пользователь работает в аккаунте и активном workspace.
2. Workspace владеет проектами, источниками данных, ресурсами, триггерами, шаблонами и подписками.
3. Project группирует alertable-сигналы и переиспользуемые шаблоны.
4. Trigger описывает условие старта: blockchain event/call/block, EVM transaction/call/log, Substrate event/extrinsic/block или timer.
5. Subscription связывает trigger/template с action-ами.
6. Action выполняет доставку или обращение к внешнему ресурсу.
7. Resource хранит конкретную настройку endpoint-а или integration target-а.
8. Logs/history показывают matched, delivered, blocked, rate-limited и failed события.

## Основная навигация

Текущий shell показывает:

- `Projects`: управление проектами, проектные страницы, триггеры, шаблоны.
- `Subscriptions`: все alert subscriptions.
- `Resources`: настроенные delivery/action resources.
- `Data Sources`: custom/runtime source dashboard.
- `Addresses`: address book.
- `Workspace / Parameters`: информация, участники, coupons, subscription logs, danger zone.
- `Account parameters`: профиль, billing, referral, danger zone.
- `Billing`: отдельный billing dashboard и checkout result.

Legacy network-centric routes ещё присутствуют:

- `/[network]`
- `/[network]/[action]/[subscriptionId]`
- `/alerts`
- `/alerts/add`

Новые project-centric routes:

- `/projects`
- `/projects/create`
- `/projects/[project]`
- `/projects/[project]/edit`
- `/projects/[project]/triggers/create`
- `/projects/[project]/triggers/import`
- `/projects/[project]/triggers/[trigger]`
- `/projects/[project]/templates/create`
- `/projects/[project]/templates/[template]`
- `/projects/[project]/templates/[template]/topics/create`
- `/projects/[project]/templates/[template]/topics/[topic]`

## Категории

В продукте есть несколько разных понятий category. В документации их нужно разделять.

### Source Categories

Используются для группировки source/network карточек.

- API: `GET /api/v1/categories`.
- Shape: `name`, `index`, `meta.title`.
- Source membership приходит через `GET /api/v1/sources`, поле `categories: [{ category, index }]`.

### Trigger Constructor Categories

Используются в alert/subscription wizard.

- `Templates`: наборы готовых topics/rules.
- `Events and calls`: полный список доступных triggers.
- `Smart contract`: legacy/custom ABI bundle path.

### Project Trigger Category

Поле в trigger wizard.

- UI-поле: `Category`.
- Используется как группировка/scope для проектных triggers.
- Важно не путать с source categories.

### Data Source Kind

Тип runtime/custom source.

- `EVM`
- `Substrate`

### Project Access Level

Категория доступа проекта.

- `Private`
- `Public`
- `Free`

## Основные сущности

### Account

Пользовательский аккаунт.

Поля/функции:

- nickname
- avatar
- текущий workspace
- tier/permissions
- delete account

API:

- `GET /api/v1/me`
- `PUT /api/v1/me/meta`
- `POST /api/v1/me/avatar`
- `DELETE /api/v1/me`
- `POST /api/v1/me/workspace`
- `GET /api/v1/me/workspace`

### Workspace

Контейнер владения и доступа.

Поля/функции:

- `name`, `fullname`
- `meta.title`
- memberships
- invite/access control
- coupons
- subscription logs

Роли:

- `owner`
- `admin`
- `developer`
- `user`

Workspace tabs:

- Information
- Members
- Coupons
- Subscription logs
- Danger zone

API:

- `GET /api/v2/workspaces`
- `GET /api/v2/workspaces/:fullname`
- `PUT /api/v2/workspaces/:fullname`
- `DELETE /api/v2/workspaces/:fullname`
- `GET /api/v2/workspaces/:workspace/acl`
- `POST /api/v2/workspaces/:workspace/acl`
- `PUT /api/v2/workspaces/:workspace/acl/:entryId`
- `DELETE /api/v2/workspaces/:workspace/acl/:entryId`

### Project

Главная новая сущность пользовательского сценария.

Поля:

- `workspace`, `name`, `fullname`
- `title`, `description`, `shortDescription`
- `tags`, `labels`
- `links`, `images`, `icon`, `avatar`, `cover`
- `accessLevel`: `private`, `public`, `free`
- `visibility`: `personal`, `public`
- `publishState`: `draft`, `published`, `archived`

Project page tabs:

- Overview
- Subscriptions
- Triggers
- Templates

API:

- `GET /api/v2/projects?scope=marketplace`
- `GET /api/v2/projects/create-capability`
- `GET /api/v2/projects/:fullname`
- `PUT /api/v2/projects/:fullname`
- `DELETE /api/v2/projects/:fullname`
- `POST /api/v2/projects/:fullname/publish`
- `PUT /api/v2/projects/:fullname/draft`
- `GET /api/v2/projects/:fullname/draft`
- `POST /api/v2/projects/:fullname/draft/validate`
- `POST /api/v2/projects/:fullname/assets/images`
- `GET /api/v2/projects/:fullname/assets/images/:asset`
- `POST /api/v2/projects/:fullname/access-links`
- `GET /api/v2/projects/by-link/:token`

### Data Source

Источник blockchain/runtime данных. В UI объединены custom sources и runtime-only sources.

Kinds:

- `evm`
- `substrate`

Runtime statuses:

- `running`
- `degraded`
- `error`
- UI также показывает pending/registered состояния при сопоставлении custom source и runtime source.

Custom source fields:

- `workspace`, `name`, `fullname`
- `kind`
- `endpoint`
- `public`
- `batchMaxCount`
- `blockProcessingConcurrency`
- `maxQueuedBlocks`
- `substrate.extensions`
- `meta.title`, `meta.description`

Substrate extensions:

- presets: `avail`, `statemint`, `statemine`
- signed extensions
- custom types
- RPC method definitions

API:

- `GET /api/v2/custom-sources`
- `GET /api/v2/custom-sources/create-capability`
- `GET /api/v2/custom-sources/:fullname`
- `PUT /api/v2/custom-sources/:fullname`
- `DELETE /api/v2/custom-sources/:fullname`
- `POST /api/v2/custom-sources/verify`
- `GET /api/v2/custom-sources/:fullname/logs`
- `POST /api/v2/custom-sources/:fullname/reset-lag`
- `POST /api/v2/custom-sources/:fullname/test-status`
- `GET /api/v2/triggers/runtime-sources`

### Trigger

Переиспользуемое описание события, которое может запускать alert.

Identity:

- `workspace`, `project`, `name`, `fullname`
- `meta.title`, `meta.description`
- `labels`
- optional `defaults`

Trigger spec types:

- `evm_log`
- `evm_transaction`
- `substrate_event`
- `timer`

Source selection:

- Blockchain
  - EVM: block, transaction, event, call.
  - Substrate: block, event, extrinsic.
- Timer
  - interval format вроде `5m`.

Schema areas:

- inputs schema: что заполняет пользователь subscription.
- filters schema: какие conditions пользователь может настраивать.
- output schema:
  - raw output
  - human output

Provider types:

- `http`
- `graphql`
- `rpc`
- `substrate_storage`
- `evm_read`
- `state_window`
- `javascript`

Transforms:

- JavaScript raw transform.
- JavaScript human transform.
- Transform context использует source, inputs, providers и built-in helpers.

Testing:

- whole trigger test
- block-based test
- provider-level test
- preview output/issues/source input/trigger output/debug

API:

- `GET /api/v2/triggers`
- `GET /api/v2/triggers/:fullname`
- `PUT /api/v2/triggers/:fullname`
- `DELETE /api/v2/triggers/:fullname`
- `GET /api/v2/triggers/:fullname/draft`
- `PUT /api/v2/triggers/:fullname/draft`
- `POST /api/v2/triggers/:fullname/draft/validate`
- `POST /api/v2/triggers/preview`
- `POST /api/v2/triggers/test`
- `POST /api/v2/triggers/test-block`
- `POST /api/v2/triggers/providers/test`
- `POST /api/v2/triggers/find-latest-block`
- `GET /api/v2/triggers/runtime-sources`
- `GET /api/v2/triggers/substrate/source`
- `GET /api/v2/triggers/substrate/pallets`
- `GET /api/v2/triggers/substrate/pallet`

### Project Template

Project-level subscription preset. В UI верхнеуровневые groups называются `Templates`.

Template root:

- `project`
- `schema`
- `groups`
- `topics`
- `rules`
- `meta.title`, `meta.description`

Group:

- internal `name`
- title
- description

Topic:

- internal `name`
- group reference
- title
- optional description
- `selectedByDefault`

Rule:

- `id`
- trigger reference
- topic reference
- inputs
- policy
- conditions
- required template values
- deprecated flag

Condition model:

- AND внутри группы.
- OR между группами.
- operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`.
- literal values или template input values.
- address-aware helpers.

API:

- `GET /api/v2/projects/:fullname/template`
- `GET /api/v2/projects/:fullname/templates`
- `POST /api/v2/projects/:fullname/templates`
- `GET /api/v2/projects/:fullname/templates/:id`
- `PUT /api/v2/projects/:fullname/templates/:id`
- `DELETE /api/v2/projects/:fullname/templates/:id`

### Subscription

Связка trigger/template с action-ами.

Поля:

- `app`: legacy network или project fullname
- `state`: `on`, `off`, `blocked`
- `rules`
- `template`
- `actions`
- `identities`: legacy delivery identity list
- `references.bundles`
- optional `meta.title`, `meta.issue`

Rule:

- event reference
- conditions
- policy
- inputs

Action in subscription:

- action fullname
- values
- overrides: `title`, `short`, `long`, `icon`, `cover`, `avatar`, `links`

API:

- `GET /api/v1/subscriptions`
- `GET /api/v1/subscriptions/:id`
- `POST /api/v1/subscriptions`
- `POST /api/v1/subscriptions/:id`
- `DELETE /api/v1/subscriptions/:id`
- `POST /api/v1/subscriptions/:id/state`
- `POST /api/v2/subscriptions/test`
- `GET /api/v2/subscriptions/:id/alerts/history`
- `GET /api/v2/subscriptions/alerts/history`

### Action

Действие, выполняемое после match-а subscription.

Поля:

- `workspace`, `project`, `name`, `fullname`
- values schema
- supported overrides
- `meta.title`, `meta.description`, `meta.icon`

API:

- `GET /api/v2/actions`
- `GET /api/v2/actions/:fullname`
- `PUT /api/v2/actions/:fullname`
- `DELETE /api/v2/actions/:fullname`

### Blueprint

Описание типа ресурса.

Types:

- `external`
- `plain`

Поля:

- `workspace`, `project`, `name`, `fullname`
- `public`
- `data` schema для plain blueprints
- `meta.icon`, `meta.title`

API:

- `GET /api/v2/blueprints`
- `GET /api/v2/blueprints/:fullname`
- `PUT /api/v2/blueprints/:fullname`
- `DELETE /api/v2/blueprints/:fullname`

### Resource

Настроенный target для action.

Поля:

- `workspace`, `name`, `fullname`
- `blueprint`
- `public`
- `ready`
- `token`
- `data`
- `meta.title`

External resources:

- имеют token-based setup instructions.
- UI polling проверяет `ready`.

API:

- `GET /api/v2/resources`
- `GET /api/v2/resources/:fullname`
- `PUT /api/v2/resources/:fullname`
- `DELETE /api/v2/resources/:fullname`
- `GET /api/v2/resources/external/:token`
- `POST /api/v2/resources/external/:token`

### Address Book

Справочник reusable addresses и alias-ов.

Address types:

- `plain`
- `ss58`
- `bitcoin`
- `evm`
- `sui`
- `cosmos`

API:

- `GET /api/v1/addressbook`
- `POST /api/v1/addressbook`
- `POST /api/v1/addressbook/:id`
- `DELETE /api/v1/addressbook/:id`

### Billing

Биллинг покрывает account plan, project addon, wallet balance, crypto checkout, coupons и referrals.

Plan IDs:

- `free`
- `advanced`
- `pro`

Addon:

- `project-free-access`

Subscription kinds:

- `account-plan`
- `project-addon`

Payment methods:

- `card`
- `apple_pay`
- `google_pay`
- `crypto`

Wallet:

- currency: `EUR`
- ledger entries
- crypto top-ups
- gift coupons

Referral:

- referral link
- claim code
- referral rewards в wallet balance

API:

- `GET /api/v2/billing/overview`
- `GET /api/v2/billing/wallet/overview`
- `POST /api/v2/billing/wallet/crypto-topup`
- `POST /api/v2/billing/wallet/topup/refresh`
- `POST /api/v2/billing/account-plan/checkout`
- `POST /api/v2/billing/account-plan/crypto-checkout`
- `POST /api/v2/billing/account-plan/balance-purchase`
- `POST /api/v2/billing/project-addon/checkout`
- `POST /api/v2/billing/project-addon/crypto-checkout`
- `POST /api/v2/billing/project-addon/balance-purchase`
- `POST /api/v2/billing/crypto-checkout/cancel`
- `POST /api/v2/billing/crypto-checkout/refresh`
- `POST /api/v2/billing/subscription/update-renewal`
- `POST /api/v2/billing/coupon/gift-purchase`
- `POST /api/v2/billing/coupon/redeem`
- `GET /api/v2/billing/referral/overview`
- `POST /api/v2/billing/referral/link/create`
- `POST /api/v2/billing/referral/claim`
- `POST /api/v2/billing/workspace-coupon/overview`
- `POST /api/v2/billing/workspace-coupon/generate`
- `POST /api/v2/billing/workspace-coupon/remove`

## Визарды и основные flows

### Subscription / Alert Wizard

Routes:

- `/subscriptions/create`
- legacy edit/copy: `/[network]/[action]/[subscriptionId]`

Шаги:

1. Project picker.
2. Trigger constructor.
3. Actions.

Trigger constructor categories:

- Templates.
- Events and calls.
- Smart contract.

Project mode:

- network устанавливается в project fullname.
- triggers грузятся из `GET /api/v2/triggers?project=...`.
- root template грузится из `GET /api/v2/projects/:fullname/template`.

Actions:

- simple mode выбирает resources.
- advanced mode выбирает один или несколько actions и заполняет schemas/overrides.
- final step умеет запускать subscription test перед сохранением.

### Project Form

Routes:

- `/projects/create`
- `/projects/[project]/edit`

Назначение:

- создать/изменить project metadata.
- настроить access level.
- загрузить изображения проекта.
- удалить проект, если разрешено.

Validation:

- title required.
- name генерируется как kebab-case из title.
- tags нормализуются в lowercase kebab-case, max length 20.
- private project может быть заблокирован лимитами tier-а.

### Trigger Wizard

Routes:

- `/projects/[project]/triggers/create`
- `/projects/[project]/triggers/[trigger]`

Шаги:

1. Description.
2. Source.
3. Inputs schema.
4. Filters schema.
5. Output schema.
6. Data providers.
7. Data transform.
8. Defaults.
9. Trigger testing.

Ключевое поведение:

- поддерживает blockchain и timer triggers.
- EVM source: block, transaction, event, call.
- Substrate source: block, event, extrinsic.
- schemas редактируются визуально или через JSON.
- providers выполняются сверху вниз и могут ссылаться на source, inputs и предыдущие provider outputs.
- defaults задают notification text/media/link overrides и execution settings.

### Trigger Import Wizard

Route:

- `/projects/[project]/triggers/import`

Шаги:

1. Source.
2. Generate.
3. Review & import.

Ключевое поведение:

- выбирает runtime/custom source.
- EVM path использует contract address и ABI или ABI auto-detection.
- Substrate path использует pallet metadata.
- generated drafts ревьюятся перед сохранением как project triggers.

### Data Source Wizard

Routes:

- `/data-sources/create`
- `/data-sources/[source]`

Шаги:

1. Details.
2. Extensions.
3. Test deployment.
4. Deploy.

Ключевое поведение:

- поддерживает EVM и Substrate custom sources.
- проверяет endpoint перед сохранением.
- после save ждёт runtime registration.
- может вернуться в trigger flow с выбранным source.

### Project Template Wizard

Routes:

- `/projects/[project]/templates/create`
- `/projects/[project]/templates/[template]`

Назначение:

- полный редактор root template.
- редактирует metadata, inputs, groups, topics, rules, conditions и live preview.

Validation:

- duplicates для schema fields, groups, topics, rules.
- warnings для groups without topics и topics without rules.
- visual condition groups и JSON condition mode.

### Project Template Group Wizard

Route family:

- template group editing внутри `/projects/[project]/templates/[template]`.

Шаги:

1. Metadata.
2. Inputs.
3. Topics.

Назначение:

- описать один user-facing template group.
- задать input schema.
- связать group topics с inputs.

### Project Template Topic Wizard

Routes:

- `/projects/[project]/templates/[template]/topics/create`
- `/projects/[project]/templates/[template]/topics/[topic]`

Шаги:

1. Metadata.
2. Condition.

Назначение:

- создать topic внутри template group.
- выбрать trigger category и trigger.
- настроить selected-by-default.
- настроить conditions и required values.

### Resource Form Flow

Route:

- `/resources`

Назначение:

- создать/изменить resource на основе blueprint.
- для external blueprint показать token-based setup instructions и дождаться readiness.
- для plain blueprint отрисовать поля из blueprint data schema.

### Billing Flow

Routes:

- `/billing`
- `/billing/result`
- embedded: `/account-parameters?tab=billing`

Назначение:

- upgrade account plan.
- купить project addon.
- оплатить crypto, recurring provider checkout или wallet balance.
- пополнить wallet.
- купить/redeem coupons.
- управлять renewal.

## Выводы для будущей документации

1. Основной нарратив должен быть project-centric: Project -> Trigger/Template -> Subscription -> Action/Resource.
2. Legacy network flow нужно оставить как compatibility-раздел, но не делать его главным входом.
3. Categories нужно документировать отдельно по типам: source categories, trigger constructor categories, project trigger category, source kind, project access level.
4. Каждая сущность должна иметь короткую страницу: что это, где используется, поля, связи, lifecycle, частые ошибки.
5. Каждый wizard должен иметь отдельную страницу: назначение, шаги, обязательные поля, validation, результат, troubleshooting.
6. API-ручки стоит включать только в developer/reference docs; в user docs достаточно описывать поведение UI.
