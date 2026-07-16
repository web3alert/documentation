# Resources

`Resources` son canales de entrega conectados y endpoints externos que el workspace usa para enviar alerts.

Dicho de forma simple, una subscription define a qué suscribirse, y resource responde a la pregunta “adónde enviar el resultado”: a un Telegram chat, Discord channel, Slack channel o webhook URL.

## Para qué sirven los resources

Resource guarda la conexión con un canal o endpoint concreto. Gracias a esto, el mismo canal se puede usar en distintas [subscriptions](subscriptions.md) sin introducirlo de nuevo cada vez.

Por ejemplo, un workspace puede crear:

- Telegram resource para el chat principal del equipo;
- Discord resource para el canal de monitorización;
- Webhook resource para su propio backend endpoint;
- Slack resource para un canal de trabajo.

Después, al crear una [subscription](subscription-wizard.md), el usuario simplemente elige el resource necesario en el paso `Action`.

## Cómo se relacionan resources y actions

`Action` describe el método de envío de la notificación: Telegram message, Discord webhook, Slack webhook o HTTP webhook.

`Resource` guarda el destino concreto para esa action:

- para Telegram - chat conectado;
- para Discord - webhook URL del canal;
- para Slack - webhook URL del canal;
- para Webhook - URL de tu endpoint.

En el modo simple de creación de subscription, la interfaz muestra resources como lista de canales de entrega disponibles. En advanced mode, una action puede pedir elegir resource como uno de sus parámetros.

## Workspace scope

Resources pertenecen al workspace actual. Si se cambia de workspace, la lista de resources también cambia.

Los usuarios con permisos de gestión de workspace pueden gestionar resources. Si el usuario no tiene esos permisos, la sección `Resources` no está disponible para ver ni editar.

## Resource blueprint

Cada resource se crea a partir de un blueprint. Blueprint define el tipo de resource, icono, nombre en la UI y campos que hay que rellenar.

Actualmente hay cuatro tipos de resources disponibles.

### Telegram

Telegram resource envía alerts a un chat privado, group, topic de un forum o channel.

Solo un owner del workspace de Web3alert puede iniciar el setup o cambiar este
destino. Este requisito de role en Web3alert es independiente de los permisos de
administrator del chat de Telegram descritos a continuación.

Usa una external setup session segura. Abre Telegram desde el formulario del
resource y elige en el bot uno de estos destinos:

- el chat privado con el bot;
- un group o supergroup;
- un channel;
- `General` o un topic concreto de un forum group.

Para conectar un group, forum o channel, el usuario que realiza el setup debe
ser owner o administrator con permiso para añadir y promover al bot. El bot de
Web3alert también debe ser administrator. En un channel necesita permiso para
publicar mensajes; en un group o forum debe poder gestionar el chat y enviar
mensajes.

Después de elegir un forum, selecciona `Use General` para enviar alerts a
General. Para usar otro topic, ábrelo en Telegram y envía `/bindtopic` dentro de
ese topic.

Esta confirmación impide guardar un chat id arbitrario como destino. La setup
session caduca a los 15 minutos.

### Discord

Discord resource se usa para enviar alerts a Discord channel mediante webhook.

En el formulario se indica `URL` del Discord webhook. Debe crearse en los ajustes del canal Discord necesario y pegarse en el resource.

### Slack

Slack resource se usa para enviar alerts a Slack channel mediante Incoming WebHook.

En el formulario se indica `URL` del Slack webhook. Debe crearse en los ajustes del Slack workspace/channel y pegarse en el resource.

### Webhook

Webhook resource se usa para enviar alerts a cualquier HTTP endpoint.

En el formulario se indica `URL` a la que Web3alert enviará notification payload. Este tipo es útil si alerts deben pasarse a un backend propio, automation system u otro servicio externo.

## Lista de resources

En la sección `Resources` se muestran resources del workspace actual.

Para cada resource se muestra:

### Icon

Icono del tipo de resource. Viene del blueprint.

### Title

Nombre legible del resource. Puede usarse como nombre corto y claro del canal, por ejemplo `Main Telegram`, `Ops Discord` o `Backend webhook`.

### State

Estado textual del resource, si existe.

Para external resources, el estado ayuda a entender si la conexión está completa. Por ejemplo, Telegram resource puede no estar disponible para selección en subscription hasta que se confirme la conexión.

### Actions

Resource tiene un menú de gestión. Desde él se puede abrir edición o eliminar resource.

## Add resource

`Add resource` abre el formulario de creación de resource.

### Type

Primero se elige el tipo de resource: Telegram, Discord, Slack o Webhook.

Si el formulario se abre desde [Create subscription](subscription-wizard.md), la lista de tipos puede limitarse a resources adecuados para la action seleccionada.

### Title

Nombre visible del resource en la interfaz.

Es mejor elegir un nombre por el sentido del canal, no por el tipo técnico: por ejemplo `Alerts channel`, `DAO ops`, `Main backend webhook`.

### Name

Slug estable del resource dentro del workspace.

Name entra en el fullname del resource y se usa como identificador interno. Normalmente se rellena automáticamente desde title, pero puede editarse antes de guardar.

Después de crear resource, name ya no se puede cambiar.

### URL

Este campo aparece para resources Discord, Slack y Webhook.

Aquí se pega el webhook URL del servicio correspondiente. Para Discord y Slack, URL se valida según el formato de la plataforma concreta.

### Configure in Telegram

Para Telegram se usa `Configure in Telegram` en lugar de URL. En un resource ya
configurado, el mismo flow aparece como `Change destination`.

El servicio crea una setup session de 15 minutos y abre el bot de Web3alert. El
enlace de setup de un solo uso no debe guardarse ni incluirse en logs. Termina de
elegir el destino en Telegram y vuelve a Web3alert; el resource queda ready
cuando el bot confirma la selección.

El rebind es atómico. Mientras el setup está pendiente, los alerts existentes
siguen usando el destino actual. El target cambia solo después de una
confirmación correcta; cancelar, dejar caducar la session o un error conservan
el target anterior.

### Add a resource

Para Discord, Slack y Webhook, el botón `Add a resource` crea resource inmediatamente si todos los campos obligatorios están rellenados correctamente.

## Edit resource

`Edit` abre el formulario de edición de un resource existente.

Se pueden cambiar title y campos de conexión si el tipo de resource lo permite. Name permanece read-only porque forma parte del fullname estable.

Si resource se usa en subscriptions, cambiar URL o conexión afectará a todas las subscriptions que envían alerts a este resource. Telegram mantiene el destino anterior hasta que el nuevo setup termina correctamente.

## Delete resource

`Delete` elimina resource del workspace.

Antes de eliminarlo, es importante comprobar si resource se usa en subscriptions activas. Si se elimina un canal de entrega, las subscriptions que hacían referencia a él ya no podrán enviar alerts mediante este resource.
