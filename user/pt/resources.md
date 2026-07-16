# Resources

`Resources` são canais de entrega ligados e endpoints externos que o workspace usa para enviar alerts.

Simplificando, uma subscription define aquilo a que se quer subscrever, e resource responde à pergunta “para onde enviar o resultado”: para um Telegram chat, Discord channel, Slack channel ou webhook URL.

## Para que servem resources

Resource guarda a ligação a um canal ou endpoint concreto. Assim, o mesmo canal pode ser usado em várias [subscriptions](subscriptions.md), sem ser introduzido novamente de cada vez.

Por exemplo, um workspace pode criar:

- Telegram resource para o chat principal da equipa;
- Discord resource para o canal de monitorização;
- Webhook resource para o próprio backend endpoint;
- Slack resource para um canal de trabalho.

Depois, ao criar uma [subscription](subscription-wizard.md), o utilizador simplesmente escolhe o resource necessário no passo `Action`.

## Como resources se relacionam com actions

`Action` descreve o método de envio da notificação: Telegram message, Discord webhook, Slack webhook ou HTTP webhook.

`Resource` guarda o destino concreto dessa action:

- para Telegram - chat ligado;
- para Discord - webhook URL do canal;
- para Slack - webhook URL do canal;
- para Webhook - URL do teu endpoint.

No modo simples de criação de subscription, a interface mostra resources como lista de canais de entrega disponíveis. Em advanced mode, uma action pode pedir para escolher resource como um dos parâmetros.

## Workspace scope

Resources pertencem ao workspace atual. Se mudares de workspace, a lista de resources também muda.

Utilizadores com permissões de gestão do workspace podem gerir resources. Se o utilizador não tiver essas permissões, a secção `Resources` não fica disponível para visualização nem edição.

## Resource blueprint

Cada resource é criado a partir de um blueprint. Blueprint define o tipo de resource, ícone, nome na UI e campos que devem ser preenchidos.

Atualmente estão disponíveis quatro tipos de resources.

### Telegram

Telegram resource envia alerts para um chat privado, group, topic de um forum ou channel.

Só um owner do workspace Web3alert pode iniciar o setup ou alterar este destino.
Este requisito de role no Web3alert é separado das permissões de administrator
do chat Telegram descritas abaixo.

Usa uma external setup session segura. Abra o Telegram a partir do formulário do
resource e escolha no bot um destes destinos:

- o chat privado com o bot;
- um group ou supergroup;
- um channel;
- `General` ou um topic específico de um forum group.

Para ligar um group, forum ou channel, o utilizador que faz o setup tem de ser
owner ou administrator com permissão para adicionar e promover o bot. O bot
Web3alert também tem de ser administrator. Num channel precisa de permissão para
publicar mensagens; num group ou forum deve poder gerir o chat e enviar
mensagens.

Depois de escolher um forum, selecione `Use General` para enviar alerts para
General. Para usar outro topic, abra-o no Telegram e envie `/bindtopic` dentro
desse topic.

Esta confirmação impede que um chat id arbitrário seja guardado como destino. A
setup session expira após 15 minutos.

### Discord

Discord resource é usado para enviar alerts para Discord channel através de webhook.

No formulário indica-se o `URL` do Discord webhook. Ele deve ser criado nas definições do canal Discord necessário e colado no resource.

### Slack

Slack resource é usado para enviar alerts para Slack channel através de Incoming WebHook.

No formulário indica-se o `URL` do Slack webhook. Ele deve ser criado nas definições do Slack workspace/channel e colado no resource.

### Webhook

Webhook resource é usado para enviar alerts para qualquer HTTP endpoint.

No formulário indica-se o `URL` para o qual o Web3alert vai enviar notification payload. Este tipo é útil se alerts precisarem de ser enviados para backend próprio, automation system ou outro serviço externo.

## Lista de resources

Na secção `Resources` são mostrados resources do workspace atual.

Para cada resource são mostrados:

### Icon

Ícone do tipo de resource. Vem do blueprint.

### Title

Nome legível do resource. Pode ser usado como nome curto e claro do canal, por exemplo `Main Telegram`, `Ops Discord` ou `Backend webhook`.

### State

Estado textual do resource, se existir.

Para external resources, o estado ajuda a perceber se a ligação está concluída. Por exemplo, Telegram resource pode não estar disponível para escolha em subscription enquanto a ligação não estiver confirmada.

### Actions

Resource tem um menu de gestão. Através dele é possível abrir edição ou eliminar resource.

## Add resource

`Add resource` abre o formulário de criação de resource.

### Type

Primeiro escolhe-se o tipo de resource: Telegram, Discord, Slack ou Webhook.

Se o formulário for aberto a partir de [Create subscription](subscription-wizard.md), a lista de tipos pode ficar limitada aos resources adequados para a action selecionada.

### Title

Nome visível do resource na interface.

É melhor escolher um nome pelo significado do canal, e não pelo tipo técnico: por exemplo `Alerts channel`, `DAO ops`, `Main backend webhook`.

### Name

Slug estável do resource dentro do workspace.

Name faz parte do fullname do resource e é usado como identificador interno. Normalmente é preenchido automaticamente a partir de title, mas pode ser editado antes de guardar.

Depois da criação do resource, name já não pode ser alterado.

### URL

Este campo aparece para resources Discord, Slack e Webhook.

Nele cola-se o webhook URL do serviço correspondente. Para Discord e Slack, URL é validado pelo formato da plataforma específica.

### Configure in Telegram

Para Telegram usa-se `Configure in Telegram` em vez de URL. Num resource já
configurado, o mesmo flow aparece como `Change destination`.

O serviço cria uma setup session de 15 minutos e abre o bot Web3alert. O link de
setup de utilização única não deve ser guardado nem incluído em logs. Termine a
escolha do destino no Telegram e volte ao Web3alert; o resource fica ready
quando o bot confirma a seleção.

O rebind é atómico. Enquanto o setup estiver pendente, os alerts existentes
continuam a usar o destino atual. O target só muda depois de uma confirmação
bem-sucedida; cancelar, deixar expirar a session ou um erro mantêm o target
anterior.

### Add a resource

Para Discord, Slack e Webhook, o botão `Add a resource` cria imediatamente o resource se todos os campos obrigatórios estiverem preenchidos corretamente.

## Edit resource

`Edit` abre o formulário de edição de um resource existente.

É possível alterar title e campos de ligação se o tipo de resource o suportar. Name permanece read-only porque faz parte do fullname estável.

Se resource for usado em subscriptions, alterar URL ou ligação afeta todas as subscriptions que enviam alerts para esse resource. O Telegram mantém o destino anterior até o novo setup terminar com sucesso.

## Delete resource

`Delete` remove resource do workspace.

Antes da eliminação, é importante verificar se resource é usado em subscriptions ativas. Se um canal de entrega for eliminado, subscriptions que apontavam para ele deixarão de conseguir enviar alerts através desse resource.
