# Addresses API

Endpoints Address Book управляют переиспользуемыми адресами workspace/account.

## GET /api/addresses

Возвращает address book.

Аргументы: нет.

Тело запроса: нет.

Ответ: [AddressEntry[]](types.md#addressentry).

## POST /api/addresses

Создает address book entry.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `type` | Да | `plain`, `ss58`, `evm`, `solana`, `bitcoin` или `cosmos`. |
| `address` | Да | Значение address. |
| `alias` | Да | Человекочитаемый alias. |

Ответ: [AddressEntry](types.md#addressentry).

## PUT /api/addresses/:id

Обновляет address book entry.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `type` | Да | `plain`, `ss58`, `evm`, `solana`, `bitcoin` или `cosmos`. |
| `address` | Да | Значение address. |
| `alias` | Да | Человекочитаемый alias. |

Ответ: [AddressEntry](types.md#addressentry).

## DELETE /api/addresses/:id

Удаляет address book entry.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `id` | Path | Address entry id. |

Тело запроса: нет.

Ответ: HTTP 204 No Content с пустым телом.
<!-- api-contract: response=204; body=empty -->
