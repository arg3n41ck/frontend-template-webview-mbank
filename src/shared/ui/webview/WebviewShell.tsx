import type { PropsWithChildren, ReactNode } from 'react'
import { useVisualViewport, type KeyboardPolicy } from './useVisualViewport'
interface Props extends PropsWithChildren {
  footer?: ReactNode
  header?: ReactNode
  keyboardPolicy?: KeyboardPolicy
  insetOwner?: 'web' | 'native'
}
export function WebviewShell({
  children,
  footer,
  header,
  keyboardPolicy = 'visual-viewport',
  insetOwner = 'web',
}: Props) {
  const { contentRef, height } = useVisualViewport(keyboardPolicy)
  return (
    <div
      className="webview-shell"
      data-inset-owner={insetOwner}
      style={height ? { height } : undefined}
    >
      {header && <header className="shrink-0 border-b p-4">{header}</header>}
      <div
        ref={contentRef}
        data-testid="page-scroller"
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4"
      >
        {children}
      </div>
      {footer && <footer className="shrink-0 border-t bg-background p-4">{footer}</footer>}
    </div>
  )
}
