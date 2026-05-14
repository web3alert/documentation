# Addresses API

Address book endpoints manage reusable workspace/account addresses.

## GET /api/v1/addressbook

Returns the address book.

Arguments: none.

Payload: none.

Response: [AddressEntry[]](types.md#addressentry).

## POST /api/v1/addressbook

Creates an address book entry.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | `plain`, `ss58`, `evm`, `bitcoin`, or `cosmos`. |
| `address` | Yes | Address value. |
| `alias` | Yes | Human-readable alias. |

Response: [AddressEntry](types.md#addressentry).

## POST /api/v1/addressbook/:id

Updates an address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Address type. |
| `address` | Yes | Address value. |
| `alias` | Yes | Human-readable alias. |

Response: [AddressEntry](types.md#addressentry).

## DELETE /api/v1/addressbook/:id

Deletes an address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: none.

Response: [OperationResult](types.md#operationresult).
