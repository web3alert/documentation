# Webhooks

## What a delivery looks like

Web3alert sends an HTTP POST with a JSON body.

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

| Field | Meaning |
| --- | --- |
| `id` | `evt_` followed by 32 lowercase hexadecimal characters. It matches `webhook-id` and stays the same on every attempt. |
| `type` | `subscription.event` for an event or `subscription.test` for a test delivery. |
| `timestamp` | ISO 8601 UTC time when Web3alert first built the delivery. It stays the same on every attempt. |
| `subscription.id` | Subscription ID. |
| `trigger.fullname`, `trigger.name` | The trigger's fullname and name. |
| `header`, `message` | Project title or name, and long or short alert text. |
| `icon`, `cover`, `links` | Image URLs and links with `text` and `url`, when supplied. |
| `object` | Event data, or an empty object. |

| Header | Meaning |
| --- | --- |
| `content-type` | `application/json`. |
| `webhook-id` | The delivery ID, equal to the body's `id`. |
| `webhook-timestamp` | Time of this attempt in Unix seconds, sent as an integer string. |
| `webhook-signature` | On endpoints with a signing secret, `v1,<signature>` carries the base64-encoded HMAC-SHA256. |

## Verify the signature

Verify against the raw request body before parsing JSON. Compute the HMAC over `webhook-id.webhook-timestamp.raw-body` with the base64-decoded part of the secret after `whsec_`. Use the timestamp from the header and reject requests more than five minutes ahead of or behind your clock. Standard Webhooks libraries can verify these deliveries too.

The examples take the raw body as a Node.js `Buffer` or Python `bytes`, a map of lowercase header names to strings, and the endpoint's signing secret. Accept the request only if verification succeeds.

### Node.js

```js
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyWebhook(rawBody, headers, secret, now = Math.floor(Date.now() / 1000)) {
  const id = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signatures = headers['webhook-signature']
  if (!id || !timestamp || !signatures || !secret.startsWith('whsec_')) return false
  // A dot in the ID lets the same signed id.timestamp.body bytes be split differently.
  if (!/^[A-Za-z0-9_-]{1,256}$/.test(id)) return false
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
    # A dot in the ID lets the same signed id.timestamp.body bytes be split differently.
    if not re.fullmatch(r"^[A-Za-z0-9_-]{1,256}$", id_):
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

### Reference vector

To check either example with the Standard Webhooks reference vector, use the literal body below with no trailing newline. Pass `1614265330` as the fourth argument (`now`) for this historical fixture. Verification should return `true` in Node.js or `True` in Python.

| Input | Value |
| --- | --- |
| Secret | `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` |
| `webhook-id` | `msg_p5jXN8AQM9LWM0D4loKWxJek` |
| `webhook-timestamp` | `1614265330` |
| Raw body | `{"test": 2432232314}` |
| Expected `webhook-signature` | `v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=` |

## The signing secret

Web3alert shows the secret once when you create a webhook in the app or returns it once as `signingSecret` from MCP `add_webhook`. Store it for your receiver. A Web3alert secret is `whsec_` followed by 32 bytes encoded in standard base64 with padding.

Generate or rotate the secret in the app or through [`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret). The new secret applies to deliveries within about 10 seconds. Until it takes effect, deliveries use the old secret if there was one. Once the new secret takes effect, Web3alert stops signing with the old one. Endpoints created before signing was available stay unsigned until you generate a secret.

Transferring a project to another workspace removes the signing secrets of the webhooks that move with it. Those webhooks appear as unsigned. To sign deliveries again, someone who controls the new workspace must generate a fresh secret for each moved webhook.

## Retries

A `2xx` response means the receiver accepted the delivery. Respond quickly because requests time out after 4 seconds by default. Web3alert retries HTTP `429`, any `5xx` response, timeouts, and network errors that occur before a response, such as a connection reset or a DNS or TLS failure. All other outcomes end the delivery. Test deliveries are never retried.

Web3alert follows redirects, sends the signed request to the redirect target when signing is enabled, and uses the final response to decide the outcome.

When a retry is due and Web3alert's webhook sender is unavailable, Web3alert waits and tries again without advancing the attempt count. If the sender is unavailable on the first attempt, Web3alert schedules attempt 2 with the reason `webhook service unavailable` and the code `channel.webhook.retry_scheduled`. A sender timeout counts as a retryable failure with the reason `webhook service timed out` and follows the retry schedule.

| After failed attempt | Minimum wait before the next attempt |
| --- | --- |
| 1 | 5 seconds |
| 2 | 1 minute |
| 3 | 10 minutes |
| 4 | 1 hour |
| 5 | 6 hours |

A delivery gets at most six attempts. At these intervals, six attempts span about 7 hours and 11 minutes, plus delivery time. Retries keep the same body and `webhook-id`. Each attempt uses the current URL and a fresh `webhook-timestamp`, and Web3alert signs it with the current secret if one is configured. Delivery is at least once, so deduplicate on `webhook-id` before processing the event again. Retries do not count against the subscription's notification rate limit.

If you pause or remove the subscription, retries stop within about 10 seconds. An attempt already due in that window can still be sent. Retries also stop if you detach the webhook from the subscription or remove the webhook resource. When the retry queue cannot accept the delivery (it is full, or the queued delivery, including its event data, exceeds 256 KB), the failed delivery is not retried and counts as undelivered.

A queued retry is kept for at most 8 hours. If Web3alert's sender stays unavailable past that limit, the retry expires without a final delivery-log entry.

## Blocking

An HTTP `410 Gone` on any attempt blocks the subscription immediately. Five consecutive undelivered events for the same subscription and webhook resource also block the subscription. An event counts as undelivered if it runs out of retries, cannot be queued for retry, or is rejected. Invalid URLs, malformed signing secrets, and HTTP statuses outside `2xx`, `410`, `429`, and `5xx` are rejections. The count excludes deliveries still waiting for a retry. A delivered event resets the count for that subscription and webhook. A block also resets the count to zero for that subscription and webhook, so resuming starts a new count. The count expires after 30 days without a new undelivered event.

To resume, set the subscription state to `on` in the app, with `PUT /api/subscriptions/:id/state`, or with the MCP tool `set_subscription_state`.

## Delivery log

Delivery history is kept on paid plans. The [subscription history routes](api-subscriptions.md) and MCP `get_delivery_log` expose these fields on webhook channel entries.

| Field | Meaning |
| --- | --- |
| `eventId` | The delivery's `webhook-id`. |
| `attempt` | Attempt number, starting at `1`. |
| `nextAttemptAt` | ISO timestamp when a webhook retry is pending. With no retry pending, REST history omits the field and MCP `get_delivery_log` sets it to `null`. |

| `reasonCode` | Meaning |
| --- | --- |
| `channel.webhook.retry_scheduled` | The first attempt failed and a retry is scheduled. |
| `channel.webhook.rejected` | The webhook delivery was rejected. |
| `channel.webhook.gone` | The endpoint returned HTTP `410`. |
| `channel.webhook.retries_exhausted` | The sixth attempt failed with a retryable error. |
| `channel.webhook.retry_queue_full` | The retry queue could not accept the delivery because it was full or the queued delivery, including its event data, exceeded 256 KB. The delivery is not retried and counts as undelivered. |

The first entry's status reflects all delivery channels for the event. If another channel delivered and the webhook failed with a retryable error, the event's entry has status `delivered` and its webhook channel has `ok: false`. The webhook channel of the event's entry has `reasonCode` set to `channel.webhook.retry_scheduled` when a retry is scheduled, or `channel.webhook.retry_queue_full` when the retry queue cannot accept the delivery (it is full, or the queued delivery, including its event data, exceeds 256 KB).

The final outcome of a retried delivery is recorded in a separate entry with the same `eventId` and only the webhook channel. The entry status is `delivered` on success, `failed` for a rejection or exhausted retries, or `blocked` for HTTP `410`. Intermediate failures followed by another retry produce no delivery-log entry.

If the retry queue cannot accept the delivery after a later attempt, the final entry has status `failed` and shows `channel.webhook.retry_queue_full` on its webhook channel.

A crash after a final outcome is logged can create another final entry for the same delivery. Delivery is at least once, so group log entries by `eventId`.
