import axios, { AxiosError, AxiosHeaders, type AxiosAdapter } from 'axios'
import { expect, it, vi } from 'vitest'
import { createApiClient } from './client'
const response = (config: Parameters<AxiosAdapter>[0], data = {}) => ({
  config,
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
})
const unauthorized = (config: Parameters<AxiosAdapter>[0]) =>
  new AxiosError(
    'Unauthorized',
    'ERR_BAD_REQUEST',
    config,
    {},
    { ...response(config), status: 401 },
  )
it('preserves caller headers and merges language', async () => {
  let headers: AxiosHeaders | undefined
  const client = createApiClient({
    baseURL: '/api',
    language: () => 'ru',
    adapter: async (config: Parameters<AxiosAdapter>[0]) => {
      headers = config.headers
      return response(config)
    },
  })
  await client.get('/data', { headers: { 'X-Project': 'test' } })
  expect(headers?.get('X-Project')).toBe('test')
  expect(headers?.get('Accept-Language')).toBe('ru')
})
it('shares one refresh for concurrent 401 and replays each request at most once', async () => {
  let refreshed = false
  const refresh = vi.fn(async () => {
    await new Promise((r) => setTimeout(r, 10))
    refreshed = true
    return true
  })
  const adapter: AxiosAdapter = async (config) => {
    if (!refreshed) throw unauthorized(config)
    return response(config)
  }
  const client = createApiClient({
    baseURL: '/api',
    adapter,
    session: { version: () => 1, refresh, expire: vi.fn() },
  })
  await Promise.all([client.get('/one'), client.get('/two')])
  expect(refresh).toHaveBeenCalledTimes(1)
})
it('ends expired session without a refresh loop', async () => {
  const expire = vi.fn()
  const refresh = vi.fn(async () => true)
  const client = createApiClient({
    baseURL: '/api',
    adapter: async (config: Parameters<AxiosAdapter>[0]) => {
      throw unauthorized(config)
    },
    session: { version: () => 1, refresh, expire },
  })
  await expect(client.get('/data')).rejects.toMatchObject({ response: { status: 401 } })
  expect(refresh).toHaveBeenCalledTimes(1)
  expect(expire).toHaveBeenCalledTimes(1)
})
it('does not commit a response belonging to a previous session', async () => {
  let version = 1
  const adapter: AxiosAdapter = async (config) => {
    version = 2
    return response(config, { user: 'old' })
  }
  const client = createApiClient({
    baseURL: '/api',
    adapter,
    session: { version: () => version, refresh: async () => true, expire: vi.fn() },
  })
  await expect(client.get('/me')).rejects.toMatchObject({ code: 'SESSION_CHANGED' })
})
it('passes AbortSignal into Axios and does not refresh cancellation', async () => {
  const controller = new AbortController()
  controller.abort()
  const refresh = vi.fn()
  const client = createApiClient({
    baseURL: '/api',
    session: { version: () => 1, refresh, expire: vi.fn() },
  })
  await expect(client.get('/data', { signal: controller.signal })).rejects.toSatisfy(axios.isCancel)
  expect(refresh).not.toHaveBeenCalled()
})
