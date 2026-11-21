# Webhooks

## Como é uma entrega

O Web3alert envia um pedido HTTP POST com um corpo JSON.

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
| `id` | `evt_` seguido de 32 caracteres hexadecimais em minúsculas. É igual a `webhook-id` e mantém-se em todas as tentativas. |
| `type` | `subscription.event` para um evento ou `subscription.test` para uma entrega de teste. |
| `timestamp` | Data e hora UTC em formato ISO 8601 em que o Web3alert preparou a entrega pela primeira vez. Mantém-se em todas as tentativas. |
| `subscription.id` | ID da subscrição. |
| `trigger.fullname`, `trigger.name` | Nome completo e nome do trigger. |
| `header`, `message` | Título ou nome do projeto e texto longo ou curto do alerta. |
| `icon`, `cover`, `links` | URLs de imagens e ligações com `text` e `url`, quando disponíveis. |
| `object` | Dados do evento ou um objeto vazio. |

| Cabeçalho | Significado |
| --- | --- |
| `content-type` | `application/json`. |
| `webhook-id` | ID da entrega, igual ao `id` do corpo. |
| `webhook-timestamp` | Hora desta tentativa em segundos Unix, enviada como uma cadeia de texto que representa um número inteiro. |
| `webhook-signature` | Nos endpoints com um segredo de assinatura, `v1,<signature>` contém o HMAC-SHA256 codificado em base64. |

## Verificar a assinatura

Verifique o corpo original do pedido antes de interpretar o JSON. Calcule o HMAC sobre `webhook-id.webhook-timestamp.raw-body` com a parte do segredo após `whsec_`, descodificada de base64. Use a marca temporal do cabeçalho e rejeite pedidos cuja marca temporal difira mais de cinco minutos do seu relógio, em qualquer sentido. As bibliotecas Standard Webhooks também podem verificar estas entregas.

Os exemplos recebem o corpo original como `Buffer` em Node.js ou `bytes` em Python, um mapa de nomes de cabeçalhos em minúsculas para cadeias de texto e o segredo de assinatura do endpoint. Aceite o pedido apenas se a verificação for bem-sucedida.

### Node.js

```js
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyWebhook(rawBody, headers, secret, now = Math.floor(Date.now() / 1000)) {
  const id = headers['webhook-id']
  const timestamp = headers['webhook-timestamp']
  const signatures = headers['webhook-signature']
  if (!id || !timestamp || !signatures || !secret.startsWith('whsec_')) return false
  // Um ponto no ID permite separar de outra forma os mesmos bytes assinados de id.timestamp.body.
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
    # Um ponto no ID permite separar de outra forma os mesmos bytes assinados de id.timestamp.body.
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

### Vetor de referência

Para testar qualquer um dos exemplos com o vetor de referência do Standard Webhooks, use o corpo literal abaixo sem uma quebra de linha no fim. Para estes dados históricos, passe `1614265330` como quarto argumento (`now`). A verificação deve devolver `true` em Node.js ou `True` em Python.

| Entrada | Valor |
| --- | --- |
| Segredo | `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` |
| `webhook-id` | `msg_p5jXN8AQM9LWM0D4loKWxJek` |
| `webhook-timestamp` | `1614265330` |
| Corpo original | `{"test": 2432232314}` |
| Cabeçalho esperado `webhook-signature` | `v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=` |

## O segredo de assinatura

Ao criar um webhook na aplicação, o Web3alert mostra o segredo uma única vez. A ferramenta MCP `add_webhook` também o devolve uma única vez como `signingSecret`. Guarde o segredo para o seu recetor. Um segredo do Web3alert tem o prefixo `whsec_` seguido de 32 bytes codificados em base64 padrão com preenchimento.

Gere ou rode o segredo na aplicação ou através da [`POST /api/resources/{fullname}/signing-secret`](api-resources.md#post-api-resources-fullname-signing-secret). O novo segredo aplica-se às entregas em cerca de 10 segundos. Até lá, as entregas usam o segredo anterior, se existir. Quando o novo entra em vigor, o Web3alert deixa de assinar com o anterior. Os endpoints criados antes de a assinatura estar disponível continuam sem assinatura até gerar um segredo.

Transferir um projeto para outro espaço de trabalho remove os segredos de assinatura dos webhooks transferidos com o projeto. Esses webhooks passam a aparecer sem assinatura. Para voltar a assinar as entregas, alguém com controlo sobre o novo espaço de trabalho tem de gerar um novo segredo para cada webhook transferido.

## Novas tentativas

Uma resposta `2xx` indica que o recetor aceitou a entrega. Responda rapidamente porque por predefinição, o pedido expira após 4 segundos. O Web3alert volta a tentar a entrega perante HTTP `429`, qualquer resposta `5xx`, um pedido que exceda o tempo limite ou um erro de rede antes de receber uma resposta, como uma ligação interrompida ou uma falha de DNS ou TLS. Os restantes resultados terminam a entrega. As entregas de teste nunca são repetidas.

O Web3alert trata uma resposta HTTP `3xx` como uma rejeição e não volta a tentar a entrega. A rejeição conta para o bloqueio da subscrição após cinco eventos consecutivos por entregar.

Registe o URL HTTPS final. O Web3alert não segue redirecionamentos.

Se o serviço de envio de webhooks do Web3alert estiver indisponível quando chegar a altura de uma nova tentativa, o Web3alert aguarda e volta a tentar sem avançar o número da tentativa. Se o serviço estiver indisponível na primeira tentativa, o Web3alert agenda a tentativa 2 com o motivo `webhook service unavailable` e o código `channel.webhook.retry_scheduled`. Se o serviço de envio exceder o tempo limite, a tentativa conta como uma falha que permite nova tentativa, com o motivo `webhook service timed out`, e é repetida de acordo com o calendário.

| Após a tentativa falhada | Espera mínima até à tentativa seguinte |
| --- | --- |
| 1 | 5 segundos |
| 2 | 1 minuto |
| 3 | 10 minutos |
| 4 | 1 hora |
| 5 | 6 horas |

Cada entrega tem no máximo seis tentativas. Com estes intervalos, seis tentativas decorrem ao longo de cerca de 7 horas e 11 minutos, mais o tempo de entrega. As novas tentativas mantêm o mesmo corpo e `webhook-id`. Cada tentativa usa o URL em vigor e um novo `webhook-timestamp`, e o Web3alert assina-a com o segredo em vigor, se estiver configurado. A entrega é feita pelo menos uma vez, pelo que deve usar `webhook-id` para evitar processar o mesmo evento novamente. As novas tentativas não contam para o limite de frequência de notificações da subscrição.

Se suspender ou remover a subscrição, as novas tentativas param em cerca de 10 segundos. Uma tentativa prevista para esse intervalo ainda pode ser enviada. As novas tentativas também param se retirar o webhook da subscrição ou remover o recurso webhook. Se a fila de novas tentativas não puder aceitar a entrega (por estar cheia ou por a entrega em fila, incluindo os dados do evento, exceder 256 KB), a entrega falhada não é repetida e conta como não entregue.

Uma nova tentativa fica na fila durante, no máximo, 8 horas. Se o serviço de envio do Web3alert continuar indisponível para lá desse limite, a tentativa expira sem uma entrada final no registo de entregas.

## Bloqueio

Uma resposta HTTP `410 Gone` em qualquer tentativa bloqueia a subscrição imediatamente. Cinco eventos consecutivos por entregar para a mesma subscrição e o mesmo recurso webhook também bloqueiam a subscrição. Um evento conta como não entregue se esgotar as tentativas, se não puder entrar na fila de novas tentativas ou se for rejeitado. URLs inválidos, segredos de assinatura malformados e estados HTTP diferentes de `2xx`, `410`, `429` e `5xx` levam à rejeição. A contagem exclui entregas a aguardar uma nova tentativa. Uma entrega bem-sucedida repõe a contagem para essa subscrição e esse webhook. Um bloqueio também repõe a zero a contagem dessa subscrição e desse webhook, pelo que a contagem recomeça quando retomar a subscrição. A contagem expira após 30 dias sem um novo evento não entregue.

Para retomar as entregas, defina o estado da subscrição como `on` na aplicação, com `PUT /api/subscriptions/:id/state` ou com a ferramenta MCP `set_subscription_state`.

## Registo de entregas

O histórico de entregas é guardado nos planos pagos. As [rotas de histórico de subscrições](api-subscriptions.md) e a ferramenta MCP `get_delivery_log` mostram estes campos nas entradas dos canais webhook.

| Campo | Significado |
| --- | --- |
| `eventId` | O `webhook-id` da entrega. |
| `attempt` | Número da tentativa, a começar em `1`. |
| `nextAttemptAt` | Data e hora em formato ISO para as quais estava agendada a próxima tentativa quando esta entrada foi registada. Se a entrada não registar uma nova tentativa agendada, o histórico REST omite o campo e a ferramenta MCP `get_delivery_log` devolve `null`. |

O valor mantém-se fixo mesmo depois de a tentativa ocorrer ou ser cancelada. Para saber o resultado da entrega, procure uma entrada posterior com o mesmo `eventId`. Se as novas tentativas pararem porque a subscrição foi pausada ou removida, ou se uma tentativa expirar, o Web3alert não escreve uma entrada final e, sem essa entrada, ficam por determinar o resultado da entrega e o estado atual das tentativas.

| `reasonCode` | Significado |
| --- | --- |
| `channel.webhook.retry_scheduled` | A primeira tentativa falhou e foi agendada uma nova tentativa. |
| `channel.webhook.rejected` | A entrega do webhook foi rejeitada. |
| `channel.webhook.gone` | O endpoint devolveu HTTP `410`. |
| `channel.webhook.retries_exhausted` | A sexta tentativa falhou com um erro que permitiria uma nova tentativa. |
| `channel.webhook.retry_queue_full` | A fila de novas tentativas não pôde aceitar a entrega por estar cheia ou porque a entrega em fila, incluindo os dados do evento, excedia 256 KB. A entrega não é repetida e conta como não entregue. |

O estado da primeira entrada reflete todos os canais de entrega do evento. Se outro canal entregou o evento e o webhook falhou com um erro que permita nova tentativa, a entrada do evento tem o estado `delivered` e o canal webhook tem `ok: false`. O campo `reasonCode` do canal webhook da entrada do evento indica `channel.webhook.retry_scheduled` quando é agendada uma nova tentativa, ou `channel.webhook.retry_queue_full` quando a fila de novas tentativas não pode aceitar a entrega (por estar cheia ou por a entrega em fila, incluindo os dados do evento, exceder 256 KB).

Quando o Web3alert regista o resultado final de uma entrega com novas tentativas, usa uma entrada separada com o mesmo `eventId` e apenas o canal webhook. O estado da entrada é `delivered` se for entregue, `failed` se for rejeitada ou esgotar as tentativas, ou `blocked` se receber HTTP `410`. As falhas intermédias seguidas de outra tentativa não geram uma entrada no registo.

Se a fila de novas tentativas não puder aceitar a entrega após uma tentativa posterior, a entrada final tem o estado `failed` e indica `channel.webhook.retry_queue_full` no canal webhook.

Uma falha do sistema depois de o resultado final ser registado pode criar outra entrada final para a mesma entrega. A entrega é feita pelo menos uma vez, pelo que deve agrupar as entradas por `eventId`.
