import { useEffect, useRef, useState } from 'react'
import { visibleScrollDelta } from './viewport'
export type KeyboardPolicy = 'native' | 'visual-viewport'
export function useVisualViewport(policy: KeyboardPolicy) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()
  useEffect(() => {
    const viewport = window.visualViewport,
      container = contentRef.current
    if (policy !== 'visual-viewport' || !viewport || !container) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (Math.abs(viewport.scale - 1) > 0.01) {
          setHeight(undefined)
          return
        }
        setHeight(viewport.height)
        const active = document.activeElement
        if (
          !(active instanceof HTMLElement) ||
          !container.contains(active) ||
          !active.matches('input,textarea,[contenteditable="true"]')
        )
          return
        const delta = visibleScrollDelta(
          container.getBoundingClientRect(),
          active.getBoundingClientRect(),
          viewport,
        )
        if (delta) container.scrollBy({ top: delta, behavior: 'auto' })
      })
    }
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    container.addEventListener('focusin', update)
    window.addEventListener('orientationchange', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      container.removeEventListener('focusin', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [policy])
  return { contentRef, height: policy === 'visual-viewport' ? height : undefined }
}
