import type { IPlugin } from '@starlight-app/plugin-sdk'
import { transformIcon, transformLifecycle, transformPlugin } from './transform'

const getMockPlugin = (): IPlugin => {
  return {
    metaData: {
      id: 'test',
      name: 'Test',
      icon: '🚀',
      version: '1.0.0',
      description: 'Test plugin',
    },
    lifecycle: {
      activate() {
        throw new Error('Not implemented')
      },
      deactivate() {
        throw 'Not implemented'
      },
    },
  }
}

beforeEach(() => {
  vi.resetModules()
})

describe('transformLifecycle', () => {
  test('not throw error', () => {
    const plugin = getMockPlugin()
    expect(() => plugin.lifecycle.activate()).toThrow()
    expect(() => transformLifecycle(plugin).activate()).not.toThrow()
    expect(() => transformLifecycle(plugin).deactivate()).not.toThrow()
  })

  test('callWithErrorHandling', () => {
    const plugin: IPlugin = getMockPlugin()
    plugin.lifecycle.error = () => {}
    vi.spyOn(plugin.lifecycle, 'error')
    transformLifecycle(plugin)
    plugin.lifecycle.activate()
    expect(plugin.lifecycle.error).toHaveBeenCalledTimes(1)
  })
})

describe('transformMetaData', () => {
  test('support is undefined', () => {
    const plugin = getMockPlugin()
    const transformed = transformPlugin(plugin)
    expect(transformed.metaData.support).toBe(true)
  })

  test('support is boolean', () => {
    const plugin = getMockPlugin()
    plugin.metaData.support = false
    const transformed = transformPlugin(plugin)
    expect(transformed.metaData.support).toBe(false)
  })

  test('support is function', () => {
    const plugin = getMockPlugin()
    plugin.metaData.support = () => false
    const transformed = transformPlugin(plugin)
    expect(transformed.metaData.support).toBe(false)
  })
})

describe('transformIcon', () => {
  test('icon is emoji', () => {
    expect(transformIcon('🚀')).toBe('🚀')
  })

  test('icon is file path', () => {
    expect(() => transformIcon('path/to/icon.svg')).toThrow()
  })

  test('icon is base64', () => {
    const icon =
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmci'
    expect(transformIcon(icon)).toBe(icon)
  })
})
