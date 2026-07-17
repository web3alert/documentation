# API de enlaces

Los enlaces crean y resuelven claves cortas para destinos internos de
Web3alert. Ambos endpoints son públicos y no requieren un token Bearer.

## POST /api/links

Crea un enlace corto persistente.
<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->

Autenticación: ninguna.

Argumentos: ninguno.

Payload:

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `uri` | Sí | Ruta interna de Web3alert. Debe empezar por `/` y no puede empezar por `/link/`; no se aceptan URL externas absolutas. |

El prefijo de redirección del frontend `/link/` está reservado, no es un
endpoint de API y no se puede enviar como destino.

```http
POST /api/links
Content-Type: application/json

{
  "uri": "/common.ethereum"
}
```

Respuesta: HTTP 200 OK con un objeto `Link`.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `key` | Sí | Clave generada para el enlace corto. |
| `uri` | Sí | Ruta interna de Web3alert almacenada. |

```json
{
  "key": "AbC123",
  "uri": "/common.ethereum"
}
```

Un `uri` no válido devuelve HTTP 400 Bad Request con el mensaje de error
`invalid uri`.

## GET /api/links/:key

Resuelve la clave de un enlace corto.
<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->

Autenticación: ninguna.

Argumentos:

| Argumento | Ubicación | Descripción |
| --- | --- | --- |
| `key` | Path | Clave generada para el enlace corto. |

Payload: ninguno.

Respuesta: HTTP 200 OK con el objeto `Link` almacenado.

| Campo | Obligatorio | Descripción |
| --- | --- | --- |
| `key` | Sí | Clave del enlace corto. |
| `uri` | Sí | Ruta interna de Web3alert almacenada. |

Si la clave no existe, el endpoint devuelve HTTP 400 Bad Request con el
mensaje de error `shortcut not found`.
