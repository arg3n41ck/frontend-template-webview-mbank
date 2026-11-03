export interface ListSearch {
  q: string
  page: number
  limit: number
  order: 'asc' | 'desc'
}
const MAX_PAGE = 1_000_000
export function validateListSearch(input: unknown): ListSearch {
  const data = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}
  const integer = (v: unknown) =>
    typeof v === 'number' ? v : typeof v === 'string' && /^[1-9]\d*$/.test(v) ? Number(v) : NaN
  const page = integer(data.page),
    limit = integer(data.limit)
  return {
    q: typeof data.q === 'string' && data.q.length <= 200 ? data.q.trim() : '',
    page: Number.isSafeInteger(page) && page > 0 && page <= MAX_PAGE ? page : 1,
    limit: [10, 20, 50, 100].includes(limit) ? limit : 20,
    order: data.order === 'desc' ? 'desc' : 'asc',
  }
}

export const defaultListSearch = validateListSearch({})
