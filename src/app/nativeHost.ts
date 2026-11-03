import { createMbankHost } from '@/shared/native/mbank/client'
import { readMbankBridge } from '@/shared/native/mbank/windowBridge'
import { env } from '@/shared/config/env'
export const nativeHost = createMbankHost({
  read: readMbankBridge,
  allowedOrigins: env.VITE_MBANK_ALLOWED_ORIGINS
    ? env.VITE_MBANK_ALLOWED_ORIGINS.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [window.location.origin],
  development: import.meta.env.DEV,
  enableMock: env.VITE_ENABLE_MBANK_MOCK,
})
