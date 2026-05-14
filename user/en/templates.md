# Templates

`Templates` are ready-made subscription scenarios inside a project. They help the project owner turn technical [triggers](triggers.md) into user-friendly options: what exactly can be tracked, which parameters need to be filled in, and which topics can be selected.

If a trigger answers “which event to read and how to process it”, a template answers “how can a user conveniently subscribe to this event”. A template does not replace a trigger. It collects one or several triggers into a clearer subscription flow.

## What templates are for

Templates are needed when a project should be convenient not only for the integration owner, but also for marketplace users.

Without a template, the user selects a trigger directly and works closer to the technical configuration: inputs, filters, defaults, and action settings. This is fine for precise or advanced scenarios.

With a template, the project owner prepares a simpler path in advance:

- groups related scenarios into one template;
- defines clear topics;
- leaves only the necessary inputs for the user;
- connects topics with triggers and filters;
- can choose topics that will be enabled by default.

## What a template consists of

### Project

A template always belongs to a specific [project](projects.md). It uses triggers from this project and is shown on the `Templates` tab of the project page.

### Template metadata

Metadata describes the template itself: visible title, internal name, and description. These details are shown in the templates list and help the user understand which subscription scenario they are choosing.

### Inputs

Inputs are values that the user fills in when creating a subscription through a template.

For example, a template can ask for an address, token id, threshold amount, or another parameter. These values can then be used in rules as filtering conditions. Important: inputs are required if they are used by the selected topic/rule.

### Topics

A topic is a separate option inside a template that the user can enable or disable when creating a subscription.

For example, one `Token activity` template can contain `Transfers`, `Mints`, and `Burns` topics. The user selects one or several topics, and the template already knows which triggers and conditions stand behind each topic.

### Rules

A rule connects a topic with a concrete trigger.

One topic can use one rule if it is based on one trigger, or several rules if the topic should include several similar events. In a rule, a trigger is selected and, if needed, filters are configured.

### Filters

Filters inside a rule restrict which trigger results match the selected topic.

A filter value can be set directly or linked to a template input through `Use inputs`. In the second case, the user fills the input when creating a subscription, and the rule uses that value in the condition.

## How templates are used in subscriptions

When the user clicks `Subscribe` on a template, the interface opens [subscription creation](subscription-wizard.md) with the selected project/template/topic already chosen.

If the template has topics with `Selected by default`, they will be selected automatically. If there are no such topics, the interface selects the first available topic.

The user can:

- choose topics;
- fill inputs required by the selected rules;
- configure actions and notification overrides in the subscription wizard;
- later edit the subscription without changing the template itself.

## Template vs Trigger

A trigger can be used directly when precise technical control or a single scenario is needed.

A template is more convenient when the user should receive a ready-made choice: several topics, clear inputs, and preconfigured rules on top of triggers.

Both approaches are normal. The choice depends on who will create the subscription and how technical the process should be.

## Statuses and errors

If a template has a problem with a rule or linked trigger, the list can show `Needs review`. Such a template should be checked and fixed before users can subscribe through it normally.

Common reasons:

- trigger was deleted or renamed;
- rule points to a missing topic;
- filter no longer matches trigger schema;
- template does not contain topics yet.

## Management

On the `Templates` tab, the project owner can:

- create a template through [Add template](template-wizard.md);
- open an existing template for editing;
- delete one or several templates;
- open subscription creation through `Subscribe` if the template is valid and contains topics.

The detailed creation process is described in [Add template / Edit template](template-wizard.md).
