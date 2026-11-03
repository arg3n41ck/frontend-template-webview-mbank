import { afterEach, describe, expect, it, vi } from 'vitest'
import { invokeNative } from './request'
afterEach(() => vi.useRealTimers())
const success = { version: 1, invoke: async () => ({ ok: true, result: { status: 'ok' } }) }
describe('native boundary', () => {
  it('returns a validated result', async () => {
    await expect(invokeNative(() => success, 'share', {})).resolves.toEqual({ status: 'ok' })
  })
  it('does not claim success without a native host', async () => {
    await expect(invokeNative(() => null, 'share', {}, { attempts: 1 })).rejects.toMatchObject({
      code: 'bridgeUnavailable',
    })
  })
  it('normalizes rejected transport without exposing details', async () => {
    await expect(
      invokeNative(
        () => ({
          ...success,
          invoke: async () => {
            throw new Error('token=secret')
          },
        }),
        'share',
        {},
      ),
    ).rejects.toMatchObject({ code: 'handlerFailed', message: 'Native transport failed.' })
  })
  it('rejects malformed envelopes', async () => {
    await expect(
      invokeNative(() => ({ ...success, invoke: async () => ({ ok: true }) }), 'share', {}),
    ).rejects.toMatchObject({ code: 'invalidEnvelope' })
  })
  it('rejects unsupported versions before invoking', async () => {
    const invoke = vi.fn(success.invoke)
    await expect(invokeNative(() => ({ version: 2, invoke }), 'share', {})).rejects.toMatchObject({
      code: 'unsupportedVersion',
    })
    expect(invoke).not.toHaveBeenCalled()
  })
  it('bounds unavailable checks to three TOTAL attempts', async () => {
    const read = vi.fn(() => null)
    await expect(
      invokeNative(read, 'share', {}, { attempts: 3, retryDelayMs: 0 }),
    ).rejects.toMatchObject({ code: 'bridgeUnavailable' })
    expect(read).toHaveBeenCalledTimes(3)
  })
  it('handles late bridge readiness without replaying an invoked action', async () => {
    const read = vi.fn().mockReturnValueOnce(null).mockReturnValue(success)
    await expect(
      invokeNative(read, 'share', {}, { attempts: 2, retryDelayMs: 0 }),
    ).resolves.toEqual({ status: 'ok' })
  })
  it('never retries a native error response', async () => {
    const invoke = vi.fn(async () => ({
      ok: false,
      error: { code: 'missingCapability', details: 'secret' },
    }))
    await expect(invokeNative(() => ({ version: 1, invoke }), 'share', {})).rejects.toMatchObject({
      code: 'missingCapability',
    })
    expect(invoke).toHaveBeenCalledTimes(1)
  })
  it('times out once; late native completion is not replayed', async () => {
    vi.useFakeTimers()
    const invoke = vi.fn(() => new Promise(() => {}))
    const pending = invokeNative(() => ({ version: 1, invoke }), 'payment', {}, { timeoutMs: 50 })
    const result = pending.catch((error) => error)
    await vi.advanceTimersByTimeAsync(50)
    expect(await result).toMatchObject({ code: 'timeout' })
    expect(invoke).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('aborts locally and cleans up timeout', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const pending = invokeNative(
      () => ({ ...success, invoke: () => new Promise(() => {}) }),
      'share',
      {},
      { signal: controller.signal },
    )
    const check = expect(pending).rejects.toMatchObject({ code: 'aborted' })
    controller.abort()
    await check
    expect(vi.getTimerCount()).toBe(0)
  })
  it('does not dispatch a pre-aborted request', async () => {
    const controller = new AbortController()
    controller.abort()
    const read = vi.fn(() => success)
    await expect(
      invokeNative(read, 'share', {}, { signal: controller.signal }),
    ).rejects.toMatchObject({ code: 'aborted' })
    expect(read).not.toHaveBeenCalled()
  })
})
it('does not dispatch if aborted before the queued invoke microtask', async () => {
  const controller = new AbortController(),
    invoke = vi.fn(success.invoke)
  const pending = invokeNative(
    () => ({ version: 1, invoke }),
    'share',
    {},
    { signal: controller.signal },
  )
  controller.abort()
  await expect(pending).rejects.toMatchObject({ code: 'aborted' })
  expect(invoke).not.toHaveBeenCalled()
})
it('rejects cyclic payloads with a sanitized typed error', async () => {
  const payload: import('./types').NativePayload = {}
  payload.self = payload
  await expect(invokeNative(() => success, 'share', payload)).rejects.toMatchObject({
    code: 'invalidPayload',
  })
})
