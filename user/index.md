# Welcome to Web3alert

Web3alert - это сервис для создания и получения Web3-уведомлений.

Он помогает превратить blockchain/runtime события, внешние данные и пользовательские условия в понятные alerts, которые можно отправлять в Telegram, Discord, Slack, webhooks и другие каналы доставки.

## Что можно делать

Пользователь может:

- подписываться на готовые marketplace integrations;
- создавать subscriptions для своего workspace;
- хранить addresses, resources и data sources в одном рабочем контексте;
- получать alerts по выбранным событиям, адресам, контрактам, runtime calls или кастомным условиям.

Владелец проекта или интеграции может:

- создать project;
- описать triggers, которые читают данные из blockchain или timer sources;
- добавить providers, filters, transforms и defaults;
- собрать templates и topics, чтобы другим пользователям было проще подписываться;
- импортировать triggers из ABI, Substrate metadata или других поддерживаемых описаний.

## Основная идея

Web3alert разделяет сервис на несколько сущностей.

`Projects` описывают интеграции. Это может быть blockchain network, protocol, contract, community project или набор кастомных events.

`Triggers` описывают, какие source items читать, как их фильтровать, чем дополнять и какой output получить.

`Templates` превращают triggers в понятные сценарии подписки для пользователей.

`Subscriptions` связывают выбранный trigger/template с workspace, inputs, filters, resources и delivery settings.

`Resources` отвечают за каналы доставки и связанные внешние подключения.

`Data sources` описывают источники данных: blockchain endpoints, runtime metadata, custom source runtime.

`Addresses` помогают хранить и переиспользовать адреса в subscriptions и filters.

## С чего начать

Если вы хотите пользоваться готовыми alerts, начните с [Subscriptions](subscriptions.md) и [Create subscription](subscription-wizard.md).

Если вы хотите создать свою интеграцию, начните с [Projects](projects.md), [Triggers](triggers.md) и [Templates](templates.md).

Если вы подключаете сервис к external tools или AI agents, посмотрите [MCP Server](mcp-server.md) и [API](api.md).
