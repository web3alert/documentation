# MCP Server

MCP está disponible para los tiers `Free`, `Advanced` y `Pro`.

- Usa `https://web3alert.io/mcp/agent` para suscribirte a eventos on-chain decodificados y recibirlos en un webhook.
- Usa `https://web3alert.io/mcp` para acceder al conjunto completo de herramientas con las que puedes crear y editar projects, triggers, templates, subscriptions, resources y data sources del marketplace de Web3alert, y consultar datos de diagnóstico.

## Token

Para conectarse, se necesita un personal access token de [Account parameters](account.md#personal-access-token).

El token da al MCP server acceso a Web3alert API en nombre del account actual. El nivel de acciones disponibles depende del account tier y de los roles del usuario en workspace.

Envía el token en cada solicitud HTTP en el header `Authorization: Bearer <token>`. El servidor no acepta tokens en la query string ni en el cuerpo de la solicitud.

Tras la revocación, la API rechaza el token de inmediato. Mientras MCP conserve la verificación en caché, una llamada de una herramienta para agentes que llegue a la API devuelve `access_denied`. `initialize` y `tools/list` pueden seguir respondiendo durante un máximo de 30 segundos gracias a la verificación en caché. Cuando MCP vuelve a comprobar el token revocado, devuelve HTTP `401`.

| Estado HTTP | Qué hacer |
| --- | --- |
| `401` | Falta el Bearer token o es inválido, desconocido o revocado. Envía el header con un token válido. Obtén uno nuevo si no tienes token o el servidor ya no lo reconoce. |
| `403` | El servidor rechazó el origen del cliente (`forbidden_origin`) o el account no superó la comprobación de acceso a MCP (`mcp_access_denied`). Revisa el header `Origin` del cliente o los datos del account, según el error. |
| `429` | La API limitó la verificación del token. Espera el tiempo indicado en `Retry-After` antes de volver a intentarlo. |
| `503` | La verificación del token no está disponible temporalmente. Espera el tiempo indicado en `Retry-After` y vuelve a intentarlo con el mismo token. |

Por defecto, cada proceso del servidor permite 120 llamadas a herramientas por minuto y por account, compartidas entre los dos endpoints y todos los tokens del account. Al agotar este límite, la herramienta devuelve `rate_limited` con `retryAfter` en segundos.

## Endpoint para agentes

Las herramientas para agentes actúan sobre el workspace actual del account. Para que la siguiente llamada use otro workspace, selecciónalo en la aplicación de Web3alert.

| Herramienta | Qué hace |
| --- | --- |
| `get_account` | Devuelve el ID, nombre y plan de la cuenta, el saldo en EUR, los límites del plan y los recuentos de suscripciones activas y totales del espacio de trabajo actual si están disponibles. |
| `find_triggers` | Busca en el catálogo publicado y en los triggers del workspace actual. |
| `get_trigger` | Muestra los inputs de ejecución del trigger, los campos de los eventos entregados y los campos que puedes usar en `conditions`. |
| `list_webhooks` | Muestra el `fullname`, el nombre y la URL de cada webhook registrado en el workspace. |
| `add_webhook` | Registra un webhook con una URL HTTPS sin credenciales. Si al comprobar el nombre ya existe un recurso con ese nombre en el espacio de trabajo, la herramienta rechaza la solicitud con `webhook_exists`. |
| `create_subscription` | Crea una subscription a un trigger con entrega a un webhook. Proporciona los inputs requeridos y, si quieres filtrar eventos, `conditions`. |
| `list_subscriptions` | Lista los IDs, títulos, estados, triggers, webhooks y fechas de creación de las subscriptions. |
| `set_subscription_state` | Pausa (`off`) o reanuda (`on`) una subscription. |
| `remove_subscription` | Elimina una subscription y detiene la entrega. |
| `get_delivery_log` | Muestra los resultados de entrega del espacio de trabajo o de una suscripción. El historial de alertas usa el plan de la primera cuenta con rol de propietario en la lista de acceso del espacio de trabajo. Si no existe esa cuenta, la API comprueba el plan de la cuenta que hace la solicitud. Si ese plan no incluye el historial, la herramienta devuelve `not_in_plan`. |

Al alcanzar el límite de subscriptions del tier, `create_subscription` puede devolver el error `subscription_limit_reached`. Una creación o reanudación exitosa (mediante `set_subscription_state` con `on` para reanudar) puede devolver `state: "blocked"` y `blockedReason: "subscription_limit_reached"`. Comprueba que el `state` devuelto sea `on` antes de dar por hecho que la entrega está activa.

En este endpoint, los agentes no pueden crear, editar ni eliminar triggers, projects, templates o data sources. Tampoco pueden cambiar la facturación, los planes o los pagos, gestionar tokens, eliminar accounts o workspaces, cambiar de workspace, poner una subscription en estado `blocked` ni gestionar otros resources aparte de los webhooks.

### Claude Code

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
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

## Remote MCP Endpoint

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
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
