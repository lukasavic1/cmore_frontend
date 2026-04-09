import { useMemo, useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { useTaskAssignees } from './hooks/useTaskAssignees'
import { useCreateTask, useUpdateTask } from './hooks/useTaskMutations'
import { useDebounce } from './hooks/useDebounce'
import { useAuth } from './context/useAuth'
import StatsBar from './components/StatsBar'
import FilterBar from './components/FilterBar'
import KanbanBoard from './components/KanbanBoard'
import TaskModal from './components/TaskModal'
import TaskForm from './components/TaskForm'
import DeeperAnalysisModal from './components/DeeperAnalysisModal'
import LandingPage from './pages/LandingPage'

function firstApiValidationMessages(errors) {
  if (!errors || typeof errors !== 'object') return []
  return Object.values(errors).flatMap((v) => (Array.isArray(v) ? v : [v])).filter(Boolean)
}

// ─── Loading screen shown while we verify the stored token ───────────────────

function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm text-[var(--muted)]">Loading…</span>
      </div>
    </div>
  )
}

// ─── User avatar / logout ─────────────────────────────────────────────────────

function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full ring-2 ring-black/5"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,white)] border border-[color-mix(in_srgb,var(--primary)_25%,white)] flex items-center justify-center text-[var(--primary)] font-semibold text-sm">
            {user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <span className="text-sm text-[var(--text)] hidden sm:block">{user.name}</span>
        <svg className="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow)] z-20 py-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--muted)] truncate mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); onSignOut() }}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main task tracker app ────────────────────────────────────────────────────

function TaskTracker() {
  const { user, signOut } = useAuth()

  // Filters & pagination
  const [search, setSearch] = useState('')
  const debouncedSearch     = useDebounce(search, 300)
  const [assigneeFilter, setAssigneeFilter] = useState('')

  function handleSearchChange(val) { setSearch(val) }

  const assigneeQuery = useMemo(() => {
    if (assigneeFilter === '__unassigned__') {
      return { assignee: undefined, unassigned: true }
    }
    if (assigneeFilter) {
      return { assignee: assigneeFilter, unassigned: false }
    }
    return { assignee: undefined, unassigned: false }
  }, [assigneeFilter])

  const { data: assigneeList = [] } = useTaskAssignees()

  // Data
  const { data, isLoading, isError, error } = useTasks({
    status: '',
    search: debouncedSearch,
    page: 1,
    per_page: 100,
    assignee: assigneeQuery.assignee,
    unassigned: assigneeQuery.unassigned,
  })
  const tasks = data?.data ?? []

  // Modal state
  const [modal, setModal] = useState(null) // null | 'create' | { task }
  const [analysisOpen, setAnalysisOpen] = useState(false)

  const create = useCreateTask({ onSuccess: () => setModal(null) })
  const update = useUpdateTask({ onSuccess: () => setModal(null) })
  const move   = useUpdateTask()

  const createValidationMsgs = create.isError
    ? firstApiValidationMessages(create.error?.response?.data?.errors)
    : []
  const updateValidationMsgs = update.isError
    ? firstApiValidationMessages(update.error?.response?.data?.errors)
    : []

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="sticky top-0 z-20 -mx-4 px-4 pt-4 pb-4 mb-6 bg-[var(--bg)]">
          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] border border-[color-mix(in_srgb,var(--primary)_18%,white)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-[var(--text)] tracking-tight leading-tight">C-More Task Tracker</h1>
                <p className="text-xs text-[var(--muted)]">Sustainability Tracker</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setModal('create')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New task
              </button>
              <UserMenu user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <StatsBar />
            </div>
            <button
              onClick={() => setAnalysisOpen(true)}
              className="mt-1 px-4 py-2 text-sm font-medium bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors shadow-[var(--shadow-sm)] text-[var(--text)]"
            >
              Deeper analysis
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            status={''}
            search={search}
            onStatusChange={() => {}}
            onSearchChange={handleSearchChange}
            showStatusFilters={false}
            assignee={assigneeFilter}
            assigneeOptions={assigneeList}
            onAssigneeChange={setAssigneeFilter}
          />
        </div>

        {/* Kanban board */}
        <KanbanBoard
          tasks={tasks}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onEdit={(task) => setModal({ task })}
          onMoveTask={(id, status) => move.mutate({ id, status })}
        />
      </div>

      {/* Create modal */}
      {modal === 'create' && (
        <TaskModal title="New task" onClose={() => setModal(null)}>
          <TaskForm
            apiFieldErrors={create.isError ? create.error?.response?.data?.errors : undefined}
            onSubmit={(payload) => create.mutate(payload)}
            onCancel={() => setModal(null)}
            isSubmitting={create.isPending}
          />
          {create.isError && (
            <div className="mt-3 text-sm text-center space-y-1">
              <p className="text-[var(--danger)]">
                {create.error?.response?.data?.message ?? 'Something went wrong.'}
              </p>
              {createValidationMsgs.length > 0 && (
                <ul className="text-xs text-[var(--muted)] list-none">
                  {createValidationMsgs.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </TaskModal>
      )}

      {/* Edit modal */}
      {modal?.task && (
        <TaskModal title="Edit task" onClose={() => setModal(null)}>
          <TaskForm
            initial={modal.task}
            apiFieldErrors={update.isError ? update.error?.response?.data?.errors : undefined}
            onSubmit={(payload) => update.mutate({ id: modal.task.id, ...payload })}
            onCancel={() => setModal(null)}
            isSubmitting={update.isPending}
          />
          {update.isError && (
            <div className="mt-3 text-sm text-center space-y-1">
              <p className="text-[var(--danger)]">
                {update.error?.response?.data?.message ?? 'Something went wrong.'}
              </p>
              {updateValidationMsgs.length > 0 && (
                <ul className="text-xs text-[var(--muted)] list-none">
                  {updateValidationMsgs.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </TaskModal>
      )}

      {/* Deeper analysis modal */}
      {analysisOpen && (
        <TaskModal title="Deeper analysis" size="xl" onClose={() => setAnalysisOpen(false)}>
          <DeeperAnalysisModal />
        </TaskModal>
      )}
    </div>
  )
}

// ─── Root — decides what to render based on auth state ───────────────────────

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <AuthLoader />
  if (!user)   return <LandingPage />
  return <TaskTracker />
}
