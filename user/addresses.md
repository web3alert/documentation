# Addresses

`Addresses` - это адресная книга текущего workspace.

Она хранит blockchain addresses и понятные aliases для них, чтобы в subscriptions и уведомлениях можно было работать не только с длинными техническими адресами, но и с человеческими названиями: `Treasury`, `Main wallet`, `Alice validator`, `Ops multisig`.

## Для чего нужны addresses

Addresses помогают в трех основных сценариях.

### Быстрее заполнять subscriptions

Когда в [Create subscription](subscription-wizard.md) есть поле address, интерфейс может предлагать адреса из address book.

Это удобно, если workspace часто подписывается на одни и те же wallets, contracts, validators или accounts.

### Понятнее читать subscriptions

Адреса из address book проще узнавать в inputs и filters.

Например, вместо того чтобы каждый раз вспоминать, какой wallet скрывается за длинным `0x...`, можно хранить alias `Treasury` и использовать его как понятное имя.

### Улучшать notification defaults

В [notification defaults](trigger-wizard.md#defaults) можно использовать Handlebars helpers `address` и `make`.

Они берут адрес из trigger output и, если такой адрес есть в address book текущего workspace, выводят alias. Если alias не найден, helper оставляет адрес как есть или сокращает его до компактного вида.

Это особенно полезно для уведомлений, где есть несколько адресов: sender, receiver, contract, validator, delegator или multisig.

## Workspace scope

Address book принадлежит текущему workspace.

Если переключить workspace, список addresses изменится. Это важно: адрес `Treasury` в одном workspace и адрес `Treasury` в другом workspace могут быть разными сущностями.

Управлять addresses могут пользователи с правами управления workspace. Если у пользователя нет таких прав, раздел `Addresses` будет недоступен для просмотра и редактирования.

Address book не подтверждает владение адресом и не дает доступа к wallet. Это только справочник aliases для удобства настройки и отображения alerts.

## Типы адресов

При добавлении address сначала выбирается тип. Тип нужен для валидации и для корректного поиска alias при рендеринге уведомлений.

### Plain

Произвольное строковое значение.

Используется, когда нужно сохранить не стандартный blockchain address, а другой идентификатор, который все равно удобно подписывать alias-ом.

### Substrate (ss58 format)

Адрес Substrate/Polkadot ecosystem в SS58 format.

При сохранении UI нормализует SS58 address во внутренний canonical формат, а в списке показывает его обратно как SS58. Это позволяет сопоставлять один и тот же account даже если он был введен в разных SS58 variants.

### Bitcoin

Bitcoin address.

Подходит для Bitcoin-style addresses, которые используются в Bitcoin subscriptions и уведомлениях.

### Ethereum (EVM)

EVM address в формате `0x...`.

Подходит для Ethereum-compatible сетей: Ethereum, Polygon, Base, Arbitrum, Optimism, Celo и других EVM networks.

При поиске alias EVM addresses сравниваются без учета регистра.

### Cosmos

Cosmos/Bech32 address.

При сохранении UI нормализует Bech32 address к базовому `cosmos` prefix, чтобы один и тот же address можно было сопоставлять стабильнее.

## Список addresses

Раздел `Addresses` показывает адресную книгу текущего workspace.

### Alias

Человекочитаемое имя address.

Alias отображается в списке, используется в helpers и помогает узнавать адрес в subscriptions и уведомлениях.

### Type

Тип address: `plain`, `ss58`, `bitcoin`, `evm` или `cosmos`.

### Address

Сам address.

В списке он может отображаться в отформатированном виде. Для длинных адресов интерфейс может сокращать середину на узких экранах, но при копировании используется полный address.

### Network icons

Если address используется в subscriptions, рядом могут появиться иконки связанных networks/projects.

Это помогает понять, где уже используется конкретный address.

### Copy

Кнопка копирует полный address.

### Edit

Позволяет изменить alias.

Address и type при этом остаются теми же: если нужно заменить сам address, лучше удалить старую запись и добавить новую.

### Delete

Удаляет address из address book.

Удаление не удаляет subscriptions, но после удаления alias больше не будет подставляться в подсказках и notification helpers.

## Add address

`Add address` открывает форму создания новой записи.

### Address type

Первым шагом выбирается тип address.

После выбора типа появляются поля `Name` и `Address`.

### Name

Опциональный alias.

Если name не заполнен, alias будет равен самому address. Если name заполнен, он должен быть не короче трех символов и не должен дублировать alias другого address того же типа.

Лучше выбирать короткое и понятное имя, которое будет нормально смотреться в уведомлениях: `Treasury`, `Bridge hot wallet`, `Validator stash`.

### Address

Обязательное поле с address value.

Address не должен содержать пробелы, должен проходить валидацию выбранного типа и не должен дублировать уже сохраненный address того же типа.

### Add address

Сохраняет запись в address book текущего workspace.

После сохранения form сбрасывается, а новый address появляется в списке.

## Использование в subscription wizard

Address book используется в полях, которые описаны schema как address.

Когда пользователь вводит address в subscription inputs или filters, интерфейс может показать подходящие записи из address book. Можно выбрать готовый address вместо ручного копирования.

Если в dropdown видно ненужную запись, ее можно удалить прямо из address input. Это удалит запись из address book workspace.

## Использование в notification templates

Address book особенно полезна в defaults и overrides уведомлений.

### address helper

`address` принимает одно значение.

Если значение является известным blockchain address и найдено в address book, helper вернет alias. Если alias не найден, известный address будет сокращен до компактного вида.

Пример:

```handlebars
{{address raw.from}}
```

### make helper

`make` принимает string, object или array и рекурсивно заменяет найденные addresses на aliases.

Это удобно, когда output содержит структуру с несколькими адресами.

Пример:

```handlebars
{{make raw}}
```

Если внутри `raw` есть адреса из address book, в уведомлении вместо них будут показаны aliases.
