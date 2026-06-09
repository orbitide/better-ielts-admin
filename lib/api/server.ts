import axios from 'axios'
import https from 'https'
import { cookies } from 'next/headers'

const serverApi = axios.create({
  baseURL: (process.env.API_URL ?? 'http://localhost:5000').replace(/\/$/, ''),
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  withCredentials: true,
})

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_access')?.value
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default serverApi
