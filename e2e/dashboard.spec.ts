import { test, expect } from '@playwright/test'

function mockMarketsPage(pageNum: number) {
  const row = (
    id: string,
    sym: string,
    name: string,
    rank: number,
    price: number,
  ) => ({
    id,
    symbol: sym,
    name,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    current_price: price,
    market_cap: 1e12 / rank,
    market_cap_rank: rank,
    price_change_percentage_24h: 0.5,
    total_volume: 2e10,
    high_24h: price * 1.02,
    low_24h: price * 0.98,
  })
  const first = [
    row('bitcoin', 'btc', 'Bitcoin', 1, 50_000),
    row('ethereum', 'eth', 'Ethereum', 2, 3000),
  ]
  const rest = Array.from({ length: 18 }, (_, i) =>
    row(`coin-${pageNum}-${i}`, `c${i}`, `Coin ${pageNum}-${i}`, i + 3, 1 + i * 0.1),
  )
  return [...first, ...rest]
}

test.describe('dashboard flujo principal', () => {
  test.beforeAll(() => {
    expect.configure({ timeout: 15_000 })
  })

  test('carga, tabla, gráfico y búsqueda', async ({ page }) => {
    await page.route('**/api.coingecko.com/api/v3/coins/markets*', async (route) => {
      const url = new URL(route.request().url())
      const pageNum = Number(url.searchParams.get('page') ?? '1')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockMarketsPage(pageNum)),
      })
    })

    await page.route('**/api.coingecko.com/api/v3/coins/*/market_chart*', async (route) => {
      const now = Date.now()
      const prices = Array.from({ length: 50 }, (_, i) => [
        now - (7 * 24 * 60 * 60 * 1000) + i * 4 * 60 * 60 * 1000,
        100 + i * 2,
      ]) as [number, number][]
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ prices }),
      })
    })

    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Crypto Dashboard' })).toBeVisible({
      timeout: 15_000,
    })

    await expect(page.locator('.animate-pulse').first()).toBeHidden({ timeout: 15_000 })

    const table = page.locator('table')
    await expect(table.locator('tbody').getByText('Bitcoin', { exact: true })).toBeVisible({
      timeout: 15_000,
    })

    const firstDataRow = page.locator('tbody tr').filter({ has: page.locator('td') }).first()
    await expect(firstDataRow).toHaveClass(/bg-gray-700/, { timeout: 15_000 })

    await expect(page.getByText('Últimos 7 días')).toBeVisible({ timeout: 15_000 })

    await page
      .locator('tbody tr')
      .filter({ has: page.getByText('Ethereum', { exact: true }) })
      .first()
      .click()

    await expect(page.getByRole('heading', { name: /Ethereum.*Últimos 7 días/ })).toBeVisible({
      timeout: 15_000,
    })

    const search = page.getByPlaceholder('Buscar por nombre o símbolo...')
    await search.fill('bitcoin')

    await expect(table.locator('tbody').getByText('Bitcoin', { exact: true })).toBeVisible({
      timeout: 15_000,
    })
    await expect(table.locator('tbody').getByText('Ethereum', { exact: true })).not.toBeVisible()

    await search.clear()

    await expect(page.locator('tbody tr').nth(2)).toBeVisible({ timeout: 15_000 })
  })
})
