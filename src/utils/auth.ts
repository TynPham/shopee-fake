import { User } from 'src/types/user.type'

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFormLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileFromLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
