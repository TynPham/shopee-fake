import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>('register', body)
  },
  login: (body: { email: string; password: string }) => {
    return http.post<AuthResponse>('login', body)
  },
  logout: () => http.post('logout')
}
