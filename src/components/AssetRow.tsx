import type { Asset } from '../types'
import { formatPrice } from '../utils/formatPrice'

interface AssetRowProps {
  asset: Asset
  onSelect: (asset: Asset) => void
  isSelected: boolean
}

const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function AssetRow({ asset, onSelect, isSelected }: AssetRowProps) {
  const change = asset.price_change_percentage_24h ?? 0
  const changeColor = change >= 0 ? 'text-green-400' : 'text-red-400'
  const formattedSymbol = asset.symbol.toUpperCase()
  const rowClass = isSelected
    ? 'cursor-pointer border-b border-gray-800 bg-gray-700 transition'
    : 'cursor-pointer border-b border-gray-800 transition hover:bg-gray-800/70'

  return (
    <tr className={rowClass} onClick={() => onSelect(asset)}>
      <td className="px-4 py-4 text-gray-300">{asset.market_cap_rank}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={asset.image} alt={asset.name} className="h-8 w-8 rounded-full" />
          <div>
            <p className="font-medium text-gray-100">{asset.name}</p>
            <p className="text-xs text-gray-400">{formattedSymbol}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-100">{formatPrice(asset.current_price)}</td>
      <td className={`px-4 py-4 font-medium ${changeColor}`}>{change.toFixed(2)}%</td>
      <td className="px-4 py-4 text-gray-300">{compactUsdFormatter.format(asset.market_cap)}</td>
      <td className="px-4 py-4 text-gray-300">{compactUsdFormatter.format(asset.total_volume)}</td>
    </tr>
  )
}
