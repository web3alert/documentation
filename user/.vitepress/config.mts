import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Web3alert Docs',
  description: 'Web3alert user and API documentation',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  markdown: {
    config(md) {
      const escapeVueInterpolation = (html: string) => html
        .replace(/\{\{/g, '&#123;&#123;')
        .replace(/\}\}/g, '&#125;&#125;');

      const wrapRenderer = (
        rule: string,
        fallback: (tokens: any[], idx: number, options: any, env: any, self: any) => string,
      ) => {
        const previous = md.renderer.rules[rule];
        md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
          const html = previous
            ? previous(tokens, idx, options, env, self)
            : fallback(tokens, idx, options, env, self);
          return escapeVueInterpolation(html);
        };
      };

      wrapRenderer('text', (tokens, idx) => md.utils.escapeHtml(tokens[idx].content));
      wrapRenderer('code_inline', (tokens, idx) => `<code>${md.utils.escapeHtml(tokens[idx].content)}</code>`);
      wrapRenderer('code_block', (tokens, idx) => `<pre><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`);
      wrapRenderer('fence', (tokens, idx) => `<pre><code>${md.utils.escapeHtml(tokens[idx].content)}</code></pre>\n`);
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Web3alert',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/account' },
      { text: 'API', link: '/api' },
      { text: 'Web3alert', link: 'https://web3alert.io' },
    ],
    sidebar: [
      {
        text: 'Core sections',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Account', link: '/account' },
          { text: 'Workspaces', link: '/workspaces' },
          { text: 'Limits', link: '/limits' },
          { text: 'MCP Server', link: '/mcp-server' },
          { text: 'Projects', link: '/projects' },
          {
            text: 'Triggers',
            link: '/triggers',
            collapsed: false,
            items: [
              { text: 'Add trigger / Edit trigger', link: '/trigger-wizard' },
              { text: 'Import triggers', link: '/import-triggers' },
            ],
          },
          {
            text: 'Templates',
            link: '/templates',
            collapsed: false,
            items: [
              { text: 'Add template / Edit template', link: '/template-wizard' },
            ],
          },
          {
            text: 'Subscriptions',
            link: '/subscriptions',
            collapsed: false,
            items: [
              { text: 'Create subscription', link: '/subscription-wizard' },
            ],
          },
          { text: 'Resources', link: '/resources' },
          { text: 'Data sources', link: '/data-sources' },
          { text: 'Addresses', link: '/addresses' },
        ],
      },
      {
        text: 'API',
        collapsed: true,
        items: [
          { text: 'API Overview', link: '/api' },
          { text: 'Account API', link: '/api-account' },
          { text: 'Workspaces API', link: '/api-workspaces' },
          { text: 'Projects API', link: '/api-projects' },
          { text: 'Project Transfers API', link: '/api-project-transfers' },
          { text: 'Triggers API', link: '/api-triggers' },
          { text: 'Trigger Import API', link: '/api-trigger-import' },
          { text: 'Templates API', link: '/api-templates' },
          { text: 'Subscriptions API', link: '/api-subscriptions' },
          { text: 'Resources API', link: '/api-resources' },
          { text: 'Data Sources API', link: '/api-data-sources' },
          { text: 'Addresses API', link: '/api-addresses' },
          { text: 'Apps, Actions, Blueprints and Types API', link: '/api-builder-registry' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/web3alert' },
    ],
  },
});
