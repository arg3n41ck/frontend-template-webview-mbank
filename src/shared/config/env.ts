import { z } from 'zod'
const schema = z.object({ VITE_API_BASE_URL: z.string().default('/api'), VITE_MBANK_AUTH_ENABLED: z.string().default('false').transform(value => value === 'true'), VITE_ENABLE_MBANK_MOCK: z.string().default('false').transform(value => value === 'true'), VITE_MBANK_ALLOWED_ORIGINS: z.string().default('') })
export const env = schema.parse(import.meta.env)
