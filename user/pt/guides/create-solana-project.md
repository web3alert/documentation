# Criar um projeto Solana

Este guia mostra como criar no Web3alert um projeto para Solana e adicionar os primeiros triggers.

No exemplo, criamos um projeto `Solana`, escolhemos um Solana data source existente e importamos triggers a partir do IDL de um programa. O resultado é um projeto que os utilizadores podem subscrever para receber notificações sobre eventos e instruções do programa Solana escolhido.

## O que precisa

Antes de começar, prepare:

- um Solana data source em execução; a lista está disponível em `Data sources` (veja [Data sources](../data-sources.md)); se ainda não existir uma source adequada, pode criá-la diretamente no assistente de importação com `Add new source`;
- `Program ID`: a chave pública do programa Solana que quer monitorizar;
- o IDL do programa: uma descrição JSON dos seus eventos e instruções; em muitos casos, o Web3alert consegue carregá-lo automaticamente a partir do `Program ID`.

## Passo 1. Crie o projeto

Abra `Projects` na barra lateral esquerda e clique em `Create New Project`.

Preencha os campos principais:

| Campo | Valor |
| --- | --- |
| `Title` | `Solana` |
| `Name` | `solana` |
| `Access level` | `Private` durante a preparação, `Public` para publicar no marketplace |

Alguns pontos importantes:

- `Name` é gerado automaticamente a partir de `Title`, mas pode ajustá-lo manualmente. Depois da criação do projeto, `Name` já não pode ser alterado.
- O nível `Free` (subscrições gratuitas para todos os utilizadores) fica disponível depois de ativar o project add-on em `Billing`. Para começar, `Private` é suficiente.

Ative `Short description` e adicione uma descrição curta, por exemplo:

```text
Solana mainnet notifications for program instructions, events, and account activity.
```

Ative `Description` e adicione uma descrição do projeto em markdown, por exemplo:

```markdown
Solana is a high-performance Layer 1 blockchain for applications that need fast finality and low transaction costs.

This Web3alert project collects Solana program activity from an existing Solana data source. Use it to build alerts for program instructions, decoded program events, and account reads based on Solana IDL.
```

Ative `Tags` e adicione tags (introduza cada tag e prima Enter):

```text
solana
layer-1
smart-contracts
```

Opcionalmente:

- `Links`: site oficial da Solana, documentação, explorer ou página do programa que está a monitorizar;
- `Icon` e `Cover`: logótipo e capa do projeto, carregados como ficheiro ou indicados por URL.

Clique em `Create project`. Depois da criação, verá a página do projeto com os separadores `Overview`, `Triggers` e `Templates`.

Veja mais detalhes sobre os campos do projeto em [Projects](../projects.md).

![Project creation form](/guides/solana-project/01-project-create.png)

![Project overview](/guides/solana-project/02-project-overview.png)

## Passo 2. Abra a importação de triggers

Na página do projeto, abra o separador `Triggers`.

Enquanto o projeto não tiver triggers, o separador mostra duas ações: `Add trigger` para criar um trigger manualmente e `Import triggers` para importação em massa. Clique em `Import triggers`.

A importação é a forma mais rápida de criar vários triggers Solana a partir do IDL de um programa. Use a criação manual no [trigger wizard](../trigger-wizard.md) mais tarde, quando precisar de um trigger específico com configurações próprias.

![Empty triggers tab](/guides/solana-project/03-project-triggers-empty.png)

## Passo 3. Escolha a source Solana

O assistente de importação tem três passos: `Source`, `Generate` e `Review & import`. O progresso aparece no cabeçalho do assistente.

No passo `Source`, escolha a sua source Solana no campo `Source network`. A lista mostra apenas data sources em execução, cada uma com o tipo de rede indicado; procure a marca `Solana`.

Se não existir uma source adequada, escolha `Add new source`: o assistente envia-o para a criação do data source e regressa ao fluxo de importação quando terminar.

Clique em `Next step`.

![Solana source selected in import wizard](/guides/solana-project/04-import-source.png)

## Passo 4. Indique o programa e carregue o IDL

No passo `Generate`, preencha:

| Campo | Descrição |
| --- | --- |
| `Category` | Grupo claro para os futuros triggers, por exemplo `Program activity`, `Governance` ou `Transfers`. A categoria entra nos nomes e identificadores dos triggers. |
| `Program ID` | Chave pública do programa Solana que quer monitorizar. |
| `IDL` | JSON com o IDL do programa. |

O caminho mais simples é clicar em `Load IDL from program address`: o Web3alert tentará encontrar o IDL publicado pelo `Program ID`, primeiro no Anchor IDL account e depois em Program Metadata. Se o carregamento funcionar, o campo `IDL` será preenchido automaticamente.

Se o carregamento automático não funcionar, cole o IDL JSON manualmente, por exemplo a partir do repositório ou da documentação do projeto. Sem IDL, a importação não é possível: é ele que permite ao Web3alert perceber que eventos e instruções existem no programa e como os descodificar em notificações legíveis.

Clique em `Generate triggers from IDL`. Se deixar o campo `IDL` vazio, o Web3alert tentará carregá-lo pelo `Program ID` antes de gerar.

O Web3alert gera rascunhos de triggers para todos os eventos (events) e instruções (calls) do IDL. Poderá desativar os que não precisa no passo seguinte.

![Solana IDL generation step](/guides/solana-project/05-import-solana-idl.png)

## Passo 5. Reveja e importe os triggers

O passo `Review & import` mostra uma tabela com os rascunhos gerados. Acima da tabela aparece um contador de seleção, por exemplo `5/12 selected`.

Para cada trigger, a tabela mostra:

- checkbox de seleção (o checkbox no cabeçalho seleciona ou remove a seleção de todos);
- `Trigger`: nome e identificador do trigger;
- `Type`: `event` (evento do programa) ou `call` (instrução do programa);
- `Description`: descrição do IDL, se os developers do programa a adicionaram.

Deixe selecionados apenas os triggers que os seus subscritores realmente precisam. É normal começar com um conjunto pequeno e adicionar mais tarde; pode executar a importação novamente.

Clique em `Create selected triggers`.

Depois da importação, o assistente regressa à página do projeto. Abra o separador `Triggers` para ver os triggers criados.

![Generated Solana trigger review](/guides/solana-project/06-import-review.png)

## Passo 6. Teste e refine os triggers

Os triggers gerados funcionam, mas ainda são rascunhos: os nomes e textos de notificação vêm diretamente do IDL. Antes de publicar, abra cada trigger importante no [trigger wizard](../trigger-wizard.md) e reveja:

- nome e descrição: se são claros para alguém que não conhece os detalhes internos do programa;
- source selecionada e `Program ID`;
- evento ou instrução que ativa o trigger;
- filters: se é preciso restringir os disparos, por exemplo por uma conta ou valor concreto;
- texto da notificação (human output): o que exatamente o subscritor verá.

Para projetos no marketplace, o texto da notificação é a parte mais importante. Um trigger gerado pode estar tecnicamente correto, mas mostrar uma estrutura difícil de entender. Uma boa notificação esconde a parte técnica e mostra apenas os valores relevantes: montantes, endereços e nomes.

![Imported Solana trigger source settings](/guides/solana-project/07-trigger-edit.png)

## Passo 7. Adicione templates

Triggers são blocos técnicos. Templates transformam-nos em cenários de subscrição prontos para utilizadores.

Abra o separador `Templates` e crie um ou mais templates para os principais casos de uso. Por exemplo:

- `Program activity`;
- `Account updates`;
- `Governance events`;
- `Token activity`.

Cada template deve ter um nome claro e defaults úteis para que o utilizador possa subscrever sem conhecer a estrutura interna dos triggers. Veja [Templates](../templates.md) e [Template wizard](../template-wizard.md).

![Solana template creation form](/guides/solana-project/08-template-create.png)

## Checklist final

Antes de publicar o projeto, confirme:

- a source Solana selecionada está em execução e funciona de forma estável;
- os triggers importados foram testados com dados reais do programa;
- os textos das notificações são curtos e compreensíveis para o subscritor;
- os triggers desnecessários estão desativados ou removidos;
- os templates cobrem os principais cenários de subscrição;
- a metadata do projeto inclui descrição, tags e links úteis;
- o access level foi escolhido de forma intencional.

Mude o projeto para `Public` apenas quando triggers e templates estiverem prontos. Se o projeto tiver de ser gratuito para todos os utilizadores, ative o project add-on em `Billing` e defina o access level como `Free` (é um serviço pago).
