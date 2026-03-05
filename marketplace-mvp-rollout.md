# Marketplace MVP Rollout Runbook

## Feature flags

- `WEB3ALERT_BUILDER_ENABLED`
  - enables draft/project builder endpoints (`/api/v2/projects/*draft*`, `/api/v2/triggers/*draft*`, `/api/v2/triggers/preview`)
  - default: enabled when unset
- `WEB3ALERT_PROVIDER_ALLOW_HOSTS`
  - comma-separated allowlist for external provider hosts
  - example: `api.example.com,subgraph.thegraph.com`

## Rollout phases

1. Internal rollout
   - enable builder only in internal environment
   - run smoke checks on create draft, validate, publish, preview
2. Beta creators
   - enable in production for selected creators
   - monitor policy denials and transform failures
3. Wider release
   - increase creator cohort gradually
   - review host allowlist additions by security checklist

## Metrics and logs to monitor

- `builder draft validation failures` (log pattern: `meta.title is required`, `transform.source should not be empty`)
- `provider policy denials` (preview route issues mentioning policy/allowlist)
- `transform runtime failures` (preview and engine logs)
- `subscription action errorClass`
  - `user_error`
  - `provider_error`
  - `system_error`

## Rollback procedure

1. Set `WEB3ALERT_BUILDER_ENABLED=false`.
2. Redeploy API.
3. Validate core project and trigger CRUD routes still work.
4. Keep stored draft/project data intact; no destructive rollback migrations are required.

## Operational guardrails

- keep `WEB3ALERT_PROVIDER_ALLOW_HOSTS` narrow and explicit
- avoid wildcard hosts in production
- review new hosts with abuse/SSRF checklist before adding
