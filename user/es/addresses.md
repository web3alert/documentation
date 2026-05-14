# Addresses

`Addresses` es la libreta de direcciones del workspace actual.

Guarda blockchain addresses y aliases claros para ellos, para que en subscriptions y notificaciones se pueda trabajar no solo con direcciones técnicas largas, sino también con nombres humanos: `Treasury`, `Main wallet`, `Alice validator`, `Ops multisig`.

## Para qué sirven addresses

Addresses ayudan en tres escenarios principales.

### Rellenar subscriptions más rápido

Cuando [Create subscription](subscription-wizard.md) tiene un campo address, la interfaz puede sugerir direcciones desde address book.

Es cómodo si workspace se suscribe a menudo a los mismos wallets, contracts, validators o accounts.

### Leer subscriptions con más claridad

Las direcciones de address book son más fáciles de reconocer en inputs y filters.

Por ejemplo, en lugar de recordar cada vez qué wallet se esconde detrás de un largo `0x...`, se puede guardar alias `Treasury` y usarlo como nombre claro.

### Mejorar notification defaults

En [notification defaults](trigger-wizard.md#defaults) se pueden usar los Handlebars helpers `address` y `make`.

Toman address desde trigger output y, si ese address existe en address book del workspace actual, muestran alias. Si no se encuentra alias, helper deja la dirección como está o la acorta a una forma compacta.

Esto es especialmente útil en notificaciones donde hay varias direcciones: sender, receiver, contract, validator, delegator o multisig.

## Workspace scope

Address book pertenece al workspace actual.

Si se cambia de workspace, la lista de addresses cambia. Esto es importante: address `Treasury` en un workspace y address `Treasury` en otro workspace pueden ser entidades distintas.

Los usuarios con permisos de gestión de workspace pueden gestionar addresses. Si el usuario no tiene esos permisos, la sección `Addresses` no está disponible para ver ni editar.

Address book no confirma propiedad de address y no da acceso a wallet. Es solo un directorio de aliases para configurar y mostrar alerts más cómodamente.

## Tipos de address

Al añadir address, primero se elige el tipo. El tipo se necesita para validación y para buscar alias correctamente al renderizar notificaciones.

### Plain

Valor string arbitrario.

Se usa cuando hay que guardar no un blockchain address estándar, sino otro identificador que igualmente conviene etiquetar con alias.

### Substrate (ss58 format)

Address del ecosistema Substrate/Polkadot en formato SS58.

Al guardar, UI normaliza SS58 address a un formato canonical interno y en la lista lo muestra de nuevo como SS58. Esto permite comparar la misma account incluso si fue introducida en distintas variantes SS58.

### Bitcoin

Bitcoin address.

Adecuado para Bitcoin-style addresses que se usan en Bitcoin subscriptions y notificaciones.

### Ethereum (EVM)

EVM address en formato `0x...`.

Adecuado para redes compatibles con Ethereum: Ethereum, Polygon, Base, Arbitrum, Optimism, Celo y otras EVM networks.

Al buscar alias, EVM addresses se comparan sin tener en cuenta mayúsculas/minúsculas.

### Cosmos

Cosmos/Bech32 address.

Al guardar, UI normaliza Bech32 address al prefix base `cosmos`, para que el mismo address pueda compararse de forma más estable.

## Lista de addresses

La sección `Addresses` muestra address book del workspace actual.

### Alias

Nombre legible del address.

Alias se muestra en la lista, se usa en helpers y ayuda a reconocer address en subscriptions y notificaciones.

### Type

Tipo de address: `plain`, `ss58`, `bitcoin`, `evm` o `cosmos`.

### Address

El address en sí.

En la lista puede mostrarse formateado. Para direcciones largas, la interfaz puede acortar el centro en pantallas estrechas, pero al copiar se usa el address completo.

### Network icons

Si address se usa en subscriptions, junto a él pueden aparecer iconos de networks/projects relacionados.

Esto ayuda a entender dónde ya se usa un address concreto.

### Copy

El botón copia el address completo.

### Edit

Permite cambiar alias.

Address y type permanecen iguales: si hay que sustituir el address en sí, es mejor eliminar la entrada antigua y añadir una nueva.

### Delete

Elimina address de address book.

Eliminarlo no elimina subscriptions, pero después de eliminarlo alias ya no se insertará en sugerencias ni en notification helpers.

## Add address

`Add address` abre el formulario de creación de una nueva entrada.

### Address type

Primero se elige el tipo de address.

Después de elegir tipo, aparecen los campos `Name` y `Address`.

### Name

Alias opcional.

Si name no se rellena, alias será igual al propio address. Si name se rellena, debe tener al menos tres caracteres y no debe duplicar alias de otro address del mismo tipo.

Es mejor elegir un nombre corto y claro que se vea bien en notificaciones: `Treasury`, `Bridge hot wallet`, `Validator stash`.

### Address

Campo obligatorio con address value.

Address no debe contener espacios, debe pasar validación del tipo elegido y no debe duplicar un address ya guardado del mismo tipo.

### Add address

Guarda la entrada en address book del workspace actual.

Después de guardar, el formulario se reinicia y el nuevo address aparece en la lista.

## Uso en subscription wizard

Address book se usa en campos descritos por schema como address.

Cuando el usuario introduce address en subscription inputs o filters, la interfaz puede mostrar entradas adecuadas de address book. Se puede elegir un address guardado en lugar de copiarlo manualmente.

Si en dropdown aparece una entrada innecesaria, se puede eliminar directamente desde address input. Esto eliminará la entrada de address book del workspace.

## Uso en notification templates

Address book es especialmente útil en defaults y overrides de notificaciones.

### address helper

`address` acepta un valor.

Si el valor es un blockchain address conocido y se encuentra en address book, helper devuelve alias. Si no se encuentra alias, el address conocido se acorta a una forma compacta.

Ejemplo:

```handlebars
{{address raw.from}}
```

### make helper

`make` acepta string, object o array y reemplaza recursivamente los addresses encontrados por aliases.

Es cómodo cuando output contiene una estructura con varias direcciones.

Ejemplo:

```handlebars
{{make raw}}
```

Si dentro de `raw` hay addresses de address book, en la notificación se mostrarán aliases en su lugar.
