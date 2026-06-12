# Add Trigger / Edit Trigger

`Add trigger` открывает подробный wizard создания триггера. Этот wizard задает весь жизненный цикл события: от чтения source item до финального notification defaults.

Редактирование существующего триггера использует тот же wizard, но с уже заполненными значениями.

Если нужно быстро создать много однотипных triggers из ABI или metadata, можно использовать [Import triggers](import-triggers.md). Это упрощенный массовый сценарий поверх общей идеи создания triggers.

## Step 1. Description

На этом шаге trigger получает понятное имя и краткое объяснение того, что он делает. Это помогает позже быстро узнавать trigger в проекте, templates, subscriptions и других местах, где нужно выбрать или проверить нужный сценарий.

### Title

Обязательное видимое название trigger. Оно показывается в интерфейсе там, где пользователь выбирает, просматривает или проверяет trigger, поэтому лучше писать его коротко и понятно.

### ID

Системный slug trigger внутри проекта. Он формируется автоматически из названия и в форме отображается как disabled field, чтобы пользователь видел будущий идентификатор, но не менял его вручную.

### Description

Опциональное описание trigger. Его стоит включать, если по одному title не очевидно, какое событие отслеживается, какие данные используются или в каком сценарии этот trigger нужен.

### Category

Обязательная категория trigger. Она помогает группировать triggers в таблицах, templates и rules, чтобы большие проекты оставались понятными и удобными для поиска.

## Step 2. Source

На этом шаге выбирается, что именно запускает trigger: регулярный таймер или событие из blockchain data source. От выбранного типа зависит набор следующих панелей.

### Trigger type

Обязательный выбор базового типа trigger.

`timer` используется для регулярных срабатываний по интервалу. `blockchain` используется для событий, extrinsics, calls, blocks или transactions из [Data sources](data-sources.md).

### Timer

#### Interval

Обязательный интервал, с которым timer trigger должен срабатывать.

Формат interval: число и единица времени, например:

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Blockchain

#### Source

Обязательный выбор data source, из которого trigger будет читать blockchain/runtime данные.

В списке показываются доступные sources проекта. Если подходящего source нет, можно перейти к [Add new source](data-sources.md#add-data-source).

Выбранный source определяет дальнейшую ветку настройки: EVM, Substrate или Solana.

### Blockchain - EVM

#### Source item

Обязательный выбор типа данных, которые trigger получает из EVM source: `event`, `call`, `block` или `transaction`.

Для `event` и `call` wizard дополнительно настраивает ABI и signature. Для `block` и `transaction` ABI и signature не требуются.

#### ABI contract address

Адрес контракта, по которому wizard пытается загрузить ABI и предложить доступные events или calls.

Если `Use as trigger filter` включен, trigger будет срабатывать только для этого contract address. Если переключатель выключен, адрес используется только для загрузки ABI, а сам trigger сможет матчить любой контракт с выбранной signature.

#### Event signature / Call signature

Обязательная signature события или метода, который должен запускать trigger.

Если ABI успешно загружен, signature можно выбрать из списка. Если ABI не найден, контракт указан динамически или нужной signature нет в списке, значение можно ввести вручную.

### Blockchain - Substrate

#### Source item

Обязательный выбор типа Substrate item: `event`, `call`/`extrinsic` или `block`.

Для `event` и `call` wizard дополнительно предлагает выбрать pallet и конкретную entry. Для `block` pallet и event/extrinsic не требуются.

#### Pallet

Обязательный pallet из runtime metadata выбранного Substrate source.

Список загружается из metadata source. Он доступен только для `event` и `call`/`extrinsic` selection modes.

#### Event / Extrinsic

Обязательная entry внутри выбранного pallet.

Для `event` выбирается событие pallet. Для `call`/`extrinsic` выбирается extrinsic. Wizard показывает runtime version, чтобы было понятно, из какой metadata загружены доступные варианты.

### Blockchain - Solana

#### Source item

Обязательный выбор типа Solana item: `event` или `call`.

`event` соответствует program event, который source декодирует из logs. `call` соответствует Solana instruction выбранной программы. В UI используется общий термин `call`, чтобы сохранить единый язык с другими source types.

#### Program ID

Обязательный public key Solana program.

Program ID используется как runtime filter: source ищет только events/instructions этой программы.

#### IDL

JSON IDL выбранной программы.

Wizard может попытаться загрузить IDL автоматически по Program ID через Anchor IDL account или Program Metadata. Если IDL не загружается автоматически, его нужно вставить вручную. Без IDL trigger для Solana event/call создать нельзя, потому что source не сможет надежно декодировать payload, аргументы и accounts.

При сохранении trigger wizard оставляет только нужный фрагмент IDL для выбранного event/call и зависимых custom types, чтобы trigger не требовал хранить полный IDL всей программы.

#### Event / Call

Обязательная entry из IDL.

Для `event` выбирается event из `events`. Для `call` выбирается instruction из `instructions`. Если выбран `call`, accounts из IDL становятся доступными как именованные поля `source.accounts.*`.

### Source payload

Выбранный source item определяет структуру `source.*`, которая будет доступна дальше в wizard: в inputs/templates, providers, activation condition, filters, data transform и defaults.

#### Timer

| Path | Type | Description |
| --- | --- | --- |
| `source.now` | `string` | ISO timestamp текущего timer run. |
| `source.timestampMs` | `number` | Unix timestamp в миллисекундах для текущего timer run. |

#### EVM event

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address, который эмитнул event. |
| `source.blockNumber` | `number` | Номер блока, где event был найден. |
| `source.blockHash` | `string` | Hash блока, где event был найден. |
| `source.transactionHash` | `string` | Hash transaction, внутри которой был event. |
| `source.transactionIndex` | `number` | Индекс transaction внутри блока. |
| `source.index` | `number` | Индекс event/log внутри transaction или блока. |
| `source.data` | `string` | Raw encoded event data. |
| `source.topics` | `array<string>` | Topics из EVM log. |
| `source.args` | `array` | Decoded ABI arguments в позиционном порядке. Если ABI известен, wizard дополнительно подсказывает `source.args[index]` с именами аргументов. |

#### EVM call

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address, связанный с matched call. |
| `source.blockNumber` | `number` | Номер блока, где call был найден. |
| `source.blockHash` | `string` | Hash блока, где call был найден. |
| `source.transactionHash` | `string` | Hash transaction, внутри которой был call. |
| `source.transactionIndex` | `number` | Индекс transaction внутри блока. |
| `source.index` | `number` | Индекс call/source item. |
| `source.from` | `address` | Caller address. |
| `source.to` | `address` | Target contract address. |
| `source.data` | `string` | Raw encoded calldata. |
| `source.args` | `array` | Decoded ABI arguments в позиционном порядке. Если ABI известен, wizard дополнительно подсказывает `source.args[index]` с именами аргументов. |

#### EVM block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Номер блока. |
| `source.hash` | `string \| null` | Hash блока. |
| `source.timestamp` | `number` | Timestamp блока. |
| `source.transactionsCount` | `number` | Количество transactions в блоке. |
| `source.gasLimit` | `string \| null` | Gas limit блока в raw units, если source его предоставляет. |
| `source.gasUsed` | `string \| null` | Gas, использованный всеми transactions блока, если source его предоставляет. |
| `source.baseFeePerGas` | `string \| null` | Base fee per gas для блока, если source его предоставляет. |
| `source.blobGasUsed` | `string \| null` | Blob gas, использованный блоком, если source его предоставляет. |
| `source.excessBlobGas` | `string \| null` | Excess blob gas блока, если source его предоставляет. |

#### EVM transaction

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Номер блока, где transaction была включена. |
| `source.block.hash` | `string \| null` | Hash блока, где transaction была включена. |
| `source.block.timestamp` | `number` | Timestamp блока. |
| `source.index` | `number` | Индекс transaction внутри блока. |
| `source.hash` | `string` | Hash transaction. |
| `source.type` | `string` | Нормализованный тип transaction, например `legacy` или `eip1559`. |
| `source.from` | `address` | Sender address. |
| `source.to` | `address \| null` | Recipient address или `null` для contract creation. |
| `source.nonce` | `number` | Account nonce transaction. |
| `source.gasLimit` | `string` | Gas limit в raw units. |
| `source.gasPrice` | `string` | Gas price в raw units. |
| `source.maxPriorityFeePerGas` | `string \| null` | EIP-1559 max priority fee, если доступен. |
| `source.maxFeePerGas` | `string \| null` | EIP-1559 max fee, если доступен. |
| `source.maxFeePerBlobGas` | `string \| null` | Blob gas fee, если доступен. |
| `source.input` | `string` | Raw transaction input calldata. |
| `source.value` | `string` | Native token amount в raw base units. |
| `source.methodId` | `string \| null` | Первые 4 байта calldata selector, если они есть. |

#### Substrate event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Номер блока, где event был найден. |
| `source.block.hash` | `string` | Hash блока, где event был найден. |
| `source.block.timestamp` | `number` | Timestamp блока в миллисекундах. |
| `source.index` | `number` | Индекс event внутри блока. |
| `source.module` | `string` | Pallet/module name. |
| `source.event` | `string` | Event name внутри pallet. |
| `source.type` | `string \| null` | Phase type события. |
| `source.extrinsic` | `number \| null` | Индекс extrinsic для `ApplyExtrinsic` events. |
| `source.data` | `array` | Decoded event data в позиционном порядке. Wizard дополнительно подсказывает `source.data[index]` с именами аргументов из metadata. |

#### Substrate extrinsic

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Номер блока, где extrinsic был найден. |
| `source.block.hash` | `string` | Hash блока, где extrinsic был найден. |
| `source.block.timestamp` | `number` | Timestamp блока в миллисекундах. |
| `source.index` | `number` | Индекс extrinsic внутри блока. |
| `source.module` | `string` | Pallet/module name. |
| `source.call` | `string` | Extrinsic method name. |
| `source.args` | `array` | Decoded extrinsic arguments в позиционном порядке. Wizard дополнительно подсказывает `source.args[index]` с именами аргументов из metadata. |
| `source.result` | `string \| null` | Execution result matched extrinsic. |
| `source.sender` | `address \| null` | Origin account, который отправил extrinsic. |
| `source.signature` | `object \| null` | Данные подписи extrinsic. |
| `source.signature.nonce` | `number` | Nonce из подписи. |
| `source.signature.digest` | `string` | Signature digest. |
| `source.path` | `string` | Nested call path для matched extrinsic. |

#### Substrate block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Номер блока. |
| `source.hash` | `string` | Hash блока. |
| `source.parentHash` | `string` | Hash родительского блока. |
| `source.timestamp` | `number` | Timestamp блока в миллисекундах. |
| `source.stateRoot` | `string` | State root блока. |
| `source.extrinsicsRoot` | `string` | Extrinsics root блока. |

#### Solana event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot, где event был найден. |
| `source.block.hash` | `string \| null` | Block hash для slot, если доступен. |
| `source.block.timestamp` | `number \| null` | Block timestamp, если доступен. |
| `source.transaction.index` | `number` | Индекс transaction внутри блока. |
| `source.transaction.signature` | `string` | Signature Solana transaction. |
| `source.transaction.success` | `boolean` | Признак успешной transaction. Failed transactions source пропускает. |
| `source.transaction.error` | `unknown` | Ошибка transaction или `null` для успешной transaction. |
| `source.index` | `number` | Индекс matched event внутри source output. |
| `source.programId` | `address` | Program ID, выбранный в trigger. |
| `source.event` | `string` | Имя event из IDL. |
| `source.data` | `object` | Decoded event data, где ключи соответствуют именам fields из IDL. |

#### Solana call

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot, где instruction был найден. |
| `source.block.hash` | `string \| null` | Block hash для slot, если доступен. |
| `source.block.timestamp` | `number \| null` | Block timestamp, если доступен. |
| `source.transaction.index` | `number` | Индекс transaction внутри блока. |
| `source.transaction.signature` | `string` | Signature Solana transaction. |
| `source.transaction.success` | `boolean` | Признак успешной transaction. Failed transactions source пропускает. |
| `source.transaction.error` | `unknown` | Ошибка transaction или `null` для успешной transaction. |
| `source.index` | `number` | Индекс matched call внутри source output. |
| `source.programId` | `address` | Program ID, выбранный в trigger. |
| `source.call` | `string` | Имя instruction из IDL. |
| `source.signers` | `array<string>` | Адреса signers transaction для matched instruction. |
| `source.args` | `object` | Decoded instruction arguments, где ключи соответствуют именам args из IDL. |
| `source.accounts` | `object` | Account addresses, где ключи соответствуют именам accounts из IDL; owner aliases для token accounts добавляются, когда доступны. |
| `source.accountsMeta` | `object` | Metadata token accounts, где ключи соответствуют именам accounts из IDL, когда metadata доступна. Поля metadata могут включать `address`, `owner`, `mint`, `programId`, `decimals`, `rawAmount`, `uiAmount` и `uiAmountString`. |
| `source.accountsRaw` | `array<string>` | Account addresses в порядке transaction instruction. |
| `source.path` | `string` | Путь instruction, включая вложенность inner instructions. |
| `source.inner` | `boolean` | `true`, если matched instruction был inner instruction. |

## Step 3. Inputs schema

`Inputs schema` описывает параметры, которые пользователь задает при создании подписки.

Inputs похожи на filters, поэтому их легко перепутать. Главное отличие: inputs обязательны для заполнения и задают базовые данные, без которых подписка не может работать. Filters опциональны и нужны для дополнительной персонализации уже после того, как обязательные inputs заполнены.

Редактор поддерживает два режима:

- `UI mode` - поля добавляются через визуальный Schema editor;
- `JSON mode` - schema редактируется как JSON.

<a id="schema-editor"></a>

### Schema editor

Schema editor используется в нескольких шагах wizard. В `Inputs schema` он описывает поля, которые пользователь заполняет при создании подписки; в `Filters schema` и `Output schema` используется тот же принцип редактирования.

В `UI mode` schema состоит из properties. Каждое property можно раскрыть, свернуть, удалить и настроить через набор панелей.

#### Property

`Name` - техническое имя поля внутри schema. Оно используется в paths, templates и JavaScript-коде, поэтому должно быть коротким, стабильным и понятным. Для object properties имя становится ключом объекта. Для array item имя не используется, потому что array описывает один общий тип элемента.

`Type` - тип значения. От выбранного типа зависит, какие дополнительные панели появятся ниже.

`Source path` - опциональная связь с исходным `source.*` path. Она нужна, когда поле schema называется не так, как исходное поле source item, но engine должен понимать, какое source-значение использовать для ранней фильтрации. Чаще всего `Source path` нужен в filters, иногда может быть полезен в inputs, но не используется в output schema.

#### Property types

`string` - строковое значение.

`number` - числовое значение.

`boolean` - логическое значение `true`/`false`.

`null` - явное пустое значение.

`address` - blockchain address. Для него выбирается `Address type`: `EVM` или `SS58 (Substrate)`. Для SS58 address можно указать `SS58 prefix`, чтобы интерфейс и downstream-логика знали формат адреса.

`object` - объект с вложенными properties. После выбора этого типа появляется панель `Properties`, внутри которой используется такой же редактор schema.

`array` - массив однотипных элементов. После выбора этого типа появляется вложенный редактор `Item`, где задается тип каждого элемента массива.

`tuple` - массив с фиксированным набором позиций. После выбора этого типа появляется панель `Items`, где каждая позиция описывается отдельно.

`balance` и `currency` могут появляться в импортированных Substrate schemas как дополнительные hints от metadata layer. Для ручного описания схемы обычно проще думать о фактическом типе значения: сумма может быть `string` или `number`, asset/currency id тоже может быть `string` или `number`. Сама schema не обязана решать, как форматировать значение для уведомления: сырые данные приходят из source, а нужное преобразование владелец trigger делает в transform или providers.

`enum` - набор variants, где каждый variant имеет имя и собственный тип. Этот тип доступен в output schema, но отключен для trigger inputs и filters. Для inputs и filters нужно задавать конкретное значение, по которому subscription сможет сравнивать или фильтровать source item; enum variants для этого сценария слишком неоднозначны.

`lookup` - ссылка на тип из metadata/IDL, например Substrate runtime type или Solana custom defined type. Для него выбирается `Lookup ref`. Этот тип удобен, когда нужно сохранить связь с runtime/source type, а не описывать структуру вручную.

## Step 4. Data providers

`Data providers` - опциональный шаг. Providers выполняются сверху вниз и позволяют дополнить source item внешними или runtime-данными перед transform.

В templates и provider-полях можно использовать:

- `{{source.*}}` - данные исходного события;
- `{{inputs.*}}` - значения подписки;
- `{{providers.providerId.*}}` - результат предыдущих providers.

У каждого provider есть вес. При сохранении trigger сервис считает суммарный вес всех providers и проверяет его по лимиту trigger. Подробно лимиты описаны в разделе [Limits](./limits.md#provider-weights).

Общие поля каждого provider:

- `Type` - тип provider;
- `ID` - имя, по которому результат будет доступен как `providers.ID`;
- кнопка тестирования provider;
- кнопка удаления provider.

Для всех providers используется timeout 10 секунд.

Доступные provider types:

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Chain State`;
- `Value history`;
- `JavaScript`.

---

### HTTP <Badge type="info" text="Вес: 2" />

#### Method

HTTP method. Сейчас используется выбор из поддерживаемых методов.

#### URL

Endpoint, на который provider отправит HTTP request.

#### Headers

Key-value список headers. Значения поддерживают template-подстановки.

#### Query params

Key-value список query parameters. Значения поддерживают template-подстановки.

#### Body

Опциональный JSON/template body для POST-запроса. Body поддерживает template-подстановки.

#### Retry until ready

Опциональный неблокирующий polling готовности ответа. Нужен, когда внешний API индексирует данные с задержкой: on-chain событие уже пришло, а метаданные для него появятся в API только через несколько секунд. Без retry provider вернёт пустой или неполный ответ, transform подставит fallback-значения, и фильтры подписки по output-полям не сработают.

Если ответ provider «не готов», исполнение паркуется и автоматически повторяется позже. Worker при этом не занят ожиданием, событие сохраняет исходную идентичность и доставляется пользователю не более одного раза. Retry выполняется до transform и до фильтров подписки, поэтому фильтры видят уже обогащённые данные. Ожидающий retry trigger не считается сломанным.

Поля:

- `Enabled` - включает retry для provider;
- `Attempts` - максимальное число повторных попыток, от 1 до 20;
- `Delay, ms` - базовая пауза между попытками, от 250 до 60000;
- `Backoff` - стратегия роста паузы: `Fixed` - одинаковая пауза, `Linear` - пауза × номер попытки, `Exponential` - пауза удваивается с каждой попыткой;
- `When exhausted` - что делать после исчерпания попыток:
  - `Continue with last response` - продолжить с последним ответом как есть; transform применит свой fallback;
  - `Fail the provider` - считать provider неуспешным: для `Optional` provider результат будет пустым, для обязательного исполнение завершится без output;
- `Retry when` - условия «не готовности» ответа:
  - `Empty array` - ответ является пустым массивом;
  - `Missing path` - по пути `Ready when path` нет значения;
  - `HTTP error` - запрос завершился сетевой ошибкой или не-2xx статусом; без этого флага такие ошибки остаются обычными ошибками provider;
- `Ready when path` - путь к полю ответа, которое должно присутствовать; сегменты разделяются точкой, индексы массивов указываются числом;
- `Equals` - опциональное значение, которому должно равняться поле по `Ready when path`; поддерживает template-подстановки, hex-строки сравниваются без учёта регистра.

Тест provider выполняет одну попытку и не ждёт готовности - polling работает только в runtime.

Пример конфигурации через API/MCP:

```json
{
  "id": "item",
  "type": "http",
  "url": "https://api.example.com/items",
  "queryParams": { "id": "{{ source.args.0 }}" },
  "retry": {
    "attempts": 8,
    "delayMs": 5000,
    "backoff": "linear",
    "retryOn": ["empty_array", "missing_path"],
    "until": { "path": "0.id", "equals": "{{ source.args.0 }}" }
  }
}
```

Через API/MCP дополнительно доступны поля `maxDelayMs` (потолок одной паузы) и `maxElapsedMs` (общий бюджет ожидания); в UI они не отображаются.

---

### GraphQL <Badge type="info" text="Вес: 2" />

#### Endpoint

GraphQL endpoint URL.

#### Headers

Key-value headers. Значения поддерживают template-подстановки.

#### Variables

Key-value variables для GraphQL query. Значения поддерживают template-подстановки.

#### Query

GraphQL query document.

#### Retry until ready

GraphQL provider поддерживает retry-политику. Поля и поведение описаны в [HTTP -> Retry until ready](#retry-until-ready).

---

### Chain State <Badge type="info" text="Вес: 1" />

`Chain State` читает данные состояния из blockchain source и добавляет результат в provider output.

#### State type

Тип чтения: `EVM contract`, `Substrate storage` или `Solana account`.

#### EVM contract <Badge type="tip" text="state type" />

Выполняет view/pure read-call метода EVM-контракта.

##### Source

EVM source. По умолчанию используется source триггера.

##### Target contract

Адрес контракта для фактического read-call. Поддерживает template, например `{{ source.address }}`.

##### ABI contract address

Адрес контракта, из ABI которого загружать методы. Нужен, если target contract динамический.

##### Read method

Режим выбора read method: `Auto` или `Manual`.

В `Auto` wizard загружает view/pure methods из ABI и предлагает выбрать метод. В `Manual` можно вставить signature и ABI fragment вручную; args и output schema синхронизируются из ABI fragment.

##### Method arguments

Argument-поля появляются, если выбранный method принимает args.

#### Substrate storage <Badge type="tip" text="state type" />

Читает storage entry из Substrate runtime.

##### Source

Substrate source. По умолчанию используется source триггера.

##### Module

Pallet/module.

##### Storage entry

Storage item внутри module.

Если storage entry имеет args, wizard создает отдельную панель для каждого arg. Необязательные args можно включать и выключать переключателем `Optional`.

##### Storage arguments

Argument-поля выбранного storage entry.

##### Block

Опциональный block number/hash/template.

#### Solana account <Badge type="tip" text="state type" />

Читает Solana account и декодирует его содержимое.

##### Source

Solana source. По умолчанию используется source триггера.

##### Account

Account public key, состояние которого нужно прочитать. Поле поддерживает template-подстановки, например `{{ source.accounts.base_mint }}`.

Solana state хранится в accounts. Поэтому provider читает account через source runtime и пытается декодировать его содержимое.

##### IDL

Опциональный JSON IDL с account definitions.

Если IDL включен и заполнен, provider декодирует account строго по нему. Если декодирование по ручному IDL не удалось, provider возвращает ошибку и не переключается на автоматическое распознавание.

Если IDL выключен, provider автоматически определяет схему по данным account:

- сначала использует `jsonParsed`, если Solana RPC возвращает parsed account data;
- затем пробует built-in layouts для распространенных on-chain accounts, например SPL Token mint/account и Metaplex Metadata;
- если owner account связан с программой, для которой доступен IDL, пробует загрузить IDL автоматически через Anchor или Program Metadata и декодировать account по нему.

Результат provider доступен как `providers.<id>`. В нем возвращаются базовые поля account (`account`, `exists`, `owner`, `lamports`, `executable`, `rentEpoch`, `slot`) и decoded `data`, если schema была найдена.

Solana account provider кеширует успешные результаты на короткое время, чтобы несколько triggers/events, читающих один и тот же account, не отправляли лишние RPC-запросы.

---

### Value history <Badge type="info" text="Вес: 1" />

`Value history` хранит окно последних значений и считает агрегаты.

#### Partition by

Опциональный ключ разделения истории на независимые окна. Например, если указать `{{ source.address }}`, provider будет хранить отдельную историю значений для каждого адреса, а не одну общую историю для всех source items.

#### Dedupe by

Обязательный уникальный id текущего item, чтобы одно событие не учитывалось дважды.

#### Keep last

Размер окна.

#### Value type

Тип значения в окне.

#### Value

Значение, которое добавляется в историю. Можно указать простую template-строку, например `{{ source.amount }}`, или JSON value: object, array, string, number, boolean/null.

Template-подстановки можно использовать внутри JSON-значений. Например, object может собрать несколько полей source item в одно значение:

```json
{
  "account": "{{ source.account }}",
  "amount": "{{ source.amount }}",
  "asset": "{{ source.asset }}"
}
```

Если `Value type` выбран как `number`, итоговое значение должно приводиться к числу; для object/array обычно выбирают соответствующий `Value type`.

#### Aggregates

Дополнительные агрегаты для числовых values.

---

### RPC <Badge type="info" text="Вес: 1-2" />

Вес: `1`, если используется source runtime transport. Вес: `2`, если используется direct endpoint transport.

#### Transport

Как отправлять RPC request: через source runtime или через direct endpoint.

Если transport идет через source runtime, прямой endpoint не нужен.

#### Method

RPC method name.

#### Endpoint

URL, если выбран endpoint transport.

#### Headers

JSON object headers для endpoint transport.

#### Params

JSON array params.

#### Custom body

Опциональный полный JSON-RPC body для endpoint transport.

#### Retry until ready

RPC provider поддерживает retry-политику. Поля и поведение описаны в [HTTP -> Retry until ready](#retry-until-ready).

---

### JavaScript <Badge type="info" text="Вес: 2" />

#### Variables

Key-value variables для функции.

#### Source

JavaScript function source.

JavaScript provider используется, когда дополнительное значение проще вычислить кодом на основе source, inputs и предыдущих providers.

---

### Test Provider

Для provider доступен диалог `Test Provider`.

В нем нужно заполнить только те template values, которые provider реально использует. Значения предыдущих providers можно передать вручную через `providers.*` paths. Если provider не содержит template references, тест можно запускать сразу.

## Step 5. Activation condition

`Activation condition` - опциональное JavaScript-условие.

Оно включается переключателем `Optional`. Если условие выключено, по умолчанию всегда возвращает `true`: trigger считается активным для всех source items, прошедших source matching.

Если условие включено, код должен вернуть значение, по которому engine решит, активировать ли дальнейшую обработку. Это удобно для логики, которую нельзя выразить только filters schema или template rules.

Например, custom trigger может быть основан на source event, который технически ловит широкий набор событий. Сам source умеет отдать нужные данные, но не может полностью описать бизнес-логику срабатывания: нужно проверить несколько полей, сравнить значения, учесть результат provider или пропустить часть событий по дополнительному правилу. В таком случае source matching оставляют широким, а в `Activation condition` описывают финальное условие, при котором trigger действительно должен сработать.

## Step 6. Filters schema

`Filters schema` описывает поля, по которым подписки смогут фильтровать trigger output.

Filters похожи на inputs, но используются иначе. Пользователь может оставить filters пустыми, если ему достаточно базового сценария подписки. Если нужна более точная персонализация, filters позволяют сузить или уточнить условия срабатывания.

Редактор поддерживает:

- `UI mode`;
- `JSON mode`;
- `Add property`;
- тот же [schema editor](#schema-editor), что и в `Inputs schema`.

`Source path` нужен, когда поле output называется не так, как исходное поле source item. Engine применяет filters в два этапа: ранний pre-filter по source data и затем conditions по сформированному output. Если имена различаются, здесь указывают путь к исходному полю.

## Step 7. Output schema

`Output schema` состоит из двух панелей:

- `Raw output`;
- `Human output`.

`Raw output` описывает машинный результат trigger transform. Эти поля используются в rules, filters, templates и downstream-логике.

`Human output` описывает человекочитаемый результат для уведомлений. Его можно:

- оставить `Use same as raw`;
- выключить `Use same as raw` и задать собственную schema.

Редактор schema поддерживает `UI mode` и `JSON mode`.

Для `Raw output` и `Human output` используется тот же [schema editor](#schema-editor), что и в `Inputs schema`, но без `Source path`: output schema описывает уже сформированный результат trigger, а не matching по исходному source item. В отличие от inputs и filters, output schema может использовать `enum`.

## Step 8. Transform

Шаг содержит две JavaScript-панели:

- `Raw transform`;
- `Human transform`.

`Raw transform` получает source, inputs и providers и возвращает объект, соответствующий `Raw output`.

`Human transform` получает source, inputs, providers и raw output и возвращает объект, соответствующий `Human output`.

Редактор подсказывает доступный context и показывает validation error, если JavaScript некорректен.

## Step 9. Defaults

`Defaults` задает рекомендованные шаблоны уведомлений по умолчанию. Это совет от создателя trigger для пользователя, который будет создавать subscription: как лучше назвать уведомление, какие данные показать в коротком и длинном тексте, какую иконку, обложку или ссылки использовать.

Эти значения не являются обязательными. При создании subscription пользователь может оставить defaults как есть или полностью переназначить внешний вид и текст уведомления под свой сценарий.

Все панели опциональные и включаются отдельными переключателями.

#### Title

Заголовок уведомления.

#### Short

Короткий markdown-текст.

#### Long

Длинный markdown-текст.

#### Icon

URL иконки.

#### Cover

URL обложки.

#### Avatar

URL аватара уведомления. По умолчанию используется тот же URL, что и в `Icon`.

#### Links

Массив ссылок.

Каждая строка содержит:

- `Title`;
- `Url`;
- кнопка удаления;
- `Add item` для добавления ссылки.

При сохранении каждая ссылка должна иметь и title, и URL.

Поля используют autocomplete и Handlebars/template helpers. Defaults рендерятся от trigger output, поэтому здесь не используется context `source`, `inputs` или `providers`.

Autocomplete подсказывает:

- `block` - номер блока, если он есть в output;
- `index` - индекс item/event, если он есть в output;
- `hash` - transaction/block hash, если он есть в output;
- `meta` - метаданные trigger: `description`, `name`, `kind`, `scope`;
- `raw.*` - поля raw output;
- `human.*` - поля human output.

#### Handlebars helpers

В defaults используется Handlebars syntax: `{{human.amount}}`, `{{#if human.amount}}...{{/if}}`, `{{round human.price digits=2}}`. Общие правила expressions, blocks, paths и sub-expressions описаны в официальной документации Handlebars: [Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html).

##### Built-in helpers

`if` - условный block. Рендерит содержимое, если значение не является falsy.

`unless` - обратный `if`. Рендерит содержимое, если значение falsy.

`each` - перебор array/object. Внутри block можно использовать `this`, а также служебные значения Handlebars вроде `@index` для array и `@key` для object.

`with` - меняет текущий context внутри block. Удобно, когда нужно несколько раз обратиться к одному вложенному объекту.

`lookup` - динамически берет значение по ключу. Полезно, когда имя поля или индекс лежит в другой переменной.

##### Web3alert helpers

`round` - округляет число или числовую строку. Параметр `digits` задает количество знаков после точки, `fixed=true` возвращает строку с фиксированным количеством знаков.

```handlebars
{{round human.price digits=2}}
{{round human.price digits=2 fixed=true}}
```

`format` - форматирует raw integer amount с учетом token decimals. Например, значение `1000000000000000000` при `decimals=18` станет `1`.

```handlebars
{{format raw.value decimals=18}}
```

`substr` - возвращает часть строки. `start` задает позицию начала; отрицательный `start` считает от конца строки; `len` ограничивает длину.

```handlebars
{{substr hash start=0 len=10}}
{{substr hash start=-8}}
```

`address` - форматирует blockchain address для уведомления. Если адрес есть в address book workspace, вернет alias; иначе сократит известный address до компактного вида.

```handlebars
{{address raw.from}}
```

`make` - рекурсивно заменяет адреса внутри object, array или string на значения из address book, где это возможно. Удобно для вывода структур с несколькими адресами.

```handlebars
{{yaml (make raw.participants)}}
```

`includes` - проверяет, содержит ли array указанное string-значение. Обычно используется внутри `if`.

```handlebars
{{#if (includes raw.tags "whale")}}Whale transfer{{/if}}
```

`lowercase` - приводит строку к lowercase.

```handlebars
{{lowercase meta.name}}
```

`uppercase` - приводит строку к uppercase.

```handlebars
{{uppercase meta.scope}}
```

`titlecase` - приводит строку к Title Case.

```handlebars
{{titlecase meta.name}}
```

`oneline` - заменяет переносы строк пробелами.

```handlebars
{{oneline human.summary}}
```

`yaml` - сериализует object/array в YAML string.

```handlebars
{{yaml human}}
```

## Step 10. Test & save

Последний шаг позволяет проверить trigger перед сохранением.

Если trigger имеет inputs schema, сначала показываются поля test inputs.

Для blockchain trigger задаются:

- `Block` - номер блока для симуляции;
- `Item index` - опциональный индекс item, если в блоке найдено несколько подходящих событий.

Для timer trigger используется текущий timestamp.

После test run отображаются:

- статус `Valid result` или `Invalid result`;
- `Source items on block`;
- список issues, если result invalid;
- `Source input`;
- `Trigger output`;
- `Debug`.

После успешной проверки или осознанного пропуска проверки trigger можно сохранить. Возможность test run может зависеть от тарифного плана/account tier.
