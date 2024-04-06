import type { Schema } from 'zod'

export interface IPreferenceBase {
  name: string
  description: string
  required: boolean
}

export interface IBooleanPreference extends IPreferenceBase {
  type: 'boolean'
  defaultValue?: boolean
}

export interface IStringPreference extends IPreferenceBase {
  type: 'string'
  defaultValue?: string
  schema?: Schema
}

export interface INumberPreference extends IPreferenceBase {
  type: 'number'
  defaultValue?: number
}

export interface IListPreference<T extends IPreferenceBase>
  extends IPreferenceBase {
  type: 'list'
  defaultValue?: T
  options: T[]
}

export type TPreference =
  | IBooleanPreference
  | IStringPreference
  | INumberPreference
  | IListPreference<IBooleanPreference>
  | IListPreference<IStringPreference>
  | IListPreference<INumberPreference>
