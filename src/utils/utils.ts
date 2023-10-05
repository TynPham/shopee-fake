import axios, { AxiosError, HttpStatusCode } from 'axios'
import config from 'src/constants/config'

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export const isAxiosUnprocessableEntityError = <FormData>(error: unknown): error is AxiosError<FormData> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const formatNumberToSocialStyle = (value: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLocaleLowerCase()
}

export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-id,${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-id,')
  return arr[arr.length - 1]
}

export const getAvatarUrl = (avatarName?: string) =>
  avatarName
    ? `${config.baseUrl}images/${avatarName}`
    : 'https://lh3.google.com/u/0/ogw/AOLn63EL4GOYWnRDdDNe1_f1MIfQsS6TK4QaQfkB2Fmg=s32-c-mo'
