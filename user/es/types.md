# Tipos

## Common

### OperationResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| - | `{}` o cuerpo de respuesta vacío | El endpoint se completó correctamente. |

### TokenResponse

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `token` | `string` | Bearer token para solicitudes API/MCP posteriores. |

### AvatarUploadResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `url` | `string` | URL del avatar cargado. |
| `fileName` | `string` | Nombre del archivo guardado. |
| `extension` | `string` | Extensión del archivo. |
| `size` | `number` | Tamaño del archivo en bytes. |

### TagsAndLabels

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tags` | `string[]` | Tags cortos para filtrar y agrupar. |
| `labels` | `Record<string, string>` | Labels legibles por máquina. |

## Account

### Me

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id account. |
| `newid` | `string` | Campo legacy compatible del id de account. |
| `tier` | `"free" \| "advanced" \| "pro"` | Tier actual del account. |
| `settings` | `object` | Settings del account. |
| `meta.nickname` | `string` | Nombre visible del account. |
| `meta.avatar` | `string?` | URL del avatar del account. |
| `token.identity` | `string` | Identity vinculada al token actual. |
| `workspace` | `WorkspaceView \| null` | Workspace seleccionado actualmente. |
| `memberships` | `UserMembership[]` | Workspaces en los que el account es miembro. |
| `addressbook` | `AddressEntry[]` | Addresses del contexto actual de workspace/account. |
| `subscriptions` | `Record<string, number>` | Contadores de subscriptions por clave source/project. |
| `counters.subscriptions` | `SubscriptionCounter[]` | Contadores agregados de subscriptions. |

### UserMembership

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id membership/ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Rol dentro del workspace. |
| `workspace` | `WorkspaceViewShort` | Workspace al que pertenece este membership. |

### AccountSettings

| Campo | Tipo | Descripción |
| --- | --- | --- |
| - | `object` | Objeto settings de la versión actual de UI. El conjunto de campos puede ampliarse. |

### CurrentWorkspaceResponse

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `workspace` | `WorkspaceView \| null` | Workspace seleccionado actualmente o `null`. |

## Workspaces

### WorkspaceView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Nombre único del workspace. |
| `invite` | `string?` | Invite token. Se devuelve solo cuando el caller puede ver los datos privados del workspace. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visible del workspace. |
| `meta.avatar` | `string?` | URL del avatar del workspace. |

### WorkspaceViewShort

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Fullname del workspace. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta` | `object?` | Metadata del workspace. |

### WorkspaceAclEntry

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Rol. |
| `user` | `UserViewShort` | Usuario si la entry ya está vinculada a un account. |
| `object` | `{ type: string, id: string }?` | Referencia al workspace. Puede aparecer en la respuesta ACL raw. |
| `subject` | `{ type: string, id: string }?` | Referencia a user/invite. Puede aparecer en la respuesta ACL raw. |

## Projects

### ProjectView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id project. |
| `createdAt` | `string?` | Fecha de creación en formato ISO. |
| `updatedAt` | `string?` | Fecha de actualización en formato ISO. |
| `createdByAccountId` | `string?` | Id del account propietario. |
| `billingAccountId` | `string?` | Id del account propietario de billing. |
| `name` | `string` | Nombre del project dentro del workspace. |
| `fullname` | `string` | Fullname canónico del project. |
| `workspace` | `string` | Fullname del workspace propietario. |
| `public` | `boolean` | Flag public legacy. |
| `visibility` | `"public" \| "private_link" \| "personal"?` | Storage visibility. |
| `accessLevel` | `"private" \| "public" \| "free"?` | Nivel de acceso del producto. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visible. |
| `meta.description` | `string` | Descripción completa. |
| `meta.shortDescripción` | `string?` | Descripción corta. |
| `meta.links` | `{ title: string, url: string }[]?` | Enlaces útiles. |
| `meta.icon` | `string?` | URL icon. |
| `meta.avatar` | `string?` | URL del avatar, normalmente igual que icon. |
| `meta.cover` | `string?` | URL cover. |
| `ownerTitle` | `string?` | Título visible del propietario workspace/account. |
| `triggerLimits.maxProvidersPerTrigger` | `number \| null` | Límite de peso de providers por trigger. El nombre del campo se conserva por compatibilidad de API. |

### ProjectCreateCapability

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Tier actual del account. |
| `canCreateProjects` | `boolean` | Indica si se puede crear un project. |
| `privateProjectsUsed` | `number` | Cuántos private projects ya cuentan para el límite. |
| `privateProjectsLimit` | `number \| null` | Límite de private projects; `null` significa sin límite. |
| `canCreatePrivateProjects` | `boolean` | Indica si se puede crear un private project dentro del límite. |

### ProjectAccessLink

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `token` | `string` | Token del access link. |
| `project` | `string` | Fullname del project. |
| `maxUsages` | `number?` | Número máximo de usos. |
| `usages` | `number?` | Número actual de usos. |
| `expiresAt` | `string?` | Fecha de expiración en formato ISO. |
| `createdAt` | `string?` | Fecha de creación en formato ISO. |

### ProjectImageUploadResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `url` | `string` | URL de la imagen cargada. |
| `fileName` | `string` | Nombre del archivo guardado. |
| `extension` | `string` | Extensión del archivo. |
| `size` | `number` | Tamaño del archivo en bytes. |

## Project Transfers

### ProjectTransferPlan

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `mode` | `"dry-run"` | Modo de vista previa del plan. |
| `source` | `ProjectTransferProjectRef` | Project de origen. |
| `target` | `ProjectTransferTargetRef` | Workspace, name y fullname de destino. |
| `counts` | `ProjectTransferCounts` | Contadores de lo que se transferirá. |
| `changes` | `ProjectTransferChanges` | Lista detallada de cambios planificados. |
| `conflicts` | `ProjectTransferConflict[]` | Conflictos bloqueantes. |
| `notes` | `string[]` | Notas adicionales. |
| `planHash` | `string?` | Hash del plan, si el endpoint de creación del request lo devuelve junto al plan. |

### ProjectTransferCounts

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `triggers` | `number` | Triggers que se transferirán. |
| `templates` | `number` | Registros de templates que se transferirán. |
| `templateGroups` | `number` | Grupos del template. |
| `templateTopics` | `number` | Topics del template. |
| `subscriptions` | `number` | Subscriptions cuyas referencias se verán afectadas. |
| `scopedEntities` | `number` | Apps/actions/resources/types/blueprints vinculados al project. |
| `projectAccessLinks` | `number` | Access links que se actualizarán. |
| `aliasWrites` | `number` | Entity aliases que se crearán o actualizarán. |
| `aliasMissing` | `number` | Aliases faltantes que se crearán. |
| `aliasStale` | `number` | Aliases obsoletos que se actualizarán. |
| `conflicts` | `number` | Número de conflictos. |

### ProjectTransferRequest

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id request. |
| `sourceProjectId` | `string` | Id del project de origen. |
| `sourceProjectFullname` | `string` | Fullname del project de origen. |
| `sourceWorkspace` | `string` | Fullname del workspace de origen. |
| `targetWorkspace` | `string` | Fullname del workspace de destino. |
| `targetName` | `string` | Nombre del project en el workspace de destino. |
| `targetFullname` | `string` | Fullname del project en el workspace de destino. |
| `status` | `"pending" \| "accepted" \| "rejected" \| "cancelled" \| "expired" \| "failed"` | Estado del request. |
| `requestedByAccountId` | `string` | Account que creó el request. |
| `sourceOwnerAccountId` | `string` | Account propietario actual del source. |
| `targetOwnerAccountId` | `string` | Account propietario del destino. |
| `planHash` | `string` | Hash del plan aceptado. |
| `planCounts` | `Record<string, number>` | Snapshot de los contadores del plan. |
| `expiresAt` | `string` | Fecha de expiración en formato ISO. |
| `createdAt` | `string` | Fecha de creación en formato ISO. |
| `updatedAt` | `string` | Fecha de actualización en formato ISO. |
| `decidedAt` | `string?` | Fecha de decisión en formato ISO. |
| `decidedByAccountId` | `string?` | Account que aceptó, rechazó o canceló el request. |
| `appliedAt` | `string?` | Fecha de aplicación en formato ISO. |
| `rejectedReason` | `string?` | Motivo del rechazo. |
| `failureReason` | `string?` | Motivo del error. |

### ProjectTransferAcceptResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `request` | `ProjectTransferRequest` | Request aceptado. |
| `transfer` | `ProjectTransferApplyResult` | Detalles de la transferencia aplicada. |

### ProjectTransferApplyResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `mode` | `"apply"` | Modo de aplicación. |
| `appliedAt` | `string` | Fecha de aplicación en formato ISO. |
| `writes.projects` | `number` | Registros de project actualizados. |
| `writes.triggers` | `number` | Triggers actualizados. |
| `writes.triggerProviders` | `number` | Trigger providers actualizados. |
| `writes.triggerTransforms` | `number` | Trigger transforms actualizados. |
| `writes.templates` | `number` | Templates actualizados. |
| `writes.subscriptions` | `number` | Subscriptions actualizadas. |
| `writes.scopedEntities` | `number` | Entidades vinculadas al project actualizadas. |
| `writes.projectAccessLinks` | `number` | Access links actualizados. |
| `writes.aliases` | `number` | Aliases escritos. |

## Triggers

### TriggerView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id del trigger. |
| `createdAt` | `string?` | Fecha de creación en formato ISO. |
| `updatedAt` | `string?` | Fecha de actualización en formato ISO. |
| `name` | `string` | Nombre del trigger dentro del project. |
| `fullname` | `string` | Fullname canónico del trigger. |
| `projectId` | `string?` | Id project. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public legacy. |
| `backend` | `{ type: "sdk", trigger: string, values?: object }` | Referencia al backend runtime. |
| `inputs` | `Record<string, TipoSchema>` | Inputs obligatorios de la subscription. |
| `defaults` | `EventDefaults?` | Defaults recomendados para notification. |
| `output` | `Record<string, TipoSchema>?` | Legacy output schema. |
| `triggerSpec` | `TriggerSpec?` | Especificación de source matching. |
| `filtersSchema` | `Record<string, TriggerOutputSchemaCampo>?` | Filters opcionales de subscription. |
| `outputSchema` | `Record<string, TriggerOutputSchemaCampo>?` | Schema de raw/human output. |
| `activation` | `TriggerActivation \| null?` | Activation condition opcional. |
| `executionPolicy` | `object?` | Overrides de runtime policy. |
| `status` | `TriggerStatusDetails` | Status de test/runtime. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visible. |
| `meta.description` | `string?` | Descripción. |
| `hasProviders` | `boolean?` | `true` si existen providers. |
| `hasTransform` | `boolean?` | `true` si existe transform. |

### TriggerDraftView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `providers` | `TriggerProvider[]?` | Definiciones completas de providers. |
| `transform` | `TriggerTransform?` | Transform JavaScript raw/human. |

### TriggerStatusDetails

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `status` | `"not_tested" \| "ready" \| "broken"` | Estado actual. |
| `issue` | `string?` | Issue legible por humanos. |
| `source` | `"edit" \| "test" \| "runtime" \| "dependency"?` | Origen del status. |
| `updatedAt` | `string?` | Fecha de actualización en formato ISO. |

### TriggerSpec

| Variante | Campos principales |
| --- | --- |
| `evm_log` | `type`, `dataSource`, opcionalmente `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput`. |
| `evm_transaction` | `type`, `dataSource`, opcionalmente `testInput`. |
| `substrate_event` | `type`, `dataSource`, opcionalmente `pallet`, `event`, `testInput`. |
| `solana_event` | `type`, `dataSource`, opcionalmente `programId`, `event`, `idl`, `testInput`. Para calls, `event` guarda un valor con prefijo `call:`. |
| `timer` | `type`, `interval`, opcionalmente `testInput`. |

### TriggerTransform

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `language` | `"javascript"` | Lenguaje del transform. |
| `source` | `string?` | Source legacy. |
| `rawSource` | `string?` | Transformación a raw output. |
| `humanSource` | `string?` | Transformación de raw output a human output. |

### TriggerActivation

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `language` | `"javascript"` | Lenguaje del activation. |
| `source` | `string` | Código fuente JavaScript de la condition. |

### TriggerValidationResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el draft es válido. |
| `issues` | `string[]` | Issues de validación. |
| `trigger` | `TriggerDraftView?` | Trigger draft normalizado si el endpoint lo devuelve. |

### TriggerPatchResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `fullname` | `string` | Fullname del trigger. |
| `dryRun` | `boolean?` | `true` si los cambios solo se validaron. |
| `updated` | `boolean` | Indica si el trigger fue modificado. |
| `changedPaths` | `string[]` | Dotted paths que se modificaron. |
| `trigger` | `TriggerDraftView` | Trigger después del patch o vista dry-run normalizada. |

### TriggerBulkPatchResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` si el bulk patch fue dry run. |
| `totalCount` | `number` | Número de items procesados. |
| `updatedCount` | `number` | Número de items modificados. |
| `items` | `TriggerBulkPatchItem[]` | Resultados por trigger. |

### TriggerBulkPatchItem

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `fullname` | `string` | Fullname del trigger. |
| `dryRun` | `boolean?` | `true` si el item fue dry run. |
| `updated` | `boolean` | Indica si el trigger fue modificado. |
| `changedPaths` | `string[]` | Paths modificados. |
| `status` | `string?` | Status del trigger después del patch. |
| `statusUpdatedAt` | `string?` | Fecha de actualización del status. |
| `unsetPaths` | `string[]` | Paths que se eliminaron. |

### TriggerBulkRemoveResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true` si el bulk remove fue dry run. |
| `totalCount` | `number` | Número de triggers procesados. |
| `deletedCount` | `number` | Número de triggers eliminados. |
| `items` | `TriggerBulkRemoveItem[]` | Resultados por trigger. |

### TriggerBulkRemoveItem

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `fullname` | `string` | Fullname del trigger. |
| `dryRun` | `boolean?` | `true` si el item fue dry run. |
| `deleted` | `boolean` | Indica si el trigger fue eliminado. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |

### TriggerPreviewResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el preview fue exitoso. |
| `issues` | `string[]` | Issues. |
| `output` | `unknown?` | Preview del output. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### TriggerTestResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el test fue exitoso. |
| `issues` | `string[]` | Issues del test. |
| `input` | `unknown?` | Source item usado para el test. |
| `output` | `unknown?` | Raw/human output. |
| `sourceEventsCount` | `number?` | Número de source items encontrados. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### ProviderTestResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el provider test fue exitoso. |
| `issues` | `string[]` | Issues. |
| `result` | `unknown?` | Output del provider. |
| `debug` | `Record<string, unknown>?` | Debug details. |

### RuntimeSource

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `app` | `string` | Nombre de la runtime app. |
| `network` | `string` | Nombre de network/source. |
| `plugin` | `"evm" \| "substrate" \| "solana"` | Tipo de runtime plugin. |
| `instance` | `string` | Instancia runtime. |
| `status` | `"running" \| "degraded" \| "error"` | Status del runtime. |
| `updatedAt` | `string` | Fecha de actualización en formato ISO. |
| `latestSeenBlock` | `number?` | Último block visto por runtime. |
| `lastProcessedBlock` | `number?` | Último block procesado. |
| `blockLag` | `number?` | Block lag actual. |
| `lastFailedBlock` | `number?` | Último failed block. |
| `errorsLastHour` | `number?` | Cantidad de errors en la última hora. |

### LatestBlockResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el lookup fue exitoso. |
| `issues` | `string[]` | Issues de lookup. |
| `latestBlock` | `number?` | Latest block encontrado. |
| `matched` | `boolean` | Indica si se encontró un source item coincidente. |
| `matchedBlock` | `number?` | Block en el que se encontró el match. |
| `checkedBlocks` | `number` | Número de blocks revisados. |
| `sourceEventsCount` | `number?` | Cantidad de source events. |
| `itemIndex` | `number?` | Índice del item encontrado. |
| `input` | `unknown?` | Input encontrado. |
| `source` | `string?` | Source del lookup. |
| `details` | `unknown?` | Detalles adicionales. |

## Trigger Import

### EvmAbiImportResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `events` | `unknown[]?` | Entries ABI event parseadas. |
| `calls` | `unknown[]?` | Entries ABI call/function parseadas. |
| `items` | `unknown[]?` | Lista unificada de entries parseadas si runtime devuelve una lista plana. |
| `error` | `string?` | Mensaje de error si runtime no pudo parsear ABI. |

### EvmAbiResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `abi` | `unknown[]?` | Entries ABI JSON si se cargó ABI. |
| `source` | `string?` | Marcador ABI source. |
| `contract` | `string?` | Dirección del contract. |
| `error` | `string?` | Mensaje de error si no se pudo cargar ABI. |

### TriggerImportDraftsResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `abiSource` | `"provided" \| "auto"?` | ABI source usado para EVM import. |
| `drafts` | `TriggerDraftView[]` | Trigger drafts generados. |

### SubstrateSourceInfo

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ss58Prefix` | `number` | SS58 prefix para el Substrate source. |

### SubstratePalletSummary

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | `string` | Nombre del pallet. |
| `docs` | `string[]` | Documentación del pallet. |
| `hasEvents` | `boolean` | Indica si el pallet tiene events. |
| `hasCalls` | `boolean` | Indica si el pallet tiene calls. |
| `eventCount` | `number` | Número de events. |
| `callCount` | `number` | Número de calls. |

## Templates

### ProjectTemplate

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `project` | `string` | Fullname del project. |
| `schema` | `Record<string, TipoSchema>` | Input schema a nivel de template. |
| `groups` | `TemplateGroup[]` | Groups mostrados a los usuarios como templates. |
| `topics` | `TemplateTopic[]` | Topics dentro de groups. |
| `rules` | `TemplateRule[]` | Trigger rules para topics. |
| `meta` | `Record<string, unknown>` | Template metadata. |
| `issue` | `string?` | Problema de sincronización del template. |

### TemplateGroup

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | `string` | Id del group. |
| `meta.title` | `string` | Título visible. |
| `meta.description` | `string` | Descripción. |

### TemplateTopic

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | `string` | Id topic. |
| `group` | `string` | Id del group padre. |
| `selectedByDefault` | `boolean` | Indica si el topic está seleccionado por defecto en el subscription wizard. |
| `meta.title` | `string` | Título visible. |

### TemplateRule

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id de la rule. |
| `trigger` | `string` | Fullname del trigger. |
| `topic` | `string` | Nombre del topic. |
| `inputs` | `object?` | Mapping/defaults de inputs para la rule. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |
| `deprecated` | `boolean` | Indica si la rule está marcada como deprecated. |
| `requiredValues` | `string[]` | Valores template obligatorios. |
| `issue` | `string?` | Missing trigger or sync issue. |

## Subscriptions

### SubscriptionView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id subscription. |
| `targetWorkspaceFullname` | `string?` | Workspace propietario de la subscription. |
| `createdByAccountId` | `string?` | Account que creó la subscription. |
| `sourceProjectId` | `string?` | Id del project de origen. |
| `sourceProjectFullname` | `string?` | Fullname del project de origen. |
| `countsTowardsTierQuota` | `boolean?` | Indica si la subscription cuenta para la cuota del Free tier. |
| `state` | `"on" \| "off" \| "blocked"` | Estado de la subscription. |
| `createdAt` | `string` | Fecha de creación en formato ISO. |
| `updatedAt` | `string` | Fecha de actualización en formato ISO. |
| `template` | `SubscriptionTemplateReference \| null` | Referencia al template o `null` para una direct trigger subscription. |
| `rules` | `SubscriptionRule[]` | Trigger rules. |
| `resources` | `string[]` | Fullnames de resources usados por actions. |
| `actions` | `SubscriptionAction[]?` | Notification actions. |
| `references` | `SubscriptionReferences` | Referencias denormalizadas a source/project/trigger. |
| `meta.title` | `string?` | Título visible. |
| `meta.issue` | `string?` | Problema de block/entitlement/migration. |

### SubscriptionTemplateReference

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `inputs` | `Record<string, string \| number>` | Valores de inputs del template. |
| `groups` | `{ name: string, meta: { title: string } }[]` | Groups seleccionados. |
| `topics` | `string[]` | Topics seleccionados. |
| `rules` | `{ id: string, group: string }[]` | Referencias a rules seleccionadas. |

### SubscriptionRule

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `triggerId` | `string?` | Id del trigger. |
| `trigger` | `RuleTriggerReference` | Referencia al trigger. |
| `inputs` | `object?` | Valores de inputs. |
| `policy` | `object?` | Execution policy. |
| `conditions` | `Condition \| null?` | Condition rule. |

### SubscriptionAction

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `action` | `string` | Action fullname. |
| `values` | `Record<string, unknown>` | Valores de la action. |
| `overrides` | `EventDefaults?` | Campos override de notification. |

### SubscriptionReferences

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `sources` | `string[]` | References to data sources. |
| `projects` | `string[]` | Fullnames de projects. |
| `triggers` | `string[]` | Fullnames de triggers. |
| `projectIds` | `string[]?` | Ids de projects. |
| `triggerIds` | `string[]?` | Ids de triggers. |

### SubscriptionTestResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `valid` | `boolean` | Indica si el test es válido. |
| `issues` | `string[]` | Issues del test. |
| `preview` | `unknown?` | Resultado de preview/send de notification. |
| `subscription` | `SubscriptionView?` | Draft subscription usado para el test. |

### SubscriptionAlertLog

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id del log. |
| `subscriptionId` | `string` | Id subscription. |
| `workspaceId` | `string` | Id workspace. |
| `projectFullname` | `string?` | Fullname del project. |
| `triggerFullname` | `string?` | Fullname del trigger. |
| `eventName` | `string` | Nombre de event/trigger. |
| `createdAt` | `string` | Fecha de creación en formato ISO. |
| `status` | `"delivered" \| "failed" \| "rate_limited" \| "blocked"` | Status de delivery. |
| `testInput` | `Record<string, unknown>?` | Test input. |
| `itemIndex` | `number?` | Índice del source item. |
| `replayMatch` | `{ hash?: string \| null, index?: number \| null }?` | Información de replay match. |
| `sourceItemsCount` | `number?` | Número de source items. |
| `channels` | `SubscriptionAlertLogChannel[]` | Canales de delivery. |
| `failureReasonCode` | `string?` | Código de error. |
| `failureReasonMessage` | `string?` | Mensaje de error. |
| `expireAt` | `string` | Fecha de expiración del log. |

## Resources

### ResourceView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id resource. |
| `name` | `string` | Resource name. |
| `fullname` | `string` | Resource fullname. |
| `project` | `string?` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public. |
| `blueprint` | `string` | Blueprint fullname. |
| `token` | `string?` | Token secreto. Se devuelve solo cuando el caller puede ver campos privados del resource. |
| `ready` | `boolean` | Indica si el resource está listo. |
| `remark` | `string \| null` | Nota de status del resource. |
| `data` | `object \| null?` | Datos de setup del resource. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visible. |

### ExternalResourceView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `blocks` | `{ type: "markdown", text: string }[]` | Bloques de contenido UI devueltos por la external app. |

## Data Sources

### CustomSourceListView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `workspace` | `string` | Fullname del workspace propietario. |
| `name` | `string` | Nombre del source. |
| `fullname` | `string` | Fullname del source. |
| `public` | `boolean` | Flag public. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Tipo de source. |
| `meta` | `CustomSourceMeta` | Metadata. |
| `createdAt` | `string` | Fecha de creación en formato ISO. |
| `updatedAt` | `string` | Fecha de actualización en formato ISO. |
| `deployerTitle` | `string?` | Título visible de deployer/owner. |

### CustomSource

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `createdByAccountId` | `string?` | Creator account id. |
| `endpoints` | `string[]` | RPC endpoints del runtime. |
| `substrate` | `object?` | Config de Substrate extensions/types/RPC. |
| `batchMaxCount` | `number?` | Tamaño máximo del EVM batch. |
| `blockProcessingConcurrency` | `number?` | Concurrencia de procesamiento de blocks. |
| `maxQueuedBlocks` | `number?` | Máximo de queued blocks. |
| `logs` | `{ retentionMs: number, maxCount: number \| null }?` | Policy log runtime. |
| `runtime` | `CustomSourceRuntimeMetadata?` | Metadata del runtime. |

### CustomSourceMeta

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `title` | `string` | Título visible. |
| `description` | `string?` | Descripción. |
| `icons.default` | `string?` | Default icon URL. |
| `og` | `object?` | Metadata OpenGraph. |

### CustomSourceRuntimeMetadata

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `evm.chainId` | `number?` | EVM chain id. |
| `evm.latestBlock` | `number?` | Latest EVM block. |
| `evm.blockHash` | `string?` | Hash del block. |
| `evm.fetchedAt` | `string` | Metadata fetch date. |
| `substrate.ss58Prefix` | `number?` | SS58 prefix. |
| `substrate.latestBlock` | `number?` | Latest Substrate block. |
| `substrate.fetchedAt` | `string` | Metadata fetch date. |
| `solana.genesisHash` | `string?` | Genesis hash de Solana network. |
| `solana.latestBlock` | `number?` | Último Solana slot/block. |
| `solana.blockHash` | `string?` | Hash de block. |
| `solana.fetchedAt` | `string` | Metadata fetch date. |

### CustomSourceCreateCapability

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Account tier. |
| `canCreateCustomSources` | `boolean` | Indica si el account actual puede crear custom sources. |
| `customSourcesUsed` | `number` | Número actual de private custom sources. |
| `customSourcesLimit` | `number \| null` | Límite; `null` significa sin límite. |

### CustomSourceVerifyResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ok` | `boolean` | Indica si verification fue exitosa. |
| `logs` | `{ level: "info" \| "error", message: string }[]` | Mensajes del verification log. |
| `details` | `Record<string, unknown>?` | Detalles del duplicate check runtime/public. |
| `error` | `string?` | Error de verification. |

### CustomSourceLogsResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `exists` | `boolean` | Indica si existe el log file. |
| `lines` | `string[]` | Líneas de log editadas. |
| `truncated` | `boolean` | Indica si el output fue truncado. |
| `updatedAt` | `string?` | Fecha de actualización del log file. |

### CustomSourceRuntimeActionResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ok` | `true` | Indica si la runtime action fue exitosa. |
| `sourceFullname` | `string` | Fullname del source. |
| `revision` | `number` | Runtime revision después de restart/reset. |

### CustomSourceResetLagResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ok` | `true` | Indica si reset fue exitoso. |
| `latestBlock` | `number` | Último block usado como nuevo baseline del lag. |

### CustomSourceStatusTestResult

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `ok` | `true` | Test event enviado. |
| `eventName` | `string` | Nombre generado del status trigger. |
| `subscriptionsTested` | `number` | Subscriptions testeadas. |
| `matched` | `number` | Número de matched subscriptions. |
| `delivered` | `number` | Alerts entregados. |
| `event` | `CustomSourceStatusEvent` | Status event de test. |

### CustomSourceStatusEvent

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `type` | `"status_changed" \| "error" \| "recovered"` | Tipo de event. |
| `sourceFullname` | `string` | Fullname del source. |
| `sourceName` | `string` | Nombre del source. |
| `sourceTitle` | `string` | Título visible. |
| `workspace` | `string` | Fullname del workspace. |
| `kind` | `"evm" \| "substrate" \| "solana"` | Tipo de source. |
| `status` | `"running" \| "error" \| "degraded"` | Nuevo status. |
| `previousStatus` | `"running" \| "error" \| "degraded"?` | Status anterior. |
| `severity` | `"info" \| "warning" \| "error"` | Severity. |
| `message` | `string` | Mensaje legible por humanos. |
| `code` | `string?` | Machine-readable code. |
| `details` | `Record<string, unknown>?` | Detalles adicionales. |
| `timestamp` | `string` | Hora del event en formato ISO. |

## Addresses

### AddressEntry

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id address entry. |
| `type` | `"plain" \| "ss58" \| "evm" \| "bitcoin" \| "cosmos"` | Tipo address. |
| `address` | `string` | Valor del address. |
| `alias` | `string` | Alias visible. |

## Builder Registry

### AppView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id app. |
| `name` | `string` | App name. |
| `fullname` | `string` | App fullname. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public. |
| `url` | `string?` | URL de la app. Se devuelve solo cuando el caller puede ver campos privados. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |

### ActionView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id action. |
| `name` | `string` | Nombre de la action. |
| `fullname` | `string` | Fullname de la action. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public. |
| `backend` | `{ type: "sdk", action: string }` | Backend de la action. |
| `values` | `Record<string, TipoSchema>` | Schema de values de la action. |
| `overrides` | `Array<keyof EventDefaults>` | Campos de notification que la action puede sobrescribir. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string` | Título visible. |
| `meta.description` | `string?` | Descripción. |

### BlueprintView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id blueprint. |
| `name` | `string` | Blueprint name. |
| `fullname` | `string` | Blueprint fullname. |
| `app` | `string` | App fullname. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public. |
| `type` | `string` | Tipo de blueprint. |
| `data` | `object?` | Object spec del blueprint. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visible. |
| `meta.description` | `string?` | Descripción. |

### SharedTipoView

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Id shared type. |
| `name` | `string` | Nombre del shared type. |
| `fullname` | `string` | Shared type fullname. |
| `project` | `string` | Fullname del project. |
| `workspace` | `string` | Fullname del workspace. |
| `public` | `boolean` | Flag public. |
| `schemas` | `Record<string, TipoSchema>` | Schemas con nombre. |
| `tags` | `string[]` | Tags. |
| `labels` | `Record<string, string>` | Labels. |
| `meta.title` | `string?` | Título visible. |
| `meta.description` | `string?` | Descripción. |

## Supporting Tipos

### EventDefaults

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `title` | `string?` | Template del título de notification. |
| `short` | `string?` | Template del texto markdown corto. |
| `long` | `string?` | Template del texto markdown largo. |
| `icon` | `string \| null?` | Template de URL icon. |
| `cover` | `string \| null?` | Template de URL cover. |
| `avatar` | `string \| null?` | Template de URL avatar. |
| `links` | `{ title: string, url: string }[]?` | Links de notification. |
