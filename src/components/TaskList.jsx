import TaskCard from './TaskCard'

function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-pulse shadow-[var(--shadow-sm)]">
      <div className="w-5 h-5 rounded-[6px] bg-[var(--border)] mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-[var(--border)] rounded-lg w-3/4" />
        <div className="h-3 bg-[color-mix(in_srgb,var(--border)_75%,white)] rounded-lg w-1/2" />
      </div>
    </div>
  )
}

export default function TaskList({ tasks, isLoading, isError, onEdit }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--danger-bg)] border border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-[var(--text)] font-medium text-sm">Failed to load tasks</p>
        <p className="text-xs text-[var(--muted)] mt-1">Check that the API server is running.</p>
      </div>
    )
  }

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4 shadow-[var(--shadow-sm)]">
          <svg className="w-6 h-6 text-[var(--muted-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p className="text-[var(--text)] font-medium text-sm">No tasks found</p>
        <p className="text-xs text-[var(--muted)] mt-1">Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  )
}
