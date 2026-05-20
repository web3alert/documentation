# Import Triggers

`Import triggers` es un wizard para generar rápidamente un conjunto de triggers a partir de configs o metadata indicadas, por ejemplo desde el ABI de un contrato EVM, la metadata de un pallet Substrate o el IDL de un program Solana.

Es un caso simplificado y específico de creación de triggers. Es útil cuando necesitas crear muchos triggers del mismo tipo: por ejemplo, todos los eventos de un contrato ERC20 o todos los events de un pallet concreto. Si necesitas un escenario exacto con configuración manual completa, usa [Add trigger / Edit trigger](trigger-wizard.md).

Import triggers es autogeneración, por eso después del import conviene probar los triggers generados y asegurarse de que los alerts se ven exactamente como se esperaba. Para eventos simples, el resultado generado suele ser suficiente de inmediato, pero para estructuras complejas es mejor configurar también transform, human output y defaults: simplificar datos anidados, formatear importes y direcciones, eliminar campos técnicos innecesarios y dejar en la notificación solo lo que realmente es útil para el usuario.

## Step 1. Source

En el primer paso se selecciona `Source network`.

La lista contiene [data sources](data-sources.md) que pueden usarse para generar:

- EVM sources;
- Substrate sources;
- Solana sources;
- custom sources, si encajan con el proyecto.

La opción [Add new source](data-sources.md#add-data-source) abre la creación de [data source](data-sources.md) y después vuelve al import wizard.

El wizard comprueba que se haya seleccionado un source y que tenga un network type claro.

## Step 2.a. Generate for EVM

Para un source EVM se completan los siguientes paneles.

### Category

Categoría de los triggers futuros, por ejemplo `Token transfers`.

### ABI contract address

Dirección del contrato desde la que hay que cargar el ABI.

### Use as trigger filter

Interruptor que define si la dirección del contrato se incrustará en el trigger filter.

### ABI

JSON ABI cargado automáticamente o pegado manualmente.

### Load ABI from contract address

Botón que inicia la carga del ABI desde el contract address indicado.

Si `Use as trigger filter` está activado, los triggers creados solo harán match con eventos de ese contrato. Si está desactivado, la dirección se usa solo para cargar el ABI, y los triggers harán match con cualquier contrato que tenga la signature seleccionada.

El ABI debe ser un array JSON. Si el ABI no se carga automáticamente, puede pegarse manualmente.

## Step 2.b. Generate for Substrate

Para un source Substrate se selecciona `Pallet`.

La interfaz muestra:

- nombre del pallet;
- cantidad de events/extrinsics disponibles en metadata;
- runtime version;
- botón `Generate triggers from pallet`.

Después de generar, el wizard construye draft triggers desde el pallet seleccionado y lleva al usuario a review.

## Step 2.c. Generate for Solana

Para un source Solana, indica `Category`, `Program ID`, `IDL` y `Source item`.

El IDL puede cargarse automáticamente desde Anchor IDL account o Program Metadata. Si no se puede cargar, hay que pegar el IDL JSON manualmente. Sin IDL no se generan triggers Solana, porque no se pueden decodificar de forma fiable events, instructions, arguments y accounts.

Solana import soporta `Event` y `Call`. `Call` corresponde a una Solana instruction, aunque la UI mantiene el término común `Call`.

## Step 3. Review & import

En review se muestra una tabla de candidatos.

Acciones disponibles:

- seleccionar todo;
- quitar selección;
- seleccionar triggers individuales;
- ver el nombre del trigger;
- ver el tipo;
- ver la categoría;
- ver preview description/schema;
- crear solo los triggers seleccionados con `Create selected triggers`.

Después de un import correcto, la interfaz vuelve a la pestaña [Triggers](projects.md#triggers) del proyecto.
