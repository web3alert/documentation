# Create Subscription

`Create subscription` es el wizard que crea una nueva subscription para el workspace activo. En él, el usuario elige a qué suscribirse, define condiciones y selecciona actions para entregar alerts.

El wizard puede abrirse desde la sección general [Subscriptions](subscriptions.md), desde la página de un [project](projects.md) o mediante el botón `Subscribe` de un [template](templates.md). Si el wizard se abre desde project/template, parte de la selección ya viene rellenada.

## Estructura general del wizard

El wizard consta de dos partes principales:

- `Trigger` - selección de project/template/trigger, topics, inputs y filters;
- `Action` - selección del canal de entrega y configuración de parámetros de action.

Si el wizard se abre desde la sección general `Subscriptions`, primero hay que elegir project. Si el wizard se abre desde la página de project, la selección de project se omite.

## Step 1. Project

Este paso aparece cuando la subscription se crea desde la sección general, sin project elegido previamente.

### Project picker

Permite elegir el project al que suscribirse.

Después de elegir project, el wizard pasa a configurar trigger/template. Si project ya viene en la URL, por ejemplo desde la página de project o template, este paso se omite.

## Step 2. Trigger

En este paso se elige qué exactamente lanzará alerts.

Si el project soporta templates y triggers directos, el wizard muestra la elección del método de creación de subscription.

### Templates

`Templates` son escenarios de suscripción preparados por el owner del project.

Este camino suele ser más simple: el usuario elige template, luego topic y rellena solo los inputs que necesitan los topics seleccionados.

### Events and calls

`Events and calls` es la selección directa de trigger.

Este camino está más cerca de la configuración técnica: el usuario elige trigger category, un trigger concreto y configura inputs/filters si están disponibles.

## Template flow

Template flow se usa si se eligió `Templates` o si el usuario pulsó `Subscribe` en un template.

### Choose a template

Si en el project hay varios templates, el wizard propone elegir el template necesario.

Si solo hay un template, el wizard puede pasar directamente a elegir sus topics.

### Choose a category

Dentro de un template, los topics pueden agruparse por category/template group.

El usuario elige un grupo para ver topics e inputs relacionados.

### Pick the triggers and fill in the required fields

En este paso el usuario elige topics y rellena inputs.

Topics son checkboxes dentro del template. Se puede elegir uno o varios topics.

Inputs pueden ser:

- common - compartidos por varios topics seleccionados;
- unique - relacionados solo con un topic concreto.

Si un topic requiere input, hay que rellenarlo antes de pasar a actions.

## Direct trigger flow

Direct trigger flow se usa si se eligió `Events and calls`.

### Trigger category

Los triggers están agrupados por categorías. En project flow, las categorías normalmente corresponden a grupos de triggers del proyecto.

### Trigger

Trigger concreto que usará la subscription.

Después de elegir trigger, el wizard muestra description si existe y abre los parámetros del trigger.

### Inputs

Inputs son valores obligatorios u opcionales que el trigger espera del usuario.

Por ejemplo, un trigger puede pedir una dirección, un threshold de importe u otro parámetro. Los campos se construyen según la schema del trigger.

### Filters

Filters permiten acotar alerts y no recibir notificaciones innecesarias.

Si no hacen falta filters, se pueden dejar sin añadir. Si se añaden varios filters, pueden combinarse con lógica `AND` y `OR`:

- `AND` - el evento debe pasar todas las condiciones del grupo;
- `OR` - el evento debe pasar al menos un grupo de condiciones.

### Add a filter

Añade una nueva condición.

Para el filter se elige un campo, operador y valor. Los campos disponibles dependen de la trigger schema.

## Step 3. Action

En este paso se elige adónde enviar alerts.

### Simple mode

Simple mode muestra resources disponibles y permite elegir uno o varios canales de entrega.

Es el escenario principal para crear una subscription normal: elegir Telegram, Discord, webhook u otro resource ya conectado al workspace.

### Add new resource

Abre el formulario de creación de resource si todavía no existe el canal necesario.

Los resources se describen con más detalle en [Resources](resources.md).

### Advanced mode

Advanced mode está disponible para direct trigger flow. Permite elegir action type manualmente, rellenar action parameters y, si la action lo soporta, configurar notification overrides.

Para template flow se usa la selección simple de resources, porque el template ya define el escenario de suscripción para el usuario.

### Choose the action type

Selección de una action concreta, por ejemplo envío a Telegram, Discord u otro canal.

### Set parameters

Parámetros de la action seleccionada. Normalmente incluyen resource al que debe enviarse el alert y campos adicionales si la action los requiere.

## Notification overrides

Si la action soporta overrides, se pueden activar campos separados y sustituir defaults de la notificación.

### Title

Título de la notificación.

### Short

Texto corto de la notificación.

### Message

Texto largo de la notificación.

### Icon

URL del icono.

### Cover

URL de la portada.

### Avatar

URL del avatar de la notificación.

### Links

Enlaces en la notificación. Para cada enlace se define title y URL.

Overrides soportan Handlebars/template syntax y Markdown donde la action lo permita. Los valores se renderizan desde trigger output, por eso se pueden usar campos raw/human output y helpers descritos en [Defaults](trigger-wizard.md#handlebars-helpers).

## Test run

En el paso final está disponible `Test run`.

Test run permite comprobar la draft subscription antes de guardarla: rules, filters, inputs y actions seleccionados. En el resultado se puede ver si el evento coincidió con las condiciones y qué actions se habrían ejecutado.

Si test run muestra issues, es mejor corregir la subscription antes de guardarla.

## Save alert

`Save alert` crea o actualiza la subscription.

Después de guardar correctamente, el wizard devuelve al usuario:

- a la sección general [Subscriptions](subscriptions.md), si la subscription se creó desde allí;
- a la pestaña [Subscriptions](projects.md#subscriptions) del project concreto, si el wizard se abrió desde project flow;
- a la página original, si el wizard se abrió con un `returnTo` especial.

## Edit, duplicate y delete

Una subscription ya creada puede abrirse para edición desde la lista [Subscriptions](subscriptions.md).

`Duplicate` abre el wizard con la configuración de la subscription existente, pero guarda el resultado como una nueva subscription.

`Delete` elimina la subscription. Después de eliminarla, ya no se envían alerts por esta subscription.
