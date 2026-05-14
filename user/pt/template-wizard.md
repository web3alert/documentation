# Add Template / Edit Template

`Add template` abre o wizard de criação de template dentro do projeto. Este wizard ajuda a montar um cenário de subscrição para o utilizador por cima de [triggers](triggers.md) já existentes: descrever o template, definir inputs, criar topics e ligar cada topic a triggers através de rules.

A edição de um template existente usa o mesmo processo, mas o formulário abre com valores já guardados.

Antes de criar um template, normalmente vale a pena preparar os triggers: criá-los manualmente através de [Add trigger / Edit trigger](trigger-wizard.md) ou gerá-los através de [Import triggers](import-triggers.md). Um template não cria triggers sozinho. Usa triggers que já existem no projeto.

## Step 1. Metadata

Neste passo são definidos os principais dados do template. Eles aparecem ao utilizador na aba `Templates` do projeto e ajudam a perceber para que cenário o template foi criado.

### Template title

Título visível do template. É melhor mantê-lo curto e significativo: por exemplo `Token transfers`, `Governance events`, `Validator activity`.

### Template name

Slug interno do template dentro do projeto. É formado a partir do title, mas pode ser editado manualmente.

Name deve ser estável: é usado em URL e nas ligações de topics/rules. Depois de publicar um template, é melhor não alterar name sem necessidade.

### Description

Descrição do template. Aqui vale a pena explicar que alerts o utilizador poderá receber através deste template e quando deve escolhê-lo.

## Step 2. Inputs

Neste passo descrevem-se os inputs que o utilizador vai preencher ao criar uma subscription através do template.

Inputs nem sempre são necessários. Se um topic não exige parâmetros do utilizador e todas as rules usam condições fixas, o template pode não ter inputs.

Se um input for usado numa rule através de `Use inputs`, o utilizador terá de o preencher no subscription wizard.

### Input

Cada input descreve um valor disponível para os topics/rules deste template.

### Name

Nome técnico do input. É usado nas rules como `inputs.<name>`, por isso deve ser curto, estável e claro.

### Type

Tipo de valor que o utilizador vai introduzir.

Tipos disponíveis:

- `string` - string normal;
- `number` - número;
- `boolean` - true/false;
- `null` - valor vazio;
- `object` - objeto com campos aninhados;
- `array` - array de valores do mesmo tipo;
- `tuple` - array com um conjunto fixo de elementos;
- `address` - blockchain address;
- `balance` - token/native balance;
- `currency` - valor monetário.

Para a maioria dos template inputs, é melhor escolher tipos simples. Quanto mais simples for o input, mais claro será para o utilizador criar uma subscription.

As restantes propriedades do input são configuradas através do mesmo [schema editor](trigger-wizard.md#schema-editor) usado em [Add trigger / Edit trigger](trigger-wizard.md). Aí são descritas metadata dos campos, configurações de address/balance e estruturas aninhadas para object, array e tuple.

## Step 3. Topics

Neste passo é apresentada a lista de topics dentro do template e as ações para os gerir.

Um topic é uma opção de subscrição dentro de um template. O utilizador pode escolher um ou vários topics ao criar uma subscription.

### Add topic

Abre o wizard de criação de topic.

Se o template ainda não tiver sido guardado, a interface primeiro guarda as alterações do template e depois abre a criação de topic.

### Topics table

A tabela mostra os topics do template atual.

Colunas:

- `Topic` - title e name do topic;
- `Description` - descrição do topic;
- `Rules` - primeiro trigger/rule ligado e número de rules adicionais;
- `Actions` - ações edit/delete.

### Edit topic

Abre o topic wizard para o topic selecionado.

### Delete topic

Elimina o topic e as rules ligadas a ele do template. Antes da eliminação, é apresentada uma confirmação.

## Topic wizard

Topic wizard abre a partir do Step 3 do template wizard. É usado tanto para criar como para editar um topic.

## Topic Step 1. Metadata

Neste passo define-se como o topic aparecerá ao utilizador no subscription wizard.

### Title

Título visível do topic.

Por exemplo: `Transfers`, `Mints`, `Burns`, `Large deposits`.

### Name

Nome interno do topic. É formado a partir do title, mas pode ser editado.

Topic name é normalizado pela interface: espaços e separadores são convertidos em pontos, por exemplo `Balances transfer` torna-se `balances.transfer`. Este não é o formato global de todos os slugs do serviço, mas o formato atual especificamente para topic keys, porque topics muitas vezes parecem namespaces de eventos. O requisito principal é que name seja curto, claro e estável.

### Description

Descrição opcional do topic. Explica o que muda se o utilizador ativar este topic.

### Selected by default

Define se o topic será selecionado automaticamente ao abrir o subscription wizard.

Isto é útil para o topic principal ou mais popular do template. Se demasiados topics forem selecionados por defeito, a subscription pode ficar ruidosa, por isso é melhor escolher apenas topics realmente básicos.

## Topic Step 2. Rules

Neste passo o topic é ligado a um ou vários triggers.

Uma rule diz que trigger usar e que condições devem ser cumpridas para o evento entrar neste topic.

### Rule

Uma rule liga o topic a um trigger.

Se o topic deve reagir a vários triggers, é possível adicionar várias rules através de `Add rule`.

### Trigger category

Filtro da lista de triggers por categoria. Ajuda a encontrar mais depressa o trigger necessário num projeto grande.

### Trigger

Trigger concreto que a rule vai usar.

Depois de escolher o trigger, o wizard carrega os campos disponíveis para filters a partir da trigger schema.

### Filters

Condições opcionais da rule.

Se filters não forem definidos, a rule usa todos os eventos do trigger selecionado. Se filters forem definidos, o evento entra no topic apenas quando as condições forem cumpridas.

### Add a filter

Adiciona uma condição de filtragem.

Num filter escolhe-se um campo de trigger output ou filters schema, um operador e um valor.

### Select filter

Campo do trigger pelo qual o evento deve ser filtrado.

Para campos object, é possível entrar na estrutura e escolher um campo aninhado.

### Operator

Operador de comparação.

Opções disponíveis:

- equals;
- not equal;
- greater than;
- greater or equal;
- less than;
- less or equal.

Para condições numéricas, a UI mostra switches compactos de operadores.

### Value

Valor com o qual o campo selecionado é comparado.

Value pode ser definido de duas formas:

- literal value - valor fixo diretamente na rule;
- template input - valor dos inputs que o utilizador preenche ao criar a subscription.

### Use inputs

Muda o filter de valor fixo para valor vindo de template inputs.

Por exemplo, um template pode ter input `wallet`. Então uma rule pode filtrar o campo `from` ou `to` por `{{ inputs.wallet }}`. O utilizador introduz o endereço uma vez no subscription wizard, e a topic rule usa-o como condição.

### AND / OR logic

Vários filters dentro de um grupo funcionam como `AND`: o evento deve passar todas as condições do grupo.

Se as condições forem separadas com `OR`, o wizard cria vários grupos: o evento deve passar pelo menos um dos grupos.

### Remove all filters

Elimina todos os filters da rule. Depois disso, a rule volta a aceitar todos os eventos do trigger selecionado.

### Add rule

Adiciona mais uma rule ao topic.

Isto é necessário se um topic deve combinar vários triggers. Por exemplo, o topic `Token activity` pode incluir rules separadas para transfer, mint e burn events.

## Save

`Save template` guarda metadata, inputs, topics e rules.

`Save topic` guarda o topic e devolve o utilizador ao template flow.

Depois de guardar, o template aparece na aba [Templates](projects.md#templates) do projeto. Se o template contiver pelo menos um topic e não tiver issues, os utilizadores poderão abrir `Subscribe` e [criar uma subscription](subscription-wizard.md) através deste template.
