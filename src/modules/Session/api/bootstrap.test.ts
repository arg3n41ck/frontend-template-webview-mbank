import { expect, it, vi } from 'vitest'
import { createMbankBootstrap } from './bootstrap'
const user = {
  authenticated: true,
  user_id: 1,
  inn: '',
  full_name: 'Sample',
  phone_number: '',
  birth_date: '',
}
it('guest makes no auth requests', async () => {
  const post = vi.fn(),
    get = vi.fn()
  await expect(createMbankBootstrap({ post, get }, null)()).resolves.toBeNull()
  expect(post).not.toHaveBeenCalled()
  expect(get).not.toHaveBeenCalled()
})
it('concurrent/StrictMode consumers share one exchange', async () => {
  const post = vi.fn(async () => ({})),
    get = vi.fn(async () => ({ data: user }))
  const bootstrap = createMbankBootstrap({ post, get }, 'secret')
  await Promise.all([bootstrap(), bootstrap()])
  expect(post).toHaveBeenCalledTimes(1)
  expect(get).toHaveBeenCalledTimes(1)
  expect(post).toHaveBeenCalledWith('/auth/mbank-token', { token: 'secret' })
})
it('failed credential exchange is not replayed', async () => {
  const post = vi.fn(async () => {
      throw new Error('Rejected')
    }),
    get = vi.fn()
  const bootstrap = createMbankBootstrap({ post, get }, 'secret')
  await expect(bootstrap()).rejects.toThrow()
  await expect(bootstrap()).rejects.toThrow()
  expect(post).toHaveBeenCalledTimes(1)
  expect(get).not.toHaveBeenCalled()
})
