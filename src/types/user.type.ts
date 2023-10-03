type Role = 'User' | 'Admin'
export interface User {
  roles: Role[]
  _id: string
  email: string
  createdAt: string
  updatedAt: string
  address?: string
  date_of_birth?: string
  name?: string
  phone?: string
  avatar?: string
  password?: string
  new_password?: string
}
