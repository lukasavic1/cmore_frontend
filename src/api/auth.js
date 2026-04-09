import axios from 'axios'
import { API_BASE_URL } from './baseUrl.js'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach stored token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function googleSignIn(googleToken) {
  const { data } = await api.post('/auth/google', { token: googleToken })

  // Guard: if PHP warnings polluted the response, data may be a raw string.
  // Extract the JSON object from it as a fallback.
  if (typeof data === 'string') {
    const match = data.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Unexpected response format from auth endpoint.')
    return JSON.parse(match[0])
  }

  return data // { token, user }
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data // { user }
}

export async function logout() {
  await api.post('/auth/logout')
}
