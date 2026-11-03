interface Rect {
  top: number
  bottom: number
}
interface Viewport {
  height: number
  offsetTop: number
  scale: number
}
export function visibleScrollDelta(container: Rect, control: Rect, viewport: Viewport) {
  if (Math.abs(viewport.scale - 1) > 0.01) return 0
  const top = Math.max(container.top, viewport.offsetTop) + 16
  const bottom = Math.min(container.bottom, viewport.offsetTop + viewport.height) - 16
  if (control.top < top) return control.top - top
  if (control.bottom > bottom) return control.bottom - bottom
  return 0
}
