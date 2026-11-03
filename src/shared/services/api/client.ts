import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
interface Session {
  version: () => number
  refresh: () => Promise<boolean>
  expire: () => void
}
interface ClientConfig {
  baseURL: string
  language?: () => string
  adapter?: AxiosAdapter
  session?: Session
}
type SessionRequest = InternalAxiosRequestConfig & { _retry?: boolean; _sessionVersion?: number }
export function createApiClient({ baseURL, language, adapter, session }: ClientConfig) {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
    ...(adapter ? { adapter } : {}),
  })
  let refreshJob: { version: number; promise: Promise<boolean> } | undefined
  let expiredVersion: number | undefined
  const expire = (version: number) => {
    if (session && session.version() === version && expiredVersion !== version) {
      expiredVersion = version
      session.expire()
    }
  }
  const checkSession = (config: SessionRequest) => {
    if (session && config._sessionVersion !== session.version())
      throw new AxiosError('Session changed.', 'SESSION_CHANGED')
  }
  client.interceptors.request.use((config: SessionRequest) => {
    if (language) config.headers.set('Accept-Language', language())
    if (session) config._sessionVersion ??= session.version()
    checkSession(config)
    return config
  })
  client.interceptors.response.use(
    (response) => {
      checkSession(response.config)
      return response
    },
    async (error: unknown) => {
      if (
        !axios.isAxiosError(error) ||
        axios.isCancel(error) ||
        error.response?.status !== 401 ||
        !session ||
        !error.config
      )
        throw error
      const request = error.config as SessionRequest
      checkSession(request)
      const version = request._sessionVersion!
      if (request._retry) {
        expire(version)
        throw error
      }
      request._retry = true
      if (!refreshJob || refreshJob.version !== version) {
        const job = {
          version,
          promise: Promise.resolve()
            .then(session.refresh)
            .catch(() => false),
        }
        refreshJob = job
        void job.promise.finally(() => {
          if (refreshJob === job) refreshJob = undefined
        })
      }
      const refreshed = await refreshJob.promise
      checkSession(request)
      if (!refreshed) {
        expire(version)
        throw error
      }
      return client.request(request)
    },
  )
  return client
}
