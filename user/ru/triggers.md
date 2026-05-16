# Triggers

`Triggers` - это технические правила проекта, которые определяют, какие события Web3alert читает из источника данных, как проверяет условия срабатывания и какой результат формирует для подписки и связанных с ней actions.

Triggers можно использовать напрямую или через templates. Прямой trigger подходит, когда пользователю нужна точная настройка source, inputs, filters и defaults. Template удобен, когда владелец проекта хочет собрать один или несколько triggers в готовый сценарий подписки с понятным topic и заранее заданными правилами. Какой путь выбрать, зависит от конкретного кейса.

Trigger связывает несколько частей сервиса:

- [Projects](projects.md) - проект, внутри которого trigger создается и отображается;
- [Data sources](data-sources.md) - источник blockchain/runtime данных;
- [Subscriptions](subscriptions.md) - пользовательские подписки, которые используют trigger напрямую или через template rules;
- [Resources](resources.md) и [Addresses](addresses.md) - внешние сущности, которые могут использоваться в inputs, filters или notification defaults.

## Как создавать triggers

Есть два основных пути:

- [Add trigger / Edit trigger](trigger-wizard.md) - основной подробный wizard. Он используется для ручного создания и редактирования trigger от source до notification defaults;
- [Import triggers](import-triggers.md) - упрощенный массовый wizard. Он генерирует набор triggers по указанным конфигам или metadata, например по ABI EVM-контракта, metadata Substrate pallet или IDL Solana program, а затем позволяет выбрать, какие из них сохранить.

Если нужно настроить один точный сценарий или отредактировать существующий trigger, обычно используют [Add trigger / Edit trigger](trigger-wizard.md). Если нужно быстро получить много однотипных triggers из внешнего описания контракта или pallet, удобнее начать с [Import triggers](import-triggers.md).

У проекта есть лимит на количество triggers. Если проект уже достиг лимита, новые triggers нельзя будет сохранить, пока лимит не увеличен или часть существующих triggers не удалена. Подробнее это описано в разделе [Limits](limits.md#project-triggers).
