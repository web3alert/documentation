# Overview

### Project <a href="#project" id="project"></a>

A project is a container for triggers, actions and resources. Projects can be private or public. Any user can create projects. Any user can use triggers and actions from either their private or any public projects. User can specify all the project data with YAML files and then use Web3alert CLI to push it to Web3alert server.

### Trigger <a href="#trigger" id="trigger"></a>

Represents something to what user can subscribe to. May have required parameters, which must be specified during subscription setup. Basically, trigger contains a template of a pipeline, which should be continously executed to detect and emit some event. Subscriptions are created from triggers.

### Action <a href="#action" id="action"></a>

Represents something useful user can do with an event. May have required parameters, which must be specified during subscription setup. As a trigger, action contains a template of a pipeline, which should be executed per event to do something useful.

### Subscription <a href="#subscription" id="subscription"></a>

Subscription is a combination of triggers and actions. Most basic subscription could be represented by one trigger and one action – when trigger emits an event then the action is executed. To create a subscription, user provides any parameters, required by selected triggers and actions. Subscriptions are rendered down to a raw pipelines which are executed by runtime engine.

### Resource <a href="#resource" id="resource"></a>

Resources are plain javascript objects. Resource can be used to store some data or credentials and share them between many subscriptions. You can create a named resource within your project and push it to Web3alert. Then it will become available in a runtime and could be used from any trigger or action of that project.
