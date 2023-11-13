# Create resource

Some blocks require more complex initialization, and in order not to go through the process of filling in the necessary parameters each time, this process has been allocated to a separate entity - the `resource`. You can read more about the resource [on this page](../../web3alert.md#resource). Here we will give just a couple of examples of when the resources are used. 

For example, if a node sends data to a third-party application. Of course, it is possible to add the process of user authorization to the trigger itself, but it is much more convenient if the user is authorized in advance and the block will pass only a reference to the resource containing authorization data.

Another example - a node that works with EVM smart contract events. Before starting such a node it is needed to specify with which smart contract, according to which scheme, and with which specific events it should work. If there is only one such trigger, it is not difficult to specify all these entities. But what if the task is to create a trigger for each event in the smart contract? In this case, it will be correct to describe the parameters of the smart contract - `Address` and `ABI`, in the resource, and the node will refer to the created resource.

To add a resource to the project, you need to go to the `resources` directory, create a resource configuration file there, and describe the resource properties in the file. For example, let's take the simple ERC20 smart contract of the USDT token.

```yaml
name: erc20-usdt
blueprint: web3alert.ethereum.evm.evm-contract
data:
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  abi: "[{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}]"
```

Now we can use this resource to create a new trigger that fires every time an AddedBlackList event occurs on the network. 

```yaml
name: added-blacklist
labels:
  group: usdt
meta:
  title: Added BlackList
  description: Added address in the blacklist
values: {}
pipeline:
  output: format
  nodes:
    - name: event-run
      block: web3alert.ethereum.evm.stream.contract
      resource: web3alert.my-first-project.erc20-usdt
      params:
        type: event
        name: AddedBlackList
    - name: format
      block: transform
      input: event-run
      params:
        output:
          block: "{{ input.block }}"
          txID: "{{ input.txid }}"
          blacklistedUser: "{{ input.event._user }}"
  test:
    samples:
      - node: event-run
        objects:
          - fromBlock: 18541858
            toBlock: 18541860
```
