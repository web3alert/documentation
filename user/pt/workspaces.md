# Workspaces

`Workspace` é o espaço de trabalho do Web3alert onde uma equipa guarda e configura os seus projetos, subscriptions, resources de entrega, data sources e address book.

De forma simples, account é responsável pelo login pessoal, perfil e billing do utilizador, enquanto workspace é responsável pela colaboração e pelos dados de trabalho do serviço.

Um account pode pertencer a vários workspaces. O active workspace é selecionado no menu esquerdo e determina que entidades o utilizador vê nas secções principais do serviço:

- [Projects](projects.md) - projetos criados no workspace e marketplace projects disponíveis;
- [Subscriptions](subscriptions.md) - subscriptions do workspace atual;
- [Resources](resources.md) - canais de entrega e endpoints externos do workspace atual;
- [Data sources](data-sources.md) - custom data sources do workspace atual e system sources disponíveis;
- [Addresses](addresses.md) - address book do workspace atual.

## Workspace e Account

É importante não confundir workspace com account.

### Account

`Account` é a entidade pessoal do utilizador.

Account inclui:

- métodos de autorização;
- perfil pessoal e avatar do utilizador;
- billing profile;
- balance;
- tier atual;
- compras de tiers e project free-access add-ons;
- participação pessoal do utilizador em diferentes workspaces.

### Workspace

`Workspace` é a entidade de trabalho de uma equipa ou utilizador.

Workspace inclui:

- title, avatar e name do workspace;
- membros do workspace e os respetivos roles;
- invite link para adicionar membros;
- projetos criados neste workspace;
- project transfer requests;
- subscriptions do workspace;
- resources do workspace;
- custom data sources do workspace;
- address book do workspace;
- subscription logs do workspace.

Quando o utilizador muda o active workspace, continua a ser o mesmo account, mas vê outro contexto de trabalho.

## Menu Esquerdo do Workspace

No menu esquerdo existe um bloco separado `Workspace`.

### Current Workspace

A linha superior do bloco mostra o workspace atual: o seu avatar ou a primeira letra do nome, title e seta de abertura.

Ao clicar na linha, abre-se o workspace-menu.

### Parameters

Abre `Workspace parameters`, a página de definições do workspace atual.

É aqui que são editados os parâmetros do workspace, membros, transfer requests e subscription logs.

### Switch Workspaces

Mostra outros workspaces aos quais o account atual pertence.

Ao clicar noutro workspace, muda-se o active workspace. Depois da mudança, a interface permanece na mesma secção quando possível. Por exemplo, o utilizador pode mudar de `Projects` de um workspace para `Projects` de outro. Se a página detalhada atual já não existir no novo workspace, a interface devolve o utilizador à lista de projetos.

### Add Workspace

Abre a criação de um novo workspace.

## Criar um Workspace

Um novo workspace é criado a partir do menu esquerdo: `Workspace` -> `Add workspace`.

Depois da criação, a interface muda o utilizador para o novo workspace e abre [Projects](projects.md).

### Title

Nome visível do workspace.

Title é mostrado no menu esquerdo, nas definições do workspace e noutros pontos da interface onde é necessário um nome legível para o espaço de trabalho.

Title é obrigatório.

### Name

Slug estável do workspace.

Name é usado como nome técnico do workspace e entra no fullname das entidades que pertencem ao workspace. Por exemplo, um projeto pode receber um fullname como `<workspace>.<project-name>`.

Name é obrigatório e deve estar em kebab-case: letras latinas, números e hífens.

Enquanto o utilizador não alterar `Name` manualmente, o formulário tenta gerá-lo a partir de `Title`. Se title contiver caracteres não suportados, name deve ser preenchido manualmente.

### Reserved Names

Alguns nomes são reservados pela plataforma.

Por exemplo, workspace names e titles relacionados com `common` ou `web3alert` não podem ser usados para workspaces normais de utilizador.

### Cancel

Cancela a criação do workspace e devolve o utilizador à interface principal.

## Workspace Roles

Um membro do workspace tem um dos roles.

### Owner

Principal owner do workspace.

Owner pode gerir workspace settings, membros e project transfers. Transferir um projeto para fora do workspace está disponível apenas para owner.

### Admin

Administrador do workspace.

Admin pode gerir workspace settings e membros, mas não pode iniciar um project transfer em nome do owner.

### Developer

Membro que trabalha com entidades técnicas do workspace.

O acesso concreto depende das permissões sobre projetos e secções do serviço. Em workspace settings, developer não gere membros nem transfer requests.

### User

Membro básico do workspace.

Normalmente usa projetos, subscriptions e resources já preparados, mas não gere workspace settings.

## Workspace Parameters

`Workspace parameters` é o menu de definições do active workspace.

O conjunto de separadores depende do role do utilizador e do próprio workspace. Por exemplo, `Project transfers` está disponível apenas para owner.

## Information

O separador `Information` contém os principais parâmetros do workspace.

### Workspace

Painel de perfil do workspace.

Mostra:

- avatar do workspace;
- title do workspace;
- botão de edição do title.

### Avatar

O avatar do workspace é mostrado no menu esquerdo e em locais onde a interface precisa de distinguir visualmente um workspace de outro.

Para substituir o avatar, clique na imagem atual. São suportados ficheiros `JPG` e `PNG` até 1 MB.

Durante o upload, abre-se uma crop tool. Para workspace usa-se rounded-square crop, porque o avatar do workspace é apresentado na interface como um quadrado com cantos arredondados.

### Title

Title pode ser editado diretamente no painel do workspace.

Depois de guardar, o novo nome aparece no menu esquerdo e em workspace settings.

Title não pode estar vazio.

### Name

Nome read-only do workspace.

Name não pode ser editado a partir das settings porque participa nos fullnames e links das entidades.

## Members

O separador `Members` gere os membros do workspace.

Está disponível para utilizadores que podem gerir o workspace. Normalmente são owner e admin.

### Invite New Members

Para workspaces normais, o separador mostra invite link.

Este link pode ser copiado e enviado ao utilizador que deve ser adicionado ao workspace. Pelo invite link, o utilizador primeiro inicia sessão, se ainda não tiver entrado no Web3alert, depois clica em `Join` e entra no workspace.

### Workspace Members

Lista de membros do workspace.

Para cada membro são mostrados:

- avatar ou primeira letra do nome;
- display name;
- marca `You`, se for o utilizador atual;
- role atual;
- botão de remoção, se o utilizador atual puder remover membros.

### Role Select

Permite alterar o role de um membro.

A alteração é aplicada imediatamente depois de escolher o role.

Roles disponíveis:

- `Owner`;
- `Admin`;
- `Developer`;
- `User`.

### Remove Member

Remove um membro do workspace.

Antes da remoção é mostrada uma confirmação. Se o utilizador se remover a si próprio, a ação funciona como `Leave workspace`.

### Members Access

Se o utilizador não tiver permissões para gerir membros, o separador mostra um estado read-only.

Neste modo, o utilizador vê que apenas owner ou admin podem convidar membros, alterar roles e remover pessoas.

## Project Transfers

O separador `Project transfers` gere a transferência de projetos entre workspaces.

Está disponível apenas para o owner do workspace atual.

Transfer não move o projeto imediatamente. Primeiro é criado um request; depois, o owner do target workspace aceita-o ou rejeita-o. O projeto muda de owner apenas depois da aceitação do request.

### Create Transfer Request

Formulário para preparar transfer request.

### Project

Projeto que deve ser transferido.

A lista contém projetos do workspace atual disponíveis para transfer.

### Target Workspace

Name do workspace que deve receber o projeto.

Saber o workspace name não é suficiente para mover o projeto: o request ainda tem de ser aceite pelo owner do target workspace.

### Target Project Name

Novo nome do projeto no target workspace.

Se o campo ficar vazio ou mantiver o valor atual, o projeto mantém o seu name. Se for necessário transferir o projeto com renomeação, indique aqui o novo project name.

### Get Plan

Cria um transfer plan antes de criar o request.

O plan mostra o que será afetado:

- número de triggers;
- número de templates;
- número de topics;
- número de subscriptions;
- número de aliases que precisam de atualização.

Se forem encontrados conflicts, o request não pode ser criado até serem corrigidos.

### Conflicts

Lista de problemas que impedem a transferência.

Por exemplo:

- target workspace não foi encontrado ou não pode aceitar transfer;
- no target workspace já existe um projeto com esse nome;
- target trigger fullnames entram em conflito com triggers existentes;
- aliases já estão ocupados por outras entidades.

### Request Transfer

Cria transfer request com base no último plan criado.

Se os dados mudarem depois da criação do plan, o backend pode rejeitar o request e pedir para criar o plan novamente.

### Outgoing Requests

Requests enviados a partir do workspace atual.

Cada request mostra:

- source project e target project;
- data de criação;
- prazo de expiração;
- status;
- contagem curta de triggers/templates.

Um pending request pode ser cancelado com `Cancel`.

### Incoming Requests

Requests recebidos pelo workspace atual.

Um pending request pode ser aceite com `Accept` ou rejeitado com `Reject`.

Depois da aceitação, o backend aplica o transfer: altera o workspace do projeto, atualiza fullnames e aliases relacionados, e depois o request recebe status final.

## Subscription Logs

O separador `Subscription logs` mostra o histórico de alerts para subscriptions do workspace atual.

É um log de entrega: ajuda a perceber que subscription alerts foram enviados, bloqueados, limitados por rate limit ou terminaram com erro.

### Last Entries

Limita o número de entradas no log.

Valores disponíveis:

- `50`;
- `100`;
- `250`;
- `500`.

### Auto-Refresh

Ativa a atualização automática do log.

Valores disponíveis:

- `Off`;
- `5s`;
- `10s`;
- `30s`.

Quando auto-refresh está ativo, o filtro por data fica oculto porque o log funciona como live-view dos eventos mais recentes.

### Before / After

Filtro por tempo.

`Before` mostra entradas antes da data e hora selecionadas. `After` mostra entradas depois da data e hora selecionadas.

### Date and Time

Escolha de data e hora para o filtro `Before` ou `After`.

No popover é possível escolher dia, hour e minute. O botão `Now` coloca a hora atual, e `Clear` limpa o filtro.

### Refresh

Atualização manual do log.

### Time

Coluna com a hora de criação do log entry.

O botão no cabeçalho ordena as entradas por tempo: das mais recentes para as mais antigas ou das mais antigas para as mais recentes.

### Subscription

Coluna com a rota do alert.

Mostra project, trigger ou template context, além dos canais de entrega. Se a subscription tiver inputs ou filters, pode aparecer perto um details badge com uma sugestão curta.

### Status

Filtro e coluna de status.

Statuses disponíveis:

- `Delivered`;
- `Failed`;
- `Rate limited`;
- `Blocked`.

### Expanded Log Row

Ao clicar numa linha, abrem-se os detalhes:

- `Reason` - motivo do erro ou informação adicional;
- `Input` - replay/test input, se existir;
- `Test run` - execução de teste da subscription com base nos dados do log entry, se existir uma subscription relacionada disponível para esta entrada.

## Danger Zone

O separador `Danger zone` contém a saída do workspace.

### Leave Workspace

Remove o utilizador atual do workspace.

Antes de sair, é mostrada uma confirmação.

Se o utilizador for o único membro do workspace, o workspace será eliminado depois da saída.

### Last Workspace

Se este for o único workspace do utilizador, ele não pode sair.

Neste caso, o botão `Leave` fica desativado e o separador mostra `You cannot leave your last workspace`.
