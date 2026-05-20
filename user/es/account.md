# Account

`Account` es la entidad personal del usuario en Web3alert.

Account define quién ha iniciado sesión en el servicio, cómo se muestra el perfil personal, qué tier está activo, qué balance está disponible para pagos y qué acciones de billing/referral pertenecen a este usuario.

Account no sustituye a [Workspace](workspaces.md). Workspace guarda las entidades de trabajo: proyectos, suscripciones, resources, data sources, addresses y miembros. Account guarda el acceso personal, el perfil y el contexto de billing.

## Account y Workspace

### Qué Pertenece a Account

Account incluye:

- avatar personal y account title;
- user id;
- personal access token;
- billing profile;
- internal balance;
- account tier;
- auto-renewal del tier;
- compras de account plans;
- compras de project free-access add-ons para proyectos que el account puede gestionar en billing;
- personal coupons y gift coupons;
- referral link, referral code y referral rewards;
- eliminación del account.

Si el usuario cambia el active workspace, el account sigue siendo el mismo. Solo cambian los datos de trabajo asociados al workspace seleccionado.

Workspace y sus ajustes se describen con más detalle en [Workspaces](workspaces.md).

## Abrir Account Parameters

`Account parameters` se abre desde el menú de usuario en la esquina superior derecha de la interfaz.

En este menú están disponibles:

- `Account parameters`;
- `Log out`.

`Log out` cierra la sesión actual. Antes de salir se muestra una confirmación.

## Account Parameters

`Account parameters` contiene cuatro pestañas:

- `Information`;
- `Billing`;
- `Referral`;
- `Danger zone`.

## Information

La pestaña `Information` contiene los ajustes personales del account.

### Account

Panel de perfil del account.

Muestra:

- avatar del usuario;
- account title;
- botón para editar el account title;
- indicación para subir avatar.

### Avatar

Avatar se usa en el user menu y en las partes de la interfaz donde hace falta mostrar al usuario actual.

Para reemplazar el avatar, haz clic en la imagen actual. Se admiten archivos `JPG` y `PNG` de hasta 1 MB.

### Account Title

Nombre visible del usuario.

Title se puede cambiar con el botón de edición junto al nombre. Durante la edición:

- `Enter` guarda el valor;
- `Escape` cancela la edición;
- perder el foco también guarda el valor.

Límites:

- mínimo 2 caracteres;
- máximo 80 caracteres;
- no se puede guardar un valor vacío.

### User ID

Id read-only del usuario actual.

Se usa para diagnóstico, soporte e identificación precisa del account cuando el display name no es suficiente.

### Personal Access Token

Access token personal de la sesión actual.

Con este token, el usuario obtiene acceso a la [API](api.md) de Web3alert y a los [MCP servers](mcp-server.md). Las capacidades disponibles de API/MCP dependen del tier actual del account.

El token debe tratarse como un secreto: no debe enviarse a chats públicos, screenshots ni documentación.

El token pertenece al account, no al workspace.

## Billing

La pestaña `Billing` gestiona el balance, el tier, los pagos y los coupons del account.

Las acciones de billing se aplican al account, pero algunas compras pueden afectar a proyectos gestionados por el account.

### Balance

Internal balance del account en EUR.

El balance se puede usar para:

- comprar account plans;
- comprar project free-access add-ons;
- comprar gift coupons.

### Top Up

Abre la recarga de balance.

En el dialog hay que indicar el amount en EUR y continuar al checkout del proveedor de pagos.

Después de que el proveedor confirme el pago, los fondos aparecen en el internal balance.

### Current Tier

Tier actual del account.

La tarjeta muestra:

- nombre del tier;
- fecha hasta la que el account tiene entitlement;
- interruptor `Renew automatically`, si hay un tier de pago activo.

### Renew Automatically

Controla la renovación automática del tier activo.

Si el interruptor está activado, el siguiente periodo puede pagarse automáticamente con la payment strategy seleccionada. Si está desactivado, el tier sigue activo hasta el final del periodo pagado, pero no se renueva automáticamente.

### Account Plans

Lista de tiers del account.

La lista completa de límites y capacidades de cada tier está descrita en la página [Limits](limits.md).

### Free

Tier básico.

Da unlimited access a free projects y un número limitado de suscripciones activas a triggers de non-free projects.

### Advanced

Tier de pago para usuarios que necesitan acceso a triggers de public/private projects y una capacidad básica para crear sus propias entidades de marketplace.

En la UI actual, Advanced muestra las capacidades principales:

- acceso a triggers de public y private projects;
- un private project;
- un custom data source.

### Pro

Tier de pago ampliado.

En la UI actual, Pro muestra las capacidades principales:

- acceso a triggers de public y private projects;
- hasta 5 private projects;
- hasta 5 custom data sources.

### Duration

Duración de la compra de un tier de pago.

Las opciones disponibles dependen del billing pricing, normalmente 1, 3, 6 o 12 meses. Algunas duraciones pueden mostrar discount.

### Pay / Upgrade

Botón de acción en la tarjeta de tier.

Según el estado actual, puede significar:

- comprar un tier;
- renovar el tier actual por una duración mayor;
- hacer upgrade a un tier superior;
- mostrar que el tier ya está activo;
- mostrar que el tier está bloqueado hasta el final del periodo pagado actual.

El pago con este botón descuenta fondos del internal balance, por lo que el balance debe ser suficiente.

### Project Free-Access Add-On

Add-on que abre acceso gratuito a un project para todos los usuarios del servicio.

Este escenario es útil si el owner del proyecto quiere pagar el acceso a alerts para su community. Los usuarios podrán suscribirse a ese proyecto como a un free project mientras el add-on esté activo.

Si el add-on no se renueva, el proyecto se convierte automáticamente en public project. Las suscripciones de Free users a este proyecto se congelarán si superan los límites del Free tier para non-free projects.

La lista muestra los proyectos que el account puede gestionar en billing.

### Project Card

La tarjeta de project free-access add-on muestra:

- icon y title del proyecto;
- status actual del add-on;
- duration;
- `Renew automatically`;
- botón de pago o status actual.

Si el add-on está activo, se muestra la fecha de finalización del periodo actual. Si se espera confirmación de pago, se muestra el estado `Awaiting confirmation`.

### Coupons

La sección coupons permite activar un coupon para uno mismo o comprar un gift coupon para otro usuario.

### Redeem Coupon

Campo para introducir coupon code.

Si el code está activo, el plan correspondiente se aplica al account.

### Gift Coupon

Compra de un coupon code para otro usuario.

Hay que elegir:

- tier: `Advanced` o `Pro`;
- duration.

Después de confirmar la compra, el importe se descuenta del internal balance y el servicio muestra el coupon code que se puede compartir con otra persona.

### Your Gift Coupons

Lista de gift coupons comprados por el account actual.

Cada coupon muestra:

- code;
- tier;
- duration;
- status;
- botón copy para el code.

### Recent Invoices

Lista de los últimos billing attempts para account plans y project add-ons.

Cada invoice muestra:

- nombre del invoice;
- amount;
- status;
- fecha de actualización.

El status del invoice ayuda a entender si el pago fue exitoso, espera confirmación, terminó con error o fue cancelado.

## Referral

La pestaña `Referral` gestiona el referral link y los referral rewards del account.

### Referral Rate

Porcentaje de reward que se acumula por las compras de usuarios invitados.

### Referred Users

Número de accounts vinculados al referral code del usuario actual.

### Earned Total

Total de referral rewards acumulados en el internal balance.

### Referral Link

Shareable link para invitar nuevos usuarios.

Si el referral link todavía no se ha creado, el botón `Generate link` lo crea. Después de crearlo, están disponibles:

- `Copy link`;
- `Copy code`.

Los nuevos usuarios que llegan por el referral link se vinculan al referral account.

### Claim Referral Code

Permite indicar manualmente un referral code si el usuario llegó por invitación, pero el code no se vinculó automáticamente.

El code se puede enviar con el botón `Claim code`. Después de una vinculación correcta, el campo se limpia y la interfaz muestra un success message.

## Danger Zone

La pestaña `Danger zone` contiene la eliminación del account.

### Delete Account

Elimina el account y todas sus subscriptions.

Antes de eliminarlo se muestra la confirmación `Are you sure you want to delete this account?`.

Después de la eliminación, la sesión actual se cierra.

Esta acción es irreversible. Debe usarse solo si el account realmente ya no es necesario.
