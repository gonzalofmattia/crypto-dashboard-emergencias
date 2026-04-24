import { useQuery } from '@tanstack/react-query'
import { fetchAssets } from '../services/coingecko'

export function useAssets() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  return { assets: data ?? [], isLoading, isError }
}
