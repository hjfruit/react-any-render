import { AnyObject } from '../types'

export interface TableSchemaItemMerge {
  // 合并字段类型 inner 内部对象数组型合并 outer 外部字段合并
  scope: string
  // 别名 key
  aliasKey?: string
  // 所有可合并的字段 key
  allFields: string[]
  // 当前合并的字段 key
  fields: string[]
  // 字段分隔符
  separator?: string
  // 字段占位符
  placeholder?: string
  // 字段合并是否可修改
  modify?: boolean
}

export interface TableSchemaItem {
  // 分组
  group?: string
  // 规则 id
  id: string
  // 列顺序
  order?: number
  // 列 key，等同于 dataIndex
  key: string
  // 列别名 key
  aliasKey?: string
  // 列名
  name: string
  // 列提示语
  tip?: string
  // 数据类型
  type: string
  // 是否显示
  visible?: boolean | string
  // 是否固定
  fixed?: string
  // 列格式化
  format?: string
  // 列宽
  width: number
  // 列是否可修改
  modify?: boolean
  // 列是否可排序
  sorter?: boolean
  // 列指定渲染组件
  widget?: string
  // 标题渲染组件
  titleWidget?: string
  // 列合并属性
  cell?: {
    // 合并类型，内部合并 inner 外部合并 outer
    type: string
    // 用其他字段的合并规则
    bind: string
  }
  // 数据返回值对应的名称
  enumValues?: AnyObject
  // 占位符
  placeholder?: string
  // 合并字段属性
  merge?: TableSchemaItemMerge
}

export interface TableSchemaObject {
  // 对象规则 id
  id: string
  // 对象类型
  type: string
  // 对象渲染组件
  widget?: string
  // 是否分页
  page?: boolean
  // 每页数量
  pageSize?: number
  // 透传属性值
  props?: AnyObject
  // 行合并参照 key
  cellKeys?: string[]
  // 子列
  children: TableSchemaItem[]
}

export interface IRenderParams {
  value: any
  record: AnyObject
  index: number
  attrs: TableSchemaItem
  children?: TableSchemaItem[]
}
