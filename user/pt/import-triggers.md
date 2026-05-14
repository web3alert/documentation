# Import Triggers

`Import triggers` é um wizard para gerar rapidamente um conjunto de triggers a partir de configs ou metadata indicadas, por exemplo a partir do ABI de um contrato EVM ou da metadata de um pallet Substrate.

É um caso simplificado e específico da criação de triggers. É útil quando é preciso criar muitos triggers do mesmo tipo: por exemplo, todos os eventos de um contrato ERC20 ou todos os events de um pallet específico. Se precisares de um cenário exato com configuração manual completa, usa [Add trigger / Edit trigger](trigger-wizard.md).

Import triggers é geração automática, por isso depois do import vale a pena testar os triggers gerados e garantir que os alerts aparecem exatamente como esperado. Para eventos simples, o resultado gerado muitas vezes já é suficiente, mas para estruturas complexas é melhor configurar também transform, human output e defaults: simplificar dados aninhados, formatar valores e endereços, remover campos técnicos desnecessários e deixar na notificação apenas o que é realmente útil para o utilizador.

## Step 1. Source

No primeiro passo seleciona-se `Source network`.

A lista contém [data sources](data-sources.md) que podem ser usados para geração:

- EVM sources;
- Substrate sources;
- custom sources, se forem adequados ao projeto.

A opção [Add new source](data-sources.md#add-data-source) abre a criação de [data source](data-sources.md) e volta para o import wizard.

O wizard verifica que foi selecionado um source e que ele tem um network type claro.

## Step 2.a. Generate for EVM

Para um source EVM, preenchem-se os seguintes painéis.

### Category

Categoria dos futuros triggers, por exemplo `Token transfers`.

### ABI contract address

Endereço do contrato a partir do qual o ABI deve ser carregado.

### Use as trigger filter

Interruptor que determina se o endereço do contrato será incorporado no trigger filter.

### ABI

JSON ABI carregado automaticamente ou colado manualmente.

### Load ABI from contract address

Botão que inicia o carregamento do ABI pelo contract address indicado.

Se `Use as trigger filter` estiver ativo, os triggers criados farão match apenas com eventos desse contrato. Se estiver desativado, o endereço é usado apenas para carregar o ABI, e os próprios triggers farão match com qualquer contrato que tenha a signature selecionada.

O ABI deve ser um array JSON. Se o ABI não for carregado automaticamente, pode ser colado manualmente.

## Step 2.b. Generate for Substrate

Para um source Substrate seleciona-se `Pallet`.

A interface mostra:

- nome do pallet;
- número de events/extrinsics disponíveis na metadata;
- runtime version;
- botão `Generate triggers from pallet`.

Depois da geração, o wizard constrói draft triggers a partir do pallet selecionado e leva o utilizador para review.

## Step 3. Review & import

Em review é apresentada uma tabela de candidatos.

Ações disponíveis:

- selecionar tudo;
- remover seleção;
- selecionar triggers individuais;
- ver o nome do trigger;
- ver o tipo;
- ver a categoria;
- ver preview description/schema;
- criar apenas os triggers selecionados com `Create selected triggers`.

Depois de um import bem-sucedido, a interface regressa à aba [Triggers](projects.md#triggers) do projeto.
