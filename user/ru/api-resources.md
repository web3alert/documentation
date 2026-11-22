# Resources API

Endpoints Resources управляют delivery resources и их публичными setup flows.
Все маршруты на этой странице используют канонический namespace `/api`.

Для ресурсов вебхуков поле `signing: { enabled: boolean, createdAt: string | null }` есть в списке, в представлении отдельного ресурса и в ответе на PUT. `enabled` показывает, включена ли подпись. `createdAt` содержит время создания текущего секрета подписи или `null`, если подпись не настроена.

При переносе проекта в другой воркспейс секреты подписи перенесённых вместе с ним вебхуков удаляются. У этих вебхуков значение `signing.enabled: false`. Пользователь с правами на управление новым воркспейсом может [создать новый секрет](#post-api-resources-fullname-signing-secret) для каждого перенесённого вебхука.

## GET /api/resources

Возвращает resources.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `workspace` | Query | Опциональный фильтр по workspace fullname. |
| `project` | Query | Опциональный фильтр по project fullname. |

Тело запроса: нет.

Ответ: [ResourceView[]](types.md#resourceview).

## GET /api/resources/:fullname

Возвращает resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Ответ: [ResourceView](types.md#resourceview).

## PUT /api/resources/:fullname

Создает или обновляет resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. Должен совпадать с `payload.fullname`. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `name` | Да | Имя resource. |
| `fullname` | Да | Resource fullname. |
| `workspace` | Да | Workspace fullname. |
| `project` | Нет | Project fullname, если resource привязан к project. |
| `blueprint` | Да | Blueprint fullname, который задает setup/action behavior. |
| `data` | Нет | Данные конкретного resource. |
| `tags` | Нет | Tags. |
| `labels` | Нет | Labels. |
| `meta.title` | Нет | Видимое название. |

Ответ: [ResourceView](types.md#resourceview).

При создании вебхука ответ также один раз возвращает `signingSecret`. При обновлении существующего ресурса возвращается только его представление.

## POST /api/resources/:fullname/signing-secret

Создаёт секрет подписи для вебхука без подписи или заменяет существующий секрет. Для вызова нужны права на управление воркспейсом ресурса.

Возвращает `signingSecret` один раз и `createdAt` с временем в формате ISO. Когда новый секрет вступает в силу, описано в разделе [Вебхуки](webhooks.md).

При этих ошибках замены секрета API возвращает HTTP `400` с телом JSON в формате `{ "error": { "message": "..." } }`.

| Сообщение | Когда возвращается |
| --- | --- |
| `access denied` | У вызывающей стороны нет прав на управление воркспейсом ресурса. |
| `resource not found` | Ресурс не существует. |
| `not a webhook resource` | Ресурс не является вебхуком. |

## DELETE /api/resources/:fullname

Удаляет resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Resource fullname. |

Тело запроса: нет.

Требуется сессия или ключ с `manage` и право управления пространством ресурса. Возвращает `204 No Content`. При удалении вебхука возвращает `409 webhook_in_use`, если на него отправляет события активная (`on`) подписка в том же пространстве.

Три setup-session endpoints ниже доступны, только когда на сервере включена
безопасная настройка Telegram destination.

## POST /api/resources/:fullname/setup-sessions

Создает безопасную setup session для выбора Telegram destination. Авторизованный
account должен быть владельцем workspace, которому принадлежит resource, а сам
resource должен использовать внешний Telegram blueprint.

У resource может быть только одна активная setup session. Новая session переводит
предыдущую активную session в статус `superseded`, но не меняет текущий destination
resource.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |

Тело запроса: нет.

Ответ:

| Поле | Описание |
| --- | --- |
| `id` | ID setup session для проверки статуса или отмены. |
| `status` | `pending`. |
| `setupToken` | Одноразовый секрет для запуска setup flow в Telegram-боте. Возвращается только в этом ответе; его нельзя логировать или сохранять. |
| `expiresAt` | ISO timestamp. Session и `setupToken` истекают через 15 минут после создания. |

Старый destination продолжает получать alerts, пока Telegram не подтвердит новую
цель и session не перейдет в статус `completed`.

После завершения сервер сохраняет подтвержденный target в приватном `data`,
устанавливает `ready: true` и очищает `remark`. Controller workspace получает
безопасное название, тип и опциональный topic через `destinationSummary`;
Telegram target id и приватные данные в этом view отсутствуют. Для отображения
настроенного destination нужно использовать `destinationSummary`, а не `remark`.

## GET /api/resources/:fullname/setup-sessions/:id

Возвращает публичный статус Telegram destination setup session. Ответ никогда не
содержит `setupToken`.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |
| `id` | Path | ID setup session. |

Тело запроса: нет.

Ответ:

| Поле | Описание |
| --- | --- |
| `id` | ID setup session. |
| `resourceFullname` | Fullname resource. |
| `status` | `pending`, `claimed`, `completed`, `cancelled`, `expired` или `superseded`. |
| `expiresAt` | ISO timestamp окончания session. |

## DELETE /api/resources/:fullname/setup-sessions/:id

Отменяет активную Telegram destination setup session. Для уже настроенного
resource отмена безопасна: его текущий destination не изменяется.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `fullname` | Path | Fullname Telegram resource. |
| `id` | Path | ID setup session. |

Тело запроса: нет.

Ответ: пустой успешный ответ.

## PUT /api/inbox

Требуется сессия аккаунта или ключ агента с `manage`, а также право управления пространством. Тело запроса не требуется. Возвращает `{ fullname, retention: { days, maxEvents } }`. Повтор возвращает тот же inbox. Если имя занято другим ресурсом, возвращается `409 resource_name_in_use`.

Используйте полное имя как `values.inbox` в действии подписки `common.builtin.inbox`. Проверяется тариф владельца пространства, а при его отсутствии — тариф вызывающего аккаунта. Для Free оба эндпоинта возвращают `403 not_in_plan`. См. [Лимиты](limits.md).

## GET /api/events

Требуется сессия аккаунта или ключ агента с `read`, право управления пространством и тот же платный тариф, что для создания inbox. Необязательные параметры: `after` (непрозрачный курсор) и `limit` (1–500, по умолчанию 100). Первое чтение начинается с самого старого сохранённого события.

Возвращает `{ events, nextCursor, hasMore, gap }`. У каждого события есть `cursor`, `id`, `receivedAt`, `subscription`, `trigger` и `body`. Передайте `nextCursor` как `after` для следующей страницы или опроса. Пустая страница возвращает переданный курсор или `null`, если его не было. `gap: true` означает потерю событий относительно курсора из-за ограничений хранения.

## GET /api/resources/external/:token

<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->

Читает состояние external resource setup по capability ресурса.

Безопасность: `:token` — это постоянная bearer capability ресурса, а не
одноразовый 15-минутный `setupToken` Telegram setup session. Считайте секретом
весь URL: передавайте его только по HTTPS и не помещайте в аналитику, логи
приложений, сообщения поддержки или ссылки, передающие referrer.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Постоянная bearer capability ресурса. |

Тело запроса: нет.

Ответ: [ExternalResourceView](types.md#externalresourceview).

## POST /api/resources/external/:token

Отправляет payload external resource setup по capability ресурса.

Аргументы:

| Аргумент | Где | Описание |
| --- | --- | --- |
| `token` | Path | Постоянная bearer capability ресурса. |

Тело запроса:

| Поле | Обязательное | Описание |
| --- | --- | --- |
| `transform` | Да | Объект или `null`, resource/app-specific результат transform/setup. |

Ответ: [OperationResult](types.md#operationresult).
