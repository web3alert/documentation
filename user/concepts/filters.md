# Filters

With filters, users can receive notifications that are specific to certain wallets, big transfers within the network, or events with various conditions. The utilization of filters can refine the scope of alerts to be sent, which can be quite helpful.&#x20;

_E.g., without filters, a subscription to the "Balances.transfer" trigger will generate alerts for every single transfer within the network, which could result in spamming. In this case, Web3alert will automatically disable such subscriptions to prevent spamming._&#x20;

To receive as sharp alerts as possible, several filters can be utilized. The filters can be combined with logical connectors such as **"AND" and "OR".**&#x20;

Filters connected by **"AND"** will group them together, and alerts will only be sent if all the filters in the group allow it. On the other hand, filters connected by **"OR"** will create a new filter group, and notifications will be sent if any of the filter groups permit it.

<figure><img src="../.gitbook/assets/Frame 7151 (3).png" alt=""><figcaption></figcaption></figure>
