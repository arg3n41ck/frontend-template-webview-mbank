export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }
export type NativePayload = { [key: string]: JsonValue }
export interface NativeBridge {
  version: number
  invoke: (action: string, payload: NativePayload) => Promise<unknown>
}
export type NativeErrorCode =
  | 'bridgeUnavailable'
  | 'unsupportedVersion'
  | 'invalidEnvelope'
  | 'invalidPayload'
  | 'unsupportedAction'
  | 'forbiddenOrigin'
  | 'invalidNonce'
  | 'missingCapability'
  | 'duplicateMessage'
  | 'handlerFailed'
  | 'timeout'
  | 'aborted'
export class NativeError extends Error {
  readonly code: NativeErrorCode
  constructor(code: NativeErrorCode, message = 'Native action is unavailable.') {
    super(message)
    this.name = 'NativeError'
    this.code = code
  }
}
