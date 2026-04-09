import { useStats } from '../hooks/useStats'

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total',
    valueClass: 'text-[var(--text)]',
    iconColor: 'text-[var(--primary)]',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    key: 'todo',
    label: 'To do',
    valueClass: 'text-[color-mix(in_srgb,var(--warning)_85%,var(--text))]',
    iconColor: 'text-[var(--warning)]',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'in_progress',
    label: 'In progress',
    valueClass: 'text-[color-mix(in_srgb,var(--primary)_85%,var(--text))]',
    iconColor: 'text-[var(--primary)]',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Completed',
    valueClass: 'text-[var(--success)]',
    iconColor: 'text-[var(--success)]',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'overdue',
    label: 'Overdue',
    valueClass: 'text-[var(--danger)]',
    iconColor: 'text-[var(--danger)]',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
]

function StatCard({ label, value, valueClass, iconColor, icon }) {
  return (
    <div className="flex-1 min-w-[110px] bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-4 hover:border-[var(--border-strong)] transition-colors shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium">{label}</span>
        <span className={iconColor}>{icon}</span>
      </div>
      <span className={`text-2xl font-bold tracking-tight ${valueClass}`}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export default function StatsBar() {
  const { data, isLoading } = useStats()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="flex gap-3 flex-wrap">
        {STAT_CONFIG.map(({ label }) => (
          <div key={label} className="flex-1 min-w-[110px] h-[88px] bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-3 flex-wrap">
        {STAT_CONFIG.map(({ key, label, valueClass, iconColor, icon }) => (
          <StatCard
            key={key}
            label={label}
            value={stats?.[key]}
            valueClass={valueClass}
            iconColor={iconColor}
            icon={icon}
          />
        ))}
      </div>
    </div>
  )
}
