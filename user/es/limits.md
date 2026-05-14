# Limits

`Limits` describe las restricciones de Web3alert que dependen del account tier o que se aplican como reglas técnicas generales del servicio.

Tiers principales:

- `Free`;
- `Advanced`;
- `Pro`.

Si en una tabla aparece `Unlimited`, significa que en la configuración tarifaria actual no hay un límite numérico explícito. Otras comprobaciones técnicas, permisos de workspace o el estado de una entidad pueden seguir limitando la acción.

## Cómo se aplican los límites

Un tier limit por sí solo no concede permiso para una acción. Para la mayoría de operaciones deben cumplirse dos condiciones:

- el account tier permite la acción;
- el role del usuario en [Workspace](workspaces.md) permite gestionar la entidad necesaria.

Para projects y custom data sources, los límites normalmente se cuentan por owner o billing account de la entidad. Para subscriptions, el límite se cuenta por el account que creó la subscription.

## Tier Summary

| Capacidad | Free | Advanced | Pro |
| --- | ---: | ---: | ---: |
| Crear projects | No | Sí | Sí |
| Crear workspaces | Unlimited | Unlimited | Unlimited |
| Editar projects | No | Sí | Sí |
| Gestionar triggers | No | Sí | Sí |
| Gestionar templates | No | Sí | Sí |
| Gestionar custom data sources | No | Sí | Sí |
| Test run | No | Sí | Sí |
| MCP server access | No | Sí | Sí |
| Active non-free subscriptions | 5 | Unlimited | Unlimited |
| Private projects | 0 | 1 | 5 |
| Private custom data sources | 0 | 1 | 5 |
| Triggers en private project | 0 | 50 | 200 |
| Triggers en public/free project | 0 | Unlimited | Unlimited |
| Provider weight por trigger | 0 | 6 | 20 |
| Runtime rate por subscription | 3 burst, 0.25/sec, queue 15 | 10 burst, 1/sec, queue 50 | 20 burst, 3/sec, queue 150 |
| Runtime rate por workspace | 10 burst, 1/sec | 30 burst, 5/sec | 100 burst, 20/sec |
| External API rate | 60/min | 300/min | 900/min |
| Subscriptions logs | No | 7 días / 25,000 registros | 30 días / 100,000 registros |
| Custom source logs | No | 7 días / 25,000 registros | 30 días / 100,000 registros |

## Projects

### Create Projects

La creación de projects está disponible solo para `Advanced` y `Pro`.

Un account `Free` no puede crear nuevos projects.

### Edit Projects

La edición de project metadata está disponible solo para accounts de pago.

Si el owner del proyecto pasa a `Free`, no puede editar project metadata. Para public projects conserva la posibilidad de eliminar el proyecto, pero no de gestionar sus ajustes como antes.

### Private Projects

| Tier | Límite de private projects |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

Private project ocupa un slot en el límite de private projects del owner account.

Si el límite se agotó, se puede:

- convertir un private project existente en public;
- hacer upgrade a un tier superior;
- eliminar un private project innecesario.

### Free Projects

Free project está disponible para que todos los usuarios se suscriban sin gastar el límite de non-free subscriptions.

Free access se activa mediante project free-access add-on en [Account Billing](account.md#project-free-access-add-on).

Si el add-on no se renueva, el project pasa a ser public. Después de eso, las subscriptions de usuarios `Free` a ese project se cuentan como non-free subscriptions y pueden congelarse si se supera el límite `Free`.

## Subscriptions

### Counted Subscriptions

Un account `Free` puede mantener hasta 5 active subscriptions a non-free projects.

`Advanced` y `Pro` no tienen límite numérico de counted subscriptions.

| Tier | Active counted subscriptions |
| --- | ---: |
| Free | 5 |
| Advanced | Unlimited |
| Pro | Unlimited |

### Qué subscriptions se cuentan

Una subscription se cuenta si pertenece a un project cuyo access level no es `Free`.

Se cuentan:

- subscriptions a `Public` projects;
- subscriptions a `Private` projects, si el usuario tiene acceso al source workspace.

No se cuentan:

- subscriptions a `Free` projects.

Una subscription creada mediante template cuenta como una subscription. El número de topics o rules dentro del template no multiplica el límite.

### Qué ocurre al superar el Free limit

Si un account `Free` intenta activar más de 5 counted subscriptions, las subscriptions extra se bloquean.

Si el usuario desactiva una counted subscription, podrá activar otra dentro del límite.

Si un project era `Free`, pero el free-access add-on terminó y el project pasó a `Public`, las subscriptions de usuarios `Free` a ese project empiezan a contarse como counted. Si después de eso se supera el límite, las subscriptions extra se congelan con una razón sobre el límite del Free tier.

### Frozen Private Projects

Si el owner de un private project pasa a `Free`, el private project se congela.

Las subscriptions vinculadas a un frozen project se bloquean con una razón que indica que trigger/project está frozen. Esta es una causa de bloqueo separada y no reemplaza el límite normal de counted subscriptions.

### Subscriptions Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | No disponible | No disponible |
| Advanced | 7 días | 25,000 |
| Pro | 30 días | 100,000 |

Si subscriptions logs no está disponible para el tier, backend no guarda logs para subscriptions del workspace owner tier.

En la UI, el log puede leerse por páginas de 50, 100, 250 o 500 registros.

## API and MCP

### MCP Server Access

MCP server está disponible solo para `Advanced` y `Pro`.

### External API Rate

External API rate se aplica a account-token API requests que no vienen del web UI de Web3alert y no vienen de Web3alert MCP server.

| Tier | External API requests |
| --- | ---: |
| Free | 60/min |
| Advanced | 300/min |
| Pro | 900/min |

Las requests desde web UI y MCP server no se limitan por esta regla.

## Triggers

### Manage Triggers

Crear, importar y editar triggers está disponible en projects cuyo owner tiene tier `Advanced` o `Pro`.

| Tier | Manage triggers |
| --- | --- |
| Free | No |
| Advanced | Sí |
| Pro | Sí |

### Project Triggers

| Tier | Private project | Public/free project |
| --- | ---: | ---: |
| Free | 0 | 0 |
| Advanced | 50 | Unlimited |
| Pro | 200 | Unlimited |

Private project limits se aplican solo a private projects.

Un account `Free` no puede gestionar triggers en sus propios projects. Si ese account se añade a un workspace de pago con un role que da permiso para editar project internals, puede crear, importar y editar triggers en ese workspace.

Para `Advanced` y `Pro`, public/free project actualmente no tiene un límite numérico separado de triggers.

## Templates

### Manage Templates

Crear y editar templates está disponible en projects cuyo owner tiene tier `Advanced` o `Pro`.

| Tier | Manage templates |
| --- | --- |
| Free | No |
| Advanced | Sí |
| Pro | Sí |

Un account `Free` no puede gestionar templates en sus propios projects. Si ese account se añade a un workspace de pago con un role que da permiso para editar project internals, puede crear y editar templates en ese workspace.

Eliminar template requiere owner-role en el workspace.

## Data Sources

### Manage Custom Data Sources

Crear y editar custom data sources está disponible solo para accounts de pago.

| Tier | Manage custom data sources |
| --- | --- |
| Free | No |
| Advanced | Sí |
| Pro | Sí |

### Private Custom Data Sources

| Tier | Private custom data sources |
| --- | ---: |
| Free | 0 |
| Advanced | 1 |
| Pro | 5 |

El límite se cuenta por private custom sources creadas por el account.

Public/system sources no ocupan private custom source slots.

### Public Custom Source Registration

Para public custom sources existe un límite anti-spam común: no más de 5 public registrations por 24 horas.

Este límite no depende del tier.

Public source también pasa una comprobación de unicidad de red. Para fuentes Substrate, el servicio compara genesis block hash; para fuentes EVM, chain ID. El mismo blockchain source no puede publicarse de nuevo como una nueva public source.

### Endpoints per Custom Source

Un custom source puede tener de 1 a 10 endpoints.

Este límite no depende del tier.

### Runtime Settings

Custom source tiene runtime settings:

| Setting | Default | Maximum |
| --- | ---: | ---: |
| `blockProcessingConcurrency` | 1 | 32 |
| `maxQueuedBlocks` | 10,000 | 100,000 |
| `batchMaxCount` para EVM | 3 | 100 |

Configurar advanced runtime settings puede hacerlo `Pro`. Para los demás tiers se usan default values o valores ya guardados.

### Custom Source Logs

| Tier | Retention | Max records |
| --- | ---: | ---: |
| Free | No disponible | No disponible |
| Advanced | 7 días | 25,000 |
| Pro | 30 días | 100,000 |

En la UI, source logs pueden leerse por páginas de 50, 100, 250 o 500 registros.

Al leer custom source logs, backend además limita tail read: hasta 96 KB y hasta 200 lines por lectura de tail.

## Providers

Providers se usan en trigger execution para complementar source item con datos externos o derivados de state.

### Provider Weights

Provider weight depende del tier:

| Tier | Provider weight por trigger |
| --- | ---: |
| Free | 0 |
| Advanced | 6 |
| Pro | 20 |

Provider weight es el coste del provider en trigger execution budget. Un provider puede ocupar más de un slot condicional.

Cada provider tiene un weight.

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

Si provider define explícitamente `weight`, debe ser un integer positivo. Valores mayores que 100 se recortan a 100.

### Provider Timeout

Provider timeout es 10 segundos.

Es un runtime limit general. En la UI, este parámetro no se muestra al usuario como un ajuste normal.

### Provider Response Size

El tamaño máximo de provider response es 256 KB.

Es un runtime limit general.

### Provider URL Policy

Para external endpoint providers solo se permite `https`.

Local y private-network hosts están prohibidos: por ejemplo `localhost`, `.local`, private IPv4 ranges y loopback IPv6.

## Tests

### Test Run Access

| Tier | Test run |
| --- | --- |
| Free | No |
| Advanced | Sí |
| Pro | Sí |

Test run se usa para comprobar triggers, providers y subscriptions.

### Test Rate Limit

| Tier | Rate |
| --- | ---: |
| Free | No disponible |
| Advanced | 1 test / second |
| Pro | 5 tests / second |

El límite se aplica a test endpoints para proteger backend y runtime de ejecuciones demasiado frecuentes.

## Alert Delivery

Alert delivery se limita con rate limits para que un account/workspace no pueda sobrecargar delivery runtime.

### Per-Subscription Notification Rate

| Tier | Burst bucket | Sustained rate | Queue cutoff |
| --- | ---: | ---: | ---: |
| Free | 3 | 0.25 / second | 15 |
| Advanced | 10 | 1 / second | 50 |
| Pro | 20 | 3 / second | 150 |

`Burst bucket` permite procesar un pico corto de alerts.

`Sustained rate` indica cuántos alerts se restauran en el bucket con el tiempo.

`Queue cutoff` es el tamaño máximo de la cola de subscription antes de que delivery empiece a descartar o rate-limit events.

### Per-Workspace Notification Rate

| Tier | Burst bucket | Sustained rate |
| --- | ---: | ---: |
| Free | 10 | 1 / second |
| Advanced | 30 | 5 / second |
| Pro | 100 | 20 / second |

Workspace-level limit protege el flujo general de alerts dentro del workspace.

## Project Transfer

Project transfer requests tienen anti-spam limits.

| Limit | Value |
| --- | ---: |
| Pending request lifetime | 7 días |
| Requests by one account per hour | 5 |
| Requests by one account per day | 20 |
| Requests from one account to the same target workspace per day | 2 |
| Pending transfer requests per project | 1 |

Estos límites no dependen del tier.
