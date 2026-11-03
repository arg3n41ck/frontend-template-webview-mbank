import { createRootRoute, createRoute, createRouter, Link } from '@tanstack/react-router'
import { DemoFormPage } from '@/modules/DemoForm'
import { RootPage } from '@/pages/root'
import { HomeRoute } from '@/pages/home'
import { validateListSearch, defaultListSearch } from '@/shared/libs/search-params'
const root = createRootRoute({
  component: RootPage,
  errorComponent: () => <p role="alert">The page could not load. Reopen this service safely.</p>,
  notFoundComponent: () => (
    <div>
      <h1>Page not found</h1>
      <Link to="/" search={defaultListSearch}>
        Return to start
      </Link>
    </div>
  ),
})
const home = createRoute({
  getParentRoute: () => root,
  path: '/',
  validateSearch: validateListSearch,
  component: HomeRoute,
})
const form = createRoute({ getParentRoute: () => root, path: '/form', component: DemoFormPage })
export const router = createRouter({
  routeTree: root.addChildren([home, form]),
  basepath: import.meta.env.BASE_URL,
  scrollRestoration: false,
})
// Scroll belongs to the shell's one scroller, not body; add product-specific restoration deliberately.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
