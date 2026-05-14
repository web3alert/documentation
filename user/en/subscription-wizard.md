# Create Subscription

`Create subscription` is the wizard that creates a new subscription for the active workspace. In it, the user chooses what to subscribe to, sets conditions, and selects actions for alert delivery.

The wizard can be opened from the general [Subscriptions](subscriptions.md) section, from a [project](projects.md) page, or through the `Subscribe` button on a [template](templates.md). If the wizard is opened from a project/template, part of the selection is already filled in.

## General wizard structure

The wizard consists of two main parts:

- `Trigger` - selecting project/template/trigger, topics, inputs, and filters;
- `Action` - selecting a delivery channel and configuring action parameters.

If the wizard is opened from the general `Subscriptions` section, project must be selected first. If the wizard is opened from a project page, project selection is skipped.

## Step 1. Project

This step appears when a subscription is created from the general section, without a preselected project.

### Project picker

Allows selecting the project to subscribe to.

After project selection, the wizard moves to trigger/template configuration. If project is already passed in the URL, for example from a project or template page, this step is skipped.

## Step 2. Trigger

At this step, choose what exactly will trigger alerts.

If the project supports templates and direct triggers, the wizard shows a choice of subscription creation method.

### Templates

`Templates` are ready-made subscription scenarios prepared by the project owner.

This path is usually simpler: the user selects a template, then a topic, and fills only the inputs required by the selected topics.

### Events and calls

`Events and calls` is direct trigger selection.

This path is closer to technical configuration: the user selects trigger category, a concrete trigger, and configures inputs/filters if they are available.

## Template flow

Template flow is used when `Templates` is selected or the user clicked `Subscribe` on a template.

### Choose a template

If the project has several templates, the wizard asks the user to choose the needed template.

If there is only one template, the wizard can go directly to selecting its topics.

### Choose a category

Inside a template, topics can be grouped by category/template group.

The user selects a group to see related topics and inputs.

### Pick the triggers and fill in the required fields

At this step, the user selects topics and fills inputs.

Topics are checkboxes inside the template. One or several topics can be selected.

Inputs can be:

- common - shared by several selected topics;
- unique - related only to a specific topic.

If a topic requires input, it must be filled before moving to actions.

## Direct trigger flow

Direct trigger flow is used when `Events and calls` is selected.

### Trigger category

Triggers are grouped by categories. In project flow, categories usually correspond to project trigger groups.

### Trigger

Concrete trigger that the subscription will use.

After trigger selection, the wizard shows description if it exists and opens trigger parameters.

### Inputs

Inputs are required or optional values that the trigger expects from the user.

For example, a trigger can ask for an address, amount threshold, or another parameter. Fields are built from trigger schema.

### Filters

Filters narrow alerts and prevent unnecessary notifications.

If filters are not needed, they can be left empty. If several filters are added, they can be combined with `AND` and `OR` logic:

- `AND` - the event must pass all conditions in the group;
- `OR` - the event must pass at least one condition group.

### Add a filter

Adds a new condition.

For a filter, select a field, an operator, and a value. Available fields depend on trigger schema.

## Step 3. Action

At this step, choose where alerts should be sent.

### Simple mode

Simple mode shows available resources and lets the user select one or several delivery channels.

This is the main scenario for regular subscription creation: choose Telegram, Discord, webhook, or another resource already connected to the workspace.

### Add new resource

Opens resource creation form if the needed channel does not exist yet.

Resources are described in detail in [Resources](resources.md).

### Advanced mode

Advanced mode is available for direct trigger flow. It lets the user choose action type manually, fill action parameters, and, if the action supports it, configure notification overrides.

For template flow, simple resource selection is used because the template already defines the user-facing subscription scenario.

### Choose the action type

Select a concrete action, for example sending to Telegram, Discord, or another channel.

### Set parameters

Parameters of the selected action. Usually they include a resource where the alert should be sent and additional fields if the action requires them.

## Notification overrides

If the action supports overrides, separate fields can be enabled and notification defaults can be replaced.

### Title

Notification title.

### Short

Short notification text.

### Message

Long notification text.

### Icon

Icon URL.

### Cover

Cover URL.

### Avatar

Notification avatar URL.

### Links

Notification links. Each link has title and URL.

Overrides support Handlebars/template syntax and Markdown where the action supports it. Values are rendered from trigger output, so raw/human output fields and helpers described in [Defaults](trigger-wizard.md#handlebars-helpers) can be used.

## Test run

`Test run` is available at the final step.

Test run lets the user check the draft subscription before saving: selected rules, filters, inputs, and actions. The result shows whether the event matched the conditions and which actions would have been executed.

If test run shows issues, it is better to fix the subscription before saving.

## Save alert

`Save alert` creates or updates the subscription.

After successful save, the wizard returns the user:

- to the general [Subscriptions](subscriptions.md) section, if the subscription was created from there;
- to the [Subscriptions](projects.md#subscriptions) tab of the specific project, if the wizard was opened from project flow;
- to the original page, if the wizard was opened with a special `returnTo`.

## Edit, duplicate, and delete

An already created subscription can be opened for editing from the [Subscriptions](subscriptions.md) list.

`Duplicate` opens the wizard with settings of the existing subscription, but saves the result as a new subscription.

`Delete` deletes the subscription. After deletion, alerts for this subscription are no longer sent.
