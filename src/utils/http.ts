import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { getAccessTokenFormLS, clearLS, setAccessTokenToLS, setProfileFromLS } from './auth'
import { AuthResponse } from 'src/types/auth.type'
import path from 'src/constants/path'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    ;((this.accessToken = getAccessTokenFormLS()),
    (this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    }))),
      this.instance.interceptors.request.use(
        (config) => {
          if (this.accessToken) {
            config.headers.authorization = this.accessToken
            return config
          }
          return config
        },
        (error: AxiosError) => {
          return Promise.reject(error)
        }
      ),
      this.instance.interceptors.response.use(
        (response) => {
          const pathUrl = '/' + response.config.url
          if (pathUrl === path.login || pathUrl === path.register) {
            const data = response.data as AuthResponse
            this.accessToken = data.data.access_token
            setAccessTokenToLS(this.accessToken)
            setProfileFromLS(data.data.user)
          } else if (pathUrl === path.logout) {
            this.accessToken = ''
            clearLS()
          }
          return response
        },
        (error: AxiosError) => {
          if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data.message || error.message
            toast.error(message)
          }
          if (error.response?.status === HttpStatusCode.Unauthorized) {
            clearLS()
          }
          return Promise.reject(error)
        }
      )
  }
}

const http = new Http().instance

export default http
