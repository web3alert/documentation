# Add Template / Edit Template

`Add template` открывает wizard создания template внутри проекта. Этот wizard помогает собрать пользовательский сценарий подписки поверх уже существующих [triggers](triggers.md): описать template, задать inputs, создать topics и связать каждый topic с triggers через rules.

Редактирование существующего template использует тот же процесс, но форма открывается с уже сохраненными значениями.

Перед созданием template обычно стоит подготовить triggers: создать их вручную через [Add trigger / Edit trigger](trigger-wizard.md) или сгенерировать через [Import triggers](import-triggers.md). Template не создает trigger сам, а использует уже существующие triggers проекта.

## Step 1. Metadata

На этом шаге задаются основные данные template. Они показываются пользователю на вкладке `Templates` проекта и помогают понять, для какого сценария предназначен template.

### Template title

Видимое название template. Его лучше писать коротко и по смыслу: например `Token transfers`, `Governance events`, `Validator activity`.

### Template name

Внутренний slug template внутри проекта. Он формируется из title, но его можно отредактировать вручную.

Name должен быть стабильным: он используется в URL и в связях topics/rules. После публикации template лучше не менять name без необходимости.

### Description

Описание template. Здесь стоит объяснить, какие alerts пользователь сможет получить через этот template и когда его стоит выбирать.

## Step 2. Inputs

На этом шаге описываются inputs, которые пользователь будет заполнять при создании subscription через template.

Inputs нужны не всегда. Если topic не требует пользовательских параметров и все rules используют фиксированные условия, template может быть без inputs.

Если input используется в rule через `Use inputs`, пользователь должен будет заполнить его в subscription wizard.

### Input

Каждый input описывает одно значение, доступное topics/rules этого template.

### Name

Техническое имя input. Оно используется в rules как `inputs.<name>`, поэтому должно быть коротким, стабильным и понятным.

### Type

Тип значения, которое пользователь будет вводить.

Доступные типы:

- `string` - обычная строка;
- `number` - число;
- `boolean` - true/false;
- `null` - пустое значение;
- `object` - объект с вложенными полями;
- `array` - массив однотипных значений;
- `tuple` - массив с фиксированным набором элементов;
- `address` - blockchain address;
- `balance` - token/native balance;
- `currency` - денежное значение.

Для большинства template inputs стоит выбирать простые типы. Чем проще input, тем понятнее пользователю создавать subscription.

Остальные свойства input настраиваются через тот же [schema editor](trigger-wizard.md#schema-editor), который используется в [Add trigger / Edit trigger](trigger-wizard.md). Там описаны metadata полей, address/balance настройки и вложенные структуры для object, array и tuple.

## Step 3. Topics

На этом шаге показывается список topics внутри template и действия для управления ими.

Topic - это вариант подписки внутри template. Пользователь может выбрать один или несколько topics при создании subscription.

### Add topic

Открывает wizard создания topic.

Если template еще не сохранен, интерфейс сначала сохраняет изменения template, а затем открывает создание topic.

### Topics table

Таблица показывает topics текущего template.

Колонки:

- `Topic` - title и name topic;
- `Description` - описание topic;
- `Rules` - первый связанный trigger/rule и количество дополнительных rules;
- `Actions` - edit/delete actions.

### Edit topic

Открывает topic wizard для выбранного topic.

### Delete topic

Удаляет topic и связанные с ним rules из template. Перед удалением показывается подтверждение.

## Topic wizard

Topic wizard открывается из Step 3 template wizard. Он используется и для создания, и для редактирования topic.

## Topic Step 1. Metadata

На этом шаге задается, как topic будет выглядеть для пользователя в subscription wizard.

### Title

Видимое название topic.

Например: `Transfers`, `Mints`, `Burns`, `Large deposits`.

### Name

Внутреннее имя topic. Оно формируется из title, но его можно отредактировать.

Topic name нормализуется интерфейсом: пробелы и разделители приводятся к точкам, например `Balances transfer` станет `balances.transfer`. Это не общий формат всех slugs в сервисе, а текущий формат именно для topic keys, потому что topics часто выглядят как namespace события. Главное требование - name должен быть коротким, понятным и стабильным.

### Description

Опциональное описание topic. Оно объясняет, что изменится, если пользователь включит этот topic.

### Selected by default

Определяет, будет ли topic выбран автоматически при открытии subscription wizard.

Это удобно для основного или самого популярного topic в template. Если включить слишком много topics по умолчанию, subscription может стать шумной, поэтому лучше выбирать только действительно базовые topics.

## Topic Step 2. Rules

На этом шаге topic связывается с одним или несколькими triggers.

Rule говорит: какой trigger использовать и какие условия должны быть выполнены, чтобы событие попало в этот topic.

### Rule

Один rule связывает topic с одним trigger.

Если topic должен срабатывать по нескольким triggers, можно добавить несколько rules через `Add rule`.

### Trigger category

Фильтр списка triggers по категории. Он помогает быстрее найти нужный trigger в большом проекте.

### Trigger

Конкретный trigger, который будет использовать rule.

После выбора trigger wizard подгружает доступные поля для filters из trigger schema.

### Filters

Опциональные условия rule.

Если filters не заданы, rule использует все события выбранного trigger. Если filters заданы, событие попадет в topic только когда выполнены условия.

### Add a filter

Добавляет условие фильтрации.

В filter выбирается поле из trigger output или filters schema, оператор и значение.

### Select filter

Поле trigger, по которому нужно фильтровать событие.

Для object-полей можно проваливаться внутрь структуры и выбирать вложенное поле.

### Operator

Оператор сравнения.

Доступные варианты:

- equals;
- not equal;
- greater than;
- greater or equal;
- less than;
- less or equal.

Для числовых условий UI показывает компактные переключатели операторов.

### Value

Значение, с которым сравнивается выбранное поле.

Value можно задать двумя способами:

- literal value - фиксированное значение прямо в rule;
- template input - значение из inputs, которое пользователь заполнит при создании subscription.

### Use inputs

Переключает filter с фиксированного значения на значение из template inputs.

Например, template может иметь input `wallet`. Тогда rule может фильтровать поле `from` или `to` по `{{ inputs.wallet }}`. Пользователь вводит адрес один раз в subscription wizard, а topic rule использует его как условие.

### AND / OR logic

Несколько filters внутри одной группы работают как `AND`: событие должно пройти все условия группы.

Если разделить условия через `OR`, wizard создает несколько групп: событие должно пройти хотя бы одну из групп.

### Remove all filters

Удаляет все filters rule. После этого rule снова будет принимать все события выбранного trigger.

### Add rule

Добавляет еще один rule к topic.

Это нужно, если один topic должен объединять несколько triggers. Например, topic `Token activity` может включать отдельные rules для transfer, mint и burn events.

## Save

`Save template` сохраняет metadata, inputs, topics и rules.

`Save topic` сохраняет topic и возвращает пользователя к template flow.

После сохранения template появляется на вкладке [Templates](projects.md#templates) проекта. Если template содержит хотя бы один topic и не имеет issues, пользователи смогут открыть `Subscribe` и [создать subscription](subscription-wizard.md) по этому template.
