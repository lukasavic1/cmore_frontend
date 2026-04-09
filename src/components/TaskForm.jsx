import { useEffect, useState } from 'react'

const PRIORITIES = ['low', 'medium', 'high']

const empty = { title: '', description: '', assignee: '', priority: 'medium', due_date: '' }

function isValidDateInput(s) {
  if (!s) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const t = new Date(`${s}T12:00:00`).getTime()
  return !Number.isNaN(t)
}

export default function TaskForm({ initial = {}, onSubmit, onCancel, isSubmitting, apiFieldErrors }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!apiFieldErrors || typeof apiFieldErrors !== 'object') return
    setErrors((prev) => {
      const next = { ...prev }
      for (const [key, val] of Object.entries(apiFieldErrors)) {
        if (val == null) continue
        next[key] = Array.isArray(val) ? val[0] : String(val)
      }
      return next
    })
  }, [apiFieldErrors])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const errs = {}
    const title = (form.title ?? '').trim()
    if (!title) errs.title = 'Title is required.'
    else if (title.length > 255) errs.title = 'Title must be 255 characters or fewer.'

    const assignee = (form.assignee ?? '').trim()
    if (assignee.length > 255) errs.assignee = 'Assignee must be 255 characters or fewer.'

    if (!PRIORITIES.includes(form.priority)) errs.priority = 'Choose a valid priority.'

    if (!isValidDateInput(form.due_date)) errs.due_date = 'Enter a valid due date.'

    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const priority = PRIORITIES.includes(form.priority) ? form.priority : 'medium'
    const payload = {
      title: (form.title ?? '').trim(),
      description: (form.description ?? '').trim() || null,
      assignee: (form.assignee ?? '').trim() || null,
      priority,
      due_date: form.due_date || null,
    }
    if (initial.id) payload.status = initial.status

    onSubmit(payload)
  }

  const inputClass = (hasError) =>
    `w-full px-3 py-2.5 text-sm bg-[var(--surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_35%,transparent)] focus:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] placeholder-[var(--muted-2)] text-[var(--text)] transition-colors shadow-[var(--shadow-sm)]
     ${hasError ? 'border-[color-mix(in_srgb,var(--danger)_55%,var(--border))]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1.5" htmlFor="task-title">
          Title <span className="text-[var(--danger)]">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Task title"
          maxLength={255}
          required
          aria-invalid={errors.title ? 'true' : undefined}
          aria-describedby={errors.title ? 'task-title-err' : undefined}
          className={inputClass(errors.title)}
        />
        {errors.title && (
          <p id="task-title-err" className="mt-1.5 text-xs text-[var(--danger)]">
            {errors.title}
          </p>
        )}
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1.5" htmlFor="task-assignee">
          Assignee
        </label>
        <input
          id="task-assignee"
          name="assignee"
          type="text"
          value={form.assignee}
          onChange={(e) => set('assignee', e.target.value)}
          placeholder="e.g. External IT firm"
          maxLength={255}
          aria-invalid={errors.assignee ? 'true' : undefined}
          aria-describedby={errors.assignee ? 'task-assignee-err' : undefined}
          className={inputClass(!!errors.assignee)}
        />
        {errors.assignee && (
          <p id="task-assignee-err" className="mt-1.5 text-xs text-[var(--danger)]">
            {errors.assignee}
          </p>
        )}
        <p className="mt-1.5 text-xs text-[var(--muted)]">
          Free text — can be a person, team, or vendor.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1.5" htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Optional description…"
          className={`${inputClass(!!errors.description)} resize-none`}
          aria-invalid={errors.description ? 'true' : undefined}
          aria-describedby={errors.description ? 'task-description-err' : undefined}
        />
        {errors.description && (
          <p id="task-description-err" className="mt-1.5 text-xs text-[var(--danger)]">
            {errors.description}
          </p>
        )}
      </div>

      {/* Priority + Due date */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text)] mb-1.5" htmlFor="task-priority">
            Priority
          </label>
          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
            className={inputClass(!!errors.priority)}
            aria-invalid={errors.priority ? 'true' : undefined}
            aria-describedby={errors.priority ? 'task-priority-err' : undefined}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p} className="bg-[var(--surface)] text-[var(--text)]">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p id="task-priority-err" className="mt-1.5 text-xs text-[var(--danger)]">
              {errors.priority}
            </p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text)] mb-1.5" htmlFor="task-due-date">
            Due date
          </label>
          <input
            id="task-due-date"
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={(e) => set('due_date', e.target.value)}
            className={inputClass(!!errors.due_date)}
            aria-invalid={errors.due_date ? 'true' : undefined}
            aria-describedby={errors.due_date ? 'task-due-date-err' : undefined}
          />
          {errors.due_date && (
            <p id="task-due-date-err" className="mt-1.5 text-xs text-[var(--danger)]">
              {errors.due_date}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--surface-2)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? 'Saving…' : initial.id ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  )
}
