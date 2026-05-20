# Limits

`Limits` descreve as restrições do Web3alert que dependem do account tier ou que se aplicam como regras técnicas gerais do serviço.

Tiers principais:

- `Free`;
- `Advanced`;
- `Pro`.

Se uma tabela indicar `Unlimited`, significa que na configuração tarifária atual não existe um limite numérico explícito. Outras verificações técnicas, permissões do workspace ou o estado da entidade ainda podem limitar a ação.

## Como os limites são aplicados

Um tier limit por si só não dá permissão para uma ação. Para a maioria das operações, duas condições têm de coincidir:

- o account tier permite a ação;
- o role do utilizador em [Workspace](workspaces.md) dá permissão para gerir a entidade necessária.

Para projects e custom data sources, os limites normalmente são contados pelo owner ou billing account da entidade. Para subscriptions, o limite é contado pelo account que criou a subscription.

## Tier Summary

| Capacidade | Free | Advanced | Pro |
| --- | ---: | ---: | ---: |
| Preço | Free | €15.00 / mês; 5% de desconto ao pagar 6 meses; 10% de desconto ao pagar 12 meses | €50.00 / mês; 5% de desconto ao pagar 6 meses; 10% de desconto ao pagar 12 meses |
| Criar projects | Não | Sim | Sim |
| Criar workspaces | Unlimited | Unlimited | Unlimited |
| Editar projects | Não | Sim | Sim |
| Gerir triggers | Não | Sim | Sim |
| Gerir templates | Não | Sim | Sim |
| Gerir custom data sources | Não | Sim | Sim |
| Test run | Não | Sim | Sim |
| MCP server access | Não | Sim | Sim |
| Active non-free subscriptions | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Triggers em private project | 0 | 50 | 200 |
| Triggers em public/free project | 0 | Unlimited | Unlimited |
| Provider weight por trigger | 0 | 6 | 20 |
| Runtime rate por subscription | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| Runtime rate por workspace | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
| External API rate | 60/min | 300/min | 900/min |
| Subscriptions logs | Não | 7 dias / 25,000 registos | 30 dias / 100,000 registos |
| Custom source logs | Não | 7 dias / 25,000 registos | 30 dias / 100,000 registos |

## Projects

### Create Projects

A criação de projects está disponível apenas para `Advanced` e `Pro`.

Um account `Free` não pode criar novos projects.

### Edit Projects

A edição de project metadata está disponível apenas para accounts pagos.

Se o owner do projeto se tornar `Free`, não pode editar project metadata. Para public projects, continua a poder eliminar o projeto, mas não gerir as suas definições como antes.

### Private Projects

| Tier | Limite de private projects |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Private project ocupa um slot no limite de private projects do owner account.

Se o limite estiver esgotado, pode:

- mudar um private project existente para public;
- fazer upgrade para um tier superior;
- eliminar um private project desnecessário.

### Free Projects

Free project está disponível para subscrição por todos os utilizadores sem gastar o limite de non-free subscriptions.

Free access é ativado através de project free-access add-on em [Account Billing](account.md#project-free-access-add-on).

Se o add-on não for renovado, o project torna-se public. Depois disso, as subscriptions de utilizadores `Free` a esse project contam como non-free subscriptions e podem ser congeladas se o limite `Free` for excedido.

## Subscriptions

### Counted Subscriptions

Um account `Free` pode manter até 5 active subscriptions para non-free projects.

`Advanced` e `Pro` não têm limite numérico de counted subscriptions.

| Tier | Active counted subscriptions |
| --- | ---: |
| Free | 5 |
| Advanced | Unlimited |
| Pro | Unlimited |

### Que subscriptions são counted

Subscription é counted se pertence a um project cujo access level não é `Free`.

Counted:

- subscriptions para `Public` projects;
- subscriptions para `Private` projects, se o utilizador tiver acesso ao source workspace.

Não counted:

- subscriptions para `Free` projects.

Subscription criada através de template conta como uma subscription. O número de topics ou rules dentro do template não multiplica o limite.

### O que acontece ao exceder o Free limit

Se um account `Free` tentar ativar mais de 5 counted subscriptions, as subscriptions extra são bloqueadas.

Se o utilizador desligar uma counted subscription, poderá ativar outra dentro do limite.

Se um project era `Free`, mas o free-access add-on terminou e o project se tornou `Public`, as subscriptions de utilizadores `Free` a esse project começam a contar como counted. Se depois disso o limite for excedido, as subscriptions extra serão congeladas com uma razão sobre o limite do Free tier.

### Frozen Private Projects

Se o owner de um private project se tornar `Free`, o private project fica congelado.

Subscriptions ligadas a um frozen project são bloqueadas com uma razão que indica que trigger/project está frozen. Esta é uma razão de bloqueio separada e não substitui o limite normal de counted subscriptions.

### Subscriptions Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Indisponível | Indisponível |
| Advanced | 7 dias | 25,000 |
| Pro | 30 dias | 100,000 |

Se subscriptions logs não estiver disponível para o tier, backend não guarda logs para subscriptions deste workspace owner tier.

Na UI, o log pode ser lido em páginas de 50, 100, 250 ou 500 registos.

## API and MCP

### MCP Server Access

MCP server está disponível apenas para `Advanced` e `Pro`.

### External API Rate

External API rate aplica-se a account-token API requests que não vêm do web UI Web3alert nem do Web3alert MCP server.

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

Requests do web UI e MCP server não são limitados por esta regra.

## Triggers

### Manage Triggers

Criar, importar e editar triggers está disponível em projects cujo owner tem tier `Advanced` ou `Pro`.

| Tier | Manage triggers |
| --- | --- |
| Free | Não |
| Advanced | Sim |
| Pro | Sim |

### Project Triggers

| Tier | Private project | Public/free project |
| --- | ---: | ---: |
| Free | 0 | 0 |
| Advanced | 50 | Unlimited |
| Pro | 200 | Unlimited |

Private project limits aplicam-se apenas a private projects.

Um account `Free` não pode gerir triggers nos seus próprios projects. Se esse account for adicionado a um workspace pago com um role que dá permissão para editar project internals, pode criar, importar e editar triggers nesse workspace.

Para `Advanced` e `Pro`, public/free project atualmente não tem limite numérico separado de triggers.

## Templates

### Manage Templates

Criar e editar templates está disponível em projects cujo owner tem tier `Advanced` ou `Pro`.

| Tier | Manage templates |
| --- | --- |
| Free | Não |
| Advanced | Sim |
| Pro | Sim |

Um account `Free` não pode gerir templates nos seus próprios projects. Se esse account for adicionado a um workspace pago com um role que dá permissão para editar project internals, pode criar e editar templates nesse workspace.

Eliminar template requer owner-role no workspace.

## Data Sources

### Manage Custom Data Sources

Criar e editar custom data sources está disponível apenas para accounts pagos.

| Tier | Manage custom data sources |
| --- | --- |
| Free | Não |
| Advanced | Sim |
| Pro | Sim |

### Private Custom Data Sources

| Tier | Private custom data sources |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

O limite é contado pelas private custom sources criadas pelo account.

Public/system sources não ocupam private custom source slots.

### Public Custom Source Registration

Para public custom sources existe um limite anti-spam geral: não mais de 5 public registrations em 24 horas.

Este limite não depende do tier.

Public source também passa uma verificação de unicidade da rede. Para fontes Substrate, o serviço compara genesis block hash; para fontes EVM, chain ID. O mesmo blockchain source não pode ser publicado novamente como uma nova public source.

### Endpoints per Custom Source

Um custom source pode ter de 1 a 10 endpoints.

Este limite não depende do tier.

### Runtime Settings

Custom source tem runtime settings:

| Setting | Default | Maximum |
| --- | ---: | ---: |
| `blockProcessingConcurrency` | 1 | 32 |
| `maxQueuedBlocks` | 10,000 | 100,000 |
| `batchMaxCount` para EVM | 3 | 100 |

Advanced runtime settings podem ser configuradas por `Pro`. Para os restantes tiers são usados default values ou valores já guardados.

### Custom Source Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | Indisponível | Indisponível |
| Advanced | 7 dias | 25,000 |
| Pro | 30 dias | 100,000 |

Na UI, source logs podem ser lidos em páginas de 50, 100, 250 ou 500 registos.

Ao ler custom source logs, backend limita adicionalmente tail read: até 96 KB e até 200 lines por leitura de tail.

## Providers

Providers são usados em trigger execution para enriquecer source item com dados externos ou derivados de state.

### Provider Weights

Provider weight depende do tier:

| Tier | Provider weight por trigger |
| --- | ---: |
| Free | 0 |
| Advanced | 6 |
| Pro | 20 |

Provider weight é o custo do provider no trigger execution budget. Um provider pode ocupar mais de um slot condicional.

Cada provider tem um weight.

| Provider type | Weight |
| --- | ---: |
| HTTP | 2 |
| GraphQL | 2 |
| RPC endpoint | 2 |
| RPC source transport | 1 |
| State source: Substrate storage | 1 |
| State source: EVM read | 1 |
| Value history | 1 |
| JavaScript | 2 |

Se provider definir explicitamente `weight`, deve ser um integer positivo. Valores superiores a 100 são limitados a 100.

### Provider Timeout

Provider timeout é 10 segundos.

É um runtime limit geral. Na UI, este parâmetro não é mostrado ao utilizador como uma definição normal.

### Provider Response Size

O tamanho máximo de provider response é 256 KB.

É um runtime limit geral.

### Provider URL Policy

Para external endpoint providers, apenas `https` é permitido.

Local e private-network hosts são proibidos: por exemplo `localhost`, `.local`, private IPv4 ranges e loopback IPv6.

## Tests

### Test Run Access

| Tier | Test run |
| --- | --- |
| Free | Não |
| Advanced | Sim |
| Pro | Sim |

Test run é usado para verificar triggers, providers e subscriptions.

### Test Rate Limit

| Tier | Rate |
| --- | ---: |
| Free | Indisponível |
| Advanced | 1 test / second |
| Pro | 5 tests / second |

O limite aplica-se a test endpoints para proteger backend e runtime de execuções demasiado frequentes.

## Alert Delivery

Alert delivery é limitada por rate limits para que um account/workspace não possa sobrecarregar delivery runtime.

### Per-Subscription Notification Rate

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` permite processar um pico curto de alerts.

`Sustained rate` indica quantos alerts são restaurados no bucket ao longo do tempo.

`Queue cutoff` é o tamanho máximo da fila da subscription antes de delivery começar a descartar ou rate-limit events.

### Per-Workspace Notification Rate

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit protege o fluxo geral de alerts dentro do workspace.

## Project Transfer

Project transfer requests têm anti-spam limits.

| Limit | Value |
| --- | ---: |
| Pending request lifetime | 7 dias |
| Requests by one account per hour | 5 |
| Requests by one account per day | 20 |
| Requests from one account to the same target workspace per day | 2 |
| Pending transfer requests per project | 1 |

Estes limites não dependem do tier.
