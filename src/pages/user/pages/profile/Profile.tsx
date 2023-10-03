import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BodyUpdateProfile, userApi } from 'src/api/user.api'
import Button from 'src/components/button/Button'
import Input from 'src/components/input'
import InputNumber from 'src/components/inputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/dateSelect/DateSelect'
import { toast } from 'react-toastify'
import { setProfileFromLS } from 'src/utils/auth'
import { AppContext } from 'src/contexts/app.context'

type FormData = Pick<UserSchema, 'address' | 'avatar' | 'date_of_birth' | 'name' | 'phone'>
const profileSchema = userSchema.pick(['address', 'avatar', 'date_of_birth', 'name', 'phone'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control
  } = useForm<FormData>({
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

  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date())
      setValue('avatar', profile.avatar)
      setValue('phone', profile.phone)
    }
  }, [profile, setValue])

  const handleOnSubmit = handleSubmit((data) => {
    updateProfileMutation.mutate(
      { ...data, date_of_birth: data.date_of_birth?.toISOString() },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          setProfileFromLS(data.data.data)
          setProfile(data.data.data)
          refetch()
        }
      }
    )
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
                src={
                  profile?.avatar ||
                  'https://lh3.google.com/u/0/ogw/AOLn63EL4GOYWnRDdDNe1_f1MIfQsS6TK4QaQfkB2Fmg=s32-c-mo'
                }
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
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
