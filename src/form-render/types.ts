import { FormInstance } from 'antd'
import { Rule } from 'antd/es/form'
import { AnyObject, GraphqlObject } from '../types'

export interface FormSchemaItem {
  // 后端规则 ID
  id: string
  // 展示顺序，数据类字段无此属性
  order?: number
  // 字段 key
  key: string
  // 字段别名 key，当 key 重复时拥有此字段
  aliasKey?: string
  // 字段名称
  name: string
  // 字段类型
  type: string
  // 是否只读
  readOnly?: boolean | string
  // 是否必填
  required?: boolean | string
  // 是否隐藏
  visible?: boolean | string
  // 字段渲染组件
  widget: string
  // 字段绑定后端的真实数据字段，目前只用于时间范围
  binds?: string[]
  // 数据值映射的名称，多用于下拉选择
  enumValues?: AnyObject
  // 字段的数据请求，多用于异步下拉选择
  graphql?: GraphqlObject
  // 字段校验规则，同 Form 的 rules
  rules?: Rule[]
  // 字段透传属性值
  props?: AnyObject
}

export interface FormSchemaObject {
  // 对象 id
  id: string
  // 对象类型
  type: string
  // 对象渲染组件
  widget: string
  // 对象透传属性值
  props?: AnyObject
  children: FormSchemaItem[]
}

export interface FormSchemaInstance {
  getValues: () => AnyObject | undefined
  setValues: (values: AnyObject) => void
  validateFields: () => Promise<AnyObject>
  resetFields: () => void
  _formInstance: {
    _renderCount: number
    _rootData?: AnyObject
    _rootSchema?: FormSchemaObject
    _schema?: FormSchemaObject
    _form: FormInstance<AnyObject>
    _setSchema: (schema: FormSchemaObject) => void
    _setRootData: (values: AnyObject) => void
  }
}

export interface FormState {
  rootData?: AnyObject
  rootSchema?: FormSchemaObject
  renderCount: number
}
