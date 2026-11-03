import { expect, it } from 'vitest'
import { visibleScrollDelta } from './viewport'
it('reveals a keyboard-covered field in the one scroll container', () => {
  expect(
    visibleScrollDelta(
      { top: 0, bottom: 800 },
      { top: 450, bottom: 490 },
      { height: 400, offsetTop: 0, scale: 1 },
    ),
  ).toBe(106)
})
it('accounts for visual viewport offset', () => {
  expect(
    visibleScrollDelta(
      { top: 0, bottom: 800 },
      { top: 0, bottom: 20 },
      { height: 400, offsetTop: 40, scale: 1 },
    ),
  ).toBe(-56)
})
it('does not compensate zoom or visible fields', () => {
  expect(
    visibleScrollDelta(
      { top: 0, bottom: 800 },
      { top: 40, bottom: 60 },
      { height: 400, offsetTop: 0, scale: 1 },
    ),
  ).toBe(0)
  expect(
    visibleScrollDelta(
      { top: 0, bottom: 800 },
      { top: 450, bottom: 490 },
      { height: 400, offsetTop: 0, scale: 2 },
    ),
  ).toBe(0)
})
