# Views

A view is a React component that is displayed in the Starlight interface. Views are used to display information like search results, file contents, or a list of files.

## Structure

```typescript
type View = {
  id: string
  displayName: string
  component: FC
}
```

## Open view

Starlight provides a `openView` function to open a view in the Starlight interface. The function takes a view object as an argument.

```typescript
import { openView } from '@starlight/core';

const view: View = {
  id: 'my-view',
  displayName: 'My View',
  component: (
    command: Command,
    query: string
  ) => <div>Hello, World!</div>
};

export const commands = [
  {
    id: 'open-my-view',
    displayName: 'Open My View',
    description: 'Open a view in the interface',
    handler: () => {
      openView(view);
    }
  }
];
```

## Component

Starlight sdk provides a few components to help you build views, such as `Container`, `Search`, `List`, `File`, and `Button`.

```tsx
import { Search, List, File, Button } from '@starlight/core'

const view: View = {
  id: 'my-view',
  displayName: 'My View',
  component: (command: Command, query: string) => {
    const [keyword, setKeyword] = useState('')
    const [files, setFiles] = useState<string[]>([])
    const [filteredFiles, setFilteredFiles] = useState<string[]>([])

    useEffect(() => {
      // Load files
      setFiles(['file1.txt', 'file2.txt'])
    }, [])

    return (
      <Container>
        <Search value={keyword} onChange={e => setKeyword(e.target.value)} />
        <List>
          {filteredFiles.map(file => (
            <File
              key={file}
              name={file}
              onClick={() => {
                // Open file
              }}
            />
          ))}
        </List>
        <Button
          onClick={() => {
            // Do something
          }}
        >
          Click me
        </Button>
      </Container>
    )
  },
}
```
