# Workspaces

`Workspace` is the Web3alert working space where a team stores and configures its projects, subscriptions, delivery resources, data sources, and address book.

In simple terms, account is responsible for the user's personal sign-in, profile, and billing, while workspace is responsible for collaboration and service working data.

One account can belong to multiple workspaces. The active workspace is selected in the left menu, and it defines which entities the user sees in the main service sections:

- [Projects](projects.md) - projects created in the workspace, plus available marketplace projects;
- [Subscriptions](subscriptions.md) - subscriptions of the current workspace;
- [Resources](resources.md) - delivery channels and external endpoints of the current workspace;
- [Data sources](data-sources.md) - custom data sources of the current workspace and available system sources;
- [Addresses](addresses.md) - address book of the current workspace.

## Workspace and Account

Do not confuse workspace with account.

### Account

`Account` is the user's personal entity.

Account includes:

- authentication methods;
- personal profile and user avatar;
- billing profile;
- balance;
- current tier;
- plan purchases and project free-access add-ons;
- the user's personal membership in different workspaces.

### Workspace

`Workspace` is the working entity of a team or user.

Workspace includes:

- workspace title, avatar, and name;
- workspace members and their roles;
- invite link for adding members;
- projects created in this workspace;
- project transfer requests;
- workspace subscriptions;
- workspace resources;
- workspace custom data sources;
- workspace address book;
- workspace subscription logs.

When a user switches the active workspace, they remain the same account but see a different working context.

## Workspace Left Menu

The left menu has a separate `Workspace` block.

### Current Workspace

The top row of the block shows the current workspace: its avatar or the first letter of its name, title, and dropdown arrow.

Clicking the row opens the workspace menu.

### Parameters

Opens `Workspace parameters` - the settings page for the current workspace.

This is where workspace settings, members, transfer requests, and subscription logs are managed.

### Switch Workspaces

Shows other workspaces the current account belongs to.

Clicking another workspace switches the active workspace. After switching, the interface stays in the same section when possible. For example, a user can switch from `Projects` in one workspace to `Projects` in another. If the current detail page no longer exists in the new workspace, the interface returns the user to the project list.

### Add Workspace

Opens creation of a new workspace.

## Creating a Workspace

A new workspace is created from the left menu: `Workspace` -> `Add workspace`.

After creation, the interface switches the user to the new workspace and opens [Projects](projects.md).

### Title

Visible workspace name.

Title is shown in the left menu, workspace settings, and other interface areas where a readable workspace name is needed.

Title is required.

### Name

Stable workspace slug.

Name is used as the technical workspace name and becomes part of fullnames for entities that belong to the workspace. For example, a project can receive a fullname like `<workspace>.<project-name>`.

Name is required and must be kebab-case: Latin letters, numbers, and hyphens.

Until the user changes `Name` manually, the form tries to generate it from `Title`. If title contains unsupported characters, name must be filled in manually.

### Reserved Names

Some names are reserved by the platform.

For example, workspace names and titles related to `common` or `web3alert` cannot be used for regular user workspaces.

### Cancel

Cancels workspace creation and returns the user to the main interface.

## Workspace Roles

A workspace member has one of the roles.

### Owner

Main workspace owner.

Owner can manage workspace settings, members, and project transfers. Transferring a project out of the workspace is available only to owner.

### Admin

Workspace administrator.

Admin can manage workspace settings and members, but cannot initiate project transfer on behalf of the owner.

### Developer

Member who works with technical workspace entities.

Exact access depends on permissions for projects and service sections. In workspace settings, developer does not manage members or transfer requests.

### User

Basic workspace member.

Usually uses ready-made projects, subscriptions, and resources, but does not manage workspace settings.

## Workspace Parameters

`Workspace parameters` is the settings menu for the active workspace.

The set of tabs depends on the user's role and on the workspace itself. For example, `Project transfers` is available only to owner.

## Information

The `Information` tab contains the main workspace settings.

### Workspace

Workspace profile panel.

It shows:

- workspace avatar;
- workspace title;
- title edit button.

### Avatar

Workspace avatar is shown in the left menu and in places where the interface needs to visually distinguish one workspace from another.

To replace the avatar, click the current image. `JPG` and `PNG` files up to 1 MB are supported.

During upload, a crop tool opens. Workspace uses rounded-square crop because the workspace avatar is displayed as a rounded square in the interface.

### Title

Title can be edited directly in the workspace panel.

After saving, the new title appears in the left menu and workspace settings.

Title cannot be empty.

### Name

Read-only workspace name.

Name cannot be edited from settings because it participates in entity fullnames and links.

## Members

The `Members` tab manages workspace members.

It is available to users who can manage the workspace. Usually this means owner and admin.

### Invite New Members

For regular workspaces, the tab shows an invite link.

This link can be copied and sent to a user who should be added to the workspace. By invite link, the user first signs in if they are not yet signed in to Web3alert, then clicks `Join` and enters the workspace.

### Workspace Members

List of workspace members.

For each member, the list shows:

- avatar or first letter of the name;
- display name;
- `You` mark if it is the current user;
- current role;
- remove button if the current user can remove members.

### Role Select

Allows changing a member's role.

The change is applied immediately after selecting a role.

Available roles:

- `Owner`;
- `Admin`;
- `Developer`;
- `User`.

### Remove Member

Removes a member from the workspace.

A confirmation is shown before removal. If the user removes themselves, the action works as `Leave workspace`.

### Members Access

If the user does not have permission to manage members, the tab shows a read-only state.

In this mode, the user sees that only owner or admin can invite members, change roles, and remove people.

## Project Transfers

The `Project transfers` tab manages project transfers between workspaces.

It is available only to the current workspace owner.

Transfer does not move the project immediately. First, a request is created, then the target workspace owner accepts or rejects it. The project changes owner only after the request is accepted.

### Create Transfer Request

Form for preparing a transfer request.

### Project

Project to transfer.

The list contains current workspace projects available for transfer.

### Target Workspace

Workspace name that should receive the project.

Knowing the workspace name is not enough to move the project: the request must still be accepted by the target workspace owner.

### Target Project Name

New project name in the target workspace.

If the field is empty or keeps the current value, the project keeps its name. If the project should be transferred with a rename, enter the new project name here.

### Get Plan

Builds a transfer plan before creating the request.

The plan shows what will be affected:

- number of triggers;
- number of templates;
- number of topics;
- number of subscriptions;
- number of aliases to update.

If conflicts are found, the request cannot be created until they are fixed.

### Conflicts

List of problems that prevent transfer.

For example:

- target workspace was not found or cannot accept transfer;
- target workspace already has a project with this name;
- target trigger fullnames conflict with existing triggers;
- aliases are already occupied by other entities.

### Request Transfer

Creates a transfer request from the latest built plan.

If data changed after the plan was built, backend can reject the request and ask to build the plan again.

### Outgoing Requests

Requests sent from the current workspace.

Each request shows:

- source project and target project;
- creation date;
- expiration time;
- status;
- short count of triggers/templates.

Pending request can be canceled with `Cancel`.

### Incoming Requests

Requests received by the current workspace.

Pending request can be accepted with `Accept` or rejected with `Reject`.

After acceptance, backend applies the transfer: changes the project's workspace, updates related fullnames and aliases, and then the request receives a final status.

## Subscription Logs

The `Subscription logs` tab shows alert history for subscriptions of the current workspace.

It is a delivery work log: it helps understand which subscription alerts were sent, blocked, rate limited, or failed.

### Last Entries

Limits the number of log entries.

Available values:

- `50`;
- `100`;
- `250`;
- `500`.

### Auto-Refresh

Enables automatic log refresh.

Available values:

- `Off`;
- `5s`;
- `10s`;
- `30s`.

When auto-refresh is enabled, the date filter is hidden because the log works as a live view of the latest events.

### Before / After

Time filter.

`Before` shows entries before the selected date and time. `After` shows entries after the selected date and time.

### Date and Time

Date and time picker for the `Before` or `After` filter.

In the popover, you can select day, hour, and minute. The `Now` button inserts the current time, and `Clear` clears the filter.

### Refresh

Manual log refresh.

### Time

Column with log entry creation time.

The header button sorts entries by time: newest to oldest or oldest to newest.

### Subscription

Column with the alert route.

It shows project, trigger or template context, plus delivery channels. If the subscription had inputs or filters, a details badge with a short hint can appear nearby.

### Status

Status filter and column.

Available statuses:

- `Delivered`;
- `Failed`;
- `Rate limited`;
- `Blocked`.

### Expanded Log Row

Clicking a row opens details:

- `Reason` - error reason or additional information;
- `Input` - replay/test input, if present;
- `Test run` - subscription test run based on log entry data, if a related subscription is available for this entry.

## Danger Zone

The `Danger zone` tab contains leaving the workspace.

### Leave Workspace

Removes the current user from the workspace.

A confirmation is shown before leaving.

If the user is the only member of the workspace, the workspace is deleted after they leave.

### Last Workspace

If this is the user's only workspace, they cannot leave it.

In this case, the `Leave` button is disabled, and the tab shows `You cannot leave your last workspace`.
