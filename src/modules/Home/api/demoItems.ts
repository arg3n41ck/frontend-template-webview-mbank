export interface DemoItem {
  id: number
  title: string
}
const samples: DemoItem[] = [
  { id: 1, title: 'Keyboard and form' },
  { id: 2, title: 'Native contract' },
  { id: 3, title: 'Safe area and navigation' },
]
// Explicit local sample data. Replace this function with the typed API client in a product.
export async function getDemoItems(q: string, signal: AbortSignal): Promise<DemoItem[]> {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
  return samples.filter((item) => item.title.toLowerCase().includes(q.toLowerCase()))
}
