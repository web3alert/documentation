# Addresses API

Address book endpoints manage reusable workspace/account addresses.

## GET /api/addresses

Returns the address book.

Arguments: none.

Payload: none.

Response: [AddressEntry[]](types.md#addressentry).

## POST /api/addresses

Creates an address book entry.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | `plain`, `ss58`, `evm`, `solana`, `bitcoin`, or `cosmos`. |
| `address` | Yes | Address value. |
| `alias` | Yes | Human-readable alias. |

Response: [AddressEntry](types.md#addressentry).

## PUT /api/addresses/:id

Updates an address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | `plain`, `ss58`, `evm`, `solana`, `bitcoin`, or `cosmos`. |
| `address` | Yes | Address value. |
| `alias` | Yes | Human-readable alias. |

Response: [AddressEntry](types.md#addressentry).

## DELETE /api/addresses/:id

Deletes an address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: none.

Response: HTTP 204 No Content with an empty body.
<!-- api-contract: response=204; body=empty -->
