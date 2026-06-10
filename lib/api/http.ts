import axios from 'axios'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const store = await cookies()
      const token = store.get('admin_access')?.value
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { /* outside request context */ }
  }
  return config
})

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    const error = new Error(message) as Error & { status?: number }
    error.status = err.response?.status
    return Promise.reject(error)
  }
)

export default httpClient
