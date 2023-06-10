import React from 'react'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  className?: string
  placeholder?: string
  register: UseFormRegister<any>
  errors?: string
  name: string
  autoComplete?: string
}

export default function Input({ type, className, placeholder, register, errors, name, autoComplete }: InputProps) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name)}
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errors}</div>
    </div>
  )
}
