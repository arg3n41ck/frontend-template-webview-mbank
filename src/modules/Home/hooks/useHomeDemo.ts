import { useQuery } from '@tanstack/react-query'
import type { ListSearch } from '@/shared/libs/search-params'
import { getDemoItems } from '../api/demoItems'
export function useHomeDemo(search: ListSearch) {
  return useQuery({
    queryKey: ['sample-items', search],
    queryFn: ({ signal }) => getDemoItems(search.q, signal),
  })
}
