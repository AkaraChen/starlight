# Life cycle

A plugin have life cycle events that are triggered by the Starlight app. These events allow the plugin to initialize, update, and clean up resources.

## Activation

The activation event is triggered when the plugin is installed or enabled in the Starlight app. The plugin should initialize resources in this event.

```javascript
export const lifecycle = {
  async activate(): boolean {
    console.log('Plugin activated');
    // Return true if the plugin is activated successfully
    return true;
  }
};
```

## Deactivation

The deactivation event is triggered when the plugin is disabled or uninstalled in the Starlight app. The plugin should clean up resources in this event.

```javascript
export const lifecycle = {
  async deactivate() {
    console.log('Plugin deactivated')
  },
}
```

## Update

The update event is triggered when the plugin is updated in the Starlight app. The plugin should update resources in this event.

```javascript
export const lifecycle = {
  async update(
    oldVersion: string,
    newVersion: string
  ) {
    console.log('Plugin updated');
  }
};
```

## Error

The error event is triggered when an error occurs in the plugin. The plugin should handle the error in this event.

```javascript
export const lifecycle = {
  async error(error: Error) {
    console.error('Plugin error:', error);
  }
};
```
