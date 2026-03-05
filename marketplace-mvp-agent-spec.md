# Marketplace MVP Agent Spec

## Scope

This document defines implementation contracts for MVP stage 1:

- project creation and editing in UI
- alert template creation and editing in UI
- project visibility modes for creator workflows
- dry-run validation and safety controls for transform/providers

Out of scope for this stage:

- full public marketplace catalog UX
- open subscription onboarding for all users

## Project Contract

New fields:

- `visibility`: `public | private_link | personal`
- `publishState`: `draft | published | archived`

Adopt the new fields as the source of truth for project visibility and lifecycle.

## Trigger Contract

New fields:

- `triggerSpec`: trigger definition
  - `evm_log`
  - `substrate_event`
  - `new_block`
  - `timer`
- `providers`: list of external providers called during execution
- `outputSchema`: user-visible output schema with optional field description
- `transform`: user script configuration and source code
- `executionPolicy`: per-trigger limits

## Private Link Contract

`private_link` projects are accessed using project-scoped access links:

- `id`
- `project`
- `workspace`
- `token`
- `ownerAccountId`
- `state`: `active | revoked`
- `maxUsages` and `used`
- `expiresAt`
- `createdAt`

## Provider Policy (medium sandbox)

Provider calls are allowed only if all checks pass:

- provider type is supported: `http`, `graphql`, `rpc`
- url host is in allowlist
- url protocol is `https:`
- host is not localhost/private/internal
- request timeout and response body size are within limits
- calls per run and interval-based limits are respected

Default global limits:

- max providers per trigger: 5
- max provider calls per run: 10
- request timeout: 10s
- max response body size: 256KB

## Transform Policy

Transform execution constraints:

- JS-only runtime
- strict timeout
- no direct network/fs/process access
- input object is immutable by contract (must return a new object)

For MVP dry-run endpoint, runtime can use VM timeout and restricted context.

## Error Classification

All builder/runtime flows classify failures into:

- `user_error`: bad schema, invalid transform output, validation failures
- `provider_error`: network error, denied host, timeout, oversized response
- `system_error`: internal service/unknown failures

## AI Agent Delivery Rules

Each implementation PR by an AI agent should include:

- updated contracts/types
- API implementation with validation
- tests for changed logic
- docs/changelog note

Recommended sequence:

1. types + schemas
2. api routes/services
3. engine integration
4. ui flows
5. migration and rollout
