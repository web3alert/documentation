# Data Sources

`Data sources` são fontes de dados blockchain/runtime das quais o Web3alert recebe blocks, transactions, events, extrinsics, Solana instructions/calls e metadata.

Simplificando, data source responde à pergunta “de onde ler dados”, e [trigger](triggers.md) responde à pergunta “que evento desses dados considerar adequado e como transformá-lo em output para uma subscription”.

## Para que servem data sources

Data source é usado em vários pontos do serviço:

- em [Add trigger / Edit trigger](trigger-wizard.md), quando trigger escolhe blockchain source;
- em [Import triggers](import-triggers.md), quando o wizard gera triggers a partir de ABI, pallet metadata ou outra descrição;
- no runtime engine, que se liga a endpoint, lê novos blocos e passa source items para triggers;
- em monitorização, onde é possível ver status do source, lag e logs.

Um data source pode ser usado por vários projects e triggers, se a mesma rede ou runtime servir para eles.

## System e custom sources

Na lista podem aparecer dois tipos de sources.

### System sources

System sources são sources já suportados pelo Web3alert. Pertencem à plataforma e normalmente estão disponíveis como marketplace data sources partilhados.

Estes sources não podem ser editados a partir do workspace. Na lista servem para ver que runtime sources estão atualmente registados e em que estado estão a funcionar.

### Custom sources

Custom sources são sources criados dentro de workspace.

Podem ser usados para projetos próprios, integrações custom e testes de novas redes. Custom source pode ser private ou public se deve ficar disponível de forma mais ampla.

A criação de custom sources não está disponível em todos os planos. Free accounts não podem criar os seus próprios data sources; é necessário um tier pago. O tier também pode ter limite de número de custom sources.

## Tipos de custom sources

Atualmente o wizard suporta três tipos de custom data sources.

### EVM

EVM source é usado para redes e endpoints compatíveis com Ethereum JSON-RPC.

Serve para EVM events, transactions, blocks, contract logs e contract reads que depois são usados em triggers e providers.

Para EVM source normalmente basta indicar um ou vários HTTP RPC endpoints.

### Substrate

Substrate source é usado para redes compatíveis com Polkadot/Substrate.

Serve para runtime events, extrinsics, calls, blocks, storage reads e importação de triggers baseada em metadata.

Para Substrate source normalmente usa-se WebSocket endpoint. Se a rede exigir signed extensions, runtime types ou RPC definitions não padrão, podem ser adicionados no passo `Extensions`.

### Solana

Solana source é usado para redes e RPC endpoints compatíveis com Solana.

Serve para Solana blocks, instructions/calls bem-sucedidos e program events decodificados por IDL. O wizard pode tentar carregar IDL automaticamente a partir de Anchor IDL account ou Program Metadata; se isso falhar, é preciso colar o IDL JSON manualmente.

Sem IDL, Web3alert não cria Solana event/call triggers, porque não consegue construir de forma fiável a estrutura de arguments, accounts e output schema.

Para Solana source normalmente usa-se HTTP RPC URL.

## Lista de data sources

A secção `Data Sources` mostra uma tabela de sources.

Sources são agrupados por tipo ou runtime category, por exemplo `EVM`, `Substrate`, `Solana` ou outro plugin/runtime type.

### Name

Título visível do source e o seu nome técnico curto.

### Deployer

Workspace ou platform owner que criou o source.

Para system sources normalmente aparece `common`. Para custom sources aparece o workspace a que o source pertence.

### Access

Nível de acesso do source.

`System` significa source de plataforma. `Private` significa source do workspace atual. `Public` significa custom source publicado para uso mais amplo.

### Created at

Data de criação de custom source.

Para system/runtime-only sources, a data pode estar ausente.

### Lag

Atraso do source em relação ao último bloco visto.

Se source processou todos os blocos disponíveis, aparece `Up to date`. Se houver backlog, aparece o número de blocos de lag.

### Status

Estado atual de runtime source.

Estados possíveis:

- `Running` - source está a funcionar;
- `Degraded` - source funciona, mas há problemas ou erros;
- `Error` - source está em erro;
- `Pending` - custom source está guardado, mas runtime registration ainda não terminou;
- `Registered` - source está registado, mas runtime status não devolve estado ativo.

### Settings

Menu de ações para source.

Os itens disponíveis dependem das permissões do utilizador e do tipo de source.

## Source actions

### Logs

Abre logs do custom source.

Logs ajudam a perceber se runtime se ligou a endpoint, que blocos são processados e que erros ocorrem.

### System alerts

Abre a criação de subscription para notificações de sistema do source.

Assim é possível receber alerts se source entra em erro, recupera ou começa a ficar com lag.

### Test system alerts

Envia um evento de sistema de teste para verificar alert flow.

Esta função não está disponível em todos os tiers e normalmente é necessária para owners/administradores do source.

### Edit

Abre source wizard para editar custom source.

System sources não podem ser editados.

### Restart source

Reinicia runtime worker source.

É útil se source parece bloqueado, mas é preciso continuar processamento a partir da posição guardada.

### Reset lag

Descarta backlog e continua processamento a partir da cabeça atual da rede.

Blocos ignorados após esse reset não serão processados. Esta ação deve ser usada apenas se o backlog antigo já não for necessário ou impedir source de alcançar o estado atual.

### Delete

Elimina custom source.

Antes de eliminar, é importante verificar se source é usado em triggers ou imports. Se source for eliminado, triggers e projects ligados podem perder a fonte de dados.

## Add data source

`Add new source` abre o wizard de criação de custom source.

O wizard tem quatro passos: `Details`, `Extensions`, `Test deployment` e `Deploy`.

## Step 1. Details

Neste passo define-se a configuração básica do source: título, acesso, tipo de rede, endpoints e runtime processing settings.

### Title

Título legível do source.

Aparece em listas e ajuda a distinguir sources entre si. Por exemplo: `Ethereum archive node`, `Polkadot private RPC`, `Base mainnet`.

### Name

Slug estável do source dentro de workspace.

Name é formado a partir de title, mas pode ser alterado antes de guardar. Pode conter apenas lowercase letters, numbers e dashes.

Depois da criação do source, name passa a fazer parte de fullname no formato `<workspace>.source.<name>`.

### Access level

Define disponibilidade de custom source.

`Private` serve para sources do workspace atual e integrações fechadas. `Public` é usado se source deve estar disponível de forma mais ampla e pode ser usado por outros projetos ou utilizadores se tiverem permissões correspondentes.

### Type

Tipo de blockchain/runtime source.

Atualmente estão disponíveis `EVM`, `Substrate` e `Solana`.

### Endpoints

Lista de RPC endpoints aos quais runtime vai ligar-se.

Pode ser indicado um ou vários endpoints. Vários endpoints são úteis para redundância: se um endpoint estiver instável, runtime pode usar outro.

Para EVM e Solana normalmente usa-se HTTP RPC URL. Para Substrate normalmente usa-se WebSocket URL.

### Batch max count

Configuração opcional para EVM source.

Controla o número máximo de batch requests ao ler dados. Se o campo não for ativado, é usado o valor por defeito.

Esta configuração pertence a advanced runtime settings e só é necessária se o comportamento padrão não servir.

### Block processing concurrency

Configuração opcional de paralelismo no processamento de blocos.

Um valor maior pode acelerar processamento, mas aumenta a carga em endpoint e runtime. Se o campo não for ativado, é usado o valor por defeito.

### Max queued blocks

Limite opcional da fila de blocos.

Limita o número de blocos que source pode manter na fila de processamento. Se o campo não for ativado, é usado o valor por defeito.

## Step 2. Extensions

Neste passo configuram-se runtime extensions adicionais.

Para EVM e Solana sources, este passo normalmente não exige nada: não usam signed extensions, custom runtime types ou RPC extension definitions neste flow.

Para Substrate sources, extensions são necessárias apenas em redes onde standard metadata não é suficiente.

### Extensions

Switch geral de optional extensions.

Se endpoint for normal e metadata for lida sem configurações adicionais, este passo pode ficar desligado.

### Preset

Conjunto pronto de configurações para casos conhecidos de Substrate runtime.

Atualmente disponíveis:

- `No preset`;
- `Avail`;
- `Polkadot Asset Hub / Statemint`;
- `Kusama Asset Hub / Statemine`.

Se for escolhido preset, o wizard usa configurações preparadas e não exige preencher manualmente signed extensions, types e RPC.

### Signed extensions

JSON array com descrição de custom signed extensions.

Isto é necessário para redes Substrate onde extrinsics usam extensions não padrão e runtime não consegue decodificá-las corretamente sem descrição adicional.

### Types

JSON object com custom runtime types.

Isto é necessário se metadata ou RPC devolver tipos que runtime não consegue reconhecer automaticamente.

### RPC

JSON object com custom RPC methods.

Isto é necessário se trigger/provider deve chamar secções ou métodos RPC não padrão de um Substrate node.

## Step 3. Test deployment

Este passo verifica que runtime consegue ligar-se ao source antes de guardar.

### Deployment test

Mostra summary do futuro source: workspace, fullname e type.

O botão `Run test deployment` inicia a verificação de endpoints e configuração runtime.

### Logs

Mostra o resultado de test deployment.

Se test deployment terminar com erro, é melhor não guardar source antes de corrigir endpoints ou extensions.

Só é possível avançar depois de uma verificação bem-sucedida.

## Step 4. Deploy

O passo final guarda source e espera por runtime registration.

### Deploy source

Mostra summary da configuração que será guardada.

Para Substrate source também aparece summary de extensions: preset, signed extensions, custom types e RPC methods.

O botão `Create source` cria um novo source. Ao editar source existente, o botão chama-se `Update source`.

### Deploy logs

Mostra o processo de gravação e runtime registration.

Depois de guardar com sucesso, source aparece na lista `Data Sources`. Se runtime registration ainda não tiver terminado, source pode permanecer algum tempo em estado `Pending`.

## Edit data source

A edição de custom source usa o mesmo wizard.

É possível alterar title, access level, endpoints, extensions e runtime settings. Name fica bloqueado durante edição porque faz parte do fullname estável.

Depois de atualizar source, runtime registration pode demorar algum tempo.
