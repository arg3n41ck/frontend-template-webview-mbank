import { ThemeProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'
import { Toaster } from '@/shared/ui/shadcn/sonner'
import { TooltipProvider } from '@/shared/ui/shadcn/tooltip'
import { NativeHostContext } from '@/shared/native/context'
import { createApiClient } from '@/shared/services/api/client'
import { env } from '@/shared/config/env'
import { createMbankBootstrap, MbankSessionBoundary } from '@/modules/Session'
import { QueryProvider } from './QueryProvider'
import { nativeHost } from '../nativeHost'
import { launch } from '../launch'
const api = createApiClient({ baseURL: env.VITE_API_BASE_URL, language: () => launch.lang })
const bootstrap = createMbankBootstrap(api, launch.token)
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <NativeHostContext.Provider value={nativeHost}>
      <ThemeProvider
        attribute="class"
        defaultTheme={launch.theme}
        forcedTheme={launch.theme}
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <TooltipProvider>
            <MbankSessionBoundary
              enabled={env.VITE_MBANK_AUTH_ENABLED && !launch.guest}
              bootstrap={bootstrap}
            >
              {children}
            </MbankSessionBoundary>
            <Toaster />
          </TooltipProvider>
        </QueryProvider>
      </ThemeProvider>
    </NativeHostContext.Provider>
  )
}
