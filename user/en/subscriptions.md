# Subscriptions

`Subscriptions` are user rules for receiving alerts. A subscription connects the selected project, trigger or template, user parameters, filtering conditions, and actions through which Web3alert sends notifications.

Put simply, a project describes the available integration, [triggers](triggers.md) and [templates](templates.md) describe what can be subscribed to, and a subscription is the concrete workspace setup: what exactly to watch, under which conditions, and where to send the result.

## What a subscription connects

### Workspace

A subscription belongs to the active workspace. That is why the subscription list shows settings for the current workspace, not only for the current user.

If the user switches workspace, they see and manage a different set of subscriptions.

### Project

Each subscription is linked to a project. The project defines the marketplace integration, available triggers, templates, metadata, and access level.

On the project page, the [Subscriptions](projects.md#subscriptions) tab shows the same subscription list as the general [Subscriptions](subscriptions.md) section, but filtered by the specific project.

### Trigger or template

A subscription can be created in two ways:

- through a [template](templates.md), when the user selects a ready-made scenario and topics;
- directly through a [trigger](triggers.md), when the user needs more precise event, inputs, and filters configuration.

A template inside a subscription expands into rules. A rule defines which trigger to use and which conditions to apply.

### Inputs and filters

Inputs are values the user fills in when creating a subscription. They may be needed by a trigger directly or by template rules.

Filters are additional conditions that limit the alert stream. For example, notifications can be received only for a specific address, token id, or amount.

For template subscriptions, part of the filters may already be prepared by the project owner. In that case, the user fills only clear inputs, and the template applies them in rules.

### Actions

Actions define where and how notifications are delivered.

Usually an action is linked to a [resource](resources.md): Telegram chat, Discord channel, webhook, or another delivery channel. A subscription can have one or several actions.

### Notification overrides

For some actions, notification appearance can be overridden: title, short/long message, icon, cover, avatar, and links.

If overrides are not set, trigger/template defaults are used. Defaults are recommendations from the trigger creator, not a hard rule: the user can keep them or replace them for their own scenario.

## How a subscription works

When a source brings a new event, Web3alert checks the project triggers. If a trigger forms output, the engine applies subscription rules: inputs, filters, template conditions, and activation logic.

If the event matches the subscription, Web3alert forms the notification payload and sends it to the selected actions.

If the event does not pass the conditions, no notification is sent.

## Subscription states

### On

The subscription is active and can send alerts.

### Off

The subscription was disabled by the user or created in a disabled state. It keeps its settings, but does not send alerts.

### Blocked

The subscription is blocked by the service. Usually this is related to permissions, limits, project/trigger/template availability, or another reason that needs to be fixed.

A blocked subscription should not be treated as deleted: settings remain, but alert delivery is stopped until the reason is resolved.

## Subscription list

In the `Subscriptions` section, you can:

- search subscriptions by address, event, or filter;
- enable and disable a subscription;
- open editing;
- duplicate a subscription;
- run a test run;
- share a link to the setup;
- delete a subscription.

The table shows:

- `Triggers` - selected trigger/template, topics, inputs, and filters;
- `Actions` - delivery channels;
- `Settings` - state and management actions.

## Creation

The detailed creation process is described in [Create subscription](subscription-wizard.md).
