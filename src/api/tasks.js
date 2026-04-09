import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach stored Sanctum token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks({
  status,
  search,
  page = 1,
  per_page = 10,
  assignee,
  unassigned = false,
} = {}) {
  const params = { page, per_page }
  if (status) params.status = status
  if (search) params.search = search
  if (unassigned) params.unassigned = 1
  else if (assignee) params.assignee = assignee
  const { data } = await api.get('/tasks', { params })
  return data
}

export async function getTaskAssignees() {
  const { data } = await api.get('/tasks/assignees')
  return Array.isArray(data?.data) ? data.data : []
}

export async function getAllTasks({ status, search, per_page = 100, assignee, unassigned = false } = {}) {
  const first = await getTasks({ status, search, page: 1, per_page, assignee, unassigned })
  const all = [...(first?.data ?? [])]
  const lastPage = first?.meta?.last_page ?? 1

  for (let page = 2; page <= lastPage; page++) {
    const next = await getTasks({ status, search, page, per_page, assignee, unassigned })
    all.push(...(next?.data ?? []))
  }

  return { data: all, meta: first?.meta }
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`)
  return data
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`)
}

export async function toggleTask(id) {
  const { data } = await api.patch(`/tasks/${id}/toggle`)
  return data
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getStats() {
  const { data } = await api.get('/stats')
  return data
}
