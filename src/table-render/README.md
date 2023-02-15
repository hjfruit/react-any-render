# TableRender

> table 表格渲染组件

## Schema

```ts
interface TableSchemaObject {
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
  children: {
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
    merge?: {
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
  }[]
}
```

### 合并配置解析

## TableRender Props 属性

```ts
interface IProps extends TableProps<any> {
  // Schema 对象
  schema: TableSchemaObject
  // 操作栏，配置同 antd table column
  operation?: TableColumnType<any>
  // 自定义组件，同名时覆盖内部组件
  widgets?: {
    [key: string]: (params: IRenderParams) => any
  }
}

// 组件传递参数
export interface IRenderParams {
  // 当前字段值
  value: any
  // 当前行数据
  record: AnyObject
  // 所在行位置
  index: number
  // 当前列在 Schema 中的所有属性
  attrs: TableSchemaItem
}
```

## 内部组件

- `Time` 日期组件
- `MarkTime` 拥有“预计”“实际”前缀的日期组件

## 自定义组件

**函数形式**

```ts
const time = (params: IRenderParams) => {
  if (!params?.value) return
  return getTime({ time: params.value, format: params.attrs?.format })
}

export default time
```

**组件形式**

1. 无需外部数据传入时，直接导出组件并传入 `TableRender`

```tsx
interface IProps extends IRenderParams {}

const CustomComponent: FC<IProps> = props => {
  return <div>{props.value}</div>
}

export default CustomComponent
```

2. 需要外部数据传入时，创建函数处理数据后，在传入。例子见使用方法。

## 使用方法

```tsx
import { TableRender } from 'react-any-render'
import { StatusChanger } from '../components'

const Example = () => {
  ...
  const statusChanger = ({ value, record }: IRenderParams) => {
    return (
      <StatusChanger
        checkedChildren="靠泊"
        unCheckedChildren="未靠泊"
        checked={StateValueMap[value] || false}
        onConfirm={(callback, checked) => handleChangeStatus(callback, record as any, checked)}
      />
    )
  }
  ...

  // tableProps 为 antd table props 所有属性，TableRender 不做处理直接透传
  return <TableRender schema={schema} widgets={{ statusChanger }} {...tableProps} />
}
```
