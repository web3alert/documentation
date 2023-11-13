# Create the first trigger

In the previous step, we created an empty project and described it in the `project.yml` file.

Now to add a trigger to the project we need to go to the `triggers` directory and create an empty `.yml` file there.

```
cd ./triggers
echo > my-first-trigger.yml
```

Open the created file in any text editor.

The first step in configuring the trigger is to give it a unique name.

```yaml
name: my-first-trigger
```

Next, we can specify a trigger labels, for example specifying which `group` the trigger belongs to. If this label is not specified, the trigger defaults to the `other` group.

```yaml
labels:
  group: first
```

We can also describe the trigger metadata in the corresponding field.

```yaml
meta:
  title: My First Trigger
  description: My first trigger
```

After describing the trigger, it is necessary to describe the initial parameters (`values`) that are required for the trigger to work. If the trigger does not need initial parameters, values field can be left empty.

```yaml
values: {}
```

More information about the types of values can be found [here](../types.md).

The last but the most important part is to describe the core of our trieger - `pipeline`. Pipeline consists of a list of nodes and a pointer to the final output node. All nodes are described in blocks. There are many different blocks for different tasks. You can find the list of basic blocks [here](../blocks.md).

Let's look at a simple example. Suppose we want to create a trigger that will output some random number from 0 to 100 every 10 minutes. We'll need two blocks for this:

* **scheduler**, which will be responsible for initiating the pipeline once every 10 minutes; ([link](../blocks.md#schedule))
* **transform**, with the help of which we will be able to get a random value. ([link](../blocks.md#transform))
Learn more about how to use javascript when describing output transformation logic [here](../pipelines.md/#yaml-and-javascript). 

```yaml
pipeline:
  output: rnd
  nodes:
    - name: start
      block: schedule
      options:
        interval: 10m
    - name: rnd
      block: transform
      input: start
      params:
        output: "{{ Math.floor(Math.random() * 100) }}"
```

That's it. As a result, the full contents of the trigger config file will look like this:

```yaml
name: my-first-trigger
labels:
  group: first
meta:
  title: My First Trigger
  description: My first trigger
values: {}
pipeline:
  output: rnd
  nodes:
    - name: start
      block: schedule
      options:
        interval: 10m
    - name: rnd
      block: transform
      input: start
      params:
        output: "{{ Math.floor(Math.random() * 100) }}"
```

If we want to allow the user to customize the range of random numbers, we can set a two parameters of type number in values and use it in the Pipeline. It will look like this:

```yaml
name: my-first-trigger
labels:
  group: first
meta:
  title: My First Trigger
  description: My first trigger
values: 
  lower: { type: number }
  upper: { type: number }
pipeline:
  output: rnd
  nodes:
    - name: start
      block: schedule
      options:
        interval: 10m
    - name: rnd
      block: transform
      input: start
      values: 
        lower: "{{ values.lower }}"
        upper: "{{ values.upper }}"
      params:
        output: "{{ Math.floor( (Math.random() + 1) * (values.upper - values.lower) ) }}"
```

Next we will study how to test our trigger before push it to the Web3alert.
