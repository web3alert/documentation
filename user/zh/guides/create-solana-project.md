# 创建 Solana 项目

本指南介绍如何在 Web3alert 中创建 Solana project，并添加第一批 triggers。

示例中，我们会创建一个 `Solana` project，选择已有的 Solana data source，并从程序 IDL 导入 triggers。完成后，用户可以订阅这个 project，并接收所选 Solana 程序的事件和指令通知。

## 准备工作

开始前，请准备：

- 一个正在运行的 Solana data source；可在 `Data sources` 中查看列表（参见 [Data sources](../data-sources.md)）；如果还没有合适的 source，可以在导入向导中通过 `Add new source` 创建；
- `Program ID`：要监控的 Solana 程序公钥；
- 程序 IDL：描述程序事件和指令的 JSON；很多情况下，Web3alert 可以根据 `Program ID` 自动加载。

## 第 1 步：创建项目

在左侧 sidebar 打开 `Projects`，点击 `Create New Project`。

填写主要字段：

| 字段 | 值 |
| --- | --- |
| `Title` | `Solana` |
| `Name` | `solana` |
| `Access level` | 准备阶段使用 `Private`，发布到 marketplace 时使用 `Public` |

注意：

- `Name` 会根据 `Title` 自动生成，也可以手动调整。project 创建后无法再修改 `Name`。
- `Free` 级别（所有用户可免费订阅）需要先在 `Billing` 中启用 project add-on。开始时使用 `Private` 即可。

启用 `Short description`，并添加一句简短说明，例如：

```text
Solana mainnet notifications for program instructions, events, and account activity.
```

启用 `Description`，并用 markdown 添加项目说明，例如：

```markdown
Solana is a high-performance Layer 1 blockchain for applications that need fast finality and low transaction costs.

This Web3alert project collects Solana program activity from an existing Solana data source. Use it to build alerts for program instructions, decoded program events, and account reads based on Solana IDL.
```

启用 `Tags`，添加标签（输入一个标签后按 Enter）：

```text
solana
layer-1
smart-contracts
```

可选项：

- `Links`：Solana 官网、文档、explorer，或你要监控的程序页面；
- `Icon` 和 `Cover`：project 图标和封面，可以上传文件或填写 URL。

点击 `Create project`。创建后，你会进入 project 页面，其中包含 `Overview`、`Triggers` 和 `Templates` tabs。

project 字段详情见 [Projects](../projects.md)。

![Project creation form](/guides/solana-project/01-project-create.png)

![Project overview](/guides/solana-project/02-project-overview.png)

## 第 2 步：打开 triggers 导入

在 project 页面打开 `Triggers` tab。

如果 project 还没有 triggers，这个 tab 会显示两个操作：`Add trigger`（手动创建一个 trigger）和 `Import triggers`（批量导入）。点击 `Import triggers`。

导入是从程序 IDL 快速创建多个 Solana triggers 的最快方式。之后如果需要更精确的 trigger、custom providers、filters 或 transforms，再使用 [trigger wizard](../trigger-wizard.md) 手动创建。

![Empty triggers tab](/guides/solana-project/03-project-triggers-empty.png)

## 第 3 步：选择 Solana source

导入向导包含三个步骤：`Source`、`Generate` 和 `Review & import`。进度会显示在向导顶部。

在 `Source` 步骤中，在 `Source network` 字段选择你的 Solana source。列表只显示正在运行的 data sources，每个 source 都标注了网络类型；请查找 `Solana` 标记。

如果没有合适的 source，选择 `Add new source`：向导会带你创建 data source，并在完成后回到导入流程。

点击 `Next step`。

![Solana source selected in import wizard](/guides/solana-project/04-import-source.png)

## 第 4 步：填写程序并加载 IDL

在 `Generate` 步骤中填写：

| 字段 | 说明 |
| --- | --- |
| `Category` | 未来 triggers 的易懂分组，例如 `Program activity`、`Governance` 或 `Transfers`。category 会用于 trigger 名称和标识符。 |
| `Program ID` | 要监控的 Solana 程序公钥。 |
| `IDL` | 程序 IDL 的 JSON。 |

最简单的方式是点击 `Load IDL from program address`：Web3alert 会尝试根据 `Program ID` 查找已发布的 IDL，先查 Anchor IDL account，再查 Program Metadata。如果加载成功，`IDL` 字段会自动填充。

如果自动加载失败，请手动粘贴 IDL JSON，例如从项目仓库或文档中复制。没有 IDL 就无法导入：Web3alert 需要它来了解程序有哪些事件和指令，以及如何把它们解码成可读通知。

点击 `Generate triggers from IDL`。如果 `IDL` 字段为空，Web3alert 会在生成前尝试根据 `Program ID` 自动加载 IDL。

Web3alert 会为 IDL 中的所有事件（events）和指令（calls）生成 trigger drafts。不需要的 triggers 可以在下一步取消选择。

![Solana IDL generation step](/guides/solana-project/05-import-solana-idl.png)

## 第 5 步：检查并导入 triggers

`Review & import` 步骤会显示生成的 drafts 表格。表格上方会显示选择计数，例如 `5/12 selected`。

表格中每个 trigger 包含：

- 选择 checkbox（表头 checkbox 可以一次选择或取消选择全部）；
- `Trigger`：trigger 名称和标识符；
- `Type`：`event`（程序事件）或 `call`（程序指令）；
- `Description`：如果程序开发者在 IDL 中添加了描述，这里会显示出来。

只保留订阅者真正需要的 triggers。先从一个小集合开始很正常，之后可以再次运行导入来添加更多 triggers。

点击 `Create selected triggers`。

导入完成后，向导会回到 project 页面。打开 `Triggers` tab 查看已创建的 triggers。

![Generated Solana trigger review](/guides/solana-project/06-import-review.png)

## 第 6 步：测试并完善 triggers

生成的 triggers 可以工作，但仍是初稿：名称和通知文本直接来自 IDL。发布前，请在 [trigger wizard](../trigger-wizard.md) 中打开每个重要 trigger，并检查：

- 名称和描述：不了解程序内部细节的人是否也能看懂；
- 选中的 source 和 `Program ID`；
- 触发 trigger 的事件或指令；
- filters：是否需要限制触发范围，例如限制到某个 account 或具体值；
- 通知文本（human output）：订阅者最终会看到什么。

对于 marketplace 中面向用户的 projects，通知文本尤其重要。生成的 trigger 可能技术上正确，但显示的数据结构过于原始。好的通知会隐藏技术细节，只展示真正重要的值：金额、地址和名称。

![Imported Solana trigger source settings](/guides/solana-project/07-trigger-edit.png)

## 第 7 步：添加 templates

Triggers 是技术构建块。Templates 会把它们变成用户能理解的订阅场景。

打开 `Templates` tab，为主要 alert use cases 创建一个或多个 templates。例如：

- `Program activity`;
- `Account updates`;
- `Governance events`;
- `Token activity`.

每个 template 都应有清晰名称和有用的默认设置，让用户无需了解 trigger 内部结构也能订阅。详情见 [Templates](../templates.md) 和 [Template wizard](../template-wizard.md)。

![Solana template creation form](/guides/solana-project/08-template-create.png)

## 最终 checklist

发布 project 前，请确认：

- 选中的 Solana source 正在运行并且稳定；
- 已导入 triggers 使用程序真实数据测试过；
- 通知文本简短，并且订阅者能理解；
- 多余 triggers 已禁用或删除；
- templates 覆盖主要订阅场景；
- project metadata 包含清晰描述、tags 和有用链接；
- access level 是有意选择的。

只有在 triggers 和 templates 都准备好后，才把 project 切换为 `Public`。如果 project 需要对所有用户免费，请在 `Billing` 中启用 project add-on，并把 access level 设为 `Free`（这是付费服务）。
