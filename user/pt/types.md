# Tipos

## Common

### OperationResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| - | ``{}` ou corpo de resposta vazio | O endpoint foi concluído com sucesso. |

### TokenResponse

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `token` | `string` | Bearer token para solicitações API/MCP posteriores. |

### AvatarUploadResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `url` | `string` | URL do avatar enviado. |
| `fileName` | `string` | Nome do arquivo salvo. |
| `extension` | `string` | Extensão do arquivo. |
| `size` | `number` | Tamanho do arquivo em bytes. |

### TagsAndLabels

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tags` | `string[]` | Tags curtos para filtrar e agrupar. |
| `labels` | `Record<string, string>` | Labels legíveis por máquina. |

## Account

### Me

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id account. |
| `newid` | `string` | Campo legacy compatível do id do account. |
| `tier` | `"free" \| "advanced" \| "pro"` | Tier atual do account. |
| `settings` | `object` | Settings do account. |
| `meta.nickname` | `string` | Nome visível do account. |
| `meta.avatar` | `string?` | URL do avatar do account. |
| `token.identity` | `string` | Identity vinculada ao token atual. |
| `workspace` | `WorkspaceView \| null` | Workspace selecionado atualmente. |
| `memberships` | `UserMembership[]` | Workspaces em que o account é membro. |
| `addressbook` | `AddressEntry[]` | Addresses do contexto atual de workspace/account. |
| `subscriptions` | `Record<string, number>` | Contadores de subscriptions por chave source/project. |
| `counters.subscriptions` | `SubscriptionCounter[]` | Contadores agregados de subscriptions. |

### UserMembership

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id membership/ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Papel dentro do workspace. |
| `workspace` | `WorkspaceViewShort` | Workspace ao qual este membership pertence. |

### AccountSettings

| Campo | Tipo | Descrição |
| --- | --- | --- |
| - | `object` | Objeto settings da versão atual da UI. O conjunto de campos pode ser expandido. |

### CurrentWorkspaceResponse

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `workspace` | `WorkspaceView \| null` | Workspace selecionado atualmente ou `null`. |

## Workspaces

### WorkspaceView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Nome único do workspace. |
| `invite` | `string?` | Invite token. Retornado apenas quando o caller pode ver os dados privados do workspace. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visível do workspace. |
| `meta.avatar` | `string?` | URL do avatar do workspace. |

### WorkspaceViewShort

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Fullname do workspace. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta` | `object?` | Metadados do workspace. |

### WorkspaceAclEntry

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Papel. |
| `user` | `UserViewShort` | Usuário se a entry já estiver vinculada a um account. |
| `object` | `{ type: string, id: string }?` | Referência ao workspace. Pode aparecer na resposta ACL raw. |
| `subject` | `{ type: string, id: string }?` | Referência a user/invite. Pode aparecer na resposta ACL raw. |

## Projects

### ProjectView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id project. |
| `createdAt` | `string?` | Data de criação em formato ISO. |
| `updatedAt` | `string?` | Data de atualização em formato ISO. |
| `createdByAccountId` | `string?` | Id do account proprietário. |
| `billingAccountId` | `string?` | Id do account proprietário de billing. |
| `name` | `string` | Nome do project dentro do workspace. |
| `fullname` | `string` | Fullname canônico do project. |
| `workspace` | `string` | Fullname do workspace proprietário. |
| `public` | `boolean` | Flag public legacy. |
| `visibility` | `"public" \| "private_link" \| "personal"?` | Storage visibility. |
| `accessLevel` | `"private" \| "public" \| "free"?` | Nível de acesso do produto. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visível. |
| `meta.description` | `string` | Descrição completa. |
| `meta.shortDescription` | `string?` | Descrição curta. |
| `meta.links` | `{ title: string, url: string }[]?` | Links úteis. |
| `meta.icon` | `string?` | URL icon. |
| `meta.avatar` | `string?` | URL do avatar, normalmente igual a icon. |
| `meta.cover` | `string?` | URL cover. |
| `ownerTitle` | `string?` | Título visível do proprietário workspace/account. |
| `triggerLimits.maxProvidersPerTrigger` | `number \| null` | Limite de peso de providers por trigger. O nome do campo se mantém por compatibilidade de API. |

### ProjectCreateCapability

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Tier atual do account. |
| `canCreateProjects` | `boolean` | Indica se pode ser criado um project. |
| `privateProjectsUsed` | `number` | Quantos private projects já contam para o limite. |
| `privateProjectsLimit` | `number \| null` | Limite de private projects; `null` significa sem limite. |
| `canCreatePrivateProjects` | `boolean` | Indica se pode ser criado um private project dentro do limite. |

### ProjectAccessLink

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `token` | `string` | Token do access link. |
| `project` | `string` | Fullname do project. |
| `maxUsages` | `number?` | Número máximo de usos. |
| `usages` | `number?` | Número atual de usos. |
| `expiresAt` | `string?` | Data de expiração em formato ISO. |
| `createdAt` | `string?` | Data de criação em formato ISO. |

### ProjectImageUploadResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `url` | `string` | URL da imagem enviada. |
| `fileName` | `string` | Nome do arquivo salvo. |
| `extension` | `string` | Extensão do arquivo. |
| `size` | `number` | Tamanho do arquivo em bytes. |

## Project Transfers

### ProjectTransferPlan

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mode` | `"dry-run"` | Modo de pré-visualização do plan. |
| `source` | `ProjectTransferProjectRef` | Project de origem. |
| `target` | `ProjectTransferTargetRef` | Workspace, name y fullname de destino. |
| `counts` | `ProjectTransferCounts` | Contadores de lo que será transferido. |
| `changes` | `ProjectTransferChanges` | Lista detallada de alterações planejadas. |
| `conflicts` | `ProjectTransferConflict[]` | Conflitos bloqueantes. |
| `notes` | `string[]` | Notas adicionais. |
| `planHash` | `string?` | Hash do plan, se o endpoint de criação do request o retorna junto com o plan. |

### ProjectTransferCounts

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `triggers` | `number` | Triggers que será transferidon. |
| `templates` | `number` | Registros de templates que será transferidon. |
| `templateGroups` | `number` | Grupos do template. |
| `templateTopics` | `number` | Topics do template. |
| `subscriptions` | `number` | Subscriptions cuyas referencias se verán afectadas. |
| `scopedEntities` | `number` | Apps/actions/resources/types/blueprints vinculados al project. |
| `projectAccessLinks` | `number` | Access links que serão atualizados. |
| `aliasWrites` | `number` | Entity aliases que serão criados o actualizarán. |
| `aliasMissing` | `number` | Aliases faltantes que serão criados. |
| `aliasStale` | `number` | Aliases obsoletos que serão atualizados. |
| `conflicts` | `number` | Número de conflitos. |

### ProjectTransferRequest

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id request. |
| `sourceProjectId` | `string` | Id do project de origem. |
| `sourceProjectFullname` | `string` | Fullname do project de origem. |
| `sourceWorkspace` | `string` | Fullname do workspace de origem. |
| `targetWorkspace` | `string` | Fullname do workspace de destino. |
| `targetName` | `string` | Nome do project no workspace de destino. |
| `targetFullname` | `string` | Fullname do project no workspace de destino. |
| `status` | `"pending" \| "accepted" \| "rejected" \| "cancelled" \| "expired" \| "failed"` | Status do request. |
| `requestedByAccountId` | `string` | Account que criou o request. |
| `sourceOwnerAccountId` | `string` | Account proprietário atual do source. |
| `targetOwnerAccountId` | `string` | Account proprietário do destino. |
| `planHash` | `string` | Hash do plan aceito. |
| `planCounts` | `Record<string, number>` | Snapshot dos contadores do plan. |
| `expiresAt` | `string` | Data de expiração em formato ISO. |
| `createdAt` | `string` | Data de criação em formato ISO. |
| `updatedAt` | `string` | Data de atualização em formato ISO. |
| `decidedAt` | `string?` | Data de decisão em formato ISO. |
| `decidedByAccountId` | `string?` | Account que aceitou, rejeitou ou cancelou o request. |
| `appliedAt` | `string?` | Data de aplicação em formato ISO. |
| `rejectedReason` | `string?` | Motivo da rejeição. |
| `failureReason` | `string?` | Motivo do erro. |

### ProjectTransferAcceptResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `request` | `ProjectTransferRequest` | Request aceito. |
| `transfer` | `ProjectTransferApplyResult` | Detalhes da transferência aplicada. |

### ProjectTransferApplyResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mode` | `"apply"` | Modo de aplicação. |
| `appliedAt` | `string` | Data de aplicação em formato ISO. |
| `writes.projects` | `number` | Registros de project atualizados. |
| `writes.triggers` | `number` | Triggers atualizados. |
| `writes.triggerProviders` | `number` | Trigger providers atualizados. |
| `writes.triggerTransforms` | `number` | Trigger transforms atualizados. |
| `writes.templates` | `number` | Templates atualizados. |
| `writes.subscriptions` | `number` | Subscriptions atualizadas. |
| `writes.scopedEntities` | `number` | Entidades vinculadas al project atualizadas. |
| `writes.projectAccessLinks` | `number` | Access links atualizados. |
| `writes.aliases` | `number` | Aliases gravados. |

## Triggers

### TriggerView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id do trigger. |
| `createdAt` | `string?` | Data de criação em formato ISO. |
| `updatedAt` | `string?` | Data de atualização em formato ISO. |
| `name` | `string` | Nome do trigger dentro do project. |
| `fullname` | `string` | Fullname canônico do trigger. |
| `projectId` | `string?` | Id project. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public legacy. |
| `backend` | `{ type: "sdk", trigger: string, values?: object }` | Referência ao backend runtime. |
| `inputs` | `Record<string, TipoSchema>` | Inputs obrigatórios da subscription. |
| `defaults` | `EventDefaults?` | Defaults recomendados para notification. |
| `output` | `Record<string, TipoSchema>?` | Legacy output schema. |
| `triggerSpec` | `TriggerSpec?` | Especificação de source matching. |
| `filtersSchema` | `Record<string, TriggerOutputSchemaCampo>?` | Filters opcionales de subscription. |
| `outputSchema` | `Record<string, TriggerOutputSchemaCampo>?` | Schema de raw/human output. |
| `activation` | `TriggerActivation \| null?` | Activation condition opcional. |
| `executionPolicy` | `object?` | Overrides de runtime policy. |
| `status` | `TriggerStatusDetails` | Status de test/runtime. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visível. |
| `meta.description` | `string?` | Descrição. |
| `hasProviders` | `boolean?` | `true` si providers existem. |
| `hasTransform` | `boolean?` | `true` si transform existe. |

### TriggerDraftView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `providers` | `TriggerProvider[]?` | Definições completas de providers. |
| `transform` | `TriggerTransform?` | Transform JavaScript raw/human. |

### TriggerStatusDetails

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `status` | `"not_tested" \| "ready" \| "broken"` | Status atual. |
| `issue` | `string?` | Issue legível por humanos. |
| `source` | `"edit" \| "test" \| "runtime" \| "dependency"?` | Origem do status. |
| `updatedAt` | `string?` | Data de atualização em formato ISO. |

### TriggerSpec

| Variante | Campos principales |
| --- | --- |
| `evm_log` | `type`, `dataSource`, opcionalmente `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput`. |
| `evm_transaction` | `type`, `dataSource`, opcionalmente `testInput`. |
| `substrate_event` | `type`, `dataSource`, opcionalmente `pallet`, `event`, `testInput`. |
| `solana_event` | `type`, `dataSource`, opcionalmente `programId`, `event`, `idl`, `testInput`. Para calls, `event` guarda um valor com prefixo `call:`. |
| `timer` | `type`, `interval`, opcionalmente `testInput`. |

### TriggerTransform

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `language` | `"javascript"` | Linguagem do transform. |
| `source` | `string?` | Source legacy. |
| `rawSource` | `string?` | Transformación a raw output. |
| `humanSource` | `string?` | Transformación de raw output a human output. |

### TriggerActivation

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `language` | `"javascript"` | Linguagem do activation. |
| `source` | `string` | Código-fonte JavaScript da condition. |

### TriggerValidationResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o draft es válido. |
| `issues` | `string[]` | Issues de validación. |
| `trigger` | `TriggerDraftView?` | Trigger draft normalizado se o endpoint o retorna. |

### TriggerPatchResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `fullname` | `string` | Fullname do trigger. |
| `dryRun` | `boolean?` | `true` se as alterações apenas foram validadas. |
| `updated` | `boolean` | Indica se o trigger fue modificado. |
| `changedPaths` | `string[]` | Dotted paths que foram alterados. |
| `trigger` | `TriggerDraftView` | Trigger depois do patch ou visualização dry-run normalizada. |

### TriggerBulkPatchResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` se o bulk patch foi dry run. |
| `totalCount` | `number` | Número de items procesados. |
| `updatedCount` | `number` | Número de items alterados. |
| `items` | `TriggerBulkPatchItem[]` | Resultados por trigger. |

### TriggerBulkPatchItem

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `fullname` | `string` | Fullname do trigger. |
| `dryRun` | `boolean?` | `true` se o item foi dry run. |
| `updated` | `boolean` | Indica se o trigger fue modificado. |
| `changedPaths` | `string[]` | Paths alterados. |
| `status` | `string?` | Status do trigger depois do patch. |
| `statusUpdatedAt` | `string?` | Data de atualização do status. |
| `unsetPaths` | `string[]` | Paths que foram removidos. |

### TriggerBulkRemoveResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` se o bulk remove foi dry run. |
| `totalCount` | `number` | Número de triggers procesados. |
| `deletedCount` | `number` | Número de triggers removidos. |
| `items` | `TriggerBulkRemoveItem[]` | Resultados por trigger. |

### TriggerBulkRemoveItem

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `fullname` | `string` | Fullname do trigger. |
| `dryRun` | `boolean?` | `true` se o item foi dry run. |
| `deleted` | `boolean` | Indica se o trigger fue eliminado. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |

### TriggerPreviewResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o preview foi bem-sucedido. |
| `issues` | `string[]` | Issues. |
| `output` | `unknown?` | Preview do output. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### TriggerTestResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o test fue bem-sucedido. |
| `issues` | `string[]` | Issues do test. |
| `input` | `unknown?` | Source item usado para o test. |
| `output` | `unknown?` | Raw/human output. |
| `sourceEventsCount` | `number?` | Número de source items encontrados. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### ProviderTestResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o provider test fue bem-sucedido. |
| `issues` | `string[]` | Issues. |
| `result` | `unknown?` | Output do provider. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### RuntimeSource

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `app` | `string` | Runtime app name. |
| `network` | `string` | Nome de network/source. |
| `plugin` | `"evm" \| "substrate" \| "solana"` | Tipo de runtime plugin. |
| `instance` | `string` | Runtime instance. |
| `status` | `"running" \| "degraded" \| "error"` | Status do runtime. |
| `updatedAt` | `string` | Data de atualização em formato ISO. |
| `latestSeenBlock` | `number?` | Último block visto por runtime. |
| `lastProcessedBlock` | `number?` | Último block procesado. |
| `blockLag` | `number?` | Block lag actual. |
| `lastFailedBlock` | `number?` | Último failed block. |
| `errorsLastHour` | `number?` | Quantidade de errors na última hora. |

### LatestBlockResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o lookup fue bem-sucedido. |
| `issues` | `string[]` | Issues de lookup. |
| `latestBlock` | `number?` | Latest block encontrado. |
| `matched` | `boolean` | Indica se foi encontrado un source item coincidente. |
| `matchedBlock` | `number?` | Block em que o match foi encontrado. |
| `checkedBlocks` | `number` | Número de blocks verificados. |
| `sourceEventsCount` | `number?` | Quantidade de source events. |
| `itemIndex` | `number?` | Índice do item encontrado. |
| `input` | `unknown?` | Input encontrado. |
| `source` | `string?` | Source do lookup. |
| `details` | `unknown?` | Detalhes adicionais. |

## Trigger Import

### EvmAbiImportResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `events` | `unknown[]?` | Entries ABI event parseadas. |
| `calls` | `unknown[]?` | Entries ABI call/function parseadas. |
| `items` | `unknown[]?` | Lista unificada de entries parseadas se runtime retorna uma lista plana. |
| `error` | `string?` | Mensagem de erro se runtime não conseguiu parsear ABI. |

### EvmAbiResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `abi` | `unknown[]?` | Entries ABI JSON se ABI foi carregado. |
| `source` | `string?` | Marcador ABI source. |
| `contract` | `string?` | Endereço do contract. |
| `error` | `string?` | Mensagem de erro se não foi possível carregar ABI. |

### TriggerImportDraftsResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `abiSource` | `"provided" \| "auto"?` | ABI source usado para EVM import. |
| `drafts` | `TriggerDraftView[]` | Trigger drafts gerados. |

### SubstrateSourceInfo

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ss58Prefix` | `number` | SS58 prefix para o Substrate source. |

### SubstratePalletSummary

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `name` | `string` | Nome do pallet. |
| `docs` | `string[]` | Documentação do pallet. |
| `hasEvents` | `boolean` | Indica se o pallet tem events. |
| `hasCalls` | `boolean` | Indica se o pallet tem calls. |
| `eventCount` | `number` | Número de events. |
| `callCount` | `number` | Número de calls. |

## Templates

### ProjectTemplate

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `project` | `string` | Fullname do project. |
| `schema` | `Record<string, TipoSchema>` | Input schema a nivel de template. |
| `groups` | `TemplateGroup[]` | Groups mostrados aos usuários como templates. |
| `topics` | `TemplateTopic[]` | Topics dentro de groups. |
| `rules` | `TemplateRule[]` | Trigger rules para topics. |
| `meta` | `Record<string, unknown>` | Template metadata. |
| `issue` | `string?` | Problema de sincronização do template. |

### TemplateGroup

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `name` | `string` | Id do group. |
| `meta.title` | `string` | Título visível. |
| `meta.description` | `string` | Descrição. |

### TemplateTopic

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `name` | `string` | Id topic. |
| `group` | `string` | Id do group padre. |
| `selectedByDefault` | `boolean` | Indica se o topic está selecionado por padrão no subscription wizard. |
| `meta.title` | `string` | Título visível. |

### TemplateRule

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id da rule. |
| `trigger` | `string` | Fullname do trigger. |
| `topic` | `string` | Nome do topic. |
| `inputs` | `object?` | Mapping/defaults de inputs para a rule. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |
| `deprecated` | `boolean` | Indica se a rule está marcada como deprecated. |
| `requiredValues` | `string[]` | Valores template obrigatórios. |
| `issue` | `string?` | Missing trigger or sync issue. |

## Subscriptions

### SubscriptionView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id subscription. |
| `targetWorkspaceFullname` | `string?` | Workspace proprietário da subscription. |
| `createdByAccountId` | `string?` | Account que criou a subscription. |
| `sourceProjectId` | `string?` | Id do project de origem. |
| `sourceProjectFullname` | `string?` | Fullname do project de origem. |
| `countsTowardsTierQuota` | `boolean?` | Indica se a subscription conta para a cota do Free tier. |
| `state` | `"on" \| "off" \| "blocked"` | Status da subscription. |
| `createdAt` | `string` | Data de criação em formato ISO. |
| `updatedAt` | `string` | Data de atualização em formato ISO. |
| `template` | `SubscriptionTemplateReference \| null` | Referência ao template ou `null` para una direct trigger subscription. |
| `rules` | `SubscriptionRule[]` | Trigger rules. |
| `resources` | `string[]` | Fullnames de resources usados por actions. |
| `actions` | `SubscriptionAction[]?` | Notification actions. |
| `references` | `SubscriptionReferences` | Referencias denormalizadas a source/project/trigger. |
| `meta.title` | `string?` | Título visível. |
| `meta.issue` | `string?` | Problema de block/entitlement/migration. |

### SubscriptionTemplateReference

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `inputs` | `Record<string, string \| number>` | Valores de inputs do template. |
| `groups` | `{ name: string, meta: { title: string } }[]` | Groups selecionados. |
| `topics` | `string[]` | Topics selecionados. |
| `rules` | `{ id: string, group: string }[]` | Referências a rules selecionadas. |

### SubscriptionRule

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `triggerId` | `string?` | Id do trigger. |
| `trigger` | `RuleTriggerReference` | Referência ao trigger. |
| `inputs` | `object?` | Valores de inputs. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |

### SubscriptionAction

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `action` | `string` | Action fullname. |
| `values` | `Record<string, unknown>` | Valores da action. |
| `overrides` | `EventDefaults?` | Campos override de notification. |

### SubscriptionReferences

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `sources` | `string[]` | References to data sources. |
| `projects` | `string[]` | Fullnames de projects. |
| `triggers` | `string[]` | Fullnames de triggers. |
| `projectIds` | `string[]?` | Ids de projects. |
| `triggerIds` | `string[]?` | Ids de triggers. |

### SubscriptionTestResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `valid` | `boolean` | Indica se o test es válido. |
| `issues` | `string[]` | Issues do test. |
| `preview` | `unknown?` | Resultado de preview/send de notification. |
| `subscription` | `SubscriptionView?` | Draft subscription usado para o test. |

### SubscriptionAlertLog

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id do log. |
| `subscriptionId` | `string` | Id subscription. |
| `workspaceId` | `string` | Id workspace. |
| `projectFullname` | `string?` | Fullname do project. |
| `triggerFullname` | `string?` | Fullname do trigger. |
| `eventName` | `string` | Nome de event/trigger. |
| `createdAt` | `string` | Data de criação em formato ISO. |
| `status` | `"delivered" \| "failed" \| "rate_limited" \| "blocked"` | Status de delivery. |
| `testInput` | `Record<string, unknown>?` | Test input. |
| `itemIndex` | `number?` | Índice do source item. |
| `replayMatch` | `{ hash?: string \| null, index?: number \| null }?` | Informação de replay match. |
| `sourceItemsCount` | `number?` | Número de source items. |
| `channels` | `SubscriptionAlertLogChannel[]` | Canais de delivery. |
| `failureReasonCode` | `string?` | Código de erro. |
| `failureReasonMessage` | `string?` | Error message. |
| `expireAt` | `string` | Data de expiração do log. |

## Resources

### ResourceView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id resource. |
| `name` | `string` | Resource name. |
| `fullname` | `string` | Resource fullname. |
| `project` | `string?` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public. |
| `blueprint` | `string` | Blueprint fullname. |
| `token` | `string?` | Token secreto. Retornado apenas quando o caller pode ver campos privados do resource. |
| `ready` | `boolean` | Indica se o resource está pronto. |
| `remark` | `string \| null` | Observação de status do resource. |
| `data` | `object \| null?` | Dados de setup do resource. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visível. |

### ExternalResourceView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `blocks` | `{ type: "markdown", text: string }[]` | Blocos de conteúdo UI retornados pela external app. |

## Data Sources

### CustomSourceListView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `workspace` | `string` | Fullname do workspace proprietário. |
| `name` | `string` | Source name. |
| `fullname` | `string` | Fullname do source. |
| `public` | `boolean` | Flag public. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Tipo do source. |
| `meta` | `CustomSourceMeta` | Metadados. |
| `createdAt` | `string` | Data de criação em formato ISO. |
| `updatedAt` | `string` | Data de atualização em formato ISO. |
| `deployerTitle` | `string?` | Título visível de deployer/owner. |

### CustomSource

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `createdByAccountId` | `string?` | Creator account id. |
| `endpoints` | `string[]` | RPC endpoints do runtime. |
| `substrate` | `object?` | Config de Substrate extensions/types/RPC. |
| `batchMaxCount` | `number?` | Tamanho máximo do EVM batch. |
| `blockProcessingConcurrency` | `number?` | Concorrência de procesamiento de blocks. |
| `maxQueuedBlocks` | `number?` | Máximo de queued blocks. |
| `logs` | `{ retentionMs: number, maxCount: number \| null }?` | Policy log runtime. |
| `runtime` | `CustomSourceRuntimeMetadata?` | Metadados do runtime. |

### CustomSourceMeta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string` | Título visível. |
| `description` | `string?` | Descrição. |
| `icons.default` | `string?` | Default icon URL. |
| `og` | `object?` | Metadata OpenGraph. |

### CustomSourceRuntimeMetadata

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `evm.chainId` | `number?` | EVM chain id. |
| `evm.latestBlock` | `number?` | Latest EVM block. |
| `evm.blockHash` | `string?` | Hash do block. |
| `evm.fetchedAt` | `string` | Metadata fetch date. |
| `substrate.ss58Prefix` | `number?` | SS58 prefix. |
| `substrate.latestBlock` | `number?` | Latest Substrate block. |
| `substrate.fetchedAt` | `string` | Metadata fetch date. |
| `solana.genesisHash` | `string?` | Genesis hash da Solana network. |
| `solana.latestBlock` | `number?` | Último Solana slot/block. |
| `solana.blockHash` | `string?` | Hash do block. |
| `solana.fetchedAt` | `string` | Metadata fetch date. |

### CustomSourceCreateCapability

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Account tier. |
| `canCreateCustomSources` | `boolean` | Indica se o account atual pode crear custom sources. |
| `customSourcesUsed` | `number` | Número atual de private custom sources. |
| `customSourcesLimit` | `number \| null` | Limite; `null` significa sem limite. |

### CustomSourceVerifyResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ok` | `boolean` | Indica se verification foi bem-sucedida. |
| `logs` | `{ level: "info" \| "error", message: string }[]` | Mensagens do verification log. |
| `details` | `Record<string, unknown>?` | Detalhes do duplicate check runtime/public. |
| `error` | `string?` | Erro de verification. |

### CustomSourceLogsResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `exists` | `boolean` | Indica se o log file existe. |
| `lines` | `string[]` | Linhas de log editadas. |
| `truncated` | `boolean` | Indica se o output foi truncado. |
| `updatedAt` | `string?` | Data de atualização do log file. |

### CustomSourceRuntimeActionResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ok` | `true` | Indica se a runtime action foi bem-sucedida. |
| `sourceFullname` | `string` | Fullname do source. |
| `revision` | `number` | Runtime revision depois de restart/reset. |

### CustomSourceResetLagResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ok` | `true` | Indica se reset fue bem-sucedido. |
| `latestBlock` | `number` | Último block usado como novo baseline do lag. |

### CustomSourceStatusTestResult

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ok` | `true` | Test event enviado. |
| `eventName` | `string` | Nome gerado do status trigger. |
| `subscriptionsTested` | `number` | Subscriptions testadas. |
| `matched` | `number` | Número de matched subscriptions. |
| `delivered` | `number` | Alerts entregues. |
| `event` | `CustomSourceStatusEvent` | Status event de test. |

### CustomSourceStatusEvent

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `type` | `"status_changed" \| "error" \| "recovered"` | Tipo do event. |
| `sourceFullname` | `string` | Fullname do source. |
| `sourceName` | `string` | Source name. |
| `sourceTitle` | `string` | Título visível. |
| `workspace` | `string` | Fullname do workspace. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Tipo do source. |
| `status` | `"running" \| "error" \| "degraded"` | Novo status. |
| `previousStatus` | `"running" \| "error" \| "degraded"?` | Status anterior. |
| `severity` | `"info" \| "warning" \| "error"` | Severity. |
| `message` | `string` | Mensagem legível por humanos. |
| `code` | `string?` | Machine-readable code. |
| `details` | `Record<string, unknown>?` | Detalhes adicionais. |
| `timestamp` | `string` | Hora do event em formato ISO. |

## Addresses

### AddressEntry

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id address entry. |
| `type` | `"plain" \| "ss58" \| "evm" \| "bitcoin" \| "cosmos"` | Tipo address. |
| `address` | `string` | Valor do address. |
| `alias` | `string` | Alias visible. |

## Builder Registry

### AppView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id app. |
| `name` | `string` | App name. |
| `fullname` | `string` | App fullname. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public. |
| `url` | `string?` | URL da app. Retornado apenas quando o caller pode ver campos privados. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |

### ActionView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id action. |
| `name` | `string` | Action name. |
| `fullname` | `string` | Action fullname. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public. |
| `backend` | `{ type: "sdk", action: string }` | Backend da action. |
| `values` | `Record<string, TipoSchema>` | Schema de values da action. |
| `overrides` | `Array<keyof EventDefaults>` | Campos de notification que a action pode sobrescrever. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visível. |
| `meta.description` | `string?` | Descrição. |

### BlueprintView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id blueprint. |
| `name` | `string` | Blueprint name. |
| `fullname` | `string` | Blueprint fullname. |
| `app` | `string` | App fullname. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public. |
| `type` | `string` | Tipo do blueprint. |
| `data` | `object?` | Object spec do blueprint. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visível. |
| `meta.description` | `string?` | Descrição. |

### SharedTipoView

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string` | Id shared type. |
| `name` | `string` | Nome do shared type. |
| `fullname` | `string` | Shared type fullname. |
| `project` | `string` | Fullname do project. |
| `workspace` | `string` | Fullname do workspace. |
| `public` | `boolean` | Flag public. |
| `schemas` | `Record<string, TipoSchema>` | Schemas nomeados. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visível. |
| `meta.description` | `string?` | Descrição. |

## Supporting Tipos

### EventDefaults

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string?` | Template do título de notification. |
| `short` | `string?` | Template do texto markdown curto. |
| `long` | `string?` | Template do texto markdown longo. |
| `icon` | `string \| null?` | Template de URL icon. |
| `cover` | `string \| null?` | Template de URL cover. |
| `avatar` | `string \| null?` | Template de URL avatar. |
| `links` | `{ title: string, url: string }[]?` | Links de notification. |
