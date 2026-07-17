# API ссылок

Ссылки создают и разрешают короткие ключи для внутренних адресов Web3alert.
Оба endpoint публичные и не требуют Bearer token.

## POST /api/links

Создает постоянную короткую ссылку.
<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->

Аутентификация: не требуется.

Аргументы: нет.

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `uri` | Да | Внутренний путь Web3alert. Должен начинаться с `/` и не должен начинаться с `/link/`; абсолютные внешние URL не принимаются. |

Зарезервированный frontend-префикс перенаправления `/link/` не является API
endpoint и не может быть передан как адрес назначения.

```http
POST /api/links
Content-Type: application/json

{
  "uri": "/common.ethereum"
}
```

Ответ: HTTP 200 OK с объектом `Link`.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `key` | Да | Сгенерированный ключ короткой ссылки. |
| `uri` | Да | Сохраненный внутренний путь Web3alert. |

```json
{
  "key": "AbC123",
  "uri": "/common.ethereum"
}
```

Некорректный `uri` возвращает HTTP 400 Bad Request с сообщением об ошибке
`invalid uri`.

## GET /api/links/:key

Разрешает ключ короткой ссылки.
<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->

Аутентификация: не требуется.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `key` | Path | Сгенерированный ключ короткой ссылки. |

Тело запроса: нет.

Ответ: HTTP 200 OK с сохраненным объектом `Link`.

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `key` | Да | Ключ короткой ссылки. |
| `uri` | Да | Сохраненный внутренний путь Web3alert. |

Если ключ не существует, endpoint возвращает HTTP 400 Bad Request с сообщением
об ошибке `shortcut not found`.
