# Triggers

`Triggers` are technical project rules that define which events Web3alert reads from a data source, how it checks activation conditions, and what result it forms for the subscription and related actions.

Triggers can be used directly or through templates. A direct trigger works when the user needs precise source, inputs, filters, and defaults configuration. A template is convenient when the project owner wants to package one or more triggers into a ready-made subscription scenario with an understandable topic and predefined rules. Which path to choose depends on the specific case.

Trigger connects several parts of the service:

- [Projects](projects.md) - the project where trigger is created and displayed;
- [Data sources](data-sources.md) - source of blockchain/runtime data;
- [Subscriptions](subscriptions.md) - user subscriptions that use trigger directly or through template rules;
- [Resources](resources.md) and [Addresses](addresses.md) - external entities that can be used in inputs, filters, or notification defaults.

## How to Create Triggers

There are two main paths:

- [Add trigger / Edit trigger](trigger-wizard.md) - the main detailed wizard. It is used for manual trigger creation and editing, from source to notification defaults;
- [Import triggers](import-triggers.md) - simplified bulk wizard. It generates a set of triggers from the specified configs or metadata, for example from an EVM contract ABI, Substrate pallet metadata, or Solana program IDL, and then lets you choose which ones to save.

If you need to configure one exact scenario or edit an existing trigger, you usually use [Add trigger / Edit trigger](trigger-wizard.md). If you need to quickly get many similar triggers from an external contract or pallet description, it is easier to start with [Import triggers](import-triggers.md).

A project has a trigger count limit. If the project has already reached the limit, new triggers cannot be saved until the limit is increased or some existing triggers are removed. This is described in more detail in [Limits](limits.md#project-triggers).
