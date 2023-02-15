import type { TableColumnType, TableProps } from 'antd'
import { Table } from 'antd'
import { uniqueId } from 'lodash'
import type { FC, ReactNode } from 'react'
import React, { Fragment, useEffect, useState } from 'react'

import TipTitle from './components/tip-title'
import innerWidgets from './widgets'
import type { AnyObject } from '../types'
import { onCell, parseDataToRowSpan } from '../utils'
import { IRenderParams, TableSchemaItem, TableSchemaObject } from './types'

interface IProps extends TableProps<any> {
  schema: TableSchemaObject
  operation?: TableColumnType<any>
  widgets?: {
    [key: string]: (params: IRenderParams) => any
  }
}

const TableRender: FC<IProps> = props => {
  const { schema, widgets, operation, ...tableProps } = props
  const [columns, setColumns] = useState<TableColumnType<any>[]>([])
  const [isCell, setIsCell] = useState(false)
  let allWidgets: AnyObject = { ...innerWidgets, ...(widgets ?? {}) }

  const toolTip = (value: ReactNode) => {
    if (typeof value === 'object') {
      return value
    } else {
      return <span title={value?.toString()}>{value}</span>
    }
  }

  const getTitleWidgetValue = (params: { attrs: TableSchemaItem; [key: string]: any }) => {
    const { attrs } = params
    if (!attrs?.titleWidget) return attrs?.name
    const Component = allWidgets[attrs.titleWidget]
    if (attrs?.titleWidget && Component) {
      if (typeof Component === 'function') {
        return Component(params)
      }
      return <Component {...params} />
    }
    return attrs?.name
  }

  /**
   * 获取 widget 渲染
   */
  const getWidgetValue = (params: {
    value: any
    record: AnyObject
    index: number
    attrs: TableSchemaItem
    placeholder?: string
  }) => {
    const { value, record, index, attrs, placeholder } = params
    if (attrs?.widget) {
      const Component = allWidgets[attrs.widget]
      if (Component) {
        if (typeof Component === 'function') {
          return Component({ value, record, index, attrs, placeholder })
        }
        return <Component value={value} record={record} index={index} attrs={attrs} placeholder={placeholder} />
      }
    }
    if (attrs?.type === 'array') {
      return value?.map((item: any) => item ?? placeholder ?? attrs?.placeholder).join('/')
    }
    return value ?? placeholder ?? attrs?.placeholder
  }

  /**
   * 合并最终内容构建react node
   */
  const mergeContent = (content: ReactNode[], separator?: string, placeholder?: string) => {
    return content?.map((item, index) => {
      const value = item ?? placeholder
      return separator === 'newLine' ? (
        <p key={uniqueId()}>{value}</p>
      ) : (
        <Fragment key={uniqueId()}>
          {value}
          {index === content.length - 1 ? null : separator}
        </Fragment>
      )
    })
  }

  /**
   * 创建内部数据合并
   */
  const createInnerNode = (params: IRenderParams) => {
    const { value, attrs, children } = params
    let content: ReactNode = value
    const placeholder = attrs?.merge?.placeholder
    const separator = attrs?.merge?.separator
    let strArr: ReactNode[] = []
    // 数组
    if (attrs?.type === 'array') {
      const values: string[] = value.map((item: any) => item ?? placeholder)
      const title = values.join(separator === 'newLine' ? ' ' : separator)
      if (separator === 'newLine') {
        return (
          <div title={title}>
            {values.map(item => (
              <p>{item}</p>
            ))}
          </div>
        )
      } else {
        return <p title={title}>{title}</p>
      }
    }
    // 对象
    if (attrs?.type === 'object') {
      attrs.merge?.fields?.forEach((key, i) => {
        const currentAttrs = children?.find(item => item?.aliasKey === key || item?.key === key)
        const realKey = currentAttrs?.key
        if (!realKey) return
        strArr.push(
          getWidgetValue({
            value: value?.[realKey],
            record: value,
            index: i,
            attrs: currentAttrs,
            placeholder,
          }),
        )
      })
    }
    if (!strArr.length) {
      return attrs?.placeholder
    }
    content = <>{mergeContent(strArr, separator, placeholder)}</>
    return content
  }

  /**
   * 创建外部合并数据
   */
  const createOuterNode = (params: IRenderParams) => {
    const { record, index, attrs, children } = params
    let content: ReactNode[] = []
    // 递归合并子字段的子合并项
    ;(function getNode(allParams: IRenderParams) {
      allParams.attrs?.merge?.fields?.forEach(key => {
        const i = children?.findIndex(item => item.aliasKey === key || item.key === key)
        if (!i && i !== 0) return
        const currentAttrs = children?.[i]
        const realKey = currentAttrs?.key
        if (currentAttrs?.merge?.scope === 'inner') {
          content.push(createInnerNode({ ...allParams, children }))
        }
        if (realKey) {
          if (currentAttrs?.merge?.scope === 'outer') {
            getNode({
              value: record?.[realKey],
              record,
              index,
              attrs: currentAttrs,
            })
          }
          if (!currentAttrs?.merge) {
            content.push(
              getWidgetValue({
                value: record?.[realKey],
                record,
                index,
                attrs: currentAttrs,
                placeholder: currentAttrs.merge?.placeholder,
              }),
            )
          }
        }
      })
    })(params)
    return <>{mergeContent(content, attrs?.merge?.separator, attrs?.merge?.placeholder)}</>
  }

  /**
   * 字段合并
   */
  const getMergeRender = (params: IRenderParams) => {
    const { value, attrs } = params
    let content: ReactNode = value
    // 合并内部数据结构
    if (attrs?.merge?.scope === 'inner') {
      content = createInnerNode(params)
    }
    // 合并外部字段数据
    if (attrs?.merge?.scope === 'outer') {
      content = createOuterNode(params)
    }
    return toolTip(content)
  }

  const getEnumValues = (value: any, enumValues?: AnyObject, placeholder?: string) => {
    const val = enumValues?.[value] ?? placeholder
    return toolTip(val)
  }

  /**
   * 构造列参数
   */
  const getColumns = (rootSchema: TableSchemaObject) => {
    const cache: TableColumnType<any>[] = []
    const children = rootSchema?.children || []
    const newChildren = children.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    let cacheCell = false
    newChildren.forEach(item => {
      if (!item?.visible || !item?.order) return
      const placeholder = item?.placeholder
      const value: TableColumnType<any> = {
        dataIndex: item.key,
        title: item.name,
        width: item?.width,
        fixed: item?.fixed as any,
        sorter: item?.sorter,
      }
      if (!item?.widget && !item?.merge?.scope) {
        value.ellipsis = true
      }
      value.render = (val: any, record: AnyObject, index: number) =>
        getWidgetValue({
          value: val,
          record,
          index,
          attrs: item,
          placeholder,
        })
      // 自定义渲染组件
      if (!item?.widget) {
        if (item?.enumValues) {
          value.render = (val: any) => getEnumValues(val, item?.enumValues, placeholder)
        }
        if (item?.merge?.scope) {
          value.render = (val: any, record: AnyObject, index: number) =>
            getMergeRender({
              value: val,
              record,
              index,
              attrs: item,
              children: newChildren,
            })
        }
      }
      // if (item?.sorter) {
      //   const keys = getSortKeys(item, children)
      //   value.sorter = sortData(keys)
      // }
      // 表格行合并展示
      if (item?.cell && item?.key) {
        cacheCell = true
        value.onCell = onCell(item.cell, item.key)
      }
      // 表头提示
      if (item?.tip) {
        value.title = <TipTitle title={item?.name} tip={item?.tip} />
      }
      // 自定义表头
      if (item?.titleWidget) {
        value.title = (params: any) => getTitleWidgetValue({ ...params, attrs: item })
      }
      cache.push(value)
    })
    setIsCell(cacheCell)
    return cache
  }

  useEffect(() => {
    let cache: TableColumnType<any>[] = []
    if (schema?.children?.length) {
      cache = getColumns(schema)
    }
    setColumns(cache)
  }, [schema])

  // 分页参数兼容
  let pagination: any = tableProps?.pagination
  if (schema?.page) {
    pagination = { ...tableProps.pagination, pageSize: schema?.pageSize }
  } else {
    pagination = false
  }

  // 合并表格前数据处理
  let dataSource = tableProps?.dataSource || []
  if (isCell) {
    dataSource = parseDataToRowSpan(dataSource, schema?.cellKeys)
  }

  let cols = [...columns]
  if (operation) {
    cols = [...cols, operation]
  }

  return <Table bordered {...tableProps} dataSource={dataSource} columns={cols} pagination={pagination} />
}

export default TableRender
