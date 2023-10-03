import { range } from 'lodash'
import { useState } from 'react'

export interface DateSelectProps {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

type DateState = {
  day: number
  month: number
  year: number
}

export default function DateSelect({ onChange, value, errorMessage }: DateSelectProps) {
  const [date, setDate] = useState<DateState>({
    day: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueSelect } = event.target
    const newDate = {
      day: value?.getDate() || date.day,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueSelect)
    }
    setDate(newDate)

    onChange && onChange(new Date(newDate.year, newDate.month, newDate.day))
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            name='day'
            onChange={handleOnChange}
            value={value?.getDate() || date.day}
          >
            {range(1, 32).map((number) => (
              <option value={number} key={number}>
                {number}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            name='month'
            onChange={handleOnChange}
            value={value?.getMonth() || date.month}
          >
            {range(0, 12).map((number) => (
              <option value={number} key={number}>
                {number + 1}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            name='year'
            onChange={handleOnChange}
            value={value?.getFullYear() || date.year}
          >
            {range(1990, 2024).map((number) => (
              <option value={number} key={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
