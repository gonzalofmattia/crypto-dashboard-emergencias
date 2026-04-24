import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AssetTable } from '../components/AssetTable'

const mockAsset = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: '',
  current_price: 77987,
  market_cap: 1561703713458,
  market_cap_rank: 1,
  price_change_percentage_24h: -0.56,
  total_volume: 36881213833,
  high_24h: 78507,
  low_24h: 77238,
}

describe('AssetTable', () => {
  it('shows animate-pulse elements when loading', () => {
    const { container } = render(
      <AssetTable
        assets={[]}
        isLoading
        isError={false}
        searchTerm=""
        onSelectAsset={vi.fn()}
      />,
    )
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows Bitcoin when not loading and assets include Bitcoin', () => {
    render(
      <AssetTable
        assets={[mockAsset]}
        isLoading={false}
        isError={false}
        searchTerm=""
        onSelectAsset={vi.fn()}
      />,
    )
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
  })
})
