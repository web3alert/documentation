# API de ligações

As ligações criam e resolvem chaves curtas para destinos internos do
Web3alert. Ambos os endpoints são públicos e não exigem um token Bearer.

## POST /api/links

Cria uma ligação curta persistente.
<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->

Autenticação: nenhuma.

Argumentos: nenhum.

Payload:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `uri` | Sim | Caminho interno do Web3alert. Tem de começar por `/` e não pode começar por `/link/`; não são aceites URL externas absolutas. |

O prefixo de redirecionamento do frontend `/link/` está reservado, não é um
endpoint de API e não pode ser enviado como destino.

```http
POST /api/links
Content-Type: application/json

{
  "uri": "/common.ethereum"
}
```

Resposta: HTTP 200 OK com um objeto `Link`.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `key` | Sim | Chave gerada para a ligação curta. |
| `uri` | Sim | Caminho interno do Web3alert armazenado. |

```json
{
  "key": "AbC123",
  "uri": "/common.ethereum"
}
```

Um `uri` inválido devolve HTTP 400 Bad Request com a mensagem de erro
`invalid uri`.

## GET /api/links/:key

Resolve a chave de uma ligação curta.
<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->

Autenticação: nenhuma.

Argumentos:

| Argumento | Localização | Descrição |
| --- | --- | --- |
| `key` | Path | Chave gerada para a ligação curta. |

Payload: nenhum.

Resposta: HTTP 200 OK com o objeto `Link` armazenado.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `key` | Sim | Chave da ligação curta. |
| `uri` | Sim | Caminho interno do Web3alert armazenado. |

Se a chave não existir, o endpoint devolve HTTP 400 Bad Request com a mensagem
de erro `shortcut not found`.
