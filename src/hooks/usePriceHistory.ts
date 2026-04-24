import { useQuery } from '@tanstack/react-query'
import { fetchPriceHistory } from '../services/coingecko'

export function usePriceHistory(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['price-history', id],
    queryFn: () => fetchPriceHistory(id),
    enabled: !!id,
  })

  return { data: data ?? [], isLoading }
}
