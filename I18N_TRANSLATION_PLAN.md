# Web3alert Docs i18n Translation Plan

## Goal

Translate the new Web3alert documentation from the Russian source into:

- English (`user/en`);
- Spanish (`user/es`);
- Portuguese (`user/pt`);
- Chinese (`user/zh`).

Russian source pages live in `user/ru`. The root `/` page redirects to `/en/`.

## Working Rules

- Translate one document at a time across all target languages.
- Keep product entity names stable when they are UI concepts: `Account`, `Workspace`, `Projects`, `Triggers`, `Templates`, `Subscriptions`, `Resources`, `Data sources`, `Addresses`.
- Keep existing relative links unchanged unless the linked file name changes.
- Remove the temporary translation notice only from pages that are fully translated.
- After each batch, run `npm run docs:build`.

## Status

| Page | English | Spanish | Portuguese | Chinese |
| --- | --- | --- | --- | --- |
| `index.md` | done | done | done | done |
| `README.md` | done | done | done | done |
| `account.md` | done | done | done | done |
| `workspaces.md` | done | done | done | done |
| `limits.md` | done | done | done | done |
| `mcp-server.md` | done | done | done | done |
| `projects.md` | done | done | done | done |
| `triggers.md` | done | done | done | done |
| `trigger-wizard.md` | done | done | done | done |
| `import-triggers.md` | done | done | done | done |
| `templates.md` | done | done | done | done |
| `template-wizard.md` | done | done | done | done |
| `subscriptions.md` | done | done | done | done |
| `subscription-wizard.md` | done | done | done | done |
| `resources.md` | done | done | done | done |
| `data-sources.md` | done | done | done | done |
| `addresses.md` | done | done | done | done |
| `api.md` | done | done | done | done |
| `types.md` | done | done | done | done |
| `api-account.md` | done | done | done | done |
| `api-workspaces.md` | done | done | done | done |
| `api-projects.md` | done | done | done | done |
| `api-project-transfers.md` | done | done | done | done |
| `api-triggers.md` | done | done | done | done |
| `api-trigger-import.md` | done | done | done | done |
| `api-templates.md` | pending | pending | pending | pending |
| `api-subscriptions.md` | pending | pending | pending | pending |
| `api-resources.md` | pending | pending | pending | pending |
| `api-data-sources.md` | pending | pending | pending | pending |
| `api-addresses.md` | pending | pending | pending | pending |
| `api-builder-registry.md` | pending | pending | pending | pending |

## Next Batch

1. Translate `api-templates.md` in all target languages.
2. Run VitePress build.
3. Move to `api-subscriptions.md`.
