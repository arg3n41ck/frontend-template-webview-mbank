import { createContext, useContext } from 'react'
import type { NativeOptions } from './request'
import { NativeError, type NativePayload } from './types'
export interface NativeHost {
  name: string
  available: () => boolean
  close?: (options?: NativeOptions) => Promise<unknown>
  invoke: (action: string, payload?: NativePayload, options?: NativeOptions) => Promise<unknown>
}
export const browserHost: NativeHost = {
  name: 'Browser / unconfigured host',
  available: () => false,
  invoke: async () => {
    throw new NativeError('bridgeUnavailable')
  },
}
export const NativeHostContext = createContext<NativeHost>(browserHost)
export const useNativeHost = () => useContext(NativeHostContext)
