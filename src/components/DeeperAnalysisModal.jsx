import { useMemo } from 'react'
import { useAllTasks } from '../hooks/useAllTasks'

function safeStr(v) {
  return typeof v === 'string' ? v.trim() : ''
}

function parseDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

function daysBetween(a, b) {
  const ms = b.getTime() - a.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

function computeAnalysis(tasks) {
  const now = new Date()
  const list = Array.isArray(tasks) ? tasks : []

  const total = list.length
  const completed = list.filter((t) => t.status === 'completed').length
  const inProgress = list.filter((t) => t.status === 'in_progress').length
  const todo = list.filter((t) => t.status === 'todo' || !t.status).length

  const overdueTasks = list.filter((t) => t.status !== 'completed' && parseDate(t.due_date) && parseDate(t.due_date) < now)
  const overdue = overdueTasks.length

  const withAssignee = list.filter((t) => safeStr(t.assignee))
  const withoutAssignee = total - withAssignee.length

  const assigneeCountsAll = new Map()
  const assigneeCountsOpen = new Map()
  const assigneeCountsDone = new Map()
  for (const t of list) {
    const a = safeStr(t.assignee) || 'Unassigned'
    assigneeCountsAll.set(a, (assigneeCountsAll.get(a) ?? 0) + 1)
    if (t.status === 'completed') assigneeCountsDone.set(a, (assigneeCountsDone.get(a) ?? 0) + 1)
    else assigneeCountsOpen.set(a, (assigneeCountsOpen.get(a) ?? 0) + 1)
  }

  const topBy = (map) =>
    [...map.entries()]
      .sort((x, y) => (y[1] - x[1]) || x[0].localeCompare(y[0]))
      .slice(0, 5)

  const priorityCounts = { low: 0, medium: 0, high: 0, unknown: 0 }
  for (const t of list) {
    const p = safeStr(t.priority).toLowerCase()
    if (p === 'low' || p === 'medium' || p === 'high') priorityCounts[p] += 1
    else priorityCounts.unknown += 1
  }

  const textLens = list.map((t) => safeStr(t.title).length + safeStr(t.description).length).filter((n) => n > 0)
  const avgTextLen = textLens.length ? Math.round(textLens.reduce((a, b) => a + b, 0) / textLens.length) : null

  const dueDates = list
    .filter((t) => t.status !== 'completed')
    .map((t) => ({ task: t, due: parseDate(t.due_date) }))
    .filter((x) => x.due)
    .map((x) => ({ ...x, daysToDue: daysBetween(now, x.due) }))

  const dueSoon = dueDates.filter((x) => x.daysToDue >= 0 && x.daysToDue <= 3).length
  const dueNextWeek = dueDates.filter((x) => x.daysToDue >= 0 && x.daysToDue <= 7).length

  const completionRate = total ? Math.round((completed / total) * 100) : 0

  return {
    counts: { total, todo, inProgress, completed, overdue },
    completionRate,
    assignees: {
      withoutAssignee,
      topAll: topBy(assigneeCountsAll),
      topOpen: topBy(assigneeCountsOpen),
      topDone: topBy(assigneeCountsDone),
    },
    priorityCounts,
    avgTextLen,
    dueRisk: { dueSoon, dueNextWeek },
  }
}

function MetricCard({ label, value, hint, accent = 'var(--primary)' }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3 shadow-[var(--shadow-sm)] relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <div className="text-xs text-[var(--muted)] uppercase tracking-widest font-medium">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[var(--text)]">{value ?? '—'}</div>
      {hint && <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}

function RankedList({ title, items }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-sm)]">
      <div className="text-sm font-semibold text-[var(--text)] tracking-tight">{title}</div>
      <div className="mt-3 space-y-2">
        {items?.length ? (
          items.map(([name, count], idx) => (
            <div key={`${name}-${idx}`} className="flex items-center justify-between">
              <div className="text-sm text-[var(--text)] truncate pr-3">{name}</div>
              <div className="text-xs font-medium text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-2 py-0.5">
                {count}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-[var(--muted)]">No data yet.</div>
        )}
      </div>
    </div>
  )
}

function BarRow({ label, value, total, color = 'var(--primary)' }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-[var(--muted)] truncate">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="w-16 text-xs text-[var(--muted)] text-right tabular-nums">{value} · {pct}%</div>
    </div>
  )
}

function MiniBreakdownCard({ title, rows }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0)
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-sm)]">
      <div className="text-sm font-semibold text-[var(--text)] tracking-tight">{title}</div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <BarRow key={r.label} label={r.label} value={r.value} total={total} color={r.color} />
        ))}
      </div>
    </div>
  )
}

export default function DeeperAnalysisModal() {
  const { data, isLoading, isError, error } = useAllTasks()
  const tasks = data?.data ?? []
  const a = useMemo(() => computeAnalysis(tasks), [tasks])

  return (
    <div className="flex flex-col gap-4 min-w-0 max-w-full">
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[92px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-[var(--danger-bg)] border border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] rounded-2xl p-4 text-sm text-[var(--danger)]">
          {error?.response?.data?.message ?? error?.message ?? 'Failed to load analysis.'}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[var(--text)] tracking-tight">Portfolio health</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                {a.counts.total} total · {a.counts.completed} completed · {a.counts.overdue} overdue
              </div>
            </div>
            <div className="text-xs text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-3 py-1">
              All tasks (database)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricCard label="Completion rate" value={`${a.completionRate}%`} hint="Completed / total" accent="var(--success)" />
            <MetricCard label="Overdue" value={a.counts.overdue} hint="Open tasks past due date" accent="var(--danger)" />
            <MetricCard label="Due soon" value={a.dueRisk.dueSoon} hint="Open tasks due in 0–3 days" accent="var(--warning)" />
            <MetricCard label="Due next week" value={a.dueRisk.dueNextWeek} hint="Open tasks due in 0–7 days" accent="var(--primary)" />
            <MetricCard label="Avg task length" value={a.avgTextLen ? `${a.avgTextLen} chars` : '—'} hint="Title + description (avg)" accent="var(--primary)" />
            <MetricCard label="Unassigned" value={a.assignees.withoutAssignee} hint="Tasks missing assignee" accent="var(--muted)" />
          </div>
        </>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MiniBreakdownCard
              title="Status distribution"
              rows={[
                { label: 'Completed', value: a.counts.completed, color: 'var(--success)' },
                { label: 'In progress', value: a.counts.inProgress, color: 'var(--primary)' },
                { label: 'To do', value: a.counts.todo, color: 'var(--warning)' },
              ]}
            />
            <MiniBreakdownCard
              title="Priority mix"
              rows={[
                { label: 'High', value: a.priorityCounts.high, color: 'var(--danger)' },
                { label: 'Medium', value: a.priorityCounts.medium, color: 'var(--primary)' },
                { label: 'Low', value: a.priorityCounts.low, color: 'var(--success)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RankedList title="Most tasks (overall)" items={a.assignees.topAll} />
            <RankedList title="Most tasks (open)" items={a.assignees.topOpen} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RankedList title="Most tasks completed" items={a.assignees.topDone} />
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow-sm)]">
              <div className="text-sm font-semibold text-[var(--text)] tracking-tight">What’s risky right now</div>
              <div className="mt-3 space-y-2 text-sm text-[var(--text)]">
                <div className="flex items-center justify-between">
                  <span>Overdue items</span><span className="text-[var(--danger)] font-medium tabular-nums">{a.counts.overdue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Due in 0–3 days</span><span className="text-[var(--warning)] font-medium tabular-nums">{a.dueRisk.dueSoon}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unassigned work</span><span className="text-[var(--muted)] font-medium tabular-nums">{a.assignees.withoutAssignee}</span>
                </div>
                <div className="text-xs text-[var(--muted)] mt-2">
                  Good next step: assign owners to the unassigned items and pull the “due soon” tasks into “in progress”.
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-[var(--muted)]">
            Analysis is computed from all tasks in the database.
          </div>
        </>
      )}
    </div>
  )
}

