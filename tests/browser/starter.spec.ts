import { expect, test } from '@playwright/test'
test('URL search, history and native unavailable are honest', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/?campaign=test')
  await expect(page.getByRole('heading', { name: 'Mobile WebView starter' })).toBeVisible()
  await page.getByLabel('Search sample data').fill('no-match')
  await expect(page).toHaveURL(/q=no-match/)
  expect(new URL(page.url()).searchParams.get('campaign')).toBe('test')
  await page.reload()
  await expect(page.getByLabel('Search sample data')).toHaveValue('no-match')
  await expect(page.getByRole('status').filter({ hasText: 'No matching' })).toBeVisible()
  await page.getByRole('button', { name: 'Close in native app' }).click()
  await expect(
    page.getByText('Native close is unavailable. No action was confirmed.'),
  ).toBeVisible()
  expect(errors).toEqual([])
})
test('direct form route validates, submits locally and dismisses overlay', async ({ page }) => {
  await page.goto('/form')
  await page.getByRole('button', { name: 'Submit demo' }).click()
  await expect(page.getByText('Enter your name')).toBeVisible()
  await page.getByLabel('Name', { exact: true }).fill('Argen')
  await page.getByLabel('Note', { exact: true }).fill('Local sample')
  await page.getByRole('button', { name: 'Submit demo' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Submit demo' })).toBeFocused()
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    actual: document.documentElement.scrollWidth,
  }))
  expect(dimensions.actual).toBeLessThanOrEqual(dimensions.width)
})

test('launch credentials are scrubbed before routing; guest makes no auth requests', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  const authRequests: string[] = []
  page.on('request', (req) => {
    if (req.url().includes('/auth/')) authRequests.push(req.url())
  })
  await page.goto('/?token=GUEST&customToken=private&theme=dark&lang=ky&campaign=demo#section')
  await expect(page.getByRole('heading', { name: 'Mobile WebView starter' })).toBeVisible()
  expect(page.url()).not.toContain('token=')
  expect(page.url()).not.toContain('customToken=')
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByLabel('Search sample data').fill('native')
  expect(page.url()).not.toContain('private')
  expect(authRequests).toEqual([])
})
