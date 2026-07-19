import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const userRoot = path.join(repositoryRoot, 'user');
const locales = ['en', 'es', 'pt', 'ru', 'zh'];

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

const expectedApiFiles = [
  'api-account.md',
  'api-addresses.md',
  'api-billing.md',
  'api-builder-registry.md',
  'api-data-sources.md',
  'api-links.md',
  'api-project-transfers.md',
  'api-projects.md',
  'api-resources.md',
  'api-subscriptions.md',
  'api-templates.md',
  'api-trigger-import.md',
  'api-triggers.md',
  'api-workspaces.md',
  'api.md',
].sort();

// Audited client-facing projection of createCanonicalApiRoutePlan(true).
// Any runtime route addition must be explicitly classified before it becomes
// part of the public documentation contract.
const publicCanonicalRoutes = [
  'POST /api/token',
  'GET /api/me',
  'DELETE /api/me',
  'PUT /api/me/meta',
  'POST /api/me/avatar',
  'GET /api/me/workspace',
  'PUT /api/me/workspace',
  'GET /api/account/settings',
  'PUT /api/account/settings',
  'POST /api/links',
  'GET /api/links/:key',
  'GET /api/workspaces',
  'GET /api/workspaces/:fullname',
  'PUT /api/workspaces/:fullname',
  'DELETE /api/workspaces/:fullname',
  'POST /api/workspaces/:fullname/avatar',
  'GET /api/workspaces/:workspace/acl',
  'POST /api/workspaces/:workspace/acl',
  'PUT /api/workspaces/:workspace/acl/:entryId',
  'DELETE /api/workspaces/:workspace/acl/:entryId',
  'GET /api/projects',
  'GET /api/projects/create-capability',
  'GET /api/projects/by-link/:token',
  'GET /api/projects/:fullname',
  'PUT /api/projects/:fullname',
  'DELETE /api/projects/:fullname',
  'POST /api/projects/:fullname/access-links',
  'POST /api/projects/:fullname/assets/images',
  'DELETE /api/projects/:fullname/images/:asset',
  'POST /api/projects/:fullname/transfer/plan',
  'POST /api/projects/:fullname/transfer-requests',
  'GET /api/project-transfer-requests',
  'POST /api/project-transfer-requests/:id/accept',
  'POST /api/project-transfer-requests/:id/reject',
  'POST /api/project-transfer-requests/:id/cancel',
  'GET /api/projects/:fullname/templates',
  'POST /api/projects/:fullname/templates',
  'GET /api/projects/:fullname/templates/:id',
  'PUT /api/projects/:fullname/templates/:id',
  'DELETE /api/projects/:fullname/templates/:id',
  'GET /api/projects/:fullname/template',
  'GET /api/triggers',
  'GET /api/triggers/:fullname',
  'PUT /api/triggers/:fullname',
  'PATCH /api/triggers/:fullname',
  'DELETE /api/triggers/:fullname',
  'GET /api/triggers/:fullname/draft',
  'PUT /api/triggers/:fullname/draft',
  'POST /api/triggers/:fullname/draft/validate',
  'GET /api/triggers/:fullname/logs',
  'POST /api/triggers/:fullname/reset-test-status',
  'POST /api/triggers/patch',
  'POST /api/triggers/remove',
  'POST /api/triggers/test',
  'POST /api/triggers/test-block',
  'POST /api/triggers/providers/test',
  'POST /api/triggers/find-latest-block',
  'GET /api/triggers/hypercore/actions',
  'GET /api/triggers/runtime-sources',
  'GET /api/template-helpers',
  'POST /api/triggers/preview',
  'POST /api/triggers/import/evm',
  'POST /api/triggers/import/evm/drafts',
  'POST /api/triggers/import/evm/abi',
  'POST /api/triggers/import/hypercore/drafts',
  'POST /api/triggers/import/solana/drafts',
  'POST /api/triggers/import/solana/idl',
  'POST /api/triggers/import/substrate/drafts',
  'GET /api/triggers/substrate/source',
  'GET /api/triggers/substrate/pallets',
  'GET /api/triggers/substrate/pallet',
  'GET /api/subscriptions',
  'POST /api/subscriptions',
  'GET /api/subscriptions/:id',
  'PUT /api/subscriptions/:id',
  'DELETE /api/subscriptions/:id',
  'PUT /api/subscriptions/:id/state',
  'POST /api/subscriptions/test',
  'GET /api/subscriptions/:id/alerts/history',
  'GET /api/subscriptions/alerts/history',
  'GET /api/resources',
  'GET /api/resources/:fullname',
  'PUT /api/resources/:fullname',
  'DELETE /api/resources/:fullname',
  'POST /api/resources/:fullname/setup-sessions',
  'GET /api/resources/:fullname/setup-sessions/:id',
  'DELETE /api/resources/:fullname/setup-sessions/:id',
  'GET /api/resources/external/:token',
  'POST /api/resources/external/:token',
  'GET /api/addresses',
  'POST /api/addresses',
  'PUT /api/addresses/:id',
  'DELETE /api/addresses/:id',
  'GET /api/actions',
  'GET /api/actions/:fullname',
  'PUT /api/actions/:fullname',
  'DELETE /api/actions/:fullname',
  'GET /api/blueprints',
  'GET /api/blueprints/:fullname',
  'PUT /api/blueprints/:fullname',
  'DELETE /api/blueprints/:fullname',
  'GET /api/apps',
  'GET /api/apps/:fullname',
  'PUT /api/apps/:fullname',
  'DELETE /api/apps/:fullname',
  'GET /api/types',
  'GET /api/types/lookup',
  'GET /api/types/:fullname',
  'PUT /api/types/:fullname',
  'DELETE /api/types/:fullname',
  'GET /api/custom-sources',
  'GET /api/custom-sources/create-capability',
  'POST /api/custom-sources/verify',
  'GET /api/custom-sources/:fullname',
  'PUT /api/custom-sources/:fullname',
  'DELETE /api/custom-sources/:fullname',
  'GET /api/custom-sources/:fullname/logs',
  'POST /api/custom-sources/:fullname/restart',
  'POST /api/custom-sources/:fullname/reset-lag',
  'POST /api/custom-sources/:fullname/test-status',
  'GET /api/billing/overview',
  'GET /api/billing/wallet/overview',
  'POST /api/billing/wallet/crypto-topup',
  'POST /api/billing/wallet/topup/refresh',
  'POST /api/billing/account-plan/balance-purchase',
  'POST /api/billing/account-plan/checkout',
  'POST /api/billing/account-plan/crypto-checkout',
  'POST /api/billing/project-addon/balance-purchase',
  'POST /api/billing/project-addon/checkout',
  'POST /api/billing/project-addon/crypto-checkout',
  'POST /api/billing/coupon/redeem',
  'POST /api/billing/coupon/gift-purchase',
  'GET /api/billing/referral/overview',
  'POST /api/billing/referral/link/create',
  'POST /api/billing/referral/claim',
  'POST /api/billing/subscription/update-renewal',
  'POST /api/billing/crypto-checkout/refresh',
  'POST /api/billing/crypto-checkout/cancel',
];

const excludedCanonicalRoutes = new Map([
  ['POST /api/projects/:fullname/transfer', 'platform-owner direct project transfer'],
  [
    'GET /api/project-transfer-requests/admin/projects',
    'platform-owner project inventory',
  ],
  [
    'GET /api/project-transfer-requests/admin/workspaces',
    'platform-owner workspace inventory',
  ],
  ['POST /api/billing/paynow/crypto/webhook', 'signed billing-provider callback'],
  ['POST /api/billing/xmoney/crypto/webhook', 'signed billing-provider callback'],
  [
    'POST /api/billing/workspace-coupon/overview',
    'common-workspace coupon administration',
  ],
  [
    'POST /api/billing/workspace-coupon/generate',
    'common-workspace coupon administration',
  ],
  [
    'POST /api/billing/workspace-coupon/remove',
    'common-workspace coupon administration',
  ],
]);

function documentedRoutes(markdown) {
  return [...markdown.matchAll(/^#{2,6} (GET|POST|PUT|PATCH|DELETE) (\/api\/\S+)$/gm)]
    .map(([, method, apiPath]) => `${method} ${apiPath}`)
    .sort();
}

function overviewRoutes(markdown) {
  return [...markdown.matchAll(
    /^\| `(GET|POST|PUT|PATCH|DELETE)` \| `(\/api\/[^`]+)` \|/gm,
  )]
    .map(([, method, apiPath]) => `${method} ${apiPath}`)
    .sort();
}

function unique(values) {
  return [...new Set(values)].sort();
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) {
      repeated.add(value);
    }
    seen.add(value);
  }
  return [...repeated].sort();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function routePath(route) {
  return route.slice(route.indexOf(' ') + 1);
}

function routeSection(markdown, route) {
  const heading = `## ${route}`;
  const start = markdown.indexOf(heading);
  if (start == -1) {
    return undefined;
  }

  const next = markdown.indexOf('\n## ', start + heading.length);
  return markdown.slice(start, next == -1 ? markdown.length : next);
}

function headingSection(markdown, heading) {
  const lines = markdown.split('\n');
  const start = lines.findIndex(line => line.trim() == heading);
  if (start == -1) {
    return undefined;
  }

  const level = heading.match(/^#+/)?.[0].length;
  if (level == null) {
    return undefined;
  }

  const next = lines.findIndex(
    (line, index) => index > start && new RegExp(`^#{1,${level}} `).test(line),
  );
  return lines.slice(start, next == -1 ? lines.length : next).join('\n');
}

function markdownTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return undefined;
  }

  const cells = [];
  let cell = '';
  for (const character of trimmed.slice(1, -1)) {
    if (character == '|' && !cell.endsWith('\\')) {
      cells.push(cell.trim());
      cell = '';
      continue;
    }
    cell += character;
  }
  cells.push(cell.trim());
  return cells;
}

function isMarkdownTableDivider(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function markdownTables(markdown) {
  const lines = markdown.split('\n');
  const tables = [];

  for (let index = 0; index < lines.length - 1; index += 1) {
    const header = markdownTableRow(lines[index]);
    const divider = markdownTableRow(lines[index + 1]);
    if (
      header == null
      || divider == null
      || divider.length != header.length
      || !isMarkdownTableDivider(divider)
    ) {
      continue;
    }

    const rows = [];
    let rowIndex = index + 2;
    for (; rowIndex < lines.length; rowIndex += 1) {
      const row = markdownTableRow(lines[rowIndex]);
      if (row == null || row.length != header.length || isMarkdownTableDivider(row)) {
        break;
      }
      rows.push(row);
    }

    tables.push({ header, rows });
    index = rowIndex - 1;
  }

  return tables;
}

function tableField(row) {
  const match = row[0]?.match(/^`([^`]+)`$/);
  return match?.[1];
}

function inlineCodeTokens(cell = '') {
  return [...cell.matchAll(/`([^`]+)`/g)].map(([, token]) => token);
}

function exactValues(actual, expected) {
  return actual.length == expected.length
    && expected.every(value => actual.includes(value));
}

function validateStateSwitchContract(section, requirementTokens) {
  if (section == null) {
    return ['subscription state route section is missing'];
  }

  const contractTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'state'));
  if (contractTables.length != 2) {
    return [`expected two state contract tables, found ${contractTables.length}`];
  }

  const [request, response] = contractTables;
  const requestFields = request.rows.map(tableField);
  const responseFields = response.rows.map(tableField);
  const requestState = request.rows.find(row => tableField(row) == 'state');
  const responseState = response.rows.find(row => tableField(row) == 'state');
  const responseIssue = response.rows.find(row => tableField(row) == 'issue');
  const errors = [];

  if (request.header.length != 3 || !exactValues(requestFields, ['state'])) {
    errors.push('request table must contain exactly the state field');
  }
  if (requestState?.[1] != requirementTokens.required) {
    errors.push('request state field must be required');
  }
  if (!exactValues(inlineCodeTokens(requestState?.[2]), ['on', 'off'])) {
    errors.push('request state enum must be exactly on|off');
  }

  if (
    response.header.length != 3
    || !exactValues(responseFields, ['state', 'issue'])
  ) {
    errors.push('response table must contain exactly state and issue fields');
  }
  if (responseState?.[1] != requirementTokens.required) {
    errors.push('response state field must be required');
  }
  if (responseIssue?.[1] != requirementTokens.optional) {
    errors.push('response issue field must be optional');
  }
  if (
    !exactValues(
      inlineCodeTokens(responseState?.[2]),
      ['on', 'off', 'blocked'],
    )
  ) {
    errors.push('response state enum must be exactly on|off|blocked');
  }

  return errors;
}

function validateMeMetaContract(section, requirementTokens) {
  if (section == null) {
    return ['account metadata route section is missing'];
  }

  const contractTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'nickname'));
  if (contractTables.length != 2) {
    return [
      `account metadata contract must contain request and response nickname tables, found ${contractTables.length}`,
    ];
  }

  const [request, response] = contractTables;
  const requestFields = request.rows.map(tableField);
  const responseFields = response.rows.map(tableField);
  const requestNickname = request.rows.find(row => tableField(row) == 'nickname');
  const responseNickname = response.rows.find(row => tableField(row) == 'nickname');
  const errors = [];

  if (request.header.length != 3 || !exactValues(requestFields, ['nickname'])) {
    errors.push('account metadata request table must contain exactly the nickname field');
  }
  if (requestNickname?.[1] != requirementTokens.required) {
    errors.push('account metadata request nickname field must be required');
  }
  if (!/2(?:-|–)80/.test(requestNickname?.[2] ?? '')) {
    errors.push('account metadata request nickname must document the 2-80 character range');
  }

  if (response.header.length != 3 || !exactValues(responseFields, ['nickname'])) {
    errors.push('account metadata response table must contain exactly the nickname field');
  }
  if (responseNickname?.[1] != requirementTokens.required) {
    errors.push('account metadata response nickname field must be required');
  }
  if (!section.includes('HTTP 200 OK')) {
    errors.push('account metadata response must be HTTP 200 OK');
  }
  if (/types\.md#me\b/i.test(section)) {
    errors.push('account metadata response must not reference the full Me type');
  }

  return errors;
}

function validateTokenContract(section, requirementTokens, contractMarker) {
  if (section == null) {
    return ['token route section is missing'];
  }

  const errors = [];
  const contractMarkers = section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('<!-- api-contract:'));
  if (contractMarkers.length != 1 || contractMarkers[0] != contractMarker) {
    errors.push('token route must carry the exact authentication and issuance contract marker');
  }

  const payloadTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'credentials'));
  if (payloadTables.length != 1) {
    errors.push(`token payload must contain one contract table, found ${payloadTables.length}`);
  } else {
    const [payload] = payloadTables;
    const payloadFields = payload.rows.map(tableField);
    if (payload.header.length != 3 || !exactValues(payloadFields, ['app', 'credentials'])) {
      errors.push('token payload table must contain exactly app and credentials');
    }
    for (const field of ['app', 'credentials']) {
      if (payload.rows.find(row => tableField(row) == field)?.[1] != requirementTokens.required) {
        errors.push(`token payload ${field} field must be required`);
      }
    }
  }

  const tokenResponseLinks = section.match(
    /\[TokenResponse\]\(types\.md#tokenresponse\)/g,
  ) ?? [];
  if (tokenResponseLinks.length != 1) {
    errors.push('token route must reference TokenResponse exactly once');
  }

  const requestBlocks = [...section.matchAll(/```http\s*\n([\s\S]*?)\n```/g)]
    .map(([, request]) => request);
  if (requestBlocks.length != 1) {
    errors.push(`token route must contain one HTTP request example, found ${requestBlocks.length}`);
  } else {
    const [request] = requestBlocks;
    if (!request.startsWith('POST /api/token\n')) {
      errors.push('token request example must use canonical POST /api/token');
    }
    if (/^Authorization\s*:/im.test(request)) {
      errors.push('token request example must not send an Authorization header');
    }
    if (!request.includes('"credential": "<provider-issued-credential>"')) {
      errors.push('token request example must use the safe provider credential placeholder');
    }
  }

  if (!section.includes('"token": "<new-bearer-token>"')) {
    errors.push('token response example must use the safe new Bearer token placeholder');
  }
  if (!section.includes('HTTPS')) {
    errors.push('token route must document HTTPS handling for credentials and returned token');
  }

  return errors;
}

function validateTokenSummaryContract(markdown, contractMarker) {
  const row = markdown
    .split('\n')
    .find(line => line.startsWith('| `POST` | `/api/token` |'));
  if (row == null) {
    return ['token overview row is missing'];
  }

  const errors = [];
  if (!row.includes(contractMarker)) {
    errors.push('token overview row must carry the exact authentication and issuance marker');
  }
  if (!inlineCodeTokens(row).includes('credentials')) {
    errors.push('token overview row must identify provider credentials');
  }
  return errors;
}

function contractMarkers(section) {
  return section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('<!-- api-contract:'));
}

function validateWalletTopupContract(
  markdown,
  createContractMarker,
  refreshContractMarker,
) {
  const errors = [];
  const contracts = [
    {
      route: 'POST /api/billing/wallet/crypto-topup',
      marker: createContractMarker,
      tokens: ['returnUrl', 'cancelUrl', 'externalReference'],
    },
    {
      route: 'POST /api/billing/wallet/topup/refresh',
      marker: refreshContractMarker,
      tokens: ['topupId', 'externalReference'],
    },
  ];

  for (const contract of contracts) {
    const section = routeSection(markdown, contract.route);
    if (section == null) {
      errors.push(`${contract.route} section is missing`);
      continue;
    }
    const markers = contractMarkers(section);
    if (markers.length != 1 || markers[0] != contract.marker) {
      errors.push(`${contract.route} must carry its exact correlation contract marker`);
    }
    const tokens = inlineCodeTokens(section);
    for (const token of contract.tokens) {
      if (!tokens.includes(token)) {
        errors.push(`${contract.route} must visibly document ${token}`);
      }
    }
  }

  return errors;
}

function validateProjectAddonCheckoutLifecycleContract(
  markdown,
  hostedContractMarker,
  cryptoContractMarker,
  latePaymentContractMarker,
) {
  const errors = [];
  const contracts = [
    {
      route: 'POST /api/billing/project-addon/checkout',
      marker: hostedContractMarker,
      tokens: [
        'pending-hosted-retry',
        'subscriptionId',
        'invoiceId',
        'externalReference',
        'checkout',
      ],
    },
    {
      route: 'POST /api/billing/project-addon/crypto-checkout',
      marker: cryptoContractMarker,
      tokens: [
        'pending-linked-order-retry',
        'providerOrderId',
        'paymentUrl',
        'ambiguous-provider-creation-or-linkage',
        'fail-closed-pending',
        'cancel-or-reconcile-before-new-attempt',
      ],
    },
    {
      route: 'POST /api/billing/crypto-checkout/refresh',
      marker: latePaymentContractMarker,
      tokens: [
        'late-payment-after-cancel-or-project-transfer',
        'no-reactivation',
        'reconciliation-or-refund',
      ],
    },
    {
      route: 'POST /api/billing/crypto-checkout/cancel',
      marker: latePaymentContractMarker,
      tokens: [
        'late-payment-after-cancel-or-project-transfer',
        'no-reactivation',
        'reconciliation-or-refund',
      ],
    },
  ];

  for (const contract of contracts) {
    const section = routeSection(markdown, contract.route);
    if (section == null) {
      errors.push(`${contract.route} section is missing`);
      continue;
    }

    const markers = contractMarkers(section);
    if (markers.length != 1 || markers[0] != contract.marker) {
      errors.push(`${contract.route} must carry its exact checkout lifecycle marker`);
    }

    const visibleSection = section.replace(/<!--[\s\S]*?-->/g, '');
    const visibleTokens = inlineCodeTokens(visibleSection);
    for (const token of contract.tokens) {
      if (!visibleTokens.includes(token)) {
        errors.push(`${contract.route} must visibly document ${token}`);
      }
    }

    if (/\/api\/v\d+(?:\/|\b)/.test(section)) {
      errors.push(`${contract.route} must use the canonical /api route`);
    }
  }

  return errors;
}

function validateProjectTransferBillingContinuityContract(
  markdown,
  contractMarker,
  blockingStatuses,
) {
  const errors = [];
  const routes = [
    'POST /api/projects/:fullname/transfer/plan',
    'POST /api/projects/:fullname/transfer-requests',
    'POST /api/project-transfer-requests/:id/accept',
  ];

  for (const route of routes) {
    const section = routeSection(markdown, route);
    if (section == null) {
      errors.push(`${route} section is missing`);
      continue;
    }

    const markers = contractMarkers(section);
    if (markers.length != 1 || markers[0] != contractMarker) {
      errors.push(`${route} must carry its exact billing continuity contract marker`);
    }

    const visibleSection = section.replace(/<!--[\s\S]*?-->/g, '');
    const visibleTokens = inlineCodeTokens(visibleSection);
    for (const status of blockingStatuses) {
      if (!visibleTokens.includes(status)) {
        errors.push(`${route} must visibly document blocking status ${status}`);
      }
    }
  }

  return errors;
}

function validateBalancePurchaseContract(
  section,
  requirementTokens,
  contractMarker,
  {
    subject,
    requestFields,
    requiredFields,
    optionalFields,
    enumFields,
    sameIntentTokens,
    conflictingPayloadTokens,
  },
) {
  if (section == null) {
    return [`${subject} section is missing`];
  }

  const errors = [];
  const markers = contractMarkers(section);
  if (markers.length != 1 || markers[0] != contractMarker) {
    errors.push(
      `${subject} must carry its exact idempotency contract marker`,
    );
  }

  const requestTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'requestId'));
  if (requestTables.length != 1) {
    errors.push(
      `${subject} must contain one request table, found ${requestTables.length}`,
    );
  } else {
    const [request] = requestTables;
    const fields = request.rows.map(tableField);
    if (request.header.length != 3 || !exactValues(fields, requestFields)) {
      errors.push(
        `${subject} request fields must be exactly ${requestFields.join(', ')}`,
      );
    }

    for (const field of requiredFields) {
      if (
        request.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.required
      ) {
        errors.push(`${subject} ${field} must be required`);
      }
    }
    for (const field of optionalFields) {
      if (
        request.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.optional
      ) {
        errors.push(`${subject} ${field} must be optional`);
      }
    }

    for (const [field, expectedValues] of enumFields) {
      const row = request.rows.find(item => tableField(item) == field);
      if (!exactValues(inlineCodeTokens(row?.[2]), expectedValues)) {
        errors.push(`${subject} ${field} must be ${expectedValues.join('|')}`);
      }
    }

    const requestId = request.rows.find(row => tableField(row) == 'requestId');
    if (!/8(?:-|–|\.\.)128/.test(requestId?.[2] ?? '')) {
      errors.push(`${subject} requestId must document 8-128 characters`);
    }
    if (
      !/RFC 3986/i.test(requestId?.[2] ?? '')
      || !/unreserved/i.test(requestId?.[2] ?? '')
    ) {
      errors.push(
        `${subject} requestId must document RFC 3986 unreserved characters`,
      );
    }
    if (
      !exactValues(
        inlineCodeTokens(requestId?.[2]),
        ['A-Z', 'a-z', '0-9', '.', '_', '~', '-'],
      )
    ) {
      errors.push(
        `${subject} requestId charset must be exactly A-Z a-z 0-9 . _ ~ -`,
      );
    }

    const autoRenew = request.rows.find(row => tableField(row) == 'autoRenew');
    if (!inlineCodeTokens(autoRenew?.[2]).includes('false')) {
      errors.push(`${subject} autoRenew must default to false`);
    }
  }

  const behaviorTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'exact-replay'));
  if (behaviorTables.length != 1) {
    errors.push(
      `${subject} must contain one visible idempotency behavior table, found ${behaviorTables.length}`,
    );
  } else {
    const [behavior] = behaviorTables;
    const expectedBehavior = new Map([
      ['same-intent', sameIntentTokens],
      [
        'exact-replay',
        ['original-subscriptionId', 'original-invoiceId', 'no-second-debit'],
      ],
      ['conflicting-payload', conflictingPayloadTokens],
      ['new-intent', ['new-requestId']],
      [
        'missing-requestId',
        [
          'backward-compatible',
          'not-retry-safe',
          'not-idempotent-across-HTTP-attempts',
        ],
      ],
    ]);
    const fields = behavior.rows.map(tableField);
    if (
      behavior.header.length != 2
      || !exactValues(fields, [...expectedBehavior.keys()])
    ) {
      errors.push(
        `${subject} idempotency behavior rows are incomplete`,
      );
    }
    for (const [field, expectedTokens] of expectedBehavior) {
      const row = behavior.rows.find(item => tableField(item) == field);
      if (!exactValues(inlineCodeTokens(row?.[1]), expectedTokens)) {
        errors.push(
          `${subject} ${field} behavior must be ${expectedTokens.join(', ')}`,
        );
      }
    }
  }

  const responseTables = markdownTables(section)
    .filter(table => {
      const fields = table.rows.map(tableField);
      return fields.includes('subscriptionId') || fields.includes('invoiceId');
    });
  if (responseTables.length != 1) {
    errors.push(
      `${subject} must contain one response table, found ${responseTables.length}`,
    );
  } else {
    const [response] = responseTables;
    const fields = response.rows.map(tableField);
    if (
      response.header.length != 3
      || !exactValues(fields, ['subscriptionId', 'invoiceId'])
    ) {
      errors.push(
        `${subject} response fields must be exactly subscriptionId and invoiceId`,
      );
    }
    for (const field of ['subscriptionId', 'invoiceId']) {
      if (
        response.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.required
      ) {
        errors.push(`${subject} response ${field} must be required`);
      }
    }
  }

  if (!section.includes('HTTP 200 OK')) {
    errors.push(`${subject} response must be HTTP 200 OK`);
  }
  if (/\/api\/v\d+(?:\/|\b)/.test(section)) {
    errors.push(`${subject} must use the canonical /api route`);
  }

  return errors;
}

function validateAccountPlanBalancePurchaseContract(
  section,
  requirementTokens,
  contractMarker,
) {
  return validateBalancePurchaseContract(
    section,
    requirementTokens,
    contractMarker,
    {
      subject: 'account plan balance purchase',
      requestFields: ['planId', 'durationMonths', 'autoRenew', 'requestId'],
      requiredFields: ['planId', 'durationMonths'],
      optionalFields: ['autoRenew', 'requestId'],
      enumFields: new Map([
        ['planId', ['advanced', 'pro']],
        ['durationMonths', ['1', '3', '6', '12']],
      ]),
      sameIntentTokens: ['same-requestId', 'same-payload'],
      conflictingPayloadTokens: ['rejected'],
    },
  );
}

function validateProjectAddonBalancePurchaseContract(
  section,
  requirementTokens,
  contractMarker,
) {
  const intentFields = [
    'projectFullname',
    'addonCode',
    'durationMonths',
    'autoRenew',
  ];

  return validateBalancePurchaseContract(
    section,
    requirementTokens,
    contractMarker,
    {
      subject: 'project add-on balance purchase',
      requestFields: [...intentFields, 'requestId'],
      requiredFields: ['projectFullname', 'addonCode', 'durationMonths'],
      optionalFields: ['autoRenew', 'requestId'],
      enumFields: new Map([
        ['addonCode', ['project-free-access']],
        ['durationMonths', ['1', '3', '6', '12']],
      ]),
      sameIntentTokens: ['same-requestId', 'same-full-payload', ...intentFields],
      conflictingPayloadTokens: [...intentFields, 'rejected'],
    },
  );
}

function validateCouponRedeemContract(
  section,
  requirementTokens,
  contractMarker,
) {
  const subject = 'coupon redeem';
  if (section == null) {
    return [`${subject} section is missing`];
  }

  const errors = [];
  const markers = contractMarkers(section);
  if (markers.length != 1 || markers[0] != contractMarker) {
    errors.push(`${subject} must carry its exact lifecycle contract marker`);
  }

  const requestTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'code'));
  if (requestTables.length != 1) {
    errors.push(
      `${subject} must contain one request table, found ${requestTables.length}`,
    );
  } else {
    const [request] = requestTables;
    const fields = request.rows.map(tableField);
    const code = request.rows.find(row => tableField(row) == 'code');
    if (request.header.length != 3 || !exactValues(fields, ['code'])) {
      errors.push(`${subject} request fields must be exactly code`);
    }
    if (code?.[1] != requirementTokens.required) {
      errors.push(`${subject} code must be required`);
    }
    if (
      !exactValues(
        inlineCodeTokens(code?.[2]),
        ['trim', 'case-insensitive'],
      )
    ) {
      errors.push(
        `${subject} code must visibly document trim and case-insensitive normalization`,
      );
    }
  }

  const behaviorTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'same-account-retry'));
  if (behaviorTables.length != 1) {
    errors.push(
      `${subject} must contain one visible lifecycle behavior table, found ${behaviorTables.length}`,
    );
  } else {
    const [behavior] = behaviorTables;
    const expectedBehavior = new Map([
      ['code-normalization', ['trim', 'case-insensitive']],
      [
        'same-account-retry',
        [
          'same-couponId',
          'same-subscriptionId',
          'same-invoiceId',
          'no-second-application',
        ],
      ],
      [
        'unavailable-or-unsafe',
        [
          'redeemed-by-another-account',
          'deleted',
          'invalid',
          'unsafe-subscription-lineage',
          'fail-closed',
        ],
      ],
      [
        'paid-account-plan-period',
        ['extend', 'overlay', 'new-term', 'as-applicable'],
      ],
    ]);
    const fields = behavior.rows.map(tableField);
    if (
      behavior.header.length != 2
      || !exactValues(fields, [...expectedBehavior.keys()])
    ) {
      errors.push(`${subject} lifecycle behavior rows are incomplete`);
    }
    for (const [field, expectedTokens] of expectedBehavior) {
      const row = behavior.rows.find(item => tableField(item) == field);
      if (!exactValues(inlineCodeTokens(row?.[1]), expectedTokens)) {
        errors.push(
          `${subject} ${field} behavior must be ${expectedTokens.join(', ')}`,
        );
      }
    }
  }

  const responseTables = markdownTables(section)
    .filter(table => {
      const fields = table.rows.map(tableField);
      return fields.includes('couponId')
        || fields.includes('subscriptionId')
        || fields.includes('invoiceId');
    });
  if (responseTables.length != 1) {
    errors.push(
      `${subject} must contain one response table, found ${responseTables.length}`,
    );
  } else {
    const [response] = responseTables;
    const expectedFields = ['couponId', 'subscriptionId', 'invoiceId'];
    const fields = response.rows.map(tableField);
    if (
      response.header.length != 3
      || !exactValues(fields, expectedFields)
    ) {
      errors.push(
        `${subject} response fields must be exactly ${expectedFields.join(', ')}`,
      );
    }
    for (const field of expectedFields) {
      if (
        response.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.required
      ) {
        errors.push(`${subject} response ${field} must be required`);
      }
    }
  }

  if (!section.includes('HTTP 200 OK')) {
    errors.push(`${subject} response must be HTTP 200 OK`);
  }
  if (/\/api\/v\d+(?:\/|\b)/.test(section)) {
    errors.push(`${subject} must use the canonical /api route`);
  }

  return errors;
}

function validateGiftCouponPurchaseContract(
  section,
  requirementTokens,
  contractMarker,
) {
  const subject = 'gift coupon purchase';
  if (section == null) {
    return [`${subject} section is missing`];
  }

  const errors = [];
  const markers = contractMarkers(section);
  if (markers.length != 1 || markers[0] != contractMarker) {
    errors.push(`${subject} must carry its exact idempotency contract marker`);
  }

  const requestTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'requestId'));
  if (requestTables.length != 1) {
    errors.push(
      `${subject} must contain one request table, found ${requestTables.length}`,
    );
  } else {
    const [request] = requestTables;
    const fields = request.rows.map(tableField);
    if (
      request.header.length != 3
      || !exactValues(fields, ['planId', 'durationMonths', 'requestId'])
    ) {
      errors.push(
        `${subject} request fields must be exactly planId, durationMonths, requestId`,
      );
    }

    for (const field of ['planId', 'durationMonths']) {
      if (
        request.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.required
      ) {
        errors.push(`${subject} ${field} must be required`);
      }
    }
    if (
      request.rows.find(row => tableField(row) == 'requestId')?.[1]
      != requirementTokens.optional
    ) {
      errors.push(`${subject} requestId must be optional`);
    }

    const planId = request.rows.find(row => tableField(row) == 'planId');
    if (
      !exactValues(
        inlineCodeTokens(planId?.[2]),
        ['advanced', 'pro'],
      )
    ) {
      errors.push(`${subject} planId must be advanced|pro`);
    }

    const durationMonths = request.rows.find(
      row => tableField(row) == 'durationMonths',
    );
    if (
      !exactValues(
        inlineCodeTokens(durationMonths?.[2]),
        ['1', '3', '6', '12'],
      )
    ) {
      errors.push(`${subject} durationMonths must be 1|3|6|12`);
    }

    const requestId = request.rows.find(row => tableField(row) == 'requestId');
    if (!/8(?:-|–|\.\.)128/.test(requestId?.[2] ?? '')) {
      errors.push(`${subject} requestId must document 8-128 characters`);
    }
    if (
      !/RFC 3986/i.test(requestId?.[2] ?? '')
      || !/unreserved/i.test(requestId?.[2] ?? '')
    ) {
      errors.push(
        `${subject} requestId must document RFC 3986 unreserved characters`,
      );
    }
    if (
      !exactValues(
        inlineCodeTokens(requestId?.[2]),
        ['A-Z', 'a-z', '0-9', '.', '_', '~', '-'],
      )
    ) {
      errors.push(
        `${subject} requestId charset must be exactly A-Z a-z 0-9 . _ ~ -`,
      );
    }
  }

  const behaviorTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'exact-replay'));
  if (behaviorTables.length != 1) {
    errors.push(
      `${subject} must contain one visible idempotency behavior table, found ${behaviorTables.length}`,
    );
  } else {
    const [behavior] = behaviorTables;
    const expectedBehavior = new Map([
      [
        'same-intent',
        ['same-requestId', 'same-planId', 'same-durationMonths'],
      ],
      [
        'exact-replay',
        [
          'same-couponId',
          'same-code',
          'no-second-debit',
          'no-second-referral-reward',
        ],
      ],
      ['conflicting-payload', ['rejected']],
      ['new-intent', ['new-requestId']],
      [
        'missing-requestId',
        [
          'backward-compatible',
          'not-retry-safe',
          'not-idempotent-across-HTTP-attempts',
        ],
      ],
    ]);
    const fields = behavior.rows.map(tableField);
    if (
      behavior.header.length != 2
      || !exactValues(fields, [...expectedBehavior.keys()])
    ) {
      errors.push(`${subject} idempotency behavior rows are incomplete`);
    }
    for (const [field, expectedTokens] of expectedBehavior) {
      const row = behavior.rows.find(item => tableField(item) == field);
      if (!exactValues(inlineCodeTokens(row?.[1]), expectedTokens)) {
        errors.push(
          `${subject} ${field} behavior must be ${expectedTokens.join(', ')}`,
        );
      }
    }
  }

  const responseTables = markdownTables(section)
    .filter(table => {
      const fields = table.rows.map(tableField);
      return fields.includes('couponId') || fields.includes('code');
    });
  if (responseTables.length != 1) {
    errors.push(
      `${subject} must contain one response table, found ${responseTables.length}`,
    );
  } else {
    const [response] = responseTables;
    const expectedFields = ['couponId', 'code'];
    const fields = response.rows.map(tableField);
    if (
      response.header.length != 3
      || !exactValues(fields, expectedFields)
    ) {
      errors.push(
        `${subject} response fields must be exactly ${expectedFields.join(', ')}`,
      );
    }
    for (const field of expectedFields) {
      if (
        response.rows.find(row => tableField(row) == field)?.[1]
        != requirementTokens.required
      ) {
        errors.push(`${subject} response ${field} must be required`);
      }
    }
  }

  if (!section.includes('HTTP 200 OK')) {
    errors.push(`${subject} response must be HTTP 200 OK`);
  }
  if (/\/api\/v\d+(?:\/|\b)/.test(section)) {
    errors.push(`${subject} must use the canonical /api route`);
  }

  return errors;
}

function validateLinkResponseTable(section, requirementTokens, subject) {
  const responseTables = markdownTables(section)
    .filter(table => exactValues(table.rows.map(tableField), ['key', 'uri']));
  const errors = [];

  if (responseTables.length != 1) {
    return [
      `${subject} must contain one Link response table, found ${responseTables.length}`,
    ];
  }

  const [response] = responseTables;
  if (response.header.length != 3) {
    errors.push(`${subject} Link response table must have exactly three columns`);
  }
  for (const field of ['key', 'uri']) {
    if (response.rows.find(row => tableField(row) == field)?.[1] != requirementTokens.required) {
      errors.push(`${subject} Link response ${field} field must be required`);
    }
  }

  return errors;
}

function validateLinkCreateContract(section, requirementTokens, contractMarker) {
  if (section == null) {
    return ['link create route section is missing'];
  }

  const errors = [];
  if (
    contractMarkers(section).length != 1
    || contractMarkers(section)[0] != contractMarker
  ) {
    errors.push('link create route must carry the exact anonymous URI contract marker');
  }

  const payloadTables = markdownTables(section)
    .filter(table => exactValues(table.rows.map(tableField), ['uri']));
  if (payloadTables.length != 1) {
    errors.push(`link create payload must contain one uri table, found ${payloadTables.length}`);
  } else {
    const [payload] = payloadTables;
    if (payload.header.length != 3) {
      errors.push('link create payload table must have exactly three columns');
    }
    if (payload.rows[0]?.[1] != requirementTokens.required) {
      errors.push('link create uri field must be required');
    }
  }

  errors.push(...validateLinkResponseTable(
    section,
    requirementTokens,
    'link create response',
  ));

  const visibleSection = section.replace(/<!--[\s\S]*?-->/g, '');
  if (!visibleSection.includes('`/`') || !visibleSection.includes('`/link/`')) {
    errors.push('link create route must visibly document both URI path constraints');
  }
  if (
    !visibleSection.includes('HTTP 400 Bad Request')
    || !visibleSection.includes('`invalid uri`')
  ) {
    errors.push('link create route must document the HTTP 400 invalid-uri response');
  }

  const requestBlocks = [...visibleSection.matchAll(/```http\s*\n([\s\S]*?)\n```/g)]
    .map(([, request]) => request);
  if (requestBlocks.length != 1) {
    errors.push(`link create route must contain one HTTP request example, found ${requestBlocks.length}`);
  } else {
    const [request] = requestBlocks;
    if (!request.startsWith('POST /api/links\n')) {
      errors.push('link create request example must use canonical POST /api/links');
    }
    if (/^Authorization\s*:/im.test(request)) {
      errors.push('anonymous link create request must not send an Authorization header');
    }
  }

  return errors;
}

function validateLinkGetContract(section, requirementTokens, contractMarker) {
  if (section == null) {
    return ['link get route section is missing'];
  }

  const errors = [];
  if (
    contractMarkers(section).length != 1
    || contractMarkers(section)[0] != contractMarker
  ) {
    errors.push('link get route must carry the exact anonymous not-found contract marker');
  }

  errors.push(...validateLinkResponseTable(
    section,
    requirementTokens,
    'link get response',
  ));

  const visibleSection = section.replace(/<!--[\s\S]*?-->/g, '');
  if (
    !visibleSection.includes('HTTP 400 Bad Request')
    || !visibleSection.includes('`shortcut not found`')
  ) {
    errors.push('link get route must document the exact HTTP 400 not-found response');
  }

  return errors;
}

function validateWorkspaceAvatarContract(
  section,
  requirementTokens,
  expectedResponseFields,
) {
  if (section == null) {
    return ['workspace avatar route section is missing'];
  }

  const responseTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'workspace'));
  if (responseTables.length != 1) {
    return [
      `workspace avatar contract must contain one response table, found ${responseTables.length}`,
    ];
  }

  const [response] = responseTables;
  const responseFields = response.rows.map(tableField);
  const workspace = response.rows.find(row => tableField(row) == 'workspace');
  const errors = [];

  if (
    response.header.length != 3
    || !exactValues(responseFields, expectedResponseFields)
  ) {
    errors.push(
      `workspace avatar response table must contain exactly ${expectedResponseFields.join(', ')}`,
    );
  }
  for (const field of expectedResponseFields) {
    const row = response.rows.find(item => tableField(item) == field);
    if (row?.[1] != requirementTokens.required) {
      errors.push(`workspace avatar response ${field} field must be required`);
    }
  }
  if (!section.includes('HTTP 200 OK')) {
    errors.push('workspace avatar response must be HTTP 200 OK');
  }
  if (!/types\.md#workspaceview\b/i.test(workspace?.[2] ?? '')) {
    errors.push('workspace avatar response workspace field must reference WorkspaceView');
  }
  if (/avataruploadresult/i.test(section)) {
    errors.push('workspace avatar response must not reference account AvatarUploadResult');
  }

  return errors;
}

function validateEmpty204Contract(
  section,
  contractMarker,
  subject,
  forbiddenReferences = ['OperationResult'],
) {
  if (section == null) {
    return [`${subject} route section is missing`];
  }

  const errors = [];
  const contractMarkers = section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('<!-- api-contract:'));
  if (contractMarkers.length != 1 || contractMarkers[0] != contractMarker) {
    errors.push(`${subject} response must carry the exact 204/empty contract marker`);
  }
  if (!section.includes('HTTP 204 No Content')) {
    errors.push(`${subject} response must be HTTP 204 No Content`);
  }
  for (const reference of forbiddenReferences) {
    if (section.toLowerCase().includes(reference.toLowerCase())) {
      errors.push(`${subject} response must not reference ${reference}`);
    }
  }
  return errors;
}

function validateAddressTypeContract(section, requirementTokens, expectedAddressTypes, operation) {
  if (section == null) {
    return [`address ${operation} route section is missing`];
  }

  const errors = [];
  const contractTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'type'));
  if (contractTables.length != 1) {
    return [
      `address ${operation} payload must contain one type contract table, found ${contractTables.length}`,
    ];
  }

  const typeRows = contractTables[0].rows.filter(row => tableField(row) == 'type');
  if (typeRows.length != 1) {
    errors.push(`address ${operation} payload must contain exactly one type field`);
    return errors;
  }

  const typeRow = typeRows[0];
  if (typeRow[1] != requirementTokens.required) {
    errors.push(`address ${operation} type field must be required`);
  }
  if (!exactValues(inlineCodeTokens(typeRow[2]), expectedAddressTypes)) {
    errors.push(
      `address ${operation} type enum must be exactly ${expectedAddressTypes.join('|')}`,
    );
  }
  return errors;
}

function validateAddressEntryTypeContract(markdown, expectedAddressTypes) {
  const section = headingSection(markdown, '### AddressEntry');
  if (section == null) {
    return ['AddressEntry section is missing'];
  }

  const contractTables = markdownTables(section)
    .filter(table => table.rows.some(row => tableField(row) == 'type'));
  if (contractTables.length != 1) {
    return [
      `AddressEntry must contain one type contract table, found ${contractTables.length}`,
    ];
  }

  const typeRows = contractTables[0].rows.filter(row => tableField(row) == 'type');
  if (typeRows.length != 1) {
    return [`AddressEntry must contain exactly one type field, found ${typeRows.length}`];
  }

  const actualTypes = [...typeRows[0][1].matchAll(/"([^"]+)"/g)]
    .map(([, type]) => type);
  if (!exactValues(actualTypes, expectedAddressTypes)) {
    return [`AddressEntry type enum must be exactly ${expectedAddressTypes.join('|')}`];
  }
  return [];
}

function compareRouteSets(actual, expected, context) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  const missing = expected.filter(route => !actualSet.has(route));
  const extra = actual.filter(route => !expectedSet.has(route));

  if (missing.length > 0) {
    issues.push(`${context}: missing routes: ${missing.join(', ')}`);
  }
  if (extra.length > 0) {
    issues.push(`${context}: unexpected routes: ${extra.join(', ')}`);
  }
}

function validateResourceCapabilityContract(section, marker) {
  if (section == null) {
    return ['external resource capability route section is missing'];
  }

  const markerCount = section.split(marker).length - 1;
  if (markerCount != 1) {
    return [
      'external resource capability route must carry exactly one persistent-token security marker',
    ];
  }

  return [];
}

const issues = [];
const files = await listMarkdownFiles(userRoot);
const expectedPublicRoutes = unique(publicCanonicalRoutes);
const empty204ContractMarker = '<!-- api-contract: response=204; body=empty -->';
const tokenContractMarker = '<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent; first-login=may-provision-account-workspace -->';
const tokenSummaryContractMarker = '<!-- api-contract: auth=provider-credentials; existing-bearer=not-required; token=fresh-persistent -->';
const linkCreateContractMarker = '<!-- api-contract: auth=anonymous; uri=leading-slash-required; uri-prefix=/link/-forbidden; invalid-uri=400; response=Link-key-uri -->';
const linkGetContractMarker = '<!-- api-contract: auth=anonymous; not-found=400; response=Link-key-uri -->';
const resourceCapabilityContractMarker = '<!-- api-contract: resource-token=persistent-bearer-capability; setup-token=separate-one-time-15m; transport=https-only; logging=forbidden -->';
const projectTransferBillingContinuityContractMarker = '<!-- api-contract: project-addon-transfer-block=draft-pending_activation-active-past_due-cancel_at_period_end; resolution=cancel-or-wait-until-ended; recurring-billing-owner-continuity=fail-closed -->';
const projectAddonHostedCheckoutContractMarker = '<!-- api-contract: pending-hosted-retry=existing-subscriptionId-invoiceId-externalReference-and-fresh-signed-form -->';
const projectAddonCryptoCheckoutContractMarker = '<!-- api-contract: pending-linked-provider-order-retry=same-providerOrderId-and-paymentUrl; ambiguous-provider-creation-or-linkage=fail-closed-pending; next-attempt=cancel-or-reconcile-first -->';
const projectAddonLatePaymentContractMarker = '<!-- api-contract: late-payment-after-cancel-or-project-transfer=no-reactivation; disposition=reconciliation-or-refund -->';
const walletTopupCreateContractMarker = '<!-- api-contract: redirect-query=authoritative-externalReference; existing-value=replaced -->';
const walletTopupRefreshContractMarker = '<!-- api-contract: target=exact-topupId-or-externalReference; recent-topup-fallback=forbidden; result-correlation=fail-closed-on-missing-or-ambiguous -->';
const accountPlanBalancePurchaseContractMarker = '<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-payload=rejected; new-intent=new-requestId -->';
const projectAddonBalancePurchaseContractMarker = '<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; autoRenew-default=false; same-intent=same-requestId-and-full-payload; exact-replay=original-subscriptionId-and-invoiceId-without-second-debit; conflicting-projectFullname-addonCode-durationMonths-autoRenew=rejected; new-intent=new-requestId -->';
const couponRedeemContractMarker = '<!-- api-contract: code=required-trim-case-insensitive; same-account-retry=same-couponId-same-subscriptionId-same-invoiceId-without-second-application; redeemed-by-another-account-deleted-invalid-or-unsafe-subscription-lineage=fail-closed; paid-account-plan-period=extend-overlay-or-new-term-as-applicable; response=couponId-subscriptionId-invoiceId -->';
const giftCouponPurchaseContractMarker = '<!-- api-contract: requestId=optional-backward-compatible-8-128-rfc3986-unreserved; requestId-omitted=not-retry-safe-across-http-attempts; same-intent=same-requestId-planId-durationMonths; exact-replay=same-couponId-and-code-without-second-debit-or-referral-reward; conflicting-payload=rejected; new-intent=new-requestId; response=couponId-code -->';
const projectTransferBlockingSubscriptionStatuses = [
  'draft',
  'pending_activation',
  'active',
  'past_due',
  'cancel_at_period_end',
];
const expectedAddressTypes = ['plain', 'ss58', 'evm', 'solana', 'bitcoin', 'cosmos'];
const expectedWorkspaceAvatarResponseFields = [
  'url',
  'fileName',
  'extension',
  'size',
  'workspace',
];
const fixtureRequirementTokens = { required: 'Yes', optional: 'No' };
const validAccountPlanBalancePurchaseFixture = `
${accountPlanBalancePurchaseContractMarker}

| Field | Required | Description |
| --- | --- | --- |
| \`planId\` | Yes | \`advanced\` or \`pro\`. |
| \`durationMonths\` | Yes | \`1\`, \`3\`, \`6\`, or \`12\`. |
| \`autoRenew\` | No | Defaults to \`false\`. |
| \`requestId\` | No | 8-128 RFC 3986 unreserved characters: \`A-Z\`, \`a-z\`, \`0-9\`, \`.\`, \`_\`, \`~\`, and \`-\`. |

| Case | Behavior |
| --- | --- |
| \`same-intent\` | \`same-requestId\` and \`same-payload\`. |
| \`exact-replay\` | \`original-subscriptionId\`, \`original-invoiceId\`, and \`no-second-debit\`. |
| \`conflicting-payload\` | \`rejected\`. |
| \`new-intent\` | \`new-requestId\`. |
| \`missing-requestId\` | \`backward-compatible\`, \`not-retry-safe\`, and \`not-idempotent-across-HTTP-attempts\`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`subscriptionId\` | Yes | Subscription. |
| \`invoiceId\` | Yes | Invoice. |
`;
const invalidAccountPlanBalancePurchaseFixtures = [
  {
    name: 'marker-only exact replay semantics',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      '| `exact-replay` | `original-subscriptionId`, `original-invoiceId`, and `no-second-debit`. |',
      '| `exact-replay` | `original-subscriptionId`, `original-invoiceId`, and `second-debit-allowed`. |',
    ),
  },
  {
    name: 'marker-only conflict semantics',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      '| `conflicting-payload` | `rejected`. |',
      '| `conflicting-payload` | `accepted`. |',
    ),
  },
  {
    name: 'missing visible new intent semantics',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      '| `new-intent` | `new-requestId`. |\n',
      '',
    ),
  },
  {
    name: 'missing requestId retry-safety warning',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      '| `missing-requestId` | `backward-compatible`, `not-retry-safe`, and `not-idempotent-across-HTTP-attempts`. |',
      '| `missing-requestId` | `backward-compatible`. |',
    ),
  },
  {
    name: 'missing autoRenew default',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      '| `autoRenew` | No | Defaults to `false`. |',
      '| `autoRenew` | No | Optional setting. |',
    ),
  },
  {
    name: 'incomplete requestId charset',
    markdown: validAccountPlanBalancePurchaseFixture.replace(
      ', `~`',
      '',
    ),
  },
  {
    name: 'versioned API path',
    markdown: `${validAccountPlanBalancePurchaseFixture}\nPOST /api/v2/billing/account-plan/balance-purchase\n`,
  },
];

if (
  validateAccountPlanBalancePurchaseContract(
    validAccountPlanBalancePurchaseFixture,
    fixtureRequirementTokens,
    accountPlanBalancePurchaseContractMarker,
  ).length > 0
) {
  issues.push('account plan balance purchase validator rejects its valid fixture');
}
for (const fixture of invalidAccountPlanBalancePurchaseFixtures) {
  if (
    validateAccountPlanBalancePurchaseContract(
      fixture.markdown,
      fixtureRequirementTokens,
      accountPlanBalancePurchaseContractMarker,
    ).length == 0
  ) {
    issues.push(
      `account plan balance purchase validator accepts ${fixture.name}`,
    );
  }
}

const validProjectAddonBalancePurchaseFixture = `
${projectAddonBalancePurchaseContractMarker}

| Field | Required | Description |
| --- | --- | --- |
| \`projectFullname\` | Yes | Project identifier. |
| \`addonCode\` | Yes | \`project-free-access\`. |
| \`durationMonths\` | Yes | \`1\`, \`3\`, \`6\`, or \`12\`. |
| \`autoRenew\` | No | Defaults to \`false\`. |
| \`requestId\` | No | 8-128 RFC 3986 unreserved characters: \`A-Z\`, \`a-z\`, \`0-9\`, \`.\`, \`_\`, \`~\`, and \`-\`. |

| Case | Behavior |
| --- | --- |
| \`same-intent\` | \`same-requestId\`, \`same-full-payload\`, \`projectFullname\`, \`addonCode\`, \`durationMonths\`, and \`autoRenew\`. |
| \`exact-replay\` | \`original-subscriptionId\`, \`original-invoiceId\`, and \`no-second-debit\`. |
| \`conflicting-payload\` | \`projectFullname\`, \`addonCode\`, \`durationMonths\`, or \`autoRenew\` changed: \`rejected\`. |
| \`new-intent\` | \`new-requestId\`. |
| \`missing-requestId\` | \`backward-compatible\`, \`not-retry-safe\`, and \`not-idempotent-across-HTTP-attempts\`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`subscriptionId\` | Yes | Subscription. |
| \`invoiceId\` | Yes | Invoice. |
`;
const invalidProjectAddonBalancePurchaseFixtures = [
  {
    name: 'missing projectFullname request field',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `projectFullname` | Yes | Project identifier. |\n',
      '',
    ),
  },
  {
    name: 'incorrect addonCode enum',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `addonCode` | Yes | `project-free-access`. |',
      '| `addonCode` | Yes | `project-free-access` or `project-pro-access`. |',
    ),
  },
  {
    name: 'incomplete durationMonths enum',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '`1`, `3`, `6`, or `12`',
      '`1`, `3`, or `6`',
    ),
  },
  {
    name: 'missing autoRenew default',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `autoRenew` | No | Defaults to `false`. |',
      '| `autoRenew` | No | Optional setting. |',
    ),
  },
  {
    name: 'required backward-compatible requestId',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `requestId` | No |',
      '| `requestId` | Yes |',
    ),
  },
  {
    name: 'incomplete requestId charset',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      ', `~`',
      '',
    ),
  },
  {
    name: 'same intent omits projectFullname from the full payload',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      ', `projectFullname`',
      '',
    ),
  },
  {
    name: 'conflict semantics omit addonCode',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `conflicting-payload` | `projectFullname`, `addonCode`,',
      '| `conflicting-payload` | `projectFullname`,',
    ),
  },
  {
    name: 'exact replay permits a second debit',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '`no-second-debit`',
      '`second-debit-allowed`',
    ),
  },
  {
    name: 'missing requestId retry-safety warning',
    markdown: validProjectAddonBalancePurchaseFixture.replace(
      '| `missing-requestId` | `backward-compatible`, `not-retry-safe`, and `not-idempotent-across-HTTP-attempts`. |',
      '| `missing-requestId` | `backward-compatible`. |',
    ),
  },
  {
    name: 'versioned API path',
    markdown: `${validProjectAddonBalancePurchaseFixture}\nPOST /api/v2/billing/project-addon/balance-purchase\n`,
  },
];

if (
  validateProjectAddonBalancePurchaseContract(
    validProjectAddonBalancePurchaseFixture,
    fixtureRequirementTokens,
    projectAddonBalancePurchaseContractMarker,
  ).length > 0
) {
  issues.push('project add-on balance purchase validator rejects its valid fixture');
}
for (const fixture of invalidProjectAddonBalancePurchaseFixtures) {
  if (
    validateProjectAddonBalancePurchaseContract(
      fixture.markdown,
      fixtureRequirementTokens,
      projectAddonBalancePurchaseContractMarker,
    ).length == 0
  ) {
    issues.push(
      `project add-on balance purchase validator accepts ${fixture.name}`,
    );
  }
}

const validCouponRedeemFixture = `
${couponRedeemContractMarker}

| Field | Required | Description |
| --- | --- | --- |
| \`code\` | Yes | Apply \`trim\` and \`case-insensitive\` matching. |

| Case | Behavior |
| --- | --- |
| \`code-normalization\` | Apply \`trim\` and \`case-insensitive\` matching. |
| \`same-account-retry\` | Return \`same-couponId\`, \`same-subscriptionId\`, and \`same-invoiceId\` with \`no-second-application\`. |
| \`unavailable-or-unsafe\` | \`redeemed-by-another-account\`, \`deleted\`, \`invalid\`, or \`unsafe-subscription-lineage\` must \`fail-closed\`. |
| \`paid-account-plan-period\` | \`extend\`, \`overlay\`, or start a \`new-term\`, \`as-applicable\`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`couponId\` | Yes | Coupon. |
| \`subscriptionId\` | Yes | Subscription. |
| \`invoiceId\` | Yes | Invoice. |
`;
const invalidCouponRedeemFixtures = [
  {
    name: 'altered lifecycle marker',
    markdown: validCouponRedeemFixture.replace(
      'code=required-trim-case-insensitive',
      'code=optional',
    ),
  },
  {
    name: 'optional code',
    markdown: validCouponRedeemFixture.replace(
      '| `code` | Yes |',
      '| `code` | No |',
    ),
  },
  {
    name: 'missing case-insensitive normalization',
    markdown: validCouponRedeemFixture.replace(
      '| `code` | Yes | Apply `trim` and `case-insensitive` matching. |',
      '| `code` | Yes | Apply `trim` matching. |',
    ),
  },
  {
    name: 'same-account retry allows a second application',
    markdown: validCouponRedeemFixture.replace(
      '`no-second-application`',
      '`second-application-allowed`',
    ),
  },
  {
    name: 'same-account retry omits couponId',
    markdown: validCouponRedeemFixture.replace(
      '`same-couponId`, ',
      '',
    ),
  },
  {
    name: 'unsafe subscription lineage does not fail closed',
    markdown: validCouponRedeemFixture.replace(
      '`unsafe-subscription-lineage` must `fail-closed`',
      '`unsafe-subscription-lineage` may `continue`',
    ),
  },
  {
    name: 'missing paid account-plan overlay behavior',
    markdown: validCouponRedeemFixture.replace(
      ', `overlay`',
      '',
    ),
  },
  {
    name: 'missing couponId response field',
    markdown: validCouponRedeemFixture.replace(
      '| `couponId` | Yes | Coupon. |\n',
      '',
    ),
  },
  {
    name: 'versioned API path',
    markdown: `${validCouponRedeemFixture}\nPOST /api/v2/billing/coupon/redeem\n`,
  },
];

if (
  validateCouponRedeemContract(
    validCouponRedeemFixture,
    fixtureRequirementTokens,
    couponRedeemContractMarker,
  ).length > 0
) {
  issues.push('coupon redeem validator rejects its valid fixture');
}
for (const fixture of invalidCouponRedeemFixtures) {
  if (
    validateCouponRedeemContract(
      fixture.markdown,
      fixtureRequirementTokens,
      couponRedeemContractMarker,
    ).length == 0
  ) {
    issues.push(`coupon redeem validator accepts ${fixture.name}`);
  }
}

const validGiftCouponPurchaseFixture = `
${giftCouponPurchaseContractMarker}

| Field | Required | Description |
| --- | --- | --- |
| \`planId\` | Yes | \`advanced\` or \`pro\`. |
| \`durationMonths\` | Yes | \`1\`, \`3\`, \`6\`, or \`12\`. |
| \`requestId\` | No | 8-128 RFC 3986 unreserved characters: \`A-Z\`, \`a-z\`, \`0-9\`, \`.\`, \`_\`, \`~\`, and \`-\`. |

| Case | Behavior |
| --- | --- |
| \`same-intent\` | \`same-requestId\`, \`same-planId\`, and \`same-durationMonths\`. |
| \`exact-replay\` | \`same-couponId\`, \`same-code\`, \`no-second-debit\`, and \`no-second-referral-reward\`. |
| \`conflicting-payload\` | \`rejected\`. |
| \`new-intent\` | \`new-requestId\`. |
| \`missing-requestId\` | \`backward-compatible\`, \`not-retry-safe\`, and \`not-idempotent-across-HTTP-attempts\`. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`couponId\` | Yes | Coupon. |
| \`code\` | Yes | Coupon code. |
`;
const invalidGiftCouponPurchaseFixtures = [
  {
    name: 'altered idempotency marker',
    markdown: validGiftCouponPurchaseFixture.replace(
      'exact-replay=same-couponId-and-code-without-second-debit-or-referral-reward',
      'exact-replay=new-coupon-and-second-debit',
    ),
  },
  {
    name: 'missing requestId request field',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `requestId` | No | 8-128 RFC 3986 unreserved characters: `A-Z`, `a-z`, `0-9`, `.`, `_`, `~`, and `-`. |\n',
      '',
    ),
  },
  {
    name: 'incorrect planId enum',
    markdown: validGiftCouponPurchaseFixture.replace(
      '`advanced` or `pro`',
      '`advanced`, `pro`, or `enterprise`',
    ),
  },
  {
    name: 'incomplete durationMonths enum',
    markdown: validGiftCouponPurchaseFixture.replace(
      '`1`, `3`, `6`, or `12`',
      '`1`, `3`, or `6`',
    ),
  },
  {
    name: 'required backward-compatible requestId',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `requestId` | No |',
      '| `requestId` | Yes |',
    ),
  },
  {
    name: 'incomplete requestId charset',
    markdown: validGiftCouponPurchaseFixture.replace(
      ', `~`',
      '',
    ),
  },
  {
    name: 'same intent omits durationMonths',
    markdown: validGiftCouponPurchaseFixture.replace(
      ', and `same-durationMonths`',
      '',
    ),
  },
  {
    name: 'exact replay permits a second debit',
    markdown: validGiftCouponPurchaseFixture.replace(
      '`no-second-debit`',
      '`second-debit-allowed`',
    ),
  },
  {
    name: 'exact replay permits a second referral reward',
    markdown: validGiftCouponPurchaseFixture.replace(
      '`no-second-referral-reward`',
      '`second-referral-reward-allowed`',
    ),
  },
  {
    name: 'conflicting payload is accepted',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `conflicting-payload` | `rejected`. |',
      '| `conflicting-payload` | `accepted`. |',
    ),
  },
  {
    name: 'missing visible new intent semantics',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `new-intent` | `new-requestId`. |\n',
      '',
    ),
  },
  {
    name: 'missing requestId retry-safety warning',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `missing-requestId` | `backward-compatible`, `not-retry-safe`, and `not-idempotent-across-HTTP-attempts`. |',
      '| `missing-requestId` | `backward-compatible`. |',
    ),
  },
  {
    name: 'missing code response field',
    markdown: validGiftCouponPurchaseFixture.replace(
      '| `code` | Yes | Coupon code. |\n',
      '',
    ),
  },
  {
    name: 'versioned API path',
    markdown: `${validGiftCouponPurchaseFixture}\nPOST /api/v2/billing/coupon/gift-purchase\n`,
  },
];

if (
  validateGiftCouponPurchaseContract(
    validGiftCouponPurchaseFixture,
    fixtureRequirementTokens,
    giftCouponPurchaseContractMarker,
  ).length > 0
) {
  issues.push('gift coupon purchase validator rejects its valid fixture');
}
for (const fixture of invalidGiftCouponPurchaseFixtures) {
  if (
    validateGiftCouponPurchaseContract(
      fixture.markdown,
      fixtureRequirementTokens,
      giftCouponPurchaseContractMarker,
    ).length == 0
  ) {
    issues.push(`gift coupon purchase validator accepts ${fixture.name}`);
  }
}

const validProjectAddonCheckoutLifecycleFixture = `
## POST /api/billing/project-addon/checkout

${projectAddonHostedCheckoutContractMarker}

| Case | Behavior |
| --- | --- |
| \`pending-hosted-retry\` | Existing \`subscriptionId\`, \`invoiceId\`, and \`externalReference\`, with a fresh signed \`checkout\` form. |

## POST /api/billing/project-addon/crypto-checkout

${projectAddonCryptoCheckoutContractMarker}

| Case | Behavior |
| --- | --- |
| \`pending-linked-order-retry\` | Same \`providerOrderId\` and \`paymentUrl\`. |
| \`ambiguous-provider-creation-or-linkage\` | \`fail-closed-pending\`; \`cancel-or-reconcile-before-new-attempt\`. |

## POST /api/billing/crypto-checkout/refresh

${projectAddonLatePaymentContractMarker}

| Case | Behavior |
| --- | --- |
| \`late-payment-after-cancel-or-project-transfer\` | \`no-reactivation\`; \`reconciliation-or-refund\`. |

## POST /api/billing/crypto-checkout/cancel

${projectAddonLatePaymentContractMarker}

| Case | Behavior |
| --- | --- |
| \`late-payment-after-cancel-or-project-transfer\` | \`no-reactivation\`; \`reconciliation-or-refund\`. |
`;
const invalidProjectAddonCheckoutLifecycleFixtures = [
  {
    name: 'hosted retry loses externalReference continuity',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      ', and `externalReference`',
      '',
    ),
  },
  {
    name: 'hosted retry marker permits a reused signature',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      'fresh-signed-form',
      'reused-signed-form',
    ),
  },
  {
    name: 'crypto retry changes paymentUrl',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      'Same `providerOrderId` and `paymentUrl`.',
      'Same `providerOrderId` and a new payment URL.',
    ),
  },
  {
    name: 'ambiguous crypto retry omits cancel or reconciliation',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      '`cancel-or-reconcile-before-new-attempt`',
      '`retry-immediately`',
    ),
  },
  {
    name: 'refresh permits late-payment reactivation',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      '`no-reactivation`; `reconciliation-or-refund`.',
      '`reactivate`; `reconciliation-or-refund`.',
    ),
  },
  {
    name: 'cancel omits late-payment reconciliation or refund',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      /(`late-payment-after-cancel-or-project-transfer` \| `no-reactivation`; )`reconciliation-or-refund`(\. \|\s*)$/,
      '$1`ignore-late-payment`$2',
    ),
  },
  {
    name: 'missing cancel lifecycle section',
    markdown: validProjectAddonCheckoutLifecycleFixture.replace(
      /## POST \/api\/billing\/crypto-checkout\/cancel[\s\S]*$/,
      '',
    ),
  },
  {
    name: 'versioned lifecycle route',
    markdown: `${validProjectAddonCheckoutLifecycleFixture}\nPOST /api/v2/billing/crypto-checkout/cancel\n`,
  },
];

if (
  validateProjectAddonCheckoutLifecycleContract(
    validProjectAddonCheckoutLifecycleFixture,
    projectAddonHostedCheckoutContractMarker,
    projectAddonCryptoCheckoutContractMarker,
    projectAddonLatePaymentContractMarker,
  ).length > 0
) {
  issues.push('project add-on checkout lifecycle validator rejects its valid fixture');
}
for (const fixture of invalidProjectAddonCheckoutLifecycleFixtures) {
  if (
    validateProjectAddonCheckoutLifecycleContract(
      fixture.markdown,
      projectAddonHostedCheckoutContractMarker,
      projectAddonCryptoCheckoutContractMarker,
      projectAddonLatePaymentContractMarker,
    ).length == 0
  ) {
    issues.push(
      `project add-on checkout lifecycle validator accepts ${fixture.name}`,
    );
  }
}

const validProjectTransferBillingContinuityRule = `Transfer is blocked while the project add-on subscription is \`draft\`, \`pending_activation\`, \`active\`, \`past_due\`, or \`cancel_at_period_end\`. Cancel it or wait until it has ended before retrying so recurring billing does not move implicitly between owners.`;
const validProjectTransferBillingContinuityFixture = [
  'POST /api/projects/:fullname/transfer/plan',
  'POST /api/projects/:fullname/transfer-requests',
  'POST /api/project-transfer-requests/:id/accept',
]
  .map(route => `## ${route}

${projectTransferBillingContinuityContractMarker}
${validProjectTransferBillingContinuityRule}
`)
  .join('\n');
const invalidProjectTransferBillingContinuityFixtures = [
  {
    name: 'missing plan billing continuity marker',
    markdown: validProjectTransferBillingContinuityFixture.replace(
      `${projectTransferBillingContinuityContractMarker}\n`,
      '',
    ),
  },
  {
    name: 'deleted visible plan billing continuity rule',
    markdown: validProjectTransferBillingContinuityFixture.replace(
      validProjectTransferBillingContinuityRule,
      'Transfer is allowed.',
    ),
  },
  {
    name: 'missing visible past_due blocking status',
    markdown: validProjectTransferBillingContinuityFixture.replaceAll(
      ', `past_due`',
      '',
    ),
  },
  {
    name: 'weakened fail-closed marker',
    markdown: validProjectTransferBillingContinuityFixture.replace(
      'recurring-billing-owner-continuity=fail-closed',
      'recurring-billing-owner-continuity=best-effort',
    ),
  },
  {
    name: 'missing accept route contract',
    markdown: validProjectTransferBillingContinuityFixture.replace(
      /## POST \/api\/project-transfer-requests\/:id\/accept[\s\S]*$/,
      '',
    ),
  },
];

if (
  validateProjectTransferBillingContinuityContract(
    validProjectTransferBillingContinuityFixture,
    projectTransferBillingContinuityContractMarker,
    projectTransferBlockingSubscriptionStatuses,
  ).length > 0
) {
  issues.push('project transfer billing continuity validator rejects its valid fixture');
}
for (const fixture of invalidProjectTransferBillingContinuityFixtures) {
  if (
    validateProjectTransferBillingContinuityContract(
      fixture.markdown,
      projectTransferBillingContinuityContractMarker,
      projectTransferBlockingSubscriptionStatuses,
    ).length == 0
  ) {
    issues.push(
      `project transfer billing continuity validator accepts ${fixture.name}`,
    );
  }
}

const validStateContractFixture = `
| Field | Required | Description |
| --- | --- | --- |
| \`state\` | Yes | \`on\` or \`off\`. |

Arbitrary renamed response label:

| Field | Required | Description |
| --- | --- | --- |
| \`state\` | Yes | \`on\`, \`off\`, or \`blocked\`. |
| \`issue\` | No | Current status reason. |
`;
const invalidStateContractFixtures = [
  {
    name: 'extra request field',
    markdown: validStateContractFixture.replace(
      '| `state` | Yes | `on` or `off`. |',
      '| `state` | Yes | `on` or `off`. |\n| `issue` | No | Extra. |',
    ),
  },
  {
    name: 'extra response field',
    markdown: validStateContractFixture.replace(
      '| `issue` | No | Current status reason. |',
      '| `issue` | No | Current status reason. |\n| `extra` | No | Extra. |',
    ),
  },
  {
    name: 'required response issue',
    markdown: validStateContractFixture.replace(
      '| `issue` | No | Current status reason. |',
      '| `issue` | Yes | Current status reason. |',
    ),
  },
  {
    name: 'extra paused enum',
    markdown: validStateContractFixture.replace(
      '`on`, `off`, or `blocked`',
      '`on`, `off`, `blocked`, or `paused`',
    ),
  },
];

if (
  validateStateSwitchContract(
    validStateContractFixture,
    fixtureRequirementTokens,
  ).length > 0
) {
  issues.push('subscription state contract validator rejects its valid fixture');
}
for (const fixture of invalidStateContractFixtures) {
  if (
    validateStateSwitchContract(
      fixture.markdown,
      fixtureRequirementTokens,
    ).length == 0
  ) {
    issues.push(`subscription state contract validator accepts ${fixture.name}`);
  }
}

const validMeMetaFixture = `
Payload:

| Field | Required | Description |
| --- | --- | --- |
| \`nickname\` | Yes | User display name, 2-80 characters. |

Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`nickname\` | Yes | Trimmed nickname that was saved. |
`;
const invalidMeMetaFixtures = [
  {
    name: 'optional request nickname',
    markdown: validMeMetaFixture.replace(
      '| `nickname` | Yes | User display name, 2-80 characters. |',
      '| `nickname` | No | User display name, 2-80 characters. |',
    ),
  },
  {
    name: 'missing nickname range',
    markdown: validMeMetaFixture.replace('2-80 characters', 'supported length'),
  },
  {
    name: 'extra response field',
    markdown: validMeMetaFixture.replace(
      '| `nickname` | Yes | Trimmed nickname that was saved. |',
      '| `nickname` | Yes | Trimmed nickname that was saved. |\n| `id` | Yes | Extra. |',
    ),
  },
  {
    name: 'missing HTTP 200 status',
    markdown: validMeMetaFixture.replace('HTTP 200 OK', 'Successful response'),
  },
  {
    name: 'full Me response reference',
    markdown: `${validMeMetaFixture}\nResponse type: [Me](types.md#me).\n`,
  },
];

if (
  validateMeMetaContract(
    validMeMetaFixture,
    fixtureRequirementTokens,
  ).length > 0
) {
  issues.push('account metadata contract validator rejects its valid fixture');
}
for (const fixture of invalidMeMetaFixtures) {
  if (
    validateMeMetaContract(
      fixture.markdown,
      fixtureRequirementTokens,
    ).length == 0
  ) {
    issues.push(`account metadata contract validator accepts ${fixture.name}`);
  }
}

const validWorkspaceAvatarFixture = `
Response: HTTP 200 OK.

| Field | Required | Description |
| --- | --- | --- |
| \`url\` | Yes | Uploaded avatar URL. |
| \`fileName\` | Yes | Stored file name. |
| \`extension\` | Yes | File extension. |
| \`size\` | Yes | File size in bytes. |
| \`workspace\` | Yes | Updated [WorkspaceView](types.md#workspaceview). |
`;
const invalidWorkspaceAvatarFixtures = [
  {
    name: 'missing workspace field',
    markdown: validWorkspaceAvatarFixture.replace(
      '| `workspace` | Yes | Updated [WorkspaceView](types.md#workspaceview). |\n',
      '',
    ),
  },
  {
    name: 'optional workspace field',
    markdown: validWorkspaceAvatarFixture.replace(
      '| `workspace` | Yes |',
      '| `workspace` | No |',
    ),
  },
  {
    name: 'extra response field',
    markdown: validWorkspaceAvatarFixture.replace(
      '| `workspace` | Yes | Updated [WorkspaceView](types.md#workspaceview). |',
      '| `workspace` | Yes | Updated [WorkspaceView](types.md#workspaceview). |\n| `extra` | Yes | Extra. |',
    ),
  },
  {
    name: 'missing HTTP 200 status',
    markdown: validWorkspaceAvatarFixture.replace('HTTP 200 OK', 'Successful response'),
  },
  {
    name: 'account avatar result reference',
    markdown: `${validWorkspaceAvatarFixture}\n[AvatarUploadResult](types.md#avataruploadresult)\n`,
  },
  {
    name: 'missing WorkspaceView reference',
    markdown: validWorkspaceAvatarFixture.replace(
      '[WorkspaceView](types.md#workspaceview)',
      'updated workspace',
    ),
  },
];

if (
  validateWorkspaceAvatarContract(
    validWorkspaceAvatarFixture,
    fixtureRequirementTokens,
    expectedWorkspaceAvatarResponseFields,
  ).length > 0
) {
  issues.push('workspace avatar contract validator rejects its valid fixture');
}
for (const fixture of invalidWorkspaceAvatarFixtures) {
  if (
    validateWorkspaceAvatarContract(
      fixture.markdown,
      fixtureRequirementTokens,
      expectedWorkspaceAvatarResponseFields,
    ).length == 0
  ) {
    issues.push(`workspace avatar contract validator accepts ${fixture.name}`);
  }
}

const validAddressTypeFixture = `
| Field | Required | Description |
| --- | --- | --- |
| \`type\` | Yes | \`plain\`, \`ss58\`, \`evm\`, \`solana\`, \`bitcoin\`, or \`cosmos\`. |
| \`address\` | Yes | Address value. |
`;
const invalidAddressTypeFixtures = [
  {
    name: 'missing solana enum',
    markdown: validAddressTypeFixture.replace('`solana`, ', ''),
  },
  {
    name: 'extra substrate enum',
    markdown: validAddressTypeFixture.replace('`solana`, ', '`solana`, `substrate`, '),
  },
  {
    name: 'optional type field',
    markdown: validAddressTypeFixture.replace('| `type` | Yes |', '| `type` | No |'),
  },
];

if (
  validateAddressTypeContract(
    validAddressTypeFixture,
    fixtureRequirementTokens,
    expectedAddressTypes,
    'fixture',
  ).length > 0
) {
  issues.push('address type contract validator rejects its valid fixture');
}
for (const fixture of invalidAddressTypeFixtures) {
  if (
    validateAddressTypeContract(
      fixture.markdown,
      fixtureRequirementTokens,
      expectedAddressTypes,
      'fixture',
    ).length == 0
  ) {
    issues.push(`address type contract validator accepts ${fixture.name}`);
  }
}

const validAddressEntryFixture = `
### AddressEntry

| Field | Type | Description |
| --- | --- | --- |
| \`type\` | \`"plain" \\| "ss58" \\| "evm" \\| "solana" \\| "bitcoin" \\| "cosmos"\` | Address type. |
`;
if (
  validateAddressEntryTypeContract(
    validAddressEntryFixture,
    expectedAddressTypes,
  ).length > 0
) {
  issues.push('AddressEntry type validator rejects its valid fixture');
}
if (
  validateAddressEntryTypeContract(
    validAddressEntryFixture.replace('"solana" \\| ', ''),
    expectedAddressTypes,
  ).length == 0
) {
  issues.push('AddressEntry type validator accepts a missing solana enum');
}
if (
  validateAddressEntryTypeContract(
    validAddressEntryFixture
      .replace('"solana" \\| ', '')
      .replace('Address type.', 'Address type including "solana".'),
    expectedAddressTypes,
  ).length == 0
) {
  issues.push('AddressEntry type validator accepts solana only in the description');
}

const validSubscriptionDeleteFixtures = [
  `Response: HTTP 204 No Content with an empty body.
${empty204ContractMarker}`,
  `Формулировка ответа изменена: HTTP 204 No Content.
${empty204ContractMarker}`,
];
for (const section of validSubscriptionDeleteFixtures) {
  if (
    validateEmpty204Contract(
      section,
      empty204ContractMarker,
      'subscription',
    ).length > 0
  ) {
    issues.push('subscription delete validator rejects a harmless visible reword fixture');
  }
}

const invalidSubscriptionDeleteFixtures = [
  ['missing marker', 'Response: HTTP 204 No Content.'],
  [
    'missing 204',
    `Response body is empty.
${empty204ContractMarker}`,
  ],
  [
    'altered body marker',
    'Response: HTTP 204 No Content.\n<!-- api-contract: response=204; body=none -->',
  ],
  [
    'mixed-case OperationResult',
    `Response: HTTP 204 No Content. oPeRaTiOnReSuLt
${empty204ContractMarker}`,
  ],
  [
    'lowercase operationresult',
    `Response: HTTP 204 No Content. operationresult
${empty204ContractMarker}`,
  ],
  [
    'duplicate marker',
    `Response: HTTP 204 No Content.
${empty204ContractMarker}
${empty204ContractMarker}`,
  ],
];
for (const [name, section] of invalidSubscriptionDeleteFixtures) {
  if (
    validateEmpty204Contract(
      section,
      empty204ContractMarker,
      'subscription',
    ).length == 0
  ) {
    issues.push(`subscription delete validator accepts ${name}`);
  }
}

const validWorkspaceAclMutationFixture = `Response: HTTP 204 No Content with an empty body.
${empty204ContractMarker}`;
if (
  validateEmpty204Contract(
    validWorkspaceAclMutationFixture,
    empty204ContractMarker,
    'workspace ACL mutation',
    ['WorkspaceAclEntry', 'OperationResult'],
  ).length > 0
) {
  issues.push('workspace ACL mutation validator rejects its valid fixture');
}
for (const [name, section] of [
  [
    'WorkspaceAclEntry response',
    `${validWorkspaceAclMutationFixture}\nResponse: [WorkspaceAclEntry](types.md#workspaceaclentry).`,
  ],
  [
    'OperationResult response',
    `${validWorkspaceAclMutationFixture}\nResponse: [OperationResult](types.md#operationresult).`,
  ],
]) {
  if (
    validateEmpty204Contract(
      section,
      empty204ContractMarker,
      'workspace ACL mutation',
      ['WorkspaceAclEntry', 'OperationResult'],
    ).length == 0
  ) {
    issues.push(`workspace ACL mutation validator accepts ${name}`);
  }
}

if (expectedApiFiles.length != 15) {
  issues.push(`API file manifest must contain 15 files, found ${expectedApiFiles.length}`);
}
if (publicCanonicalRoutes.length != 138) {
  issues.push(`public canonical manifest must contain 138 routes, found ${publicCanonicalRoutes.length}`);
}
if (new Set(publicCanonicalRoutes).size != publicCanonicalRoutes.length) {
  issues.push(`public canonical manifest contains duplicates: ${duplicates(publicCanonicalRoutes).join(', ')}`);
}
if (excludedCanonicalRoutes.size != 8) {
  issues.push(`canonical exclusion manifest must contain 8 routes, found ${excludedCanonicalRoutes.size}`);
}
if (expectedPublicRoutes.length != 138) {
  issues.push(`public route manifest must contain 138 routes, found ${expectedPublicRoutes.length}`);
}
for (const [excludedRoute, reason] of excludedCanonicalRoutes) {
  if (publicCanonicalRoutes.includes(excludedRoute)) {
    issues.push(`excluded route is also public: ${excludedRoute} (${reason})`);
  }
}

for (const file of files) {
  const relativePath = path.relative(userRoot, file);
  const markdown = await readFile(file, 'utf8');
  const lines = markdown.split('\n');

  for (const [index, line] of lines.entries()) {
    if (/\/internal(?:\/|\b)/.test(line)) {
      issues.push(`${relativePath}:${index + 1}: service-only API namespace is not public`);
    }
    if (
      /^#{2,6} (GET|POST|PUT|PATCH|DELETE) \/link(?:\/|\b)/.test(line)
      || /^\| `(GET|POST|PUT|PATCH|DELETE)` \| `\/link(?:\/|`)/.test(line)
    ) {
      issues.push(
        `${relativePath}:${index + 1}: frontend /link paths must not be presented as API endpoints`,
      );
    }
    for (const [excludedRoute, reason] of excludedCanonicalRoutes) {
      const excludedPath = routePath(excludedRoute);
      const exactPathPattern = new RegExp(
        `${escapeRegex(excludedPath)}(?![A-Za-z0-9_:/-])`,
      );
      if (exactPathPattern.test(line)) {
        issues.push(
          `${relativePath}:${index + 1}: excluded route must not be public: ${excludedRoute} (${reason})`,
        );
      }
    }
    for (const match of line.matchAll(/\/api\/v\d+(?:\/(?:[A-Za-z0-9_:/-]+|\*))?/g)) {
      const apiPath = match[0];
      issues.push(`${relativePath}:${index + 1}: use a canonical /api path instead of ${apiPath}`);
    }
  }
}

for (const locale of locales) {
  const localeFiles = (await listMarkdownFiles(path.join(userRoot, locale)))
    .filter(file => /^api(?:-|\.md$)/.test(path.basename(file)));
  const apiFiles = localeFiles.map(file => path.basename(file)).sort();
  compareRouteSets(apiFiles, expectedApiFiles, `${locale}: API files`);

  const detailedRoutesRaw = [];
  for (const file of localeFiles.filter(file => path.basename(file) != 'api.md')) {
    detailedRoutesRaw.push(...documentedRoutes(await readFile(file, 'utf8')));
  }

  const overview = await readFile(path.join(userRoot, locale, 'api.md'), 'utf8');
  const overviewRoutesRaw = overviewRoutes(overview);
  const repeatedDetailedRoutes = duplicates(detailedRoutesRaw);
  const repeatedOverviewRoutes = duplicates(overviewRoutesRaw);
  if (repeatedDetailedRoutes.length > 0) {
    issues.push(`${locale}: duplicate detailed API routes: ${repeatedDetailedRoutes.join(', ')}`);
  }
  if (repeatedOverviewRoutes.length > 0) {
    issues.push(`${locale}: duplicate API overview routes: ${repeatedOverviewRoutes.join(', ')}`);
  }

  const detailedRoutes = unique(detailedRoutesRaw);
  const routesFromOverview = unique(overviewRoutesRaw);
  compareRouteSets(
    detailedRoutes,
    expectedPublicRoutes,
    `${locale}: detailed routes compared with audited public manifest`,
  );
  compareRouteSets(
    routesFromOverview,
    expectedPublicRoutes,
    `${locale}: overview routes compared with audited public manifest`,
  );
  compareRouteSets(
    routesFromOverview,
    detailedRoutes,
    `${locale}: overview compared with detailed API pages`,
  );

  const subscriptions = await readFile(
    path.join(userRoot, locale, 'api-subscriptions.md'),
    'utf8',
  );
  const stateSection = routeSection(
    subscriptions,
    'PUT /api/subscriptions/:id/state',
  );
  const requirementTokens = {
    en: { required: 'Yes', optional: 'No' },
    es: { required: 'Sí', optional: 'No' },
    pt: { required: 'Sim', optional: 'Não' },
    ru: { required: 'Да', optional: 'Нет' },
    zh: { required: '是', optional: '否' },
  }[locale];

  const account = await readFile(
    path.join(userRoot, locale, 'api-account.md'),
    'utf8',
  );
  for (const error of validateTokenContract(
    routeSection(account, 'POST /api/token'),
    requirementTokens,
    tokenContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateTokenSummaryContract(
    overview,
    tokenSummaryContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateMeMetaContract(
    routeSection(account, 'PUT /api/me/meta'),
    requirementTokens,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const links = await readFile(
    path.join(userRoot, locale, 'api-links.md'),
    'utf8',
  );
  for (const error of validateLinkCreateContract(
    routeSection(links, 'POST /api/links'),
    requirementTokens,
    linkCreateContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateLinkGetContract(
    routeSection(links, 'GET /api/links/:key'),
    requirementTokens,
    linkGetContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const workspaces = await readFile(
    path.join(userRoot, locale, 'api-workspaces.md'),
    'utf8',
  );
  for (const error of validateWorkspaceAvatarContract(
    routeSection(workspaces, 'POST /api/workspaces/:fullname/avatar'),
    requirementTokens,
    expectedWorkspaceAvatarResponseFields,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  for (const [subject, route] of [
    ['workspace ACL create', 'POST /api/workspaces/:workspace/acl'],
    ['workspace ACL update', 'PUT /api/workspaces/:workspace/acl/:entryId'],
  ]) {
    for (const error of validateEmpty204Contract(
      routeSection(workspaces, route),
      empty204ContractMarker,
      subject,
      ['WorkspaceAclEntry', 'OperationResult'],
    )) {
      issues.push(`${locale}: ${error}`);
    }
  }

  for (const error of validateStateSwitchContract(stateSection, requirementTokens)) {
    issues.push(`${locale}: ${error}`);
  }

  const billing = await readFile(
    path.join(userRoot, locale, 'api-billing.md'),
    'utf8',
  );
  for (const error of validateWalletTopupContract(
    billing,
    walletTopupCreateContractMarker,
    walletTopupRefreshContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateProjectAddonCheckoutLifecycleContract(
    billing,
    projectAddonHostedCheckoutContractMarker,
    projectAddonCryptoCheckoutContractMarker,
    projectAddonLatePaymentContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateAccountPlanBalancePurchaseContract(
    routeSection(
      billing,
      'POST /api/billing/account-plan/balance-purchase',
    ),
    requirementTokens,
    accountPlanBalancePurchaseContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateProjectAddonBalancePurchaseContract(
    routeSection(
      billing,
      'POST /api/billing/project-addon/balance-purchase',
    ),
    requirementTokens,
    projectAddonBalancePurchaseContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateCouponRedeemContract(
    routeSection(
      billing,
      'POST /api/billing/coupon/redeem',
    ),
    requirementTokens,
    couponRedeemContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }
  for (const error of validateGiftCouponPurchaseContract(
    routeSection(
      billing,
      'POST /api/billing/coupon/gift-purchase',
    ),
    requirementTokens,
    giftCouponPurchaseContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const projectTransfers = await readFile(
    path.join(userRoot, locale, 'api-project-transfers.md'),
    'utf8',
  );
  for (const error of validateProjectTransferBillingContinuityContract(
    projectTransfers,
    projectTransferBillingContinuityContractMarker,
    projectTransferBlockingSubscriptionStatuses,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const resources = await readFile(
    path.join(userRoot, locale, 'api-resources.md'),
    'utf8',
  );
  for (const error of validateResourceCapabilityContract(
    routeSection(resources, 'GET /api/resources/external/:token'),
    resourceCapabilityContractMarker,
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const subscriptionDeleteSection = routeSection(
    subscriptions,
    'DELETE /api/subscriptions/:id',
  );

  for (const error of validateEmpty204Contract(
    subscriptionDeleteSection,
    empty204ContractMarker,
    'subscription',
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const addresses = await readFile(
    path.join(userRoot, locale, 'api-addresses.md'),
    'utf8',
  );
  for (const [operation, route] of [
    ['create', 'POST /api/addresses'],
    ['update', 'PUT /api/addresses/:id'],
  ]) {
    for (const error of validateAddressTypeContract(
      routeSection(addresses, route),
      requirementTokens,
      expectedAddressTypes,
      operation,
    )) {
      issues.push(`${locale}: ${error}`);
    }
  }

  for (const error of validateEmpty204Contract(
    routeSection(addresses, 'DELETE /api/addresses/:id'),
    empty204ContractMarker,
    'address',
  )) {
    issues.push(`${locale}: ${error}`);
  }

  const types = await readFile(
    path.join(userRoot, locale, 'types.md'),
    'utf8',
  );
  for (const error of validateAddressEntryTypeContract(
    types,
    expectedAddressTypes,
  )) {
    issues.push(`${locale}: ${error}`);
  }
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(
  `Verified ${files.length} public Markdown files, ${publicCanonicalRoutes.length} canonical routes, `
  + `${expectedApiFiles.length} API files `
  + `across ${locales.length} locales`,
);
