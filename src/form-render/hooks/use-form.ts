import { Form } from 'antd'
import { useEffect, useReducer, useRef } from 'react'
import { AnyObject } from '../../types'
import { FormSchemaInstance, FormSchemaObject, FormState } from '../types'
import { rootData2SubmitData, schema2RootSchema, values2RootData } from '../utils'

const reducer = (prevState: FormState, updatedProperty: Partial<FormState>): FormState => ({
  ...prevState,
  ...updatedProperty,
})

const initialState: FormState = {
  renderCount: 0,
}

const useForm = () => {
  // 原始schema
  const _schema = useRef<FormSchemaObject>()
  // antd form实例
  const [_form] = Form.useForm()
  const [state, setState] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.rootData) {
      _form.setFieldsValue(state.rootData)
    }
  }, [state.rootData])

  const getValues = () => rootData2SubmitData(state.rootData, state.rootSchema)

  const setValues = (values: AnyObject) => {
    const rootData = values2RootData(values, state.rootSchema)
    setState({ rootData })
  }

  const validateFields = async () => {
    const values = await _form.validateFields()
    return rootData2SubmitData(values, state.rootSchema)
  }

  const resetFields = () => {
    setState({ rootData: undefined })
    _form.resetFields()
  }

  const _setSchema = (schema: FormSchemaObject) => {
    const _rootSchema = schema2RootSchema(schema)
    setState({ rootSchema: _rootSchema, renderCount: state.renderCount + 1 })
    _schema.current = schema
  }

  const _setRootData = (values: AnyObject) => {
    setState({ rootData: values })
  }

  const form: FormSchemaInstance = {
    _formInstance: {
      _renderCount: state.renderCount,
      _form,
      _rootData: state.rootData,
      _rootSchema: state.rootSchema,
      _schema: _schema.current,
      _setSchema,
      _setRootData,
    },
    getValues,
    setValues,
    validateFields,
    resetFields,
  }

  return [form]
}

export default useForm
