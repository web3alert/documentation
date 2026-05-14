# Workspaces

`Workspace` es el espacio de trabajo de Web3alert donde un equipo guarda y configura sus proyectos, subscriptions, resources de entrega, data sources y address book.

En pocas palabras, account se encarga del inicio de sesión personal, el perfil y el billing del usuario, mientras que workspace se encarga del trabajo compartido y de los datos operativos del servicio.

Un account puede pertenecer a varios workspaces. El active workspace se elige en el menú izquierdo y determina qué entidades ve el usuario en las secciones principales del servicio:

- [Projects](projects.md) - proyectos creados en el workspace y marketplace projects disponibles;
- [Subscriptions](subscriptions.md) - subscriptions del workspace actual;
- [Resources](resources.md) - canales de entrega y endpoints externos del workspace actual;
- [Data sources](data-sources.md) - custom data sources del workspace actual y system sources disponibles;
- [Addresses](addresses.md) - address book del workspace actual.

## Workspace y Account

Es importante no confundir workspace con account.

### Account

`Account` es la entidad personal del usuario.

Account incluye:

- métodos de autorización;
- perfil personal y avatar del usuario;
- billing profile;
- balance;
- tier actual;
- compras de tiers y project free-access add-ons;
- participación personal del usuario en distintos workspaces.

### Workspace

`Workspace` es la entidad de trabajo de un equipo o usuario.

Workspace incluye:

- title, avatar y name del workspace;
- miembros del workspace y sus roles;
- invite link para añadir miembros;
- proyectos creados en este workspace;
- project transfer requests;
- subscriptions del workspace;
- resources del workspace;
- custom data sources del workspace;
- address book del workspace;
- subscription logs del workspace.

Si el usuario cambia el active workspace, sigue siendo el mismo account, pero ve otro contexto de trabajo.

## Menú Izquierdo de Workspace

En el menú izquierdo hay un bloque separado `Workspace`.

### Current Workspace

La fila superior del bloque muestra el workspace actual: su avatar o la primera letra del nombre, title y flecha de despliegue.

Al hacer clic en la fila se abre el workspace-menu.

### Parameters

Abre `Workspace parameters`, la página de ajustes del workspace actual.

Aquí se editan los parámetros del workspace, miembros, transfer requests y subscription logs.

### Switch Workspaces

Muestra otros workspaces a los que pertenece el account actual.

Al hacer clic en otro workspace se cambia el active workspace. Después del cambio, la interfaz permanece en la misma sección cuando es posible. Por ejemplo, el usuario puede cambiar de `Projects` de un workspace a `Projects` de otro. Si la página detallada actual ya no existe en el nuevo workspace, la interfaz devuelve al usuario a la lista de proyectos.

### Add Workspace

Abre la creación de un nuevo workspace.

## Crear un Workspace

Un nuevo workspace se crea desde el menú izquierdo: `Workspace` -> `Add workspace`.

Después de crear el workspace, la interfaz cambia al usuario a ese nuevo workspace y abre [Projects](projects.md).

### Title

Nombre visible del workspace.

Title se muestra en el menú izquierdo, en los ajustes del workspace y en otros lugares de la interfaz donde se necesita un nombre legible del espacio de trabajo.

Title es obligatorio.

### Name

Slug estable del workspace.

Name se usa como nombre técnico del workspace y forma parte de los fullnames de las entidades que pertenecen al workspace. Por ejemplo, un proyecto puede recibir un fullname como `<workspace>.<project-name>`.

Name es obligatorio y debe estar en kebab-case: letras latinas, números y guiones.

Mientras el usuario no haya cambiado `Name` manualmente, la forma intenta generarlo a partir de `Title`. Si title contiene caracteres no admitidos, name debe rellenarse manualmente.

### Reserved Names

Algunos nombres están reservados por la plataforma.

Por ejemplo, workspace names y titles relacionados con `common` o `web3alert` no pueden usarse para workspaces normales de usuario.

### Cancel

Cancela la creación del workspace y devuelve al usuario a la interfaz principal.

## Workspace Roles

Un miembro de workspace tiene uno de los roles.

### Owner

Propietario principal del workspace.

Owner puede gestionar workspace settings, miembros y project transfers. Transferir un proyecto fuera del workspace solo está disponible para owner.

### Admin

Administrador del workspace.

Admin puede gestionar workspace settings y miembros, pero no puede iniciar un project transfer en nombre del owner.

### Developer

Miembro que trabaja con entidades técnicas del workspace.

El acceso exacto depende de los permisos sobre proyectos y secciones del servicio. En workspace settings, developer no gestiona miembros ni transfer requests.

### User

Miembro básico del workspace.

Normalmente usa proyectos, subscriptions y resources preparados, pero no gestiona workspace settings.

## Workspace Parameters

`Workspace parameters` es el menú de ajustes del active workspace.

El conjunto de pestañas depende del role del usuario y del propio workspace. Por ejemplo, `Project transfers` solo está disponible para owner.

## Information

La pestaña `Information` contiene los parámetros principales del workspace.

### Workspace

Panel de perfil del workspace.

Muestra:

- avatar del workspace;
- title del workspace;
- botón para editar title.

### Avatar

El avatar del workspace se muestra en el menú izquierdo y en lugares donde la interfaz necesita distinguir visualmente un workspace de otro.

Para reemplazar el avatar, haz clic en la imagen actual. Se admiten archivos `JPG` y `PNG` de hasta 1 MB.

Al subir la imagen se abre crop tool. Para workspace se usa rounded-square crop, porque el avatar del workspace se muestra en la interfaz como un cuadrado con esquinas redondeadas.

### Title

Title se puede editar directamente en el panel del workspace.

Después de guardar, el nuevo nombre aparece en el menú izquierdo y en workspace settings.

Title no puede estar vacío.

### Name

Nombre read-only del workspace.

Name no se puede editar desde settings porque participa en los fullnames y links de las entidades.

## Members

La pestaña `Members` gestiona los miembros del workspace.

Está disponible para usuarios que pueden gestionar el workspace. Normalmente son owner y admin.

### Invite New Members

Para workspaces normales, la pestaña muestra invite link.

Este link se puede copiar y enviar al usuario que debe añadirse al workspace. Con el invite link, el usuario primero se autoriza si todavía no ha iniciado sesión en Web3alert, luego pulsa `Join` y entra en el workspace.

### Workspace Members

Lista de miembros del workspace.

Para cada miembro se muestra:

- avatar o primera letra del nombre;
- display name;
- marca `You`, si es el usuario actual;
- role actual;
- botón de eliminación, si el usuario actual puede eliminar miembros.

### Role Select

Permite cambiar el role de un miembro.

El cambio se aplica inmediatamente después de elegir el role.

Roles disponibles:

- `Owner`;
- `Admin`;
- `Developer`;
- `User`.

### Remove Member

Elimina un miembro del workspace.

Antes de eliminarlo se muestra una confirmación. Si el usuario se elimina a sí mismo, la acción funciona como `Leave workspace`.

### Members Access

Si el usuario no tiene permisos para gestionar miembros, la pestaña muestra un estado read-only.

En este modo, el usuario ve que solo owner o admin pueden invitar miembros, cambiar roles y eliminar personas.

## Project Transfers

La pestaña `Project transfers` gestiona la transferencia de proyectos entre workspaces.

Está disponible solo para el owner del workspace actual.

Transfer no mueve el proyecto inmediatamente. Primero se crea un request; después el owner del workspace destino lo acepta o lo rechaza. El proyecto cambia de propietario solo después de aceptar el request.

### Create Transfer Request

Formulario para preparar transfer request.

### Project

Proyecto que se va a transferir.

La lista contiene proyectos del workspace actual disponibles para transfer.

### Target Workspace

Name del workspace que debe recibir el proyecto.

Conocer el workspace name no es suficiente para transferir: el request igualmente debe ser aceptado por el owner del target workspace.

### Target Project Name

Nuevo nombre del proyecto en el target workspace.

Si el campo queda vacío o conserva el valor actual, el proyecto mantiene su name. Si hay que transferir el proyecto con cambio de nombre, aquí se indica el nuevo project name.

### Get Plan

Construye un transfer plan antes de crear el request.

El plan muestra qué será afectado:

- cantidad de triggers;
- cantidad de templates;
- cantidad de topics;
- cantidad de subscriptions;
- cantidad de aliases que deben actualizarse.

Si se detectan conflicts, el request no puede crearse hasta resolverlos.

### Conflicts

Lista de problemas que impiden la transferencia.

Por ejemplo:

- target workspace no encontrado o no puede aceptar transfer;
- en target workspace ya existe un proyecto con ese nombre;
- los target trigger fullnames entran en conflicto con triggers existentes;
- aliases ya ocupados por otras entidades.

### Request Transfer

Crea transfer request usando el último plan construido.

Si los datos cambiaron después de construir el plan, backend puede rechazar el request y pedir que se construya el plan de nuevo.

### Outgoing Requests

Requests enviados desde el workspace actual.

Cada request muestra:

- source project y target project;
- fecha de creación;
- fecha de expiración;
- status;
- breve cantidad de triggers/templates.

Un pending request se puede cancelar con `Cancel`.

### Incoming Requests

Requests recibidos por el workspace actual.

Un pending request se puede aceptar con `Accept` o rechazar con `Reject`.

Después de aceptar, backend aplica el transfer: cambia el workspace del proyecto, actualiza fullnames y aliases relacionados, y después el request recibe un status final.

## Subscription Logs

La pestaña `Subscription logs` muestra el historial de alerts para las subscriptions del workspace actual.

Es un log de entrega: ayuda a entender qué subscription alerts fueron enviados, bloqueados, limitados por rate limit o terminaron con error.

### Last Entries

Limita la cantidad de registros en el log.

Valores disponibles:

- `50`;
- `100`;
- `250`;
- `500`.

### Auto-Refresh

Activa la actualización automática del log.

Valores disponibles:

- `Off`;
- `5s`;
- `10s`;
- `30s`.

Cuando auto-refresh está activado, el filtro por fecha se oculta porque el log funciona como live-view de los últimos eventos.

### Before / After

Filtro por tiempo.

`Before` muestra registros anteriores a la fecha y hora seleccionadas. `After` muestra registros posteriores a la fecha y hora seleccionadas.

### Date and Time

Selección de fecha y hora para el filtro `Before` o `After`.

En el popover se puede elegir día, hour y minute. El botón `Now` inserta la hora actual, y `Clear` limpia el filtro.

### Refresh

Actualización manual del log.

### Time

Columna con la hora de creación del log entry.

El botón del encabezado ordena los registros por tiempo: de nuevos a antiguos o de antiguos a nuevos.

### Subscription

Columna con la ruta del alert.

Muestra project, trigger o template context, además de canales de entrega. Si la subscription tenía inputs o filters, cerca puede mostrarse details badge con una pista breve.

### Status

Filtro y columna de status.

Statuses disponibles:

- `Delivered`;
- `Failed`;
- `Rate limited`;
- `Blocked`.

### Expanded Log Row

Al hacer clic en una fila se abren los detalles:

- `Reason` - motivo del error o información adicional;
- `Input` - replay/test input, si existe;
- `Test run` - ejecución de test de subscription basada en datos del log entry, si para ese registro hay una subscription relacionada disponible.

## Danger Zone

La pestaña `Danger zone` contiene la salida del workspace.

### Leave Workspace

Elimina al usuario actual del workspace.

Antes de salir se muestra una confirmación.

Si el usuario es el único miembro del workspace, el workspace se eliminará después de salir.

### Last Workspace

Si es el único workspace del usuario, no puede abandonarlo.

En este caso, el botón `Leave` está desactivado y la pestaña muestra `You cannot leave your last workspace`.
