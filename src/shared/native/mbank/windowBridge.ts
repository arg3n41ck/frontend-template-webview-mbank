import type { NativeBridge } from '../types'
export function readMbankBridge(): NativeBridge | null {
  const bridge = (window as Window & { MBankBridge?: NativeBridge }).MBankBridge
  return bridge && typeof bridge.invoke === 'function' ? bridge : null
}
