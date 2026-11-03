import { defaultListSearch } from '@/shared/libs/search-params'
import { Link, Outlet } from '@tanstack/react-router'
import { hostLayout, paths } from '@/shared/config/host'
import { WebviewShell } from '@/shared/ui/webview/WebviewShell'
export function RootPage() {
  return (
    <WebviewShell
      {...hostLayout}
      header={
        hostLayout.nativeHeader ? undefined : (
          <nav aria-label="Main">
            <Link to={paths.home} search={defaultListSearch} className="font-medium">
              WebView starter
            </Link>
          </nav>
        )
      }
    >
      <Outlet />
    </WebviewShell>
  )
}
