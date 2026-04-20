// axiosInstance.js
// Pre-configured axios with our backend base URL
// Import this wherever you need to call the backend

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 60000, // 60 seconds — generation can take up to 15s, give it room
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api