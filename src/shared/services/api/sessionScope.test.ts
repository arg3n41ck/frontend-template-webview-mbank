import { QueryClient } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { createSessionScope } from './sessionScope'

it('invalidates the session synchronously and removes private cached data', async () => {
  const client = new QueryClient()
  client.setQueryData(['private-user'], { name: 'previous session' })
  const scope = createSessionScope(client)
  const reset = scope.reset()
  expect(scope.version()).toBe(1)
  await reset
  expect(client.getQueryData(['private-user'])).toBeUndefined()
  await scope.reset()
  expect(scope.version()).toBe(2)
})

it('cancels in-flight queries before clearing the session cache', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const cancelled = vi.fn()
  const pending = client.fetchQuery({
    queryKey: ['private-request'],
    queryFn: ({ signal }) => new Promise((_, reject) => {
      signal.addEventListener('abort', () => { cancelled(); reject(new Error('cancelled')) }, { once: true })
    }),
  }).catch(() => undefined)
  await createSessionScope(client).reset()
  await pending
  expect(cancelled).toHaveBeenCalledTimes(1)
  expect(client.getQueryCache().getAll()).toHaveLength(0)
})
