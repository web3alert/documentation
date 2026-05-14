# Projects

`Projects` es el catálogo de redes blockchain, protocolos e integraciones dApp desde los que Web3alert puede recoger eventos y para los que los usuarios pueden crear suscripciones.

En la versión Next, `Project` ya no es simplemente una "red en una lista". Es un contenedor para toda la configuración pública y técnica de la integración:

- project metadata: título, descripción, tags, icons, cover y links externos;
- [Triggers](triggers.md): reglas técnicas que describen qué eventos leer de data source, cómo filtrarlos, con qué enriquecerlos y a qué output transformarlos;
- [Templates](templates.md): escenarios de suscripción para usuarios sobre triggers, agrupados en topics comprensibles;
- [Subscriptions](subscriptions.md): subscriptions del workspace creadas a partir del proyecto;
- vínculos con [Data sources](data-sources.md): fuentes de datos blockchain de las que triggers reciben eventos, bloques, calls o runtime metadata.

Un usuario normal suele abrir `Projects` para encontrar la red o protocolo necesario y crear una subscription. Un administrador u owner del proyecto usa esta sección para configurar toda la superficie de la integración.

## Lista de proyectos

La página `Projects` muestra el catálogo de proyectos disponibles.

### Search

El campo de búsqueda filtra proyectos por varios atributos:

- título visible del proyecto;
- `fullname` del proyecto;
- `id` interno;
- workspace o author;
- tags.

La búsqueda es útil tanto para un escenario de usuario ("encontrar Polkadot Asset Hub") como para uno administrativo ("encontrar proyecto por slug/fullname").

### Only This Workspace

El switch `Only this workspace` deja en la lista solo proyectos del workspace actual.

Esto es importante si el account tiene acceso a varios espacios: por ejemplo, el marketplace público puede mostrar muchos proyectos, mientras que el filtro de workspace permite ver solo integraciones propias privadas o de trabajo.

### Filtro por tags

Debajo de la fila de búsqueda se muestran los tags disponibles. Un tag seleccionado deja en el catálogo solo proyectos con ese tag.

El botón `Clear filters` reinicia la búsqueda, el filtro de workspace y los tags seleccionados.

### Project Card

Cada tarjeta de proyecto muestra:

- icon del proyecto;
- título;
- línea de servicio con fecha de creación o actualización;
- author o workspace;
- descripción corta;
- número de triggers;
- número de tus subscriptions a este proyecto;
- hasta cuatro tags;
- botón `Open`;
- botón `Edit`, si el usuario actual puede editar el proyecto.

Si con los filtros actuales no se encuentra nada, el catálogo muestra un estado vacío con una sugerencia para resetear filtros. Si no hay proyectos en absoluto, se muestra el estado vacío del catálogo.

### Create New Project

La creación de proyectos está disponible para usuarios en tier `Advanced` o superior.

Cada tier tiene su propio límite de private projects. Mientras el límite no esté agotado, un nuevo proyecto se crea como private por defecto: se puede configurar con calma, probar triggers y preparar templates antes de publicarlo.

Si el límite de private projects se agotó, hay dos opciones: upgrade del tier o hacer público uno de los private projects existentes. Un public project ya no ocupa slot del límite de private projects, así que después de publicarlo se libera un slot para un nuevo private project.

Un proyecto puede tener uno de tres access levels:

- `Private` - modo de trabajo para preparación e integraciones cerradas. El proyecto solo es visible para quienes tienen acceso a su workspace/account. Este proyecto ocupa un slot del límite de private projects.
- `Public` - proyecto marketplace publicado. Otros usuarios pueden encontrarlo y abrirlo, mientras el owner sigue gestionando triggers, templates y metadata. Un public project no ocupa slot del límite de private projects.
- `Free` - public project cuyas subscriptions están disponibles gratis para todos los usuarios de Web3alert. Este nivel suele ser necesario para proyectos y equipos que quieren pagar el acceso a notificaciones para su community. El equipo de Web3alert también puede publicar periódicamente en `Free` proyectos importantes o interesantes para toda la audiencia del servicio.

## Crear y editar un proyecto

El formulario de creación y edición gestiona project metadata. No crea los propios triggers y templates, pero define cómo se verá el proyecto en el catálogo y en la página del proyecto.

Después de crear correctamente un nuevo proyecto, la interfaz abre la página del proyecto con los metadata introducidos. Luego el owner elige el siguiente paso: [importar triggers](import-triggers.md), [crear un trigger manualmente](trigger-wizard.md), preparar [templates](#templates) o usar un AI agent para configurar el proyecto.

### Permisos y modo read-only

Si el usuario puede gestionar triggers y templates, pero no es owner de metadata, el formulario muestra `Metadata is read-only`.

En este modo se puede seguir trabajando con la parte técnica del proyecto, si los permisos lo permiten, pero no se pueden cambiar title, description, imágenes, tags ni otros campos de metadata.

### Title

`Title` es el título visible obligatorio del proyecto.

Límite: hasta 32 caracteres.

Mientras el campo `Name` no se haya cambiado manualmente, `Title` se usa automáticamente para generar `Name`.

### Name

`Name` es el slug obligatorio del proyecto.

Durante la creación se forma a partir de title:

- se convierte a minúsculas;
- los espacios se reemplazan por `-`;
- los guiones repetidos se colapsan;
- los guiones al principio y al final se eliminan.

Al editar un proyecto existente, `Name` está bloqueado porque participa en identificadores y links.

### Access Level

`Access level` se elige al crear o editar un proyecto y determina quién verá el proyecto en marketplace.

Para la mayoría de owners, el camino básico es: primero el proyecto se crea como `Private`, luego, cuando está listo, se cambia a `Public`. El modo `Free` significa que el proyecto sigue siendo público, pero el acceso a subscriptions para usuarios es gratuito. Normalmente es un servicio de pago para el equipo del proyecto que quiere dar notificaciones gratuitas a su community.

### Short Description

`Short description` es una descripción corta para tarjetas y lugares compactos de la interfaz.

El campo es opcional. Límite: hasta 256 caracteres.

### Description

`Description` es la descripción completa en markdown del proyecto para la pestaña `Overview`.

El campo es opcional. Límite: hasta 4096 caracteres.

El editor tiene floating toolbar para el texto seleccionado:

- `Bold`;
- `Italic`;
- `Link`;
- `Heading`;
- `Code`.

### Tags

`Tags` ayudan a buscar y filtrar proyectos.

Para añadir un tag, escríbelo en el campo `Add tag and press Enter` y pulsa `Enter` o el botón de añadir.

Reglas de tags:

- solo letras latinas minúsculas, números y guiones;
- los espacios se normalizan a guiones;
- longitud máxima de un tag: 20 caracteres;
- los duplicados no se añaden.

### Links

`Links` son links externos del proyecto.

Cada link consta de:

- `Title`;
- `URL`;
- botón para eliminar la fila.

El botón `+ Add link` añade una nueva fila. Al guardar, solo se usan links donde title y URL están rellenados.

En la página del proyecto, estos links se muestran en el bloque `Useful links`.

### Icon y Cover

Estos campos permiten definir URLs separadas para elementos visuales del proyecto:

- `Icon` - icon compacto del proyecto. Se usa en el catálogo, en la página del proyecto, en wizards y como valor por defecto para notification avatar;
- `Cover` - cover ancho para la página del proyecto.

Para cada campo se puede elegir el modo de relleno:

- `URL` - insertar manualmente un link a la imagen;
- `Upload` - subir un archivo mediante Web3alert.

En modo `Upload`, el archivo se elige por separado para cada campo. Si se sube un nuevo `Icon` o `Cover`, reemplazará la imagen anterior del mismo tipo después de guardar el proyecto.

Límites de upload:

- formatos: `jpg`, `jpeg`, `png`, `webp`;
- tamaño máximo de archivo: 5 MB.

Si se elige un archivo, pero se sale de la página sin guardar el proyecto, la carga no se aplicará al proyecto.

### Delete Project

Al editar un proyecto existente, el owner puede eliminarlo mediante delete action. Antes de eliminar se muestra un diálogo de confirmación.

Eliminar un proyecto es una operación peligrosa: el proyecto está vinculado con triggers, templates y subscriptions, por lo que debe usarse solo cuando el proyecto realmente ya no es necesario.

## Quick Actions

El conjunto de quick actions depende de la pestaña y de los permisos del usuario:

- en `Overview`: `Edit metadata`, si el usuario puede editar metadata;
- en [Subscriptions](subscriptions.md): [Create subscription](subscription-wizard.md), si el usuario puede gestionar subscriptions del workspace actual;
- en [Triggers](triggers.md): [Import triggers](import-triggers.md) y [Add trigger](trigger-wizard.md), si el usuario puede editar el proyecto;
- en [Templates](templates.md): [Add template](template-wizard.md), si el usuario puede editar el proyecto; [Subscribe](subscription-wizard.md) está disponible en templates válidos con topics.

## Overview

La pestaña `Overview` muestra la descripción de usuario del proyecto.

Bloques principales:

- `About` - descripción markdown completa desde metadata;
- `Project details` - número de triggers, número de tus subscriptions, project id, fecha de creación y fecha de actualización;
- `Tags` - tags del proyecto;
- `Useful links` - links externos útiles del proyecto.

Si la URL de un recurso empieza con `http://`, `https://`, `mailto:` o `tel:`, el link se usa tal cual. En otros casos, la interfaz añade `https://`.

## Subscriptions

La pestaña `Subscriptions` muestra subscriptions del active workspace vinculadas con este proyecto.

Es el mismo conjunto de subscriptions disponible en la sección principal [Subscriptions](subscriptions.md), pero aquí ya está filtrado por el proyecto actual.

Está disponible solo cuando el usuario actual puede gestionar el active workspace. Si no hay subscriptions, se muestra un estado vacío con una sugerencia para crear una subscription.

## Triggers

La pestaña `Triggers` muestra la tabla de triggers del proyecto.

En modo de visualización se pueden abrir trigger details. En modo de edición, el owner puede:

- seleccionar uno o varios triggers;
- eliminar triggers seleccionados;
- abrir la edición de un trigger concreto;
- crear un nuevo trigger mediante [Add trigger](trigger-wizard.md);
- generar triggers en masa mediante [Import triggers](import-triggers.md).

## Templates

La pestaña `Templates` muestra templates del proyecto.

Template es una envoltura de usuario sobre triggers: agrupa inputs, topics y rules para que el usuario pueda crear una subscription sin conocer la configuración interna de triggers. Los templates se describen con más detalle en [Templates](templates.md).

En la lista de templates se muestra:

- title;
- key/id;
- description;
- número de topics;
- advertencia `Needs review`, si template tiene issue;
- acciones `Edit` y `Delete`, si el usuario puede editar;
- `Subscribe`, si template es válido y contiene topics.

Al pulsar `Subscribe`, la interfaz abre [creación de subscription](subscription-wizard.md) con el project/template/topic seleccionado. Si template tiene topics `selectedByDefault`, se seleccionan automáticamente; si no, se toma el primer topic disponible.
