import { useSearch, useNavigate } from '@tanstack/react-router'
import { HomePage } from '@/modules/Home'
export function HomeRoute() {
  const search = useSearch({ from: '/' }),
    navigate = useNavigate({ from: '/' })
  return (
    <HomePage
      search={search}
      onSearch={(q) =>
        void navigate({ search: (previous) => ({ ...previous, q, page: 1 }), replace: true })
      }
    />
  )
}
