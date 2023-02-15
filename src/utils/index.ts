import { compile } from 'angular-expressions'
import dayjs from 'dayjs'
import { cloneDeep, isEqual, isNil } from 'lodash'
import { TableSchemaItem } from '../table-render/types'
import { AnyObject, GraphqlObject } from '../types'

/**
 * 获取带有 预计/实际标签的数据
 */
export function getTime(params: { time: number; format?: string; label?: boolean }) {
  const { time, format, label } = params
  let timeString = dayjs(time).format(format ?? 'YYYY-MM-DD HH:mm:ss')
  if (label) {
    const text = Date.now() > time ? '实际' : '预计'
    timeString = `${text} ${timeString}`
  }
  return timeString
}

/**
 * 合并数据处理
 */
export function parseDataToRowSpan(data: readonly any[], keys?: string[]) {
  // 记录重复了几次
  const rowSpan: { [key: string | number]: number } = {}
  // 记录第一次重复元素的值
  const firstItem: AnyObject = {}
  // 记录第一次重复元素的位置
  const firstIndex: AnyObject = {}
  let rootRowSpan = 1
  let rootFirstItem: any = {}
  const cache = cloneDeep(data)
  cache.forEach((record, index) => {
    // 根据多个字段确定唯一合并值
    if (keys?.length) {
      record.rootRowSpan = 1
      if (keys.every(ele => rootFirstItem[ele] === record[ele])) {
        rootRowSpan++
        rootFirstItem.rootRowSpan = rootRowSpan
        record.rootRowSpan = 0
      } else {
        rootRowSpan = 1
        rootFirstItem = record
      }
    }
    // 每个字段独立合并规则
    Object.keys(record).forEach(key => {
      if (isEqual(firstItem?.[key], record[key])) {
        rowSpan[key] += 1
        if (!record?.rowSpan) {
          record.rowSpan = {}
        }
        record.rowSpan[key] = 0
      } else {
        // 上批次重复元素写入
        const i = firstIndex?.[key]
        if (i || i === 0) {
          if (!cache[i]?.rowSpan) {
            cache[i].rowSpan = {}
          }
          cache[i].rowSpan[key] = rowSpan[key]
        }
        // 下批次的重复元素开始
        firstItem[key] = record[key]
        firstIndex[key] = index
        rowSpan[key] = 1
      }
    })
  })
  return cache
}

/**
 * 表格行合并处理
 */
export const onCell = (cell: { type: string; bind?: string }, key: string | number) => {
  return (record: { rowSpan: { [x: string]: undefined }; rootRowSpan: undefined }) => {
    let row = { rowSpan: undefined }
    if (cell.type === 'inner') {
      if (cell?.bind) {
        row.rowSpan = record?.rowSpan?.[cell.bind]
      } else {
        row.rowSpan = record?.rowSpan?.[key]
      }
    } else {
      row.rowSpan = record?.rootRowSpan
    }
    return row
  }
}

/**
 * 提取内部字段
 */
const getInnerSortKeys = (attrs: TableSchemaItem, children: TableSchemaItem[]) => {
  if (!attrs?.key) return
  if (attrs.type === 'object') {
    const key = attrs.merge?.fields?.[0]
    const currentAttrs = children.find(item => key === item.aliasKey || key === item.key)
    if (!currentAttrs?.key) return []
    return [attrs.key, currentAttrs.key]
  } else {
    return [attrs.key]
  }
}

/**
 * 字段排序
 */
export function getSortKeys(attrs: TableSchemaItem, children: TableSchemaItem[]): (string | number)[] | undefined {
  if (!attrs?.key) return undefined
  if (!attrs?.merge) return [attrs.key]
  if (attrs.merge?.scope === 'inner') {
    return getInnerSortKeys(attrs, children)
  } else {
    const key = attrs.merge?.fields?.[0]
    const currentAttrs = children.find(item => key === item.aliasKey || key === item.key)
    if (!currentAttrs) return []
    return getSortKeys(currentAttrs, children)
  }
}

/**
 * 数据排序
 */
export const sortData = (keys: string[]) => {
  if (!keys?.length) return
  return (recordA: any, recordB: any) => {
    let valueA = recordA[keys[0]]
    let valueB = recordB[keys[0]]
    if (keys?.[1]) {
      valueA = recordA[keys[0]][keys[1]]
      valueB = recordB[keys[0]][keys[1]]
    }
    if (!isNil(valueA) && isNil(valueB)) {
      return 1
    } else if (isNil(valueA) && !isNil(valueB)) {
      return -1
    } else if (isNil(valueA) && isNil(valueB)) {
      return 0
    }
    const valueNumberA = Number(valueA)
    if (isFinite(valueNumberA)) {
      return valueA - valueB
    } else {
      return valueA.localeCompare(valueB)
    }
  }
}

/**
 * 获取远程数据
 */
export async function getGqlParams(graphql: Partial<GraphqlObject>, rootData: AnyObject) {
  let newParams = graphql?.singleParam
  if (!newParams && graphql?.params?.length) {
    newParams = {}
    graphql.params.forEach(key => {
      newParams[key] = rootData?.[key] ?? graphql?.defaultValue?.[key]
    })
  }
  return newParams
}

/**
 * 获取表达式结果
 */
export function getExpressionData(express: string, rootData: AnyObject) {
  const reg = new RegExp('((?<={{).*(?=}}))', 'g')
  const str = express.match(reg)
  if (!str || !str[0]) return express
  const scope = cloneDeep(rootData)
  const data = { rootData: scope }
  const evaluate = compile(str[0])
  return evaluate(data)
}

/**
 * 过滤下拉元素
 */
export function selectFilterOption(input: any, option: any) {
  const label = option.label || option.children
  return label?.indexOf(input) >= 0
}
