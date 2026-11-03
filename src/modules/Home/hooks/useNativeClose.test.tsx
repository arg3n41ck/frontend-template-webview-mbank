import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { NativeHostContext, type NativeHost } from '@/shared/native/context'
import { useNativeClose } from './useNativeClose'

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))
afterEach(cleanup)

describe('native close lifecycle', () => {
  it('gates same-frame duplicate calls', async () => {
    let complete!: () => void
    const close = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve
        }),
    )
    const host: NativeHost = { name: 'test', available: () => true, invoke: vi.fn(), close }
    const { result } = renderHook(useNativeClose, {
      wrapper: ({ children }) => <NativeHostContext value={host}>{children}</NativeHostContext>,
    })
    let first!: Promise<void>
    await act(async () => {
      first = result.current.close()
      await result.current.close()
    })
    expect(close).toHaveBeenCalledTimes(1)
    expect(result.current.closing).toBe(true)
    await act(async () => {
      complete()
      await first
    })
    expect(result.current.closing).toBe(false)
  })

  it('aborts on unmount and suppresses a late rejection toast', async () => {
    let fail!: (error: Error) => void
    let signal: AbortSignal | undefined
    const host: NativeHost = {
      name: 'test',
      available: () => true,
      invoke: vi.fn(),
      close: (options) => {
        signal = options?.signal
        return new Promise((_, reject) => {
          fail = reject
        })
      },
    }
    const { result, unmount } = renderHook(useNativeClose, {
      wrapper: ({ children }) => <NativeHostContext value={host}>{children}</NativeHostContext>,
    })
    let pending!: Promise<void>
    act(() => {
      pending = result.current.close()
    })
    unmount()
    expect(signal?.aborted).toBe(true)
    fail(new Error('sensitive native failure'))
    await pending
    expect(toast.error).not.toHaveBeenCalled()
  })
})
