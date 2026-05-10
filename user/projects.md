# Projects

`Projects` - это каталог блокчейн-сетей, протоколов и dApp-интеграций, из которых Web3alert умеет собирать события и по которым пользователи могут создавать подписки.

В Next-версии проекта `Project` больше не является просто "сетью в списке". Это контейнер для всей публичной и технической конфигурации интеграции:

- метаданные проекта: название, описание, теги, иконки, обложка и внешние ссылки;
- `Triggers`: технические правила, которые описывают, какие события читать из data source, как их фильтровать, чем дополнять и в какой output преобразовывать;
- `Templates`: пользовательские сценарии подписки поверх триггеров, сгруппированные в понятные темы;
- `Subscriptions`: подписки пользователей или workspace, созданные на основе проекта;
- связи с `Data sources`: источниками блокчейн-данных, из которых триггеры получают события, блоки, вызовы или runtime metadata.

Обычный пользователь чаще всего открывает `Projects`, чтобы найти нужную сеть или протокол и создать подписку. Администратор или владелец проекта использует этот раздел для настройки всей поверхности интеграции.

## Список проектов

Страница `Projects` показывает каталог доступных проектов.

### Поиск

Поле поиска фильтрует проекты по нескольким признакам:

- видимое название проекта;
- `fullname` проекта;
- внутренний `id`;
- workspace или author;
- теги.

Поиск удобно использовать и для пользовательского сценария ("найти Polkadot Asset Hub"), и для админского ("найти проект по slug/fullname").

### Only this workspace

Переключатель `Only this workspace` оставляет в списке только проекты текущего workspace.

Это важно, если у аккаунта есть доступ к нескольким пространствам: например, публичный marketplace может показывать много проектов, а workspace-фильтр позволяет увидеть только собственные приватные или рабочие интеграции.

### Фильтр по тегам

Под строкой поиска отображаются доступные теги. Выбранный тег оставляет в каталоге только проекты с этим тегом.

Кнопка `Clear filters` сбрасывает поиск, workspace-фильтр и выбранные теги.

### Карточка проекта

Каждая карточка проекта показывает:

- иконку проекта;
- название;
- служебную строку с датой создания или обновления;
- автора или workspace;
- короткое описание;
- количество триггеров;
- количество ваших подписок на этот проект;
- до четырех тегов;
- кнопку `Open`;
- кнопку `Edit`, если текущий пользователь может редактировать проект.

Если по текущим фильтрам ничего не найдено, каталог показывает пустое состояние с предложением сбросить фильтры. Если проектов нет вообще, показывается пустое состояние каталога.

### Create New Project

Создание проектов доступно пользователям на тарифе `Advanced` и выше.

У каждого тарифа есть свой лимит на количество приватных проектов. Пока лимит не исчерпан, новый проект создается приватным по умолчанию: его можно спокойно настраивать, тестировать триггеры и готовить templates до публикации.

Если лимит приватных проектов закончился, есть два варианта: обновить тариф или сделать один из существующих приватных проектов публичным. Публичный проект больше не занимает место в лимите приватных проектов, поэтому после публикации освобождается слот для нового приватного проекта.

У проекта может быть один из трех уровней доступа:

- `Private` - рабочий режим для подготовки и закрытых интеграций. Проект виден только тем, у кого есть доступ к его workspace/account. Такой проект занимает место в лимите приватных проектов.
- `Public` - опубликованный проект marketplace. Его могут найти и открыть другие пользователи, а владелец продолжает управлять triggers, templates и metadata. Публичный проект не занимает место в лимите приватных проектов.
- `Free` - публичный проект, подписки на который доступны бесплатно всем пользователям Web3alert. Такой уровень обычно нужен проектам и командам, которые хотят оплатить доступ к нотификациям для своего комьюнити. Команда Web3alert также может периодически публиковать в `Free` важные или интересные проекты для всей аудитории сервиса.

## Создание и редактирование проекта

Форма создания и редактирования управляет метаданными проекта. Она не создает сами триггеры и шаблоны, но задает то, как проект будет выглядеть в каталоге и на странице проекта.

После успешного создания нового проекта интерфейс открывает страницу проекта с введенными метаданными. Дальше владелец сам выбирает следующий шаг: импортировать triggers, создать trigger вручную, подготовить templates или использовать AI agent для настройки проекта.

### Права и read-only режим

Если пользователь может управлять триггерами и шаблонами, но не является владельцем metadata, форма показывает состояние `Metadata is read-only`.

В таком режиме можно продолжать работать с технической частью проекта, если права это позволяют, но нельзя менять название, описание, картинки, теги и другие metadata-поля.

### Title

`Title` - обязательное видимое название проекта.

Ограничение: до 32 символов.

Пока поле `Name` не было изменено вручную, `Title` автоматически используется для генерации `Name`.

### Name

`Name` - обязательный slug проекта.

При создании он формируется из title:

- переводится в нижний регистр;
- пробелы заменяются на `-`;
- повторяющиеся дефисы схлопываются;
- дефисы в начале и конце удаляются.

При редактировании существующего проекта `Name` заблокирован, потому что он участвует в идентификаторах и ссылках.

### Access level

`Access level` выбирается при создании или редактировании проекта и определяет, кто увидит проект в marketplace.

Для большинства владельцев проектов базовый путь такой: сначала проект создается как `Private`, затем при готовности переводится в `Public`. Режим `Free` означает, что проект остается публичным, но доступ к подпискам по нему для пользователей бесплатный. Обычно это платная услуга для команды проекта, которая хочет предоставить своему комьюнити бесплатные нотификации.

### Short description

`Short description` - короткое описание для карточек и компактных мест интерфейса.

Поле опциональное. Ограничение: до 256 символов.

### Description

`Description` - полное markdown-описание проекта для вкладки `Overview`.

Поле опциональное. Ограничение: до 4096 символов.

В редакторе есть floating toolbar для выделенного текста:

- `Bold`;
- `Italic`;
- `Link`;
- `Heading`;
- `Code`.

### Tags

`Tags` помогают искать и фильтровать проекты.

Чтобы добавить тег, нужно ввести его в поле `Add tag and press Enter` и нажать `Enter` или кнопку добавления.

Правила тегов:

- только строчные латинские буквы, цифры и дефисы;
- пробелы нормализуются в дефисы;
- максимальная длина одного тега - 20 символов;
- дубликаты не добавляются.

### Links

`Links` - внешние ссылки проекта.

Каждая ссылка состоит из:

- `Title`;
- `URL`;
- кнопки удаления строки.

Кнопка `+ Add link` добавляет новую строку. При сохранении учитываются только ссылки, где заполнены и title, и URL.

На странице проекта эти ссылки отображаются в блоке `Useful links` - полезные ссылки проекта.

### Icon и Cover

Эти поля позволяют задать отдельные URL для визуальных элементов проекта:

- `Icon` - компактная иконка проекта. Она используется в каталоге, на странице проекта, в wizard-ах и как значение по умолчанию для notification avatar;
- `Cover` - широкая обложка для страницы проекта.

Для каждого поля можно выбрать способ заполнения:

- `URL` - вручную вставить ссылку на изображение;
- `Upload` - загрузить файл через Web3alert.

В режиме `Upload` поле с путем становится read-only. До сохранения проекта файл хранится как draft: `/api/v2/projects/<fullname>/images/icon-draft.<extension>` или `/api/v2/projects/<fullname>/images/cover-draft.<extension>`.

После сохранения проекта draft заменяет текущий файл и получает постоянное имя: `icon.<extension>` или `cover.<extension>`. Если загрузить новый icon или cover, он заменит предыдущий файл этого типа.

Ограничения для upload:

- форматы: `jpg`, `jpeg`, `png`, `webp`;
- максимальный размер файла: 5 MB;
- не больше двух постоянных загруженных файлов на один проект: один `icon` и один `cover`.

Если проект еще не сохранен, а картинка уже была загружена, но пользователь ушел со страницы или выбрал другой файл, Web3alert удаляет несохраненную загрузку с сервера.

### Delete project

При редактировании существующего проекта владелец может удалить проект через delete action. Перед удалением показывается подтверждающий диалог.

Удаление проекта - опасная операция: проект связан с триггерами, templates и подписками, поэтому ее стоит использовать только когда проект действительно больше не нужен.

## Страница проекта

Страница отдельного проекта состоит из верхнего блока и вкладок.

В верхнем блоке показываются:

- cover;
- icon;
- title;
- author/workspace;
- short description;
- badge access level (`private`, `public`, `free`);
- быстрые действия, доступные текущей роли.

### Быстрые действия

Набор быстрых действий зависит от вкладки и прав пользователя:

- на `Overview`: `Edit metadata`, если пользователь может редактировать metadata;
- на `Subscriptions`: `Create subscription`, если пользователь может управлять подписками текущего workspace;
- на `Triggers`: `Import triggers` и `Add trigger`, если пользователь может редактировать проект;
- на `Templates`: `Add template`, если пользователь может редактировать проект.

### Overview

Вкладка `Overview` показывает пользовательское описание проекта.

Основные блоки:

- `About` - полное markdown-описание из metadata;
- `Project details` - количество триггеров, количество ваших подписок, project id, дата создания и дата обновления;
- `Tags` - теги проекта;
- `Useful links` - полезные внешние ссылки проекта.

Если URL ресурса начинается с `http://`, `https://`, `mailto:` или `tel:`, ссылка используется как есть. В остальных случаях интерфейс добавляет `https://`.

### Subscriptions

Вкладка `Subscriptions` показывает подписки текущего пользователя/workspace, связанные с этим проектом.

Она доступна только когда текущий пользователь может управлять активным workspace. Если подписок нет, показывается пустое состояние с предложением создать подписку.

### Triggers

Вкладка `Triggers` показывает таблицу триггеров проекта.

В режиме просмотра можно открыть trigger details. В режиме редактирования владелец может:

- выбрать один или несколько триггеров;
- удалить выбранные триггеры;
- открыть редактирование конкретного триггера;
- создать новый триггер через `Add trigger`;
- массово сгенерировать триггеры через `Import triggers`.

Если триггеров еще нет, вкладка предлагает добавить триггер или импортировать набор триггеров.

### Templates

Вкладка `Templates` показывает templates проекта.

Template - это пользовательская оболочка над триггерами: она группирует inputs, topics и rules так, чтобы пользователь мог создать подписку без знания внутренней trigger-конфигурации.

В списке templates отображаются:

- title;
- key/id;
- description;
- количество topics;
- предупреждение `Needs review`, если template имеет issue;
- действия `Edit` и `Delete`, если пользователь может редактировать;
- `Subscribe`, если template валиден и содержит topics.

При нажатии `Subscribe` интерфейс открывает создание подписки с выбранным project/template/topic. Если у template есть `selectedByDefault` topics, они выбираются автоматически; иначе берется первый доступный topic.

## Import triggers

`Import triggers` - wizard для быстрой генерации набора триггеров из ABI EVM-контракта или metadata Substrate pallet.

Он полезен, когда нужно создать много однотипных триггеров: например, все события ERC20-контракта или все events конкретного pallet.

### Step 1. Source

На первом шаге выбирается `Source network`.

В списке доступны data sources, которые можно использовать для генерации:

- EVM sources;
- Substrate sources;
- custom sources, если они подходят для проекта.

Вариант `Add new source` открывает создание data source и возвращает обратно в import wizard.

Wizard проверяет, что source выбран и что у него понятный network type.

### Step 2. Generate для EVM

Для EVM-источника заполняются:

- `Category` - категория будущих триггеров, например `Token transfers`;
- `ABI contract address` - адрес контракта, из которого нужно загрузить ABI;
- `Use as trigger filter` - переключатель, который определяет, будет ли адрес контракта встроен в trigger filter;
- `ABI` - JSON ABI, загруженный автоматически или вставленный вручную;
- кнопка `Load ABI from contract address`.

Если `Use as trigger filter` включен, созданные триггеры будут матчить только события этого контракта. Если выключен, адрес используется только для загрузки ABI, а сами триггеры будут матчить любой контракт с выбранной сигнатурой.

ABI должен быть JSON-массивом. Если ABI не загружается автоматически, его можно вставить вручную.

### Step 2. Generate для Substrate

Для Substrate-источника выбирается `Pallet`.

Интерфейс показывает:

- имя pallet;
- количество events/extrinsics, доступных в metadata;
- runtime version;
- кнопку `Generate triggers from pallet`.

После генерации wizard строит draft-триггеры из выбранного pallet и переводит пользователя на review.

### Step 3. Review & import

На review показывается таблица кандидатов.

Доступно:

- выбрать все;
- снять выбор;
- выбрать отдельные триггеры;
- посмотреть имя триггера;
- посмотреть тип;
- посмотреть категорию;
- посмотреть preview description/schema;
- создать только выбранные триггеры через `Create selected triggers`.

После успешного импорта интерфейс возвращается на вкладку `Triggers` проекта.

## Add trigger / Edit trigger

`Add trigger` открывает подробный wizard создания триггера. Этот wizard задает весь жизненный цикл события: от чтения source item до финального notification defaults.

Редактирование существующего триггера использует тот же wizard, но с уже заполненными значениями.

### Step 1. Description

Панели шага:

- `Title` - обязательное видимое название триггера;
- `ID` - slug/id триггера. В форме он отображается как disabled field;
- `Description` - опциональное текстовое описание, включается переключателем `Optional`;
- `Category` - обязательная категория триггера.

Category используется в таблицах, templates и фильтрации rules.

### Step 2. Source

Сначала выбирается `Trigger type`.

Доступные сценарии:

- `blockchain` - триггер читает события, extrinsics, calls, blocks или transactions из data source;
- `timer` - триггер срабатывает по интервалу.

Для blockchain trigger выбирается `Source`. Если подходящего source нет, можно перейти к `Add new source`.

#### EVM source

Для EVM source настраиваются:

- `Receive from source` - что читать из source: event, call, block или transaction;
- `ABI contract address` - адрес для загрузки ABI;
- `Use as trigger filter` - включать ли contract address в trigger filter;
- `Event signature` или `Call signature` - сигнатура события или метода.

Если указан валидный contract address, wizard пытается загрузить ABI и предлагает выбрать event/call из списка. Если ABI не найден или выбранной сигнатуры нет в ABI, сигнатуру можно ввести вручную.

Для `block` и `transaction` ABI и signature не требуются.

#### Substrate source

Для Substrate source настраиваются:

- `Selection mode` - event, call/extrinsic или block;
- `Pallet` - pallet из runtime metadata;
- `Event` или `Extrinsic` - конкретная entry внутри выбранного pallet.

Если выбран block mode, pallet и event/extrinsic не требуются.

Wizard показывает runtime version, чтобы было понятно, из какой metadata загружены варианты.

#### Timer

Для timer trigger настраивается `Interval`.

Формат interval: число и единица времени, например:

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Step 3. Inputs schema

`Inputs schema` описывает параметры, которые пользователь задает при создании подписки.

Например:

- адрес кошелька;
- порог суммы;
- token id;
- произвольная строка для фильтра.

Редактор поддерживает два режима:

- `UI mode` - поля добавляются через визуальный редактор;
- `JSON mode` - schema редактируется как JSON.

В UI mode для каждого поля настраиваются:

- `Name` - имя поля в inputs;
- `Type` - тип значения;
- дополнительные параметры типа.

Для trigger inputs enum-тип отключен. Это значит, что inputs schema должна состоять из обычных типов, адресов, объектов, массивов и похожих структур, но не enum variants.

### Step 4. Data providers

`Data providers` - опциональный шаг. Providers выполняются сверху вниз и позволяют дополнить source item внешними или runtime-данными перед transform.

В templates и provider-полях можно использовать:

- `{{source.*}}` - данные исходного события;
- `{{inputs.*}}` - значения подписки;
- `{{providers.providerId.*}}` - результат предыдущих providers.

Общие поля каждого provider:

- `Type` - тип provider;
- `ID` - имя, по которому результат будет доступен как `providers.ID`;
- `Timeout` - таймаут выполнения в миллисекундах;
- кнопка тестирования provider;
- кнопка удаления provider.

Доступные provider types:

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Substrate storage`;
- `EVM read`;
- `State window`;
- `JavaScript`.

#### HTTP provider

Поля:

- `Method` - HTTP method, сейчас используется выбор из поддерживаемых методов;
- `URL` - endpoint;
- `Headers` - key-value список headers;
- `Query params` - key-value список query parameters;
- `Body` - опциональный JSON/template body для POST-запроса.

Headers, query params и body поддерживают template-подстановки.

#### GraphQL provider

Поля:

- `Endpoint` - GraphQL endpoint URL;
- `Headers` - key-value headers;
- `Variables` - key-value variables;
- `Query` - GraphQL query document.

Headers и variables поддерживают template-подстановки.

#### Substrate storage provider

Поля:

- `Source` - Substrate source. По умолчанию используется source триггера;
- `Module` - pallet/module;
- `Storage entry` - storage item внутри module;
- argument-поля выбранного storage entry;
- `Block` - опциональный block number/hash/template.

Если storage entry имеет args, wizard создает отдельную панель для каждого arg. Необязательные args можно включать и выключать переключателем `Optional`.

#### EVM read provider

Поля:

- `Source` - EVM source. По умолчанию используется source триггера;
- `Target contract` - адрес контракта для фактического read-call. Поддерживает template, например `{{ source.address }}`;
- `ABI contract address` - адрес контракта, из ABI которого загружать методы. Нужен, если target contract динамический;
- `Read method` - режим `Auto` или `Manual`;
- method arguments, если выбранный метод принимает args.

В `Auto` wizard загружает view/pure methods из ABI и предлагает выбрать метод. В `Manual` можно вставить signature и ABI fragment вручную; args и output schema синхронизируются из ABI fragment.

#### State window provider

`State window` хранит окно последних значений и считает агрегаты.

Поля:

- `Partition by` - опциональный ключ разделения окон, например адрес;
- `Dedupe by` - обязательный уникальный id текущего item, чтобы одно событие не учитывалось дважды;
- `Keep last` - размер окна;
- `Value type` - тип значения в окне;
- `Value` - template или JSON value, который добавляется в окно;
- `Aggregates` - дополнительные агрегаты.

`Count` и `latest` возвращаются всегда. Numeric aggregates доступны только для числовых values.

#### RPC provider

Поля:

- `Transport` - как отправлять RPC request: через source runtime или через direct endpoint;
- `Method` - RPC method name;
- `Endpoint` - URL, если выбран endpoint transport;
- `Headers` - JSON object headers для endpoint transport;
- `Params` - JSON array params;
- `Custom body` - опциональный полный JSON-RPC body для endpoint transport.

Если transport идет через source runtime, прямой endpoint не нужен.

#### JavaScript provider

Поля:

- `Variables` - key-value variables для функции;
- `Source` - JavaScript function source.

JavaScript provider используется, когда дополнительное значение проще вычислить кодом на основе source, inputs и предыдущих providers.

#### Test Provider

Для provider доступен диалог `Test Provider`.

В нем нужно заполнить только те template values, которые provider реально использует. Значения предыдущих providers можно передать вручную через `providers.*` paths. Если provider не содержит template references, тест можно запускать сразу.

### Step 5. Activation condition

`Activation condition` - опциональное JavaScript-условие.

Оно включается переключателем `Optional`. Если условие выключено, trigger считается активным для всех source items, прошедших source matching.

Если условие включено, код должен вернуть значение, по которому engine решит, активировать ли дальнейшую обработку. Это удобно для логики, которую нельзя выразить только filters schema или template rules.

### Step 6. Filters schema

`Filters schema` описывает поля, по которым подписки смогут фильтровать trigger output.

Редактор поддерживает:

- `UI mode`;
- `JSON mode`;
- `Add property`;
- вложенные object/array/tuple структуры;
- `Source path` для pre-filtering.

`Source path` нужен, когда поле output называется не так, как исходное поле source item. Engine применяет filters в два этапа: ранний pre-filter по source data и затем conditions по сформированному output. Если имена различаются, `Source path` связывает output-поле с исходным путем.

### Step 7. Output schema

`Output schema` состоит из двух панелей:

- `Raw output`;
- `Human output`.

`Raw output` описывает машинный результат trigger transform. Эти поля используются в rules, filters, templates и downstream-логике.

`Human output` описывает человекочитаемый результат для уведомлений. Его можно:

- оставить `Use same as raw`;
- выключить `Use same as raw` и задать собственную schema.

Редактор schema поддерживает `UI mode` и `JSON mode`.

В UI mode типы могут включать:

- string;
- number;
- boolean;
- null;
- address;
- balance;
- object;
- array;
- tuple;
- enum;
- lookup.

Для address можно выбрать address type и SS58 prefix. Для balance можно опционально задать decimals и symbol. Для object/array/tuple/enum используются вложенные редакторы.

### Step 8. Transform

Шаг содержит две JavaScript-панели:

- `Raw transform`;
- `Human transform`.

`Raw transform` получает source, inputs и providers и возвращает объект, соответствующий `Raw output`.

`Human transform` получает source, inputs, providers и raw output и возвращает объект, соответствующий `Human output`.

Редактор подсказывает доступный context и показывает validation error, если JavaScript некорректен.

### Step 9. Defaults

`Defaults` задает шаблоны уведомлений по умолчанию. Все панели опциональные и включаются отдельными переключателями.

Доступные панели:

- `Title` - заголовок уведомления;
- `Short` - короткий markdown-текст;
- `Long` - длинный markdown-текст;
- `Icon` - URL иконки;
- `Cover` - URL обложки;
- `Avatar` - URL аватара уведомления. По умолчанию используется тот же URL, что и в `Icon`;
- `Links` - массив ссылок.

Поля используют autocomplete и Handlebars/template helpers. В defaults можно ссылаться на source, inputs, providers, raw output и human output.

Для `Links` каждая строка содержит:

- `Title`;
- `Url`;
- кнопку удаления;
- `Add item` для добавления ссылки.

При сохранении каждая ссылка должна иметь и title, и URL.

### Step 10. Test & save

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

## Add template / Edit template

Template wizard создает пользовательские сценарии подписки поверх технических триггеров.

Главная идея: пользователь не должен знать внутренние trigger ids, schemas и filter expressions. Он выбирает понятный template/topic, заполняет inputs, а rules внутри template связывают это с нужными triggers.

### Верхняя часть wizard

В hero-зоне показываются показатели текущего template:

- сколько schema fields настроено;
- сколько templates/groups определено;
- сколько topics доступно;
- сколько rules mapped;
- статус готовности.

Кнопка `Save template` сохраняет template. При редактировании существующего template также доступно удаление.

Навигация внутри wizard:

- `Overview`;
- `Templates`;
- `Preview`.

### Overview: Template meta

Панель `Template meta` содержит:

- `Title` - видимое название всего template spec;
- `Project` - проект, к которому относится template;
- `Mode` - existing template или draft template;
- `Quality status` - количество items, требующих внимания, или `Ready for save`;
- `Description` - описание template.

### Templates section

Раздел `Templates` описывает структуру пользовательских шаблонов.

Верхний уровень - это один или несколько template groups. Внутри каждого group задаются inputs, topics и rules.

Кнопка `+ Add template` добавляет новый group.

### Common items

Панель `Common items` появляется, если есть inputs или topics, которые еще не привязаны к конкретному template group.

Для common input показываются:

- `Name`;
- `Type`;
- `Move to template`;
- `Remove`.

`Move to template` позволяет оставить input common или перенести его в конкретный group.

Если есть detached topics, wizard показывает предупреждение, что topics не прикреплены к template. Их нужно восстановить через JSON preview или пересоздать внутри нужного template.

### Template group

Каждый template group имеет:

- порядковый номер;
- title/name в заголовке;
- chips с количеством inputs и topics;
- `Remove template`.

Поля group:

- `Template name` - внутренний id template group;
- `Visible title` - название, которое увидит пользователь;
- `Description` - описание пользовательского сценария.

Удаление group отвязывает inputs и удаляет topics/rules, которые были внутри него.

### Inputs внутри template

Inputs - это поля, которые пользователь будет заполнять при создании подписки по template.

Кнопка `+ Add input` добавляет новое поле.

У каждого input есть:

- `Name` - ключ input;
- `Type` - тип значения;
- `Visible title` - человекочитаемый label;
- `Description` - пояснение для пользователя;
- `Remove`.

Типы:

- `string`;
- `number`;
- `boolean`;
- `null`;
- `address`.

Для `address` дополнительно настраиваются:

- `Address type` - `ss58` или `evm`;
- `Prefix` - например `0x`;
- `ss58 prefix` - числовой prefix для SS58-адресов.

Wizard показывает, сколько rules используют конкретный input.

### Topics

Topic - это пользовательская тема подписки внутри template group.

Кнопка `+ Add topic` добавляет topic. Если topic создается через UI, первый rule появляется автоматически.

Поля topic:

- `Topic name` - внутренний id topic;
- `Visible title` - название для пользователя;
- `Description` - описание темы;
- `Selected by default` - будет ли topic выбран автоматически при создании подписки;
- `Remove topic`.

Topic содержит один или несколько rules.

### Rules

Rule связывает topic с конкретным trigger и задает filters/inputs/policy.

Поля rule:

- `Rule id` - внутренний id rule;
- `Trigger category` - категория trigger;
- `Trigger` - конкретный trigger внутри выбранной категории;
- `Deprecated` - пометка устаревшего rule;
- `Required inputs` - какие inputs обязательны для этого rule;
- `Filters`;
- `Rule inputs JSON`;
- `Policy JSON`;
- `Remove rule`.

Кнопка `+ Add another rule` добавляет дополнительный rule к тому же topic. Это нужно, если одна пользовательская тема должна активировать несколько triggers или несколько веток фильтрации.

### Filters builder

В `Filters` есть два режима:

- `Builder`;
- `Raw JSON`.

В `Builder` условия собираются из блоков.

Внутри одного `AND block` все строки должны выполниться одновременно. Между несколькими блоками стоит `OR`: достаточно, чтобы сработал один блок.

Строка filter содержит:

- `Param` - поле trigger filters/output schema;
- `Operator` - оператор сравнения;
- `Value type` - тип значения;
- `Value` - literal или template, например `{{ inputs.address }}`;
- `Remove`.

Кнопки:

- `+ Add filter` - добавляет строку в текущий AND block;
- `+ Add OR block` - добавляет новый альтернативный block;
- `Remove block` - удаляет block.

В `Raw JSON` можно напрямую ввести conditions JSON, например структуру с `any`/`all`.

### Rule inputs JSON

`Rule inputs JSON` позволяет передать в rule дополнительные inputs не через builder, а как JSON.

Например, это может быть служебный объект, который нужен runtime-логике trigger или subscription builder.

### Policy JSON

`Policy JSON` задает policy rule. Это низкоуровневая настройка и обычно используется для специальных сценариев фильтрации или совместимости.

### Readiness rail

Правая панель wizard показывает:

- `Readiness` - общий статус `Needs attention` или `Ready`;
- счетчики schema fields, templates, topics и rules;
- `Checklist` - список проблем и подсказок;
- `Live preview` - JSON payload, который будет отправлен при сохранении.

`Live preview` показывает итоговую форму template spec с placeholder fallback для незаполненных names. Его удобно использовать для review перед сохранением.

## Практический порядок настройки проекта

Для нового проекта обычно удобен такой порядок:

1. Создать project metadata: title, name, access level, descriptions, tags, icon, cover и useful links.
2. Проверить или создать нужные data sources.
3. Создать минимальные triggers вручную или через import wizard.
4. Протестировать triggers на реальных block numbers/items.
5. Создать templates и topics, которые будут понятны пользователям.
6. Проверить template preview и readiness checklist.
7. Создать тестовую подписку через template.
8. Проверить доставку уведомления.
9. Перевести project access level в нужный production-режим.

Такой порядок помогает не публиковать template раньше, чем технические triggers и notification defaults действительно готовы.
