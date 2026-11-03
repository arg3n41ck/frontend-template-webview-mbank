import { expect, it, vi } from 'vitest'
import { createMbankHost } from './client'
const bridge = { version: 1, invoke: vi.fn(async () => ({ ok: true, result: { status: 'ok' } })) }
it('production cannot activate a requested mock', async () => {
  const host = createMbankHost({
    read: () => null,
    development: false,
    enableMock: true,
    allowedOrigins: ['https://app.test'],
  })
  expect(host.available()).toBe(false)
  await expect(host.invoke('app.close', {}, { attempts: 1 })).rejects.toMatchObject({
    code: 'bridgeUnavailable',
  })
})
it('development preview never fakes payment or auth', async () => {
  const host = createMbankHost({
    read: () => null,
    development: true,
    enableMock: true,
    allowedOrigins: [],
  })
  await expect(host.invoke('payment.start', { serviceId: '1', code: '1' })).rejects.toMatchObject({
    code: 'unsupportedAction',
  })
  await expect(host.invoke('auth.required', {})).rejects.toMatchObject({
    code: 'unsupportedAction',
  })
})
it('rejects fake origin prefixes and URL credentials before dispatch', async () => {
  const host = createMbankHost({ read: () => bridge, allowedOrigins: ['https://app.test'] })
  bridge.invoke.mockClear()
  for (const url of [
    'https://app.test.evil/',
    'https://app.test@evil.test',
    'javascript:alert(1)',
    'https://user:pass@app.test/',
  ])
    await expect(host.invoke('external.open', { url })).rejects.toMatchObject({
      code: 'invalidPayload',
    })
  expect(bridge.invoke).not.toHaveBeenCalled()
})
it('allows approved URLs, rejects invented actions', async () => {
  const host = createMbankHost({ read: () => bridge, allowedOrigins: ['https://app.test'] })
  await expect(host.invoke('external.open', { url: 'https://app.test/path' })).resolves.toEqual({
    status: 'ok',
  })
  await expect(host.invoke('invented.callback', {})).rejects.toMatchObject({
    code: 'unsupportedAction',
  })
})
it('bounds text and base64 in documented character units', async () => {
  const host = createMbankHost({ read: () => bridge, allowedOrigins: [] })
  await expect(host.invoke('share.text', { text: 'x'.repeat(100001) })).rejects.toMatchObject({
    code: 'invalidPayload',
  })
  await expect(
    host.invoke('pdf.previewBase64', { base64: 'x'.repeat(5242881) }),
  ).rejects.toMatchObject({ code: 'invalidPayload' })
})
