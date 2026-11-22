# Para agentes

Encuentra en el catálogo de Web3alert eventos on-chain decodificados de redes EVM y Substrate, como Ethereum, Polkadot y Kusama. Tu agente puede usar las [14 herramientas MCP](mcp-server.md#endpoint-para-agentes) para buscar un disparador, suscribirse y recibir los eventos coincidentes como JSON.

La bandeja de entrada usa el plan del primer propietario en la lista de acceso del espacio de trabajo o tu plan si no hay propietario. Con el rol `owner` o `admin` del espacio, puedes usar la bandeja si el propietario tiene Advanced o Pro, aunque tu cuenta sea Free. Si el plan aplicable es Free, usa un webhook HTTPS público.

## 1. Obtén una clave de agente

### Crea una clave en la aplicación

Inicia sesión en [Web3alert](https://web3alert.io), selecciona un espacio de trabajo al que pertenezcas y crea una clave en la [página Agents](https://web3alert.io/agents). La clave actúa con tu rol en ese espacio y con los permisos que le concedas. Copia el secreto cuando aparezca. Solo se muestra una vez.

Todas las claves incluyen `read`. Añade `manage` para registrar webhooks, crear suscripciones o solicitar una cotización de recarga. Añade `spend` para comprar planes con el saldo en EUR. Puedes establecer un [límite mensual de gasto](limits.md#agent-payments) y un vencimiento de 30, 90 o 365 días. Ambos son opcionales.

Los tokens de sesión existentes funcionan hasta que el servidor los revoca. Usa claves de agente para las conexiones nuevas.

### Regístrate con una cartera de Ethereum

Un agente con una cuenta de propiedad externa (EOA) de Ethereum puede crear su propia cuenta Free. Solicita primero un nonce de un solo uso. Las dos solicitudes SIWE son públicas.

```http
POST /api/agent/siwe/nonce
Host: web3alert.io
```

```json
{
  "nonce": "exampleNonce123456",
  "issuedAt": "<ISO-8601 timestamp>",
  "expiresAt": "<ISO-8601 timestamp>"
}
```

Construye el mensaje EIP-4361 con el nonce y el `issuedAt` recibidos, sustituye la dirección y firma el mensaje exacto con tu cartera. El nonce dura 10 minutos. El servidor comprueba que `issuedAt` esté dentro de los 5 minutos de su reloj.

```http
POST /api/agent/siwe/verify
Host: web3alert.io
Content-Type: application/json

{
  "message": "web3alert.io wants you to sign in with your Ethereum account:\n<your Ethereum address>\n\n\nURI: https://web3alert.io\nVersion: 1\nChain ID: 1\nNonce: <nonce>\nIssued At: <issuedAt>",
  "signature": "<wallet signature>"
}
```

Ejemplo de respuesta `200` con el objeto `key` abreviado.

```json
{
  "account": { "id": "<account-id>", "created": true },
  "key": { "id": "<key-id>", "scopes": ["read", "manage", "spend"] },
  "secret": "w3a_<key-secret>",
  "claimUrl": "https://web3alert.io/claim/<claim-token>"
}
```

Cada inicio de sesión correcto emite una clave nueva para el espacio inicial con los tres permisos, sin límite ni vencimiento. Usa `secret` como credencial Bearer. La verificación devuelve un enlace de reclamación al crear la cuenta o si no hay un enlace activo. Si ya hay uno, `claimUrl` vale `null`. Cuando una persona reclama la cuenta con Telegram o Google, el inicio de sesión con cartera devuelve `403 account_claimed`. Pídele una clave de agente.

Comparte el enlace de reclamación en privado con la persona que se hará cargo de la cuenta. La página muestra la cartera, la fecha de creación de la cuenta y el vencimiento del enlace, y ofrece iniciar sesión con Telegram o Google. Después, la página Agents permite ver y controlar las claves y consultar el plan, el saldo y el gasto. Si el acceso ya pertenece a otra cuenta de Web3alert, usa uno distinto. El enlace más reciente dura siete días. Puedes sustituirlo con el endpoint [`POST /api/agent/claim-link`](api-account.md#post-api-agent-claim-link). Si Telegram abre su navegador integrado en el teléfono, la persona puede completar la reclamación allí. Tras iniciar sesión, llega a la página Agents en ese mismo navegador.

Reclamar la cuenta deja activas las claves emitidas previamente mediante la cartera. Después de iniciar sesión, revisa las claves en la [página Agents](https://web3alert.io/agents) y revoca las que no quieras conservar.

Los endpoints de nonce y verificación comparten un límite por IP en el perímetro de 1 solicitud por segundo, con una ráfaga de 10. Respeta `Retry-After` al recibir un `429`. El rechazo en el perímetro ocurre antes de la verificación y no incluye un cuerpo `signup_limited`. Pide un nonce nuevo si el mensaje firmado ha quedado desactualizado. Si la API devuelve `429 signup_limited`, el nonce ya se usó. Después de esperar, pide otro y firma de nuevo.

## 2. Conecta tu cliente MCP

Usa Streamable HTTP en `https://web3alert.io/mcp/agent`. Puedes descubrir las herramientas sin un token. Envía `Authorization: Bearer <agent-key>` al llamar a una herramienta.

### Claude Code

Asigna tu clave de agente a `WEB3ALERT_KEY` en la terminal y ejecuta este comando.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop y Cursor

Añade la entrada en `mcpServers` en el archivo `claude_desktop_config.json` de Claude Desktop (Settings → Developer → Edit Config) o en tu archivo personal `~/.cursor/mcp.json` de Cursor. El ejemplo usa el puente `mcp-remote` mediante `npx`. Sustituye el valor de ejemplo de la clave.

```json
{
  "mcpServers": {
    "web3alert-agent": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp/agent",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_AGENT_KEY"
      }
    }
  }
}
```

### VS Code

Para una conexión gestionada por el editor, añade la entrada en `servers` en `.vscode/mcp.json` y haz que `WEB3ALERT_KEY` esté disponible en el entorno del proceso de VS Code.

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_KEY}"
      }
    }
  }
}
```

## 3. Recarga el saldo y compra un plan

Antes de pagar, comprueba que la clave tenga `spend` y consulta el plan actual de tu cuenta con [GET /api/billing/overview](api-billing.md#get-api-billing-overview). Confirma en la aplicación o con el titular de la cuenta que ningún plan superior activo, checkout pendiente ni plan activo con renovación automática bloquee la compra prevista. Para configurar o leer la bandeja de entrada, comprueba que tengas el rol `owner` o `admin`. Para habilitar la bandeja se usa el plan de la primera cuenta con el rol `owner` en la lista de acceso del espacio. Comprar un plan con otra cuenta no habilita la bandeja de ese propietario.

1. Llama a `get_account({})` antes de firmar. Comprueba el saldo en EUR y verifica que el límite mensual restante de la clave, si existe, cubra la compra. Una cuenta nueva empieza con 0 € y un mes de Advanced cuesta 15 €. Para este ejemplo sin saldo, llama a `get_topup_requirements({"amountEur":15})` con `manage`. Las recargas van de 5 a 500 €. Web3alert usa el tipo de referencia del BCE para USD, valora 1 USDC en 1 USD y no aplica recargo.
2. Usa un cliente HTTP sin automatización de pagos para enviar por HTTPS el mismo cuerpo sin firma de pago a `https://web3alert.io/api/billing/wallet/x402-topup` y obtener una cotización nueva. Envía `Authorization: Bearer <agent-key>` y `Content-Type: application/json` en ambos POST. Incluye `PAYMENT-SIGNATURE` solo en el segundo POST. Antes de firmar, comprueba que la URL de pago sea exactamente esa, que la red sea Base (`eip155:8453`), que el activo sea USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) y que el `payTo` del pago coincida con la dirección de la cotización nueva. Comprueba el importe esperado en USDC. Los importes son cadenas en unidades atómicas de seis decimales, de modo que `"1000000"` equivale a 1 USDC. Si falla alguna comprobación, detente.

   Firma explícitamente la cotización verificada con `@x402/core`, el esquema `@x402/evm` y tu cartera. Configura el límite del cliente para permitir el importe cotizado en USDC. En `@x402/core` 2.30.0, el límite predeterminado para USDC es de 1 USD por pago. Para una cotización de hasta 20 USDC, usa `x402Client.fromConfig({ schemes: [], spendControls: { maxAmountPerPayment: 20 } })` antes de registrar el esquema EVM. El pagador no necesita ETH para el gas porque el agente firma una autorización EIP-3009 y el facilitador envía la transferencia y paga el gas. Guarda el valor codificado de `PAYMENT-SIGNATURE` para los reintentos. Con el cliente HTTP sin automatización de pagos, envía por `POST` el cuerpo cotizado con la credencial Bearer y esa cabecera solo a la URL HTTPS verificada. Desactiva las redirecciones del `POST` firmado.

   En este endpoint, un wrapper automático como `@x402/fetch` firma una nueva autorización en cada llamada. Repetir una llamada del wrapper tras un timeout autoriza otro pago, que se abona como una recarga aparte si se liquida. Reintenta enviando la firma guardada.
3. Considera sin resolver el `POST` firmado si recibes `202` o `5xx`, o se agota el tiempo de espera. Aumenta la espera entre reintentos. Reintenta un número limitado de veces con el mismo cuerpo y firma en el mismo espacio, incluso tras caducar la cotización. Si un reintento devuelve una nueva cotización `402` con `PAYMENT-REQUIRED` y sin `PAYMENT-RESPONSE`, el resultado del primer pago sigue sin confirmarse. Detén los reintentos y deja la nueva cotización sin firmar. Si se rechaza el pago, el valor decodificado de `PAYMENT-RESPONSE` contiene `success: false`. Si sigue sin resolverse, detente y guarda los identificadores disponibles, como `topupId`, para que el operador concilie el pago. No firmes otro pago para el mismo fin mientras siga sin resolverse. Espera a que la [recarga](api-billing.md#post-api-billing-wallet-x402-topup) se liquide y se abone antes de comprar.
4. Genera un `requestId` nuevo para esta compra, como un UUID, y sustituye `<new-uuid>` en `buy_plan({"planId":"advanced","durationMonths":1,"requestId":"<new-uuid>"})`. Usa `spend` y comprueba que el saldo en EUR sea suficiente. Puedes comprar Advanced o Pro por 1, 3, 6 o 12 meses sin renovación automática. Reutiliza el mismo ID y parámetros solo al reintentar esta compra. Un plan activo con renovación automática devuelve `key_not_allowed`. Un checkout pendiente o un plan superior activo pueden bloquear la compra con `api_error` y el mensaje de la API. Pide al titular que resuelva primero el plan o el checkout existente. La respuesta de `buy_plan` devuelve de inmediato el `tier` comprado. MCP guarda en caché la respuesta de `/me` de la cuenta, así que `get_account` puede mostrar el plan anterior durante un máximo de 30 segundos.

## 4. Crea tu primera suscripción

Elige un webhook HTTPS público o, en Advanced y Pro, la bandeja de entrada del espacio de trabajo. Para añadir un webhook, crear una suscripción o consultar la bandeja o el historial de entregas, necesitas el rol `owner` o `admin`.

Asigna un `title` único a cada intención de `create_subscription`. Si pierdes la respuesta, llama a `list_subscriptions` y busca por ese título. Si no hay coincidencias, espera y vuelve a consultar, porque la llamada original aún puede crear la suscripción. Si el título no basta, revisa las reglas y acciones que devuelve [GET /api/subscriptions](api-subscriptions.md#get-api-subscriptions). Si el resultado sigue sin confirmarse, detente y aclara qué ocurrió antes de volver a crearla.

### Entrega por webhook

En esta sesión de ejemplo, sustituye los valores entre ángulos por los resultados de las llamadas anteriores. Cambia la URL de ejemplo por una URL HTTPS de un webhook que controles y que no incluya nombre de usuario ni contraseña. Elige un disparador de eventos y proporciona los `inputs` obligatorios que indique `get_trigger`. El ejemplo supone que el disparador no requiere ninguno.

1. `get_account({})` → Tu cuenta, plan, espacio de trabajo actual, saldo de la wallet en EUR, límites del plan y recuentos de suscripciones si están disponibles.
2. `find_triggers({"kind":"event","limit":5})` → Disparadores coincidentes del catálogo publicado y de tu espacio de trabajo, con el `fullname` de cada uno.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → Entradas de ejecución del disparador, campos del evento y campos disponibles para filtrar.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → `fullname`, nombre y URL del webhook registrado. El secreto de firma solo aparece en la respuesta de `add_webhook` como `signingSecret`. Si lo rotas más adelante, se sustituye para todos los receptores de ese endpoint. Guarda el secreto para tu receptor.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","title":"<unique-title>","state":"on"})` → ID, título, estado resultante, disparador y webhook de la suscripción.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Resultados de entrega y `nextCursor` si hay más resultados. El historial de alertas usa el plan de la primera cuenta con rol de propietario en la lista de acceso del espacio de trabajo. Si no existe esa cuenta, la API comprueba el plan de la cuenta que hace la solicitud. Si ese plan no incluye el historial, la herramienta devuelve `not_in_plan`.

   Si el cursor no puede avanzar porque 500 o más entregas comparten la misma marca de tiempo, la herramienta devuelve `api_error`. Restringe el filtro, por ejemplo por estado, y empieza de nuevo sin el cursor.

Comprueba que el `state` devuelto para la suscripción sea `on`. A partir de ese momento pueden llegar eventos coincidentes. Usa un nombre de webhook nuevo o busca uno registrado con `list_webhooks`.

### Cuerpo del webhook

Tu webhook recibe un cuerpo JSON con un ID de evento. Los webhooks nuevos reciben entregas firmadas y Web3alert reintenta automáticamente los fallos que admiten reintentos. Consulta [Webhooks](webhooks.md) para ver el formato del cuerpo, verificar firmas, gestionar reintentos y evitar duplicados.

### Entrega en la bandeja de entrada

Localiza el trigger, consulta sus entradas con `get_trigger` y llama a `create_subscription({"trigger":"<trigger-fullname>","inbox":true,"title":"<unique-title>","state":"on"})`. Incluye los `inputs` obligatorios. La herramienta acepta un destino por llamada y crea o reutiliza la bandeja del espacio de trabajo. Con `inbox: true`, `resource_name_in_use` indica que otro recurso ya usa el nombre de la bandeja. Pide a un `owner` o `admin` del espacio que resuelva el conflicto.

Llama a `read_events({})` para empezar por el evento conservado más antiguo. Sigue leyendo mientras `hasMore` sea verdadero y usa `nextCursor` como `after` cuando contenga un valor, en el mismo espacio. `gap: true` indica que faltan eventos previamente guardados antes del primer resultado tras el cursor o entre resultados de la misma página. Una página vacía también puede indicar un hueco si ya no se conservan eventos posteriores al cursor. Usa `get_delivery_log` para ver los eventos no entregados cuando haya historial de entregas. Usa el `id` para deduplicar. Un evento de la bandeja con un cuerpo de más de 64 KiB llega con `body.truncated: true` y sin `body.object`. Comprueba ese indicador antes de procesarlo.

El plan del propietario del espacio determina si se guardan los eventos y cuánto tiempo se conservan. Si no hay propietario, se usa el plan de quien creó la suscripción. Advanced conserva hasta **7 días o 25.000 eventos** y Pro hasta **30 días o 100.000 eventos**. Los planes sin historial de alertas no guardan eventos. La creación y la lectura de la bandeja usan el plan del propietario del espacio, o el del solicitante si no hay propietario, y devuelven `not_in_plan` si ese plan no incluye historial.

Sin historial de alertas en el plan aplicable, la API rechaza las escrituras de la bandeja. Esos eventos no aparecen en `read_events` ni en el historial de entregas. Cinco eventos consecutivos sin entregar a la bandeja bloquean la suscripción. Restaura el plan de pago del propietario del espacio o, si no hay propietario, el de quien creó la suscripción para reanudar las entregas. Comprueba el estado con `list_subscriptions` y usa `set_subscription_state` con `state: "on"` para las suscripciones bloqueadas. Confirma que devuelve `on`. Solo se reanuda la entrega de eventos futuros.

## 5. Crea un trigger

En Advanced o Pro, conecta el cliente a `https://web3alert.io/mcp/agent/build` con la misma cabecera Bearer. El servidor genera el trigger a partir de un ABI de EVM, un IDL de Solana o metadatos de Substrate, sin que tengas que escribir código.

1. Usa `find_contract` con una cadena de la plataforma y la dirección del contrato, el programa de Solana o el pallet de Substrate. En `chain`, usa un nombre corto como `ethereum`, `base`, `arbitrum-one`, `polkadot` o `solana`, o usa `common.<chain>` o `common.source.<chain>`. Si la cadena es desconocida, busca los nombres disponibles después de `Supported:` en el error.

   Para EVM, `recentBlocks` indica cuántos bloques recientes abarca el `recentCount` de cada evento, hasta 1.000. El intervalo puede ser menor si el proveedor rechaza una consulta amplia. El valor `null` indica que no se pudo leer ningún bloque.
2. Envía la misma cadena y el mismo destino, junto con la firma exacta del evento, a `plan_trigger`. Guarda el `draftId`. El borrador caduca a los siete días.
3. Ejecuta `test_trigger` con el borrador. Deja que el servidor busque una muestra reciente o indica un bloque o slot. Continúa cuando el último resultado sea `matched`.

   La búsqueda en EVM abarca como máximo los últimos 1.000 bloques. La búsqueda en Solana prueba hasta 12 slots recientes y en Substrate hasta 12 bloques recientes. Si una búsqueda de EVM lee al menos un intervalo de logs sin coincidencias, un error devuelto por el proveedor, incluido un tiempo de espera agotado en el proveedor, o un rechazo genérico del runtime en intervalos anteriores pueden terminar la búsqueda con `no_match`. El resultado solo abarca los intervalos leídos. Los fallos de transporte, agotar el plazo de la búsqueda y no poder leer ningún intervalo devuelven `retryable`.

   Si sabes dónde ocurrió el evento o quieres omitir la búsqueda, pasa a `test_trigger` su `slot` para Solana o su `block` para EVM o Substrate. Para un evento de EVM anterior a ese intervalo, indica su `block` directamente.

   Si la API aplica el límite de pruebas del espacio y devuelve HTTP `429` con `error.code: "retryable"`, MCP devuelve un error de la herramienta. Aumenta la espera antes de reintentar. Una respuesta exitosa de la herramienta puede contener `result: "retryable"`.

4. Ejecuta `activate_trigger` con el `draftId` y un `requestId` propio. Reutiliza este último en los reintentos. El trigger se guarda en el proyecto privado del agente del espacio de trabajo. El rol `developer` del espacio permite crear y activar el trigger. Solo un `owner` o `admin` puede usar el fullname devuelto con `create_subscription`. Si otro miembro creó el proyecto del agente en el espacio, la activación usa el plan de su creador para comprobar las unidades de triggers. Devuelve `plan_required` si ese plan ya no permite gestionar triggers.

`find_contract` y `test_trigger` usan `read`. La planificación y la activación usan `manage`. Consulta la [referencia de herramientas de creación](mcp-server.md#build-endpoint).

## Límites

El plan Free limita la cuenta a **5 suscripciones activas que haya creado a proyectos que no sean Free**, sumadas entre todos los espacios de trabajo. Las suscripciones a proyectos Free quedan fuera del límite.

En Free, una suscripción que solo entrega a webhooks integrados admite por defecto una ráfaga de 12 alertas, una tasa sostenida de 1 alerta por segundo y un límite de cola de 15. Estas suscripciones no consumen la cuota de entrega del espacio de trabajo.

En Free, todas las claves de agente de una cuenta comparten un límite de 60 solicitudes por minuto a la API externa. Las pruebas de suscripción y el historial de alertas están disponibles en Advanced y Pro. Para ambos, la API comprueba el plan del primer propietario del espacio de trabajo y aplica la alternativa descrita en el paso 6. Consulta las tablas completas en [Límites](limits.md).

El servidor MCP permite por defecto 120 llamadas a herramientas por cuenta y por minuto. Los tres endpoints comparten este límite en cada proceso del servidor. `get_account` devuelve el plan de la cuenta y los mismos [límites del plan](api-account.md#me-limits) que `GET /api/me`. El valor de `limits` en la herramienta es `null` si la API no proporciona los límites del plan.

## Referencias legibles por máquinas

- [llms.txt](https://web3alert.io/llms.txt) con los datos de conexión y enlaces a la documentación.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) para la API HTTP de agentes.
