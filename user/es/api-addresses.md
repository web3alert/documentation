# Addresses API

Los endpoints Address book gestionan direcciones reutilizables de workspace/account.

## GET /api/v1/addressbook

Devuelve el address book.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [AddressEntry[]](types.md#addressentry).

## POST /api/v1/addressbook

Crea una address book entry.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `type` | Sí | `plain`, `ss58`, `evm`, `bitcoin` o `cosmos`. |
| `address` | Sí | Valor de address. |
| `alias` | Sí | Alias legible para humanos. |

Respuesta: [AddressEntry](types.md#addressentry).

## POST /api/v1/addressbook/:id

Actualiza una address book entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `type` | Sí | Tipo de address. |
| `address` | Sí | Valor de address. |
| `alias` | Sí | Alias legible para humanos. |

Respuesta: [AddressEntry](types.md#addressentry).

## DELETE /api/v1/addressbook/:id

Elimina una address book entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: ninguno.

Respuesta: [OperationResult](types.md#operationresult).
