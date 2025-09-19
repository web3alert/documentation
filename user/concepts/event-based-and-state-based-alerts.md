# Event-based and state-based alerts

**State-based method of receiving notifications** is a concept used for alerts that do not have an specific triggering on-chain event, but require monitoring of a specific value in the blockchain (e.g. gas price, collateralization ratio, treasury balance updates, etc).

<figure><img src="../.gitbook/assets/image (6).png" alt=""><figcaption><p>for example, state-based method is recommended if you want to track when Ethereum gas price is lower than X</p></figcaption></figure>

* By default the subscription rule is in standby state&#x20;
* As long as the occuring events monitored by the rule do NOT meet the condition, the subscription rule remains in standby state
* When a monitored event occurs and satisfies the condition, the subscription rule will go into the pending state
* If the subscription rule stays in pending state longer than specified (by alert developer) in the policy parameter "**for**", subscription goes into firing state and sends you only ONE notification
* If in the pending or firing state, a monitored event occurs and does NOT meet the condition, the rule will return to standby state

You can also refer to alert execution model of AlertManager/Grafana's - the concept was taken from there [https://grafana.com/docs/grafana/latest/alerting/alerting-rules/](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/)
