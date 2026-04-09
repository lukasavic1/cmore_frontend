import { useEffect } from 'react'

const SIZE_CLASS = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

/**
 * @param {object} props
 * @param {string} [props.size] md | lg | xl — width cap (default md)
 * @param {boolean} [props.scrollBody] — constrain height and scroll body (default true for lg/xl, false for md)
 */
export default function TaskModal({ title, onClose, children, size = 'md', scrollBody }) {
  const wide = size === 'lg' || size === 'xl'
  const shouldScrollBody = scrollBody !== undefined ? scrollBody : wide

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-[2px] overflow-y-auto overscroll-contain"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`
          bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)]
          w-full ${SIZE_CLASS[size] ?? SIZE_CLASS.md}
          ${shouldScrollBody ? 'max-h-[min(90dvh,880px)] flex flex-col min-h-0 my-auto' : 'my-auto'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text)] tracking-tight pr-2">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          className={`px-5 sm:px-6 py-5 ${shouldScrollBody ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain' : ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
