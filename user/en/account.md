# Account

`Account` is the personal user entity in Web3alert.

Account defines who is signed in to the service, how the personal profile appears, which tier is active, which balance is available for payments, and which billing/referral actions belong to this user.

Account does not replace [Workspace](workspaces.md). Workspace stores working entities: projects, subscriptions, resources, data sources, addresses, and members. Account stores personal access, profile, and billing context.

## Account and Workspace

### What Belongs to Account

Account includes:

- personal avatar and account title;
- user id;
- personal access token;
- billing profile;
- internal balance;
- account tier;
- tier auto-renewal;
- account plan purchases;
- project free-access add-on purchases for projects the account can manage in billing;
- personal coupons and gift coupons;
- referral link, referral code, and referral rewards;
- account deletion.

When a user switches the active workspace, the account remains the same. Only the working data related to the selected workspace changes.

Workspace and its settings are described in more detail in [Workspaces](workspaces.md).

## Open Account Parameters

`Account parameters` opens from the user menu in the top-right corner of the interface.

The menu contains:

- `Account parameters`;
- `Log out`.

`Log out` ends the current session. A confirmation is shown before signing out.

## Account Parameters

`Account parameters` contains four tabs:

- `Information`;
- `Billing`;
- `Referral`;
- `Danger zone`.

## Information

The `Information` tab contains personal account settings.

### Account

Account profile panel.

It shows:

- user avatar;
- account title;
- account title edit button;
- avatar upload hint.

### Avatar

Avatar is used in the user menu and in interface areas where the current user needs to be shown.

To replace the avatar, click the current image. `JPG` and `PNG` files up to 1 MB are supported.

### Account Title

Visible user name.

Title can be changed with the edit button next to the name. During editing:

- `Enter` saves the value;
- `Escape` cancels editing;
- losing focus also saves the value.

Limits:

- minimum 2 characters;
- maximum 80 characters;
- an empty value cannot be saved.

### User ID

Read-only id of the current user.

It is used for diagnostics, support, and precise account identification when a display name is not enough.

### Personal Access Token

Personal access token for the current session.

This token gives the user access to Web3alert [API](api.md) and [MCP servers](mcp-server.md). The available API/MCP capabilities depend on the current account tier.

Treat the token as a secret: do not share it in public chats, screenshots, or documentation.

The token belongs to the account, not to a workspace.

## Billing

The `Billing` tab manages account balance, tier, payments, and coupons.

Billing actions apply to the account, but some purchases can affect projects managed by the account.

### Balance

Account internal balance in EUR.

The balance can be used to:

- buy account plans;
- buy project free-access add-ons;
- buy gift coupons.

### Top Up

Opens balance top-up.

In the dialog, enter the amount in EUR and continue to the payment provider checkout.

After the provider confirms the payment, the funds appear on the internal balance.

### Current Tier

Current account tier.

The card shows:

- tier name;
- date until which the account has entitlement;
- `Renew automatically` switch when a paid tier is active.

### Renew Automatically

Controls automatic renewal of the active tier.

When enabled, the next period can be paid automatically by the selected payment strategy. When disabled, the tier stays active until the end of the paid period, but it is not renewed automatically.

### Account Plans

List of account tiers.

The full list of limits and capabilities for each tier is described on the [Limits](limits.md) page.

### Free

Base tier.

Gives unlimited access to free projects and a limited number of active subscriptions to non-free project triggers.

### Advanced

Paid tier for users who need access to public/private project triggers and basic ability to create their own marketplace entities.

In the current UI, Advanced shows the main capabilities:

- access to public and private project triggers;
- one private project;
- one custom data source.

### Pro

Extended paid tier.

In the current UI, Pro shows the main capabilities:

- access to public and private project triggers;
- up to 5 private projects;
- up to 5 custom data sources.

### Duration

Purchase duration for a paid tier.

Available options depend on billing pricing, usually 1, 3, 6, or 12 months. Some durations can show a discount.

### Pay / Upgrade

Action button on a tier card.

Depending on the current state, it can mean:

- buy a tier;
- renew the current tier for a longer duration;
- upgrade to a higher tier;
- show that the tier is already active;
- show that the tier is locked until the end of the current paid period.

Payment through this button spends funds from the internal balance, so the balance must be sufficient.

### Project Free-Access Add-On

Add-on that opens free access to a project for all service users.

This scenario is useful when a project owner wants to pay for alert access for their community. Users can subscribe to the project as a free project while the add-on is active.

If the add-on is not renewed, the project automatically becomes a public project. Free users' subscriptions to this project will be frozen if they exceed Free tier limits for non-free projects.

The list shows projects the account can manage in billing.

### Project Card

The project free-access add-on card shows:

- project icon and title;
- current add-on status;
- duration;
- `Renew automatically`;
- payment button or current status.

If the add-on is active, the end date of the current period is shown. If payment confirmation is pending, the card shows `Awaiting confirmation`.

### Coupons

The coupons section allows activating a coupon for yourself or buying a gift coupon for another user.

### Redeem Coupon

Field for entering a coupon code.

If the code is active, the corresponding plan is applied to the account.

### Gift Coupon

Purchase of a coupon code for another user.

Select:

- tier: `Advanced` or `Pro`;
- duration.

After purchase confirmation, the amount is charged from the internal balance, and the service shows a coupon code that can be shared with another person.

### Your Gift Coupons

List of gift coupons purchased by the current account.

Each coupon shows:

- code;
- tier;
- duration;
- status;
- copy button for the code.

### Recent Invoices

List of recent billing attempts for account plans and project add-ons.

Each invoice shows:

- invoice name;
- amount;
- status;
- update date.

Invoice status helps understand whether the payment succeeded, is awaiting confirmation, failed, or was canceled.

## Referral

The `Referral` tab manages the account referral link and referral rewards.

### Referral Rate

Reward percentage accrued from purchases made by invited users.

### Referred Users

Number of accounts linked to the current user's referral code.

### Earned Total

Total referral rewards credited to the internal balance.

### Referral Link

Shareable link for inviting new users.

If the referral link has not been created yet, the `Generate link` button creates it. After creation, these actions are available:

- `Copy link`;
- `Copy code`.

New users who come through the referral link are linked to the referral account.

### Claim Referral Code

Allows manually entering a referral code if the user came by invitation but the code was not attached automatically.

The code can be submitted with the `Claim code` button. After successful linking, the field is cleared and the interface shows a success message.

## Danger Zone

The `Danger zone` tab contains account deletion.

### Delete Account

Deletes the account and all its subscriptions.

Before deletion, the confirmation `Are you sure you want to delete this account?` is shown.

After deletion, the current session ends.

This action is irreversible. Use it only if the account is really no longer needed.
