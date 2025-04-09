import Cookies from 'universal-cookie'

const cookies = new Cookies()
const TokenKey = import.meta.env.VITE_JWT_TOKEN_KEY

export function getToken() {
  const token = cookies.get(TokenKey)
  return token ? `Bearer ${token}` : null
}

export function setToken(token) {
  return cookies.set(TokenKey, token, { path: '/' })
}

export function removeToken() {
  return cookies.remove(TokenKey, { path: '/' })
} 