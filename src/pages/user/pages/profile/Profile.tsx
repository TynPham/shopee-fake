import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BodyUpdateProfile, userApi } from 'src/api/user.api'
import Button from 'src/components/button/Button'
import Input from 'src/components/input'
import InputNumber from 'src/components/inputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'

import { toast } from 'react-toastify'
import { setProfileFromLS } from 'src/utils/auth'
import { AppContext } from 'src/contexts/app.context'
import DateSelect from '../../components/dateSelect'
import config from 'src/constants/config'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/util.type'

type FormDataUser = Pick<UserSchema, 'address' | 'avatar' | 'date_of_birth' | 'name' | 'phone'>
type FormDataUserError = Omit<FormDataUser, 'date_of_birth'>
const profileSchema = userSchema.pick(['address', 'avatar', 'date_of_birth', 'name', 'phone'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const uploadAvatarRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const previewAvatar: string = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    setError
  } = useForm<FormDataUser>({
    defaultValues: {
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1),
      name: '',
      phone: ''
    },
    resolver: yupResolver(profileSchema)
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const updateProfileMutation = useMutation({
    mutationFn: (body: BodyUpdateProfile) => userApi.updateProfile(body)
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: (body: FormData) => userApi.uploadAvatar(body)
  })

  const profile = profileData?.data.data
  const avatar = watch('avatar')

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date())
      setValue('avatar', profile.avatar)
      setValue('phone', profile.phone)
    }
  }, [profile, setValue])

  const onChooseAvatar = () => {
    uploadAvatarRef.current?.click()
  }

  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileLocal = event.target.files && event.target.files[0]
    if (fileLocal && (fileLocal?.size >= config.maxSizeAvatarUpload || !fileLocal.type.startsWith('image'))) {
      toast.error('The maximum file size is 1 MB. Format: .JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      setFile(fileLocal as File)
    }
  }

  const handleOnSubmit = handleSubmit(async (data) => {
    try {
      let avatarName
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const avatarRes = await uploadAvatarMutation.mutateAsync(formData)
        avatarName = avatarRes.data.data
        setValue('avatar', avatarName)
      }
      await updateProfileMutation.mutateAsync(
        { ...data, date_of_birth: data.date_of_birth?.toISOString(), avatar: avatarName },
        {
          onSuccess: (data) => {
            toast.success(data.data.message)
            setProfileFromLS(data.data.data)
            setProfile(data.data.data)
            refetch()
          }
        }
      )
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataUserError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataUserError, {
              message: formError[key as keyof FormDataUserError],
              type: 'server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={handleOnSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='name'
                errors={errors.name?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    errorMessage={errors.phone?.message}
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                register={register}
                name='address'
                errors={errors.address?.message}
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button type='submit' className='rounded-sm bg-orange px-6 py-[10px] text-white'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewAvatar || getAvatarUrl(avatar)}
                alt='img'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
              ref={uploadAvatarRef}
              onChange={handleUploadAvatar}
              onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                ;(event.target as any).value = null
              }}
            />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
              onClick={onChooseAvatar}
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
