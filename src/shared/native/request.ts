import { z } from 'zod'
import { NativeError, type NativeBridge, type NativePayload } from './types'
const envelope = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), result: z.json() }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.enum([
        'bridgeUnavailable',
        'invalidEnvelope',
        'invalidPayload',
        'unsupportedVersion',
        'unsupportedAction',
        'forbiddenOrigin',
        'invalidNonce',
        'missingCapability',
        'duplicateMessage',
        'handlerFailed',
      ]),
    }),
  }),
])
export interface NativeOptions {
  attempts?: number
  retryDelayMs?: number
  timeoutMs?: number
  signal?: AbortSignal
}
function bounded<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let finished = false
    const finish = (callback: () => void) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      callback()
    }
    const abort = () =>
      finish(() =>
        reject(new NativeError('aborted', 'Native waiting was cancelled; outcome may be unknown.')),
      )
    const timer = setTimeout(
      () =>
        finish(() =>
          reject(
            new NativeError('timeout', 'Native outcome is unknown; do not replay automatically.'),
          ),
        ),
      timeoutMs,
    )
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) {
      abort()
      return
    }
    // Abort ends JS waiting, not a native side effect that has already started.
    Promise.resolve()
      .then(() => {
        if (signal?.aborted) throw new NativeError('aborted')
        return operation()
      })
      .then(
        (value) => finish(() => resolve(value)),
        () => finish(() => reject(new NativeError('handlerFailed', 'Native transport failed.'))),
      )
  })
}
function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(new NativeError('aborted'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', abort, { once: true })
    if (signal?.aborted) abort()
  })
}
export async function invokeNative(
  readBridge: () => NativeBridge | null,
  action: string,
  payload: NativePayload = {},
  options: NativeOptions = {},
) {
  const { attempts = 3, retryDelayMs = 1000, timeoutMs = 15000, signal } = options
  if (
    !Number.isInteger(attempts) ||
    attempts < 1 ||
    attempts > 10 ||
    !Number.isFinite(timeoutMs) ||
    timeoutMs <= 0 ||
    !Number.isFinite(retryDelayMs) ||
    retryDelayMs < 0
  )
    throw new NativeError('invalidPayload')
  let validPayload = false
  try {
    JSON.stringify(payload)
    validPayload = z.record(z.string(), z.json()).safeParse(payload).success
  } catch {
    /* Circular/deep runtime values must not leak a raw parser error. */
  }
  if (!validPayload) throw new NativeError('invalidPayload')
  // Retry ONLY host discovery. Never replay an invoked command, including native errors.
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) throw new NativeError('aborted')
    const bridge = readBridge()
    if (bridge) {
      if (bridge.version !== 1) throw new NativeError('unsupportedVersion')
      const result = envelope.safeParse(
        await bounded(() => bridge.invoke(action, payload), timeoutMs, signal),
      )
      if (!result.success) throw new NativeError('invalidEnvelope')
      if (!result.data.ok) throw new NativeError(result.data.error.code)
      return result.data.result
    }
    if (attempt + 1 < attempts) await delay(retryDelayMs, signal)
  }
  throw new NativeError('bridgeUnavailable')
}
