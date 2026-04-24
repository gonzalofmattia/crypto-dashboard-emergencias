import type { Asset, PricePoint } from '../types'

export async function fetchAssets(page: number): Promise<Asset[]> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch assets')
  }

  return response.json()
}

interface MarketChartResponse {
  prices: [number, number][]
}

export async function fetchPriceHistory(id: string): Promise<PricePoint[]> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch price history')
  }

  const data: MarketChartResponse = await response.json()
  return data.prices.map(([timestamp, price]) => ({ timestamp, price }))
}
