# Addresses API

Os endpoints Address book gerem endereços reutilizáveis de workspace/account.

## GET /api/addresses

Devolve o address book.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [AddressEntry[]](types.md#addressentry).

## POST /api/addresses

Cria uma address book entry.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `type` | Sim | `plain`, `ss58`, `evm`, `bitcoin` ou `cosmos`. |
| `address` | Sim | Valor de address. |
| `alias` | Sim | Alias legível para humanos. |

Resposta: [AddressEntry](types.md#addressentry).

## PUT /api/addresses/:id

Atualiza uma address book entry.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `type` | Sim | Tipo de address. |
| `address` | Sim | Valor de address. |
| `alias` | Sim | Alias legível para humanos. |

Resposta: [AddressEntry](types.md#addressentry).

## DELETE /api/addresses/:id

Elimina uma address book entry.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).
