/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Renders the kanban columns and drag-and-drop behavior for task
 * organization.
 */

import TaskCard from "./TaskCard";

const COLUMNS = [
  { key: "todo", title: "To do" },
  { key: "in_progress", title: "In progress" },
  { key: "completed", title: "Completed" },
];

function groupByStatus(tasks) {
  const map = { todo: [], in_progress: [], completed: [] };
  for (const t of tasks ?? []) {
    const k = map[t.status] ? t.status : "todo";
    map[k].push(t);
  }
  return map;
}

function Column({ title, statusKey, tasks, onEdit, onDropTask }) {
  return (
    <div
      className={`flex-1 min-w-[260px] bg-[var(--surface)] border
      border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)]
      overflow-hidden
    `}
    >
      <div
        className={`px-4 py-3 border-b border-[var(--border)]
        bg-[var(--surface-2)] flex items-center justify-between
      `}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
          <span
            className={`text-xs text-[var(--muted)] bg-[var(--surface)] border
            border-[var(--border)] rounded-full px-2 py-0.5
          `}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        className="p-3 flex flex-col gap-2 min-h-[160px]"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const idStr = e.dataTransfer.getData("text/task-id");
          const id = Number(idStr);
          if (!Number.isFinite(id)) return;
          onDropTask(id, statusKey);
        }}
      >
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/task-id", String(task.id));
                e.dataTransfer.effectAllowed = "move";
              }}
            />
          ))
        ) : (
          <div
            className={`flex-1 flex items-center justify-center rounded-xl border
            border-dashed border-[var(--border)] bg-[var(--surface-2)]
            text-xs text-[var(--muted)] py-10
          `}
          >
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  isLoading,
  isError,
  error,
  onEdit,
  onMoveTask,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {COLUMNS.map((c) => (
          <div
            key={c.key}
            className={`h-[320px] bg-[var(--surface)] border border-[var(--border)]
              rounded-2xl animate-pulse
            `}
          />
        ))}
      </div>
    );
  }

  if (isError) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ?? error?.message ?? "Request failed.";

    return (
      <div
        className={`flex flex-col items-center justify-center py-16 text-center
      `}
      >
        <div
          className={`w-12 h-12 rounded-xl bg-[var(--danger-bg)] border
          border-[color-mix(in_srgb,var(--danger)_30%,var(--border))]
          flex items-center justify-center mb-4
        `}
        >
          <svg
            className="w-6 h-6 text-[var(--danger)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <p className="text-[var(--text)] font-medium text-sm">
          Failed to load tasks
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">
          {status ? `HTTP ${status} · ` : ""}
          {message}
        </p>
        {status === 401 && (
          <p className="text-xs text-[var(--muted)] mt-2">
            This usually means your `auth_token` is missing/expired. Try
            signing out and signing in again.
          </p>
        )}
      </div>
    );
  }

  const grouped = groupByStatus(tasks);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {COLUMNS.map((c) => (
        <Column
          key={c.key}
          title={c.title}
          statusKey={c.key}
          tasks={grouped[c.key]}
          onEdit={onEdit}
          onDropTask={(id, status) => onMoveTask(id, status)}
        />
      ))}
    </div>
  );
}
