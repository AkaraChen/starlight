# Persistence

Starlight plugin need a way to persistence data, so starlight has.

## Foreword

For convenience, the data root of the starlight app will be referred to as "app" dir.

## Files

### `app/starlight.preference.json`

Use for store user settings.

### `app/temp`

Use for storing provisional data, such as exchange rates for calculate user input.

Will be removed when starlight app restart.

### `app/plugins`

User extenal plugin dir, store user plugin's data.
