# Templates

`Templates` son escenarios de suscripción preparados dentro de un proyecto. Ayudan al owner del proyecto a convertir [triggers](triggers.md) técnicos en opciones comprensibles para el usuario: qué se puede seguir exactamente, qué parámetros hay que completar y qué topics se pueden elegir.

Si un trigger responde a “qué evento leer y cómo procesarlo”, un template responde a “cómo puede el usuario suscribirse cómodamente a ese evento”. Un template no reemplaza al trigger. Reúne uno o varios triggers en un subscription flow más claro.

## Para qué sirven los templates

Los templates son necesarios cuando el proyecto debe ser cómodo no solo para el owner de la integración, sino también para los usuarios del marketplace.

Sin template, el usuario selecciona el trigger directamente y trabaja más cerca de la configuración técnica: inputs, filters, defaults y action settings. Esto es normal para escenarios precisos o avanzados.

Con template, el owner del proyecto prepara de antemano un camino más simple:

- agrupa escenarios relacionados en un template;
- define topics claros;
- deja al usuario solo los inputs necesarios;
- conecta topics con triggers y filters;
- puede elegir topics que estarán activados por defecto.

## De qué se compone un template

### Project

Un template siempre pertenece a un [project](projects.md) concreto. Usa triggers de ese proyecto y se muestra en la pestaña `Templates` de la página del proyecto.

### Template metadata

La metadata describe el propio template: título visible, nombre interno y descripción. Estos datos se muestran en la lista de templates y ayudan al usuario a entender qué escenario de suscripción está eligiendo.

### Inputs

Inputs son valores que el usuario rellena al crear una subscription a través de un template.

Por ejemplo, un template puede pedir una dirección, token id, threshold amount u otro parámetro. Después estos valores pueden usarse en rules como condiciones de filtrado. Importante: los inputs son obligatorios si los usa el topic/rule seleccionado.

### Topics

Un topic es una opción separada dentro de un template que el usuario puede activar o desactivar al crear una subscription.

Por ejemplo, un template `Token activity` puede contener los topics `Transfers`, `Mints` y `Burns`. El usuario elige uno o varios topics, y el template ya sabe qué triggers y conditions hay detrás de cada topic.

### Rules

Una rule conecta un topic con un trigger concreto.

Un topic puede usar una rule si está basado en un solo trigger, o varias rules si debe incluir varios eventos similares. En una rule se selecciona el trigger y, si hace falta, se configuran filters.

### Filters

Los filters dentro de una rule limitan qué trigger results encajan con el topic seleccionado.

El valor del filter puede definirse directamente o vincularse a un template input mediante `Use inputs`. En el segundo caso, el usuario rellena el input al crear la subscription, y la rule usa ese valor en la condición.

## Cómo se usan los templates en subscriptions

Cuando el usuario pulsa `Subscribe` en un template, la interfaz abre la [creación de subscription](subscription-wizard.md) con project/template/topic ya seleccionados.

Si el template tiene topics con `Selected by default`, se seleccionarán automáticamente. Si no hay topics así, la interfaz selecciona el primer topic disponible.

El usuario puede:

- elegir topics;
- rellenar los inputs que necesitan las rules seleccionadas;
- configurar actions y notification overrides en el subscription wizard;
- editar más tarde la subscription sin cambiar el template.

## Template vs Trigger

Un trigger se puede usar directamente cuando se necesita control técnico preciso o un escenario único.

Un template es más cómodo cuando el usuario debe recibir una elección preparada: varios topics, inputs claros y rules preconfiguradas sobre triggers.

Ambos enfoques son normales. La elección depende de quién va a crear la subscription y de lo técnico que deba ser el proceso.

## Estados y errores

Si un template tiene un problema con una rule o con un trigger vinculado, en la lista puede aparecer `Needs review`. Ese template debe revisarse y corregirse antes de que los usuarios puedan suscribirse mediante él normalmente.

Motivos frecuentes:

- el trigger fue eliminado o renombrado;
- la rule apunta a un topic inexistente;
- el filter ya no coincide con la schema del trigger;
- el template aún no contiene topics.

## Gestión

En la pestaña `Templates`, el owner del proyecto puede:

- crear un template mediante [Add template](template-wizard.md);
- abrir un template existente para editarlo;
- eliminar uno o varios templates;
- abrir la creación de subscription mediante `Subscribe`, si el template es válido y contiene topics.

El proceso detallado de creación se describe en [Add template / Edit template](template-wizard.md).
