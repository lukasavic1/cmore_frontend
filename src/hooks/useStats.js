import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/tasks'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    refetchInterval: 30_000, // background refresh every 30s
  })
}
