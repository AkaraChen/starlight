import type { Schema } from 'zod'

export interface IPreferenceBase {
  id: string
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

export interface IListPreference<T extends TBasicPreference>
  extends IPreferenceBase {
  type: 'list'
  defaultValue?: TBasicPreference['defaultValue'][]
  options: T[]
}

export type TBasicPreference =
  | IBooleanPreference
  | IStringPreference
  | INumberPreference

export type TPreference =
  | TBasicPreference
  | IListPreference<IBooleanPreference>
  | IListPreference<IStringPreference>
  | IListPreference<INumberPreference>
