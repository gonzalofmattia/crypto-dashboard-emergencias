import { AssetRow } from './AssetRow'
import { SkeletonRow } from './SkeletonRow'
import type { Asset } from '../types'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  isError: boolean
  searchTerm: string
  onSelectAsset: (asset: Asset) => void
}

export function AssetTable({
  assets,
  isLoading,
  isError,
  searchTerm,
  onSelectAsset,
}: AssetTableProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredAssets = assets.filter((asset) => {
    if (!normalizedSearch) {
      return true
    }

    return (
      asset.name.toLowerCase().includes(normalizedSearch) ||
      asset.symbol.toLowerCase().includes(normalizedSearch)
    )
  })

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">24h</th>
              <th className="px-4 py-3">Market Cap</th>
              <th className="px-4 py-3">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => <SkeletonRow key={index} />)
              : isError
                ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-300">
                        No se pudieron cargar los datos del mercado. Reintenta en unos segundos.
                      </td>
                    </tr>
                  )
              : filteredAssets.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} onSelect={onSelectAsset} />
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && !isError && filteredAssets.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-gray-400">
          No se encontraron activos para esa búsqueda.
        </p>
      )}
    </div>
  )
}
