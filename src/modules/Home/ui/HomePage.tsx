import { Link } from '@tanstack/react-router'
import { paths } from '@/shared/config/host'
import type { ListSearch } from '@/shared/libs/search-params'
import { useNativeHost } from '@/shared/native/context'
import { Button } from '@/shared/ui/shadcn/button'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { useHomeDemo } from '../hooks/useHomeDemo'
import { useNativeClose } from '../hooks/useNativeClose'
interface Props {
  search: ListSearch
  onSearch: (q: string) => void
}
export function HomePage({ search, onSearch }: Props) {
  const query = useHomeDemo(search),
    host = useNativeHost()
  const { closing, close } = useNativeClose()
  return (
    <section className="mx-auto w-full max-w-xl space-y-6">
      <Badge variant="secondary">WebView foundation</Badge>
      <h1 className="text-2xl font-semibold">Mobile WebView starter</h1>
      <p className="text-muted-foreground">
        TanStack Query, typed URL state, shadcn UI. Native capabilities are configured by your host,
        never assumed.
      </p>
      <p className="text-sm">
        Host: <strong>{host.name}</strong>
      </p>
      <div className="space-y-2">
        <Label htmlFor="search">Search sample data</Label>
        <Input id="search" value={search.q} onChange={(event) => onSearch(event.target.value)} />
      </div>
      {query.isPending ? (
        <p role="status">Loading sample data…</p>
      ) : query.isError ? (
        <p role="alert">
          Could not load data.{' '}
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </p>
      ) : query.data?.length ? (
        <ul className="space-y-2" aria-label="Sample items">
          {query.data.map((item) => (
            <li key={item.id} className="rounded-lg border p-4">
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p role="status">No matching sample items.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to={paths.form}>Try the form</Link>
        </Button>
        <Button variant="outline" disabled={closing} onClick={() => void close()}>
          {closing ? 'Waiting…' : 'Close in native app'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This list is local sample data, not a live API or native mock. Test your actual host on iOS
        and Android before release.
      </p>
    </section>
  )
}
