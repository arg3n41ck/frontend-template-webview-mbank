import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useNativeHost } from '@/shared/native/context'

/** Cancel JS waiting on navigation; a started native side effect is not undone. */
export function useNativeClose() {
  const host = useNativeHost()
  const pending = useRef<AbortController | null>(null)
  const [closing, setClosing] = useState(false)

  useEffect(
    () => () => {
      pending.current?.abort()
    },
    [],
  )

  const close = async () => {
    // A ref gates duplicate clicks before React has rendered the disabled state.
    if (pending.current) return
    const controller = new AbortController()
    pending.current = controller
    setClosing(true)
    try {
      if (!host.close) throw new Error('No close capability')
      await host.close({ signal: controller.signal })
    } catch {
      if (!controller.signal.aborted) {
        toast.error('Native close is unavailable. No action was confirmed.')
      }
    } finally {
      if (pending.current === controller) pending.current = null
      if (!controller.signal.aborted) setClosing(false)
    }
  }

  return { closing, close }
}
