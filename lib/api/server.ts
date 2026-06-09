import axios from 'axios'
import https from 'https'

const serverApi = axios.create({
  baseURL: (process.env.API_URL ?? 'http://localhost:5000').replace(/\/$/, ''),
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
})

export default serverApi
