# Data Sources

`Data sources` - это источники blockchain/runtime данных, из которых Web3alert получает blocks, transactions, events, extrinsics, calls и metadata.

Проще говоря, data source отвечает на вопрос “откуда читать данные”, а [trigger](triggers.md) отвечает на вопрос “какое событие из этих данных считать подходящим и как превратить его в output для subscription”.

## Для чего нужны data sources

Data source используется в нескольких местах сервиса:

- в [Add trigger / Edit trigger](trigger-wizard.md), когда trigger выбирает blockchain source;
- в [Import triggers](import-triggers.md), когда wizard генерирует triggers из ABI, pallet metadata или другого описания;
- в runtime engine, который подключается к endpoint, читает новые блоки и передает source items в triggers;
- в мониторинге, где можно смотреть статус источника, lag и logs.

Один data source может использоваться несколькими projects и triggers, если им подходит одна и та же сеть или runtime.

## System и custom sources

В списке могут отображаться два типа источников.

### System sources

System sources - источники, уже поддерживаемые Web3alert. Они принадлежат платформе и обычно доступны как общие marketplace data sources.

Такие sources нельзя редактировать из workspace. В списке они нужны, чтобы видеть, какие runtime sources сейчас зарегистрированы и в каком состоянии они работают.

### Custom sources

Custom sources - источники, созданные внутри workspace.

Их можно использовать для своих проектов, кастомных интеграций и тестирования новых сетей. Custom source можно сделать private или public, если он должен быть доступен шире.

Создание custom sources доступно не на всех тарифах. Free accounts не могут создавать свои data sources; для этого нужен платный тариф. У тарифа также может быть лимит на количество custom sources.

## Типы custom sources

Сейчас wizard поддерживает два типа custom data sources.

### EVM

EVM source используется для сетей и endpoints, совместимых с Ethereum JSON-RPC.

Он подходит для EVM events, transactions, blocks, contract logs и contract reads, которые потом используются в triggers и providers.

Для EVM source обычно достаточно указать один или несколько HTTP RPC endpoints.

### Substrate

Substrate source используется для Polkadot/Substrate-compatible сетей.

Он подходит для runtime events, extrinsics, calls, blocks, storage reads и metadata-based trigger import.

Для Substrate source обычно используется WebSocket endpoint. Если сеть требует нестандартные signed extensions, runtime types или RPC definitions, их можно добавить на шаге `Extensions`.

## Список data sources

Раздел `Data Sources` показывает таблицу источников.

Источники группируются по типу или runtime category, например `EVM`, `Substrate` или другой plugin/runtime type.

### Name

Видимое название source и его короткое техническое имя.

### Deployer

Workspace или platform owner, который создал source.

Для system sources обычно отображается `common`. Для custom sources отображается workspace, которому принадлежит источник.

### Access

Уровень доступа source.

`System` означает платформенный источник. `Private` означает source текущего workspace. `Public` означает custom source, который опубликован для более широкого использования.

### Created at

Дата создания custom source.

Для system/runtime-only sources дата может отсутствовать.

### Lag

Отставание source от последнего увиденного блока.

Если source обработал все доступные блоки, отображается `Up to date`. Если есть backlog, показывается количество блоков lag.

### Status

Текущее состояние runtime source.

Возможные состояния:

- `Running` - source работает;
- `Degraded` - source работает, но есть проблемы или ошибки;
- `Error` - source находится в ошибке;
- `Pending` - custom source сохранен, но runtime registration еще не завершен;
- `Registered` - source зарегистрирован, но runtime status не отдает активное состояние.

### Settings

Меню действий для source.

Доступные пункты зависят от прав пользователя и типа source.

## Source actions

### Logs

Открывает logs custom source.

Logs помогают понять, подключился ли runtime к endpoint, какие блоки обрабатываются и какие ошибки происходят.

### System alerts

Открывает создание subscription для системных уведомлений по source.

Так можно получать alerts, если source переходит в ошибку, восстанавливается или начинает отставать.

### Test system alerts

Отправляет тестовое системное событие для проверки alert flow.

Эта функция доступна не всем тарифам и обычно нужна владельцам/администраторам source.

### Edit

Открывает source wizard для редактирования custom source.

System sources редактировать нельзя.

### Restart source

Перезапускает runtime worker source.

Это полезно, если source выглядит зависшим, но нужно продолжить обработку с сохраненной позиции.

### Reset lag

Сбрасывает backlog и продолжает обработку с текущей головы сети.

Пропущенные блоки после такого reset не будут обработаны. Это действие стоит использовать только если старый backlog больше не нужен или мешает source догнать актуальное состояние.

### Delete

Удаляет custom source.

Перед удалением важно проверить, не используется ли source в triggers или imports. Если удалить source, связанные triggers и проекты могут потерять источник данных.

## Add data source

`Add new source` открывает wizard создания custom source.

Wizard состоит из четырех шагов: `Details`, `Extensions`, `Test deployment` и `Deploy`.

## Step 1. Details

На этом шаге задается базовая конфигурация source: название, доступ, тип сети, endpoints и runtime processing settings.

### Title

Человекочитаемое название source.

Оно отображается в списках и помогает отличать источники друг от друга. Например: `Ethereum archive node`, `Polkadot private RPC`, `Base mainnet`.

### Name

Стабильный slug source внутри workspace.

Name формируется из title, но его можно изменить до сохранения. Он может содержать только lowercase letters, numbers и dashes.

После создания source name становится частью fullname вида `<workspace>.source.<name>`.

### Access level

Определяет доступность custom source.

`Private` подходит для источников текущего workspace и закрытых интеграций. `Public` используется, если source должен быть доступен шире и может использоваться другими проектами или пользователями, если у них есть соответствующие права.

### Type

Тип blockchain/runtime source.

Сейчас доступны `EVM` и `Substrate`.

### Endpoints

Список RPC endpoints, к которым будет подключаться runtime.

Можно указать один или несколько endpoints. Несколько endpoints полезны для резервирования: если один endpoint нестабилен, runtime может использовать другой.

Для EVM обычно используется HTTP RPC URL. Для Substrate обычно используется WebSocket URL.

### Batch max count

Опциональная настройка для EVM source.

Она управляет максимальным количеством batch-запросов при чтении данных. Если не включать поле, используется значение по умолчанию.

Эта настройка относится к advanced runtime settings и нужна только если стандартное поведение не подходит.

### Block processing concurrency

Опциональная настройка параллельности обработки блоков.

Большее значение может ускорить обработку, но увеличивает нагрузку на endpoint и runtime. Если не включать поле, используется значение по умолчанию.

### Max queued blocks

Опциональный лимит очереди блоков.

Он ограничивает количество блоков, которые source может держать в очереди обработки. Если не включать поле, используется значение по умолчанию.

## Step 2. Extensions

На этом шаге настраиваются дополнительные runtime extensions.

Для EVM sources этот шаг обычно ничего не требует: EVM data sources не используют signed extensions, custom runtime types или RPC extension definitions в этом flow.

Для Substrate sources extensions нужны только в тех сетях, где стандартной metadata недостаточно.

### Extensions

Общий переключатель optional extensions.

Если endpoint обычный и metadata читается без дополнительных настроек, этот шаг можно оставить выключенным.

### Preset

Готовый набор настроек для известных Substrate runtime cases.

Сейчас доступны:

- `No preset`;
- `Avail`;
- `Polkadot Asset Hub / Statemint`;
- `Kusama Asset Hub / Statemine`.

Если выбран preset, wizard использует подготовленные настройки и не требует вручную заполнять signed extensions, types и RPC.

### Signed extensions

JSON array с описанием custom signed extensions.

Это нужно для Substrate сетей, где extrinsics используют нестандартные extensions и runtime не может корректно декодировать их без дополнительного описания.

### Types

JSON object с custom runtime types.

Это нужно, если metadata или RPC возвращают типы, которые runtime не может распознать автоматически.

### RPC

JSON object с custom RPC methods.

Это нужно, если trigger/provider должен обращаться к нестандартным RPC секциям или методам Substrate node.

## Step 3. Test deployment

Этот шаг проверяет, что runtime может подключиться к source до сохранения.

### Deployment test

Показывает summary будущего source: workspace, fullname и type.

Кнопка `Run test deployment` запускает проверку endpoints и runtime-конфигурации.

### Logs

Показывает результат test deployment.

Если test deployment завершается ошибкой, source лучше не сохранять до исправления endpoints или extensions.

Перейти дальше можно только после успешной проверки.

## Step 4. Deploy

Финальный шаг сохраняет source и ждет runtime registration.

### Deploy source

Показывает summary конфигурации, которая будет сохранена.

Для Substrate source дополнительно отображается summary extensions: preset, signed extensions, custom types и RPC methods.

Кнопка `Create source` создает новый source. При редактировании существующего source кнопка называется `Update source`.

### Deploy logs

Показывает процесс сохранения и регистрации source в runtime.

После успешного сохранения source появляется в списке `Data Sources`. Если runtime registration еще не завершен, source может некоторое время оставаться в статусе `Pending`.

## Edit data source

Редактирование custom source использует тот же wizard.

Можно менять title, access level, endpoints, extensions и runtime settings. Name при редактировании заблокирован, потому что он является частью стабильного fullname.

После обновления source runtime registration может занять некоторое время.
