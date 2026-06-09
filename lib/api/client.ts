import axios from 'axios'

const clientApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, ''),
  withCredentials: true,
})

export default clientApi
