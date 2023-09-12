import React, { useState } from 'react'
import InputNumber from '../inputNumber'
import { InputNumberProps } from '../inputNumber/InputNumber'
import classNames from 'classnames'

interface QuantityControllerProps extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  classNameWrapper = 'ml-10',
  value,
  disabled,
  ...rest
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 1))
  const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    }
    onType && onType(_value)
    setLocalValue(_value)
  }

  const handleIncrease = () => {
    let _value = Number(value) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const handleDecrease = () => {
    let _value = Number(value) - 1
    if (_value < 0) {
      _value = 0
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleFocusOut = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={`${classNameWrapper} flex items-center`}>
      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600',
          {
            'pointer-events-none cursor-not-allowed': disabled
          }
        )}
        onClick={handleDecrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        className=''
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleType}
        onBlur={handleFocusOut}
        value={value || localValue}
        {...rest}
      />
      <button
        className={classNames(
          'flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600',
          {
            'pointer-events-none cursor-not-allowed': disabled
          }
        )}
        onClick={handleIncrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
