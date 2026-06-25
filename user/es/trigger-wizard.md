# Add Trigger / Edit Trigger

`Add trigger` abre el wizard detallado de creación de trigger. Este wizard define todo el ciclo de vida del evento: desde la lectura de source item hasta los notification defaults finales.

La edición de un trigger existente usa el mismo wizard, pero con valores ya rellenados.

Si necesitas crear rápidamente muchos triggers similares desde ABI o metadata, puedes usar [Import triggers](import-triggers.md). Es un escenario masivo simplificado sobre la idea general de creación de triggers.

## Step 1. Description

En este paso, trigger recibe un nombre comprensible y una explicación breve de lo que hace. Esto ayuda después a reconocer rápidamente el trigger en el proyecto, templates, subscriptions y otros lugares donde hay que elegir o comprobar el escenario correcto.

### Title

Nombre visible obligatorio del trigger. Se muestra en la interfaz donde el usuario selecciona, revisa o comprueba trigger, por eso conviene escribirlo de forma breve y clara.

### ID

Slug de sistema del trigger dentro del proyecto. Se genera automáticamente a partir del título y en la forma se muestra como disabled field, para que el usuario vea el identificador futuro, pero no lo cambie manualmente.

### Description

Descripción opcional del trigger. Conviene activarla si solo con title no queda claro qué evento se sigue, qué datos se usan o en qué escenario se necesita este trigger.

### Category

Categoría obligatoria del trigger. Ayuda a agrupar triggers en tablas, templates y rules, para que los proyectos grandes sigan siendo comprensibles y fáciles de buscar.

## Step 2. Source

En este paso se elige qué inicia el trigger: un timer regular o un evento de blockchain data source. Del tipo elegido depende el conjunto de paneles siguientes.

### Trigger Type

Selección obligatoria del tipo base de trigger.

`timer` se usa para activaciones regulares por intervalo. `blockchain` se usa para events, extrinsics, calls, blocks o transactions desde [Data sources](data-sources.md).

### Timer

#### Interval

Intervalo obligatorio con el que timer trigger debe activarse.

Formato de interval: número y unidad de tiempo, por ejemplo:

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Blockchain

#### Source

Selección obligatoria de data source desde la que trigger leerá datos blockchain/runtime.

La lista muestra sources disponibles del proyecto. Si no hay una source adecuada, se puede ir a [Add new source](data-sources.md#add-data-source).

La source elegida determina la siguiente rama de configuración: EVM, Substrate o Solana.

### Blockchain - EVM

#### Source Item

Selección obligatoria del tipo de datos que trigger recibe de EVM source: `event`, `call`, `block` o `transaction`.

Para `event` y `call`, el wizard configura además ABI y signature. Para `block` y `transaction`, ABI y signature no son necesarios.

#### ABI Contract Address

Dirección del contrato por la que el wizard intenta cargar ABI y proponer events o calls disponibles.

Si `Use as trigger filter` está activado, trigger se activará solo para ese contract address. Si el switch está desactivado, la dirección se usa solo para cargar ABI, y el trigger podrá hacer match con cualquier contrato que tenga la signature elegida.

#### Event Signature / Call Signature

Signature obligatoria del evento o método que debe iniciar trigger.

Si ABI se carga correctamente, signature se puede elegir desde la lista. Si ABI no se encuentra, el contrato es dinámico o la signature necesaria no está en la lista, el valor se puede introducir manualmente.

### Blockchain - Substrate

#### Source Item

Selección obligatoria del tipo de Substrate item: `event`, `call`/`extrinsic` o `block`.

Para `event` y `call`, el wizard propone además elegir pallet y entry concreta. Para `block`, pallet y event/extrinsic no son necesarios.

#### Pallet

Pallet obligatorio desde runtime metadata de la Substrate source elegida.

La lista se carga desde metadata source. Está disponible solo para selection modes `event` y `call`/`extrinsic`.

#### Event / Extrinsic

Entry obligatoria dentro del pallet seleccionado.

Para `event` se elige un evento del pallet. Para `call`/`extrinsic` se elige extrinsic. El wizard muestra runtime version para que se entienda desde qué metadata se cargaron las opciones disponibles.

### Blockchain - Solana

#### Source Item

Selección obligatoria del tipo de Solana item: `event` o `call`.

`event` corresponde a un program event decodificado desde logs. `call` corresponde a una Solana instruction del program elegido.

#### Program ID

Public key obligatorio del Solana program.

#### IDL

JSON IDL del program elegido. El wizard puede intentar cargarlo automáticamente desde Anchor IDL account o Program Metadata. Si no se puede cargar, debe pegarse manualmente. Sin IDL no se puede crear un trigger Solana event/call fiable.

#### Event / Call

Entry obligatoria desde IDL. Para `event` se elige una entrada de `events`; para `call` se elige una instruction de `instructions`. Las accounts de una instruction quedan disponibles como `source.accounts.*`.

### Types Source

`Types source` es una configuración opcional a nivel de trigger. Indica al wizard de dónde debe cargar el catálogo de tipos usado por los campos de schema con tipo `lookup`.

Los campos lookup no incrustan todo el schema anidado dentro del campo. En su lugar guardan una referencia a un tipo con nombre dentro de un catálogo. Cuando el subscription wizard o el trigger editor necesita mostrar los campos internos de ese tipo lookup, solicita el catálogo para el trigger elegido y resuelve la referencia. Esto es útil para Substrate runtime metadata, Solana IDL custom types, catálogos importados y otros schemas donde los objetos son grandes, se reutilizan en varios lugares o son recursivos. Mantenerlos como lookups evita copiar estructuras profundas en cada campo y evita que los tipos recursivos se expandan indefinidamente en la UI.

Si `Types source` está desactivado, se usa el comportamiento por defecto: el backend intenta primero usar types específicos del trigger si existen, y después hace fallback a project/source types cuando se pueden inferir desde el source elegido. Los timer triggers normalmente no tienen source inferido, así que el catálogo queda vacío salvo que esta configuración esté activada.

Modos disponibles:

- `Source node` - elegir un data source y usar el catálogo de tipos importado desde el runtime o metadata de ese source.
- `API / imported catalog` - llamar a un HTTP endpoint que devuelve un catálogo de tipos. El endpoint puede devolver una lista completa de types, un objeto `{ schemas: ... }`, un wrapper `{ types: [...] }`/`{ data: [...] }` o una lista importada de elementos `{ id, schema }`.
- `Inline / manual` - pegar un JSON object donde las keys son nombres de tipos y los values son definiciones de tipo estilo JSON Schema.

Para controles de filtro dinámicos como `cascade`, un API catalog también puede proporcionar un lookup endpoint. El wizard lo llama para cargar listas de options para los `Lookup ref` seleccionados, incluidas listas dependientes como series -> event -> market. La condition guardada en la subscription sigue almacenando un único valor de filtro normal.

Usa esta configuración cuando un trigger recibe datos de un source, pero el schema editor debe resolver lookups desde otro source, desde un catálogo importado o desde un conjunto de tipos mantenido manualmente.

### Source Payload

El source item elegido define la estructura `source.*` que estará disponible después en el wizard: en inputs/templates, providers, activation condition, filters, data transform y defaults.

#### Timer

| Path | Type | Description |
| --- | --- | --- |
| `source.now` | `string` | ISO timestamp del timer run actual. |
| `source.timestampMs` | `number` | Unix timestamp en milisegundos para el timer run actual. |

#### EVM Event

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address que emitió el event. |
| `source.blockNumber` | `number` | Número de bloque donde se encontró el event. |
| `source.blockHash` | `string` | Hash del bloque donde se encontró el event. |
| `source.transactionHash` | `string` | Hash de la transaction dentro de la cual estaba el event. |
| `source.transactionIndex` | `number` | Índice de la transaction dentro del bloque. |
| `source.index` | `number` | Índice del event/log dentro de la transaction o del bloque. |
| `source.data` | `string` | Raw encoded event data. |
| `source.topics` | `array<string>` | Topics del EVM log. |
| `source.args` | `array` | Decoded ABI arguments en orden posicional. Si ABI es conocido, el wizard además sugiere `source.args[index]` con nombres de argumentos. |

#### EVM Call

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address relacionado con el matched call. |
| `source.blockNumber` | `number` | Número de bloque donde se encontró el call. |
| `source.blockHash` | `string` | Hash del bloque donde se encontró el call. |
| `source.transactionHash` | `string` | Hash de la transaction dentro de la cual estaba el call. |
| `source.transactionIndex` | `number` | Índice de la transaction dentro del bloque. |
| `source.index` | `number` | Índice del call/source item. |
| `source.from` | `address` | Caller address. |
| `source.to` | `address` | Target contract address. |
| `source.data` | `string` | Raw encoded calldata. |
| `source.args` | `array` | Decoded ABI arguments en orden posicional. Si ABI es conocido, el wizard además sugiere `source.args[index]` con nombres de argumentos. |

#### EVM Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Número de bloque. |
| `source.hash` | `string \| null` | Hash del bloque. |
| `source.timestamp` | `number` | Timestamp del bloque. |
| `source.transactionsCount` | `number` | Cantidad de transactions en el bloque. |
| `source.gasLimit` | `string \| null` | Gas limit del bloque en raw units, si source lo proporciona. |
| `source.gasUsed` | `string \| null` | Gas usado por todas las transactions del bloque, si source lo proporciona. |
| `source.baseFeePerGas` | `string \| null` | Base fee per gas del bloque, si source lo proporciona. |
| `source.blobGasUsed` | `string \| null` | Blob gas usado por el bloque, si source lo proporciona. |
| `source.excessBlobGas` | `string \| null` | Excess blob gas del bloque, si source lo proporciona. |

#### EVM Transaction

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número de bloque donde la transaction fue incluida. |
| `source.block.hash` | `string \| null` | Hash del bloque donde la transaction fue incluida. |
| `source.block.timestamp` | `number` | Timestamp del bloque. |
| `source.index` | `number` | Índice de la transaction dentro del bloque. |
| `source.hash` | `string` | Hash de la transaction. |
| `source.type` | `string` | Tipo normalizado de transaction, por ejemplo `legacy` o `eip1559`. |
| `source.from` | `address` | Sender address. |
| `source.to` | `address \| null` | Recipient address o `null` para contract creation. |
| `source.nonce` | `number` | Account nonce de la transaction. |
| `source.gasLimit` | `string` | Gas limit en raw units. |
| `source.gasPrice` | `string` | Gas price en raw units. |
| `source.maxPriorityFeePerGas` | `string \| null` | EIP-1559 max priority fee, si está disponible. |
| `source.maxFeePerGas` | `string \| null` | EIP-1559 max fee, si está disponible. |
| `source.maxFeePerBlobGas` | `string \| null` | Blob gas fee, si está disponible. |
| `source.input` | `string` | Raw transaction input calldata. |
| `source.value` | `string` | Native token amount en raw base units. |
| `source.methodId` | `string \| null` | Primeros 4 bytes de calldata selector, si existen. |

#### Substrate Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número de bloque donde se encontró el event. |
| `source.block.hash` | `string` | Hash del bloque donde se encontró el event. |
| `source.block.timestamp` | `number` | Timestamp del bloque en milisegundos. |
| `source.index` | `number` | Índice del event dentro del bloque. |
| `source.module` | `string` | Pallet/module name. |
| `source.event` | `string` | Event name dentro del pallet. |
| `source.type` | `string \| null` | Phase type del evento. |
| `source.extrinsic` | `number \| null` | Índice de extrinsic para events `ApplyExtrinsic`. |
| `source.data` | `array` | Decoded event data en orden posicional. El wizard además sugiere `source.data[index]` con nombres de argumentos desde metadata. |

#### Substrate Extrinsic

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número de bloque donde se encontró extrinsic. |
| `source.block.hash` | `string` | Hash del bloque donde se encontró extrinsic. |
| `source.block.timestamp` | `number` | Timestamp del bloque en milisegundos. |
| `source.index` | `number` | Índice de extrinsic dentro del bloque. |
| `source.module` | `string` | Pallet/module name. |
| `source.call` | `string` | Extrinsic method name. |
| `source.args` | `array` | Decoded extrinsic arguments en orden posicional. El wizard además sugiere `source.args[index]` con nombres de argumentos desde metadata. |
| `source.result` | `string \| null` | Execution result del matched extrinsic. |
| `source.sender` | `address \| null` | Origin account que envió extrinsic. |
| `source.signature` | `object \| null` | Datos de la firma de extrinsic. |
| `source.signature.nonce` | `number` | Nonce de la firma. |
| `source.signature.digest` | `string` | Signature digest. |
| `source.path` | `string` | Nested call path para matched extrinsic. |

#### Substrate Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Número de bloque. |
| `source.hash` | `string` | Hash del bloque. |
| `source.parentHash` | `string` | Hash del bloque padre. |
| `source.timestamp` | `number` | Timestamp del bloque en milisegundos. |
| `source.stateRoot` | `string` | State root del bloque. |
| `source.extrinsicsRoot` | `string` | Extrinsics root del bloque. |

#### Solana Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot donde se encontró el event. |
| `source.block.hash` | `string \| null` | Block hash del slot, si está disponible. |
| `source.block.timestamp` | `number \| null` | Block timestamp, si está disponible. |
| `source.transaction.index` | `number` | Índice de la transaction dentro del bloque. |
| `source.transaction.signature` | `string` | Signature de la Solana transaction. |
| `source.transaction.success` | `boolean` | Indica si la transaction fue correcta. La source omite failed transactions. |
| `source.transaction.error` | `unknown` | Error de la transaction o `null` para una transaction correcta. |
| `source.index` | `number` | Índice del matched event dentro del source output. |
| `source.programId` | `address` | Program ID seleccionado en el trigger. |
| `source.event` | `string` | Nombre del event desde el IDL. |
| `source.data` | `object` | Decoded event data, con keys tomadas de los field names del IDL. |

#### Solana Call

| Path | Type | Description |
| --- | --- | --- |
| `source.block.slot` | `number` | Slot donde se encontró la instruction. |
| `source.block.hash` | `string \| null` | Block hash del slot, si está disponible. |
| `source.block.timestamp` | `number \| null` | Block timestamp, si está disponible. |
| `source.transaction.index` | `number` | Índice de la transaction dentro del bloque. |
| `source.transaction.signature` | `string` | Signature de la Solana transaction. |
| `source.transaction.success` | `boolean` | Indica si la transaction fue correcta. La source omite failed transactions. |
| `source.transaction.error` | `unknown` | Error de la transaction o `null` para una transaction correcta. |
| `source.index` | `number` | Índice del matched call dentro del source output. |
| `source.programId` | `address` | Program ID seleccionado en el trigger. |
| `source.call` | `string` | Nombre de la instruction desde el IDL. |
| `source.signers` | `array<string>` | Direcciones de los signers de la transaction para la matched instruction. |
| `source.args` | `object` | Decoded instruction arguments, con keys tomadas de los arg names del IDL. |
| `source.accounts` | `object` | Instruction account addresses keyed por nombre de account del IDL, con owner aliases de token accounts añadidos cuando están disponibles. |
| `source.accountsMeta` | `object` | Metadata de token accounts keyed por nombre de account del IDL, cuando está disponible. Los fields de metadata pueden incluir `address`, `owner`, `mint`, `programId`, `decimals`, `rawAmount`, `uiAmount` y `uiAmountString`. |
| `source.accountsRaw` | `array<string>` | Account addresses en el orden de la transaction instruction. |
| `source.path` | `string` | Ruta de la instruction, incluida la anidación de inner instructions. |
| `source.inner` | `boolean` | `true` si la matched instruction era una inner instruction. |

## Step 3. Inputs Schema

`Inputs schema` describe los parámetros que el usuario define al crear una subscription.

Inputs se parecen a filters, por lo que es fácil confundirlos. La diferencia principal: inputs son obligatorios y definen los datos base sin los cuales la subscription no puede funcionar. Filters son opcionales y sirven para personalización adicional después de rellenar los inputs obligatorios.

El editor soporta dos modos:

- `UI mode` - los campos se añaden mediante el Schema editor visual;
- `JSON mode` - schema se edita como JSON.

<a id="schema-editor"></a>

### Schema Editor

Schema editor se usa en varios pasos del wizard. En `Inputs schema` describe campos que el usuario rellena al crear subscription; en `Filters schema` y `Output schema` se usa el mismo principio de edición.

En `UI mode`, schema consiste en properties. Cada property se puede desplegar, contraer, eliminar y configurar mediante un conjunto de paneles.

#### Property

`Name` - nombre técnico del campo dentro de schema. Se usa en paths, templates y código JavaScript, por lo que debe ser corto, estable y claro. Para object properties, name se convierte en key del objeto. Para array item, name no se usa, porque array describe un tipo común de elemento.

`Type` - tipo de valor. Del tipo elegido depende qué paneles adicionales aparecerán debajo.

`Source path` - vínculo opcional con el path original `source.*`. Se necesita cuando el campo de schema no se llama igual que el campo original de source item, pero engine debe entender qué source-value usar para early filtering. Normalmente `Source path` se necesita en filters, a veces puede ser útil en inputs, pero no se usa en output schema.

#### Property Types

`string` - valor string.

`number` - valor numérico.

`boolean` - valor lógico `true`/`false`.

`null` - valor vacío explícito.

`address` - blockchain address. Para él se elige `Address type`: `EVM` o `SS58 (Substrate)`. Para SS58 address se puede indicar `SS58 prefix`, para que la interfaz y downstream-logic conozcan el formato del address.

`object` - objeto con nested properties. Después de elegir este tipo aparece el panel `Properties`, dentro del cual se usa el mismo schema editor.

`array` - array de elementos de un mismo tipo. Después de elegir este tipo aparece el editor anidado `Item`, donde se define el tipo de cada elemento del array.

`tuple` - array con un conjunto fijo de posiciones. Después de elegir este tipo aparece el panel `Items`, donde cada posición se describe por separado.

`balance` y `currency` pueden aparecer en imported Substrate schemas como hints adicionales del metadata layer. Para describir schema manualmente, normalmente es más sencillo pensar en el tipo real del valor: una cantidad puede ser `string` o `number`, y asset/currency id también puede ser `string` o `number`. La propia schema no tiene que decidir cómo formatear el valor para notification: los datos raw llegan desde source, y el owner de trigger hace la transformación necesaria en transform o providers.

`enum` - conjunto de variants, donde cada variant tiene nombre y tipo propio. Este tipo está disponible en output schema, pero está desactivado para trigger inputs y filters. Para inputs y filters hay que definir un valor concreto por el que subscription podrá comparar o filtrar source item; enum variants son demasiado ambiguos para este escenario.

`lookup` - referencia a un tipo desde metadata/IDL, por ejemplo un Substrate runtime type o un Solana custom defined type. Para él se elige `Lookup ref`. Este tipo es útil cuando hay que conservar la relación con runtime/source type en vez de describir la estructura manualmente.

`cascade` - helper de UI para seleccionar un único valor `string` mediante varios pasos lookup. Es útil para filters donde el valor final es difícil de escribir manualmente, pero puede encontrarse siguiendo una secuencia: primero elegir un grupo y después un elemento dentro de ese grupo. Cada paso tiene `ID` y `Lookup ref`; `Label` opcional solo afecta a la UI del subscription wizard. El orden de los pasos define las dependencias automáticamente: cada paso después del primero se carga con el valor del paso anterior. En la trigger schema se guarda igualmente como `string` con `io.ryabina.notify.type: "cascade"`, y las subscriptions siguen guardando una condition normal sobre el filter field original.

## Step 4. Data Providers

`Data providers` es un paso opcional. Providers se ejecutan de arriba hacia abajo y permiten enriquecer source item con datos externos o runtime antes de transform.

En templates y provider fields se puede usar:

- `{{source.*}}` - datos del evento original;
- `{{inputs.*}}` - valores de subscription;
- `{{providers.providerId.*}}` - resultado de providers anteriores.

Cada provider tiene weight. Al guardar trigger, el servicio calcula el weight total de todos los providers y lo comprueba contra el límite de trigger. Los límites se describen con detalle en [Limits](./limits.md#provider-weights).

Campos comunes de cada provider:

- `Type` - tipo de provider;
- `ID` - nombre por el que el resultado estará disponible como `providers.ID`;
- botón de test del provider;
- botón de eliminación del provider.

Todos los providers usan timeout de 10 segundos.

Provider types disponibles:

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Chain State`;
- `Value history`;
- `JavaScript`.

---

### HTTP <Badge type="info" text="Weight: 2" />

#### Method

HTTP method. Actualmente se elige entre métodos soportados.

#### URL

Endpoint al que provider enviará HTTP request.

#### Headers

Lista key-value de headers. Los valores soportan template substitutions.

#### Query Params

Lista key-value de query parameters. Los valores soportan template substitutions.

#### Body

Body JSON/template opcional para POST request. Body soporta template substitutions.

#### Retry until ready

Polling de readiness opcional y no bloqueante. Úsalo cuando una API externa indexa datos con retraso: el evento on-chain ya llegó, pero sus metadatos aparecen en la API solo unos segundos después. Sin retry el provider devuelve una respuesta vacía o incompleta, el transform aplica valores de fallback y los filtros de subscription sobre los output fields no coinciden.

Cuando la respuesta del provider "no está lista", la ejecución se aparca y se reintenta automáticamente más tarde. El worker no se bloquea durante la espera, el evento conserva su identidad original y el usuario recibe como máximo una notificación. El retry se ejecuta antes del transform y antes de los filtros de subscription, por lo que los filtros ven los datos enriquecidos. Un trigger esperando un retry no se considera roto.

Campos:

- `Enabled` - habilita el retry para el provider;
- `Attempts` - número máximo de reintentos, de 1 a 20;
- `Delay, ms` - pausa base entre intentos, de 250 a 60000;
- `Backoff` - cómo crece la pausa: `Fixed` - la misma pausa siempre, `Linear` - pausa × número de intento, `Exponential` - la pausa se duplica con cada intento;
- `When exhausted` - qué hacer cuando se agotan los intentos:
  - `Continue with last response` - continuar con la última respuesta tal cual; el transform aplica su propio fallback;
  - `Fail the provider` - tratar el provider como fallido: un provider `Optional` produce un resultado vacío, uno obligatorio termina la ejecución sin output;
- `Retry when` - condiciones que marcan la respuesta como "no lista":
  - `Empty array` - la respuesta es un array vacío;
  - `Missing path` - no hay valor en `Ready when path`;
  - `HTTP error` - la request falló con un error de red o un status no-2xx; sin este flag esos errores siguen siendo errores normales del provider;
- `Ready when path` - ruta a un campo de la respuesta que debe estar presente; los segmentos se separan con puntos, los índices de array son números;
- `Equals` - valor opcional al que debe ser igual el campo en `Ready when path`; soporta template substitutions, las cadenas hex se comparan sin distinguir mayúsculas.

El test del provider realiza un solo intento y no espera readiness - el polling solo ocurre en el runtime.

Ejemplo de configuración vía API/MCP:

```json
{
  "id": "item",
  "type": "http",
  "url": "https://api.example.com/items",
  "queryParams": { "id": "{{ source.args.0 }}" },
  "retry": {
    "attempts": 8,
    "delayMs": 5000,
    "backoff": "linear",
    "retryOn": ["empty_array", "missing_path"],
    "until": { "path": "0.id", "equals": "{{ source.args.0 }}" }
  }
}
```

Vía API/MCP también se aceptan `maxDelayMs` (tope de una sola pausa) y `maxElapsedMs` (presupuesto total de espera); estos no se muestran en la UI.

---

### GraphQL <Badge type="info" text="Weight: 2" />

#### Endpoint

GraphQL endpoint URL.

#### Headers

Headers key-value. Los valores soportan template substitutions.

#### Variables

Variables key-value para GraphQL query. Los valores soportan template substitutions.

#### Query

GraphQL query document.

#### Retry until ready

El provider GraphQL soporta la retry policy. Los campos y el comportamiento se describen en [HTTP -> Retry until ready](#retry-until-ready).

---

### Chain State <Badge type="info" text="Weight: 1" />

`Chain State` lee datos de estado desde blockchain source y añade el resultado al provider output.

#### State Type

Tipo de lectura: `EVM contract`, `Substrate storage` o `Solana account`.

#### EVM Contract <Badge type="tip" text="state type" />

Ejecuta un read call view/pure de un método del contrato EVM.

##### Source

EVM source. Por defecto se usa source del trigger.

##### Target Contract

Dirección del contrato para el read-call real. Soporta template, por ejemplo `{{ source.address }}`.

##### ABI Contract Address

Dirección del contrato desde cuyo ABI se deben cargar métodos. Se necesita si target contract es dinámico.

##### Read Method

Modo de selección de read method: `Auto` o `Manual`.

En `Auto`, wizard carga métodos view/pure desde ABI y propone elegir método. En `Manual`, se puede insertar signature y ABI fragment manualmente; args y output schema se sincronizan desde ABI fragment.

##### Method Arguments

Los campos de arguments aparecen si el method elegido acepta args.

#### Substrate Storage <Badge type="tip" text="state type" />

Lee una storage entry del Substrate runtime.

##### Source

Substrate source. Por defecto se usa source del trigger.

##### Module

Pallet/module.

##### Storage Entry

Storage item dentro de module.

Si storage entry tiene args, wizard crea un panel separado para cada arg. Los args opcionales se pueden activar y desactivar con el switch `Optional`.

##### Storage Arguments

Campos de arguments del storage entry seleccionado.

##### Block

Block number/hash/template opcional.

#### Solana Account <Badge type="tip" text="state type" />

Lee una Solana account y decodifica su contenido.

##### Source

Solana source. Por defecto se usa source del trigger.

##### Account

Public key de la account cuyo estado se debe leer. Soporta templates, por ejemplo `{{ source.accounts.base_mint }}`.

##### IDL

IDL JSON opcional con account definitions. Si se activa, el provider decodifica estrictamente con ese IDL. Si está desactivado, intenta resolver la schema automáticamente mediante `jsonParsed`, built-in layouts como SPL Token/Metaplex Metadata, o IDL automático por Anchor/Program Metadata.

El resultado queda disponible como `providers.<id>` e incluye campos base de account y `data` decodificado cuando se encuentra schema. Los resultados correctos se cachean brevemente para evitar RPC requests repetidos al mismo account.

---

### Value History <Badge type="info" text="Weight: 1" />

`Value history` guarda una ventana de últimos valores y calcula aggregates.

#### Partition By

Clave opcional para separar history en ventanas independientes. Por ejemplo, si se indica `{{ source.address }}`, provider guardará una history de valores separada para cada address, en lugar de una history común para todos los source items.

#### Dedupe By

Id único obligatorio del item actual para que el mismo evento no se cuente dos veces.

#### Keep Last

Tamaño de la ventana.

#### Value Type

Tipo del valor en la ventana.

#### Value

Valor que se añade a history. Se puede indicar una simple template string, por ejemplo `{{ source.amount }}`, o un JSON value: object, array, string, number, boolean/null.

Template substitutions se pueden usar dentro de JSON values. Por ejemplo, object puede reunir varios campos de source item en un único valor:

```json
{
  "account": "{{ source.account }}",
  "amount": "{{ source.amount }}",
  "asset": "{{ source.asset }}"
}
```

Si `Value type` se elige como `number`, el valor final debe poder convertirse a número; para object/array normalmente se elige el `Value type` correspondiente.

#### Aggregates

Aggregates adicionales para valores numéricos.

---

### RPC <Badge type="info" text="Weight: 1-2" />

Weight: `1` si se usa source runtime transport. Weight: `2` si se usa direct endpoint transport.

#### Transport

Cómo enviar RPC request: mediante source runtime o mediante direct endpoint.

Si transport va mediante source runtime, no se necesita direct endpoint.

#### Method

RPC method name.

#### Endpoint

URL, si está seleccionado endpoint transport.

#### Headers

JSON object headers para endpoint transport.

#### Params

JSON array params.

#### Custom Body

JSON-RPC body completo opcional para endpoint transport.

#### Retry until ready

El provider RPC soporta la retry policy. Los campos y el comportamiento se describen en [HTTP -> Retry until ready](#retry-until-ready).

---

### JavaScript <Badge type="info" text="Weight: 2" />

#### Variables

Variables key-value para la función.

#### Source

JavaScript function source.

JavaScript provider se usa cuando un valor adicional es más fácil de calcular con código basado en source, inputs y providers anteriores.

---

### Test Provider

Provider tiene un diálogo `Test Provider`.

En él hay que rellenar solo los template values que provider realmente usa. Los valores de providers anteriores se pueden pasar manualmente mediante paths `providers.*`. Si provider no contiene template references, el test se puede ejecutar inmediatamente.

## Step 5. Activation Condition

`Activation condition` es una condición JavaScript opcional.

Se activa con el switch `Optional`. Si la condición está desactivada, por defecto siempre devuelve `true`: trigger se considera activo para todos los source items que pasaron source matching.

Si la condición está activada, el código debe devolver un valor con el que engine decida si activar el procesamiento posterior. Esto es útil para lógica que no se puede expresar solo con filters schema o template rules.

Por ejemplo, un custom trigger puede basarse en un source event que técnicamente captura un conjunto amplio de eventos. Source puede entregar los datos necesarios, pero no puede describir completamente la business logic de activación: hay que comprobar varios campos, comparar valores, tener en cuenta el resultado de provider o saltar parte de los eventos por una regla adicional. En ese caso, source matching se deja amplio y en `Activation condition` se describe la condición final bajo la cual trigger realmente debe activarse.

## Step 6. Filters Schema

`Filters schema` describe los campos por los que subscriptions podrán filtrar trigger output.

Filters se parecen a inputs, pero se usan de otra manera. El usuario puede dejar filters vacíos si el escenario básico de subscription le basta. Si necesita personalización más precisa, filters permiten estrechar o concretar las condiciones de activación.

El editor soporta:

- `UI mode`;
- `JSON mode`;
- `Add property`;
- el mismo [schema editor](#schema-editor) que en `Inputs schema`.

`Source path` se necesita cuando el campo output no se llama igual que el campo original de source item. Engine aplica filters en dos etapas: early pre-filter por source data y luego conditions por el output formado. Si los nombres difieren, aquí se indica el path al campo original.

## Step 7. Output Schema

`Output schema` consta de dos paneles:

- `Raw output`;
- `Human output`.

`Raw output` describe el resultado machine-readable de trigger transform. Estos campos se usan en rules, filters, templates y downstream logic.

`Human output` describe el resultado legible para humanos en notifications. Se puede:

- dejar `Use same as raw`;
- desactivar `Use same as raw` y definir una schema propia.

Schema editor soporta `UI mode` y `JSON mode`.

Para `Raw output` y `Human output` se usa el mismo [schema editor](#schema-editor) que en `Inputs schema`, pero sin `Source path`: output schema describe el resultado ya formado del trigger, no matching por source item original. A diferencia de inputs y filters, output schema puede usar `enum`.

## Step 8. Transform

El paso empieza con `Output mode`.

En modo `Single output`, el paso contiene dos paneles JavaScript:

- `Raw transform`;
- `Human transform`.

`Raw transform` recibe source, inputs y providers, y devuelve un objeto que corresponde a `Raw output`.

`Human transform` recibe source, inputs, providers y raw output, y devuelve un objeto que corresponde a `Human output`.

En modo `Multi-output`, el paso contiene un panel JavaScript, `Output items transform`. Se usa cuando un source tick o provider query puede producir varios alert items independientes. El transform debe devolver:

```js
{
  outputs: [
    {
      raw: { /* campos correspondientes a Raw output */ },
      human: { /* campos correspondientes a Human output */ },
    },
  ],
}
```

Cada item de `outputs` se emite como un trigger output separado. Las schemas `Raw output` y `Human output` describen un item emitido, y cada item se valida con esas schemas.

El editor sugiere context disponible y muestra validation error si JavaScript es incorrecto.

## Step 9. Defaults

`Defaults` define templates recomendados de notification por defecto. Es un consejo del creador del trigger para el usuario que creará subscription: cómo titular la notification, qué datos mostrar en el texto corto y largo, qué icon, cover o links usar.

Estos valores no son obligatorios. Al crear subscription, el usuario puede dejar defaults como están o reemplazar completamente la apariencia y el texto de notification para su escenario.

Todos los paneles son opcionales y se activan con switches separados.

#### Title

Título de notification.

#### Short

Texto markdown corto.

#### Long

Texto markdown largo.

#### Icon

URL del icon.

#### Cover

URL del cover.

#### Avatar

URL del avatar de notification. Por defecto se usa la misma URL que en `Icon`.

#### Links

Array de links.

Cada fila contiene:

- `Title`;
- `Url`;
- botón de eliminación;
- `Add item` para añadir link.

Al guardar, cada link debe tener title y URL.

Los campos usan autocomplete y Handlebars/template helpers. Defaults se renderizan desde trigger output, por eso aquí no se usa context `source`, `inputs` ni `providers`.

Autocomplete sugiere:

- `block` - número de bloque, si existe en output;
- `index` - índice de item/event, si existe en output;
- `hash` - transaction/block hash, si existe en output;
- `meta` - metadata del trigger: `description`, `name`, `kind`, `scope`;
- `raw.*` - campos de raw output;
- `human.*` - campos de human output.

#### Handlebars Helpers

Defaults usa Handlebars syntax: `{{human.amount}}`, `{{#if human.amount}}...{{/if}}`, `{{round human.price digits=2}}`. Las reglas generales de expressions, blocks, paths y sub-expressions se describen en la documentación oficial de Handlebars: [Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html).

##### Built-in Helpers

`if` - conditional block. Renderiza contenido si el valor no es falsy.

`unless` - `if` inverso. Renderiza contenido si el valor es falsy.

`each` - itera array/object. Dentro del block se puede usar `this`, así como valores de servicio de Handlebars como `@index` para array y `@key` para object.

`with` - cambia el context actual dentro del block. Es útil cuando hay que referirse varias veces a un mismo objeto anidado.

`lookup` - obtiene dinámicamente un valor por key. Útil cuando el nombre del campo o índice está en otra variable.

##### Web3alert Helpers

`round` - redondea un número o string numérico. El parámetro `digits` define cantidad de cifras después del punto; `fixed=true` devuelve string con cantidad fija de cifras.

```handlebars
{{round human.price digits=2}}
{{round human.price digits=2 fixed=true}}
```

`format` - formatea raw integer amount teniendo en cuenta token decimals. Por ejemplo, el valor `1000000000000000000` con `decimals=18` se convierte en `1`.

```handlebars
{{format raw.value decimals=18}}
```

`substr` - devuelve parte de una string. `start` define la posición inicial; `start` negativo cuenta desde el final de la string; `len` limita la longitud.

```handlebars
{{substr hash start=0 len=10}}
{{substr hash start=-8}}
```

`address` - formatea blockchain address para notification. Si el address existe en address book del workspace, devuelve alias; en caso contrario acorta el address conocido a una forma compacta.

```handlebars
{{address raw.from}}
```

`make` - reemplaza recursivamente addresses dentro de object, array o string por valores de address book cuando es posible. Es útil para mostrar estructuras con varios addresses.

```handlebars
{{yaml (make raw.participants)}}
```

`includes` - comprueba si array contiene el string-value indicado. Normalmente se usa dentro de `if`.

```handlebars
{{#if (includes raw.tags "whale")}}Whale transfer{{/if}}
```

`lowercase` - convierte string a lowercase.

```handlebars
{{lowercase meta.name}}
```

`uppercase` - convierte string a uppercase.

```handlebars
{{uppercase meta.scope}}
```

`titlecase` - convierte string a Title Case.

```handlebars
{{titlecase meta.name}}
```

`oneline` - reemplaza saltos de línea por espacios.

```handlebars
{{oneline human.summary}}
```

`yaml` - serializa object/array a YAML string.

```handlebars
{{yaml human}}
```

## Step 10. Test & Save

El último paso permite comprobar trigger antes de guardarlo.

Si trigger tiene inputs schema, primero se muestran los campos test inputs.

Para blockchain trigger se indican:

- `Block` - número de bloque para simulación;
- `Item index` - índice opcional de item, si en el bloque se encontraron varios eventos adecuados.

Para timer trigger se usa el timestamp actual.

Después de test run se muestran:

- status `Valid result` o `Invalid result`;
- `Source items on block`;
- lista de issues, si result es invalid;
- `Source input`;
- `Trigger output`;
- `Debug`.

Después de una comprobación exitosa o de omitirla conscientemente, trigger se puede guardar. La posibilidad de test run puede depender del pricing plan/account tier.
