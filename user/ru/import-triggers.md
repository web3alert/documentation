# Import Triggers

`Import triggers` - wizard для быстрой генерации набора триггеров по указанным конфигам или metadata, например по ABI EVM-контракта, metadata Substrate pallet или IDL Solana program.

Это упрощенный частный случай создания triggers. Он полезен, когда нужно создать много однотипных триггеров: например, все события ERC20-контракта или все events конкретного pallet. Если нужен один точный сценарий с полной ручной настройкой, лучше использовать [Add trigger / Edit trigger](trigger-wizard.md).

Import triggers - это автогенерация, поэтому после импорта стоит протестировать полученные triggers и убедиться, что alerts выглядят именно так, как задумано. Для простых событий результата часто достаточно сразу, но для сложных структур лучше дополнительно настроить transform, human output и defaults: упростить вложенные данные, отформатировать суммы и адреса, убрать лишние технические поля и оставить в уведомлении только то, что действительно полезно пользователю.

## Step 1. Source

На первом шаге выбирается `Source network`.

В списке доступны [data sources](data-sources.md), которые можно использовать для генерации:

- EVM sources;
- Substrate sources;
- Solana sources;
- custom sources, если они подходят для проекта.

Вариант [Add new source](data-sources.md#add-data-source) открывает создание [data source](data-sources.md) и возвращает обратно в import wizard.

Wizard проверяет, что source выбран и что у него понятный network type.

## Step 2.a. Generate for EVM

Для EVM-источника заполняются следующие панели.

### Category

Категория будущих триггеров, например `Token transfers`.

### ABI contract address

Адрес контракта, из которого нужно загрузить ABI.

### Use as trigger filter

Переключатель, который определяет, будет ли адрес контракта встроен в trigger filter.

### ABI

JSON ABI, загруженный автоматически или вставленный вручную.

### Load ABI from contract address

Кнопка запускает загрузку ABI по указанному contract address.

Если `Use as trigger filter` включен, созданные триггеры будут матчить только события этого контракта. Если выключен, адрес используется только для загрузки ABI, а сами триггеры будут матчить любой контракт с выбранной сигнатурой.

ABI должен быть JSON-массивом. Если ABI не загружается автоматически, его можно вставить вручную.

## Step 2.b. Generate for Substrate

Для Substrate-источника выбирается `Pallet`.

Интерфейс показывает:

- имя pallet;
- количество events/extrinsics, доступных в metadata;
- runtime version;
- кнопку `Generate triggers from pallet`.

После генерации wizard строит draft-триггеры из выбранного pallet и переводит пользователя на review.

## Step 2.c. Generate for Solana

Для Solana-источника заполняются следующие панели.

### Category

Категория будущих триггеров.

### Program ID

Public key Solana program, из которой нужно загрузить IDL и для которой будут созданы triggers.

### IDL

JSON IDL программы. Wizard может попытаться загрузить IDL автоматически через Anchor IDL account или Program Metadata. Если автоматическая загрузка недоступна, IDL нужно вставить вручную.

IDL обязателен: без него import не создает raw triggers, потому что source не сможет надежно декодировать instructions, events, arguments и accounts.

### Source item

Для Solana import доступны `Event` и `Call`.

`Event` создает triggers для program events, которые декодируются из logs. `Call` создает triggers для Solana instructions выбранной программы. В UI используется общий термин `Call`, но в Solana это соответствует instruction.

После генерации wizard строит draft-триггеры из events/instructions, найденных в IDL, и переводит пользователя на review.

## Step 3. Review & import

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

После успешного импорта интерфейс возвращается на вкладку [Triggers](projects.md#triggers) проекта.
