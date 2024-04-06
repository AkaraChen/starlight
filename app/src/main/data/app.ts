import os from 'node:os'
import path from 'node:path'
import type { InferFromTPreference } from '@starlight-app/plugin-utils'
import { z } from 'zod'
import { Preferences } from './preference'

export const appPreferences = [
  {
    id: 'dataDir',
    type: 'string',
    name: 'Data Dir',
    description: 'The directory where the data is stored',
    required: false,
    schema: z.string().trim(),
  },
  {
    id: 'startAtLogin',
    type: 'boolean',
    name: 'Start at login',
    description: 'Whether to start the app at login',
    required: false,
    defaultValue: true,
  },
] as const

export const StarlightPreference = new Preferences<
  InferFromTPreference<typeof appPreferences>
>(
  {
    id: 'starlight',
    path: 'app.yaml',
  },
  {
    startAtLogin: true,
    dataDir: path.join(os.homedir(), '.starlight'),
  },
)
