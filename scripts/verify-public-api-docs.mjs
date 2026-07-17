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

function markdownTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return undefined;
  }

  return trimmed
    .slice(1, -1)
    .split('|')
    .map(cell => cell.trim());
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

const issues = [];
const files = await listMarkdownFiles(userRoot);
const expectedPublicRoutes = unique(publicCanonicalRoutes);
const fixtureRequirementTokens = { required: 'Yes', optional: 'No' };
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

if (publicCanonicalRoutes.length != 136) {
  issues.push(`public canonical manifest must contain 136 routes, found ${publicCanonicalRoutes.length}`);
}
if (new Set(publicCanonicalRoutes).size != publicCanonicalRoutes.length) {
  issues.push(`public canonical manifest contains duplicates: ${duplicates(publicCanonicalRoutes).join(', ')}`);
}
if (excludedCanonicalRoutes.size != 8) {
  issues.push(`canonical exclusion manifest must contain 8 routes, found ${excludedCanonicalRoutes.size}`);
}
if (expectedPublicRoutes.length != 136) {
  issues.push(`public route manifest must contain 136 routes, found ${expectedPublicRoutes.length}`);
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

  for (const error of validateStateSwitchContract(stateSection, requirementTokens)) {
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
