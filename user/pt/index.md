# Bem-vindo ao Web3alert

O Web3alert é um serviço para criar e receber notificações Web3.

Ele transforma eventos de blockchain/runtime, dados externos e condições definidas pelo utilizador em alerts claros que podem ser enviados para Telegram, Discord, Slack, webhooks e outros canais.

## O que pode fazer

Como utilizador, pode:

- subscrever integrações prontas do marketplace;
- criar subscriptions para o seu workspace;
- guardar addresses, resources e data sources num único contexto de trabalho;
- receber alerts sobre eventos, endereços, contratos, runtime calls ou condições personalizadas.

Como owner de um projeto ou integração, pode:

- criar um project;
- descrever triggers que leem dados de blockchain ou timer sources;
- adicionar providers, filters, transforms e defaults;
- criar templates e topics para facilitar a subscrição por outros utilizadores;
- importar triggers a partir de ABI, Substrate metadata ou outras descrições suportadas.

## Ideia principal

O Web3alert é organizado em torno de algumas entidades.

`Projects` descrevem integrações. Um projeto pode ser uma rede blockchain, protocolo, contrato, projeto de comunidade ou conjunto de eventos personalizados.

`Triggers` descrevem quais source items ler, como filtrá-los, como enriquecê-los e que output produzir.

`Templates` transformam triggers em cenários de subscrição claros para os utilizadores.

`Subscriptions` ligam um trigger/template selecionado a um workspace, inputs, filters, resources e delivery settings.

`Resources` gerem canais de entrega e ligações externas relacionadas.

`Data sources` descrevem origens de dados: blockchain endpoints, runtime metadata e custom source runtime.

`Addresses` ajudam a guardar e reutilizar endereços em subscriptions e filters.

## Por onde começar

Se quiser usar alerts já existentes, comece por [Subscriptions](subscriptions.md) e [Create subscription](subscription-wizard.md).

Se quiser criar a sua própria integração, comece por [Projects](projects.md), [Triggers](triggers.md) e [Templates](templates.md).

Se ligar o Web3alert a ferramentas externas ou AI agents, veja [MCP Server](mcp-server.md) e [API](api.md).
