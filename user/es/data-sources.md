# Data Sources

`Data sources` son fuentes de datos blockchain/runtime de las que Web3alert recibe blocks, transactions, events, extrinsics, calls y metadata.

Dicho de forma simple, data source responde a “de dónde leer datos”, y [trigger](triggers.md) responde a “qué evento de esos datos considerar adecuado y cómo convertirlo en output para una subscription”.

## Para qué sirven data sources

Data source se usa en varios lugares del servicio:

- en [Add trigger / Edit trigger](trigger-wizard.md), cuando trigger elige blockchain source;
- en [Import triggers](import-triggers.md), cuando el wizard genera triggers desde ABI, pallet metadata u otra descripción;
- en runtime engine, que se conecta a endpoint, lee nuevos bloques y pasa source items a triggers;
- en monitorización, donde se puede ver status de source, lag y logs.

Un data source puede ser usado por varios projects y triggers si les sirve la misma red o runtime.

## System y custom sources

En la lista pueden aparecer dos tipos de sources.

### System sources

System sources son sources ya soportados por Web3alert. Pertenecen a la plataforma y normalmente están disponibles como marketplace data sources compartidos.

Estos sources no se pueden editar desde workspace. En la lista sirven para ver qué runtime sources están registrados ahora y en qué estado funcionan.

### Custom sources

Custom sources son sources creados dentro de workspace.

Se pueden usar para proyectos propios, integraciones custom y pruebas de redes nuevas. Custom source puede ser private o public si debe estar disponible más ampliamente.

La creación de custom sources no está disponible en todos los planes. Free accounts no pueden crear sus propios data sources; para eso hace falta un tier de pago. El tier también puede tener límite de cantidad de custom sources.

## Tipos de custom sources

Actualmente el wizard soporta dos tipos de custom data sources.

### EVM

EVM source se usa para redes y endpoints compatibles con Ethereum JSON-RPC.

Sirve para EVM events, transactions, blocks, contract logs y contract reads que después se usan en triggers y providers.

Para EVM source normalmente basta con indicar uno o varios HTTP RPC endpoints.

### Substrate

Substrate source se usa para redes compatibles con Polkadot/Substrate.

Sirve para runtime events, extrinsics, calls, blocks, storage reads e importación de triggers basada en metadata.

Para Substrate source normalmente se usa WebSocket endpoint. Si la red requiere signed extensions, runtime types o RPC definitions no estándar, se pueden añadir en el paso `Extensions`.

## Lista de data sources

La sección `Data Sources` muestra una tabla de sources.

Los sources se agrupan por tipo o runtime category, por ejemplo `EVM`, `Substrate` u otro plugin/runtime type.

### Name

Título visible del source y su nombre técnico corto.

### Deployer

Workspace o platform owner que creó el source.

Para system sources normalmente se muestra `common`. Para custom sources se muestra el workspace al que pertenece el source.

### Access

Nivel de acceso del source.

`System` significa source de plataforma. `Private` significa source del workspace actual. `Public` significa custom source publicado para uso más amplio.

### Created at

Fecha de creación de custom source.

Para system/runtime-only sources, la fecha puede no estar presente.

### Lag

Retraso del source respecto al último bloque visto.

Si source procesó todos los bloques disponibles, se muestra `Up to date`. Si hay backlog, se muestra la cantidad de bloques de lag.

### Status

Estado actual de runtime source.

Estados posibles:

- `Running` - source está funcionando;
- `Degraded` - source funciona, pero hay problemas o errores;
- `Error` - source está en error;
- `Pending` - custom source está guardado, pero runtime registration aún no terminó;
- `Registered` - source está registrado, pero runtime status no devuelve estado activo.

### Settings

Menú de acciones para source.

Los elementos disponibles dependen de permisos del usuario y tipo de source.

## Source actions

### Logs

Abre logs de custom source.

Logs ayudan a entender si runtime se conectó a endpoint, qué bloques se procesan y qué errores ocurren.

### System alerts

Abre la creación de subscription para notificaciones de sistema del source.

Así se pueden recibir alerts si source entra en error, se recupera o empieza a tener lag.

### Test system alerts

Envía un evento de sistema de prueba para comprobar alert flow.

Esta función no está disponible en todos los tiers y normalmente la necesitan owners/administradores del source.

### Edit

Abre source wizard para editar custom source.

System sources no se pueden editar.

### Restart source

Reinicia runtime worker source.

Es útil si source parece bloqueado, pero hay que continuar procesamiento desde la posición guardada.

### Reset lag

Descarta backlog y continúa procesamiento desde la cabeza actual de la red.

Los bloques omitidos después de ese reset no serán procesados. Esta acción debe usarse solo si el backlog antiguo ya no hace falta o impide que source alcance el estado actual.

### Delete

Elimina custom source.

Antes de eliminar, es importante comprobar si source se usa en triggers o imports. Si se elimina source, triggers y projects vinculados pueden perder la fuente de datos.

## Add data source

`Add new source` abre el wizard de creación de custom source.

El wizard consta de cuatro pasos: `Details`, `Extensions`, `Test deployment` y `Deploy`.

## Step 1. Details

En este paso se define la configuración básica de source: título, acceso, tipo de red, endpoints y runtime processing settings.

### Title

Título legible del source.

Se muestra en listas y ayuda a distinguir sources entre sí. Por ejemplo: `Ethereum archive node`, `Polkadot private RPC`, `Base mainnet`.

### Name

Slug estable del source dentro de workspace.

Name se forma a partir de title, pero se puede cambiar antes de guardar. Puede contener solo lowercase letters, numbers y dashes.

Después de crear source, name pasa a formar parte de fullname con formato `<workspace>.source.<name>`.

### Access level

Define disponibilidad de custom source.

`Private` sirve para sources del workspace actual e integraciones cerradas. `Public` se usa si source debe estar disponible de forma más amplia y puede ser usado por otros proyectos o usuarios si tienen permisos correspondientes.

### Type

Tipo de blockchain/runtime source.

Actualmente están disponibles `EVM` y `Substrate`.

### Endpoints

Lista de RPC endpoints a los que se conectará runtime.

Se puede indicar uno o varios endpoints. Varios endpoints son útiles para redundancia: si uno es inestable, runtime puede usar otro.

Para EVM normalmente se usa HTTP RPC URL. Para Substrate normalmente se usa WebSocket URL.

### Batch max count

Configuración opcional para EVM source.

Controla la cantidad máxima de batch requests al leer datos. Si el campo no se activa, se usa el valor por defecto.

Esta configuración pertenece a advanced runtime settings y solo hace falta si el comportamiento estándar no sirve.

### Block processing concurrency

Configuración opcional de paralelismo de procesamiento de bloques.

Un valor mayor puede acelerar procesamiento, pero aumenta carga sobre endpoint y runtime. Si el campo no se activa, se usa el valor por defecto.

### Max queued blocks

Límite opcional de cola de bloques.

Limita la cantidad de bloques que source puede mantener en cola de procesamiento. Si el campo no se activa, se usa el valor por defecto.

## Step 2. Extensions

En este paso se configuran runtime extensions adicionales.

Para EVM sources, este paso normalmente no requiere nada: EVM data sources no usan signed extensions, custom runtime types ni RPC extension definitions en este flow.

Para Substrate sources, extensions solo hacen falta en redes donde standard metadata no es suficiente.

### Extensions

Interruptor general de optional extensions.

Si endpoint es normal y metadata se lee sin configuración adicional, este paso puede dejarse desactivado.

### Preset

Conjunto de ajustes preparados para casos conocidos de Substrate runtime.

Actualmente disponibles:

- `No preset`;
- `Avail`;
- `Polkadot Asset Hub / Statemint`;
- `Kusama Asset Hub / Statemine`.

Si se elige preset, el wizard usa ajustes preparados y no exige rellenar manualmente signed extensions, types y RPC.

### Signed extensions

JSON array con descripción de custom signed extensions.

Esto hace falta para redes Substrate donde extrinsics usan extensions no estándar y runtime no puede decodificarlos correctamente sin descripción adicional.

### Types

JSON object con custom runtime types.

Esto hace falta si metadata o RPC devuelven tipos que runtime no puede reconocer automáticamente.

### RPC

JSON object con custom RPC methods.

Esto hace falta si trigger/provider debe llamar a secciones o métodos RPC no estándar de un Substrate node.

## Step 3. Test deployment

Este paso comprueba que runtime puede conectarse a source antes de guardar.

### Deployment test

Muestra summary del futuro source: workspace, fullname y type.

El botón `Run test deployment` inicia la comprobación de endpoints y configuración runtime.

### Logs

Muestra el resultado de test deployment.

Si test deployment termina con error, es mejor no guardar source hasta corregir endpoints o extensions.

Solo se puede avanzar después de una comprobación correcta.

## Step 4. Deploy

El paso final guarda source y espera runtime registration.

### Deploy source

Muestra summary de la configuración que se guardará.

Para Substrate source también se muestra summary de extensions: preset, signed extensions, custom types y RPC methods.

El botón `Create source` crea un nuevo source. Al editar un source existente, el botón se llama `Update source`.

### Deploy logs

Muestra el proceso de guardado y runtime registration.

Después de guardar correctamente, source aparece en la lista `Data Sources`. Si runtime registration aún no terminó, source puede permanecer un tiempo en estado `Pending`.

## Edit data source

La edición de custom source usa el mismo wizard.

Se pueden cambiar title, access level, endpoints, extensions y runtime settings. Name está bloqueado durante edición porque forma parte del fullname estable.

Después de actualizar source, runtime registration puede tardar un poco.
