export type AnyObject = { [key: string]: any }

export interface GraphqlObject {
  // gql 语句
  gql: string
  // 入参包裹名称
  inputName?: string
  // 出参包裹名称
  interfaceName: string
  // 参数字段
  params: string[]
  // 默认值
  defaultValue?: AnyObject
  // 单参数默认值
  singleParam?: any
}
