# MCP Server

MCP está disponible para los tiers `Free`, `Advanced` y `Pro`.

- Usa `https://web3alert.io/mcp/agent` para suscribirte a eventos on-chain decodificados y recibirlos en un webhook.
- Usa `https://web3alert.io/mcp` para acceder al conjunto completo de herramientas con las que puedes crear y editar projects, triggers, templates, subscriptions, resources y data sources del marketplace de Web3alert, y consultar datos de diagnóstico.

La entrada `io.web3alert/agent` del MCP Registry indica que el header `Authorization` es opcional. Consulta el [repositorio público de MCP](https://github.com/web3alert/mcp) para más detalles sobre el servidor.

## Token

Sin token, `/mcp/agent` solo responde a `initialize`, `ping`, las notificaciones y `tools/list`. Cualquier otra solicitud sin token, incluido un lote (un array de solicitudes), recibe una respuesta HTTP `401` con instrucciones para enviar un token. Cada lote admite hasta 20 mensajes. Las llamadas a herramientas (`tools/call`) requieren `Authorization: Bearer <token>`.

El endpoint `/mcp` para crear y editar requiere `Authorization: Bearer <token>` en cada solicitud. Ambos endpoints aceptan tokens solo en ese header. El servidor verifica el token enviado antes de responder, incluso en el caso de las notificaciones. Ambos endpoints devuelven HTTP `401` en cada solicitud con un token inválido.

Obtén un personal access token en [Account parameters](account.md#personal-access-token). El token da al MCP server acceso a Web3alert API en nombre del account actual. El nivel de acciones disponibles depende del account tier y de los roles del usuario en workspace.

Tras la revocación, la API rechaza el token de inmediato. Mientras MCP conserve la verificación en caché, una llamada de una herramienta para agentes que llegue a la API devuelve `access_denied`. Las solicitudes `initialize` y `tools/list` que envíen el token revocado pueden seguir funcionando durante un máximo de 30 segundos gracias a la verificación en caché. Cuando MCP vuelve a comprobar el token revocado, devuelve HTTP `401`.

| Estado HTTP | Qué hacer |
| --- | --- |
| `401` | Falta un Bearer token obligatorio o el token enviado es inválido, desconocido o revocado. Envía el header con un token válido. Obtén uno nuevo si no tienes token o el servidor ya no lo reconoce. |
| `403` | El servidor rechazó el origen del cliente (`forbidden_origin`) o el account no superó la comprobación de acceso a MCP (`mcp_access_denied`). Revisa el header `Origin` del cliente o los datos del account, según el error. |
| `429` | La API limitó la verificación del token. Espera el tiempo indicado en `Retry-After` antes de volver a intentarlo. |
| `503` | La verificación del token no está disponible temporalmente. Espera el tiempo indicado en `Retry-After` y vuelve a intentarlo con el mismo token. |

Por defecto, cada proceso del servidor permite 120 llamadas a herramientas por minuto y por account, compartidas entre los dos endpoints y todos los tokens del account. Al agotar este límite, la herramienta devuelve `rate_limited` con `retryAfter` en segundos.

## Actualizar clientes existentes

El endpoint `/mcp` ahora solo acepta el token en la cabecera `Authorization: Bearer <token>` en cada solicitud. Las solicitudes que solo incluyen el token en la cadena de consulta o en el cuerpo reciben una respuesta HTTP `401`. El servidor funciona sin sesiones de MCP.

Configura el cliente para que envíe la cabecera y elimina el token de la URL o del cuerpo de la solicitud.

En Claude Code, ejecuta estos comandos desde el proyecto en el que usas Web3alert.

1. Ejecuta `claude mcp list` para comprobar si aparece el nombre que vas a sustituir. Para ver el ámbito de la entrada que aparece, ejecuta `claude mcp get web3alert` o `claude mcp get web3alert-agent`.
2. Elimina la entrada indicando su ámbito, por ejemplo con `claude mcp remove --scope user web3alert` o `claude mcp remove --scope local web3alert`. Al eliminarla, puede aparecer otra entrada con el mismo nombre en otro ámbito. Repite los pasos 1 y 2 hasta que el nombre deje de aparecer.
3. Ejecuta el ejemplo de `claude mcp add` de tu endpoint para añadir la nueva entrada.

En Claude Desktop, Cursor y VS Code, edita la URL y las cabeceras de la entrada existente. Consulta los [ejemplos de configuración del endpoint remoto](#remote-mcp-endpoint).

## Endpoint para agentes

Las herramientas para agentes actúan sobre el workspace actual del account. Para que la siguiente llamada use otro workspace, selecciónalo en la aplicación de Web3alert.

| Herramienta | Qué hace |
| --- | --- |
| `get_account` | Devuelve el ID, nombre y plan de la cuenta, el saldo en EUR, los límites del plan y los recuentos de suscripciones activas y totales del espacio de trabajo actual si están disponibles. |
| `find_triggers` | Busca disparadores de redes EVM y Substrate en el catálogo público. También busca en los disparadores del espacio de trabajo actual. |
| `get_trigger` | Muestra los inputs de ejecución del trigger, los campos de los eventos entregados y los campos que puedes usar en `conditions`. |
| `list_webhooks` | Muestra el `fullname`, el nombre y la URL de cada webhook registrado en el workspace. El campo `signed` indica si el webhook tiene un secreto de firma. |
| `add_webhook` | Registra un webhook con una URL HTTPS sin credenciales. Si al comprobar el nombre ya existe un recurso con ese nombre en el espacio de trabajo, la herramienta rechaza la solicitud con `webhook_exists`. El secreto de firma solo aparece en la respuesta de `add_webhook` como `signingSecret`. Si lo rotas más adelante, se sustituye para todos los receptores de ese endpoint. |
| `create_subscription` | Crea una subscription a un trigger con entrega a un webhook. Proporciona los inputs requeridos y, si quieres filtrar eventos, `conditions`. |
| `list_subscriptions` | Lista los IDs, títulos, estados, triggers, webhooks y fechas de creación de las subscriptions. |
| `set_subscription_state` | Pausa (`off`) o reanuda (`on`) una subscription. |
| `remove_subscription` | Elimina una suscripción. Los reintentos de webhook se detienen en unos 10 segundos. Todavía puede enviarse un intento previsto para ese intervalo. |
| `get_delivery_log` | Muestra los resultados de entrega del espacio de trabajo o de una suscripción. El historial de alertas usa el plan de la primera cuenta con rol de propietario en la lista de acceso del espacio de trabajo. Si no existe esa cuenta, la API comprueba el plan de la cuenta que hace la solicitud. Si ese plan no incluye el historial, la herramienta devuelve `not_in_plan`. Los registros de canales webhook incluyen `eventId` y `attempt`. `nextAttemptAt` es la marca de tiempo ISO para la que se había programado el siguiente intento al guardar el registro, o `null` si el registro no indica un reintento programado. |

La marca de tiempo `nextAttemptAt` permanece fija aunque el reintento se ejecute o se cancele. Para conocer el resultado de la entrega, busca un registro posterior con el mismo `eventId`. Si los reintentos se detienen porque se pausa o elimina la suscripción, o si un reintento caduca, Web3alert no guarda un registro final y, sin ese registro, se desconocen tanto el resultado de la entrega como el estado actual de los reintentos.

`limits.maxSubscriptions` limita las suscripciones activas que has creado a proyectos que no sean Free, sumadas entre todos los espacios de trabajo. El límite de Free es de 5. Las suscripciones a proyectos Free quedan fuera del límite.

Al alcanzar el límite de subscriptions del tier, `create_subscription` puede devolver el error `subscription_limit_reached`. Una creación o reanudación exitosa (mediante `set_subscription_state` con `on` para reanudar) puede devolver `state: "blocked"` y `blockedReason: "subscription_limit_reached"`. Comprueba que el `state` devuelto sea `on` antes de dar por hecho que la entrega está activa.

En este endpoint, los agentes no pueden crear, editar ni eliminar triggers, projects, templates o data sources. Tampoco pueden cambiar la facturación, los planes o los pagos, gestionar tokens, eliminar accounts o workspaces, cambiar de workspace, poner una subscription en estado `blocked` ni gestionar otros resources aparte de los webhooks.

### Claude Code

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert-agent https://web3alert.io/mcp/agent --header "Authorization: Bearer $WEB3ALERT_TOKEN"
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

Para añadir este endpoint a Claude Code, ejecuta el comando en Bash o Zsh e introduce el token cuando se te pida. El token no se mostrará en la terminal.

```bash
printf 'Web3alert token: ' && read -rs WEB3ALERT_TOKEN && echo && [ -n "$WEB3ALERT_TOKEN" ] && claude mcp add --scope user --transport http web3alert https://web3alert.io/mcp --header "Authorization: Bearer $WEB3ALERT_TOKEN"
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
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
