import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { SearchBar } from './components/SearchBar'
import { AssetTable } from './components/AssetTable'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useAssets } from './hooks/useAssets'
import type { Asset } from './types'
import { queryClient } from './queryClient'

const PriceChart = lazy(() =>
  import('./components/PriceChart').then((m) => ({ default: m.PriceChart })),
)

function Dashboard() {
  const tableScrollRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const {
    assets,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAssets()

  const selectedAssetRef = useRef<Asset | null>(null)
  selectedAssetRef.current = selectedAsset

  useEffect(() => {
    if (assets.length > 0 && selectedAssetRef.current === null) {
      setSelectedAsset(assets[0])
    }
  }, [assets])

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 px-4 py-8 text-gray-100 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 min-h-0">
        <div className="flex min-h-0 flex-1 gap-6">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
            <header className="shrink-0 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
              <p className="text-sm text-gray-400">
                Monitoreo en tiempo real de las 20 criptomonedas con mayor market cap.
              </p>
            </header>

            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            <div
              ref={tableScrollRef}
              className="custom-scrollbar max-h-[calc(100vh-12rem)] min-h-0 flex-1 overflow-y-auto"
            >
              <AssetTable
                assets={assets}
                isLoading={isLoading}
                isError={isError}
                searchTerm={searchTerm}
                onSelectAsset={setSelectedAsset}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage ?? false}
                isFetchingNextPage={isFetchingNextPage}
                scrollRootRef={tableScrollRef}
                selectedAssetId={selectedAsset?.id ?? null}
              />
            </div>
          </div>

          {selectedAsset ? (
            <div className="sticky top-4 w-96 shrink-0 self-start">
              <Suspense
                fallback={<div className="h-80 animate-pulse rounded-lg bg-gray-800" />}
              >
                <PriceChart selectedAsset={selectedAsset} onClose={() => setSelectedAsset(null)} />
              </Suspense>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App
