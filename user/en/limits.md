# Limits

`Limits` describes Web3alert restrictions that depend on the account tier or apply as general technical service rules.

Main tiers:

- `Free`;
- `Advanced`;
- `Pro`.

If a table says `Unlimited`, it means there is no explicit numerical limit in the current pricing configuration. Other technical checks, workspace permissions, or entity state can still restrict an action.

## How Limits Are Applied

A tier limit by itself does not grant permission for an action. For most operations, two conditions must match:

- account tier allows the action;
- the user's role in [Workspace](workspaces.md) grants permission to manage the required entity.

For projects and custom data sources, limits are usually counted by owner or billing account of the entity. For subscriptions, the limit is counted by the account that created the subscription.

## Tier Summary

| Capability | Free | Advanced | Pro |
| --- | ---: | ---: | ---: |
| Price | Free | €15.00 / month; 5% discount for 6-month billing; 10% discount for 12-month billing | €50.00 / month; 5% discount for 6-month billing; 10% discount for 12-month billing |
| Create projects | No | Yes | Yes |
| Create workspaces | Unlimited | Unlimited | Unlimited |
| Edit projects | No | Yes | Yes |
| Manage triggers | No | Yes | Yes |
| Manage templates | No | Yes | Yes |
| Manage custom data sources | No | Yes | Yes |
| Test run | No | Yes | Yes |
| MCP server access | No | Yes | Yes |
| Active non-free subscriptions | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Triggers in private project | 0 | 50 | 200 |
| Triggers in public/free project | 0 | Unlimited | Unlimited |
| Provider weight per trigger | 0 | 6 | 20 |
| Runtime rate per subscription | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| Runtime rate per workspace | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
| External API rate | 60/min | 300/min | 900/min |
| Subscriptions logs | No | 7 days / 25,000 records | 30 days / 100,000 records |
| Custom source logs | No | 7 days / 25,000 records | 30 days / 100,000 records |

## Projects

### Create Projects

Project creation is available only to `Advanced` and `Pro`.

`Free` account cannot create new projects.

### Edit Projects

Editing project metadata is available only to paid accounts.

If the project owner becomes `Free`, they cannot edit project metadata. For public projects, they can still delete the project, but cannot manage its settings as before.

### Private Projects

| Tier | Private projects limit |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Private project occupies a slot in the owner account private projects limit.

If the limit is exhausted, you can:

- change an existing private project to public;
- upgrade to a higher tier;
- delete an unused private project.

### Free Projects

Free project is available for subscription to all users without spending the non-free subscriptions limit.

Free access is enabled through project free-access add-on in [Account Billing](account.md#project-free-access-add-on).

If the add-on is not renewed, project becomes public. After that, `Free` users' subscriptions to that project are counted as non-free subscriptions and can be frozen if the `Free` limit is exceeded.

## Subscriptions

### Counted Subscriptions

`Free` account can keep up to 5 active subscriptions to non-free projects.

`Advanced` and `Pro` have no numerical counted subscriptions limit.

| Tier | Active counted subscriptions |
| --- | ---: |
| Free | 5 |
| Advanced | Unlimited |
| Pro | Unlimited |

### Which Subscriptions Are Counted

Subscription is counted if it belongs to a project whose access level is not `Free`.

Counted:

- subscriptions to `Public` projects;
- subscriptions to `Private` projects, if the user has access to the source workspace.

Not counted:

- subscriptions to `Free` projects.

Subscription created through a template counts as one subscription. The number of topics or rules inside the template does not multiply the limit.

### What Happens When the Free Limit Is Exceeded

If a `Free` account tries to enable more than 5 counted subscriptions, extra subscriptions are blocked.

If the user disables one counted subscription, they can enable another one within the limit.

If a project was `Free`, but the free-access add-on ended and the project became `Public`, `Free` users' subscriptions to this project start to count as counted. If the limit is exceeded after that, extra subscriptions are frozen with a reason about the Free tier limit.

### Frozen Private Projects

If a private project owner becomes `Free`, the private project is frozen.

Subscriptions linked to a frozen project are blocked with a reason that trigger/project is frozen. This is a separate blocking reason and does not replace the regular counted subscriptions limit.

### Subscriptions Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Not available | Not available |
| Advanced | 7 days | 25,000 |
| Pro | 30 days | 100,000 |

If subscriptions logs are not available for the tier, backend does not store logs for subscriptions of this workspace owner tier.

In UI, the log can be read in pages of 50, 100, 250, or 500 records.

## API and MCP

### MCP Server Access

MCP server is available only to `Advanced` and `Pro`.

### External API Rate

External API rate applies to account-token API requests that do not come from Web3alert web UI and do not come from Web3alert MCP server.

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

Requests from web UI and MCP server are not limited by this rule.

## Triggers

### Manage Triggers

Creating, importing, and editing triggers is available in projects whose owner has `Advanced` or `Pro` tier.

| Tier | Manage triggers |
| --- | --- |
| Free | No |
| Advanced | Yes |
| Pro | Yes |

### Project Triggers

| Tier | Private project | Public/free project |
| --- | ---: | ---: |
| Free | 0 | 0 |
| Advanced | 50 | Unlimited |
| Pro | 200 | Unlimited |

Private project limits apply only to private projects.

`Free` account cannot manage triggers in its own projects. If such account is added to a paid workspace with a role that grants permission to edit project internals, it can create, import, and edit triggers in that workspace.

For `Advanced` and `Pro`, public/free project currently has no separate numerical trigger limit.

## Templates

### Manage Templates

Creating and editing templates is available in projects whose owner has `Advanced` or `Pro` tier.

| Tier | Manage templates |
| --- | --- |
| Free | No |
| Advanced | Yes |
| Pro | Yes |

`Free` account cannot manage templates in its own projects. If such account is added to a paid workspace with a role that grants permission to edit project internals, it can create and edit templates in that workspace.

Deleting a template requires owner-role in the workspace.

## Data Sources

### Manage Custom Data Sources

Creating and editing custom data sources is available only to paid accounts.

| Tier | Manage custom data sources |
| --- | --- |
| Free | No |
| Advanced | Yes |
| Pro | Yes |

### Private Custom Data Sources

| Tier | Private custom data sources |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

The limit is counted by private custom sources created by the account.

Public/system sources do not occupy private custom source slots.

### Public Custom Source Registration

Public custom sources have a shared anti-spam limit: no more than 5 public registrations per 24 hours.

This limit is not tier-based.

Public source also passes a network uniqueness check. For Substrate sources, the service compares genesis block hash; for EVM sources, chain ID. The same blockchain source cannot be published again as a new public source.

### Endpoints per Custom Source

One custom source can have from 1 to 10 endpoints.

This limit is not tier-based.

### Runtime Settings

Custom source has runtime settings:

| Setting | Default | Maximum |
| --- | ---: | ---: |
| `blockProcessingConcurrency` | 1 | 32 |
| `maxQueuedBlocks` | 10,000 | 100,000 |
| `batchMaxCount` for EVM | 3 | 100 |

Advanced runtime settings can be configured by `Pro`. Other tiers use default values or already saved values.

### Custom Source Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Not available | Not available |
| Advanced | 7 days | 25,000 |
| Pro | 30 days | 100,000 |

In UI, source logs can be read in pages of 50, 100, 250, or 500 records.

When reading custom source logs, backend additionally limits tail read: up to 96 KB and up to 200 lines per tail read.

## Providers

Providers are used in trigger execution to enrich source item with external or state-derived data.

### Provider Weights

Provider weight depends on tier:

| Tier | Provider weight per trigger |
| --- | ---: |
| Free | 0 |
| Advanced | 6 |
| Pro | 20 |

Provider weight is the cost of provider in trigger execution budget. One provider can occupy more than one conditional slot.

Each provider has a weight.

| Provider type | Weight |
| --- | ---: |
| HTTP | 2 |
| GraphQL | 2 |
| RPC endpoint | 2 |
| RPC source transport | 1 |
| State source: Substrate storage | 1 |
| State source: EVM read | 1 |
| Value history | 1 |
| JavaScript | 2 |

If provider explicitly defines `weight`, it must be a positive integer. Values greater than 100 are capped at 100.

### Provider Timeout

Provider timeout is 10 seconds.

This is a general runtime limit. In UI, this parameter is not shown to the user as a regular setting.

### Provider Response Size

Maximum provider response size is 256 KB.

This is a general runtime limit.

### Provider URL Policy

For external endpoint providers, only `https` is allowed.

Local and private-network hosts are forbidden: for example `localhost`, `.local`, private IPv4 ranges, and loopback IPv6.

## Tests

### Test Run Access

| Tier | Test run |
| --- | --- |
| Free | No |
| Advanced | Yes |
| Pro | Yes |

Test run is used to check triggers, providers, and subscriptions.

### Test Rate Limit

| Tier | Rate |
| --- | ---: |
| Free | Not available |
| Advanced | 1 test / second |
| Pro | 5 tests / second |

The limit applies to test endpoints to protect backend and runtime from too frequent runs.

## Alert Delivery

Alert delivery is limited by rate limits so that one account/workspace cannot overload delivery runtime.

### Per-Subscription Notification Rate

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` allows handling a short spike of alerts.

`Sustained rate` is how many alerts are restored into the bucket over time.

`Queue cutoff` is the maximum subscription queue size before delivery starts dropping or rate-limiting events.

### Per-Workspace Notification Rate

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit protects the overall alert flow inside a workspace.

## Project Transfer

Project transfer requests have anti-spam limits.

| Limit | Value |
| --- | ---: |
| Pending request lifetime | 7 days |
| Requests by one account per hour | 5 |
| Requests by one account per day | 20 |
| Requests from one account to the same target workspace per day | 2 |
| Pending transfer requests per project | 1 |

These limits do not depend on tier.
