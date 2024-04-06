import type { TPreference } from '@starlight-app/plugin-sdk/preference'

export type InferFromTPreference<T extends readonly TPreference[]> = {
  [K in T[number]['id']]: T[number]['defaultValue']
}
