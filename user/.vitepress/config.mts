import { defineConfig } from 'vitepress';

type LocaleKey = 'root' | 'ru' | 'en' | 'es' | 'pt' | 'zh';

type LocaleMeta = {
  label: string;
  lang: string;
  link: string;
  prefix: string;
  nav: {
    home: string;
    guide: string;
    api: string;
    language: string;
  };
  sections: {
    core: string;
    overview: string;
    account: string;
    workspaces: string;
    limits: string;
    mcpServer: string;
    projects: string;
    triggers: string;
    triggerWizard: string;
    importTriggers: string;
    templates: string;
    templateWizard: string;
    subscriptions: string;
    subscriptionWizard: string;
    resources: string;
    dataSources: string;
    addresses: string;
    api: string;
    apiOverview: string;
    types: string;
    accountApi: string;
    workspacesApi: string;
    projectsApi: string;
    projectTransfersApi: string;
    triggersApi: string;
    triggerImportApi: string;
    templatesApi: string;
    subscriptionsApi: string;
    resourcesApi: string;
    dataSourcesApi: string;
    addressesApi: string;
    builderRegistryApi: string;
  };
};

const locales: Record<LocaleKey, LocaleMeta> = {
  root: {
    label: 'English',
    lang: 'en-US',
    link: '/',
    prefix: '',
    nav: {
      home: 'Home',
      guide: 'Guide',
      api: 'API',
      language: 'Language',
    },
    sections: {
      core: 'Core sections',
      overview: 'Overview',
      account: 'Account',
      workspaces: 'Workspaces',
      limits: 'Limits',
      mcpServer: 'MCP Server',
      projects: 'Projects',
      triggers: 'Triggers',
      triggerWizard: 'Add trigger / Edit trigger',
      importTriggers: 'Import triggers',
      templates: 'Templates',
      templateWizard: 'Add template / Edit template',
      subscriptions: 'Subscriptions',
      subscriptionWizard: 'Create subscription',
      resources: 'Resources',
      dataSources: 'Data sources',
      addresses: 'Addresses',
      api: 'API',
      apiOverview: 'API Overview',
      types: 'Types',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints and Types API',
    },
  },
  ru: {
    label: 'Русский',
    lang: 'ru-RU',
    link: '/ru/',
    prefix: '/ru',
    nav: {
      home: 'Главная',
      guide: 'Руководство',
      api: 'API',
      language: 'Язык',
    },
    sections: {
      core: 'Основные разделы',
      overview: 'Обзор',
      account: 'Аккаунт',
      workspaces: 'Воркспейсы',
      limits: 'Лимиты',
      mcpServer: 'MCP Server',
      projects: 'Проекты',
      triggers: 'Триггеры',
      triggerWizard: 'Создание и редактирование триггера',
      importTriggers: 'Импорт триггеров',
      templates: 'Темплейты',
      templateWizard: 'Создание и редактирование темплейта',
      subscriptions: 'Подписки',
      subscriptionWizard: 'Создание подписки',
      resources: 'Ресурсы',
      dataSources: 'Источники данных',
      addresses: 'Адреса',
      api: 'API',
      apiOverview: 'Обзор API',
      types: 'Типы',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints и Types API',
    },
  },
  en: {
    label: 'English',
    lang: 'en-US',
    link: '/en/',
    prefix: '/en',
    nav: {
      home: 'Home',
      guide: 'Guide',
      api: 'API',
      language: 'Language',
    },
    sections: {
      core: 'Core sections',
      overview: 'Overview',
      account: 'Account',
      workspaces: 'Workspaces',
      limits: 'Limits',
      mcpServer: 'MCP Server',
      projects: 'Projects',
      triggers: 'Triggers',
      triggerWizard: 'Add trigger / Edit trigger',
      importTriggers: 'Import triggers',
      templates: 'Templates',
      templateWizard: 'Add template / Edit template',
      subscriptions: 'Subscriptions',
      subscriptionWizard: 'Create subscription',
      resources: 'Resources',
      dataSources: 'Data sources',
      addresses: 'Addresses',
      api: 'API',
      apiOverview: 'API Overview',
      types: 'Types',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints and Types API',
    },
  },
  es: {
    label: 'Español',
    lang: 'es-ES',
    link: '/es/',
    prefix: '/es',
    nav: {
      home: 'Inicio',
      guide: 'Guía',
      api: 'API',
      language: 'Idioma',
    },
    sections: {
      core: 'Secciones principales',
      overview: 'Resumen',
      account: 'Cuenta',
      workspaces: 'Espacios de trabajo',
      limits: 'Límites',
      mcpServer: 'MCP Server',
      projects: 'Proyectos',
      triggers: 'Disparadores',
      triggerWizard: 'Crear y editar disparador',
      importTriggers: 'Importar disparadores',
      templates: 'Plantillas',
      templateWizard: 'Crear y editar plantilla',
      subscriptions: 'Suscripciones',
      subscriptionWizard: 'Crear suscripción',
      resources: 'Recursos',
      dataSources: 'Fuentes de datos',
      addresses: 'Direcciones',
      api: 'API',
      apiOverview: 'Resumen de API',
      types: 'Tipos',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints and Types API',
    },
  },
  pt: {
    label: 'Português',
    lang: 'pt-PT',
    link: '/pt/',
    prefix: '/pt',
    nav: {
      home: 'Início',
      guide: 'Guia',
      api: 'API',
      language: 'Idioma',
    },
    sections: {
      core: 'Secções principais',
      overview: 'Visão geral',
      account: 'Conta',
      workspaces: 'Espaços de trabalho',
      limits: 'Limites',
      mcpServer: 'MCP Server',
      projects: 'Projetos',
      triggers: 'Gatilhos',
      triggerWizard: 'Criar e editar gatilho',
      importTriggers: 'Importar gatilhos',
      templates: 'Modelos',
      templateWizard: 'Criar e editar modelo',
      subscriptions: 'Subscrições',
      subscriptionWizard: 'Criar subscrição',
      resources: 'Recursos',
      dataSources: 'Fontes de dados',
      addresses: 'Endereços',
      api: 'API',
      apiOverview: 'Visão geral da API',
      types: 'Tipos',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints and Types API',
    },
  },
  zh: {
    label: '中文',
    lang: 'zh-CN',
    link: '/zh/',
    prefix: '/zh',
    nav: {
      home: '首页',
      guide: '指南',
      api: 'API',
      language: '语言',
    },
    sections: {
      core: '核心章节',
      overview: '概览',
      account: '账户',
      workspaces: '工作区',
      limits: '限额',
      mcpServer: 'MCP Server',
      projects: '项目',
      triggers: '触发器',
      triggerWizard: '创建和编辑触发器',
      importTriggers: '导入触发器',
      templates: '模板',
      templateWizard: '创建和编辑模板',
      subscriptions: '订阅',
      subscriptionWizard: '创建订阅',
      resources: '资源',
      dataSources: '数据源',
      addresses: '地址',
      api: 'API',
      apiOverview: 'API 概览',
      types: '类型',
      accountApi: 'Account API',
      workspacesApi: 'Workspaces API',
      projectsApi: 'Projects API',
      projectTransfersApi: 'Project Transfers API',
      triggersApi: 'Triggers API',
      triggerImportApi: 'Trigger Import API',
      templatesApi: 'Templates API',
      subscriptionsApi: 'Subscriptions API',
      resourcesApi: 'Resources API',
      dataSourcesApi: 'Data Sources API',
      addressesApi: 'Addresses API',
      builderRegistryApi: 'Apps, Actions, Blueprints and Types API',
    },
  },
};

const linkFor = (locale: LocaleMeta, path: string) => (
  path === '/' ? `${locale.prefix}/` || '/' : `${locale.prefix}${path}`
);

const languageItems = ['ru', 'en', 'es', 'pt', 'zh']
  .map((key) => locales[key as Exclude<LocaleKey, 'root'>])
  .map(({ label, link }) => ({ text: label, link }));

const createThemeConfig = (locale: LocaleMeta) => ({
  logo: '/logo.svg',
  siteTitle: false,
  search: {
    provider: 'local' as const,
  },
  nav: [
    { text: locale.nav.home, link: linkFor(locale, '/') },
    { text: locale.nav.guide, link: linkFor(locale, '/account') },
    { text: locale.nav.api, link: linkFor(locale, '/api') },
    {
      text: locale.nav.language,
      items: languageItems,
    },
    { text: 'Web3alert', link: 'https://web3alert.io' },
  ],
  sidebar: [
    {
      text: locale.sections.core,
      items: [
        { text: locale.sections.overview, link: linkFor(locale, '/') },
        { text: locale.sections.account, link: linkFor(locale, '/account') },
        { text: locale.sections.workspaces, link: linkFor(locale, '/workspaces') },
        { text: locale.sections.limits, link: linkFor(locale, '/limits') },
        { text: locale.sections.mcpServer, link: linkFor(locale, '/mcp-server') },
        { text: locale.sections.projects, link: linkFor(locale, '/projects') },
        {
          text: locale.sections.triggers,
          link: linkFor(locale, '/triggers'),
          collapsed: false,
          items: [
            { text: locale.sections.triggerWizard, link: linkFor(locale, '/trigger-wizard') },
            { text: locale.sections.importTriggers, link: linkFor(locale, '/import-triggers') },
          ],
        },
        {
          text: locale.sections.templates,
          link: linkFor(locale, '/templates'),
          collapsed: false,
          items: [
            { text: locale.sections.templateWizard, link: linkFor(locale, '/template-wizard') },
          ],
        },
        {
          text: locale.sections.subscriptions,
          link: linkFor(locale, '/subscriptions'),
          collapsed: false,
          items: [
            { text: locale.sections.subscriptionWizard, link: linkFor(locale, '/subscription-wizard') },
          ],
        },
        { text: locale.sections.resources, link: linkFor(locale, '/resources') },
        { text: locale.sections.dataSources, link: linkFor(locale, '/data-sources') },
        { text: locale.sections.addresses, link: linkFor(locale, '/addresses') },
      ],
    },
    {
      text: locale.sections.api,
      collapsed: true,
      items: [
        { text: locale.sections.apiOverview, link: linkFor(locale, '/api') },
        { text: locale.sections.types, link: linkFor(locale, '/types') },
        { text: locale.sections.accountApi, link: linkFor(locale, '/api-account') },
        { text: locale.sections.workspacesApi, link: linkFor(locale, '/api-workspaces') },
        { text: locale.sections.projectsApi, link: linkFor(locale, '/api-projects') },
        { text: locale.sections.projectTransfersApi, link: linkFor(locale, '/api-project-transfers') },
        { text: locale.sections.triggersApi, link: linkFor(locale, '/api-triggers') },
        { text: locale.sections.triggerImportApi, link: linkFor(locale, '/api-trigger-import') },
        { text: locale.sections.templatesApi, link: linkFor(locale, '/api-templates') },
        { text: locale.sections.subscriptionsApi, link: linkFor(locale, '/api-subscriptions') },
        { text: locale.sections.resourcesApi, link: linkFor(locale, '/api-resources') },
        { text: locale.sections.dataSourcesApi, link: linkFor(locale, '/api-data-sources') },
        { text: locale.sections.addressesApi, link: linkFor(locale, '/api-addresses') },
        { text: locale.sections.builderRegistryApi, link: linkFor(locale, '/api-builder-registry') },
      ],
    },
  ],
  socialLinks: [
    { icon: 'github' as const, link: 'https://github.com/web3alert' },
  ],
});

export default defineConfig({
  title: 'Web3alert Docs',
  description: 'Web3alert user and API documentation',
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
  locales: {
    root: {
      lang: locales.root.lang,
      themeConfig: createThemeConfig(locales.root),
    },
    ru: {
      lang: locales.ru.lang,
      link: locales.ru.link,
      title: 'Web3alert Docs',
      description: 'Документация пользователя и API Web3alert',
      themeConfig: createThemeConfig(locales.ru),
    },
    en: {
      lang: locales.en.lang,
      link: locales.en.link,
      title: 'Web3alert Docs',
      description: 'Web3alert user and API documentation',
      themeConfig: createThemeConfig(locales.en),
    },
    es: {
      lang: locales.es.lang,
      link: locales.es.link,
      title: 'Documentación de Web3alert',
      description: 'Documentación de usuario y API de Web3alert',
      themeConfig: createThemeConfig(locales.es),
    },
    pt: {
      lang: locales.pt.lang,
      link: locales.pt.link,
      title: 'Documentação Web3alert',
      description: 'Documentação de utilizador e API do Web3alert',
      themeConfig: createThemeConfig(locales.pt),
    },
    zh: {
      lang: locales.zh.lang,
      link: locales.zh.link,
      title: 'Web3alert 文档',
      description: 'Web3alert 用户和 API 文档',
      themeConfig: createThemeConfig(locales.zh),
    },
  },
});
