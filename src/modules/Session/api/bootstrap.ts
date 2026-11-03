import { z } from 'zod'
const userSchema = z.object({
  authenticated: z.boolean(),
  user_id: z.number(),
  inn: z.string(),
  full_name: z.string(),
  phone_number: z.string(),
  birth_date: z.string(),
})
export type MbankUser = z.infer<typeof userSchema>
interface AuthTransport {
  post: (url: string, body: { token: string }) => Promise<unknown>
  get: (url: string) => Promise<{ data: unknown }>
}
export function createMbankBootstrap(client: AuthTransport, token: string | null) {
  let pending: Promise<MbankUser | null> | undefined
  return () => {
    if (!token || token === 'GUEST') return Promise.resolve(null)
    // Keep the same settled promise: auth POST must not replay on StrictMode, query retry or error UI.
    pending ??= (async () => {
      await client.post('/auth/mbank-token', { token })
      return userSchema.parse((await client.get('/auth/me')).data)
    })()
    return pending
  }
}
