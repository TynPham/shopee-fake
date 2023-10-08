import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'

import { useForm } from 'react-hook-form'
import { BodyUpdateProfile, userApi } from 'src/api/user.api'
import Button from 'src/components/button/Button'
import Input from 'src/components/input'
import { UserSchema, userSchema } from 'src/utils/rules'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/util.type'

export interface ChangePasswordProps {}

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const changePasswordSchema = userSchema.pick(['confirm_password', 'password', 'new_password'])

export default function ChangePassword(props: ChangePasswordProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    defaultValues: {
      confirm_password: '',
      new_password: '',
      password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: (body: BodyUpdateProfile) => userApi.updateProfile(body)
  })

  const handleOnSubmit = handleSubmit((data) => {
    updateProfileMutation.mutate(omit(data, ['confirm_password']) as BodyUpdateProfile, {
      onSuccess: (data) => {
        toast.success(data.data.message)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData] as string,
                type: 'server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mr-auto mt-8 max-w-2xl' onSubmit={handleOnSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                errors={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                errors={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập lại mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                className='relative '
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Nhập lại mật khẩu'
                errors={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
