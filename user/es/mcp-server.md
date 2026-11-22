# MCP Server

Web3alert ofrece tres rutas con Streamable HTTP.

| Ruta | Herramientas | Autenticación |
| --- | --- | --- |
| `/mcp/agent` | [14 herramientas](#endpoint-para-agentes) para cuenta, facturación, suscripciones y entrega | Descubrimiento público. Clave Bearer para las llamadas. |
| `/mcp/agent/build` | 19 herramientas, incluidas las 14 de agentes y [5 de creación](#build-endpoint) | Descubrimiento público. Clave Bearer para las llamadas. Las herramientas de creación requieren Advanced o Pro. |
| `/mcp` | [Conjunto completo de herramientas de creación y edición](#remote-mcp-endpoint) | Clave Bearer en cada solicitud. |

La entrada `io.web3alert/agent` del MCP Registry marca la cabecera `Authorization` como opcional. Consulta el [repositorio público de MCP](https://github.com/web3alert/mcp) para más detalles sobre el servidor.

## Autenticación

Las dos rutas de agentes aceptan mensajes individuales `initialize`, `ping`, `tools/list` y notificaciones sin token. Las llamadas a herramientas y los lotes requieren `Authorization: Bearer <agent-key>`. Cada lote admite hasta 20 mensajes. La ruta de creación y edición también requiere la cabecera para el descubrimiento. Las tres rutas verifican la credencial recibida y responden con HTTP `401` si no es válida.

Crea una clave en la [página Agents](https://web3alert.io/agents) o [regístrate con una cartera](agents.md). La clave actúa en nombre de la cuenta en el espacio de trabajo al que está vinculada. Las operaciones dependen de sus permisos, el plan aplicable y los permisos de la cuenta en ese espacio.

Tras la revocación, la API rechaza el token de inmediato. Mientras MCP conserve la verificación en caché, una llamada de una herramienta para agentes que llegue a la API devuelve `access_denied`. Las solicitudes `initialize` y `tools/list` que envíen el token revocado pueden seguir funcionando durante un máximo de 30 segundos gracias a la verificación en caché. Cuando MCP vuelve a comprobar el token revocado, devuelve HTTP `401`.

| Estado HTTP | Qué hacer |
| --- | --- |
| `401` | Falta un Bearer token obligatorio o el token enviado es inválido, desconocido o revocado. Envía el header con un token válido. Obtén uno nuevo si no tienes token o el servidor ya no lo reconoce. |
| `403` | El servidor rechazó el origen del cliente (`forbidden_origin`) o el account no superó la comprobación de acceso a MCP (`mcp_access_denied`). Revisa el header `Origin` del cliente o los datos del account, según el error. |
| `429` | La API limitó la verificación del token. Espera el tiempo indicado en `Retry-After` antes de volver a intentarlo. |
| `503` | La verificación del token no está disponible temporalmente. Espera el tiempo indicado en `Retry-After` y vuelve a intentarlo con el mismo token. |

Por defecto, cada proceso permite 120 llamadas a herramientas por minuto y por cuenta, compartidas entre los tres endpoints y todas las credenciales de la cuenta. Al agotar el límite, la herramienta devuelve `rate_limited` con `retryAfter` en segundos.

Los errores de las herramientas son independientes de los errores de autenticación HTTP.

| Error | Significado |
| --- | --- |
| `insufficient_scope` | La clave carece de un permiso obligatorio. |
| `key_not_allowed` | La operación requiere una sesión de la cuenta. |
| `spend_cap_exceeded` | La compra superaría el límite mensual en EUR de la clave. |
| `not_in_plan` | El plan del espacio de trabajo no incluye la bandeja de entrada o el historial de entregas. |
| `plan_required` | La operación de creación requiere una cuenta Advanced o Pro. |

## Actualizar clientes existentes

Envía la clave en la cabecera `Authorization: Bearer <agent-key>`. `/mcp` exige esta cabecera en cada solicitud y funciona sin sesiones de MCP. Retira la credencial de la URL o del cuerpo de la solicitud.

Los tokens de sesión existentes funcionan hasta que su titular cierra la sesión o los revoca.

En Claude Code, ejecuta estos comandos desde el proyecto en el que usas Web3alert.

1. Ejecuta `claude mcp list` para comprobar si aparece el nombre que vas a sustituir. Para ver el ámbito de la entrada que aparece, ejecuta `claude mcp get web3alert` o `claude mcp get web3alert-agent`.
2. Elimina la entrada indicando su ámbito, por ejemplo con `claude mcp remove --scope user web3alert` o `claude mcp remove --scope local web3alert`. Al eliminarla, puede aparecer otra entrada con el mismo nombre en otro ámbito. Repite los pasos 1 y 2 hasta que el nombre deje de aparecer.
3. Ejecuta el ejemplo de `claude mcp add` de tu endpoint para añadir la nueva entrada.

En Claude Desktop, Cursor y VS Code, edita la URL y las cabeceras de la entrada existente. Consulta los [ejemplos de configuración del endpoint remoto](#remote-mcp-endpoint).

## Endpoint para agentes

Las herramientas actúan en el espacio de trabajo al que está vinculada la clave. Crea una clave en otro espacio para operar allí.

| Herramienta | Qué hace |
| --- | --- |
| `get_account` | Devuelve ID, nombre, plan, saldo en EUR, límites del plan y recuentos de suscripciones si están disponibles, además de los permisos, el vencimiento, el límite y el gasto mensual de la clave. |
| `get_topup_requirements` | Cotiza una recarga de 5 a 500 € en USDC. Paga con un cliente x402 y tu cartera. Requiere `manage`. |
| `buy_plan` | Compra Advanced o Pro con el saldo en EUR, sin renovación automática. Reutiliza `requestId` en los reintentos. Requiere `spend`. |
| `find_triggers` | Busca disparadores de redes EVM y Substrate en el catálogo público. También busca en los disparadores del espacio de trabajo actual. |
| `get_trigger` | Muestra los inputs de ejecución del trigger, los campos de los eventos entregados y los campos que puedes usar en `conditions`. |
| `list_webhooks` | Muestra el `fullname`, el nombre y la URL de cada webhook registrado en el workspace. El campo `signed` indica si el webhook tiene un secreto de firma. |
| `add_webhook` | Registra un webhook con una URL HTTPS sin credenciales. Si al comprobar el nombre ya existe un recurso con ese nombre en el espacio de trabajo, la herramienta rechaza la solicitud con `webhook_exists`. El secreto de firma solo aparece en la respuesta de `add_webhook` como `signingSecret`. Si lo rotas más adelante, se sustituye para todos los receptores de ese endpoint. |
| `remove_webhook` | Elimina un webhook por su fullname en el espacio actual. Requiere `manage`. Devuelve `webhook_in_use` si lo usa una suscripción activa del mismo espacio. |
| `create_subscription` | Crea una suscripción con un destino, `webhook` o `inbox: true`. Incluye los inputs obligatorios y las `conditions` opcionales. |
| `list_subscriptions` | Lista los IDs, títulos, estados, triggers, webhooks y fechas de creación de las subscriptions. |
| `set_subscription_state` | Pausa (`off`) o reanuda (`on`) una subscription. |
| `remove_subscription` | Elimina una suscripción. Los reintentos de webhook se detienen en unos 10 segundos. Todavía puede enviarse un intento previsto para ese intervalo. |
| `read_events` | Lee la bandeja de un espacio con plan de pago, empezando por el evento más antiguo. Pasa `nextCursor` como `after` al volver a consultar. `gap` indica pérdida por retención. Requiere `read`. |
| `get_delivery_log` | Muestra los resultados de entrega del espacio de trabajo o de una suscripción. El historial de alertas usa el plan de la primera cuenta con rol de propietario en la lista de acceso del espacio de trabajo. Si no existe esa cuenta, la API comprueba el plan de la cuenta que hace la solicitud. Si ese plan no incluye el historial, la herramienta devuelve `not_in_plan`. Los registros de canales webhook incluyen `eventId` y `attempt`. `nextAttemptAt` es la marca de tiempo ISO para la que se había programado el siguiente intento al guardar el registro, o `null` si el registro no indica un reintento programado. |

La marca de tiempo `nextAttemptAt` permanece fija aunque el reintento se ejecute o se cancele. Para conocer el resultado de la entrega, busca un registro posterior con el mismo `eventId`. Si los reintentos se detienen porque se pausa o elimina la suscripción, o si un reintento caduca, Web3alert no guarda un registro final y, sin ese registro, se desconocen tanto el resultado de la entrega como el estado actual de los reintentos.

`limits.maxSubscriptions` limita las suscripciones activas que has creado a proyectos que no sean Free, sumadas entre todos los espacios de trabajo. El límite de Free es de 5. Las suscripciones a proyectos Free quedan fuera del límite.

Al alcanzar el límite de subscriptions del tier, `create_subscription` puede devolver el error `subscription_limit_reached`. Una creación o reanudación exitosa (mediante `set_subscription_state` con `on` para reanudar) puede devolver `state: "blocked"` y `blockedReason: "subscription_limit_reached"`. Comprueba que el `state` devuelto sea `on` antes de dar por hecho que la entrega está activa.

Usa el [endpoint de creación](#build-endpoint) para crear un disparador privado a partir de un evento en cadena.

### Claude Code

```bash
printf 'Clave de agente de Web3alert: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_KEY"
```

### Claude Desktop y Cursor

En Claude Desktop, añade la entrada en `mcpServers` en `claude_desktop_config.json`. En Cursor, usa tu archivo personal `~/.cursor/mcp.json`.

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

## Endpoint de creación {#build-endpoint}

Usa `https://web3alert.io/mcp/agent/build` con la misma configuración y cabecera Bearer. La lista incluye las 14 herramientas anteriores y estas 5. Las cuentas Free pueden descubrirlas y reciben `plan_required` al llamarlas.

| Herramienta | Permiso | Función |
| --- | --- | --- |
| `find_contract` | `read` | Busca firmas exactas de eventos en el ABI de un contrato, IDL de Solana o metadatos de Substrate. Los resultados de EVM incluyen funciones y un recuento de eventos recientes cuando está disponible. |
| `plan_trigger` | `manage` | Genera un borrador para un evento sin escribir código. Devuelve `draftId`, fullname previsto, inputs, campos filtrables, esquema de salida y vencimiento. |
| `test_trigger` | `read` | Prueba un borrador con una muestra reciente o reproduce el bloque o slot indicado. |
| `activate_trigger` | `manage` | Guarda un borrador cuya última prueba coincidió en el proyecto privado del agente. Reutiliza `requestId` al reintentar. El fullname devuelto sirve para crear suscripciones. |
| `remove_my_trigger` | `manage` | Elimina un trigger de ese proyecto. Devuelve `trigger_in_use` si lo usa una suscripción activa del mismo espacio. |

La eliminación directa de un trigger o webhook comprueba las suscripciones activas (`on`) en el espacio de trabajo del trigger o webhook. Páusalas o elimínalas antes de reintentar. Al eliminar un proyecto, un espacio de trabajo o una cuenta, se bloquean las suscripciones afectadas. Una suscripción activa a un trigger público en otro espacio permite eliminar directamente el trigger.

## Remote MCP Endpoint

Usa `https://web3alert.io/mcp` para el conjunto completo de herramientas de proyectos, triggers, plantillas, suscripciones, recursos, fuentes de datos y diagnóstico. Envía `tools/list` con autenticación para ver la lista completa.

Para añadir el endpoint a Claude Code, ejecuta el comando en Bash o Zsh e introduce la clave de agente en la solicitud de entrada oculta.

```bash
printf 'Clave de agente de Web3alert: ' && read -rs WEB3ALERT_KEY && echo && [ -n "$WEB3ALERT_KEY" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_KEY"
```

Usa el mismo archivo de configuración de Claude Desktop o Cursor. Para [VS Code](#vs-code), usa el mismo ejemplo de `servers` con la URL `https://web3alert.io/mcp`.

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://web3alert.io/mcp",
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
