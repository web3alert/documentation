# Welcome to Web3alert

Web3alert is a service for creating and receiving Web3 notifications.

It turns blockchain/runtime events, external data, and user-defined conditions into clear alerts that can be delivered to Telegram, Discord, Slack, webhooks, and other channels.

## What you can do

As a user, you can:

- subscribe to ready-made marketplace integrations;
- create subscriptions for your workspace;
- keep addresses, resources, and data sources in one working context;
- receive alerts for selected events, addresses, contracts, runtime calls, or custom conditions.

As a project or integration owner, you can:

- create a project;
- describe triggers that read data from blockchain or timer sources;
- add providers, filters, transforms, and defaults;
- build templates and topics so other users can subscribe more easily;
- import triggers from ABI, Substrate metadata, or other supported descriptions.

## Core idea

Web3alert is built around a small set of entities.

`Projects` describe integrations. A project can be a blockchain network, protocol, contract, community project, or a set of custom events.

`Triggers` describe which source items to read, how to filter them, how to enrich them, and what output to produce.

`Templates` turn triggers into understandable subscription scenarios for users.

`Subscriptions` connect a selected trigger/template with a workspace, inputs, filters, resources, and delivery settings.

`Resources` manage delivery channels and related external connections.

`Data sources` describe data origins: blockchain endpoints, runtime metadata, and custom source runtimes.

`Addresses` help store and reuse addresses in subscriptions and filters.

## Where to start

If you want to use ready-made alerts, start with [Subscriptions](subscriptions.md) and [Create subscription](subscription-wizard.md).

If you want to create your own integration, start with [Projects](projects.md), [Triggers](triggers.md), and [Templates](templates.md).

If you connect Web3alert to external tools or AI agents, see [MCP Server](mcp-server.md) and [API](api.md).
