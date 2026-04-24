import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAssets } from '../services/coingecko'

export function useAssets() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['assets'],
    queryFn: ({ pageParam }) => fetchAssets(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === 20 ? lastPageParam + 1 : undefined,
    staleTime: 30_000,
  })

  const assets = useMemo(() => data?.pages.flat() ?? [], [data])

  return {
    assets,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
