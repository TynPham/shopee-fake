import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/util.type'
import http from 'src/utils/http'

export interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}
export const userApi = {
  getProfile: () => http.get<SuccessResponse<User>>('me'),
  updateProfile: (body: BodyUpdateProfile) => http.put<SuccessResponse<User>>('user', body),
  uploadAvatar: (body: FormData) =>
    http.post<SuccessResponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}
