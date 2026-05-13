import { supabase } from './supabase'

const API_BASE = 'http://localhost:5000'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('You must be logged in.')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  }
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...headers, ...options.headers } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// ── Dashboard ──
export const fetchDashboard = () => apiFetch('/api/dashboard')

// ── Brands ──
export const fetchBrands = () => apiFetch('/api/brands')
export const createBrand = (data: any) => apiFetch('/api/brands', { method: 'POST', body: JSON.stringify(data) })
export const updateBrand = (id: string, data: any) => apiFetch(`/api/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteBrand = (id: string) => apiFetch(`/api/brands/${id}`, { method: 'DELETE' })

// ── Calendars ──
export const fetchCalendars = () => apiFetch('/api/calendars')
export const fetchCalendar = (id: string) => apiFetch(`/api/calendars/${id}`)

// ── Generate ──
export const generateCalendar = (data: any) => apiFetch('/api/generate', { method: 'POST', body: JSON.stringify(data) })

// ── Posts ──
export const updatePost = (id: string, data: any) => apiFetch(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const approvePost = (id: string, approved: boolean) => apiFetch(`/api/posts/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approved }) })
export const regeneratePost = (id: string) => apiFetch(`/api/posts/${id}/regenerate`, { method: 'POST' })
