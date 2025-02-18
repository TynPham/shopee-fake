import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email is invalid'
    },
    maxLength: {
      value: 150,
      message: 'Email must be 5 - 160 characters'
    },
    minLength: {
      value: 5,
      message: 'Email must be 5 - 160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },

    maxLength: {
      value: 150,
      message: 'Password must be 6 - 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Password must be 6 - 160 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm_password is required'
    },

    maxLength: {
      value: 150,
      message: 'Confirm_password must be 6 - 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Confirm_password must be 6 - 160 characters'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Confirm password does not match'
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

function handleRuleCFPassword(ref: string) {
  return yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Password must be 6 - 160 characters')
    .max(160, 'Password must be 6 - 160 characters')
    .oneOf([yup.ref(ref)], 'Confirm password must be match')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid')
    .min(5, 'Email must be 5 - 160 characters')
    .max(150, 'Email must be 5 - 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be 6 - 160 characters')
    .max(160, 'Password must be 6 - 160 characters'),
  confirm_password: handleRuleCFPassword('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Name product is required')
})

export type Schema = yup.InferType<typeof schema>

export const userSchema = yup.object({
  name: yup.string().max(160, 'Name must not exceed 160 characters'),
  phone: yup.string().max(20, 'Name must not exceed 20 characters'),
  address: yup.string().max(160, 'Name must not exceed 160 characters'),
  date_of_birth: yup.date().max(new Date(), 'Date is invalid'),
  avatar: yup.string().max(1000, 'Name must not exceed 1000 characters'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: handleRuleCFPassword('new_password')
})
export type UserSchema = yup.InferType<typeof userSchema>
