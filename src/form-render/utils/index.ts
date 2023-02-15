import { cloneDeep } from 'lodash'
import { AnyObject } from '../../types'
import { getExpressionData } from '../../utils'
import { FormSchemaItem, FormSchemaObject } from '../types'

const PARSE_FIELDS: (keyof FormSchemaItem)[] = ['visible', 'name', 'required', 'readOnly', 'widget']

export const schema2RootSchema = (schema: FormSchemaObject, data: AnyObject = {}) => {
  if (!schema || !schema?.children?.length) return
  let newSchema = cloneDeep(schema)
  const { children, ...rootParams } = newSchema
  const orderChildren: (FormSchemaItem & { order: number })[] = []
  const otherChildren: FormSchemaItem[] = []
  children?.forEach((item: any) => {
    // 表达式解析
    PARSE_FIELDS.forEach(key => {
      if (item[key] && typeof item[key] === 'string') {
        item[key] = getExpressionData(item[key] as string, data)
      }
    })
    if (item?.order) {
      orderChildren.push({ ...item, order: item?.order })
    } else {
      otherChildren.push(item)
    }
  })
  const sortChildren = orderChildren.sort((a, b) => a.order - b.order)
  return {
    ...rootParams,
    children: [...sortChildren, ...otherChildren],
  }
}

export const values2RootData = (data: AnyObject, schema?: FormSchemaObject) => {
  if (!schema || !schema?.children?.length) return
  let newData = cloneDeep(data)
  schema.children.forEach(item => {
    // 绑定的数据处理
    if (item?.binds?.length) {
      const binds = item.binds
      const values = data[item.key]
      const val0 = data?.[binds[0]] ? data?.[binds[0]] : undefined
      const val1 = data?.[binds[1]] ? data?.[binds[1]] : undefined
      const value0 = values?.[0] ? values[0] : val0
      const value1 = values?.[1] ? values[1] : val1
      if (!value0 && !value1) return
      newData[item.key] = [value0, value1]
    }
  })
  return newData
}

/**
 * 处理bind，返回最终的数据结果
 */
export function rootData2SubmitData(rootData?: AnyObject, rootSchema?: FormSchemaObject) {
  const data: AnyObject = {}
  rootSchema?.children?.forEach(item => {
    const value = rootData?.[item.key]
    if (item?.binds?.length && value?.length) {
      item.binds.forEach((key, index) => {
        const val: any = value[index] ?? undefined
        if (val) {
          data[key] = val
        }
      })
    } else {
      if (value) {
        data[item.key] = value
      }
    }
  })
  return data
}
