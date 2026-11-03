import { z } from 'zod'
import type { NativeHost } from '../context'
import { invokeNative, type NativeOptions } from '../request'
import { NativeError, type NativeBridge, type NativePayload } from '../types'
import type { MobileBridgeEventType, MobileBridgePayload, MobileBridgeResult } from './eventTypes'
interface Options {
  read: () => NativeBridge | null
  allowedOrigins: string[]
  deepLinkSchemes?: string[]
  development?: boolean
  enableMock?: boolean
}
function eventSchemas(origins: string[], schemes: string[]) {
  const url = z.string().refine((value) => {
    try {
      const parsed = new URL(value)
      return (
        ['http:', 'https:'].includes(parsed.protocol) &&
        !parsed.username &&
        !parsed.password &&
        origins.includes(parsed.origin)
      )
    } catch {
      return false
    }
  })
  const deepLink = z.string().refine((value) => {
    try {
      return schemes.includes(new URL(value).protocol)
    } catch {
      return false
    }
  })
  const json = z.record(z.string(), z.json())
  return {
    'app.close': json,
    'auth.required': z.object({ redirectUrl: url.optional() }).passthrough(),
    'payment.start': z
      .object({
        serviceId: z.string().min(1),
        code: z.string().min(1),
        amount: z.string().optional(),
        resultUrl: url.optional(),
        parameters: json.optional(),
      })
      .passthrough(),
    'share.text': z.object({ text: z.string().max(100000) }).passthrough(),
    'pdf.previewUrl': z.object({ url }).passthrough(),
    'pdf.previewBase64': z
      .object({ base64: z.string().max(5242880), fileName: z.string().optional() })
      .passthrough(),
    'external.open': z.object({ url }).passthrough(),
    'deepLink.open': z.object({ url: deepLink }).passthrough(),
    'firebaseAnalytics.logEvent': z
      .object({ name: z.string().min(1), parameters: json.optional() })
      .passthrough(),
    'firebaseAnalytics.setUserProperty': z
      .object({ name: z.string().min(1), value: z.string() })
      .passthrough(),
    'adjust.logEvent': z
      .object({ token: z.string(), key: z.string(), value: z.string().optional() })
      .passthrough(),
    'biometry.isAvailable': z.object({}),
    'biometry.save': z.object({ value: z.json() }).passthrough(),
    'biometry.read': z.object({}),
    'device.report': z.object({}),
  } satisfies Record<MobileBridgeEventType, z.ZodType>
}
export function createMbankHost({
  read,
  allowedOrigins,
  deepLinkSchemes = ['mbank:'],
  development = false,
  enableMock = false,
}: Options): NativeHost {
  const preview = development && enableMock
  const schemas = eventSchemas(allowedOrigins, deepLinkSchemes)
  const invoke = async (
    action: string,
    payload: NativePayload = {},
    options: NativeOptions = {},
  ) => {
    if (!Object.hasOwn(schemas, action)) throw new NativeError('unsupportedAction')
    const schema = schemas[action as MobileBridgeEventType]
    if (!schema.safeParse(payload).success) throw new NativeError('invalidPayload')
    if (preview) {
      // Preview is explicit, never a fake payment, auth, close or private storage success.
      if (action === 'biometry.isAvailable') return { available: false }
      if (action !== 'share.text')
        throw new NativeError(
          'unsupportedAction',
          'Development preview performs no native side effects.',
        )
      return { mocked: true }
    }
    const result = await invokeNative(read, action, payload, options)
    const resultSchema =
      action === 'biometry.isAvailable'
        ? z.object({ available: z.boolean() })
        : action === 'biometry.read'
          ? z.object({ value: z.string().nullable() })
          : action === 'device.report'
            ? z.object({ report: z.string().nullable() })
            : z.json()
    if (!resultSchema.safeParse(result).success) throw new NativeError('invalidEnvelope')
    return result
  }
  return {
    name: preview ? 'MBANK development preview (no native effects)' : 'MBANK Bridge v1',
    available: () => preview || read()?.version === 1,
    invoke,
    close: (options) => invoke('app.close', {}, options),
  }
}
export function createMbankActions(host: NativeHost) {
  return {
    call: <T extends MobileBridgeEventType>(
      action: T,
      payload: MobileBridgePayload<T>,
      options?: NativeOptions,
    ) =>
      host.invoke(action, payload ?? {}, options).then((result) => result as MobileBridgeResult<T>),
    close: () => host.invoke('app.close', {}),
    requestAuth: (redirectUrl?: string) =>
      host.invoke('auth.required', redirectUrl ? { redirectUrl } : {}),
    startPayment: (payload: MobileBridgePayload<'payment.start'>) =>
      host.invoke('payment.start', payload),
  }
}
