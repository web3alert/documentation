# Add Template / Edit Template

`Add template` opens the template creation wizard inside a project. This wizard helps assemble a user-facing subscription scenario on top of existing [triggers](triggers.md): describe the template, define inputs, create topics, and connect each topic with triggers through rules.

Editing an existing template uses the same process, but the form opens with already saved values.

Before creating a template, it is usually worth preparing triggers first: create them manually through [Add trigger / Edit trigger](trigger-wizard.md) or generate them through [Import triggers](import-triggers.md). A template does not create triggers by itself. It uses triggers that already exist in the project.

## Step 1. Metadata

This step defines the main template details. They are shown to the user on the project `Templates` tab and help explain which scenario the template is intended for.

### Template title

Visible template title. It is better to keep it short and meaningful: for example `Token transfers`, `Governance events`, `Validator activity`.

### Template name

Internal template slug inside the project. It is generated from the title, but can be edited manually.

Name should be stable: it is used in URLs and in topic/rule links. After publishing a template, it is better not to change name unless necessary.

### Description

Template description. Here it is worth explaining which alerts the user can receive through this template and when it should be selected.

## Step 2. Inputs

This step describes inputs that the user will fill when creating a subscription through the template.

Inputs are not always needed. If a topic does not require user parameters and all rules use fixed conditions, the template can have no inputs.

If an input is used in a rule through `Use inputs`, the user will need to fill it in the subscription wizard.

### Input

Each input describes one value available to this template's topics/rules.

### Name

Technical input name. It is used in rules as `inputs.<name>`, so it should be short, stable, and clear.

### Type

Type of value that the user will enter.

Available types:

- `string` - regular string;
- `number` - number;
- `boolean` - true/false;
- `null` - empty value;
- `object` - object with nested fields;
- `array` - array of same-type values;
- `tuple` - array with a fixed set of elements;
- `address` - blockchain address;
- `balance` - token/native balance;
- `currency` - monetary value.

For most template inputs, simple types are better. The simpler the input, the easier it is for the user to create a subscription.

Other input properties are configured through the same [schema editor](trigger-wizard.md#schema-editor) used in [Add trigger / Edit trigger](trigger-wizard.md). It describes field metadata, address/balance settings, and nested structures for object, array, and tuple.

## Step 3. Topics

This step shows the list of topics inside the template and actions for managing them.

A topic is a subscription option inside a template. The user can choose one or several topics when creating a subscription.

### Add topic

Opens the topic creation wizard.

If the template has not been saved yet, the interface first saves template changes and then opens topic creation.

### Topics table

The table shows topics of the current template.

Columns:

- `Topic` - topic title and name;
- `Description` - topic description;
- `Rules` - first linked trigger/rule and number of additional rules;
- `Actions` - edit/delete actions.

### Edit topic

Opens topic wizard for the selected topic.

### Delete topic

Deletes the topic and its linked rules from the template. A confirmation is shown before deletion.

## Topic wizard

Topic wizard opens from Step 3 of the template wizard. It is used both for creating and editing a topic.

## Topic Step 1. Metadata

This step defines how the topic will look to the user in the subscription wizard.

### Title

Visible topic title.

For example: `Transfers`, `Mints`, `Burns`, `Large deposits`.

### Name

Internal topic name. It is generated from title, but can be edited.

Topic name is normalized by the interface: spaces and separators are converted to dots, for example `Balances transfer` becomes `balances.transfer`. This is not the global slug format for the whole service, but the current format specifically for topic keys, because topics often look like event namespaces. The main requirement is that name should be short, clear, and stable.

### Description

Optional topic description. It explains what changes if the user enables this topic.

### Selected by default

Defines whether the topic will be selected automatically when opening the subscription wizard.

This is convenient for the main or most popular topic in a template. If too many topics are selected by default, the subscription can become noisy, so it is better to select only truly basic topics.

## Topic Step 2. Rules

This step connects the topic with one or several triggers.

A rule says which trigger to use and which conditions must be met for the event to enter this topic.

### Rule

One rule connects the topic with one trigger.

If the topic should react to several triggers, add several rules through `Add rule`.

### Trigger category

Filter for the trigger list by category. It helps find the needed trigger faster in a large project.

### Trigger

Concrete trigger that the rule will use.

After trigger selection, the wizard loads available fields for filters from trigger schema.

### Filters

Optional rule conditions.

If filters are not set, the rule uses all events from the selected trigger. If filters are set, an event enters the topic only when conditions are met.

### Add a filter

Adds a filtering condition.

In a filter, select a field from trigger output or filters schema, an operator, and a value.

### Select filter

Trigger field by which the event should be filtered.

For object fields, you can go deeper into the structure and select a nested field.

### Operator

Comparison operator.

Available options:

- equals;
- not equal;
- greater than;
- greater or equal;
- less than;
- less or equal.

For numeric conditions, UI shows compact operator switches.

### Value

Value to compare with the selected field.

Value can be set in two ways:

- literal value - fixed value directly in the rule;
- template input - value from inputs that the user fills when creating a subscription.

### Use inputs

Switches filter from a fixed value to a value from template inputs.

For example, a template can have input `wallet`. Then a rule can filter field `from` or `to` by `{{ inputs.wallet }}`. The user enters the address once in the subscription wizard, and the topic rule uses it as the condition.

### AND / OR logic

Several filters inside one group work as `AND`: the event must pass all conditions in the group.

If conditions are split with `OR`, the wizard creates several groups: the event must pass at least one of the groups.

### Remove all filters

Deletes all rule filters. After that, the rule again accepts all events from the selected trigger.

### Add rule

Adds another rule to the topic.

This is needed if one topic should combine several triggers. For example, topic `Token activity` can include separate rules for transfer, mint, and burn events.

## Save

`Save template` saves metadata, inputs, topics, and rules.

`Save topic` saves the topic and returns the user to the template flow.

After saving, the template appears on the project [Templates](projects.md#templates) tab. If the template contains at least one topic and has no issues, users can open `Subscribe` and [create a subscription](subscription-wizard.md) through this template.
