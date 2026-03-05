# Marketplace Runtime Orchestration

## Goal

Deploy project triggers dynamically (without code/restart for each trigger) using:

- `api` as the source of truth for project/trigger specs
- `devourer` as the runtime that consumes blockchain inputs (`RPC + NATS`) and emits trigger outputs

## Control Plane (API -> Devourer)

`api` sends NATS service calls to runtime control methods:

- `upsert-project`
- `remove-project`
- `upsert-trigger`
- `remove-trigger`

Service path defaults:

- workspace: `common`
- project: `marketplace.runtime`
- service: `control`

So effective method subject is:

`app.common.marketplace.runtime.control.<method>`

## Data Plane (Runtime Trigger Execution)

`devourer` marketplace plugin stores runtime deployments in KV bucket and watches changes.

On trigger upsert it creates/refreshes a runtime worker:

1. Build runtime trigger in namespace `marketplace.<projectFullname>`.
2. Subscribe to source:
   - `timer` -> cron by interval
   - `sdk` -> subscribe to existing SDK trigger subject
   - current mapping:
     - `evm_log` -> `<network>.evm.blocks`
     - `substrate_event` with pallet+event -> `<network>.substrate.events`
     - `substrate_event` without strict filters -> `<network>.substrate.blocks`
3. On each input:
   - execute external providers (`http/graphql/rpc`) with limits
   - run JS transform in `vm` sandbox
   - publish normalized output to NATS trigger stream

On trigger remove it destroys worker.

## Backend Binding for Subscriptions

When trigger is saved in `api`, backend is switched to runtime SDK trigger:

`<runtimeWorkspace>.<runtimePrefix>.<triggerFullname>`

Default runtime prefix is `marketplace`.

This makes subscription flow consume dynamically deployed trigger output instead of static legacy events.

## Environment Variables

### API

- `WEB3ALERT_MARKETPLACE_RUNTIME_ENABLED` (default: `true`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_REQUIRED` (default: `false`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_WORKSPACE` (default: `common`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_PROJECT` (default: `marketplace.runtime`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_SERVICE` (default: `control`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_TRIGGER_PREFIX` (default: `marketplace`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_NATS_SERVERS` (default: `localhost:4222`)
- `WEB3ALERT_MARKETPLACE_RUNTIME_NATS_USERNAME`
- `WEB3ALERT_MARKETPLACE_RUNTIME_NATS_PASSWORD`
- `WEB3ALERT_MARKETPLACE_RUNTIME_NATS_TOKEN`

### Shared provider policy

- `WEB3ALERT_PROVIDER_ALLOW_HOSTS`

## Devourer config snippet

```yaml
plugins:
  - name: marketplace.runtime
    plugin: marketplace
    config:
      project: marketplace.runtime
      service: control
```
