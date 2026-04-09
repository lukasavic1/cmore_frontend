/**
 * date: 9.4.2026.
 * owner: lukasavic18@gmail.com
 *
 * Renders an individual task card with actions, metadata, and drag
 * interactions.
 */

import { useState } from "react";
import { useToggleTask, useDeleteTask } from "../hooks/useTaskMutations";

const PRIORITY_STYLES = {
  low:
    "bg-[var(--success-bg)] text-[var(--success)] border" +
    "border-[color-mix(in_srgb,var(--success)_30%,var(--border))]",
  medium:
    "bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_25%,var(--border))]",
  high:
    "bg-[var(--danger-bg)] text-[var(--danger)] border" +
    "border-[color-mix(in_srgb,var(--danger)_30%,var(--border))]",
};

function isOverdue(task) {
  return (
    task.status !== "completed" &&
    task.due_date &&
    new Date(task.due_date) < new Date()
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({
  task,
  onEdit,
  draggable = false,
  onDragStart,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = useToggleTask();
  const remove = useDeleteTask();

  const overdue = isOverdue(task);

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors shadow-[var(--shadow-sm)]
        ${
          overdue
            ? "bg-[var(--danger-bg)] border-[color-mix(in_srgb,var(--danger)_35%,var(--border))]"
            : task.status === "completed"
              ? "bg-[var(--surface-2)] border-[var(--border)] opacity-70"
              : "bg-[var(--surface)] border-[var(--border)]" +
                "hover:border-[var(--border-strong)]"
        } ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {/* Toggle checkbox */}
      <button
        onClick={() => toggle.mutate(task.id)}
        disabled={toggle.isPending}
        className="mt-0.5 flex-shrink-0 focus:outline-none"
        title={task.status === "completed" ? "Mark to do" : "Mark complete"}
      >
        <span
          className={`block w-5 h-5 rounded-[6px] border-2 transition-all
          ${
            task.status === "completed"
              ? "bg-[var(--success)] border-[var(--success)]"
              : overdue
                ? "border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] hover:border-[var(--danger)]"
                : "border-[var(--border-strong)] hover:border-[var(--primary)]"
          }`}
        >
          {task.status === "completed" && (
            <svg
              viewBox="0 0 20 20"
              fill="white"
              className="w-full h-full p-0.5"
            >
              <path
                fillRule="evenodd"
                d={
                  "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0" +
                  "01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893" +
                  "7.48-9.817a.75.75 0 011.05-.143z"
                }
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2">
          <span
            className={`text-sm font-medium leading-snug flex-1 min-w-0
            ${task.status === "completed" ? "line-through text-[var(--muted-2)]" : "text-[var(--text)]"}`}
          >
            {task.title}
          </span>

          <span
            className={`flex-shrink-0 text-xs font-medium
              px-2 py-0.5 rounded-full
              ${PRIORITY_STYLES[task.priority]}
            `}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p
            className={`mt-1 text-xs text-[var(--muted)] line-clamp-2 leading-relaxed
          `}
          >
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {task.assignee && (
            <span
              className={`text-xs flex items-center gap-1 text-[var(--muted)]
            `}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5" +
                    "20.25a7.5 7.5 0 0115 0"
                  }
                />
              </svg>
              {task.assignee}
            </span>
          )}
          {task.due_date && (
            <span
              className={`text-xs flex items-center gap-1 ${
                overdue
                  ? "text-[var(--danger)] font-medium"
                  : "text-[var(--muted)]"
              }`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0" +
                    "012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25" +
                    "0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25" +
                    "0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  }
                />
              </svg>
              {overdue
                ? `Overdue · ${formatDate(task.due_date)}`
                : formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-1">
        <button
          onClick={() => onEdit(task)}
          className={`p-1.5 text-[var(--muted-2)] hover:text-[var(--primary)]
            rounded-lg
            hover:bg-[color-mix(in_srgb,var(--primary)_10%,white)]
            transition-colors
          `}
          title="Edit task"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                "M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.5" +
                "1.5-4.5 12.362-12.226z"
              }
            />
          </svg>
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--danger)]">Sure?</span>
            <button
              onClick={() => remove.mutate(task.id)}
              disabled={remove.isPending}
              className={`px-2 py-1 text-xs font-medium bg-[var(--danger-bg)]
                text-[var(--danger)] border
                border-[color-mix(in_srgb,var(--danger)_30%,var(--border))]
                rounded-lg
                hover:bg-[color-mix(in_srgb,var(--danger)_16%,white)]
                disabled:opacity-50 transition-colors
              `}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className={`px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--text)]
                transition-colors
              `}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className={`p-1.5 text-[var(--muted-2)] hover:text-[var(--danger)]
              rounded-lg hover:bg-[var(--danger-bg)] transition-colors
            `}
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107" +
                  "1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244" +
                  "2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456" +
                  " 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114" +
                  "1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5" +
                  "0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32" +
                  "0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0" +
                  "00-7.5 0"
                }
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
