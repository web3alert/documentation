# Add Template / Edit Template

`Add template` abre el wizard de creación de template dentro del proyecto. Este wizard ayuda a montar un escenario de suscripción para usuarios sobre [triggers](triggers.md) ya existentes: describir el template, definir inputs, crear topics y conectar cada topic con triggers mediante rules.

La edición de un template existente usa el mismo proceso, pero el formulario se abre con los valores ya guardados.

Antes de crear un template, normalmente conviene preparar los triggers: crearlos manualmente mediante [Add trigger / Edit trigger](trigger-wizard.md) o generarlos mediante [Import triggers](import-triggers.md). Un template no crea triggers por sí mismo. Usa triggers que ya existen en el proyecto.

## Step 1. Metadata

En este paso se definen los datos principales del template. Se muestran al usuario en la pestaña `Templates` del proyecto y ayudan a entender para qué escenario está pensado el template.

### Template title

Título visible del template. Es mejor escribirlo corto y con sentido: por ejemplo `Token transfers`, `Governance events`, `Validator activity`.

### Template name

Slug interno del template dentro del proyecto. Se forma a partir del title, pero puede editarse manualmente.

Name debe ser estable: se usa en URL y en enlaces de topics/rules. Después de publicar un template, es mejor no cambiar name sin necesidad.

### Description

Descripción del template. Aquí conviene explicar qué alerts podrá recibir el usuario mediante este template y cuándo debería elegirlo.

## Step 2. Inputs

En este paso se describen inputs que el usuario rellenará al crear una subscription mediante el template.

Los inputs no siempre hacen falta. Si un topic no requiere parámetros de usuario y todas las rules usan condiciones fijas, el template puede no tener inputs.

Si un input se usa en una rule mediante `Use inputs`, el usuario tendrá que rellenarlo en el subscription wizard.

### Input

Cada input describe un valor disponible para los topics/rules de este template.

### Name

Nombre técnico del input. Se usa en rules como `inputs.<name>`, por eso debe ser corto, estable y claro.

### Type

Tipo de valor que introducirá el usuario.

Tipos disponibles:

- `string` - cadena normal;
- `number` - número;
- `boolean` - true/false;
- `null` - valor vacío;
- `object` - objeto con campos anidados;
- `array` - array de valores del mismo tipo;
- `tuple` - array con un conjunto fijo de elementos;
- `address` - blockchain address;
- `balance` - token/native balance;
- `currency` - valor monetario.

Para la mayoría de template inputs conviene elegir tipos simples. Cuanto más simple sea el input, más claro será para el usuario crear una subscription.

El resto de propiedades del input se configuran mediante el mismo [schema editor](trigger-wizard.md#schema-editor) que se usa en [Add trigger / Edit trigger](trigger-wizard.md). Allí se describen metadata de campos, configuración de address/balance y estructuras anidadas para object, array y tuple.

## Step 3. Topics

En este paso se muestra la lista de topics dentro del template y las acciones para gestionarlos.

Un topic es una opción de suscripción dentro de un template. El usuario puede elegir uno o varios topics al crear una subscription.

### Add topic

Abre el wizard de creación de topic.

Si el template todavía no se ha guardado, la interfaz primero guarda los cambios del template y luego abre la creación de topic.

### Topics table

La tabla muestra los topics del template actual.

Columnas:

- `Topic` - title y name del topic;
- `Description` - descripción del topic;
- `Rules` - primer trigger/rule vinculado y número de rules adicionales;
- `Actions` - acciones edit/delete.

### Edit topic

Abre el topic wizard para el topic seleccionado.

### Delete topic

Elimina el topic y sus rules vinculadas del template. Antes de eliminar se muestra una confirmación.

## Topic wizard

Topic wizard se abre desde Step 3 del template wizard. Se usa tanto para crear como para editar un topic.

## Topic Step 1. Metadata

En este paso se define cómo se verá el topic para el usuario en el subscription wizard.

### Title

Título visible del topic.

Por ejemplo: `Transfers`, `Mints`, `Burns`, `Large deposits`.

### Name

Nombre interno del topic. Se forma a partir del title, pero puede editarse.

Topic name se normaliza en la interfaz: espacios y separadores se convierten en puntos, por ejemplo `Balances transfer` pasa a ser `balances.transfer`. No es el formato global de todos los slugs del servicio, sino el formato actual específicamente para topic keys, porque los topics a menudo parecen namespaces de eventos. El requisito principal es que name sea corto, claro y estable.

### Description

Descripción opcional del topic. Explica qué cambiará si el usuario activa este topic.

### Selected by default

Define si el topic se seleccionará automáticamente al abrir el subscription wizard.

Esto es cómodo para el topic principal o más popular del template. Si se activan demasiados topics por defecto, la subscription puede volverse ruidosa, así que es mejor elegir solo los topics realmente básicos.

## Topic Step 2. Rules

En este paso el topic se conecta con uno o varios triggers.

Una rule dice qué trigger usar y qué condiciones deben cumplirse para que el evento entre en este topic.

### Rule

Una rule conecta el topic con un trigger.

Si el topic debe reaccionar a varios triggers, se pueden añadir varias rules mediante `Add rule`.

### Trigger category

Filtro de la lista de triggers por categoría. Ayuda a encontrar más rápido el trigger necesario en un proyecto grande.

### Trigger

Trigger concreto que usará la rule.

Después de seleccionar trigger, el wizard carga desde trigger schema los campos disponibles para filters.

### Filters

Condiciones opcionales de la rule.

Si no se definen filters, la rule usa todos los eventos del trigger seleccionado. Si se definen filters, el evento entra en el topic solo cuando se cumplen las condiciones.

### Add a filter

Añade una condición de filtrado.

En un filter se selecciona un campo de trigger output o filters schema, un operador y un valor.

### Select filter

Campo del trigger por el que se debe filtrar el evento.

Para campos object, se puede entrar dentro de la estructura y seleccionar un campo anidado.

### Operator

Operador de comparación.

Opciones disponibles:

- equals;
- not equal;
- greater than;
- greater or equal;
- less than;
- less or equal.

Para condiciones numéricas, la UI muestra interruptores compactos de operadores.

### Value

Valor con el que se compara el campo seleccionado.

Value puede definirse de dos maneras:

- literal value - valor fijo directamente en la rule;
- template input - valor desde inputs que el usuario rellena al crear la subscription.

### Use inputs

Cambia el filter de valor fijo a valor desde template inputs.

Por ejemplo, un template puede tener input `wallet`. Entonces una rule puede filtrar el campo `from` o `to` por `{{ inputs.wallet }}`. El usuario introduce la dirección una vez en el subscription wizard, y la topic rule la usa como condición.

### AND / OR logic

Varios filters dentro de un grupo funcionan como `AND`: el evento debe pasar todas las condiciones del grupo.

Si se separan condiciones con `OR`, el wizard crea varios grupos: el evento debe pasar al menos uno de ellos.

### Remove all filters

Elimina todos los filters de la rule. Después, la rule vuelve a aceptar todos los eventos del trigger seleccionado.

### Add rule

Añade otra rule al topic.

Esto es necesario si un topic debe combinar varios triggers. Por ejemplo, el topic `Token activity` puede incluir rules separadas para transfer, mint y burn events.

## Save

`Save template` guarda metadata, inputs, topics y rules.

`Save topic` guarda el topic y devuelve al usuario al template flow.

Después de guardar, el template aparece en la pestaña [Templates](projects.md#templates) del proyecto. Si el template contiene al menos un topic y no tiene issues, los usuarios podrán abrir `Subscribe` y [crear una subscription](subscription-wizard.md) mediante este template.
