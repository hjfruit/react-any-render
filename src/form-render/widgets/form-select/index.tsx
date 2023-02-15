import { Select } from 'antd'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { AnyObject } from '../../../types'
import { selectFilterOption } from '../../../utils'

export interface IProps {
  value?: string | number
  onChange?: (value: string | number) => void
  defaultValue?: string | number
  enumValues: { [key: string | number]: string }
  readOnly?: boolean
  props?: AnyObject
}

const FormSelect: FC<IProps> = props => {
  const { value, onChange, defaultValue, enumValues, readOnly } = props
  const [options, setOptions] = useState<{ value: string | number; label: string | number }[]>([])

  useEffect(() => {
    if (!enumValues) return
    const newOptions = Object.keys(enumValues).map(key => ({
      value: key,
      label: enumValues?.[key] ?? key,
    }))
    setOptions(newOptions)
  }, [enumValues])

  return (
    <Select
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={readOnly}
      options={options}
      filterOption={selectFilterOption}
      showSearch
      allowClear
      {...(props?.props ?? {})}
    />
  )
}

export default FormSelect
