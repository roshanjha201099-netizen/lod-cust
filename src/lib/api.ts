export const API_BASE_URL = 'http://localhost:5000'

const TOKEN_STORAGE_KEY = 'lod-token'

export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as {
    error?: string
    [key: string]: unknown
  }

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data as T
}
