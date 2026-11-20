# Para agentes

Encuentra eventos on-chain decodificados de EVM, Substrate, Solana y HyperCore en el catálogo de Web3alert. Tu agente puede usar las [10 herramientas MCP](mcp-server.md#endpoint-para-agentes) para buscar un disparador, suscribirse y recibir los eventos coincidentes como JSON en su webhook.

## Próximamente

- Webhooks firmados con reintentos automáticos.
- Inicio de sesión con wallet para que los agentes puedan abrir sus propias cuentas.
- Recargas en USDC mediante x402.
- Una bandeja de entrada para recuperar los eventos perdidos.

## 1. Obtén un token

Una persona inicia sesión en [Web3alert](https://web3alert.io) y copia el token de acceso personal de los [parámetros de la cuenta](account.md#personal-access-token). Los agentes aún no pueden crear sus propias cuentas. Selecciona en la aplicación el espacio de trabajo que vas a usar.

## 2. Conecta tu cliente MCP

Usa Streamable HTTP en `https://web3alert.io/mcp/agent` y envía `Authorization: Bearer <token>` en cada solicitud.

### Claude Code

Asigna tu token a `WEB3ALERT_TOKEN` en la terminal y ejecuta este comando.

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer $WEB3ALERT_TOKEN"
```

### Claude Desktop y Cursor

Añade la entrada en `mcpServers` en el archivo `claude_desktop_config.json` de Claude Desktop (Settings → Developer → Edit Config) o en tu archivo personal `~/.cursor/mcp.json` de Cursor. El ejemplo usa el puente `mcp-remote` mediante `npx`. Sustituye el valor de ejemplo del token.

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
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### VS Code

Para una conexión gestionada por el editor, añade la entrada en `servers` en `.vscode/mcp.json` y haz que `WEB3ALERT_TOKEN` esté disponible en el entorno del proceso de VS Code.

```json
{
  "servers": {
    "web3alert-agent": {
      "type": "http",
      "url": "https://web3alert.io/mcp/agent",
      "headers": {
        "Authorization": "Bearer ${env:WEB3ALERT_TOKEN}"
      }
    }
  }
}
```

## 3. Crea tu primera suscripción

En esta sesión de ejemplo, sustituye los valores entre ángulos por los resultados de las llamadas anteriores. Cambia la URL de ejemplo por una URL HTTPS de un webhook que controles y que no incluya nombre de usuario ni contraseña. Elige un disparador de eventos y proporciona los `inputs` obligatorios que indique `get_trigger`. El ejemplo supone que el disparador no requiere ninguno.

1. `get_account({})` → Tu cuenta, plan, espacio de trabajo actual, saldo de la wallet en EUR, límites del plan y recuentos de suscripciones si están disponibles.
2. `find_triggers({"kind":"event","limit":5})` → Disparadores coincidentes del catálogo publicado y de tu espacio de trabajo, con el `fullname` de cada uno.
3. `get_trigger({"trigger":"<trigger-fullname>"})` → Entradas de ejecución del disparador, campos del evento y campos disponibles para filtrar.
4. `add_webhook({"name":"agent-events","url":"https://example.com/webhooks/web3alert"})` → `fullname`, nombre y URL del webhook registrado.
5. `create_subscription({"trigger":"<trigger-fullname>","webhook":"<webhook-fullname>","state":"on"})` → ID, título, estado resultante, disparador y webhook de la suscripción.
6. `get_delivery_log({"subscriptionId":"<subscription-id>"})` → Resultados de entrega y `nextCursor` si hay más resultados. El historial de alertas usa el plan de la primera cuenta con rol de propietario en la lista de acceso del espacio de trabajo. Si no existe esa cuenta, la API comprueba el plan de la cuenta que hace la solicitud. Si ese plan no incluye el historial, la herramienta devuelve `not_in_plan`.

Comprueba que el `state` devuelto para la suscripción sea `on`. A partir de ese momento pueden llegar eventos coincidentes. Usa un nombre de webhook nuevo o busca uno registrado con `list_webhooks`.

## Cuerpo del webhook

Web3alert envía una solicitud HTTP POST con el siguiente cuerpo JSON. `header` contiene el título o nombre del proyecto, `message` contiene el texto largo o corto de la alerta y `object` contiene los datos del evento o un objeto vacío. `icon`, `cover` y `links` aparecen cuando se proporcionan.

```json
{
  "header": "Example project",
  "icon": "https://example.com/icon.png",
  "cover": "https://example.com/cover.png",
  "message": "Example alert",
  "links": [{ "text": "View event", "url": "https://example.com/event" }],
  "object": {}
}
```

Las firmas de webhook y los reintentos automáticos estarán disponibles próximamente.

## Límites

Las cuentas Free pueden mantener hasta **5 suscripciones activas a proyectos que no sean Free**. Las suscripciones a proyectos Free quedan fuera de ese límite. Free admite ráfagas de 3 alertas, una tasa sostenida de 0,25 alertas por segundo y una cola de hasta 15 alertas por suscripción. Por espacio de trabajo, admite ráfagas de 10 alertas y una tasa sostenida de 1 por segundo. Free permite 60 solicitudes por minuto a la API externa y carece de ejecuciones de prueba e historial de alertas. Consulta las tablas completas en [Límites](limits.md).

El servidor MCP permite por defecto 120 llamadas a herramientas por cuenta y por minuto. Ambos endpoints comparten este límite en cada proceso del servidor. `get_account` devuelve el plan de la cuenta y los mismos [límites del plan](api-account.md#me-limits) que `GET /api/me`. El valor de `limits` en la herramienta es `null` si la API no proporciona los límites del plan.

## Referencias legibles por máquinas

- [llms.txt](https://web3alert.io/llms.txt) con los datos de conexión y enlaces a la documentación.
- [OpenAPI JSON](https://web3alert.io/api/openapi.json) para la API HTTP de agentes.
