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

  return {
    assets: data?.pages.flat() ?? [],
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
