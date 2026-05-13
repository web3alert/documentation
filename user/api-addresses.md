# Addresses API

Address book endpoints manage reusable workspace/account addresses.

## GET /api/v1/addressbook

Возвращает address book.

Arguments: нет.

Payload: нет.

Response: array of address entries.

## POST /api/v1/addressbook

Создает address book entry.

Arguments: нет.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Да | `plain`, `ss58`, `evm`, `bitcoin` или `cosmos`. |
| `address` | Да | Address value. |
| `alias` | Да | Human-readable alias. |

Response: created address entry.

## POST /api/v1/addressbook/:id

Обновляет address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Да | Address type. |
| `address` | Да | Address value. |
| `alias` | Да | Human-readable alias. |

Response: updated address entry.

## DELETE /api/v1/addressbook/:id

Удаляет address book entry.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Payload: нет.

Response: operation result.
