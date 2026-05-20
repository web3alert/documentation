# Triggers

`Triggers` são regras técnicas do projeto que determinam que eventos o Web3alert lê de uma data source, como verifica as condições de ativação e que resultado forma para a subscription e as actions relacionadas.

Triggers podem ser usados diretamente ou através de templates. Um trigger direto é adequado quando o utilizador precisa de configuração precisa de source, inputs, filters e defaults. Template é conveniente quando o project owner quer reunir um ou vários triggers num cenário de subscrição pronto, com topic compreensível e regras predefinidas. O caminho a escolher depende do caso concreto.

Trigger liga várias partes do serviço:

- [Projects](projects.md) - o projeto onde trigger é criado e apresentado;
- [Data sources](data-sources.md) - fonte de dados blockchain/runtime;
- [Subscriptions](subscriptions.md) - subscriptions de utilizador que usam trigger diretamente ou através de template rules;
- [Resources](resources.md) e [Addresses](addresses.md) - entidades externas que podem ser usadas em inputs, filters ou notification defaults.

## Como criar triggers

Existem dois caminhos principais:

- [Add trigger / Edit trigger](trigger-wizard.md) - o wizard detalhado principal. É usado para criar e editar trigger manualmente, desde source até notification defaults;
- [Import triggers](import-triggers.md) - wizard massivo simplificado. Gera um conjunto de triggers a partir dos configs ou metadata indicados, por exemplo a partir de ABI de um contrato EVM, metadata de um pallet Substrate ou IDL de um program Solana, e depois permite escolher quais guardar.

Se for necessário configurar um cenário exato ou editar um trigger existente, normalmente usa-se [Add trigger / Edit trigger](trigger-wizard.md). Se for necessário obter rapidamente muitos triggers semelhantes a partir de uma descrição externa de contrato ou pallet, é mais conveniente começar por [Import triggers](import-triggers.md).

Um projeto tem limite de quantidade de triggers. Se o projeto já atingiu o limite, novos triggers não poderão ser guardados até o limite ser aumentado ou alguns triggers existentes serem removidos. Isto é descrito com mais detalhe em [Limits](limits.md#project-triggers).
