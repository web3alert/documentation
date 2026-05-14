# Projects

`Projects` is a catalog of blockchain networks, protocols, and dApp integrations from which Web3alert can collect events and for which users can create subscriptions.

In the Next version, `Project` is no longer just a "network in a list". It is a container for the full public and technical integration configuration:

- project metadata: title, description, tags, icons, cover, and external links;
- [Triggers](triggers.md): technical rules that describe which events to read from data source, how to filter them, how to enrich them, and what output to transform them into;
- [Templates](templates.md): user-facing subscription scenarios on top of triggers, grouped into understandable topics;
- [Subscriptions](subscriptions.md): workspace subscriptions created from the project;
- links to [Data sources](data-sources.md): blockchain data sources from which triggers receive events, blocks, calls, or runtime metadata.

A regular user most often opens `Projects` to find the needed network or protocol and create a subscription. An administrator or project owner uses this section to configure the whole integration surface.

## Project List

The `Projects` page shows the catalog of available projects.

### Search

The search field filters projects by several attributes:

- visible project title;
- project `fullname`;
- internal `id`;
- workspace or author;
- tags.

Search is useful both for user scenarios ("find Polkadot Asset Hub") and admin scenarios ("find project by slug/fullname").

### Only This Workspace

The `Only this workspace` switch leaves only projects of the current workspace in the list.

This matters when an account has access to multiple spaces: for example, the public marketplace can show many projects, while the workspace filter lets you see only your own private or working integrations.

### Tag Filter

Available tags are shown below the search row. A selected tag leaves only projects with this tag in the catalog.

The `Clear filters` button resets search, workspace filter, and selected tags.

### Project Card

Each project card shows:

- project icon;
- title;
- service row with creation or update date;
- author or workspace;
- short description;
- number of triggers;
- number of your subscriptions to this project;
- up to four tags;
- `Open` button;
- `Edit` button, if the current user can edit the project.

If nothing is found with the current filters, the catalog shows an empty state with a suggestion to reset filters. If there are no projects at all, the catalog empty state is shown.

### Create New Project

Project creation is available to users on `Advanced` tier and above.

Each tier has its own limit for the number of private projects. While the limit is not exhausted, a new project is created as private by default: it can be configured calmly, triggers can be tested, and templates can be prepared before publication.

If the private project limit is exhausted, there are two options: upgrade the tier or make one of the existing private projects public. A public project no longer occupies a private project limit slot, so after publication a slot is freed for a new private project.

A project can have one of three access levels:

- `Private` - working mode for preparation and closed integrations. The project is visible only to those who have access to its workspace/account. Such project occupies a private project limit slot.
- `Public` - published marketplace project. Other users can find and open it, while the owner continues managing triggers, templates, and metadata. A public project does not occupy a private project limit slot.
- `Free` - public project whose subscriptions are free for all Web3alert users. This level is usually needed by projects and teams that want to pay for notification access for their community. The Web3alert team can also periodically publish important or interesting projects as `Free` for the whole service audience.

## Creating and Editing a Project

The create/edit form manages project metadata. It does not create triggers and templates themselves, but defines how the project appears in the catalog and on the project page.

After a new project is created successfully, the interface opens the project page with the entered metadata. The owner then chooses the next step: [import triggers](import-triggers.md), [create a trigger manually](trigger-wizard.md), prepare [templates](#templates), or use an AI agent to configure the project.

### Permissions and Read-Only Mode

If the user can manage triggers and templates, but is not the metadata owner, the form shows `Metadata is read-only`.

In this mode, the user can continue working with the technical part of the project if permissions allow it, but cannot change title, description, images, tags, or other metadata fields.

### Title

`Title` is the required visible project title.

Limit: up to 32 characters.

Until the `Name` field has been changed manually, `Title` is automatically used to generate `Name`.

### Name

`Name` is the required project slug.

During creation, it is formed from title:

- converted to lowercase;
- spaces are replaced with `-`;
- repeated hyphens are collapsed;
- hyphens at the beginning and end are removed.

When editing an existing project, `Name` is locked because it participates in identifiers and links.

### Access Level

`Access level` is selected when creating or editing a project and determines who will see the project in marketplace.

For most project owners, the basic path is: first the project is created as `Private`, then moved to `Public` when ready. `Free` mode means the project remains public, but subscription access is free for users. Usually this is a paid service for a project team that wants to provide free notifications to its community.

### Short Description

`Short description` is a short description for cards and compact interface areas.

The field is optional. Limit: up to 256 characters.

### Description

`Description` is the full markdown project description for the `Overview` tab.

The field is optional. Limit: up to 4096 characters.

The editor has a floating toolbar for selected text:

- `Bold`;
- `Italic`;
- `Link`;
- `Heading`;
- `Code`.

### Tags

`Tags` help search and filter projects.

To add a tag, enter it in the `Add tag and press Enter` field and press `Enter` or the add button.

Tag rules:

- only lowercase Latin letters, numbers, and hyphens;
- spaces are normalized to hyphens;
- maximum length of one tag is 20 characters;
- duplicates are not added.

### Links

`Links` are project external links.

Each link consists of:

- `Title`;
- `URL`;
- row delete button.

The `+ Add link` button adds a new row. On save, only links where both title and URL are filled are used.

On the project page, these links are shown in the `Useful links` block.

### Icon and Cover

These fields allow setting separate URLs for project visual elements:

- `Icon` - compact project icon. It is used in the catalog, on the project page, in wizards, and as the default value for notification avatar;
- `Cover` - wide cover for the project page.

For each field, you can choose how to fill it:

- `URL` - manually paste an image link;
- `Upload` - upload a file through Web3alert.

In `Upload` mode, the file is selected separately for each field. If a new `Icon` or `Cover` is uploaded, it replaces the previous image of the same type after the project is saved.

Upload limits:

- formats: `jpg`, `jpeg`, `png`, `webp`;
- maximum file size: 5 MB.

If a file is selected but the user leaves the page without saving the project, the upload is not applied to the project.

### Delete Project

When editing an existing project, the owner can delete the project through delete action. A confirmation dialog is shown before deletion.

Project deletion is dangerous: the project is linked to triggers, templates, and subscriptions, so it should be used only when the project is really no longer needed.

## Quick Actions

The set of quick actions depends on the tab and user permissions:

- on `Overview`: `Edit metadata`, if the user can edit metadata;
- on [Subscriptions](subscriptions.md): [Create subscription](subscription-wizard.md), if the user can manage subscriptions of the current workspace;
- on [Triggers](triggers.md): [Import triggers](import-triggers.md) and [Add trigger](trigger-wizard.md), if the user can edit the project;
- on [Templates](templates.md): [Add template](template-wizard.md), if the user can edit the project; [Subscribe](subscription-wizard.md) is available for valid templates with topics.

## Overview

The `Overview` tab shows the user-facing project description.

Main blocks:

- `About` - full markdown description from metadata;
- `Project details` - number of triggers, number of your subscriptions, project id, creation date, and update date;
- `Tags` - project tags;
- `Useful links` - useful project external links.

If a resource URL starts with `http://`, `https://`, `mailto:`, or `tel:`, the link is used as is. Otherwise, the interface adds `https://`.

## Subscriptions

The `Subscriptions` tab shows subscriptions of the active workspace linked to this project.

This is the same subscription set available in the main [Subscriptions](subscriptions.md) section, but here it is already filtered by the current project.

It is available only when the current user can manage the active workspace. If there are no subscriptions, an empty state with a suggestion to create a subscription is shown.

## Triggers

The `Triggers` tab shows the project triggers table.

In view mode, trigger details can be opened. In edit mode, the owner can:

- select one or more triggers;
- delete selected triggers;
- open editing for a specific trigger;
- create a new trigger through [Add trigger](trigger-wizard.md);
- generate triggers in bulk through [Import triggers](import-triggers.md).

## Templates

The `Templates` tab shows project templates.

Template is a user-facing wrapper over triggers: it groups inputs, topics, and rules so the user can create a subscription without knowing the internal trigger configuration. Templates are described in more detail in [Templates](templates.md).

The templates list shows:

- title;
- key/id;
- description;
- number of topics;
- `Needs review` warning, if template has an issue;
- `Edit` and `Delete` actions, if the user can edit;
- `Subscribe`, if template is valid and contains topics.

When `Subscribe` is clicked, the interface opens [subscription creation](subscription-wizard.md) with the selected project/template/topic. If the template has `selectedByDefault` topics, they are selected automatically; otherwise the first available topic is used.
