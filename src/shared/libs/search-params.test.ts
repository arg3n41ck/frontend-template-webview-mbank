import { expect, it } from 'vitest'
import { validateListSearch } from './search-params'
it('normalizes invalid URL values with bounded defaults', () => {
  expect(
    validateListSearch({ page: '2abc', q: 'x'.repeat(201), limit: 999, order: 'evil' }),
  ).toEqual({ page: 1, q: '', limit: 20, order: 'asc' })
})
it('valid search retains Unicode and only typed owned keys', () => {
  expect(
    validateListSearch({
      page: '3',
      q: ' Бишкек & test ',
      limit: '50',
      order: 'desc',
      token: 'secret',
    }),
  ).toEqual({ page: 3, q: 'Бишкек & test', limit: 50, order: 'desc' })
})
it('does not accept negative, fractional or huge pages', () => {
  for (const page of ['-1', '0', '1.5', '1000001', 'Infinity'])
    expect(validateListSearch({ page })).toMatchObject({ page: 1 })
})
