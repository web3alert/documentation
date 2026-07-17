# Addresses API

Los endpoints Address book gestionan direcciones reutilizables de workspace/account.

## GET /api/addresses

Devuelve el address book.

Argumentos: ninguno.

Payload: ninguno.

Respuesta: [AddressEntry[]](types.md#addressentry).

## POST /api/addresses

Crea una address book entry.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `type` | Sí | `plain`, `ss58`, `evm`, `solana`, `bitcoin` o `cosmos`. |
| `address` | Sí | Valor de address. |
| `alias` | Sí | Alias legible para humanos. |

Respuesta: [AddressEntry](types.md#addressentry).

## PUT /api/addresses/:id

Actualiza una address book entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `type` | Sí | `plain`, `ss58`, `evm`, `solana`, `bitcoin` o `cosmos`. |
| `address` | Sí | Valor de address. |
| `alias` | Sí | Alias legible para humanos. |

Respuesta: [AddressEntry](types.md#addressentry).

## DELETE /api/addresses/:id

Elimina una address book entry.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: ninguno.

Respuesta: HTTP 204 No Content con el cuerpo vacío.
<!-- api-contract: response=204; body=empty -->
