# Webhooks

## Cómo es una entrega

Web3alert envía una solicitud HTTP POST con un cuerpo JSON.

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

| Campo | Significado |
| --- | --- |
| `id` | `evt_` seguido de 32 caracteres hexadecimales en minúsculas. Coincide con `webhook-id` y se mantiene en todos los intentos. |
| `type` | `subscription.event` para un evento o `subscription.test` para una entrega de prueba. |
| `timestamp` | Fecha y hora UTC en formato ISO 8601 en que Web3alert preparó la entrega por primera vez. Se mantiene en todos los intentos. |
| `subscription.id` | ID de la suscripción. |
| `trigger.fullname`, `trigger.name` | Nombre completo y nombre del disparador. |
| `header`, `message` | Título o nombre del proyecto y texto largo o corto de la alerta. |
| `icon`, `cover`, `links` | URL de imágenes y enlaces con `text` y `url`, cuando están disponibles. |
| `object` | Datos del evento o un objeto vacío. |

| Cabecera | Significado |
| --- | --- |
| `content-type` | `application/json`. |
| `webhook-id` | ID de la entrega, igual al `id` del cuerpo. |
| `webhook-timestamp` | Hora de este intento en segundos Unix, como cadena de texto que representa un entero. |
| `webhook-signature` | En endpoints con secreto de firma, `v1,<signature>` contiene el HMAC-SHA256 codificado en base64. |

## Verificar la firma

Verifica el cuerpo original de la solicitud antes de analizar el JSON. Calcula el HMAC sobre `webhook-id.webhook-timestamp.raw-body` con la parte del secreto que sigue a `whsec_`, decodificada de base64. Usa la marca de tiempo de la cabecera y rechaza las solicitudes con más de cinco minutos de adelanto o atraso respecto a tu reloj. Las bibliotecas de Standard Webhooks también pueden verificar estas entregas.

Los ejemplos reciben el cuerpo original como `Buffer` de Node.js o `bytes` de Python, un mapa de nombres de cabecera en minúsculas a cadenas de texto y el secreto de firma del endpoint. Acepta la solicitud solo si se verifica correctamente.

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

### Vector de referencia

Para comprobar cualquiera de los ejemplos con el vector de referencia de Standard Webhooks, usa el cuerpo literal de abajo sin salto de línea final. Para estos datos históricos, pasa `1614265330` como cuarto argumento (`now`). La verificación debe devolver `true` en Node.js o `True` en Python.

| Entrada | Valor |
| --- | --- |
| Secreto | `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` |
| `webhook-id` | `msg_p5jXN8AQM9LWM0D4loKWxJek` |
| `webhook-timestamp` | `1614265330` |
| Cuerpo original | `{"test": 2432232314}` |
| Cabecera esperada `webhook-signature` | `v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=` |

## El secreto de firma

Al crear un webhook en la aplicación, Web3alert muestra el secreto una sola vez. La herramienta MCP `add_webhook` también lo devuelve una sola vez como `signingSecret`. Guarda el secreto para tu receptor. Un secreto de Web3alert consta de `whsec_` seguido de 32 bytes codificados en base64 estándar con relleno.

Genera o rota el secreto en la aplicación o mediante [`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret). El secreto nuevo se aplica a las entregas en unos 10 segundos. Hasta entonces se usa el anterior, si lo había. Cuando el nuevo entra en vigor, Web3alert deja de firmar con el anterior. Los endpoints creados antes de que estuviera disponible la firma siguen sin firmar hasta que generes un secreto.

## Reintentos

Una respuesta `2xx` indica que el receptor aceptó la entrega. Responde rápido porque las solicitudes tienen un tiempo de espera predeterminado de 4 segundos. Web3alert reintenta las entregas ante HTTP `429`, cualquier respuesta `5xx`, un tiempo de espera agotado o un error de red antes de recibir una respuesta, como un corte de conexión o un fallo de DNS o TLS. Los demás resultados dan por terminada la entrega. Las entregas de prueba nunca se reintentan.

Web3alert sigue las redirecciones, envía la solicitud firmada al destino de la redirección si la firma está habilitada y usa la respuesta final para decidir el resultado. Si el servicio de envío de webhooks de Web3alert no está disponible durante un breve periodo, la entrega espera y se reintenta sin consumir un intento, salvo el primero, que cuenta y registra `webhook service unavailable` con `channel.webhook.retry_scheduled`.

| Después del intento fallido | Espera mínima hasta el siguiente intento |
| --- | --- |
| 1 | 5 segundos |
| 2 | 1 minuto |
| 3 | 10 minutos |
| 4 | 1 hora |
| 5 | 6 horas |

Cada entrega tiene un máximo de seis intentos. Con estos intervalos, seis intentos abarcan unas 7 horas y 11 minutos más el tiempo de entrega. Los reintentos conservan el cuerpo y el `webhook-id`. Cada intento usa la URL vigente y un nuevo `webhook-timestamp`, y Web3alert lo firma con el secreto vigente si está configurado. La entrega es al menos una vez, así que usa `webhook-id` para evitar procesar el mismo evento de nuevo. Los reintentos no consumen el límite de frecuencia de notificaciones de la suscripción.

Si pausas o eliminas la suscripción, los reintentos se detienen en unos 10 segundos. Todavía puede enviarse un intento previsto para ese intervalo. Los reintentos también se detienen si desvinculas el webhook de la suscripción o eliminas el recurso webhook. Si la cola de reintentos no puede aceptar la entrega (porque está llena o la entrega supera los 256 KB), la entrega fallida no se reintenta y cuenta como no entregada.

## Bloqueo

Una respuesta HTTP `410 Gone` en cualquier intento bloquea la suscripción de inmediato. Cinco eventos consecutivos sin entregar para la misma suscripción y el mismo recurso webhook también bloquean la suscripción. Un evento cuenta como no entregado si agota sus reintentos, no puede entrar en la cola de reintentos o se rechaza. Las URL inválidas, los secretos de firma mal formados y los estados HTTP distintos de `2xx`, `410`, `429` y `5xx` provocan un rechazo. El recuento excluye las entregas pendientes de reintento. Una entrega correcta reinicia el recuento de esa suscripción y ese webhook. Un bloqueo también pone a cero el recuento de esa suscripción y ese webhook, que vuelve a empezar al reanudar la suscripción. El recuento caduca después de 30 días sin un nuevo evento no entregado.

Para reanudar las entregas, cambia el estado de la suscripción a `on` en la aplicación, mediante `PUT /api/subscriptions/:id/state` o con la herramienta MCP `set_subscription_state`.

## Registro de entregas

El historial de entregas se conserva en los planes de pago. Las [rutas de historial de suscripciones](api-subscriptions.md) y la herramienta MCP `get_delivery_log` muestran estos campos en los registros de canales webhook.

| Campo | Significado |
| --- | --- |
| `eventId` | El `webhook-id` de la entrega. |
| `attempt` | Número de intento, a partir de `1`. |
| `nextAttemptAt` | Marca de tiempo ISO solo si se programa un reintento para el webhook. En los demás casos es `null`, incluso si el webhook recibe la entrega en el primer intento. |

| `reasonCode` | Significado |
| --- | --- |
| `channel.webhook.retry_scheduled` | El primer intento falló y se programó un reintento. |
| `channel.webhook.rejected` | La entrega del webhook se rechazó. |
| `channel.webhook.gone` | El endpoint devolvió HTTP `410`. |
| `channel.webhook.retries_exhausted` | El sexto intento falló con un error que admite reintentos. |
| `channel.webhook.retry_queue_full` | La cola de reintentos no pudo aceptar la entrega porque estaba llena o la entrega superaba los 256 KB. La entrega no se reintenta y cuenta como no entregada. |

El estado del primer registro refleja todos los canales de entrega del evento. Si otro canal entregó el evento y el webhook falló con un error que admite reintento, el registro del evento tiene estado `delivered` y su canal webhook tiene `ok: false`. El campo `reasonCode` del canal webhook del registro del evento indica `channel.webhook.retry_scheduled` si se programa un reintento, o `channel.webhook.retry_queue_full` si la cola de reintentos no puede aceptar la entrega (porque está llena o la entrega supera los 256 KB).

Cuando una entrega con reintentos llega a un resultado final, un segundo registro recoge ese resultado con el mismo `eventId` y solo el canal webhook. El estado del registro es `delivered` si se entrega, `failed` si se rechaza o agota los reintentos, o `blocked` si recibe HTTP `410`. Los fallos intermedios seguidos de otro reintento no generan un registro de entrega.

Si la cola de reintentos no puede aceptar la entrega tras un intento posterior, el registro final tiene estado `failed` y muestra `channel.webhook.retry_queue_full` en su canal webhook.
