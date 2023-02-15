import type { FC } from 'react'
import React from 'react'
import { AnyObject } from '../../../types'
import dayjs, { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

const { RangePicker } = DatePicker

export interface IProps {
  value?: number[]
  onChange?: (value?: (number | undefined)[]) => void
  readOnly?: boolean
  defaultValue?: number[]
  props?: AnyObject
}

const FormRangePicker: FC<IProps> = props => {
  const { value, onChange, readOnly, defaultValue } = props

  const formatDate: any = (values?: number[]) => {
    const value0 = values?.[0] ? dayjs(values[0]) : undefined
    const value1 = values?.[1] ? dayjs(values[1]) : undefined
    if (!value0 && !value1) return undefined
    return [value0, value1]
  }

  const transformTime = (val: Dayjs, format: string) => {
    if (!val) return undefined
    return dayjs(val.format(format)).valueOf()
  }

  const onValueChange = (values: any) => {
    if (values?.length) {
      const value0 = transformTime(values?.[0], 'YYYY-MM-DD 00:00:00')
      const value1 = transformTime(values?.[1], 'YYYY-MM-DD 23:59:59')
      if (!value0 && !value1 && onChange) {
        onChange(undefined)
      }
      onChange && onChange([value0, value1])
    } else {
      onChange && onChange(undefined)
    }
  }

  return (
    <RangePicker
      allowClear
      disabled={readOnly}
      value={formatDate(value)}
      defaultValue={formatDate(defaultValue)}
      onChange={onValueChange}
      {...(props?.props ?? {})}
    />
  )
}

export default FormRangePicker
