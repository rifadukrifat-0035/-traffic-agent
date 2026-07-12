import axios from 'axios'

const api = axios.create({
  baseURL: 'https://glowing-space-barnacle-jjw7r57rg9r62ww-8000.app.github.dev/',
  timeout: 30000,
})

export default api
