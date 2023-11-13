# Pipelines

Pipeline is a set of **nodes** connected with **links**. Each node could have **input** and **output**, node can consume data from its input and produce data to its output. Data is a plain javascript objects. Node output can be connected to other node input using link. This way objects produced by one node could be consumed by another node.

Each iteration of consuming input, doing something and producing output is an atomic operation called **process**. Process for any node is executed automatically as soon as there are some objects in input queue ready to be consumed.

Nodes are created from **blocks**. Block is a process operation implementation. Block specifies its required parameters, how many inputs and outputs there should be, what exactly to do with consumed objects and which objects to produce. There are some basic built-in blocks available as well as specialized blocks providing integrations with remote systems.

There are also **resources**. Resource is a shared runtime javascript object that could be connected to many nodes. It could be thought as a "static" input for a node. Resources are used to share data between pipelines, to avoid copy-paste, to hold large portions of data, and to hold secrets and credentials.

Resources are created from a **blueprint**. Blueprint defines a data structure, performs validation and implements possible data mutations. Most basic blueprint could implement just the "set new value" mutation.

### YAML and JavaScript

Pipelines source code is written in a YAML files. In some places you can use strings with a `{{ ... }}` template syntax with a javascript expression inside. Those expressions will be evaluated at specified lifecycle moment with specified context. Expressions are expected to return some JSON-serializable primitive values, like strings or plain objects.

For example, all of those forms are equal after being evaluated:
```yaml
obj:
  msg: hello world
  num: 12

obj:
  msg: "{{ ['hello', 'world'].join(' ') }}"
  num: "{{ 10 + 2 }}"

obj: "{{ ({ msg: 'hello world', num: 12 }) }}"
```

### Pipeline Lifecycle

When pipeline is being launched on the engine, it creates all its nodes and links. Then nodes remain in a runtime idefinitely and continously perform some work by consuming input, processing and producing output. Nodes keep its state until being destroyed. It is possible to shutdown a pipeline, which will remove it from the engine and destory all related nodes and links.

### Block

Block implements any basic operation and declares its features and requirements. Block consists of declarations of its inputs and outputs, state, configs, params and lifecycle methods implementations.

Block features:

* input with zero or more named **inlets**
* output with zero or more named **outlets**
* zero or more named resources from specified blueprints
* a **state**
* **options** object, evaluated once when node is created in a runtime
* **params** object, evaluated for every consumed input object

Currently you can use only our built-in and some specialized blocks. Support for custom user-provided blocks are going to be in the future.

### Node

Node represents basic atomic operation within pipeline. Node is made from a block. Being specified in a pipeline, node describes actual block execution options and parameters.

#### Node Specification

**name**: `string`  
Name of the node. Must be unique within a pipeline.

**block**: `string`  
Name of the block from which this node should be created.

**input**: `string | object[]` (_optional_)  
Input configuration combined with links from previoud nodes. Must match the input configuration of the block.

**resource**: `string` (_optional_)  
Name of a registered in the runtime resource of the same blueprint as required by the block.

**values**: `object` (_optional_)  
Just any plain values, reusable in `options` or `params`.

**options**: `object` (_optional_)  
Block parameters, evaluated once upon node is created in a runtime.

**params**: `object` (_optional_)  
Block parameters, evaluated every time the **process** is executed for each consumed input object.

**assert**: `object` (_optional_)  
Assert expression.

#### Block

Block must be specified. Selected block will define possible options and parameters of the node, as well as its runtime behaviour.

#### Lifecycle

Node is created when the pipeline is created. Options are evaluated once when the node is created. Params are evaluated every time for each input object consumed during the node **process** execution. State is initialized as undefined upon node's creation, could be modified on any **process** execution, and persisted until node is destroyed.

#### Context

`values` object and Lodash methods are available both for `options` and `params` evaluation. `input` object is also available for `params` evaluation.

```yaml
params:
  random: "{{ _.random(values.min, values.max) }}"
  message: "{{ input.text }}"
```

#### Input

Node input may consist of zero or more named inlets. Inlet is actually a minimal unit that can be connected with outlet from previoud node. Depending on a selected block, there are some possible input configurations.

##### No Input/Inlets

Block defines that there are no inlets. Probably such a block will behave like a data source only and will have only the output. So, node specification cannot use keyword `input` at all.

##### Single Inlet

Block defines single inlet, that takes whole input. For example, if the previous node has a name `foo`, then we can use its name for a whole input:

```yaml
input: foo
```

And if the `foo` node produces object like `{ msg: 'hello' }`, then `input` object will have just the raw data:

```yaml
input:
  msg: hello
```

##### Multiple Inlets

Input could be combined as a set of named inlets, connected to many previous blocks at the same time:

```yaml
input:
  - foo: one
  - bar: two
```

In this case inlet `foo` is linked with output from a node `one`, and inlet `bar` in linked with output from a node `two`. If node `one` produces object `{ msg: hello }` and node `two` produces object `{ num: 12 }`, then the whole input object will have the value:

```yaml
input:
  foo:
    msg: hello
  bar:
    num: 12
```

#### Assertions

You can specify an output assertion expression like this:

```yaml
assert:
  expr: "{{ output.num > 0 }}"
```

Produced by the node `output` will be available in that context. If assert expression evaluates to any falsy value, then the **process** operation will be considered as failed and retried after a 3 seconds delay.
