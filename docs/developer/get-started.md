# Get started with Developer

::: tip
Starlight does not support installing external plugins for now. We are working on it. We will update the documentation once it is available.
:::

## Install CLI

To get started with Starlight, you need to install the CLI. The CLI is a command-line tool that helps you create, build, and publish Starlight plugins.

```bash
npm install -g @starlight/cli
```

## Create a new plugin

To create a new plugin, run the following command:

```bash
starlight create my-plugin
```

This command will create a new directory called `my-plugin` with the following structure:

```plaintext
my-plugin/
├── src/
│   ├── index.js
├── package.json
└── starlight.json
```

## Build the plugin

To build the plugin, run the following command:

```bash
cd my-plugin
starlight build
```

This command will build the plugin and create a `dist` directory with the compiled plugin.

## Publish the plugin

To publish the plugin, run the following command:

```bash
starlight publish
```

This command will publish the plugin to the Starlight plugin registry.
