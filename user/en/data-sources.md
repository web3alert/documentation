# Data Sources

`Data sources` are sources of blockchain/runtime data from which Web3alert receives blocks, transactions, events, extrinsics, Solana instructions/calls, and metadata.

Put simply, a data source answers “where to read data from”, and a [trigger](triggers.md) answers “which event from this data should be considered relevant and how to turn it into output for a subscription”.

## What data sources are for

A data source is used in several places:

- in [Add trigger / Edit trigger](trigger-wizard.md), when trigger selects a blockchain source;
- in [Import triggers](import-triggers.md), when the wizard generates triggers from ABI, pallet metadata, or another description;
- in runtime engine, which connects to endpoint, reads new blocks, and passes source items to triggers;
- in monitoring, where source status, lag, and logs can be viewed.

One data source can be used by several projects and triggers if the same network or runtime fits them.

## System and custom sources

Two source types can appear in the list.

### System sources

System sources are sources already supported by Web3alert. They belong to the platform and are usually available as shared marketplace data sources.

Such sources cannot be edited from workspace. They are shown in the list so users can see which runtime sources are currently registered and what state they are in.

### Custom sources

Custom sources are sources created inside a workspace.

They can be used for your own projects, custom integrations, and testing new networks. A custom source can be made private or public if it should be available more broadly.

Creating custom sources is not available on all plans. Free accounts cannot create their own data sources; a paid tier is required. The tier can also have a limit on the number of custom sources.

## Custom source types

Currently the wizard supports three custom data source types.

### EVM

EVM source is used for networks and endpoints compatible with Ethereum JSON-RPC.

It is suitable for EVM events, transactions, blocks, contract logs, and contract reads that are later used in triggers and providers.

For EVM source, it is usually enough to specify one or several HTTP RPC endpoints.

### Substrate

Substrate source is used for Polkadot/Substrate-compatible networks.

It is suitable for runtime events, extrinsics, calls, blocks, storage reads, and metadata-based trigger import.

For Substrate source, WebSocket endpoint is usually used. If the network requires non-standard signed extensions, runtime types, or RPC definitions, they can be added at the `Extensions` step.

### Solana

Solana source is used for Solana-compatible networks and RPC endpoints.

It is suitable for Solana blocks, successful instructions/calls, and program events decoded from IDL. For a Solana source, the program IDL is important: the wizard can try to load it automatically from an Anchor IDL account or Program Metadata, but if automatic loading fails, IDL JSON must be pasted manually.

Without IDL, Web3alert does not create Solana event/call triggers, because it cannot reliably build argument, account, and output schema structure.

For Solana source, HTTP RPC URL is usually used. The source reads each slot/block through RPC and extracts matching events/calls from the full block without separate `getTransaction` requests.

## Data source list

The `Data Sources` section shows a table of sources.

Sources are grouped by type or runtime category, for example `EVM`, `Substrate`, `Solana`, or another plugin/runtime type.

### Name

Visible source title and its short technical name.

### Deployer

Workspace or platform owner that created the source.

For system sources, `common` is usually shown. For custom sources, the owning workspace is shown.

### Access

Source access level.

`System` means platform source. `Private` means source of the current workspace. `Public` means custom source published for broader use.

### Created at

Custom source creation date.

For system/runtime-only sources, date may be absent.

### Lag

Source lag behind the latest seen block.

If the source processed all available blocks, `Up to date` is shown. If there is backlog, the number of lagging blocks is shown.

### Status

Current runtime source state.

Possible states:

- `Running` - source is running;
- `Degraded` - source is running, but has problems or errors;
- `Error` - source is in error;
- `Pending` - custom source is saved, but runtime registration has not finished yet;
- `Registered` - source is registered, but runtime status does not return active state.

### Settings

Action menu for the source.

Available items depend on user permissions and source type.

## Source actions

### Logs

Opens custom source logs.

Logs help understand whether runtime connected to endpoint, which blocks are processed, and which errors occur.

### System alerts

Opens subscription creation for system notifications about the source.

This allows receiving alerts when source enters error, recovers, or starts lagging.

### Test system alerts

Sends a test system event to check alert flow.

This feature is not available on all tiers and is usually needed by source owners/administrators.

### Edit

Opens source wizard for editing custom source.

System sources cannot be edited.

### Restart source

Restarts runtime worker source.

This is useful if the source looks stuck, but processing should continue from the saved position.

### Reset lag

Drops backlog and continues processing from the current network head.

Skipped blocks after such reset will not be processed. This action should be used only if the old backlog is no longer needed or prevents the source from catching up.

### Delete

Deletes custom source.

Before deletion, it is important to check whether the source is used in triggers or imports. If the source is deleted, linked triggers and projects can lose their data source.

## Add data source

`Add new source` opens custom source creation wizard.

The wizard consists of four steps: `Details`, `Extensions`, `Test deployment`, and `Deploy`.

## Step 1. Details

This step defines basic source configuration: title, access, network type, endpoints, and runtime processing settings.

### Title

Human-readable source title.

It is shown in lists and helps distinguish sources from each other. For example: `Ethereum archive node`, `Polkadot private RPC`, `Base mainnet`.

### Name

Stable source slug inside workspace.

Name is generated from title, but can be changed before saving. It can contain only lowercase letters, numbers, and dashes.

After source creation, name becomes part of fullname like `<workspace>.source.<name>`.

### Access level

Defines custom source availability.

`Private` is suitable for current workspace sources and private integrations. `Public` is used when the source should be available more broadly and can be used by other projects or users if they have corresponding permissions.

### Type

Blockchain/runtime source type.

Currently `EVM`, `Substrate`, and `Solana` are available.

### Endpoints

List of RPC endpoints to which runtime will connect.

One or several endpoints can be specified. Several endpoints are useful for redundancy: if one endpoint is unstable, runtime can use another.

For EVM and Solana, HTTP RPC URL is usually used. For Substrate, WebSocket URL is usually used.

### Batch max count

Optional setting for EVM source.

It controls the maximum number of batch requests when reading data. If the field is not enabled, the default value is used.

This setting belongs to advanced runtime settings and is needed only when standard behavior is not suitable.

### Block processing concurrency

Optional block processing concurrency setting.

A higher value can speed up processing, but increases load on endpoint and runtime. If the field is not enabled, the default value is used.

### Max queued blocks

Optional block queue limit.

It limits the number of blocks the source can keep in processing queue. If the field is not enabled, the default value is used.

## Step 2. Extensions

This step configures additional runtime extensions.

For EVM and Solana sources, this step usually requires nothing: they do not use signed extensions, custom runtime types, or RPC extension definitions in this flow.

For Substrate sources, extensions are needed only for networks where standard metadata is not enough.

### Extensions

General optional extensions switch.

If the endpoint is regular and metadata is read without additional settings, this step can be left disabled.

### Preset

Ready-made settings set for known Substrate runtime cases.

Currently available:

- `No preset`;
- `Avail`;
- `Polkadot Asset Hub / Statemint`;
- `Kusama Asset Hub / Statemine`.

If a preset is selected, the wizard uses prepared settings and does not require manually filling signed extensions, types, and RPC.

### Signed extensions

JSON array describing custom signed extensions.

This is needed for Substrate networks where extrinsics use non-standard extensions and runtime cannot decode them correctly without an additional description.

### Types

JSON object with custom runtime types.

This is needed if metadata or RPC returns types that runtime cannot recognize automatically.

### RPC

JSON object with custom RPC methods.

This is needed if trigger/provider should call non-standard RPC sections or methods of a Substrate node.

## Step 3. Test deployment

This step checks that runtime can connect to source before saving.

### Deployment test

Shows summary of the future source: workspace, fullname, and type.

`Run test deployment` button starts checking endpoints and runtime configuration.

### Logs

Shows test deployment result.

If test deployment ends with an error, it is better not to save the source until endpoints or extensions are fixed.

You can move forward only after a successful check.

## Step 4. Deploy

The final step saves source and waits for runtime registration.

### Deploy source

Shows summary of configuration that will be saved.

For Substrate source, extensions summary is also shown: preset, signed extensions, custom types, and RPC methods.

`Create source` button creates a new source. When editing existing source, the button is called `Update source`.

### Deploy logs

Shows save and runtime registration process.

After successful save, source appears in the `Data Sources` list. If runtime registration has not finished yet, source may stay in `Pending` status for some time.

## Edit data source

Editing custom source uses the same wizard.

Title, access level, endpoints, extensions, and runtime settings can be changed. Name is locked during editing because it is part of stable fullname.

After source update, runtime registration can take some time.
