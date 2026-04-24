import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
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

function useIsLg() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia('(min-width: 1024px)')
      mq.addEventListener('change', onStoreChange)
      return () => mq.removeEventListener('change', onStoreChange)
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  )
}

function Dashboard() {
  const isLg = useIsLg()
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

  const chartFallback = (
    <div className="h-80 w-full animate-pulse rounded-lg bg-gray-800 lg:w-96" />
  )

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 px-4 py-8 text-gray-100 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col gap-6">
        <header className="shrink-0 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
          <p className="text-sm text-gray-400">
            Monitoreo en tiempo real de las 20 criptomonedas con mayor market cap.
          </p>
        </header>

        <div className="shrink-0">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        {selectedAsset && !isLg ? (
          <div className="w-full shrink-0">
            <Suspense fallback={chartFallback}>
              <PriceChart selectedAsset={selectedAsset} onClose={() => setSelectedAsset(null)} />
            </Suspense>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
            <div
              ref={tableScrollRef}
              className="custom-scrollbar lg:max-h-[calc(100vh-12rem)] lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
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
                scrollRootRef={isLg ? tableScrollRef : undefined}
                selectedAssetId={selectedAsset?.id ?? null}
              />
            </div>
          </div>

          {selectedAsset && isLg ? (
            <div className="w-full shrink-0 lg:sticky lg:top-4 lg:w-96 lg:self-start">
              <Suspense fallback={chartFallback}>
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
