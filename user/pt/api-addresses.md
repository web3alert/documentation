# Addresses API

Os endpoints Address book gerem endereços reutilizáveis de workspace/account.

## GET /api/v1/addressbook

Devolve o address book.

Argumentos: nenhum.

Payload: nenhum.

Resposta: [AddressEntry[]](types.md#addressentry).

## POST /api/v1/addressbook

Cria uma address book entry.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `type` | Sim | `plain`, `ss58`, `evm`, `bitcoin` ou `cosmos`. |
| `address` | Sim | Valor de address. |
| `alias` | Sim | Alias legível para humanos. |

Resposta: [AddressEntry](types.md#addressentry).

## POST /api/v1/addressbook/:id

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

## DELETE /api/v1/addressbook/:id

Elimina uma address book entry.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: nenhum.

Resposta: [OperationResult](types.md#operationresult).
