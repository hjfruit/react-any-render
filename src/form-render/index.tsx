import { Form } from 'antd'
import React, { FC, useEffect } from 'react'
import { AnyObject } from '../types'
import { FormSchemaInstance, FormSchemaObject } from './types'
import innerWidgets from './widgets'
import innerLayouts from './layouts'
import { Locale } from 'antd/es/locale-provider'
import Wrapper from '../components/wrapper'

interface IProps {
  form: FormSchemaInstance
  schema: FormSchemaObject
  locale?: Locale
  name?: string
  widgets?: AnyObject
  layouts?: AnyObject
  widgetProps?: AnyObject
  onMount?: () => void
  onChange?: (values?: AnyObject) => void
  onSubmit?: () => void
  onReset?: () => void
  [key: string]: any
}

const FormRender: FC<IProps> = props => {
  const { form, schema, onMount, onChange, locale, widgets, layouts, name, widgetProps, ...layoutProps } = props
  const { _formInstance } = form
  const { _form, _setSchema, _rootData, _rootSchema } = _formInstance
  const allWidgets: AnyObject = { ...innerWidgets, ...widgets }
  const allLayouts: AnyObject = { ...innerLayouts, ...layouts }

  const onValuesChange = (_: any, allValues: any) => {
    _formInstance._setRootData(allValues)
  }

  useEffect(() => {
    if (onChange) {
      onChange(_rootData)
    }
  }, [_rootData])

  useEffect(() => {
    if (form._formInstance._renderCount === 1 && typeof onMount === 'function') {
      onMount()
    }
  }, [form._formInstance._renderCount])

  useEffect(() => {
    _setSchema(schema)
  }, [schema])

  if (!_rootSchema || !_rootSchema?.widget) return null
  const LayoutComponent = allLayouts[schema.widget]
  if (!LayoutComponent) {
    console.warn('schema widget 渲染组件未找到')
    return null
  }

  return (
    <Wrapper locale={locale}>
      <LayoutComponent form={_form} name={name} onValuesChange={onValuesChange} {...layoutProps}>
        {_rootSchema.children?.map(item => {
          if (!item.visible || !item?.widget || !item?.order) return null
          let Component = allWidgets[item.widget]
          if (!Component) return null
          return (
            <Form.Item key={item.key} label={item.name} name={item.key} rules={item?.rules} required={!!item?.required}>
              <Component {...item} id={item.key} rootData={_rootData} {...widgetProps} />
            </Form.Item>
          )
        })}
      </LayoutComponent>
    </Wrapper>
  )
}

export default FormRender
