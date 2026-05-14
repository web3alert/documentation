# Add Trigger / Edit Trigger

`Add trigger` abre o wizard detalhado de criação de trigger. Este wizard define todo o ciclo de vida do evento: desde a leitura de source item até aos notification defaults finais.

A edição de um trigger existente usa o mesmo wizard, mas com valores já preenchidos.

Se for necessário criar rapidamente muitos triggers semelhantes a partir de ABI ou metadata, pode usar [Import triggers](import-triggers.md). É um cenário massivo simplificado sobre a ideia geral de criação de triggers.

## Step 1. Description

Neste passo, trigger recebe um nome compreensível e uma breve explicação do que faz. Isto ajuda depois a reconhecer rapidamente o trigger no projeto, templates, subscriptions e outros locais onde é necessário escolher ou verificar o cenário correto.

### Title

Nome visível obrigatório do trigger. É mostrado na interface onde o utilizador escolhe, visualiza ou verifica trigger, por isso é melhor mantê-lo curto e claro.

### ID

Slug de sistema do trigger dentro do projeto. É gerado automaticamente a partir do título e no formulário aparece como disabled field, para que o utilizador veja o identificador futuro, mas não o altere manualmente.

### Description

Descrição opcional do trigger. Vale a pena ativá-la se apenas o title não deixar claro que evento é monitorizado, que dados são usados ou em que cenário este trigger é necessário.

### Category

Categoria obrigatória do trigger. Ajuda a agrupar triggers em tabelas, templates e rules, para que projetos grandes continuem compreensíveis e fáceis de pesquisar.

## Step 2. Source

Neste passo escolhe-se o que inicia o trigger: um timer regular ou um evento de blockchain data source. O tipo escolhido determina o conjunto dos painéis seguintes.

### Trigger Type

Escolha obrigatória do tipo base de trigger.

`timer` é usado para ativações regulares por intervalo. `blockchain` é usado para events, extrinsics, calls, blocks ou transactions de [Data sources](data-sources.md).

### Timer

#### Interval

Intervalo obrigatório com que timer trigger deve ser ativado.

Formato de interval: número e unidade de tempo, por exemplo:

- `30s`;
- `5m`;
- `1h`;
- `1d`.

### Blockchain

#### Source

Escolha obrigatória de data source de onde trigger vai ler dados blockchain/runtime.

A lista mostra sources disponíveis do projeto. Se não houver uma source adequada, é possível ir para [Add new source](data-sources.md#add-data-source).

A source escolhida determina o ramo seguinte de configuração: EVM ou Substrate.

### Blockchain - EVM

#### Source Item

Escolha obrigatória do tipo de dados que trigger recebe de EVM source: `event`, `call`, `block` ou `transaction`.

Para `event` e `call`, o wizard configura adicionalmente ABI e signature. Para `block` e `transaction`, ABI e signature não são necessários.

#### ABI Contract Address

Endereço do contrato pelo qual o wizard tenta carregar ABI e sugerir events ou calls disponíveis.

Se `Use as trigger filter` estiver ligado, trigger será ativado apenas para este contract address. Se o switch estiver desligado, o endereço é usado apenas para carregar ABI, e o próprio trigger poderá fazer match com qualquer contrato com a signature escolhida.

#### Event Signature / Call Signature

Signature obrigatória do evento ou método que deve iniciar trigger.

Se ABI for carregado com sucesso, signature pode ser escolhida na lista. Se ABI não for encontrado, o contrato for dinâmico ou a signature necessária não estiver na lista, o valor pode ser introduzido manualmente.

### Blockchain - Substrate

#### Source Item

Escolha obrigatória do tipo de Substrate item: `event`, `call`/`extrinsic` ou `block`.

Para `event` e `call`, o wizard sugere adicionalmente escolher pallet e entry concreta. Para `block`, pallet e event/extrinsic não são necessários.

#### Pallet

Pallet obrigatório de runtime metadata da Substrate source escolhida.

A lista é carregada a partir de metadata source. Está disponível apenas para selection modes `event` e `call`/`extrinsic`.

#### Event / Extrinsic

Entry obrigatória dentro do pallet selecionado.

Para `event`, escolhe-se um evento do pallet. Para `call`/`extrinsic`, escolhe-se extrinsic. O wizard mostra runtime version para ficar claro de que metadata foram carregadas as opções disponíveis.

### Source Payload

O source item escolhido define a estrutura `source.*` que ficará disponível mais tarde no wizard: em inputs/templates, providers, activation condition, filters, data transform e defaults.

#### Timer

| Path | Type | Description |
| --- | --- | --- |
| `source.now` | `string` | ISO timestamp do timer run atual. |
| `source.timestampMs` | `number` | Unix timestamp em milissegundos para o timer run atual. |

#### EVM Event

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address que emitiu o event. |
| `source.blockNumber` | `number` | Número do bloco onde o event foi encontrado. |
| `source.blockHash` | `string` | Hash do bloco onde o event foi encontrado. |
| `source.transactionHash` | `string` | Hash da transaction dentro da qual estava o event. |
| `source.transactionIndex` | `number` | Índice da transaction dentro do bloco. |
| `source.index` | `number` | Índice do event/log dentro da transaction ou bloco. |
| `source.data` | `string` | Raw encoded event data. |
| `source.topics` | `array<string>` | Topics do EVM log. |
| `source.args` | `array` | Decoded ABI arguments em ordem posicional. Se ABI for conhecido, o wizard sugere também `source.args[index]` com nomes dos argumentos. |

#### EVM Call

| Path | Type | Description |
| --- | --- | --- |
| `source.address` | `address` | Contract address associado ao matched call. |
| `source.blockNumber` | `number` | Número do bloco onde o call foi encontrado. |
| `source.blockHash` | `string` | Hash do bloco onde o call foi encontrado. |
| `source.transactionHash` | `string` | Hash da transaction dentro da qual estava o call. |
| `source.transactionIndex` | `number` | Índice da transaction dentro do bloco. |
| `source.index` | `number` | Índice do call/source item. |
| `source.from` | `address` | Caller address. |
| `source.to` | `address` | Target contract address. |
| `source.data` | `string` | Raw encoded calldata. |
| `source.args` | `array` | Decoded ABI arguments em ordem posicional. Se ABI for conhecido, o wizard sugere também `source.args[index]` com nomes dos argumentos. |

#### EVM Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Número do bloco. |
| `source.hash` | `string \| null` | Hash do bloco. |
| `source.timestamp` | `number` | Timestamp do bloco. |
| `source.transactionsCount` | `number` | Quantidade de transactions no bloco. |
| `source.gasLimit` | `string \| null` | Gas limit do bloco em raw units, se source o fornecer. |
| `source.gasUsed` | `string \| null` | Gas usado por todas as transactions do bloco, se source o fornecer. |
| `source.baseFeePerGas` | `string \| null` | Base fee per gas do bloco, se source o fornecer. |
| `source.blobGasUsed` | `string \| null` | Blob gas usado pelo bloco, se source o fornecer. |
| `source.excessBlobGas` | `string \| null` | Excess blob gas do bloco, se source o fornecer. |

#### EVM Transaction

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número do bloco onde a transaction foi incluída. |
| `source.block.hash` | `string \| null` | Hash do bloco onde a transaction foi incluída. |
| `source.block.timestamp` | `number` | Timestamp do bloco. |
| `source.index` | `number` | Índice da transaction dentro do bloco. |
| `source.hash` | `string` | Hash da transaction. |
| `source.type` | `string` | Tipo normalizado de transaction, por exemplo `legacy` ou `eip1559`. |
| `source.from` | `address` | Sender address. |
| `source.to` | `address \| null` | Recipient address ou `null` para contract creation. |
| `source.nonce` | `number` | Account nonce da transaction. |
| `source.gasLimit` | `string` | Gas limit em raw units. |
| `source.gasPrice` | `string` | Gas price em raw units. |
| `source.maxPriorityFeePerGas` | `string \| null` | EIP-1559 max priority fee, se disponível. |
| `source.maxFeePerGas` | `string \| null` | EIP-1559 max fee, se disponível. |
| `source.maxFeePerBlobGas` | `string \| null` | Blob gas fee, se disponível. |
| `source.input` | `string` | Raw transaction input calldata. |
| `source.value` | `string` | Native token amount em raw base units. |
| `source.methodId` | `string \| null` | Primeiros 4 bytes do calldata selector, se existirem. |

#### Substrate Event

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número do bloco onde o event foi encontrado. |
| `source.block.hash` | `string` | Hash do bloco onde o event foi encontrado. |
| `source.block.timestamp` | `number` | Timestamp do bloco em milissegundos. |
| `source.index` | `number` | Índice do event dentro do bloco. |
| `source.module` | `string` | Pallet/module name. |
| `source.event` | `string` | Event name dentro do pallet. |
| `source.type` | `string \| null` | Phase type do evento. |
| `source.extrinsic` | `number \| null` | Índice de extrinsic para events `ApplyExtrinsic`. |
| `source.data` | `array` | Decoded event data em ordem posicional. O wizard sugere também `source.data[index]` com nomes dos argumentos de metadata. |

#### Substrate Extrinsic

| Path | Type | Description |
| --- | --- | --- |
| `source.block.number` | `number` | Número do bloco onde extrinsic foi encontrado. |
| `source.block.hash` | `string` | Hash do bloco onde extrinsic foi encontrado. |
| `source.block.timestamp` | `number` | Timestamp do bloco em milissegundos. |
| `source.index` | `number` | Índice de extrinsic dentro do bloco. |
| `source.module` | `string` | Pallet/module name. |
| `source.call` | `string` | Extrinsic method name. |
| `source.args` | `array` | Decoded extrinsic arguments em ordem posicional. O wizard sugere também `source.args[index]` com nomes dos argumentos de metadata. |
| `source.result` | `string \| null` | Execution result do matched extrinsic. |
| `source.sender` | `address \| null` | Origin account que enviou extrinsic. |
| `source.signature` | `object \| null` | Dados de assinatura de extrinsic. |
| `source.signature.nonce` | `number` | Nonce da assinatura. |
| `source.signature.digest` | `string` | Signature digest. |
| `source.path` | `string` | Nested call path para matched extrinsic. |

#### Substrate Block

| Path | Type | Description |
| --- | --- | --- |
| `source.number` | `number` | Número do bloco. |
| `source.hash` | `string` | Hash do bloco. |
| `source.parentHash` | `string` | Hash do bloco pai. |
| `source.timestamp` | `number` | Timestamp do bloco em milissegundos. |
| `source.stateRoot` | `string` | State root do bloco. |
| `source.extrinsicsRoot` | `string` | Extrinsics root do bloco. |

## Step 3. Inputs Schema

`Inputs schema` descreve parâmetros que o utilizador define ao criar uma subscription.

Inputs parecem-se com filters, por isso são fáceis de confundir. A diferença principal: inputs são obrigatórios e definem dados base sem os quais a subscription não pode funcionar. Filters são opcionais e servem para personalização adicional depois dos inputs obrigatórios estarem preenchidos.

O editor suporta dois modos:

- `UI mode` - campos são adicionados através do Schema editor visual;
- `JSON mode` - schema é editada como JSON.

<a id="schema-editor"></a>

### Schema Editor

Schema editor é usado em vários passos do wizard. Em `Inputs schema`, descreve campos que o utilizador preenche ao criar subscription; em `Filters schema` e `Output schema`, usa-se o mesmo princípio de edição.

Em `UI mode`, schema consiste em properties. Cada property pode ser expandida, contraída, eliminada e configurada através de um conjunto de painéis.

#### Property

`Name` - nome técnico do campo dentro de schema. É usado em paths, templates e código JavaScript, por isso deve ser curto, estável e claro. Para object properties, name torna-se a key do objeto. Para array item, name não é usado, porque array descreve um tipo comum de elemento.

`Type` - tipo de valor. O tipo escolhido determina que painéis adicionais aparecem abaixo.

`Source path` - ligação opcional ao path original `source.*`. É necessária quando o campo de schema tem nome diferente do campo original de source item, mas engine deve saber que source-value usar para early filtering. Na maioria das vezes `Source path` é necessário em filters, às vezes pode ser útil em inputs, mas não é usado em output schema.

#### Property Types

`string` - valor string.

`number` - valor numérico.

`boolean` - valor lógico `true`/`false`.

`null` - valor vazio explícito.

`address` - blockchain address. Para ele escolhe-se `Address type`: `EVM` ou `SS58 (Substrate)`. Para SS58 address, pode ser indicado `SS58 prefix`, para que a interface e downstream-logic saibam o formato do address.

`object` - objeto com nested properties. Depois de escolher este tipo aparece o painel `Properties`, dentro do qual é usado o mesmo schema editor.

`array` - array de elementos do mesmo tipo. Depois de escolher este tipo aparece o editor aninhado `Item`, onde é definido o tipo de cada elemento do array.

`tuple` - array com um conjunto fixo de posições. Depois de escolher este tipo aparece o painel `Items`, onde cada posição é descrita separadamente.

`balance` e `currency` podem aparecer em imported Substrate schemas como hints adicionais do metadata layer. Para descrever schema manualmente, normalmente é mais simples pensar no tipo real do valor: uma quantia pode ser `string` ou `number`, e asset/currency id também pode ser `string` ou `number`. A própria schema não precisa decidir como formatar o valor para notification: os dados raw chegam de source, e o owner de trigger faz a transformação necessária em transform ou providers.

`enum` - conjunto de variants, onde cada variant tem nome e tipo próprio. Este tipo está disponível em output schema, mas está desativado para trigger inputs e filters. Para inputs e filters é necessário definir um valor concreto pelo qual subscription poderá comparar ou filtrar source item; enum variants são demasiado ambíguos para este cenário.

`lookup` - referência a um tipo de Substrate metadata. Para ele escolhe-se `Lookup ref`. Este tipo é útil quando é preciso preservar a relação com runtime type em vez de descrever a estrutura manualmente.

## Step 4. Data Providers

`Data providers` é um passo opcional. Providers são executados de cima para baixo e permitem enriquecer source item com dados externos ou runtime antes de transform.

Em templates e provider fields pode usar:

- `{{source.*}}` - dados do evento original;
- `{{inputs.*}}` - valores de subscription;
- `{{providers.providerId.*}}` - resultado de providers anteriores.

Cada provider tem weight. Ao guardar trigger, o serviço calcula o weight total de todos os providers e verifica-o contra o limite de trigger. Os limites são descritos em detalhe em [Limits](./limits.md#provider-weights).

Campos comuns de cada provider:

- `Type` - tipo de provider;
- `ID` - nome pelo qual o resultado ficará disponível como `providers.ID`;
- botão de teste do provider;
- botão de eliminação do provider.

Todos os providers usam timeout de 10 segundos.

Provider types disponíveis:

- `HTTP`;
- `GraphQL`;
- `RPC`;
- `Chain State`;
- `Value history`;
- `JavaScript`.

### HTTP

Weight: `2`.

#### Method

HTTP method. Atualmente é escolhido entre métodos suportados.

#### URL

Endpoint para onde provider envia HTTP request.

#### Headers

Lista key-value de headers. Os valores suportam template substitutions.

#### Query Params

Lista key-value de query parameters. Os valores suportam template substitutions.

#### Body

Body JSON/template opcional para POST request. Body suporta template substitutions.

### GraphQL

Weight: `2`.

#### Endpoint

GraphQL endpoint URL.

#### Headers

Headers key-value. Os valores suportam template substitutions.

#### Variables

Variables key-value para GraphQL query. Os valores suportam template substitutions.

#### Query

GraphQL query document.

### Chain State

`Chain State` lê dados de estado de blockchain source e adiciona o resultado ao provider output.

Weight: `1`.

#### State Type

Tipo de leitura: `EVM contract` ou `Substrate storage`.

#### EVM Contract

##### Source

EVM source. Por defeito é usado source do trigger.

##### Target Contract

Endereço do contrato para o read-call real. Suporta template, por exemplo `{{ source.address }}`.

##### ABI Contract Address

Endereço do contrato de cujo ABI se devem carregar métodos. É necessário se target contract for dinâmico.

##### Read Method

Modo de seleção de read method: `Auto` ou `Manual`.

Em `Auto`, wizard carrega métodos view/pure de ABI e sugere escolher method. Em `Manual`, pode inserir signature e ABI fragment manualmente; args e output schema são sincronizados a partir de ABI fragment.

##### Method Arguments

Os campos de arguments aparecem se o method escolhido aceitar args.

#### Substrate Storage

##### Source

Substrate source. Por defeito é usado source do trigger.

##### Module

Pallet/module.

##### Storage Entry

Storage item dentro de module.

Se storage entry tiver args, wizard cria um painel separado para cada arg. Args opcionais podem ser ligados e desligados com o switch `Optional`.

##### Storage Arguments

Campos de arguments do storage entry selecionado.

##### Block

Block number/hash/template opcional.

### Value History

`Value history` guarda uma janela dos últimos valores e calcula aggregates.

Weight: `1`.

#### Partition By

Chave opcional para separar history em janelas independentes. Por exemplo, se for indicado `{{ source.address }}`, provider guarda uma history de valores separada para cada address, em vez de uma history comum para todos os source items.

#### Dedupe By

Id único obrigatório do item atual para que o mesmo evento não seja contado duas vezes.

#### Keep Last

Tamanho da janela.

#### Value Type

Tipo do valor na janela.

#### Value

Valor que é adicionado à history. Pode indicar uma template string simples, por exemplo `{{ source.amount }}`, ou um JSON value: object, array, string, number, boolean/null.

Template substitutions podem ser usadas dentro de JSON values. Por exemplo, object pode reunir vários campos de source item num único valor:

```json
{
  "account": "{{ source.account }}",
  "amount": "{{ source.amount }}",
  "asset": "{{ source.asset }}"
}
```

Se `Value type` for escolhido como `number`, o valor final deve poder ser convertido para número; para object/array normalmente escolhe-se o `Value type` correspondente.

#### Aggregates

Aggregates adicionais para valores numéricos.

### RPC

Weight: `1`, se for usado source runtime transport. Weight: `2`, se for usado direct endpoint transport.

#### Transport

Como enviar RPC request: através de source runtime ou direct endpoint.

Se transport for através de source runtime, direct endpoint não é necessário.

#### Method

RPC method name.

#### Endpoint

URL, se endpoint transport estiver selecionado.

#### Headers

JSON object headers para endpoint transport.

#### Params

JSON array params.

#### Custom Body

JSON-RPC body completo opcional para endpoint transport.

### JavaScript

Weight: `2`.

#### Variables

Variables key-value para a função.

#### Source

JavaScript function source.

JavaScript provider é usado quando um valor adicional é mais fácil de calcular com código baseado em source, inputs e providers anteriores.

### Test Provider

Provider tem um diálogo `Test Provider`.

Nele é necessário preencher apenas os template values que provider realmente usa. Valores de providers anteriores podem ser passados manualmente através de paths `providers.*`. Se provider não contiver template references, o teste pode ser executado imediatamente.

## Step 5. Activation Condition

`Activation condition` é uma condição JavaScript opcional.

É ativada pelo switch `Optional`. Se a condição estiver desligada, por defeito devolve sempre `true`: trigger é considerado ativo para todos os source items que passaram source matching.

Se a condição estiver ativa, o código deve devolver um valor pelo qual engine decide se ativa o processamento seguinte. Isto é útil para lógica que não pode ser expressa apenas com filters schema ou template rules.

Por exemplo, um custom trigger pode basear-se num source event que tecnicamente captura um conjunto amplo de eventos. Source consegue devolver os dados necessários, mas não consegue descrever completamente a business logic de ativação: é preciso verificar vários campos, comparar valores, considerar o resultado de provider ou ignorar parte dos eventos por uma regra adicional. Nesse caso, source matching fica amplo, e em `Activation condition` descreve-se a condição final em que trigger deve realmente ser ativado.

## Step 6. Filters Schema

`Filters schema` descreve campos pelos quais subscriptions poderão filtrar trigger output.

Filters parecem-se com inputs, mas são usados de forma diferente. O utilizador pode deixar filters vazios se o cenário básico de subscription for suficiente. Se for necessária personalização mais precisa, filters permitem estreitar ou clarificar as condições de ativação.

O editor suporta:

- `UI mode`;
- `JSON mode`;
- `Add property`;
- o mesmo [schema editor](#schema-editor) que em `Inputs schema`.

`Source path` é necessário quando o campo output tem nome diferente do campo original de source item. Engine aplica filters em duas etapas: early pre-filter por source data e depois conditions pelo output formado. Se os nomes forem diferentes, indique aqui o path para o campo original.

## Step 7. Output Schema

`Output schema` consiste em dois painéis:

- `Raw output`;
- `Human output`.

`Raw output` descreve o resultado machine-readable de trigger transform. Estes campos são usados em rules, filters, templates e downstream logic.

`Human output` descreve o resultado legível para humanos em notifications. Pode ser:

- deixado como `Use same as raw`;
- desligado de `Use same as raw` e configurado com uma schema própria.

Schema editor suporta `UI mode` e `JSON mode`.

Para `Raw output` e `Human output` usa-se o mesmo [schema editor](#schema-editor) que em `Inputs schema`, mas sem `Source path`: output schema descreve o resultado já formado do trigger, não matching pelo source item original. Ao contrário de inputs e filters, output schema pode usar `enum`.

## Step 8. Transform

O passo contém dois painéis JavaScript:

- `Raw transform`;
- `Human transform`.

`Raw transform` recebe source, inputs e providers, e devolve um objeto correspondente a `Raw output`.

`Human transform` recebe source, inputs, providers e raw output, e devolve um objeto correspondente a `Human output`.

O editor sugere context disponível e mostra validation error se JavaScript estiver incorreto.

## Step 9. Defaults

`Defaults` define templates recomendados de notification por defeito. É uma recomendação do criador do trigger para o utilizador que criará subscription: como intitular a notification, que dados mostrar no texto curto e longo, que icon, cover ou links usar.

Estes valores não são obrigatórios. Ao criar subscription, o utilizador pode deixar defaults como estão ou substituir completamente a aparência e o texto de notification para o seu cenário.

Todos os painéis são opcionais e ativados por switches separados.

#### Title

Título de notification.

#### Short

Texto markdown curto.

#### Long

Texto markdown longo.

#### Icon

URL do icon.

#### Cover

URL do cover.

#### Avatar

URL do avatar de notification. Por defeito, é usado o mesmo URL que em `Icon`.

#### Links

Array de links.

Cada linha contém:

- `Title`;
- `Url`;
- botão de eliminação;
- `Add item` para adicionar link.

Ao guardar, cada link deve ter title e URL.

Os campos usam autocomplete e Handlebars/template helpers. Defaults são renderizados a partir de trigger output, por isso aqui não se usa context `source`, `inputs` ou `providers`.

Autocomplete sugere:

- `block` - número do bloco, se existir em output;
- `index` - índice do item/event, se existir em output;
- `hash` - transaction/block hash, se existir em output;
- `meta` - metadata do trigger: `description`, `name`, `kind`, `scope`;
- `raw.*` - campos de raw output;
- `human.*` - campos de human output.

#### Handlebars Helpers

Defaults usa Handlebars syntax: `{{human.amount}}`, `{{#if human.amount}}...{{/if}}`, `{{round human.price digits=2}}`. As regras gerais de expressions, blocks, paths e sub-expressions estão descritas na documentação oficial de Handlebars: [Built-in Helpers](https://handlebarsjs.com/guide/builtin-helpers.html).

##### Built-in Helpers

`if` - conditional block. Renderiza conteúdo se o valor não for falsy.

`unless` - `if` inverso. Renderiza conteúdo se o valor for falsy.

`each` - itera array/object. Dentro do block pode usar `this`, bem como valores de serviço Handlebars como `@index` para array e `@key` para object.

`with` - altera o context atual dentro do block. Útil quando é necessário referir várias vezes o mesmo objeto aninhado.

`lookup` - obtém dinamicamente um valor por key. Útil quando o nome do campo ou índice está noutra variável.

##### Web3alert Helpers

`round` - arredonda um número ou string numérica. O parâmetro `digits` define o número de casas depois do ponto; `fixed=true` devolve string com número fixo de casas.

```handlebars
{{round human.price digits=2}}
{{round human.price digits=2 fixed=true}}
```

`format` - formata raw integer amount considerando token decimals. Por exemplo, o valor `1000000000000000000` com `decimals=18` torna-se `1`.

```handlebars
{{format raw.value decimals=18}}
```

`substr` - devolve parte de uma string. `start` define a posição inicial; `start` negativo conta a partir do fim da string; `len` limita o comprimento.

```handlebars
{{substr hash start=0 len=10}}
{{substr hash start=-8}}
```

`address` - formata blockchain address para notification. Se o address existir em address book do workspace, devolve alias; caso contrário encurta o address conhecido para forma compacta.

```handlebars
{{address raw.from}}
```

`make` - substitui recursivamente addresses dentro de object, array ou string por valores de address book quando possível. Útil para mostrar estruturas com vários addresses.

```handlebars
{{yaml (make raw.participants)}}
```

`includes` - verifica se array contém o string-value indicado. Normalmente é usado dentro de `if`.

```handlebars
{{#if (includes raw.tags "whale")}}Whale transfer{{/if}}
```

`lowercase` - converte string para lowercase.

```handlebars
{{lowercase meta.name}}
```

`uppercase` - converte string para uppercase.

```handlebars
{{uppercase meta.scope}}
```

`titlecase` - converte string para Title Case.

```handlebars
{{titlecase meta.name}}
```

`oneline` - substitui quebras de linha por espaços.

```handlebars
{{oneline human.summary}}
```

`yaml` - serializa object/array para YAML string.

```handlebars
{{yaml human}}
```

## Step 10. Test & Save

O último passo permite verificar trigger antes de guardar.

Se trigger tiver inputs schema, primeiro são mostrados os campos test inputs.

Para blockchain trigger, indicam-se:

- `Block` - número do bloco para simulação;
- `Item index` - índice opcional de item, se no bloco forem encontrados vários eventos correspondentes.

Para timer trigger, é usado o timestamp atual.

Depois de test run são mostrados:

- status `Valid result` ou `Invalid result`;
- `Source items on block`;
- lista de issues, se result for invalid;
- `Source input`;
- `Trigger output`;
- `Debug`.

Depois de uma verificação bem-sucedida ou de ignorar conscientemente a verificação, trigger pode ser guardado. A possibilidade de test run pode depender do pricing plan/account tier.
