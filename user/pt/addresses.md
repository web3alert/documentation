# Addresses

`Addresses` é o address book do workspace atual.

Guarda blockchain addresses e aliases claros para eles, para que em subscriptions e notificações seja possível trabalhar não só com endereços técnicos longos, mas também com nomes humanos: `Treasury`, `Main wallet`, `Alice validator`, `Ops multisig`.

## Para que servem addresses

Addresses ajudam em três cenários principais.

### Preencher subscriptions mais depressa

Quando [Create subscription](subscription-wizard.md) tem um campo address, a interface pode sugerir endereços do address book.

Isto é cómodo se workspace se subscreve frequentemente aos mesmos wallets, contracts, validators ou accounts.

### Ler subscriptions com mais clareza

Endereços do address book são mais fáceis de reconhecer em inputs e filters.

Por exemplo, em vez de recordar sempre que wallet está por trás de um longo `0x...`, é possível guardar alias `Treasury` e usá-lo como nome claro.

### Melhorar notification defaults

Em [notification defaults](trigger-wizard.md#defaults), é possível usar Handlebars helpers `address` e `make`.

Eles recebem address de trigger output e, se esse address existir no address book do workspace atual, mostram alias. Se alias não for encontrado, helper deixa address como está ou encurta-o para uma forma compacta.

Isto é especialmente útil para notificações com vários endereços: sender, receiver, contract, validator, delegator ou multisig.

## Workspace scope

Address book pertence ao workspace atual.

Se mudares de workspace, a lista de addresses muda. Isto é importante: address `Treasury` num workspace e address `Treasury` noutro workspace podem ser entidades diferentes.

Utilizadores com permissões de gestão do workspace podem gerir addresses. Se o utilizador não tiver essas permissões, a secção `Addresses` não fica disponível para visualização nem edição.

Address book não confirma propriedade de address e não dá acesso a wallet. É apenas um diretório de aliases para facilitar configuração e apresentação de alerts.

## Tipos de address

Ao adicionar address, primeiro escolhe-se o tipo. O tipo é necessário para validação e para procurar alias corretamente ao renderizar notificações.

### Plain

Valor string arbitrário.

Usado quando é preciso guardar não um blockchain address padrão, mas outro identificador que ainda assim é conveniente marcar com alias.

### Substrate (ss58 format)

Address do ecossistema Substrate/Polkadot em formato SS58.

Ao guardar, a UI normaliza SS58 address para formato canonical interno e na lista volta a mostrá-lo como SS58. Isto permite comparar a mesma account mesmo que tenha sido introduzida em diferentes variantes SS58.

### Bitcoin

Bitcoin address.

Adequado para Bitcoin-style addresses usados em Bitcoin subscriptions e notificações.

### Ethereum (EVM)

EVM address em formato `0x...`.

Adequado para redes compatíveis com Ethereum: Ethereum, Polygon, Base, Arbitrum, Optimism, Celo e outras EVM networks.

Ao procurar alias, EVM addresses são comparados sem considerar maiúsculas/minúsculas.

### Cosmos

Cosmos/Bech32 address.

Ao guardar, a UI normaliza Bech32 address para o prefix base `cosmos`, para que o mesmo address possa ser comparado de forma mais estável.

## Lista de addresses

A secção `Addresses` mostra o address book do workspace atual.

### Alias

Nome legível do address.

Alias aparece na lista, é usado em helpers e ajuda a reconhecer address em subscriptions e notificações.

### Type

Tipo de address: `plain`, `ss58`, `bitcoin`, `evm` ou `cosmos`.

### Address

O próprio address.

Na lista, pode aparecer em formato apresentado. Para endereços longos, a interface pode encurtar o meio em ecrãs estreitos, mas ao copiar é usado o address completo.

### Network icons

Se address for usado em subscriptions, podem aparecer ao lado ícones de networks/projects relacionados.

Isto ajuda a perceber onde um address específico já é usado.

### Copy

O botão copia o address completo.

### Edit

Permite alterar alias.

Address e type permanecem iguais: se for preciso substituir o próprio address, é melhor eliminar o registo antigo e adicionar um novo.

### Delete

Elimina address do address book.

A eliminação não remove subscriptions, mas depois dela alias deixa de ser inserido em sugestões e notification helpers.

## Add address

`Add address` abre o formulário de criação de novo registo.

### Address type

Primeiro escolhe-se o tipo de address.

Depois de escolher tipo, aparecem os campos `Name` e `Address`.

### Name

Alias opcional.

Se name não for preenchido, alias será igual ao próprio address. Se name for preenchido, deve ter pelo menos três caracteres e não deve duplicar alias de outro address do mesmo tipo.

É melhor escolher um nome curto e claro que fique bem em notificações: `Treasury`, `Bridge hot wallet`, `Validator stash`.

### Address

Campo obrigatório com address value.

Address não deve conter espaços, deve passar validação do tipo escolhido e não deve duplicar um address já guardado do mesmo tipo.

### Add address

Guarda o registo no address book do workspace atual.

Depois de guardar, o formulário é reiniciado e o novo address aparece na lista.

## Utilização no subscription wizard

Address book é usado em campos descritos pela schema como address.

Quando o utilizador introduz address em subscription inputs ou filters, a interface pode mostrar entradas adequadas do address book. É possível escolher address guardado em vez de copiar manualmente.

Se aparecer uma entrada desnecessária no dropdown, ela pode ser eliminada diretamente a partir de address input. Isto eliminará o registo do address book do workspace.

## Utilização em notification templates

Address book é especialmente útil em defaults e overrides de notificações.

### address helper

`address` aceita um valor.

Se o valor for um blockchain address conhecido e for encontrado no address book, helper devolve alias. Se alias não for encontrado, o address conhecido é encurtado para forma compacta.

Exemplo:

```handlebars
{{address raw.from}}
```

### make helper

`make` aceita string, object ou array e substitui recursivamente addresses encontrados por aliases.

Isto é cómodo quando output contém uma estrutura com vários endereços.

Exemplo:

```handlebars
{{make raw}}
```

Se `raw` contiver addresses do address book, aliases serão mostrados na notificação em vez deles.
