export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const { current_page, last_page } = meta

  return (
    <div className="flex items-center justify-between mt-5">
      <p className="text-xs text-[var(--muted)]">
        Page <span className="font-medium text-[var(--text)]">{current_page}</span> of{' '}
        <span className="font-medium text-[var(--text)]">{last_page}</span>
        {' '}·{' '}{meta.total} tasks
      </p>

      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg text-[var(--text)] bg-[var(--surface)] shadow-[var(--shadow-sm)]
            hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg text-[var(--text)] bg-[var(--surface)] shadow-[var(--shadow-sm)]
            hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
