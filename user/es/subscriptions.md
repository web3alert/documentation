# Subscriptions

`Subscriptions` son reglas de usuario para recibir alerts. Una subscription conecta el project elegido, trigger o template, parámetros de usuario, condiciones de filtrado y actions mediante las cuales Web3alert envía notificaciones.

Dicho de forma simple, un project describe la integración disponible, [triggers](triggers.md) y [templates](templates.md) describen a qué se puede suscribir el usuario, y una subscription es la configuración concreta del workspace: qué seguir exactamente, con qué condiciones y adónde enviar el resultado.

## Qué conecta una subscription

### Workspace

Una subscription pertenece al workspace activo. Por eso la lista de subscriptions muestra la configuración del workspace actual, no solo del usuario actual.

Si el usuario cambia de workspace, ve y gestiona otro conjunto de subscriptions.

### Project

Cada subscription está vinculada a un project. El project define la integración de marketplace, triggers disponibles, templates, metadata y access level.

En la página del project, la pestaña [Subscriptions](projects.md#subscriptions) muestra la misma lista de subscriptions que la sección general [Subscriptions](subscriptions.md), pero filtrada por el project concreto.

### Trigger o template

Una subscription puede crearse de dos formas:

- mediante un [template](templates.md), cuando el usuario elige un escenario preparado y topics;
- directamente mediante un [trigger](triggers.md), cuando el usuario necesita una configuración más precisa de evento, inputs y filters.

Un template dentro de una subscription se despliega en rules. Una rule indica qué trigger usar y qué conditions aplicar.

### Inputs y filters

Inputs son valores que el usuario rellena al crear una subscription. Pueden ser necesarios para el trigger directamente o para template rules.

Filters son condiciones adicionales que limitan el flujo de alerts. Por ejemplo, se pueden recibir notificaciones solo por una dirección concreta, token id o importe.

Para template subscriptions, parte de los filters puede estar ya preparada por el owner del project. Entonces el usuario rellena solo inputs comprensibles, y el template los aplica en rules.

### Actions

Actions definen dónde y cómo se entregan las notificaciones.

Normalmente una action está vinculada a un [resource](resources.md): Telegram chat, Discord channel, webhook u otro canal de entrega. Una subscription puede tener una o varias actions.

### Notification overrides

Para algunas actions se puede redefinir el aspecto de la notificación: title, short/long message, icon, cover, avatar y links.

Si no se definen overrides, se usan defaults del trigger/template. Defaults son recomendaciones del creador del trigger, no una regla estricta: el usuario puede conservarlos o sustituirlos para su escenario.

## Cómo funciona una subscription

Cuando source trae un nuevo evento, Web3alert comprueba los triggers del project. Si un trigger forma output, el engine aplica las rules de la subscription: inputs, filters, template conditions y activation logic.

Si el evento encaja con la subscription, Web3alert forma el notification payload y lo entrega a las actions seleccionadas.

Si el evento no pasa las condiciones, la notificación no se envía.

## Estados de subscription

### On

La subscription está activa y puede enviar alerts.

### Off

La subscription fue desactivada por el usuario o creada en estado desactivado. Conserva la configuración, pero no envía alerts.

### Blocked

La subscription está bloqueada por el servicio. Normalmente está relacionado con permisos, límites, disponibilidad de project/trigger/template u otra causa que hay que corregir.

Una subscription bloqueada no debe considerarse eliminada: la configuración permanece, pero el envío de alerts se detiene hasta que se resuelva la causa.

## Lista de subscriptions

En la sección `Subscriptions` se puede:

- buscar subscriptions por address, event o filter;
- activar y desactivar una subscription;
- abrir la edición;
- duplicar una subscription;
- ejecutar un test run;
- compartir un enlace a la configuración;
- eliminar una subscription.

La tabla muestra:

- `Triggers` - trigger/template elegido, topics, inputs y filters;
- `Actions` - canales de entrega;
- `Settings` - estado y acciones de gestión.

## Creación

El proceso detallado de creación se describe en [Create subscription](subscription-wizard.md).
