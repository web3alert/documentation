# Создание проекта Solana

Этот гайд показывает, как создать Solana project и добавить первые Solana triggers в Web3alert.

В примере создаем проект `Solana`, выбираем существующий Solana source и импортируем triggers из Program IDL.

## Шаг 1. Создайте Solana Project

Откройте `Projects` в левом sidebar и нажмите `Create New Project`.

Заполните основные поля:

| Поле | Значение |
| --- | --- |
| `Title` | `Solana` |
| `Name` | `solana` |
| `Access level` | `Private` для подготовки, `Public` для публикации или `Free`, если subscriptions должны быть бесплатными для пользователей |

Включите `Short description` и используйте:

```text
Solana mainnet notifications for program instructions, events, and account activity.
```

Включите `Description` и добавьте короткое описание проекта, например:

```markdown
Solana is a high-performance Layer 1 blockchain for applications that need fast finality and low transaction costs.

This Web3alert project collects Solana program activity from an existing Solana data source. Use it to build alerts for program instructions, decoded program events, and account reads based on Solana IDL.
```

Включите `Tags` и добавьте:

```text
solana
layer-1
smart-contracts
```

Опционально добавьте useful links: официальный сайт Solana, документацию, explorer или страницу проекта для программы, которую вы отслеживаете.

Нажмите `Create project`.

> Screenshot slot: `01-project-create`
>
> Показать форму создания project с `Title = Solana`, `Name = solana`, выбранным access level, включенным short description и заполненными tags.

> Screenshot slot: `02-project-overview`
>
> Показать страницу overview нового Solana project с видимой metadata.

## Шаг 2. Откройте Import Triggers

После создания project откройте его страницу и перейдите на вкладку `Triggers`.

Нажмите `Import triggers`.

Import - самый быстрый способ создать несколько Solana triggers из program IDL. Ручное создание trigger лучше использовать, когда нужен один очень точный trigger с custom providers, filters и transforms.

> Screenshot slot: `03-project-triggers-empty`
>
> Показать вкладку `Triggers` в Solana project до создания triggers, с видимым действием `Import triggers`.

## Шаг 3. Выберите Solana Source

В import wizard выберите существующий Solana source.

Нажмите `Next step`.

> Screenshot slot: `04-import-source`
>
> Показать шаг выбора source в import wizard, где выбран существующий Solana source.

## Шаг 4. Загрузите или вставьте Program IDL

На Solana generation step заполните:

| Поле | Описание |
| --- | --- |
| `Category` | Понятная группа будущих triggers, например `Program activity`, `Governance` или `Transfers`. |
| `Program ID` | Public key Solana-программы, которую нужно отслеживать. |
| `IDL` | Program IDL JSON. |

Нажмите `Load IDL from program address`, если программа публикует Anchor IDL account или Program Metadata.

Если automatic loading сработает, Web3alert заполнит поле `IDL`. Если не сработает, вставьте IDL JSON вручную. IDL обязателен, потому что Web3alert использует его для decoding Solana instructions, events, arguments, accounts и output schema.

Нажмите `Generate triggers from IDL`.

> Screenshot slot: `05-import-solana-idl`
>
> Показать Solana import step с category, Program ID, загруженным или вставленным IDL JSON и кнопкой `Generate triggers from IDL`.

## Шаг 5. Проверьте Generated Triggers

Review step показывает trigger drafts, сгенерированные из IDL.

Проверьте:

- trigger names;
- event или call type;
- category;
- generated output preview;
- состояние selected checkbox.

Оставьте только triggers, которые хотите опубликовать. Нормально начать с небольшого набора и добавить остальные triggers позже.

Нажмите `Create selected triggers`.

> Screenshot slot: `06-import-review`
>
> Показать review table с несколькими generated Solana trigger candidates и выбранными checkboxes.

## Шаг 6. Протестируйте и отполируйте Triggers

После import откройте каждый важный trigger и проверьте:

- source selection;
- Program ID;
- event или call name;
- output schema;
- filters;
- providers;
- raw и human transforms;
- notification defaults.

Для user-facing marketplace projects особенно важно human output. Сгенерированный trigger может быть технически корректным, но слишком сырым для subscribers. Хороший notification text скрывает лишнюю техническую структуру и показывает значения, которые действительно важны пользователю.

> Screenshot slot: `07-trigger-edit`
>
> Показать один generated Solana trigger в trigger wizard, желательно на шаге Solana event/call configuration или output/transform.

## Шаг 7. Добавьте Templates

Triggers - это технические building blocks. Templates превращают их в subscription scenarios, понятные пользователям.

Откройте вкладку `Templates` и создайте один или несколько templates для основных alert use cases. Например:

- `Program activity`;
- `Account updates`;
- `Governance events`;
- `Token activity`.

У каждого template должны быть понятные topics и defaults, чтобы users могли подписаться без знания внутренней trigger structure.

> Screenshot slot: `08-template-create`
>
> Показать форму создания template для Solana subscription scenario.

## Финальный checklist

Перед публикацией project проверьте:

- выбранный Solana source доступен и работает стабильно;
- generated triggers протестированы на реальных или representative Solana data;
- raw output machine-readable и стабильный;
- human output короткий и понятный;
- templates покрывают основные subscription scenarios;
- project metadata содержит понятное description, tags и useful links;
- access level выбран осознанно.

Для marketplace project переключайте project в `Public` только после готовности triggers и templates. Если project должен быть бесплатным для всех users, используйте `Free` access согласно product и billing setup.
