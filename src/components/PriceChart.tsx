import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePriceHistory } from '../hooks/usePriceHistory'
import type { Asset } from '../types'

interface PriceChartProps {
  selectedAsset: Asset | null
  onClose: () => void
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function PriceChart({ selectedAsset, onClose }: PriceChartProps) {
  const selectedId = selectedAsset?.id ?? ''
  const { data, isLoading, isError } = usePriceHistory(selectedId)
  const chartData = data.filter((_, index) => index % 24 === 0)
  const showFailure = !isLoading && (isError || data.length === 0)

  if (!selectedAsset) {
    return null
  }

  return (
    <section className="min-h-80 rounded-xl border border-gray-800 bg-gray-800 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">
          {selectedAsset.name} - Últimos 7 días
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-200 transition hover:bg-gray-700"
        >
          Cerrar
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-gray-700" />
      ) : showFailure ? (
        <div className="flex h-64 items-center justify-center px-4 text-center text-sm text-gray-400">
          No se pudo cargar el historial. Intentá de nuevo en unos segundos.
        </div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="timestamp"
                minTickGap={60}
                tickFormatter={(value) => dateFormatter.format(new Date(value))}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                stroke="#4b5563"
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                stroke="#4b5563"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#f9fafb',
                }}
                formatter={(value) => {
                  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                  return priceFormatter.format(numericValue)
                }}
                labelFormatter={(label) => dateFormatter.format(new Date(Number(label)))}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
