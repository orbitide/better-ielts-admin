import axios from 'axios'

const clientApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, ''),
  withCredentials: true,
})

clientApi.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Request failed'
    const error = new Error(message) as Error & { status?: number }
    error.status = err.response?.status
    return Promise.reject(error)
  }
)

export default clientApi
