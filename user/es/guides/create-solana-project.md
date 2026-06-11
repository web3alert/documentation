# Crear un proyecto de Solana

Esta guía muestra cómo crear en Web3alert un proyecto para Solana y añadir los primeros triggers.

En el ejemplo creamos un proyecto `Solana`, seleccionamos un data source de Solana existente e importamos triggers desde el IDL de un programa. El resultado es un proyecto al que los usuarios pueden suscribirse para recibir notificaciones sobre eventos e instrucciones del programa de Solana elegido.

## Qué necesitas

Antes de empezar, prepara:

- un Solana data source en ejecución; la lista está disponible en `Data sources` (consulta [Data sources](../data-sources.md)); si todavía no existe una fuente adecuada, puedes crearla desde el asistente de importación con `Add new source`;
- `Program ID`: la clave pública del programa de Solana que quieres monitorizar;
- el IDL del programa: una descripción JSON de sus eventos e instrucciones; en muchos casos Web3alert puede cargarlo automáticamente a partir del `Program ID`.

## Paso 1. Crea el proyecto

Abre `Projects` en la barra lateral izquierda y haz clic en `Create New Project`.

Rellena los campos principales:

| Campo | Valor |
| --- | --- |
| `Title` | `Solana` |
| `Name` | `solana` |
| `Access level` | `Private` durante la preparación, `Public` para publicarlo en el marketplace |

Ten en cuenta:

- `Name` se genera automáticamente a partir de `Title`, pero puedes ajustarlo manualmente. Después de crear el proyecto ya no se puede cambiar.
- El nivel `Free` (suscripciones gratis para todos los usuarios) está disponible después de activar el project add-on en `Billing`. Para empezar, usa `Private`.

Activa `Short description` y añade una descripción breve, por ejemplo:

```text
Solana mainnet notifications for program instructions, events, and account activity.
```

Activa `Description` y añade una descripción del proyecto en markdown, por ejemplo:

```markdown
Solana is a high-performance Layer 1 blockchain for applications that need fast finality and low transaction costs.

This Web3alert project collects Solana program activity from an existing Solana data source. Use it to build alerts for program instructions, decoded program events, and account reads based on Solana IDL.
```

Activa `Tags` y añade etiquetas (escribe cada etiqueta y pulsa Enter):

```text
solana
layer-1
smart-contracts
```

Opcionalmente:

- `Links`: sitio oficial de Solana, documentación, explorer o página del programa que vas a monitorizar;
- `Icon` y `Cover`: logotipo y portada del proyecto, subidos como archivo o indicados mediante URL.

Haz clic en `Create project`. Después de crearlo, llegarás a la página del proyecto con las pestañas `Overview`, `Triggers` y `Templates`.

Consulta más detalles sobre los campos del proyecto en [Projects](../projects.md).

![Project creation form](/guides/solana-project/01-project-create.png)

![Project overview](/guides/solana-project/02-project-overview.png)

## Paso 2. Abre la importación de triggers

En la página del proyecto, abre la pestaña `Triggers`.

Si el proyecto aún no tiene triggers, la pestaña muestra dos acciones: `Add trigger` para crear un trigger manualmente y `Import triggers` para una importación masiva. Haz clic en `Import triggers`.

La importación es la forma más rápida de crear varios triggers de Solana desde el IDL de un programa. Usa la creación manual con el [trigger wizard](../trigger-wizard.md) más adelante, cuando necesites un trigger muy específico con ajustes propios.

![Empty triggers tab](/guides/solana-project/03-project-triggers-empty.png)

## Paso 3. Selecciona el source de Solana

El asistente de importación tiene tres pasos: `Source`, `Generate` y `Review & import`. El progreso se muestra en la cabecera del asistente.

En el paso `Source`, selecciona tu source de Solana en el campo `Source network`. La lista muestra solo data sources en ejecución, cada uno con el tipo de red indicado; busca la marca `Solana`.

Si no hay un source adecuado, selecciona `Add new source`: el asistente te llevará a crear el data source y volverá al flujo de importación al terminar.

Haz clic en `Next step`.

![Solana source selected in import wizard](/guides/solana-project/04-import-source.png)

## Paso 4. Indica el programa y carga el IDL

En el paso `Generate`, rellena:

| Campo | Descripción |
| --- | --- |
| `Category` | Grupo comprensible para los futuros triggers, por ejemplo `Program activity`, `Governance` o `Transfers`. La categoría se usará en los nombres e identificadores de los triggers. |
| `Program ID` | Clave pública del programa de Solana que quieres monitorizar. |
| `IDL` | JSON con el IDL del programa. |

Lo más sencillo es pulsar `Load IDL from program address`: Web3alert intentará encontrar el IDL publicado por `Program ID`, primero en el Anchor IDL account y luego en Program Metadata. Si la carga funciona, el campo `IDL` se rellenará automáticamente.

Si la carga automática no funciona, pega el IDL JSON manualmente, por ejemplo desde el repositorio o la documentación del proyecto. Sin IDL la importación no es posible: Web3alert lo usa para entender qué eventos e instrucciones tiene el programa y cómo decodificarlos en notificaciones legibles.

Haz clic en `Generate triggers from IDL`. Si dejas el campo `IDL` vacío, Web3alert intentará cargarlo por `Program ID` antes de generar.

Web3alert generará borradores de triggers para todos los eventos (events) e instrucciones (calls) del IDL. Podrás desactivar los que no necesites en el siguiente paso.

![Solana IDL generation step](/guides/solana-project/05-import-solana-idl.png)

## Paso 5. Revisa e importa los triggers

El paso `Review & import` muestra una tabla con los borradores generados. Encima de la tabla aparece un contador de selección, por ejemplo `5/12 selected`.

Para cada trigger, la tabla muestra:

- checkbox de selección (el checkbox de la cabecera selecciona o deselecciona todos);
- `Trigger`: nombre e identificador del trigger;
- `Type`: `event` (evento del programa) o `call` (instrucción del programa);
- `Description`: descripción del IDL, si los desarrolladores del programa la añadieron.

Deja seleccionados solo los triggers que realmente necesiten tus suscriptores. Es normal empezar con un conjunto pequeño y añadir más después; puedes ejecutar la importación de nuevo.

Haz clic en `Create selected triggers`.

Después de importar, el asistente te devolverá a la página del proyecto. Abre la pestaña `Triggers` para ver los triggers creados.

![Generated Solana trigger review](/guides/solana-project/06-import-review.png)

## Paso 6. Prueba y ajusta los triggers

Los triggers generados funcionan, pero todavía son borradores: los nombres y textos de notificación vienen directamente del IDL. Antes de publicar, abre cada trigger importante en el [trigger wizard](../trigger-wizard.md) y revisa:

- nombre y descripción: si son claros para alguien que no conoce los detalles internos del programa;
- source seleccionado y `Program ID`;
- evento o instrucción que activa el trigger;
- filters: si conviene limitar los disparos, por ejemplo por una cuenta o valor concreto;
- texto de notificación (human output): qué verá exactamente el suscriptor.

Para proyectos publicados en el marketplace, el texto de la notificación es lo más importante. Un trigger generado puede ser técnicamente correcto pero mostrar una estructura demasiado difícil de leer. Una buena notificación oculta la parte técnica y muestra solo los valores importantes: importes, direcciones y nombres.

![Imported Solana trigger source settings](/guides/solana-project/07-trigger-edit.png)

## Paso 7. Añade templates

Los triggers son bloques técnicos. Los templates los convierten en escenarios de suscripción listos para usuarios.

Abre la pestaña `Templates` y crea uno o varios templates para los principales casos de uso. Por ejemplo:

- `Program activity`;
- `Account updates`;
- `Governance events`;
- `Token activity`.

Cada template debe tener un nombre claro y valores predeterminados útiles para que el usuario pueda suscribirse sin conocer la estructura interna de los triggers. Consulta [Templates](../templates.md) y [Template wizard](../template-wizard.md).

![Solana template creation form](/guides/solana-project/08-template-create.png)

## Checklist final

Antes de publicar el proyecto, comprueba:

- el source de Solana seleccionado está en ejecución y funciona de forma estable;
- los triggers importados se probaron con datos reales del programa;
- los textos de notificación son breves y comprensibles para el suscriptor;
- los triggers innecesarios están desactivados o eliminados;
- los templates cubren los principales escenarios de suscripción;
- la metadata del proyecto contiene descripción, etiquetas y enlaces útiles;
- el access level está elegido de forma intencional.

Cambia el proyecto a `Public` solo cuando triggers y templates estén listos. Si el proyecto debe ser gratis para todos los usuarios, activa el project add-on en `Billing` y establece el access level `Free` (es un servicio de pago).
