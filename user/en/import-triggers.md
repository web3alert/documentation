# Import Triggers

`Import triggers` is a wizard for quickly generating a set of triggers from selected configs or metadata, for example from an EVM contract ABI or Substrate pallet metadata.

It is a simplified special case of creating triggers. It is useful when you need to create many similar triggers: for example, all events of an ERC20 contract or all events of a specific pallet. If you need one precise scenario with full manual configuration, use [Add trigger / Edit trigger](trigger-wizard.md).

Import triggers is automatic generation, so after import it is worth testing the generated triggers and making sure alerts look exactly as intended. For simple events, the generated result is often enough right away, but for complex structures it is better to additionally configure transform, human output, and defaults: simplify nested data, format amounts and addresses, remove unnecessary technical fields, and keep only what is truly useful for the user in the notification.

## Step 1. Source

In the first step, select `Source network`.

The list contains [data sources](data-sources.md) that can be used for generation:

- EVM sources;
- Substrate sources;
- custom sources, if they fit the project.

The [Add new source](data-sources.md#add-data-source) option opens [data source](data-sources.md) creation and returns back to the import wizard.

The wizard checks that a source is selected and that it has a clear network type.

## Step 2.a. Generate for EVM

For an EVM source, fill the following panels.

### Category

Category for future triggers, for example `Token transfers`.

### ABI contract address

Contract address from which ABI should be loaded.

### Use as trigger filter

Switch that determines whether the contract address will be embedded into the trigger filter.

### ABI

JSON ABI loaded automatically or pasted manually.

### Load ABI from contract address

Button that starts ABI loading from the specified contract address.

If `Use as trigger filter` is enabled, created triggers will match only events from this contract. If it is disabled, the address is used only to load ABI, and the triggers themselves will match any contract with the selected signature.

ABI must be a JSON array. If ABI cannot be loaded automatically, it can be pasted manually.

## Step 2.b. Generate for Substrate

For a Substrate source, select `Pallet`.

The interface shows:

- pallet name;
- number of events/extrinsics available in metadata;
- runtime version;
- `Generate triggers from pallet` button.

After generation, the wizard builds draft triggers from the selected pallet and moves the user to review.

## Step 3. Review & import

The review step shows a table of candidates.

Available actions:

- select all;
- clear selection;
- select individual triggers;
- view trigger name;
- view type;
- view category;
- view preview description/schema;
- create only selected triggers through `Create selected triggers`.

After successful import, the interface returns to the project [Triggers](projects.md#triggers) tab.
