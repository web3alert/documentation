# Create Subscription

`Create subscription` é o wizard que cria uma nova subscription para o workspace ativo. Nele, o utilizador escolhe o que subscrever, define condições e escolhe actions para entrega de alerts.

O wizard pode ser aberto a partir da secção geral [Subscriptions](subscriptions.md), da página de um [project](projects.md) ou através do botão `Subscribe` de um [template](templates.md). Se o wizard for aberto a partir de project/template, parte da seleção já vem preenchida.

## Estrutura geral do wizard

O wizard é composto por duas partes principais:

- `Trigger` - seleção de project/template/trigger, topics, inputs e filters;
- `Action` - seleção do canal de entrega e configuração de parâmetros da action.

Se o wizard for aberto a partir da secção geral `Subscriptions`, primeiro é preciso escolher project. Se for aberto a partir da página de project, a escolha de project é ignorada.

## Step 1. Project

Este passo aparece quando a subscription é criada a partir da secção geral, sem project previamente selecionado.

### Project picker

Permite escolher o project a subscrever.

Depois da escolha do project, o wizard passa para a configuração de trigger/template. Se project já tiver sido passado na URL, por exemplo a partir da página de project ou template, este passo é ignorado.

## Step 2. Trigger

Neste passo escolhe-se o que exatamente vai disparar alerts.

Se o project suporta templates e triggers diretos, o wizard mostra a escolha do método de criação da subscription.

### Templates

`Templates` são cenários de subscrição prontos, preparados pelo owner do project.

Este caminho costuma ser mais simples: o utilizador escolhe template, depois topic e preenche apenas os inputs necessários aos topics escolhidos.

### Events and calls

`Events and calls` é a escolha direta de trigger.

Este caminho está mais próximo da configuração técnica: o utilizador escolhe trigger category, um trigger concreto e define inputs/filters se estiverem disponíveis.

## Template flow

Template flow é usado se for escolhido `Templates` ou se o utilizador clicar em `Subscribe` num template.

### Choose a template

Se o project tiver vários templates, o wizard propõe escolher o template necessário.

Se houver apenas um template, o wizard pode passar diretamente para a escolha dos seus topics.

### Choose a category

Dentro de um template, topics podem estar agrupados por category/template group.

O utilizador escolhe um grupo para ver topics e inputs relacionados.

### Pick the triggers and fill in the required fields

Neste passo o utilizador escolhe topics e preenche inputs.

Topics são checkboxes dentro do template. É possível escolher um ou vários topics.

Inputs podem ser:

- common - comuns a vários topics escolhidos;
- unique - pertencem apenas a um topic específico.

Se um topic exige input, este deve ser preenchido antes de avançar para actions.

## Direct trigger flow

Direct trigger flow é usado se for escolhido `Events and calls`.

### Trigger category

Triggers são agrupados por categorias. Em project flow, as categorias normalmente correspondem a grupos de triggers do projeto.

### Trigger

Trigger concreto que será usado pela subscription.

Depois de escolher trigger, o wizard mostra description se existir e abre os parâmetros do trigger.

### Inputs

Inputs são valores obrigatórios ou opcionais que o trigger espera do utilizador.

Por exemplo, um trigger pode pedir um endereço, um limite de valor ou outro parâmetro. Os campos são construídos a partir da schema do trigger.

### Filters

Filters permitem restringir alerts e evitar notificações desnecessárias.

Se filters não forem necessários, podem não ser adicionados. Se forem adicionados vários filters, podem ser combinados com lógica `AND` e `OR`:

- `AND` - o evento deve passar todas as condições do grupo;
- `OR` - o evento deve passar pelo menos um grupo de condições.

### Add a filter

Adiciona uma nova condição.

Para o filter escolhe-se um campo, operador e valor. Os campos disponíveis dependem da trigger schema.

### Delivery type

Controla com que frequência a subscription entrega alerts depois de inputs e filters fazerem match.

- `Every match` envia todos os eventos que passam pelos filters.
- `Once` envia apenas o primeiro evento que faz match nesta subscription.
- `Once per key` envia o primeiro evento que faz match para cada output value selecionado. Escolha um `Key path` estável, como um campo de market, event, account ou user. Evite valores técnicos únicos como transaction hash ou block number, exceto quando cada evento deve ser tratado como uma nova key.

## Step 3. Action

Neste passo escolhe-se para onde enviar alerts.

### Simple mode

Simple mode mostra resources disponíveis e permite escolher um ou vários canais de entrega.

É o cenário principal para a criação normal de subscription: escolher Telegram, Discord, webhook ou outro resource já ligado ao workspace.

### Add new resource

Abre o formulário de criação de resource, se o canal necessário ainda não existir.

Resources são descritos em detalhe em [Resources](resources.md).

### Advanced mode

Advanced mode está disponível para direct trigger flow. Permite escolher action type manualmente, preencher action parameters e, se a action suportar, configurar notification overrides.

Para template flow usa-se a escolha simples de resources, porque o template já define o cenário de subscrição para o utilizador.

### Choose the action type

Escolha de uma action concreta, por exemplo envio para Telegram, Discord ou outro canal.

### Set parameters

Parâmetros da action selecionada. Normalmente incluem resource para onde o alert deve ser enviado e campos adicionais se a action os exigir.

## Notification overrides

Se a action suportar overrides, é possível ativar campos separados e substituir defaults da notificação.

### Title

Título da notificação.

### Short

Texto curto da notificação.

### Message

Texto longo da notificação.

### Icon

URL do ícone.

### Cover

URL da capa.

### Avatar

URL do avatar da notificação.

### Links

Links na notificação. Para cada link define-se title e URL.

Overrides suportam Handlebars/template syntax e Markdown quando a action o permite. Os valores são renderizados a partir do trigger output, por isso é possível usar campos raw/human output e helpers descritos em [Defaults](trigger-wizard.md#handlebars-helpers).

## Test run

No passo final está disponível `Test run`.

Test run permite verificar a draft subscription antes de guardar: rules, filters, inputs e actions escolhidos. No resultado é possível ver se o evento correspondeu às condições e que actions seriam executadas.

Se test run mostrar issues, é melhor corrigir a subscription antes de guardar.

## Save alert

`Save alert` cria ou atualiza a subscription.

Depois de guardar com sucesso, o wizard devolve o utilizador:

- à secção geral [Subscriptions](subscriptions.md), se a subscription foi criada a partir daí;
- à aba [Subscriptions](projects.md#subscriptions) do project específico, se o wizard foi aberto a partir de project flow;
- à página original, se o wizard foi aberto com um `returnTo` especial.

## Edit, duplicate e delete

Uma subscription já criada pode ser aberta para edição a partir da lista [Subscriptions](subscriptions.md).

`Duplicate` abre o wizard com as configurações da subscription existente, mas guarda o resultado como uma nova subscription.

`Delete` elimina a subscription. Depois da eliminação, alerts desta subscription deixam de ser enviados.
