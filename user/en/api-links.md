# Links API

Links create and resolve short keys for site-relative Web3alert destinations.
Both endpoints are public and do not require a Bearer token.

## POST /api/links

Creates a persistent short link.
<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->

Authentication: none.

Arguments: none.

Payload:

| Field | Required | Description |
| --- | --- | --- |
| `uri` | Yes | Internal Web3alert path. It must start with `/` and must not start with `/link/`; absolute external URLs are not accepted. |

The reserved frontend redirect prefix `/link/` is not an API endpoint and
cannot be submitted as the destination.

```http
POST /api/links
Content-Type: application/json

{
  "uri": "/common.ethereum"
}
```

Response: HTTP 200 OK with a `Link` object.

| Field | Required | Description |
| --- | --- | --- |
| `key` | Yes | Generated short-link key. |
| `uri` | Yes | Stored internal Web3alert path. |

```json
{
  "key": "AbC123",
  "uri": "/common.ethereum"
}
```

An invalid `uri` returns HTTP 400 Bad Request with the `invalid uri` error
message.

## GET /api/links/:key

Resolves a short-link key.
<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->

Authentication: none.

Arguments:

| Argument | Location | Description |
| --- | --- | --- |
| `key` | Path | Generated short-link key. |

Payload: none.

Response: HTTP 200 OK with the stored `Link` object.

| Field | Required | Description |
| --- | --- | --- |
| `key` | Yes | Short-link key. |
| `uri` | Yes | Stored internal Web3alert path. |

If the key does not exist, the endpoint returns HTTP 400 Bad Request with the
`shortcut not found` error message.
