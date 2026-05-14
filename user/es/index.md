# Bienvenido a Web3alert

Web3alert es un servicio para crear y recibir notificaciones Web3.

Convierte eventos de blockchain/runtime, datos externos y condiciones definidas por el usuario en alertas claras que se pueden enviar a Telegram, Discord, Slack, webhooks y otros canales.

## Qué puedes hacer

Como usuario, puedes:

- suscribirte a integraciones listas del marketplace;
- crear subscriptions para tu workspace;
- guardar addresses, resources y data sources en un mismo contexto de trabajo;
- recibir alerts sobre eventos, direcciones, contratos, runtime calls o condiciones personalizadas.

Como propietario de un proyecto o integración, puedes:

- crear un project;
- describir triggers que leen datos desde blockchain o timer sources;
- añadir providers, filters, transforms y defaults;
- crear templates y topics para que otros usuarios puedan suscribirse más fácilmente;
- importar triggers desde ABI, Substrate metadata u otras descripciones compatibles.

## Idea principal

Web3alert se organiza alrededor de varias entidades.

`Projects` describen integraciones. Un proyecto puede ser una red blockchain, un protocolo, un contrato, un proyecto de comunidad o un conjunto de eventos personalizados.

`Triggers` describen qué source items leer, cómo filtrarlos, cómo enriquecerlos y qué output producir.

`Templates` convierten triggers en escenarios de suscripción claros para los usuarios.

`Subscriptions` conectan un trigger/template seleccionado con un workspace, inputs, filters, resources y delivery settings.

`Resources` gestionan canales de entrega y conexiones externas relacionadas.

`Data sources` describen los orígenes de datos: blockchain endpoints, runtime metadata y custom source runtime.

`Addresses` ayudan a guardar y reutilizar direcciones en subscriptions y filters.

## Por dónde empezar

Si quieres usar alerts ya preparados, empieza por [Subscriptions](subscriptions.md) y [Create subscription](subscription-wizard.md).

Si quieres crear tu propia integración, empieza por [Projects](projects.md), [Triggers](triggers.md) y [Templates](templates.md).

Si conectas Web3alert con herramientas externas o AI agents, consulta [MCP Server](mcp-server.md) y [API](api.md).
