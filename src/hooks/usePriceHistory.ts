import { useQuery } from '@tanstack/react-query'
import { fetchPriceHistory } from '../services/coingecko'

export function usePriceHistory(id: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['price-history', id],
    queryFn: () => fetchPriceHistory(id),
    enabled: !!id,
    retry: 2,
    retryDelay: 2000,
  })

  return { data: data ?? [], isLoading, isError }
}
