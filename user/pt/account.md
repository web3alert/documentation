# Account

`Account` é a entidade pessoal do utilizador no Web3alert.

Account define quem iniciou sessão no serviço, como o perfil pessoal aparece, que tier está ativo, que balance está disponível para pagamentos e que ações de billing/referral pertencem a este utilizador.

Account não substitui [Workspace](workspaces.md). Workspace guarda as entidades de trabalho: projetos, subscriptions, resources, data sources, addresses e membros. Account guarda acesso pessoal, perfil e contexto de billing.

## Account e Workspace

### O Que Pertence ao Account

Account inclui:

- avatar pessoal e account title;
- user id;
- personal access token;
- billing profile;
- internal balance;
- account tier;
- auto-renewal do tier;
- compras de account plans;
- compras de project free-access add-ons para projetos que o account pode gerir em billing;
- personal coupons e gift coupons;
- referral link, referral code e referral rewards;
- eliminação do account.

Quando o utilizador muda o active workspace, o account continua o mesmo. Apenas mudam os dados de trabalho relacionados com o workspace selecionado.

Workspace e as respetivas definições são descritos com mais detalhe em [Workspaces](workspaces.md).

## Abrir Account Parameters

`Account parameters` abre a partir do menu do utilizador no canto superior direito da interface.

Neste menu estão disponíveis:

- `Account parameters`;
- `Log out`.

`Log out` termina a sessão atual. Antes de sair, é mostrada uma confirmação.

## Account Parameters

`Account parameters` contém quatro separadores:

- `Information`;
- `Billing`;
- `Referral`;
- `Danger zone`.

## Information

O separador `Information` contém as definições pessoais do account.

### Account

Painel de perfil do account.

Mostra:

- avatar do utilizador;
- account title;
- botão para editar o account title;
- sugestão para upload de avatar.

### Avatar

Avatar é usado no user menu e nas áreas da interface onde é necessário mostrar o utilizador atual.

Para substituir o avatar, clique na imagem atual. São suportados ficheiros `JPG` e `PNG` até 1 MB.

### Account Title

Nome visível do utilizador.

Title pode ser alterado com o botão de edição junto ao nome. Durante a edição:

- `Enter` guarda o valor;
- `Escape` cancela a edição;
- perder o foco também guarda o valor.

Limites:

- mínimo de 2 caracteres;
- máximo de 80 caracteres;
- um valor vazio não pode ser guardado.

### User ID

Id read-only do utilizador atual.

É usado para diagnóstico, suporte e identificação precisa do account quando o display name não é suficiente.

### Personal Access Token

Access token pessoal da sessão atual.

Com este token, o utilizador obtém acesso à [API](api.md) do Web3alert e aos [MCP servers](mcp-server.md). As capacidades disponíveis de API/MCP dependem do tier atual do account.

O token deve ser tratado como segredo: não deve ser enviado em chats públicos, screenshots ou documentação.

O token pertence ao account, não ao workspace.

## Billing

O separador `Billing` gere o balance, tier, pagamentos e coupons do account.

As ações de billing aplicam-se ao account, mas algumas compras podem afetar projetos geridos pelo account.

### Balance

Internal balance do account em EUR.

O balance pode ser usado para:

- comprar account plans;
- comprar project free-access add-ons;
- comprar gift coupons.

### Top Up

Abre o carregamento do balance.

No dialog, indique o amount em EUR e continue para o checkout do fornecedor de pagamentos.

Depois de o fornecedor confirmar o pagamento, os fundos aparecem no internal balance.

### Current Tier

Tier atual do account.

O cartão mostra:

- nome do tier;
- data até à qual o account tem entitlement;
- interruptor `Renew automatically`, se estiver ativo um tier pago.

### Renew Automatically

Controla a renovação automática do tier ativo.

Se o interruptor estiver ligado, o próximo período pode ser pago automaticamente pela payment strategy selecionada. Se estiver desligado, o tier continua ativo até ao fim do período pago, mas não é renovado automaticamente.

### Account Plans

Lista de tiers do account.

A lista completa de limites e capacidades de cada tier está descrita na página [Limits](limits.md).

### Free

Tier básico.

Dá unlimited access a free projects e um número limitado de subscriptions ativas para triggers de non-free projects.

### Advanced

Tier pago para utilizadores que precisam de acesso a triggers de public/private projects e de uma capacidade básica para criar as suas próprias entidades de marketplace.

Na UI atual, Advanced mostra as principais capacidades:

- acesso a triggers de public e private projects;
- um private project;
- um custom data source.

### Pro

Tier pago avançado.

Na UI atual, Pro mostra as principais capacidades:

- acesso a triggers de public e private projects;
- até 5 private projects;
- até 5 custom data sources.

### Duration

Duração da compra de um tier pago.

As opções disponíveis dependem do billing pricing, normalmente 1, 3, 6 ou 12 meses. Algumas durações podem mostrar discount.

### Pay / Upgrade

Botão de ação no cartão do tier.

Dependendo do estado atual, pode significar:

- comprar um tier;
- renovar o tier atual por uma duração maior;
- fazer upgrade para um tier superior;
- mostrar que o tier já está ativo;
- mostrar que o tier está bloqueado até ao fim do período pago atual.

O pagamento através deste botão usa fundos do internal balance, por isso o balance deve ser suficiente.

### Project Free-Access Add-On

Add-on que abre acesso gratuito a um project para todos os utilizadores do serviço.

Este cenário é útil quando o owner do projeto quer pagar o acesso a alerts para a sua community. Os utilizadores podem subscrever esse projeto como free project enquanto o add-on estiver ativo.

Se o add-on não for renovado, o projeto torna-se automaticamente public project. As subscriptions de Free users para este projeto serão congeladas se excederem os limites do Free tier para non-free projects.

A lista mostra projetos que o account pode gerir em billing.

### Project Card

O cartão de project free-access add-on mostra:

- icon e title do projeto;
- status atual do add-on;
- duration;
- `Renew automatically`;
- botão de pagamento ou status atual.

Se o add-on estiver ativo, é mostrada a data de fim do período atual. Se estiver pendente confirmação de pagamento, é mostrado o estado `Awaiting confirmation`.

### Coupons

A secção coupons permite ativar um coupon para si ou comprar um gift coupon para outro utilizador.

### Redeem Coupon

Campo para introduzir coupon code.

Se o code estiver ativo, o plan correspondente é aplicado ao account.

### Gift Coupon

Compra de um coupon code para outro utilizador.

É necessário escolher:

- tier: `Advanced` ou `Pro`;
- duration.

Depois de confirmar a compra, o valor é descontado do internal balance e o serviço mostra o coupon code que pode ser partilhado com outra pessoa.

### Your Gift Coupons

Lista de gift coupons comprados pelo account atual.

Cada coupon mostra:

- code;
- tier;
- duration;
- status;
- botão copy para o code.

### Recent Invoices

Lista das últimas billing attempts para account plans e project add-ons.

Cada invoice mostra:

- nome do invoice;
- amount;
- status;
- data de atualização.

O status do invoice ajuda a perceber se o pagamento foi bem-sucedido, aguarda confirmação, terminou com erro ou foi cancelado.

## Referral

O separador `Referral` gere o referral link e os referral rewards do account.

### Referral Rate

Percentagem de reward acumulada a partir das compras de utilizadores convidados.

### Referred Users

Número de accounts associados ao referral code do utilizador atual.

### Earned Total

Total de referral rewards creditados no internal balance.

### Referral Link

Shareable link para convidar novos utilizadores.

Se o referral link ainda não tiver sido criado, o botão `Generate link` cria-o. Depois da criação, estão disponíveis:

- `Copy link`;
- `Copy code`.

Novos utilizadores que chegam através do referral link são associados ao referral account.

### Claim Referral Code

Permite indicar manualmente um referral code se o utilizador chegou por convite, mas o code não foi associado automaticamente.

O code pode ser enviado com o botão `Claim code`. Depois de uma associação bem-sucedida, o campo é limpo e a interface mostra uma success message.

## Danger Zone

O separador `Danger zone` contém a eliminação do account.

### Delete Account

Elimina o account e todas as suas subscriptions.

Antes da eliminação, é mostrada a confirmação `Are you sure you want to delete this account?`.

Depois da eliminação, a sessão atual termina.

Esta ação é irreversível. Deve ser usada apenas se o account realmente já não for necessário.
