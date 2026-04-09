const FILTERS = [
  { label: 'All',       value: '' },
  { label: 'To do',     value: 'todo' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
]

const selectClass =
  'min-w-[11rem] pl-3 pr-8 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_35%,transparent)] focus:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] text-[var(--text)] transition-colors hover:border-[var(--border-strong)] shadow-[var(--shadow-sm)] appearance-none bg-[length:1rem_1rem] bg-[right_0.65rem_center] bg-no-repeat'

export default function FilterBar({
  status,
  search,
  onStatusChange,
  onSearchChange,
  showStatusFilters = true,
  assignee = '',
  assigneeOptions = [],
  onAssigneeChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
      {/* Status filter buttons */}
      {showStatusFilters && (
        <div className="flex rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--surface)] shadow-[var(--shadow-sm)]">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onStatusChange(f.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none
                ${status === f.value
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Assignee */}
      {typeof onAssigneeChange === 'function' && (
        <div className="relative shrink-0">
          <label htmlFor="filter-assignee" className="sr-only">
            Filter by assignee
          </label>
          <select
            id="filter-assignee"
            value={assignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className={selectClass}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="">All assignees</option>
            <option value="__unassigned__">Unassigned</option>
            {assigneeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-2)]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_35%,transparent)] focus:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] placeholder-[var(--muted-2)] text-[var(--text)] transition-colors hover:border-[var(--border-strong)] shadow-[var(--shadow-sm)]"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)] hover:text-[var(--text)] transition-colors text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
