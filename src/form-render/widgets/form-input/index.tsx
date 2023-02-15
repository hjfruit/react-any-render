import { Input } from 'antd'
import type { FC } from 'react'
import React from 'react'
import { AnyObject } from '../../../types'

export interface IProps {
  value?: string
  defaultValue?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  props?: AnyObject
}

const FormInput: FC<IProps> = props => {
  const { value, defaultValue, readOnly, onChange } = props
  return (
    <Input
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      defaultValue={defaultValue}
      disabled={readOnly}
      allowClear
      {...(props?.props || {})}
    />
  )
}

export default FormInput
