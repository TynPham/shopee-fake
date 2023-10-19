import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import {
  getAccessTokenFormLS,
  clearLS,
  setAccessTokenToLS,
  setProfileFromLS,
  getRefreshTokenFromLS,
  setRefreshTokenToLS
} from './auth'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from 'src/api/auth.api'
import { isExpireTokenAxiosError, isUnauthorizedAxiosError } from './utils'
import { ErrorResponse } from 'src/types/util.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    ;((this.accessToken = getAccessTokenFormLS()),
    (this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 5,
        'expire-refresh-token': 60 * 60
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
          const pathUrl = response.config.url
          if (pathUrl === URL_LOGIN || pathUrl === URL_REGISTER) {
            const data = response.data as AuthResponse
            this.accessToken = data.data.access_token
            this.refreshToken = data.data.refresh_token
            setRefreshTokenToLS(this.refreshToken)
            setAccessTokenToLS(this.accessToken)
            setProfileFromLS(data.data.user)
          } else if (pathUrl === URL_LOGOUT) {
            this.accessToken = ''
            clearLS()
          }
          return response
        },
        (error: AxiosError) => {
          if (
            ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
              error.response?.status as number
            )
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any | undefined = error.response?.data
            const message = data?.message || error.message
            toast.error(message)
          }
          if (isUnauthorizedAxiosError<ErrorResponse<{ name: string; message: string }>>(error)) {
            const config = error.response?.config
            if (isExpireTokenAxiosError(error) && config?.url !== URL_REFRESH_TOKEN) {
              this.refreshTokenRequest = this.refreshTokenRequest
                ? this.refreshTokenRequest
                : this.handleRefreshToken().finally(() => {
                    setTimeout(() => {
                      this.refreshTokenRequest = null
                    }, 10000)
                  })
              return this.refreshTokenRequest.then((access_token) => {
                return this.instance({ ...config, headers: { ...config?.headers, authorization: access_token } })
              })
            }
            clearLS()
            ;(this.accessToken = ''), (this.refreshToken = '')
            toast.error(error.response?.data.data?.message || error.response?.data.message)
          }
          return Promise.reject(error)
        }
      )
  }
  private handleRefreshToken = () => {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
