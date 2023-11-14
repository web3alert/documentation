# Getting Started

## Initial Setup

To create the project, you will need the Web3alert CLI. To install it, call the following command:

```bash
npm i -g @web3alert/cli
```

The app needs your personal token to work. You can get it in Settings - Account - Personal access token.

## Create Project
Create an empty directory for your project.

```
mkdir my-test-project
```

The directory of any project has the following structure:

```
my-test-project
|-- project.yml
|-- triggers
|-- resources
```

where

* `project.yml` is a file describing the project;
* `triggers` is a directory contains the triggers related to this project;
* `resources` is a directory containing the project resources.

Let's create all these entities for our new project.

```
cd ./my-test-project
mkdir triggers
mkdir resources
echo > project.yml
```

To push a new project to the web3alert service we need to fill in project.yml with the required fields. 

```yaml
name: my-test-project
public: false
meta:
  title: My Test Project
  description: My test project
```

Now that `porject.yml` is filled, we can call the `push` command from the project directory:
```
web3alert project push
```

That's it. Next, we will study how to add triggers to our project.
