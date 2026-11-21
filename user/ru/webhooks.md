# Вебхуки

## Как выглядит доставка

Web3alert отправляет HTTP POST с телом в формате JSON.

```json
{
  "id": "evt_0123456789abcdef0123456789abcdef",
  "type": "subscription.event",
  "timestamp": "2026-11-21T12:00:00.000Z",
  "subscription": { "id": "example-subscription-id" },
  "trigger": { "fullname": "example.project.transfer", "name": "Transfer" },
  "header": "Example project",
  "icon": "https://example.com/icon.png",
  "cover": "https://example.com/cover.png",
  "message": "Example alert",
  "links": [{ "text": "View event", "url": "https://example.com/event" }],
  "object": { "amount": "100" }
}
```

| Поле | Значение |
| --- | --- |
| `id` | Префикс `evt_` и 32 шестнадцатеричных символа в нижнем регистре. Совпадает с `webhook-id` и сохраняется при каждой попытке. |
| `type` | `subscription.event` для события или `subscription.test` для тестовой доставки. |
| `timestamp` | Время, когда Web3alert впервые подготовил доставку, в формате ISO 8601 UTC. Сохраняется при каждой попытке. |
| `subscription.id` | ID подписки. |
| `trigger.fullname`, `trigger.name` | Полное имя и имя триггера. |
| `header`, `message` | Заголовок или имя проекта и длинный или короткий текст оповещения. |
| `icon`, `cover`, `links` | URL изображений и ссылки с полями `text` и `url`, если они заданы. |
| `object` | Данные события или пустой объект. |

| Заголовок | Значение |
| --- | --- |
| `content-type` | `application/json`. |
| `webhook-id` | ID доставки, совпадает с `id` в теле. |
| `webhook-timestamp` | Время этой попытки в секундах Unix, переданное строкой с целым числом. |
| `webhook-signature` | Для эндпоинтов с секретом подписи `v1,<signature>` содержит HMAC-SHA256 в кодировке base64. |

## Проверка подписи

Проверяйте исходное тело запроса до разбора JSON. Вычислите HMAC от `webhook-id.webhook-timestamp.raw-body` с ключом, полученным декодированием части секрета после `whsec_` из base64. Используйте время из заголовка и отклоняйте запросы, если оно отличается от времени на ваших часах более чем на пять минут в любую сторону. Для проверки также подходят библиотеки Standard Webhooks.

Примеры принимают исходное тело как `Buffer` в Node.js или `bytes` в Python, словарь со строковыми значениями заголовков и именами в нижнем регистре, а также секрет подписи эндпоинта. Принимайте запрос только после успешной проверки.

### Node.js

```js
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyWebhook(rawBody, headers, secret, now = Math.floor(Date.now() / 1000)) {
  const id = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signatures = headers['webhook-signature']
  if (!id || !timestamp || !signatures || !secret.startsWith('whsec_')) return false
  if (!/^[0-9]{1,16}$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 300) return false

  const encodedKey = secret.slice(6)
  const key = Buffer.from(encodedKey, 'base64')
  if (key.length === 0 || key.toString('base64') !== encodedKey) return false

  const digest = createHmac('sha256', key).update(`${id}.${timestamp}.`).update(rawBody)
  const expected = Buffer.from(digest.digest('base64'))
  let valid = false
  for (const entry of signatures.trim().split(/\s+/)) {
    if (!entry.startsWith('v1,')) continue
    const candidate = Buffer.from(entry.slice(3))
    if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) valid = true
  }
  return valid
}
```

### Python

```python
import base64
import hashlib
import hmac
import re
import time
from binascii import Error


def verify_webhook(raw_body, headers, secret, now=None):
    id_ = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signatures = headers.get("webhook-signature")
    if not id_ or not timestamp or not signatures or not secret.startswith("whsec_"):
        return False
    if now is None:
        now = int(time.time())
    if not re.fullmatch(r"[0-9]{1,16}", timestamp) or abs(now - int(timestamp)) > 300:
        return False

    encoded_key = secret[6:]
    try:
        key = base64.b64decode(encoded_key, validate=True)
    except (Error, ValueError):
        return False
    if not key or base64.b64encode(key).decode("ascii") != encoded_key:
        return False

    signed = f"{id_}.{timestamp}.".encode("utf-8") + raw_body
    expected = base64.b64encode(hmac.new(key, signed, hashlib.sha256).digest())
    valid = False
    for entry in signatures.split():
        if entry.startswith("v1,") and hmac.compare_digest(entry[3:].encode("utf-8"), expected):
            valid = True
    return valid
```

### Контрольный вектор

Чтобы проверить любой пример на контрольном векторе Standard Webhooks, используйте тело из таблицы без перевода строки в конце. Для этих исторических данных передайте `1614265330` четвёртым аргументом (`now`). Проверка должна вернуть `true` в Node.js или `True` в Python.

| Входные данные | Значение |
| --- | --- |
| Секрет | `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` |
| `webhook-id` | `msg_p5jXN8AQM9LWM0D4loKWxJek` |
| `webhook-timestamp` | `1614265330` |
| Исходное тело | `{"test": 2432232314}` |
| Ожидаемый заголовок `webhook-signature` | `v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=` |

## Секрет подписи

При создании вебхука в приложении Web3alert показывает секрет один раз. MCP-инструмент `add_webhook` тоже возвращает его один раз в поле `signingSecret`. Сохраните секрет для принимающей стороны. Секрет Web3alert состоит из префикса `whsec_` и 32 байт, закодированных стандартным base64 с дополнением.

Создайте или замените секрет в приложении либо через [`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret). Новый секрет применяется к доставкам примерно в течение 10 секунд. До этого используется прежний секрет, если он был. Когда новый секрет вступит в силу, Web3alert перестанет подписывать доставки прежним. Эндпоинты, созданные до появления подписей, получают доставки без подписи, пока вы не создадите секрет.

## Повторные попытки

Ответ `2xx` означает, что получатель принял доставку. Отвечайте быстро, поскольку время запроса ограничено 4 секундами. Web3alert повторяет попытку при HTTP `429`, любом ответе `5xx`, превышении времени ожидания или сетевой ошибке до получения ответа, например разрыве соединения или сбое DNS либо TLS. Остальные результаты завершают доставку. Тестовые доставки выполняются без повторных попыток.

| После неудачной попытки | Минимальное время до следующей попытки |
| --- | --- |
| 1 | 5 секунд |
| 2 | 1 минута |
| 3 | 10 минут |
| 4 | 1 час |
| 5 | 6 часов |

Всего на доставку даётся не более шести попыток. При таких интервалах шесть попыток занимают около 7 часов и 11 минут плюс время доставки. При повторных попытках сохраняются тело и `webhook-id`. Каждая попытка использует действующий URL и новый `webhook-timestamp`, а Web3alert подписывает её действующим секретом, если он настроен. Доставка выполняется как минимум один раз, поэтому используйте `webhook-id`, чтобы не обрабатывать одно событие повторно. Повторные попытки не расходуют лимит частоты уведомлений подписки.

Повторные попытки прекращаются, если приостановить или удалить подписку, убрать вебхук из подписки или удалить ресурс вебхука. Если очередь повторных попыток заполнена, после сбоя доставка не повторяется, а событие считается недоставленным.

## Блокировка

Ответ HTTP `410 Gone` на любой попытке сразу блокирует подписку. Пять недоставленных событий подряд для одной подписки и одного ресурса вебхука также блокируют подписку. Событие считается недоставленным, если попытки исчерпаны, его не удалось поставить в очередь на повторную попытку или доставка отклонена. Причиной отклонения может быть неверный URL, секрет подписи неверного формата или HTTP-статус, отличный от `2xx`, `410`, `429` и `5xx`. Ожидающие повторной попытки доставки не входят в счётчик. Успешная доставка обнуляет счётчик этой пары подписки и вебхука. Блокировка также обнуляет счётчик для этой пары подписки и вебхука, поэтому после возобновления начинается новый отсчёт.

Чтобы возобновить доставки, установите состояние подписки в `on` в приложении, через `PUT /api/subscriptions/:id/state` или с помощью MCP-инструмента `set_subscription_state`.

## Журнал доставки

История доставки сохраняется на платных тарифах. [Маршруты истории подписок](api-subscriptions.md) и MCP-инструмент `get_delivery_log` показывают эти поля в записях каналов вебхуков.

| Поле | Значение |
| --- | --- |
| `eventId` | `webhook-id` доставки. |
| `attempt` | Номер попытки, начиная с `1`. |
| `nextAttemptAt` | Время в формате ISO в первой записи, если запланирована повторная попытка. |

| `reasonCode` | Значение |
| --- | --- |
| `channel.webhook.retry_scheduled` | Первая попытка не удалась, запланирована повторная попытка. |
| `channel.webhook.rejected` | Доставка вебхука отклонена. |
| `channel.webhook.gone` | Эндпоинт ответил HTTP `410`. |
| `channel.webhook.retries_exhausted` | Шестая попытка завершилась ошибкой, допускающей повтор. |
| `channel.webhook.retry_queue_full` | Очередь повторных попыток была заполнена. Доставка не повторялась, и событие считается недоставленным. |

Если попытка завершилась ошибкой, допускающей повтор, а следующую попытку нельзя поставить в заполненную очередь, канал вебхука в записи со статусом `failed` содержит `reasonCode: "channel.webhook.retry_queue_full"`. Это первая запись при сбое первой попытки или итоговая запись при сбое более поздней попытки.

Когда доставка с повторными попытками завершается, вторая запись фиксирует итоговый результат и содержит только канал вебхука с тем же `eventId`. Статус записи — `delivered` при успехе, `failed` при отклонении, исчерпании попыток или заполнении очереди повторных попыток либо `blocked` при HTTP `410`. Промежуточные сбои, после которых запланирована ещё одна попытка, не создают записей в журнале.
