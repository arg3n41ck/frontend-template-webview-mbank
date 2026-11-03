import { expect, it, vi } from 'vitest'
import { readMbankLaunch } from './launch'
it('consumes credentials, preserves other URL metadata and hash', () => {
  const replace = vi.fn()
  expect(
    readMbankLaunch(
      'https://app.test/form?token=secret&customToken=private&theme=dark&lang=ky&campaign=demo#section',
      replace,
    ),
  ).toMatchObject({
    token: 'secret',
    customToken: 'private',
    theme: 'dark',
    lang: 'ky',
    guest: false,
  })
  const url = new URL(replace.mock.calls[0][0], 'https://app.test')
  expect(url.searchParams.has('token')).toBe(false)
  expect(url.searchParams.has('customToken')).toBe(false)
  expect(url.searchParams.get('campaign')).toBe('demo')
  expect(url.hash).toBe('#section')
})
it('missing and GUEST token skip authentication', () => {
  for (const q of ['', '?token=GUEST'])
    expect(readMbankLaunch('https://app.test/' + q, vi.fn())).toMatchObject({
      token: null,
      guest: true,
    })
})
it('preferences default and all duplicate secrets are scrubbed', () => {
  const replace = vi.fn()
  expect(
    readMbankLaunch('https://app.test/?token=a&token=b&lang=evil&theme=evil', replace),
  ).toMatchObject({ token: 'a', lang: 'ru', theme: 'system' })
  expect(replace.mock.calls[0][0]).not.toContain('token')
})
