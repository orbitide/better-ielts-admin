import axios, { AxiosError } from 'axios'

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const httpClient = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
})


httpClient.interceptors.response.use(
    (res) => res,
    (err: AxiosError<{
        message: string
    }>) => {
        const message = err.response?.data?.message ?? err.message ?? 'Request failed'
        const error = new Error(message) as Error & { status?: number }
        error.status = err.response?.status
        return Promise.reject(error)
    }
)

