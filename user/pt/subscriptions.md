# Subscriptions

`Subscriptions` são regras de utilizador para receber alerts. Uma subscription liga o project escolhido, trigger ou template, parâmetros do utilizador, condições de filtragem e actions através das quais o Web3alert envia notificações.

Simplificando, um project descreve a integração disponível, [triggers](triggers.md) e [templates](templates.md) descrevem aquilo a que é possível subscrever, e uma subscription é a configuração concreta do workspace: o que acompanhar exatamente, com que condições e para onde enviar o resultado.

## O que uma subscription liga

### Workspace

Uma subscription pertence ao workspace ativo. Por isso, a lista de subscriptions mostra as configurações do workspace atual, não apenas do utilizador atual.

Se o utilizador mudar de workspace, vê e gere outro conjunto de subscriptions.

### Project

Cada subscription está ligada a um project. O project define a integração do marketplace, triggers disponíveis, templates, metadata e access level.

Na página do project, a aba [Subscriptions](projects.md#subscriptions) mostra a mesma lista de subscriptions que a secção geral [Subscriptions](subscriptions.md), mas filtrada pelo project específico.

### Trigger ou template

Uma subscription pode ser criada de duas formas:

- através de um [template](templates.md), quando o utilizador escolhe um cenário pronto e topics;
- diretamente através de um [trigger](triggers.md), quando o utilizador precisa de uma configuração mais precisa de evento, inputs e filters.

Um template dentro de uma subscription expande-se em rules. Uma rule indica que trigger usar e que conditions aplicar.

### Inputs e filters

Inputs são valores que o utilizador preenche ao criar uma subscription. Podem ser necessários diretamente ao trigger ou a template rules.

Filters são condições adicionais que limitam o fluxo de alerts. Por exemplo, é possível receber notificações apenas para um endereço específico, token id ou valor.

Para template subscriptions, parte dos filters pode já estar preparada pelo owner do project. Nesse caso, o utilizador preenche apenas inputs claros, e o template aplica-os nas rules.

### Actions

Actions definem onde e como as notificações são entregues.

Normalmente uma action está ligada a um [resource](resources.md): Telegram chat, Discord channel, webhook ou outro canal de entrega. Uma subscription pode ter uma ou várias actions.

### Notification overrides

Para algumas actions é possível substituir a aparência da notificação: title, short/long message, icon, cover, avatar e links.

Se overrides não forem definidos, são usados defaults do trigger/template. Defaults são recomendações do criador do trigger, não uma regra rígida: o utilizador pode mantê-los ou substituí-los para o seu cenário.

## Como funciona uma subscription

Quando source traz um novo evento, o Web3alert verifica os triggers do project. Se um trigger formar output, o engine aplica as rules da subscription: inputs, filters, template conditions e activation logic.

Se o evento corresponder à subscription, o Web3alert forma o notification payload e envia-o para as actions selecionadas.

Se o evento não passar as condições, a notificação não é enviada.

## Estados da subscription

### On

A subscription está ativa e pode enviar alerts.

### Off

A subscription foi desligada pelo utilizador ou criada em estado desligado. Mantém as configurações, mas não envia alerts.

### Blocked

A subscription está bloqueada pelo serviço. Normalmente isto está relacionado com permissões, limites, disponibilidade de project/trigger/template ou outra causa que precisa de ser corrigida.

Uma subscription bloqueada não deve ser tratada como eliminada: as configurações permanecem, mas o envio de alerts fica parado até a causa ser resolvida.

## Lista de subscriptions

Na secção `Subscriptions` é possível:

- procurar subscriptions por address, event ou filter;
- ligar e desligar uma subscription;
- abrir edição;
- duplicar uma subscription;
- executar um test run;
- partilhar um link para a configuração;
- eliminar uma subscription.

A tabela mostra:

- `Triggers` - trigger/template escolhido, topics, inputs e filters;
- `Actions` - canais de entrega;
- `Settings` - estado e ações de gestão.

## Criação

O processo detalhado de criação é descrito em [Create subscription](subscription-wizard.md).
