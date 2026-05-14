# Types

## Common

### OperationResult

| Поле | Тип | Описание |
| --- | --- | --- |
| - | `{}` или пустое тело ответа | Endpoint завершился успешно. |

### TokenResponse

| Поле | Тип | Описание |
| --- | --- | --- |
| `token` | `string` | Bearer token для последующих API/MCP-запросов. |

### AvatarUploadResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `url` | `string` | URL загруженного avatar. |
| `fileName` | `string` | Имя сохраненного файла. |
| `extension` | `string` | Расширение файла. |
| `size` | `number` | Размер файла в байтах. |

### TagsAndLabels

| Поле | Тип | Описание |
| --- | --- | --- |
| `tags` | `string[]` | Короткие теги для фильтрации и группировки. |
| `labels` | `Record<string, string>` | Машиночитаемые метки. |

## Account

### Me

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id account. |
| `newid` | `string` | Совместимое legacy-поле account id. |
| `tier` | `"free" \| "advanced" \| "pro"` | Текущий tier account. |
| `settings` | `object` | Настройки account. |
| `meta.nickname` | `string` | Отображаемое имя account. |
| `meta.avatar` | `string?` | URL аватара account. |
| `token.identity` | `string` | Identity, к которой привязан текущий token. |
| `workspace` | `WorkspaceView \| null` | Текущий выбранный workspace. |
| `memberships` | `UserMembership[]` | Workspaces, в которых account является участником. |
| `addressbook` | `AddressEntry[]` | Addresses из текущего контекста workspace/account. |
| `subscriptions` | `Record<string, number>` | Счетчики subscriptions по ключу source/project. |
| `counters.subscriptions` | `SubscriptionCounter[]` | Агрегированные счетчики subscriptions. |

### UserMembership

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id membership/ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Роль внутри workspace. |
| `workspace` | `WorkspaceViewShort` | Workspace, к которому относится membership. |

### AccountSettings

| Поле | Тип | Описание |
| --- | --- | --- |
| - | `object` | Объект settings текущей версии UI. Набор полей может расширяться. |

### CurrentWorkspaceResponse

| Поле | Тип | Описание |
| --- | --- | --- |
| `workspace` | `WorkspaceView \| null` | Текущий выбранный workspace или `null`. |

## Workspaces

### WorkspaceView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Уникальное имя workspace. |
| `invite` | `string?` | Invite token. Возвращается только если caller может видеть приватную часть workspace. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string?` | Видимое название workspace. |
| `meta.avatar` | `string?` | URL avatar workspace. |

### WorkspaceViewShort

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id workspace. |
| `fullname` | `string` | Полное имя workspace. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta` | `object?` | Метаданные workspace. |

### WorkspaceAclEntry

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id ACL entry. |
| `level` | `"owner" \| "admin" \| "developer" \| "user"` | Роль. |
| `user` | `UserViewShort` | Пользователь, если entry уже связан с account. |
| `object` | `{ type: string, id: string }?` | Ссылка на workspace. Может присутствовать в сыром ACL-ответе. |
| `subject` | `{ type: string, id: string }?` | Ссылка на user/invite. Может присутствовать в сыром ACL-ответе. |

## Projects

### ProjectView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id project. |
| `createdAt` | `string?` | Дата создания в формате ISO. |
| `updatedAt` | `string?` | Дата обновления в формате ISO. |
| `createdByAccountId` | `string?` | Id account владельца. |
| `billingAccountId` | `string?` | Id account владельца billing. |
| `name` | `string` | Имя project внутри workspace. |
| `fullname` | `string` | Канонический fullname project. |
| `workspace` | `string` | Полное имя workspace владельца. |
| `public` | `boolean` | Legacy-флаг public. |
| `visibility` | `"public" \| "private_link" \| "personal"?` | Storage visibility. |
| `accessLevel` | `"private" \| "public" \| "free"?` | Product access level. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string` | Видимое название. |
| `meta.description` | `string` | Полное описание. |
| `meta.shortDescription` | `string?` | Короткое описание. |
| `meta.links` | `{ title: string, url: string }[]?` | Полезные ссылки. |
| `meta.icon` | `string?` | URL icon. |
| `meta.avatar` | `string?` | URL avatar, обычно совпадает с icon. |
| `meta.cover` | `string?` | URL cover. |
| `ownerTitle` | `string?` | Видимое название владельца workspace/account. |
| `triggerLimits.maxProvidersPerTrigger` | `number \| null` | Лимит веса providers на один trigger. Имя поля сохранено для API-совместимости. |

### ProjectCreateCapability

| Поле | Тип | Описание |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Текущий tier account. |
| `canCreateProjects` | `boolean` | Можно ли создать project. |
| `privateProjectsUsed` | `number` | Сколько приватных projects уже занимают лимит. |
| `privateProjectsLimit` | `number \| null` | Лимит private projects, `null` означает без ограничения. |
| `canCreatePrivateProjects` | `boolean` | Можно ли создать private project с учетом лимита. |

### ProjectAccessLink

| Поле | Тип | Описание |
| --- | --- | --- |
| `token` | `string` | Token access link. |
| `project` | `string` | Полное имя project. |
| `maxUsages` | `number?` | Максимальное количество использований. |
| `usages` | `number?` | Текущее количество использований. |
| `expiresAt` | `string?` | Дата окончания в формате ISO. |
| `createdAt` | `string?` | Дата создания в формате ISO. |

### ProjectImageUploadResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `url` | `string` | URL загруженного изображения. |
| `fileName` | `string` | Имя сохраненного файла. |
| `extension` | `string` | Расширение файла. |
| `size` | `number` | Размер файла в байтах. |

## Project Transfers

### ProjectTransferPlan

| Поле | Тип | Описание |
| --- | --- | --- |
| `mode` | `"dry-run"` | Режим предварительного просмотра плана. |
| `source` | `ProjectTransferProjectRef` | Исходный project. |
| `target` | `ProjectTransferTargetRef` | Целевые workspace, name и fullname. |
| `counts` | `ProjectTransferCounts` | Счетчики того, что будет перенесено. |
| `changes` | `ProjectTransferChanges` | Детальный список планируемых изменений. |
| `conflicts` | `ProjectTransferConflict[]` | Блокирующие конфликты. |
| `notes` | `string[]` | Дополнительные замечания. |
| `planHash` | `string?` | Хеш плана, если endpoint создания request возвращает его рядом с plan. |

### ProjectTransferCounts

| Поле | Тип | Описание |
| --- | --- | --- |
| `triggers` | `number` | Triggers для переноса. |
| `templates` | `number` | Записи templates для переноса. |
| `templateGroups` | `number` | Группы template. |
| `templateTopics` | `number` | Topics template. |
| `subscriptions` | `number` | Subscriptions, ссылки которых будут затронуты. |
| `scopedEntities` | `number` | Apps/actions/resources/types/blueprints, привязанные к project. |
| `projectAccessLinks` | `number` | Access links для обновления. |
| `aliasWrites` | `number` | Entity aliases для создания или обновления. |
| `aliasMissing` | `number` | Отсутствующие aliases для создания. |
| `aliasStale` | `number` | Устаревшие aliases для обновления. |
| `conflicts` | `number` | Количество конфликтов. |

### ProjectTransferRequest

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id request. |
| `sourceProjectId` | `string` | Id исходного project. |
| `sourceProjectFullname` | `string` | Fullname исходного project. |
| `sourceWorkspace` | `string` | Fullname исходного workspace. |
| `targetWorkspace` | `string` | Fullname целевого workspace. |
| `targetName` | `string` | Имя project в целевом workspace. |
| `targetFullname` | `string` | Полное имя project в целевом workspace. |
| `status` | `"pending" \| "accepted" \| "rejected" \| "cancelled" \| "expired" \| "failed"` | Статус request. |
| `requestedByAccountId` | `string` | Account, который создал request. |
| `sourceOwnerAccountId` | `string` | Текущий account владельца source. |
| `targetOwnerAccountId` | `string` | Account владельца target. |
| `planHash` | `string` | Хеш принятого плана. |
| `planCounts` | `Record<string, number>` | Снимок счетчиков плана. |
| `expiresAt` | `string` | Дата окончания в формате ISO. |
| `createdAt` | `string` | Дата создания в формате ISO. |
| `updatedAt` | `string` | Дата обновления в формате ISO. |
| `decidedAt` | `string?` | Дата решения в формате ISO. |
| `decidedByAccountId` | `string?` | Account, который принял, отклонил или отменил request. |
| `appliedAt` | `string?` | Дата применения в формате ISO. |
| `rejectedReason` | `string?` | Причина отклонения. |
| `failureReason` | `string?` | Причина ошибки. |

### ProjectTransferAcceptResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `request` | `ProjectTransferRequest` | Принятый request. |
| `transfer` | `ProjectTransferApplyResult` | Детали примененного transfer. |

### ProjectTransferApplyResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `mode` | `"apply"` | Режим применения. |
| `appliedAt` | `string` | Дата применения в формате ISO. |
| `writes.projects` | `number` | Обновленные записи project. |
| `writes.triggers` | `number` | Обновленные triggers. |
| `writes.triggerProviders` | `number` | Обновленные trigger providers. |
| `writes.triggerTransforms` | `number` | Обновленные trigger transforms. |
| `writes.templates` | `number` | Обновленные templates. |
| `writes.subscriptions` | `number` | Обновленные subscriptions. |
| `writes.scopedEntities` | `number` | Обновленные сущности, привязанные к project. |
| `writes.projectAccessLinks` | `number` | Обновленные access links. |
| `writes.aliases` | `number` | Записанные aliases. |

## Triggers

### TriggerView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id trigger. |
| `createdAt` | `string?` | Дата создания в формате ISO. |
| `updatedAt` | `string?` | Дата обновления в формате ISO. |
| `name` | `string` | Имя trigger внутри project. |
| `fullname` | `string` | Канонический fullname trigger. |
| `projectId` | `string?` | Id project. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Legacy-флаг public. |
| `backend` | `{ type: "sdk", trigger: string, values?: object }` | Ссылка на backend runtime. |
| `inputs` | `Record<string, TypeSchema>` | Обязательные inputs для subscription. |
| `defaults` | `EventDefaults?` | Рекомендуемые defaults уведомления. |
| `output` | `Record<string, TypeSchema>?` | Legacy output schema. |
| `triggerSpec` | `TriggerSpec?` | Спецификация сопоставления source. |
| `filtersSchema` | `Record<string, TriggerOutputSchemaField>?` | Опциональные filters для subscription. |
| `outputSchema` | `Record<string, TriggerOutputSchemaField>?` | Схема raw/human output. |
| `activation` | `TriggerActivation \| null?` | Опциональное activation condition. |
| `executionPolicy` | `object?` | Переопределения policy runtime. |
| `status` | `TriggerStatusDetails` | Статус test/runtime. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string` | Видимое название. |
| `meta.description` | `string?` | Описание. |
| `hasProviders` | `boolean?` | `true`, если providers существуют. |
| `hasTransform` | `boolean?` | `true`, если transform существует. |

### TriggerDraftView

| Поле | Тип | Описание |
| --- | --- | --- |
| `providers` | `TriggerProvider[]?` | Полные определения providers. |
| `transform` | `TriggerTransform?` | JavaScript raw/human transform. |

### TriggerStatusDetails

| Поле | Тип | Описание |
| --- | --- | --- |
| `status` | `"not_tested" \| "ready" \| "broken"` | Текущий статус. |
| `issue` | `string?` | Человекочитаемая проблема. |
| `source` | `"edit" \| "test" \| "runtime" \| "dependency"?` | Источник статуса. |
| `updatedAt` | `string?` | Дата обновления в формате ISO. |

### TriggerSpec

| Вариант | Основные поля |
| --- | --- |
| `evm_log` | `type`, `dataSource`, опционально `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput`. |
| `evm_transaction` | `type`, `dataSource`, опционально `testInput`. |
| `substrate_event` | `type`, `dataSource`, опционально `pallet`, `event`, `testInput`. |
| `timer` | `type`, `interval`, опционально `testInput`. |

### TriggerTransform

| Поле | Тип | Описание |
| --- | --- | --- |
| `language` | `"javascript"` | Язык transform. |
| `source` | `string?` | Legacy source. |
| `rawSource` | `string?` | Преобразование в raw output. |
| `humanSource` | `string?` | Преобразование raw output в human output. |

### TriggerActivation

| Поле | Тип | Описание |
| --- | --- | --- |
| `language` | `"javascript"` | Язык activation. |
| `source` | `string` | Исходный код JavaScript condition. |

### TriggerValidationResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Валиден ли draft. |
| `issues` | `string[]` | Проблемы валидации. |
| `trigger` | `TriggerDraftView?` | Нормализованный trigger draft, если endpoint его возвращает. |

### TriggerPatchResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `fullname` | `string` | Полное имя trigger. |
| `dryRun` | `boolean?` | `true`, если изменения только проверялись. |
| `updated` | `boolean` | Был ли trigger изменен. |
| `changedPaths` | `string[]` | Dotted paths, которые были изменены. |
| `trigger` | `TriggerDraftView` | Trigger после patch или normalized dry-run view. |

### TriggerBulkPatchResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true`, если bulk patch был dry-run. |
| `totalCount` | `number` | Количество обработанных items. |
| `updatedCount` | `number` | Количество измененных items. |
| `items` | `TriggerBulkPatchItem[]` | Результаты по каждому trigger. |

### TriggerBulkPatchItem

| Поле | Тип | Описание |
| --- | --- | --- |
| `fullname` | `string` | Полное имя trigger. |
| `dryRun` | `boolean?` | `true`, если item был dry-run. |
| `updated` | `boolean` | Был ли trigger изменен. |
| `changedPaths` | `string[]` | Измененные paths. |
| `status` | `string?` | Trigger status после patch. |
| `statusUpdatedAt` | `string?` | Дата обновления status. |
| `unsetPaths` | `string[]` | Paths, которые были удалены. |

### TriggerBulkRemoveResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `dryRun` | `boolean?` | `true`, если bulk remove был dry-run. |
| `totalCount` | `number` | Количество обработанных triggers. |
| `deletedCount` | `number` | Количество удаленных triggers. |
| `items` | `TriggerBulkRemoveItem[]` | Результаты по каждому trigger. |

### TriggerBulkRemoveItem

| Поле | Тип | Описание |
| --- | --- | --- |
| `fullname` | `string` | Полное имя trigger. |
| `dryRun` | `boolean?` | `true`, если item был dry-run. |
| `deleted` | `boolean` | Был ли trigger удален. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |

### TriggerPreviewResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Успешно ли выполнен preview. |
| `issues` | `string[]` | Проблемы. |
| `output` | `unknown?` | Output preview. |
| `debug` | `Record<string, unknown>?` | Отладочные детали. |

### TriggerTestResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Успешно ли выполнен test. |
| `issues` | `string[]` | Проблемы test. |
| `input` | `unknown?` | Source item, использованный для test. |
| `output` | `unknown?` | Raw/human output. |
| `sourceEventsCount` | `number?` | Количество найденных source items. |
| `debug` | `Record<string, unknown>?` | Отладочные детали. |

### ProviderTestResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Успешно ли выполнен provider test. |
| `issues` | `string[]` | Проблемы. |
| `result` | `unknown?` | Output provider. |
| `debug` | `Record<string, unknown>?` | Отладочные детали. |

### RuntimeSource

| Поле | Тип | Описание |
| --- | --- | --- |
| `app` | `string` | Имя runtime app. |
| `network` | `string` | Имя network/source. |
| `plugin` | `"evm" \| "substrate"` | Тип runtime plugin. |
| `instance` | `string` | Экземпляр runtime. |
| `status` | `"running" \| "degraded" \| "error"` | Статус runtime. |
| `updatedAt` | `string` | Дата обновления в формате ISO. |
| `latestSeenBlock` | `number?` | Последний block, увиденный runtime. |
| `lastProcessedBlock` | `number?` | Последний обработанный block. |
| `blockLag` | `number?` | Текущий block lag. |
| `lastFailedBlock` | `number?` | Последний failed block. |
| `errorsLastHour` | `number?` | Количество errors за последний час. |

### LatestBlockResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Успешно ли выполнен lookup. |
| `issues` | `string[]` | Проблемы lookup. |
| `latestBlock` | `number?` | Найденный latest block. |
| `matched` | `boolean` | Найден ли matching source item. |
| `matchedBlock` | `number?` | Block, в котором найден match. |
| `checkedBlocks` | `number` | Количество проверенных blocks. |
| `sourceEventsCount` | `number?` | Количество source events. |
| `itemIndex` | `number?` | Index найденного item. |
| `input` | `unknown?` | Найденный input. |
| `source` | `string?` | Источник lookup. |
| `details` | `unknown?` | Дополнительные детали. |

## Trigger Import

### EvmAbiImportResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `events` | `unknown[]?` | Разобранные записи ABI event. |
| `calls` | `unknown[]?` | Разобранные записи ABI call/function. |
| `items` | `unknown[]?` | Единый список разобранных записей, если runtime возвращает плоский список. |
| `error` | `string?` | Сообщение об ошибке, если runtime не смог разобрать ABI. |

### EvmAbiResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `abi` | `unknown[]?` | Записи ABI JSON, если ABI загружен. |
| `source` | `string?` | Маркер source ABI. |
| `contract` | `string?` | Адрес контракта. |
| `error` | `string?` | Сообщение об ошибке, если ABI не удалось загрузить. |

### TriggerImportDraftsResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `abiSource` | `"provided" \| "auto"?` | ABI source, использованный для EVM import. |
| `drafts` | `TriggerDraftView[]` | Сгенерированные trigger drafts. |

### SubstrateSourceInfo

| Поле | Тип | Описание |
| --- | --- | --- |
| `ss58Prefix` | `number` | SS58 prefix для Substrate source. |

### SubstratePalletSummary

| Поле | Тип | Описание |
| --- | --- | --- |
| `name` | `string` | Имя pallet. |
| `docs` | `string[]` | Документация pallet. |
| `hasEvents` | `boolean` | Есть ли у pallet events. |
| `hasCalls` | `boolean` | Есть ли у pallet calls. |
| `eventCount` | `number` | Количество events. |
| `callCount` | `number` | Количество calls. |

## Templates

### ProjectTemplate

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `project` | `string` | Полное имя project. |
| `schema` | `Record<string, TypeSchema>` | Schema inputs уровня template. |
| `groups` | `TemplateGroup[]` | Groups, которые показываются пользователю как templates. |
| `topics` | `TemplateTopic[]` | Topics внутри groups. |
| `rules` | `TemplateRule[]` | Trigger rules для topics. |
| `meta` | `Record<string, unknown>` | Метаданные template. |
| `issue` | `string?` | Проблема синхронизации template. |

### TemplateGroup

| Поле | Тип | Описание |
| --- | --- | --- |
| `name` | `string` | Id group. |
| `meta.title` | `string` | Видимое название. |
| `meta.description` | `string` | Описание. |

### TemplateTopic

| Поле | Тип | Описание |
| --- | --- | --- |
| `name` | `string` | Id topic. |
| `group` | `string` | Id родительской group. |
| `selectedByDefault` | `boolean` | Выбран ли topic по умолчанию в subscription wizard. |
| `meta.title` | `string` | Видимое название. |

### TemplateRule

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id rule. |
| `trigger` | `string` | Полное имя trigger. |
| `topic` | `string` | Имя topic. |
| `inputs` | `object?` | Маппинг/defaults inputs для rule. |
| `policy` | `object?` | Policy выполнения. |
| `conditions` | `Condition \| null?` | Condition rule. |
| `deprecated` | `boolean` | Помечена ли rule как deprecated. |
| `requiredValues` | `string[]` | Обязательные template values. |
| `issue` | `string?` | Отсутствующий trigger или проблема синхронизации. |

## Subscriptions

### SubscriptionView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id subscription. |
| `targetWorkspaceFullname` | `string?` | Workspace, которому принадлежит subscription. |
| `createdByAccountId` | `string?` | Account, который создал subscription. |
| `sourceProjectId` | `string?` | Id исходного project. |
| `sourceProjectFullname` | `string?` | Fullname исходного project. |
| `countsTowardsTierQuota` | `boolean?` | Учитывается ли subscription в квоте Free tier. |
| `state` | `"on" \| "off" \| "blocked"` | Состояние subscription. |
| `createdAt` | `string` | Дата создания в формате ISO. |
| `updatedAt` | `string` | Дата обновления в формате ISO. |
| `template` | `SubscriptionTemplateReference \| null` | Template reference или `null` для прямой trigger subscription. |
| `rules` | `SubscriptionRule[]` | Trigger rules. |
| `resources` | `string[]` | Полные имена resources, используемых actions. |
| `actions` | `SubscriptionAction[]?` | Notification actions. |
| `references` | `SubscriptionReferences` | Денормализованные references на source/project/trigger. |
| `meta.title` | `string?` | Видимое название. |
| `meta.issue` | `string?` | Проблема block/entitlement/migration. |

### SubscriptionTemplateReference

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id template. |
| `inputs` | `Record<string, string \| number>` | Значения inputs template. |
| `groups` | `{ name: string, meta: { title: string } }[]` | Выбранные groups. |
| `topics` | `string[]` | Выбранные topics. |
| `rules` | `{ id: string, group: string }[]` | Выбранные references на rules. |

### SubscriptionRule

| Поле | Тип | Описание |
| --- | --- | --- |
| `triggerId` | `string?` | Id trigger. |
| `trigger` | `RuleTriggerReference` | Trigger reference. |
| `inputs` | `object?` | Значения inputs. |
| `policy` | `object?` | Policy выполнения. |
| `conditions` | `Condition \| null?` | Condition rule. |

### SubscriptionAction

| Поле | Тип | Описание |
| --- | --- | --- |
| `action` | `string` | Полное имя action. |
| `values` | `Record<string, unknown>` | Values action. |
| `overrides` | `EventDefaults?` | Поля override для notification. |

### SubscriptionReferences

| Поле | Тип | Описание |
| --- | --- | --- |
| `sources` | `string[]` | References на data sources. |
| `projects` | `string[]` | Полные имена projects. |
| `triggers` | `string[]` | Полные имена triggers. |
| `projectIds` | `string[]?` | Ids projects. |
| `triggerIds` | `string[]?` | Ids triggers. |

### SubscriptionTestResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `valid` | `boolean` | Валиден ли test. |
| `issues` | `string[]` | Проблемы test. |
| `preview` | `unknown?` | Результат notification preview/send. |
| `subscription` | `SubscriptionView?` | Draft subscription, использованный для test. |

### SubscriptionAlertLog

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id log. |
| `subscriptionId` | `string` | Id subscription. |
| `workspaceId` | `string` | Id workspace. |
| `projectFullname` | `string?` | Полное имя project. |
| `triggerFullname` | `string?` | Полное имя trigger. |
| `eventName` | `string` | Имя event/trigger. |
| `createdAt` | `string` | Дата создания в формате ISO. |
| `status` | `"delivered" \| "failed" \| "rate_limited" \| "blocked"` | Статус доставки. |
| `testInput` | `Record<string, unknown>?` | Test input. |
| `itemIndex` | `number?` | Индекс source item. |
| `replayMatch` | `{ hash?: string \| null, index?: number \| null }?` | Информация replay match. |
| `sourceItemsCount` | `number?` | Количество source items. |
| `channels` | `SubscriptionAlertLogChannel[]` | Каналы доставки. |
| `failureReasonCode` | `string?` | Код ошибки. |
| `failureReasonMessage` | `string?` | Сообщение ошибки. |
| `expireAt` | `string` | Дата истечения log. |

## Resources

### ResourceView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id resource. |
| `name` | `string` | Имя resource. |
| `fullname` | `string` | Полное имя resource. |
| `project` | `string?` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Флаг public. |
| `blueprint` | `string` | Полное имя blueprint. |
| `token` | `string?` | Секретный token. Возвращается только если caller может видеть приватные поля resource. |
| `ready` | `boolean` | Готов ли resource. |
| `remark` | `string \| null` | Статусное примечание resource. |
| `data` | `object \| null?` | Данные setup resource. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string?` | Видимое название. |

### ExternalResourceView

| Поле | Тип | Описание |
| --- | --- | --- |
| `blocks` | `{ type: "markdown", text: string }[]` | UI content blocks, возвращенные external app. |

## Data Sources

### CustomSourceListView

| Поле | Тип | Описание |
| --- | --- | --- |
| `workspace` | `string` | Полное имя workspace владельца. |
| `name` | `string` | Имя source. |
| `fullname` | `string` | Полное имя source. |
| `public` | `boolean` | Флаг public. |
| `kind` | `"evm" \| "substrate"` | Тип source. |
| `meta` | `CustomSourceMeta` | Метаданные. |
| `createdAt` | `string` | Дата создания в формате ISO. |
| `updatedAt` | `string` | Дата обновления в формате ISO. |
| `deployerTitle` | `string?` | Видимое название deployer/owner. |

### CustomSource

| Поле | Тип | Описание |
| --- | --- | --- |
| `createdByAccountId` | `string?` | Id account создателя. |
| `endpoints` | `string[]` | RPC endpoints runtime. |
| `substrate` | `object?` | Substrate extensions/types/RPC config. |
| `batchMaxCount` | `number?` | Максимальный размер EVM batch. |
| `blockProcessingConcurrency` | `number?` | Параллельность обработки blocks. |
| `maxQueuedBlocks` | `number?` | Максимум queued blocks. |
| `logs` | `{ retentionMs: number, maxCount: number \| null }?` | Policy log runtime. |
| `runtime` | `CustomSourceRuntimeMetadata?` | Метаданные runtime. |

### CustomSourceMeta

| Поле | Тип | Описание |
| --- | --- | --- |
| `title` | `string` | Видимое название. |
| `description` | `string?` | Описание. |
| `icons.default` | `string?` | URL icon по умолчанию. |
| `og` | `object?` | Метаданные OpenGraph. |

### CustomSourceRuntimeMetadata

| Поле | Тип | Описание |
| --- | --- | --- |
| `evm.chainId` | `number?` | EVM chain id. |
| `evm.latestBlock` | `number?` | Последний EVM block. |
| `evm.blockHash` | `string?` | Hash block. |
| `evm.fetchedAt` | `string` | Дата получения метаданных. |
| `substrate.ss58Prefix` | `number?` | SS58 prefix. |
| `substrate.latestBlock` | `number?` | Последний Substrate block. |
| `substrate.fetchedAt` | `string` | Дата получения метаданных. |

### CustomSourceCreateCapability

| Поле | Тип | Описание |
| --- | --- | --- |
| `tier` | `"free" \| "advanced" \| "pro"` | Account tier. |
| `canCreateCustomSources` | `boolean` | Может ли текущий account создавать custom sources. |
| `customSourcesUsed` | `number` | Текущее количество private custom sources. |
| `customSourcesLimit` | `number \| null` | Лимит, `null` означает без ограничения. |

### CustomSourceVerifyResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `ok` | `boolean` | Успешно ли прошла verification. |
| `logs` | `{ level: "info" \| "error", message: string }[]` | Сообщения verification log. |
| `details` | `Record<string, unknown>?` | Детали runtime/public duplicate check. |
| `error` | `string?` | Ошибка verification. |

### CustomSourceLogsResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `exists` | `boolean` | Существует ли файл log. |
| `lines` | `string[]` | Отредактированные строки log. |
| `truncated` | `boolean` | Был ли output обрезан. |
| `updatedAt` | `string?` | Дата обновления log file. |

### CustomSourceRuntimeActionResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `ok` | `true` | Действие runtime выполнено успешно. |
| `sourceFullname` | `string` | Полное имя source. |
| `revision` | `number` | Revision runtime после restart/reset. |

### CustomSourceResetLagResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `ok` | `true` | Reset выполнен успешно. |
| `latestBlock` | `number` | Последний block, использованный как новый baseline для lag. |

### CustomSourceStatusTestResult

| Поле | Тип | Описание |
| --- | --- | --- |
| `ok` | `true` | Test event отправлен. |
| `eventName` | `string` | Сгенерированное имя status trigger. |
| `subscriptionsTested` | `number` | Протестированные subscriptions. |
| `matched` | `number` | Количество matched subscriptions. |
| `delivered` | `number` | Доставленные alerts. |
| `event` | `CustomSourceStatusEvent` | Тестовый status event. |

### CustomSourceStatusEvent

| Поле | Тип | Описание |
| --- | --- | --- |
| `type` | `"status_changed" \| "error" \| "recovered"` | Тип event. |
| `sourceFullname` | `string` | Полное имя source. |
| `sourceName` | `string` | Имя source. |
| `sourceTitle` | `string` | Видимое название. |
| `workspace` | `string` | Полное имя workspace. |
| `kind` | `"evm" \| "substrate"` | Тип source. |
| `status` | `"running" \| "error" \| "degraded"` | Новый status. |
| `previousStatus` | `"running" \| "error" \| "degraded"?` | Предыдущий status. |
| `severity` | `"info" \| "warning" \| "error"` | Severity. |
| `message` | `string` | Человекочитаемое сообщение. |
| `code` | `string?` | Машиночитаемый code. |
| `details` | `Record<string, unknown>?` | Дополнительные детали. |
| `timestamp` | `string` | Время event в формате ISO. |

## Addresses

### AddressEntry

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id address entry. |
| `type` | `"plain" \| "ss58" \| "evm" \| "bitcoin" \| "cosmos"` | Тип address. |
| `address` | `string` | Значение address. |
| `alias` | `string` | Видимый alias. |

## Builder Registry

### AppView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id app. |
| `name` | `string` | Имя app. |
| `fullname` | `string` | Полное имя app. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Флаг public. |
| `url` | `string?` | URL app. Возвращается только если caller может видеть приватные поля. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |

### ActionView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id action. |
| `name` | `string` | Имя action. |
| `fullname` | `string` | Полное имя action. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Флаг public. |
| `backend` | `{ type: "sdk", action: string }` | Backend action. |
| `values` | `Record<string, TypeSchema>` | Schema values action. |
| `overrides` | `Array<keyof EventDefaults>` | Поля notification, которые action может переопределять. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string` | Видимое название. |
| `meta.description` | `string?` | Описание. |

### BlueprintView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id blueprint. |
| `name` | `string` | Имя blueprint. |
| `fullname` | `string` | Полное имя blueprint. |
| `app` | `string` | Полное имя app. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Флаг public. |
| `type` | `string` | Тип blueprint. |
| `data` | `object?` | Object spec для blueprint. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string?` | Видимое название. |
| `meta.description` | `string?` | Описание. |

### SharedTypeView

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `string` | Id shared type. |
| `name` | `string` | Имя shared type. |
| `fullname` | `string` | Полное имя shared type. |
| `project` | `string` | Полное имя project. |
| `workspace` | `string` | Полное имя workspace. |
| `public` | `boolean` | Флаг public. |
| `schemas` | `Record<string, TypeSchema>` | Именованные schemas. |
| `tags` | `string[]` | Теги. |
| `labels` | `Record<string, string>` | Метки. |
| `meta.title` | `string?` | Видимое название. |
| `meta.description` | `string?` | Описание. |

## Supporting Types

### EventDefaults

| Поле | Тип | Описание |
| --- | --- | --- |
| `title` | `string?` | Template заголовка notification. |
| `short` | `string?` | Template короткого markdown-текста. |
| `long` | `string?` | Template длинного markdown-текста. |
| `icon` | `string \| null?` | Template URL icon. |
| `cover` | `string \| null?` | Template URL cover. |
| `avatar` | `string \| null?` | Template URL avatar. |
| `links` | `{ title: string, url: string }[]?` | Links уведомления. |
