# MCP Server

MCP доступен для tiers `Free`, `Advanced` и `Pro`.

- Используйте `https://web3alert.io/mcp/agent`, чтобы подписываться на декодированные on-chain события и получать их на webhook.
- Используйте `https://web3alert.io/mcp` для доступа к полному набору инструментов. Они позволяют создавать и редактировать projects, triggers, templates, subscriptions, resources и data sources в marketplace Web3alert и читать диагностические данные.

## Token

Для подключения нужен personal access token из [Account parameters](account.md#personal-access-token).

Token дает MCP server доступ к Web3alert API от имени текущего account. Уровень доступных действий зависит от tier account и ролей пользователя в workspace.

Передавайте токен в заголовке `Authorization: Bearer <token>` в каждом HTTP-запросе. Сервер не принимает токены в строке запроса или его теле.

После отзыва API сразу отклоняет токен. Пока MCP хранит результат проверки в кеше, вызов инструмента для агентов, дошедший до API, возвращает `access_denied`. Благодаря кешу `initialize` и `tools/list` могут еще успешно выполняться до 30 секунд. Когда MCP повторно проверяет отозванный токен, сервер возвращает HTTP `401`.

| Статус HTTP | Что делать |
| --- | --- |
| `401` | Bearer-токен отсутствует, недействителен, неизвестен серверу или отозван. Отправьте заголовок с действующим токеном. Получите новый токен, если у вас его нет или сервер его больше не распознает. |
| `403` | Сервер отклонил origin клиента (`forbidden_origin`) или account не прошел проверку доступа к MCP (`mcp_access_denied`). В зависимости от ошибки проверьте заголовок `Origin` клиента или данные account. |
| `429` | API ограничил частоту проверки токена. Подождите указанное в `Retry-After` время и повторите запрос. |
| `503` | Проверка токена временно недоступна. Подождите указанное в `Retry-After` время и повторите запрос с тем же токеном. |

По умолчанию каждый процесс сервера разрешает 120 вызовов инструментов в минуту на account. Лимит общий для обоих endpoints и всех токенов этого account. Когда лимит исчерпан, инструмент возвращает `rate_limited` с временем ожидания в секундах в поле `retryAfter`.

## Endpoint для агентов

Инструменты для агентов работают с текущим workspace account. Чтобы следующий вызов работал с другим workspace, выберите его в приложении Web3alert.

| Инструмент | Что делает |
| --- | --- |
| `get_account` | Возвращает ID, имя и tier account, баланс в EUR, а также число активных и общее число subscriptions в текущем workspace, если эти данные доступны. |
| `find_triggers` | Ищет по опубликованному каталогу и по triggers в текущем workspace. |
| `get_trigger` | Показывает inputs для выполнения trigger, поля доставляемых событий и поля, которые можно использовать в `conditions`. |
| `list_webhooks` | Возвращает `fullname`, имя и URL каждого webhook, зарегистрированного в workspace. |
| `add_webhook` | Регистрирует HTTPS webhook с новым именем. Если имя уже используется в workspace, инструмент возвращает `webhook_exists`. |
| `create_subscription` | Создает subscription на один trigger с доставкой на один webhook. Передайте обязательные inputs и при необходимости задайте фильтр событий в `conditions`. |
| `list_subscriptions` | Возвращает ID, названия, состояния, triggers, webhooks и время создания subscriptions. |
| `set_subscription_state` | Приостанавливает (`off`) или возобновляет (`on`) subscription. |
| `remove_subscription` | Удаляет subscription и прекращает доставку. |
| `get_delivery_log` | Показывает результаты доставки для workspace или отдельной subscription. История оповещений доступна, если у владельца workspace тариф `Advanced` или `Pro`. Если тариф не включает историю оповещений, инструмент возвращает `not_in_plan`. |

При достижении лимита subscriptions для tier вызов `create_subscription` может вернуть ошибку `subscription_limit_reached`. Успешное создание или возобновление (вызов `set_subscription_state` с `on`) может вернуть `state: "blocked"` и `blockedReason: "subscription_limit_reached"`. Прежде чем считать доставку активной, убедитесь, что вернулся `state` со значением `on`.

Через этот endpoint агенты не могут создавать, редактировать или удалять triggers, projects, templates и data sources. Они также не могут менять billing, тарифы и платежи, управлять токенами, удалять accounts или workspaces, переключать workspace, переводить subscriptions в состояние `blocked` или управлять другими resources, кроме webhooks.

### Claude Code

```bash
claude mcp add --transport http web3alert-agent https://web3alert.io/mcp/agent \
  --header "Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN"
```

### Универсальная конфигурация JSON

Поместите этот JSON в файл конфигурации MCP вашего клиента.

```json
{
  "mcpServers": {
    "web3alert-agent": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "--header",
        "Authorization:${AUTH_HEADER}",
        "https://web3alert.io/mcp/agent"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

## Remote MCP endpoint

Поместите этот JSON в файл конфигурации MCP вашего клиента.

```json
{
  "mcpServers": {
    "web3alert": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "--header",
        "Authorization:${AUTH_HEADER}",
        "https://web3alert.io/mcp"
      ],
      "env": {
        "AUTH_HEADER": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```
