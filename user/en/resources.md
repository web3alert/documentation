# Resources

`Resources` are connected delivery channels and external endpoints that a workspace uses to send alerts.

Put simply, a subscription defines what to subscribe to, and a resource answers the question “where should the result be sent”: to a Telegram chat, Discord channel, Slack channel, or webhook URL.

## What resources are for

A resource stores the connection to a specific channel or endpoint. This allows the same channel to be used in different [subscriptions](subscriptions.md) without entering it again every time.

For example, a workspace can create:

- Telegram resource for the main team chat;
- Discord resource for a monitoring channel;
- Webhook resource for its own backend endpoint;
- Slack resource for a work channel.

After that, when creating a [subscription](subscription-wizard.md), the user simply chooses the needed resource in the `Action` step.

## How resources are linked to actions

`Action` describes the notification delivery method: Telegram message, Discord webhook, Slack webhook, or HTTP webhook.

`Resource` stores the concrete target for this action:

- for Telegram - connected chat;
- for Discord - channel webhook URL;
- for Slack - channel webhook URL;
- for Webhook - your endpoint URL.

In simple subscription creation mode, the interface shows resources as a list of available delivery channels. In advanced mode, an action can ask to select resource as one of its parameters.

## Workspace scope

Resources belong to the current workspace. If you switch workspace, the resource list changes too.

Users with workspace management permissions can manage resources. If the user does not have such permissions, the `Resources` section is unavailable for viewing and editing.

## Resource blueprint

Each resource is created from a blueprint. A blueprint defines resource type, icon, UI title, and fields that need to be filled.

Currently four resource types are available.

### Telegram

Telegram resource sends alerts to a private chat, group, forum topic, or channel.

Only an owner of the Web3alert workspace can start setup or change this
destination. This Web3alert role requirement is separate from the Telegram chat
administrator permissions described below.

It uses a secure external setup session. Open Telegram from the resource form and
choose one of these destinations in the bot:

- the private chat with the bot;
- a group or supergroup;
- a channel;
- `General` or one specific topic in a forum group.

To connect a group, forum, or channel, the user performing setup must be its
owner or an administrator who can add and promote the bot. The Web3alert bot
must also be an administrator. In a channel it needs permission to post
messages; in a group or forum it must be allowed to manage the chat and send
messages.

After selecting a forum, choose `Use General` to deliver alerts to General. To
use another topic, open that topic in Telegram and send `/bindtopic` there.

This confirmation prevents an arbitrary chat id from being saved as a
destination. The setup session expires after 15 minutes.

### Discord

Discord resource is used to send alerts to Discord channel through webhook.

The form contains `URL` of the Discord webhook. It must be created in the settings of the needed Discord channel and pasted into the resource.

### Slack

Slack resource is used to send alerts to Slack channel through Incoming WebHook.

The form contains `URL` of the Slack webhook. It must be created in Slack workspace/channel settings and pasted into the resource.

### Webhook

Webhook resource is used to send alerts to any HTTP endpoint.

The form contains `URL` where Web3alert will send notification payload. This type is useful when alerts need to be passed to your own backend, automation system, or another external service.

## Resource list

The `Resources` section shows resources of the current workspace.

Each resource shows:

### Icon

Resource type icon. It comes from the blueprint.

### Title

Human-readable resource title. It can be used as a short clear channel name, for example `Main Telegram`, `Ops Discord`, or `Backend webhook`.

### State

Text resource status, if present.

For external resources, status helps understand whether connection is complete. For example, Telegram resource may be unavailable for selection in subscription until connection is confirmed.

### Actions

Resource has a management menu. Through it, the resource can be edited or deleted.

## Add resource

`Add resource` opens resource creation form.

### Type

First, select resource type: Telegram, Discord, Slack, or Webhook.

If the form is opened from [Create subscription](subscription-wizard.md), the type list can be limited to resources suitable for the selected action.

### Title

Visible resource title in the interface.

It is better to choose a name by the channel meaning rather than by technical type: for example `Alerts channel`, `DAO ops`, `Main backend webhook`.

### Name

Stable resource slug inside workspace.

Name is part of resource fullname and is used as an internal identifier. Usually it is filled automatically from title, but can be edited before saving.

After resource creation, name can no longer be changed.

### URL

This field appears for Discord, Slack, and Webhook resources.

Paste the webhook URL of the corresponding service into it. For Discord and Slack, URL is validated by the format of the specific platform.

### Configure in Telegram

For Telegram, `Configure in Telegram` is used instead of URL. For an already
configured resource, the same flow is available as `Change destination`.

The service creates a 15-minute setup session and opens the Web3alert bot. The
one-time setup link should not be copied into logs or stored. Finish destination
selection in Telegram, then return to Web3alert; the resource becomes ready when
the bot confirms the selection.

Rebinding is atomic. Existing alerts continue to use the current destination
while setup is pending. The target changes only after successful confirmation;
cancelling, expiry, or a failed setup leaves the old target untouched.

### Add a resource

For Discord, Slack, and Webhook, `Add a resource` immediately creates the resource if all required fields are filled correctly.

## Edit resource

`Edit` opens the form for editing an existing resource.

Title and connection fields can be changed if the resource type supports it. Name remains read-only because it is part of stable fullname.

If the resource is used in subscriptions, changing URL or connection affects all subscriptions that send alerts to this resource. Telegram keeps using the previous destination until the replacement setup completes successfully.

## Delete resource

`Delete` removes resource from workspace.

Before deletion, it is important to check whether the resource is used in active subscriptions. If a delivery channel is deleted, subscriptions that referenced it will no longer be able to send alerts through this resource.
