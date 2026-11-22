# Triggers API

Trigger endpoints gerem trigger definitions, drafts, bulk operations e test helpers.

## GET /api/triggers

Devolve triggers com optional filters.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `project` | Query | Project fullname filter. |
| `workspace` | Query | Workspace fullname filter. |

Payload: nenhum.

Resposta: [TriggerView[]](types.md#triggerview).

## GET /api/triggers/:fullname

Devolve trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname

Cria ou guarda trigger completo.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. Deve coincidir com `payload.fullname`. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Sim | Trigger name dentro do project. |
| `fullname` | Sim | Trigger fullname. |
| `project` | Sim | Project fullname. |
| `workspace` | Sim | Workspace fullname. |
| `backend` | Sim | Backend object. Normalmente `{ type: "sdk", trigger, values }`. |
| `inputs` | Sim | Input schema. |
| `meta.title` | Sim | Título visível. |
| `meta.description` | Não | Descrição. |
| `defaults` | Não | Notification defaults. |
| `triggerSpec` | Não | Source matching spec ou `null`. |
| `providers` | Não | Array of provider definitions. |
| `filtersSchema` | Não | Optional filters schema. |
| `outputSchema` | Não | Human/raw output schema. |
| `transform` | Não | JavaScript transform ou `null`. |
| `activation` | Não | JavaScript activation condition ou `null`. |
| `executionPolicy` | Não | Runtime limits override object ou `null`. |
| `status` | Não | `{ status, issue, source, updatedAt }`. |
| `tags` | Não | Tags. |
| `labels` | Não | Labels. |

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PATCH /api/triggers/:fullname

Atualiza trigger parcialmente.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `set` | One of | Object with dotted paths and values to set. |
| `unset` | One of | Array of dotted paths to remove. |
| `dryRun` | Não | If `true`, validate patch without saving. |

Resposta: [TriggerPatchResult](types.md#triggerpatchresult).

## DELETE /api/triggers/:fullname

Elimina trigger.

A remoção direta exige permissões de proprietário do espaço e `manage` para chaves. Uma subscrição ativa (`on`) no espaço do trigger que o utilize causa `409 trigger_in_use`. Uma remoção bem-sucedida bloqueia as subscrições dependentes, incluindo noutros espaços.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).

## POST /api/triggers/patch

Bulk patch para vários triggers.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `items` | Sim | Array of `{ fullname, set?, unset? }`. |
| `dryRun` | Não | Validate without saving. |

Resposta: [TriggerBulkPatchResult](types.md#triggerbulkpatchresult).

## POST /api/triggers/remove

Bulk remove para vários triggers.

São verificadas as subscrições ativas (`on`) no espaço de cada trigger. Se um alvo estiver em uso, devolve `409 trigger_in_use`. Remover um projeto, espaço de trabalho ou conta bloqueia as subscrições afetadas.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `fullnames` | Sim | Array of trigger fullnames. |
| `dryRun` | Não | Validate without deleting. |

Resposta: [TriggerBulkRemoveResult](types.md#triggerbulkremoveresult).

## GET /api/triggers/:fullname/draft

Devolve draft view de trigger.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: nenhum.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## PUT /api/triggers/:fullname/draft

Guarda trigger draft.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as `PUT /api/triggers/:fullname`.

Resposta: [TriggerDraftView](types.md#triggerdraftview).

## POST /api/triggers/:fullname/draft/validate

Valida trigger draft sem guardar definitivamente.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `fullname` | Path | Trigger fullname. |

Payload: same shape as trigger save payload.

Resposta: [TriggerValidationResult](types.md#triggervalidationresult).

## GET /api/triggers/:fullname/logs

Devolve falhas de delivery e eventos de source pressure agregados para um trigger.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `fullname` | Path | Fullname do trigger. |
| `limit` | Query | Número máximo opcional de entradas. |
| `status` | Query | Filtro opcional por estado de delivery. |
| `direction` | Query | Direção de paginação opcional: `before` ou `after`. |
| `datetime` | Query | Timestamp ISO usado com `direction`. |

Payload: nenhum.

A resposta contém dados do trigger, estatísticas de subscriptions e logs normalizados.

## POST /api/triggers/:fullname/reset-test-status

Repõe o estado de teste do trigger para `not_tested`.

Argumentos: `fullname` no path.

Payload: nenhum.

Resposta: [TriggerPatchResult](types.md#triggerpatchresult).

## POST /api/triggers/preview

Valida as definições de providers, executa a activation opcional e os
transforms raw/human sobre o input fornecido, e valida o output resultante. Não
guarda nenhum trigger.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `providers` | Sim | Provider definitions. |
| `activation` | Não | Condição de activation JavaScript ou `null`. |
| `transform` | Sim | JavaScript transform object. |
| `input` | Sim | Source item/input for preview. |
| `inputs` | Não | Trigger input values. |
| `providersData` | Não | Valores de providers já calculados para activation e transforms. |
| `outputSchema` | Não | Output schema usada para validar o resultado do preview. |

Resposta: [TriggerPreviewResult](types.md#triggerpreviewresult).

## POST /api/triggers/test

Testa trigger definition em sample source item.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `providers` | Sim | Provider definitions. |
| `transform` | Sim | JavaScript transform. |
| `outputSchema` | Sim | Output schema. |
| `activation` | Não | Activation condition. |
| `inputs` | Não | Input values. |
| `input` | One of | Direct test input. |
| `test` | One of | Test source/match object. |

Resposta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/test-block

Testa trigger num block específico.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `providers` | Sim | Provider definitions. |
| `transform` | Sim | JavaScript transform. |
| `outputSchema` | Sim | Output schema. |
| `block` | Sim | Block number. |
| `itemIndex` | Não | Source item index inside block. |
| `activation` | Não | Activation condition. |
| `filtersSchema` | Não | Filters schema. |
| `inputs` | Não | Input values. |

Resposta: [TriggerTestResult](types.md#triggertestresult).

## POST /api/triggers/providers/test

Testa um provider.

Arguments: nenhum.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `triggerSpec` | Sim | Source matching spec. |
| `provider` | Sim | Provider definition. |
| `project` | Não | Project fullname. |
| `workspace` | Não | Workspace fullname. |
| `templateValues` | Não | Template values for provider placeholders. |

Resposta: [ProviderTestResult](types.md#providertestresult).

## GET /api/triggers/hypercore/actions

Devolve o catálogo de actions HyperCore disponível no trigger builder.

Argumentos: nenhum.

Payload: nenhum.

A resposta contém um array `actions`.

## GET /api/triggers/runtime-sources

Devolve runtime data sources disponíveis para trigger builder.

Arguments: nenhum.

Payload: nenhum.

Resposta: [RuntimeSource[]](types.md#runtimesource).

## GET /api/template-helpers

Devolve metadados públicos dos helpers Handlebars disponíveis nos valores predefinidos dos triggers e nos templates de actions das subscrições. Não requer autenticação.

Argumentos: nenhum.

Payload: nenhum.

A resposta contém um array `handlebars.helpers`. Cada helper tem um `name` único e uma `description`; os helpers de bloco também têm `block: true`, e os helpers com opções nomeadas incluem um array `params` com `name` e `type`.

## POST /api/triggers/find-latest-block

Encontra latest block/test input para trigger testing.

Arguments: nenhum.

Payload: trigger/source-specific search object.

Resposta: [LatestBlockResult](types.md#latestblockresult).

## Criação de triggers para agentes

Os cinco caminhos aceitam uma sessão de conta ou chave de agente no espaço atual. A conta precisa de Advanced ou Pro (caso contrário, `403 plan_required`). A pesquisa e os testes requerem acesso de leitura ao espaço. O planeamento, a ativação e a remoção requerem acesso de edição.

Se a criação de triggers estiver desativada, as rotas devolvem HTTP `400` com `builder is disabled` em `error.message`.

## POST /api/agent/build/contracts

As chaves requerem `read`. Envie `chain` e um de `address` (EVM), `program` (Solana) ou `pallet` (Substrate). Use uma fonte de cadeia integrada do Web3alert com um nome curto como `ethereum`, `base`, `arbitrum-one`, `polkadot` ou `solana`, ou use `common.<chain>` ou `common.source.<chain>`. Uma cadeia desconhecida devolve `404 not_found` e os nomes curtos aceites para o tipo de alvo em `error.details.chains`. Uma falha temporária dos dados da cadeia devolve `503 retryable`.

Um contrato EVM sem ABI verificado devolve `404 not_found`. Um programa Solana sem IDL ou um pallet Substrate desconhecido devolve `404 not_found` quando o runtime identifica a causa. Se apenas indicar uma falha genérica, a API devolve `503 retryable`. Um explorador sobrecarregado também pode devolver `not_found` por falta de ABI. Se o contrato estiver verificado no explorador, tente novamente daqui a um minuto.

Devolve `{ chain, source, events, recentBlocks, functions? }` com assinaturas exatas de eventos. Para EVM, o `recentCount` de cada evento conta os logs dos últimos `recentBlocks` blocos, até 1 000. Se o fornecedor recusar uma consulta ampla, a API tenta novamente com janelas mais pequenas e pode devolver um intervalo menor. `recentBlocks` é `null` quando não é possível ler nenhum bloco e para Solana ou Substrate. Um `recentCount` de `null` indica que a contagem está indisponível ou não se aplica.

## POST /api/agent/build/drafts

As chaves requerem `manage`. Envie `chain` num dos formatos aceites pela [pesquisa de contratos](#post-api-agent-build-contracts), juntamente com o alvo e um nome ou assinatura exata em `event`. Pode incluir `title` e `description`. Devolve `{ draftId, fullnamePreview, inputs, filterable, outputSchema, expiresAt }`. O rascunho dura sete dias. Uma cadeia desconhecida devolve `404 not_found` com `error.details.chains`. Um evento desconhecido também devolve `404 not_found`. Uma falha temporária dos dados da cadeia devolve `503 retryable`.

Os [erros de pesquisa de esquemas de contratos](#post-api-agent-build-contracts) também se aplicam ao planeamento de rascunhos. Um nome de evento sobrecarregado devolve HTTP `400`. Use a assinatura exata.

## POST /api/agent/build/drafts/:draftId/test

As chaves requerem `read`. Envie opcionalmente `block` (EVM ou Substrate) ou `slot` (Solana). Omita ambos para pesquisar num intervalo recente limitado. Devolve `{ result, block?, slot?, output? }` com `matched`, `no_match`, `invalid` ou `retryable`. Um rascunho indisponível devolve `404 not_found`, ou `410 draft_expired` se ainda estiver guardado após expirar.

Usar `slot` para EVM ou Substrate, ou `block` para Solana, devolve `result: "invalid"`.

A pesquisa em Solana tenta até 12 slots recentes e em Substrate até 12 blocos recentes. Se uma pesquisa EVM ler pelo menos um intervalo de logs sem correspondências, uma resposta de erro do fornecedor, incluindo um tempo limite do lado do fornecedor, ou uma recusa genérica do runtime em intervalos anteriores pode terminar a pesquisa com `no_match`. O resultado só abrange os intervalos lidos. Falhas de transporte, o fim do prazo da pesquisa e a impossibilidade de ler qualquer intervalo devolvem `retryable`.

Se souber onde ocorreu o evento ou quiser dispensar a pesquisa, passe a `test_trigger` o seu `slot` para Solana ou o seu `block` para EVM ou Substrate.

## POST /api/agent/build/drafts/:draftId/activate

As chaves requerem `manage`. Envie `{ requestId }` e reutilize-o ao repetir. Devolve `{ trigger, project }` para o projeto privado de agente do espaço. Se o último teste não devolver `matched`, responde `409 not_tested`. Os limites devolvem `403 private_project_limit` ou `403 trigger_limit`. Os erros de disponibilidade são os mesmos do teste.

A ativação requer um `requestId` de até 128 caracteres com pelo menos um carácter que não seja espaço em branco.

A primeira ativação bem-sucedida cria o projeto privado `agent-triggers` ou acrescenta um sufixo se o nome estiver ocupado. O projeto conta para o limite de projetos privados da conta. Advanced permite um, pelo que criar o projeto de agente devolve `403 private_project_limit` se essa vaga já estiver ocupada. Reutilizar o `requestId` para o mesmo rascunho no espaço devolve o resultado original. Usá-lo com outro rascunho devolve `409 request_id_conflict`.

Se outro membro criou o projeto de agente no espaço, a ativação usa o plano do criador para verificar as unidades de triggers. Devolve `plan_required` se esse plano já não permitir gerir triggers.

## DELETE /api/agent/build/triggers/:fullname

As chaves requerem `manage`. Remove um trigger do projeto privado de agente. Devolve `204 No Content`, `404 not_found` fora desse projeto ou `409 trigger_in_use` se uma subscrição ativa (`on`) do espaço do trigger o usar.

## Trigger Spec

`triggerSpec` describes source matching.

Supported variants:

| Type | Required fields | Optional fields |
| --- | --- | --- |
| `evm_log` | `type`, `dataSource` | `contract`, `event`, `abiFragment`, `topicsCount`, `dataBytes`, `testInput` |
| `evm_transaction` | `type`, `dataSource` | `testInput` |
| `substrate_event` | `type`, `dataSource` | `pallet`, `event`, `testInput` |
| `solana_event` | `type`, `dataSource` | `programId`, `event`, `idl`, `testInput` |
| `timer` | `type`, `interval` | `testInput` |

## Provider Definition

Each provider has `id`, `type`, optional `weight`, optional `timeoutMs`, and optional `outputSchema`.

Supported provider types:

| Type | Required fields | Main optional fields |
| --- | --- | --- |
| `http` | `id`, `type`, `url` | `method`, `headers`, `queryParams`, `body` |
| `graphql` | `id`, `type`, `url`, `query` | `headers`, `variables` |
| `rpc` with `transport: "endpoint"` | `id`, `type`, `url`, `method` | `headers`, `params`, `body` |
| `rpc` with `transport: "source"` | `id`, `type`, `transport`, `method` | `params` |
| `substrate_storage` | `id`, `type`, `module`, `entry` | `source`, `args`, `block` |
| `evm_read` | `id`, `type`, `contract`, `method`, `abiFragment` | `source`, `abiContract`, `args` |
| `solana_account` | `id`, `type`, `account` | `source`, `idl`, `programId`, `accountName`, `pda` |
| `state_window` | `id`, `type`, `dedupeBy`, `value`, `keepLast` | `partitionBy`, `valueType`, `aggregate` |
| `javascript` | `id`, `type`, `source` | `variables` |
