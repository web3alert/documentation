# Introduction

Welcome to the developer documentation. It is intended to help you with the integration of your product with Web3alert.

### Brief History <a href="#brief-history" id="brief-history"></a>

Initially, Web3alert was created as a notification service that allows users to subscribe to events in blockchain projects and receive notifications about them. Our development team has created integrations with more than 20 projects. As the number of integrations grew, it became clear that there was a need for a toolkit that would allow users and third-party developers to create their own integrations. With our transition to a new version, we want to introduce Web3alert as an automation platform that allows more than just notifications.

### What Is Web3alert <a href="#what-is-web3alert" id="what-is-web3alert"></a>

Web3alert is an automation platform combined with a public hub of data providers, integrations and pre-configured automation use cases.

Developers can setup integrations with their products and publish them on Web3alert. Any user can use private or any published intergrations to create their own automation scenarios. Web3alert provides a global registry for such intergrations as well as runtime execution engine.

### Key Concepts <a href="#key-concepts" id="key-concepts"></a>

Web3alert is based on a pipeline processor. A running pipeline can continuously monitor changes in some systems and execute actions in others. The pipeline runtime allows you to interact with any system, perform complex data transformations, and execute arbitrary code if necessary.

Web3alert provides not only an execution environment for such pipelines but also a simplified model for creating automation scenarios. This model is based on **triggers** and **actions**. Triggers and actions are premade by developers chunks of pipelines where triggers produce data and actions do something with that data. User creates a **subscription** selecting triggers and actions and filling required parameters. Subscriptions are rendered back to the pipelines.

Triggers and actions are registered within a **project**. Anyone can create private project, sumbit desired intergrations and use them by himself. Projects can also be published, so any other users can use its features.

### Usage Example <a href="#usage-example" id="usage-example"></a>

Web3alert focuses on integrations with blockchains and dapps. Any blockchain or application can be connected to the Web3alert infrastructure. A typical scenario is to send a notification to the user on a certain event or state change in the blockchain. An application developer can prepare a trigger that listens for the desired event and provide their users with the ability to subscribe to it. At the same time, in most cases, developers will not need to maintain additional infrastructure - the work of monitoring, collecting and converting data will be done in the Web3alert runtime environment.

In addition, we are preparing opportunities to integrate alerts into your product. At the moment, the most basic method is ready, in which you can place a special link leading to a Web3alert page with a pre-filled form for creating a subscription from a specific trigger, where the user will only have to select the channel for receiving the notifications. The obvious disadvantage of this method is the need for the user to register with Web3alert and the lack of feedback from Web3alert to your product. Therefore, our next priority is to enable full integration and management of subscriptions within your application.

### Current state and plans <a href="#current-state-and-plans" id="current-state-and-plans"></a>

Web3alert is under active development. The concept of the pipeline runtime and hub was formed some time after the launch of the first version of the product, so we are currently in the process of migrating and implementing new features.

At the moment, the pipeline execution environment is ready and we are preparing it for open access. In addition, we are preparing documentation and tools for developers to test and publish triggers. The features of the public hub of products, integrations, triggers and actions are currently partially implemented on top of the old version of the product and are in the process of being reworked and migrated to the new version.

<!-- At the moment, to publish a project or make changes, you need to contact the support (see the [Integration guide](general/step-by-step-integration-guide.md)). You can describe the task or the necessary triggers, our engineers will prepare, test and publish them. We will transfer your project data to you so that in the future you can edit and publish it yourself. -->

Our immediate priority goal is to completely transfer control of the published project into the hands of its developer through the web interface and CLI of Web3alert. Project data, including trigger pipelines, is stored in a set of YAML files.
