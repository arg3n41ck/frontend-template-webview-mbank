import { useQuery } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import type { MbankUser } from '../api/bootstrap'
interface Props extends PropsWithChildren {
  enabled: boolean
  bootstrap: () => Promise<MbankUser | null>
}
export function MbankSessionBoundary({ children, enabled, bootstrap }: Props) {
  const session = useQuery({
    queryKey: ['mbank-entry-session'],
    queryFn: bootstrap,
    enabled,
    retry: false,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
  if (enabled && session.isPending)
    return (
      <p role="status" className="p-4">
        Signing in with MBANK…
      </p>
    )
  if (enabled && (session.isError || !session.data?.authenticated))
    return (
      <p role="alert" className="p-4">
        The session could not be authorized. Reopen this service in MBANK; credentials will not be
        replayed automatically.
      </p>
    )
  return children
}
