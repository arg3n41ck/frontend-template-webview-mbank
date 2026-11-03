export interface MbankLaunch {
  token: string | null
  customToken: string | null
  guest: boolean
  theme: 'light' | 'dark' | 'system'
  lang: 'ru' | 'en' | 'ky'
}
export function readMbankLaunch(href: string, replace: (safeHref: string) => void): MbankLaunch {
  const url = new URL(href),
    params = url.searchParams
  const value = params.get('token'),
    customToken = params.get('customToken') || null
  const token = value && value !== 'GUEST' ? value : null
  const theme = params.get('theme'),
    lang = params.get('lang')
  if (params.has('token') || params.has('customToken')) {
    params.delete('token')
    params.delete('customToken')
    replace(`${url.pathname}${url.search}${url.hash}`)
  }
  return {
    token,
    customToken,
    guest: !token,
    theme: theme === 'light' || theme === 'dark' ? theme : 'system',
    lang: lang === 'en' || lang === 'ky' ? lang : 'ru',
  }
}
