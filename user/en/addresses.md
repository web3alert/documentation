# Addresses

`Addresses` is the address book of the current workspace.

It stores blockchain addresses and clear aliases for them, so subscriptions and notifications can work not only with long technical addresses, but also with human names: `Treasury`, `Main wallet`, `Alice validator`, `Ops multisig`.

## What addresses are for

Addresses help in three main scenarios.

### Filling subscriptions faster

When [Create subscription](subscription-wizard.md) has an address field, the interface can suggest addresses from address book.

This is convenient if the workspace often subscribes to the same wallets, contracts, validators, or accounts.

### Reading subscriptions more clearly

Addresses from address book are easier to recognize in inputs and filters.

For example, instead of remembering which wallet hides behind a long `0x...` each time, you can store alias `Treasury` and use it as a clear name.

### Improving notification defaults

In [notification defaults](trigger-wizard.md#defaults), Handlebars helpers `address` and `make` can be used.

They take address from trigger output and, if this address exists in the current workspace address book, output alias. If alias is not found, helper leaves address as is or shortens it to a compact form.

This is especially useful for notifications that contain several addresses: sender, receiver, contract, validator, delegator, or multisig.

## Workspace scope

Address book belongs to the current workspace.

If you switch workspace, the address list changes. This matters: address `Treasury` in one workspace and address `Treasury` in another workspace can be different entities.

Users with workspace management permissions can manage addresses. If the user does not have such permissions, the `Addresses` section is unavailable for viewing and editing.

Address book does not confirm address ownership and does not grant wallet access. It is only an alias directory for easier alert setup and display.

## Address types

When adding address, type is selected first. Type is needed for validation and for correct alias lookup when rendering notifications.

### Plain

Arbitrary string value.

Used when you need to store not a standard blockchain address, but another identifier that is still convenient to label with an alias.

### Substrate (ss58 format)

Substrate/Polkadot ecosystem address in SS58 format.

When saving, UI normalizes SS58 address into internal canonical format and shows it back as SS58 in the list. This allows matching the same account even if it was entered in different SS58 variants.

### Bitcoin

Bitcoin address.

Suitable for Bitcoin-style addresses used in Bitcoin subscriptions and notifications.

### Ethereum (EVM)

EVM address in `0x...` format.

Suitable for Ethereum-compatible networks: Ethereum, Polygon, Base, Arbitrum, Optimism, Celo, and other EVM networks.

When looking up alias, EVM addresses are compared case-insensitively.

### Cosmos

Cosmos/Bech32 address.

When saving, UI normalizes Bech32 address to base `cosmos` prefix so the same address can be matched more reliably.

## Address list

The `Addresses` section shows the address book of the current workspace.

### Alias

Human-readable address name.

Alias is shown in the list, used in helpers, and helps recognize address in subscriptions and notifications.

### Type

Address type: `plain`, `ss58`, `bitcoin`, `evm`, or `cosmos`.

### Address

The address itself.

In the list, it can be shown in formatted form. For long addresses, the interface can shorten the middle on narrow screens, but full address is used when copying.

### Network icons

If address is used in subscriptions, icons of related networks/projects may appear next to it.

This helps understand where a specific address is already used.

### Copy

Button copies full address.

### Edit

Allows changing alias.

Address and type remain the same: if the address itself needs to be replaced, it is better to delete the old record and add a new one.

### Delete

Deletes address from address book.

Deletion does not delete subscriptions, but after deletion alias will no longer be inserted in suggestions and notification helpers.

## Add address

`Add address` opens new record creation form.

### Address type

First, address type is selected.

After selecting type, `Name` and `Address` fields appear.

### Name

Optional alias.

If name is not filled, alias will equal the address itself. If name is filled, it must be at least three characters long and must not duplicate alias of another address of the same type.

It is better to choose a short clear name that looks good in notifications: `Treasury`, `Bridge hot wallet`, `Validator stash`.

### Address

Required field with address value.

Address must not contain spaces, must pass validation for the selected type, and must not duplicate an already saved address of the same type.

### Add address

Saves record to the current workspace address book.

After saving, the form is reset and the new address appears in the list.

## Usage in subscription wizard

Address book is used in fields described by schema as address.

When the user enters address in subscription inputs or filters, the interface can show matching records from address book. A ready address can be selected instead of copying manually.

If an unnecessary record appears in dropdown, it can be deleted directly from address input. This will delete the record from workspace address book.

## Usage in notification templates

Address book is especially useful in notification defaults and overrides.

### address helper

`address` accepts one value.

If the value is a known blockchain address and is found in address book, helper returns alias. If alias is not found, known address is shortened to compact form.

Example:

```handlebars
{{address raw.from}}
```

### make helper

`make` accepts string, object, or array and recursively replaces found addresses with aliases.

This is convenient when output contains a structure with several addresses.

Example:

```handlebars
{{make raw}}
```

If `raw` contains addresses from address book, aliases will be shown in the notification instead.
