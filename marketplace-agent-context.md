# Web3alert Marketplace: Agent Context

## Goal

Transform Web3alert into a project marketplace where users can:

- create notification projects in UI
- define project visibility (`public`, `private_link`, `personal`)
- create preset project triggers
- let other users subscribe to those triggers via existing subscription flows

This document describes the current implementation state for AI agents.

## Current scope (implemented)

### Project model

- project visibility and publish fields were introduced in contracts and API flow
- project metadata form in UI now supports extended fields and visibility control

### Trigger creation flow

- project page has dedicated `Triggers` tab with:
  - trigger list
  - `+ Add new trigger`
  - `Edit` action per trigger
- trigger creation/editing is a separate process page:
  - `Create trigger`
  - `Edit trigger`
- trigger wizard has 6 steps:
  1. Description
  2. Source
  3. Data providers
  4. Data schema
  5. Data transform
  6. Trigger testing

### Data schema UX

- step `Data schema` supports 2 modes:
  - `UI mode`: add/remove properties with `name`, `type`, `description`
  - `JSON mode`: direct JSON editing for copy/paste workflows
- object/array nested schema support is included:
  - nested shorthand conversion for object/array
  - normalization before preview/save

### Preview and safety

- trigger preview endpoint is wired and used from UI
- provider policy + transform sandbox constraints are implemented in API
- wizard includes debug logs panel + detailed parse/preview/save logs

### Process header consistency

- shared flow header component is used to align project/trigger setup UX with existing alert wizard style

## Key files (high signal)

### Docs

- `documentation/marketplace-mvp-agent-spec.md`
- `documentation/marketplace-mvp-rollout.md`
- `documentation/marketplace-agent-context.md` (this file)

### Types

- `types/src/v2/project.ts`
- `types/src/v2/trigger.ts`
- `types/src/v2/project-access-link.ts`

### API

- `api/src/schemas/index.ts`
- `api/src/web/api/v2/projects/project/*`
- `api/src/web/api/v2/projects/by-link-get.ts`
- `api/src/web/api/v2/triggers/trigger/*`
- `api/src/web/api/v2/triggers/preview.ts`
- `api/src/builder/policy.ts`
- `api/src/builder/transform.ts`
- `api/src/builder/flags.ts`

### Engine

- `engine/src/engine/subscription-pipeline.ts`
- `engine/src/engine/subscription.ts`

### UI (project + trigger builder)

- `ui/app/(protected)/(with-shell)/projects/[project]/_components/edit-project/edit-project-v2.component.tsx`
- `ui/app/(protected)/(with-shell)/projects/[project]/triggers/_components/trigger-wizard/trigger-wizard.component.tsx`
- `ui/app/(protected)/(with-shell)/projects/[project]/triggers/create/page.tsx`
- `ui/app/(protected)/(with-shell)/projects/[project]/triggers/[trigger]/page.tsx`
- `ui/app/(protected)/(with-shell)/projects/_services/triggers.service.ts`
- `ui/app/(protected)/(with-shell)/projects/_components/flow-progress-header/flow-progress-header.component.tsx`

## Implemented API capabilities

- project draft lifecycle endpoints
- project publish endpoint
- private link access endpoint
- trigger draft save/get/validate endpoints
- trigger preview endpoint (`/api/v2/triggers/preview`)

## Local run notes

- infra via `localhost/docker-compose.yml` (mongo + rabbitmq)
- API and UI require env setup
- UI auth for local testing may require mock auth provider and token cookie bootstrap

## Known constraints / next expected tasks

- improve strict per-step validation in trigger wizard navigation
- refine visual parity of custom flow header with legacy Add Alert progress bar
- harden nested schema visual editor (fully recursive UI editor, optional)
- expand integration/e2e coverage for new trigger wizard flow
- wire richer server-side request correlation IDs into UI debug logs

## Agent guidance

- keep UI text in English for the new project/trigger setup screens
- prefer extending current shared components/services over introducing parallel abstractions
