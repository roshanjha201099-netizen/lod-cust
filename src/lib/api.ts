export const API_BASE_URL = 'http://localhost:5000'

export async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
