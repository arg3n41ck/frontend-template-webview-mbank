import type { QueryClient } from '@tanstack/react-query'
export function createSessionScope(client: QueryClient) {
  let version = 0
  return {
    version: () => version,
    async reset() {
      version++
      await client.cancelQueries()
      client.clear()
    },
  }
}
