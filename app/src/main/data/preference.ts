import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { BehaviorSubject, type Observable } from 'rxjs'
import * as yaml from 'yaml'

export interface PreferencesMeta {
  id: string
  path: string
}

export class Preferences<T> {
  constructor(
    private meta: PreferencesMeta,
    private defaults: T,
  ) {
    this.restore()
    this.observable = new BehaviorSubject(this.value)
  }

  _value!: T
  get value() {
    return this._value
  }
  set value(value: T) {
    this._value = value
    writeFileSync(this.meta.path, yaml.stringify(value))
    this.observable
  }

  observable: Observable<T>

  restore() {
    if (existsSync(this.meta.path)) {
      try {
        this.value = yaml.parse(readFileSync(this.meta.path, 'utf8'))
      } catch {
        this.value = this.defaults
      }
      return
    }
    this.value = this.defaults
  }
}
