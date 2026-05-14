# Templates

`Templates` são cenários de subscrição prontos dentro de um projeto. Ajudam o owner do projeto a transformar [triggers](triggers.md) técnicos em opções compreensíveis para o utilizador: o que pode ser acompanhado, que parâmetros devem ser preenchidos e que topics podem ser escolhidos.

Se um trigger responde à pergunta “que evento ler e como processá-lo”, um template responde à pergunta “como o utilizador pode subscrever este evento de forma simples”. Um template não substitui um trigger. Ele junta um ou vários triggers num subscription flow mais claro.

## Para que servem os templates

Templates são necessários quando o projeto deve ser cómodo não só para o owner da integração, mas também para os utilizadores do marketplace.

Sem template, o utilizador seleciona o trigger diretamente e trabalha mais perto da configuração técnica: inputs, filters, defaults e action settings. Isto é normal para cenários precisos ou avançados.

Com template, o owner do projeto prepara antecipadamente um caminho mais simples:

- agrupa cenários relacionados num template;
- define topics claros;
- deixa ao utilizador apenas os inputs necessários;
- liga topics a triggers e filters;
- pode escolher topics que ficam ativos por defeito.

## De que é composto um template

### Project

Um template pertence sempre a um [project](projects.md) concreto. Usa triggers desse projeto e aparece na aba `Templates` da página do projeto.

### Template metadata

A metadata descreve o próprio template: título visível, nome interno e descrição. Estes dados aparecem na lista de templates e ajudam o utilizador a perceber que cenário de subscrição está a escolher.

### Inputs

Inputs são valores que o utilizador preenche ao criar uma subscription através de um template.

Por exemplo, um template pode pedir um endereço, token id, threshold amount ou outro parâmetro. Depois estes valores podem ser usados em rules como condições de filtragem. Importante: os inputs são obrigatórios se forem usados pelo topic/rule selecionado.

### Topics

Um topic é uma opção separada dentro de um template que o utilizador pode ativar ou desativar ao criar uma subscription.

Por exemplo, um template `Token activity` pode conter os topics `Transfers`, `Mints` e `Burns`. O utilizador escolhe um ou vários topics, e o template já sabe que triggers e conditions estão por trás de cada topic.

### Rules

Uma rule liga um topic a um trigger concreto.

Um topic pode usar uma rule se for baseado num só trigger, ou várias rules se deve incluir vários eventos semelhantes. Numa rule escolhe-se o trigger e, se necessário, configuram-se filters.

### Filters

Filters dentro de uma rule restringem que trigger results correspondem ao topic selecionado.

O valor do filter pode ser definido diretamente ou ligado a um template input através de `Use inputs`. No segundo caso, o utilizador preenche o input ao criar a subscription, e a rule usa esse valor na condição.

## Como templates são usados em subscriptions

Quando o utilizador clica em `Subscribe` num template, a interface abre a [criação de subscription](subscription-wizard.md) já com project/template/topic selecionados.

Se o template tiver topics com `Selected by default`, eles serão selecionados automaticamente. Se não houver topics assim, a interface seleciona o primeiro topic disponível.

O utilizador pode:

- escolher topics;
- preencher inputs necessários para as rules selecionadas;
- configurar actions e notification overrides no subscription wizard;
- mais tarde alterar a subscription sem mudar o próprio template.

## Template vs Trigger

Um trigger pode ser usado diretamente quando é preciso controlo técnico preciso ou um cenário único.

Um template é mais cómodo quando o utilizador deve receber uma escolha pronta: vários topics, inputs claros e rules pré-configuradas por cima de triggers.

As duas abordagens são normais. A escolha depende de quem vai criar a subscription e de quão técnico deve ser o processo.

## Estados e erros

Se um template tiver um problema com uma rule ou com um trigger ligado, a lista pode mostrar `Needs review`. Esse template deve ser verificado e corrigido antes de os utilizadores conseguirem subscrever através dele normalmente.

Motivos comuns:

- o trigger foi eliminado ou renomeado;
- a rule aponta para um topic inexistente;
- o filter já não corresponde à schema do trigger;
- o template ainda não contém topics.

## Gestão

Na aba `Templates`, o owner do projeto pode:

- criar um template através de [Add template](template-wizard.md);
- abrir um template existente para edição;
- eliminar um ou vários templates;
- abrir a criação de subscription através de `Subscribe`, se o template for válido e tiver topics.

O processo detalhado de criação é descrito em [Add template / Edit template](template-wizard.md).
