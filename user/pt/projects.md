# Projects

`Projects` é o catálogo de redes blockchain, protocolos e integrações dApp a partir dos quais o Web3alert consegue recolher eventos e para os quais os utilizadores podem criar subscriptions.

Na versão Next, `Project` já não é apenas uma "rede numa lista". É um contentor para toda a configuração pública e técnica da integração:

- project metadata: título, descrição, tags, icons, cover e links externos;
- [Triggers](triggers.md): regras técnicas que descrevem que eventos ler de data source, como filtrá-los, como enriquecê-los e em que output transformá-los;
- [Templates](templates.md): cenários de subscrição para utilizadores sobre triggers, agrupados em topics compreensíveis;
- [Subscriptions](subscriptions.md): subscriptions do workspace criadas com base no projeto;
- ligações a [Data sources](data-sources.md): fontes de dados blockchain das quais triggers recebem eventos, blocos, calls ou runtime metadata.

Um utilizador comum abre `Projects` sobretudo para encontrar a rede ou protocolo necessário e criar uma subscription. Um administrador ou owner do projeto usa esta secção para configurar toda a superfície da integração.

## Lista de projetos

A página `Projects` mostra o catálogo de projetos disponíveis.

### Search

O campo de pesquisa filtra projetos por vários atributos:

- título visível do projeto;
- `fullname` do projeto;
- `id` interno;
- workspace ou author;
- tags.

A pesquisa é útil tanto para um cenário de utilizador ("encontrar Polkadot Asset Hub") como para um cenário de administração ("encontrar projeto por slug/fullname").

### Only This Workspace

O switch `Only this workspace` deixa na lista apenas projetos do workspace atual.

Isto é importante quando um account tem acesso a vários espaços: por exemplo, o marketplace público pode mostrar muitos projetos, enquanto o filtro de workspace permite ver apenas integrações próprias, privadas ou de trabalho.

### Filtro por tags

Abaixo da linha de pesquisa são mostrados os tags disponíveis. Um tag selecionado deixa no catálogo apenas projetos com esse tag.

O botão `Clear filters` limpa a pesquisa, o filtro de workspace e os tags selecionados.

### Project Card

Cada cartão de projeto mostra:

- icon do projeto;
- título;
- linha de serviço com data de criação ou atualização;
- author ou workspace;
- descrição curta;
- número de triggers;
- número das suas subscriptions para este projeto;
- até quatro tags;
- botão `Open`;
- botão `Edit`, se o utilizador atual puder editar o projeto.

Se nada for encontrado com os filtros atuais, o catálogo mostra um estado vazio com sugestão para limpar filtros. Se não houver projetos, é mostrado o estado vazio do catálogo.

### Create New Project

A criação de projetos está disponível para utilizadores no tier `Advanced` ou superior.

Cada tier tem o seu próprio limite de private projects. Enquanto o limite não estiver esgotado, um novo projeto é criado como private por defeito: pode ser configurado com calma, triggers podem ser testados e templates podem ser preparados antes da publicação.

Se o limite de private projects estiver esgotado, há duas opções: fazer upgrade do tier ou tornar público um dos private projects existentes. Um public project já não ocupa slot no limite de private projects, por isso depois da publicação fica livre um slot para um novo private project.

Um projeto pode ter um de três access levels:

- `Private` - modo de trabalho para preparação e integrações fechadas. O projeto é visível apenas para quem tem acesso ao seu workspace/account. Este projeto ocupa um slot do limite de private projects.
- `Public` - projeto marketplace publicado. Outros utilizadores podem encontrá-lo e abri-lo, enquanto o owner continua a gerir triggers, templates e metadata. Um public project não ocupa slot do limite de private projects.
- `Free` - public project cujas subscriptions estão disponíveis gratuitamente para todos os utilizadores do Web3alert. Este nível é normalmente necessário para projetos e equipas que querem pagar o acesso a notificações para a sua community. A equipa Web3alert também pode publicar periodicamente em `Free` projetos importantes ou interessantes para toda a audiência do serviço.

## Criar e editar um projeto

O formulário de criação e edição gere project metadata. Não cria os próprios triggers e templates, mas define como o projeto aparece no catálogo e na página do projeto.

Depois de um novo projeto ser criado com sucesso, a interface abre a página do projeto com os metadata introduzidos. Depois o owner escolhe o próximo passo: [importar triggers](import-triggers.md), [criar um trigger manualmente](trigger-wizard.md), preparar [templates](#templates) ou usar um AI agent para configurar o projeto.

### Permissões e modo read-only

Se o utilizador puder gerir triggers e templates, mas não for owner de metadata, o formulário mostra `Metadata is read-only`.

Neste modo, é possível continuar a trabalhar com a parte técnica do projeto, se as permissões o permitirem, mas não é possível alterar title, description, imagens, tags ou outros campos de metadata.

### Title

`Title` é o título visível obrigatório do projeto.

Limite: até 32 caracteres.

Enquanto o campo `Name` não tiver sido alterado manualmente, `Title` é usado automaticamente para gerar `Name`.

### Name

`Name` é o slug obrigatório do projeto.

Durante a criação, é formado a partir de title:

- convertido para minúsculas;
- espaços são substituídos por `-`;
- hífens repetidos são colapsados;
- hífens no início e no fim são removidos.

Ao editar um projeto existente, `Name` fica bloqueado porque participa em identificadores e links.

### Access Level

`Access level` é escolhido ao criar ou editar um projeto e determina quem verá o projeto no marketplace.

Para a maioria dos project owners, o caminho básico é: primeiro o projeto é criado como `Private`, depois, quando estiver pronto, é movido para `Public`. O modo `Free` significa que o projeto continua público, mas o acesso às subscriptions é gratuito para os utilizadores. Normalmente é um serviço pago para a equipa do projeto que quer oferecer notificações gratuitas à sua community.

### Short Description

`Short description` é uma descrição curta para cartões e áreas compactas da interface.

O campo é opcional. Limite: até 256 caracteres.

### Description

`Description` é a descrição markdown completa do projeto para o separador `Overview`.

O campo é opcional. Limite: até 4096 caracteres.

O editor tem floating toolbar para texto selecionado:

- `Bold`;
- `Italic`;
- `Link`;
- `Heading`;
- `Code`.

### Tags

`Tags` ajudam a pesquisar e filtrar projetos.

Para adicionar um tag, escreva-o no campo `Add tag and press Enter` e prima `Enter` ou o botão de adicionar.

Regras dos tags:

- apenas letras latinas minúsculas, números e hífens;
- espaços são normalizados para hífens;
- comprimento máximo de um tag: 20 caracteres;
- duplicados não são adicionados.

### Links

`Links` são links externos do projeto.

Cada link contém:

- `Title`;
- `URL`;
- botão para remover a linha.

O botão `+ Add link` adiciona uma nova linha. Ao guardar, são considerados apenas links onde title e URL estejam preenchidos.

Na página do projeto, estes links são mostrados no bloco `Useful links`.

### Icon e Cover

Estes campos permitem definir URLs separadas para elementos visuais do projeto:

- `Icon` - icon compacto do projeto. É usado no catálogo, na página do projeto, nos wizards e como valor por defeito para notification avatar;
- `Cover` - cover largo para a página do projeto.

Para cada campo, é possível escolher como preenchê-lo:

- `URL` - inserir manualmente um link para a imagem;
- `Upload` - carregar um ficheiro através do Web3alert.

No modo `Upload`, o ficheiro é escolhido separadamente para cada campo. Se for carregado um novo `Icon` ou `Cover`, ele substitui a imagem anterior do mesmo tipo depois de guardar o projeto.

Limites de upload:

- formatos: `jpg`, `jpeg`, `png`, `webp`;
- tamanho máximo do ficheiro: 5 MB.

Se for escolhido um ficheiro, mas o utilizador sair da página sem guardar o projeto, o upload não será aplicado ao projeto.

### Delete Project

Ao editar um projeto existente, o owner pode eliminá-lo através de delete action. Antes da eliminação é mostrado um diálogo de confirmação.

Eliminar um projeto é uma operação perigosa: o projeto está ligado a triggers, templates e subscriptions, por isso deve ser usada apenas quando o projeto realmente já não for necessário.

## Quick Actions

O conjunto de quick actions depende do separador e das permissões do utilizador:

- em `Overview`: `Edit metadata`, se o utilizador puder editar metadata;
- em [Subscriptions](subscriptions.md): [Create subscription](subscription-wizard.md), se o utilizador puder gerir subscriptions do workspace atual;
- em [Triggers](triggers.md): [Import triggers](import-triggers.md) e [Add trigger](trigger-wizard.md), se o utilizador puder editar o projeto;
- em [Templates](templates.md): [Add template](template-wizard.md), se o utilizador puder editar o projeto; [Subscribe](subscription-wizard.md) está disponível em templates válidos com topics.

## Overview

O separador `Overview` mostra a descrição do projeto para utilizadores.

Blocos principais:

- `About` - descrição markdown completa de metadata;
- `Project details` - número de triggers, número das suas subscriptions, project id, data de criação e data de atualização;
- `Tags` - tags do projeto;
- `Useful links` - links externos úteis do projeto.

Se a URL de um recurso começar por `http://`, `https://`, `mailto:` ou `tel:`, o link é usado como está. Nos restantes casos, a interface adiciona `https://`.

## Subscriptions

O separador `Subscriptions` mostra subscriptions do active workspace ligadas a este projeto.

É o mesmo conjunto de subscriptions disponível na secção principal [Subscriptions](subscriptions.md), mas aqui já filtrado pelo projeto atual.

Está disponível apenas quando o utilizador atual pode gerir o active workspace. Se não houver subscriptions, é mostrado um estado vazio com sugestão para criar uma subscription.

## Triggers

O separador `Triggers` mostra a tabela de triggers do projeto.

No modo de visualização, é possível abrir trigger details. No modo de edição, o owner pode:

- selecionar um ou vários triggers;
- eliminar triggers selecionados;
- abrir a edição de um trigger específico;
- criar um novo trigger através de [Add trigger](trigger-wizard.md);
- gerar triggers em massa através de [Import triggers](import-triggers.md).

## Templates

O separador `Templates` mostra templates do projeto.

Template é uma camada de utilizador sobre triggers: agrupa inputs, topics e rules para que o utilizador possa criar uma subscription sem conhecer a configuração interna de trigger. Templates são descritos com mais detalhe em [Templates](templates.md).

Na lista de templates são mostrados:

- title;
- key/id;
- description;
- número de topics;
- aviso `Needs review`, se template tiver issue;
- ações `Edit` e `Delete`, se o utilizador puder editar;
- `Subscribe`, se template for válido e tiver topics.

Ao clicar em `Subscribe`, a interface abre [criação de subscription](subscription-wizard.md) com o project/template/topic selecionado. Se template tiver topics `selectedByDefault`, eles são selecionados automaticamente; caso contrário, é usado o primeiro topic disponível.
