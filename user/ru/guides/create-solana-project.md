# Создание проекта Solana

Этот гайд показывает, как создать в Web3alert проект для Solana и добавить в него первые triggers.

В примере мы создаем проект `Solana`, выбираем существующий Solana data source и импортируем triggers из IDL программы. В результате получается проект, на который пользователи могут подписаться и получать уведомления о событиях и инструкциях выбранной Solana-программы.

## Что понадобится

Перед началом подготовьте:

- запущенный Solana data source — список доступен в разделе `Data sources` (см. [Data sources](../data-sources.md)); если источника еще нет, его можно создать прямо из мастера импорта через `Add new source`;
- `Program ID` — публичный ключ Solana-программы, которую хотите отслеживать;
- IDL программы — JSON-описание ее событий и инструкций; во многих случаях Web3alert загрузит его автоматически по `Program ID`.

## Шаг 1. Создайте проект

Откройте `Projects` в левом sidebar и нажмите `Create New Project`.

Заполните основные поля:

| Поле | Значение |
| --- | --- |
| `Title` | `Solana` |
| `Name` | `solana` |
| `Access level` | `Private` на время подготовки, `Public` для публикации в marketplace |

Несколько важных моментов:

- `Name` генерируется автоматически из `Title`, но его можно поправить вручную. После создания проекта изменить `Name` уже нельзя.
- Уровень `Free` (бесплатные подписки для всех пользователей) становится доступен после активации project add-on в разделе `Billing`. На старте достаточно `Private`.

Включите `Short description` и добавьте короткую однострочную аннотацию, например:

```text
Solana mainnet notifications for program instructions, events, and account activity.
```

Включите `Description` и добавьте описание проекта в markdown, например:

```markdown
Solana is a high-performance Layer 1 blockchain for applications that need fast finality and low transaction costs.

This Web3alert project collects Solana program activity from an existing Solana data source. Use it to build alerts for program instructions, decoded program events, and account reads based on Solana IDL.
```

Включите `Tags` и добавьте теги (вводите тег и нажимайте Enter):

```text
solana
layer-1
smart-contracts
```

Опционально:

- `Links` — официальный сайт Solana, документация, explorer или страница программы, которую вы отслеживаете;
- `Icon` и `Cover` — логотип и обложка проекта, их можно загрузить файлом или указать URL.

Нажмите `Create project`. После создания вы попадете на страницу проекта с вкладками `Overview`, `Triggers` и `Templates`.

Подробнее о полях проекта — в разделе [Projects](../projects.md).

![Project creation form](/guides/solana-project/01-project-create.png)

![Project overview](/guides/solana-project/02-project-overview.png)

## Шаг 2. Откройте импорт triggers

На странице проекта перейдите на вкладку `Triggers`.

Пока в проекте нет triggers, вкладка предлагает два действия: `Add trigger` (ручное создание одного trigger) и `Import triggers` (массовый импорт). Нажмите `Import triggers`.

Импорт — самый быстрый способ создать сразу несколько Solana triggers из IDL программы. Ручное создание через [trigger wizard](../trigger-wizard.md) лучше использовать позже, когда понадобится один точечный trigger с особыми настройками.

![Empty triggers tab](/guides/solana-project/03-project-triggers-empty.png)

## Шаг 3. Выберите Solana source

Мастер импорта состоит из трех шагов: `Source`, `Generate` и `Review & import`. Прогресс отображается в шапке мастера.

На шаге `Source` в поле `Source network` выберите ваш Solana source. В списке показываются только запущенные data sources, у каждого подписан тип сети — ищите пометку `Solana`.

Если подходящего источника нет, выберите в списке `Add new source` — мастер отправит вас на создание data source и вернет обратно после завершения.

Нажмите `Next step`.

![Solana source selected in import wizard](/guides/solana-project/04-import-source.png)

## Шаг 4. Укажите программу и загрузите IDL

На шаге `Generate` заполните:

| Поле | Описание |
| --- | --- |
| `Category` | Понятная группа для будущих triggers, например `Program activity`, `Governance` или `Transfers`. Категория попадет в названия и идентификаторы triggers. |
| `Program ID` | Публичный ключ Solana-программы, которую нужно отслеживать. |
| `IDL` | JSON с IDL программы. |

Проще всего нажать `Load IDL from program address` — Web3alert попробует найти опубликованный IDL по `Program ID`: сначала в Anchor IDL account, затем в Program Metadata. Если загрузка удалась, поле `IDL` заполнится автоматически.

Если автоматическая загрузка не сработала, вставьте IDL JSON вручную — например, из репозитория или документации проекта. Без IDL импорт невозможен: именно по нему Web3alert понимает, какие события и инструкции есть у программы и как их расшифровывать в понятные уведомления.

Нажмите `Generate triggers from IDL`. Если поле `IDL` оставить пустым, Web3alert перед генерацией сам попробует загрузить IDL по `Program ID`.

Web3alert сгенерирует черновики triggers для всех событий (events) и инструкций (calls) из IDL — лишние можно будет отключить на следующем шаге.

![Solana IDL generation step](/guides/solana-project/05-import-solana-idl.png)

## Шаг 5. Проверьте и импортируйте triggers

Шаг `Review & import` показывает таблицу сгенерированных черновиков. Над таблицей виден счетчик выбранных, например `5/12 selected`.

Для каждого trigger в таблице показаны:

- checkbox выбора (checkbox в шапке таблицы выбирает или снимает все сразу);
- `Trigger` — название trigger и его идентификатор;
- `Type` — `event` (событие программы) или `call` (инструкция программы);
- `Description` — описание из IDL, если разработчики программы его добавили.

Оставьте отмеченными только те triggers, которые действительно нужны вашим подписчикам. Нормально начать с небольшого набора и добавить остальные позже — импорт можно запускать повторно.

Нажмите `Create selected triggers`.

После импорта мастер вернет вас на страницу проекта. Откройте вкладку `Triggers`, чтобы увидеть созданные triggers.

![Generated Solana trigger review](/guides/solana-project/06-import-review.png)

## Шаг 6. Протестируйте и доработайте triggers

Сгенерированные triggers рабочие, но «сырые»: названия и тексты уведомлений берутся напрямую из IDL. Перед публикацией откройте каждый важный trigger в [trigger wizard](../trigger-wizard.md) и проверьте:

- название и описание — понятны ли они человеку, не знакомому с внутренностями программы;
- выбранный source и `Program ID`;
- событие или инструкцию, на которую реагирует trigger;
- filters — нужно ли сузить срабатывания, например по конкретному account или значению;
- текст уведомления (human output) — что именно увидит подписчик.

Для проектов в marketplace текст уведомления — самое важное. Сгенерированный trigger может быть технически корректным, но показывать подписчику малопонятную структуру данных. Хорошее уведомление скрывает техническую часть и показывает только значения, которые действительно важны: суммы, адреса, названия.

![Imported Solana trigger source settings](/guides/solana-project/07-trigger-edit.png)

## Шаг 7. Добавьте templates

Triggers — это технические «кирпичики». Templates превращают их в готовые сценарии подписки, понятные пользователям.

Откройте вкладку `Templates` и создайте один или несколько templates под основные сценарии уведомлений. Например:

- `Program activity`;
- `Account updates`;
- `Governance events`;
- `Token activity`.

У каждого template должны быть понятное название и осмысленные настройки по умолчанию, чтобы пользователь мог подписаться, не разбираясь во внутренней структуре triggers. Подробнее — в разделах [Templates](../templates.md) и [Template wizard](../template-wizard.md).

![Solana template creation form](/guides/solana-project/08-template-create.png)

## Финальный checklist

Перед публикацией проекта проверьте:

- выбранный Solana source запущен и работает стабильно;
- импортированные triggers протестированы на реальных данных программы;
- тексты уведомлений короткие и понятные подписчику;
- лишние triggers отключены или удалены;
- templates покрывают основные сценарии подписки;
- в metadata проекта есть понятное описание, теги и полезные ссылки;
- access level выбран осознанно.

Переключайте проект в `Public` только когда triggers и templates готовы. Если проект должен быть бесплатным для всех пользователей, активируйте project add-on в `Billing` и установите access level `Free` (это платная услуга).
