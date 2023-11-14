# Test trigger

In the previous step, we created the first trigger for our project.

Now, we need to test the trigger and make sure that everything works as intended.

First, you need to set the conditions for testing the trigger. Open the trigger configuration file and add the `test` property to the pipeline. In the test, it is necessary to specify the initial parameters of values (if they are needed for the trigger) and describe the output data of the initiator node.

```yaml
test:
  values:
    lower: 150
    upper: 300
  samples:
    - node: start
      objects:
        - now: "2023-11-10T00:00:00.000Z"
```

Now, to make a test run of the trigger and check the result, we need to call the following command:

```
web3alert trigger test ./my-first-trigger.yml
```
The result will look like this:

```yaml
nodes:
  - name: start
    history:
      - method: process
        start: "2023-11-14T08:40:09.750Z"
        end: "2023-11-14T08:40:09.751Z"
        context:
          input:
            now: "2023-11-10T00:00:00.000Z"
        result:
          output:
            - now: "2023-11-10T00:00:00.000Z"
  - name: rnd
    history:
      - method: process
        start: "2023-11-14T08:40:09.752Z"
        end: "2023-11-14T08:40:09.756Z"
        context:
          input:
            now: "2023-11-10T00:00:00.000Z"
          params:
            output:
              value: 296
        result:
          output:
            - value: 296
```
