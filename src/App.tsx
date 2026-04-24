import { lazy, Suspense, useState } from 'react'
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

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 text-gray-100 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Crypto Dashboard</h1>
          <p className="text-sm text-gray-400">
            Monitoreo en tiempo real de las 20 criptomonedas con mayor market cap.
          </p>
        </header>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <AssetTable
          assets={assets}
          isLoading={isLoading}
          isError={isError}
          searchTerm={searchTerm}
          onSelectAsset={setSelectedAsset}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
        />

        {selectedAsset && (
          <Suspense
            fallback={<div className="h-80 animate-pulse rounded-lg bg-gray-800" />}
          >
            <PriceChart selectedAsset={selectedAsset} onClose={() => setSelectedAsset(null)} />
          </Suspense>
        )}
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
