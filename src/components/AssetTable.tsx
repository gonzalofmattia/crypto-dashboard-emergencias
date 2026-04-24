import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { AssetRow } from './AssetRow'
import { SkeletonRow } from './SkeletonRow'
import type { Asset } from '../types'

interface AssetTableProps {
  assets: Asset[]
  isLoading: boolean
  isError: boolean
  searchTerm: string
  onSelectAsset: (asset: Asset) => void
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  scrollRootRef?: RefObject<HTMLDivElement | null>
  selectedAssetId: string | null
}

export function AssetTable({
  assets,
  isLoading,
  isError,
  searchTerm,
  onSelectAsset,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  scrollRootRef,
  selectedAssetId,
}: AssetTableProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const searchActive = searchTerm.trim().length > 0
  const infiniteScrollEnabled = hasNextPage && !searchActive

  useEffect(() => {
    if (!infiniteScrollEnabled) return

    const el = loadMoreRef.current
    if (!el) return

    const root = scrollRootRef?.current ?? undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry?.isIntersecting &&
          hasNextPage &&
          !isLoading &&
          !isFetchingNextPage &&
          !searchTerm.trim()
        ) {
          fetchNextPage()
        }
      },
      { root, rootMargin: '0px', threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [
    fetchNextPage,
    hasNextPage,
    infiniteScrollEnabled,
    isFetchingNextPage,
    isLoading,
    scrollRootRef,
    searchTerm,
  ])

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return assets.filter((asset) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.symbol.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [assets, searchTerm])

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
                : (
                    <>
                      {filteredAssets.map((asset) => (
                        <AssetRow
                          key={asset.id}
                          asset={asset}
                          onSelect={onSelectAsset}
                          isSelected={asset.id === selectedAssetId}
                        />
                      ))}
                      {infiniteScrollEnabled && isFetchingNextPage
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonRow key={`next-${index}`} />
                          ))
                        : null}
                    </>
                  )}
          </tbody>
        </table>
        {infiniteScrollEnabled ? (
          <div ref={loadMoreRef} className="h-2 w-full shrink-0" />
        ) : null}
      </div>
      {!isLoading && !isError && filteredAssets.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-gray-400">
          No se encontraron activos para esa búsqueda.
        </p>
      )}
    </div>
  )
}
