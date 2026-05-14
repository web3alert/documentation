# Triggers

`Triggers` son reglas técnicas del proyecto que determinan qué eventos lee Web3alert desde una data source, cómo comprueba las condiciones de activación y qué resultado forma para la subscription y sus actions relacionadas.

Triggers se pueden usar directamente o mediante templates. Un trigger directo sirve cuando el usuario necesita una configuración precisa de source, inputs, filters y defaults. Template es útil cuando el project owner quiere agrupar uno o varios triggers en un escenario de suscripción preparado, con un topic comprensible y reglas predefinidas. El camino adecuado depende del caso concreto.

Trigger conecta varias partes del servicio:

- [Projects](projects.md) - el proyecto dentro del cual se crea y muestra trigger;
- [Data sources](data-sources.md) - fuente de datos blockchain/runtime;
- [Subscriptions](subscriptions.md) - subscriptions de usuario que usan trigger directamente o mediante template rules;
- [Resources](resources.md) y [Addresses](addresses.md) - entidades externas que pueden usarse en inputs, filters o notification defaults.

## Cómo crear triggers

Hay dos caminos principales:

- [Add trigger / Edit trigger](trigger-wizard.md) - el wizard detallado principal. Se usa para crear y editar trigger manualmente, desde source hasta notification defaults;
- [Import triggers](import-triggers.md) - wizard masivo simplificado. Genera un conjunto de triggers a partir de configs o metadata indicados, por ejemplo a partir de ABI de un contrato EVM o metadata de un pallet Substrate, y luego permite elegir cuáles guardar.

Si necesitas configurar un escenario exacto o editar un trigger existente, normalmente se usa [Add trigger / Edit trigger](trigger-wizard.md). Si necesitas obtener rápidamente muchos triggers similares a partir de una descripción externa de contrato o pallet, es más cómodo empezar con [Import triggers](import-triggers.md).

El proyecto tiene un límite de cantidad de triggers. Si el proyecto ya alcanzó el límite, no se podrán guardar nuevos triggers hasta que el límite aumente o se eliminen algunos triggers existentes. Esto se describe con más detalle en [Limits](limits.md#project-triggers).
