# FormRender

> Form 表单自动渲染组件

## Schema

`Schema` 是渲染表单的描述性 JSON 文件，它告诉 `FormRender`怎么去渲染组件和交互数据

Schema 类型如下：

```ts
interface FormSchemaObject {
  // 根组件 id
  id: string
  // 根组件类型
  type: string
  // 根组件渲染组件
  widget?: string
  // 根组件其他属性值
  props?: AnyObject
  // 子组件集合
  children: {
    // 子组件 id
    id: string
    // 展示顺序，数据类字段无此属性
    order?: number
    // 字段 key
    key: string
    // 字段别名 key，当多个字段 key 重复时拥有此字段
    aliasKey?: string
    // 字段名称，可编写条件表达式
    name: string
    // 字段类型 string number boolean array object
    type: string
    // 是否只读，可编写条件表达式
    readOnly?: boolean | string
    // 是否必填，可编写条件表达式
    required?: boolean | string
    // 是否隐藏，可编写条件表达式
    visible?: boolean | string
    // 渲染组件
    widget: string
    // 字段绑定后端的真实数据字段，目前只用于时间范围
    binds?: string[]
    // 数据值映射的名称，多用于下拉选择
    enumValues?: AnyObject
    // 字段的数据请求，多用于异步下拉选择
    graphql?: {
      // gql 语句
      gql: string
      // 入参包裹名称
      inputName?: string
      // 出参包裹名称
      interfaceName: string
      // 参数字段
      params?: string[]
      // 默认值
      defaultValue?: AnyObject
      // 单参数默认值
      singleParam?: any
    }
    // 字段校验规则，同 Form 的 rules
    rules?: Rule[]
    // 字段透传属性值
    props?: AnyObject
  }[]
}
```

**可编写条件表达式**

`FormRender` 通过内部暴露出表单的数据对象 `rootData`，可以编写表达式然后实现组件的联动功能，例如：

```json
// schema
// 下面schema的联动，当性别是女孩时，不显示年龄
{
  ...
  children: [
    {
      ...
      key: 'sex'
      ...
    },
    {
      ...
      key: 'age'
      visible: "{{ rootData.sex !== 'girl' }}"
      ...
    }
  ]
  ...
}

```

## FormRender Props 属性

```ts
interface IProps {
  // FromRender form 实例
  form: FormSchemaInstance
  // schema 数据
  schema: FormSchemaObject
  // 多语言包
  locale?: Locale
  // 表单名称
  name?: string
  // 自定义渲染组件，和内部渲染组件同名时，将会覆盖内部组件
  widgets?: AnyObject
  // 组件透传属性值
  widgetProps?: AnyObject
  // 自定义根渲染组件，同样会覆盖内部组件
  layouts?: AnyObject
  // 组件渲染完成钩子，初始化设置数据需要在此钩子内部
  onMount?: () => void
  // 组件数据变化钩子
  onChange?: (values?: AnyObject) => void
  // 提交表单
  onSubmit?: async () => void
  // 重置表单
  onReset?: () => void
  // 其他属性
  [key: string]: any
}
```

## 实例属性

`FormRender`采用状态内置模型管理，需要首先生成实例

`const [form] = useForm()`

```ts
interface FormSchemaInstance {
  // 获取表单数据
  getValues: () => AnyObject | undefined
  // 设置表单数据
  setValues: (values: AnyObject) => void
  // 表单验证
  validateFields: () => Promise<AnyObject>
  // 表单重置
  resetFields: () => void
}
```

## 内部根组件

- `Search` 页面表格的查询表单

## 内部渲染组件

- `Input` 当行文本
- `Select` 下拉选择
- `AsyncSelect` 异步下拉选择
- `AsyncTreeSelect` 异步树形下拉选择
- `RangeDate` 日期范围选择器

## 自定义根组件

根组件用于渲染表单包裹，可以接受的属性如下

```ts
export interface IProps {
  // 表单名称
  name?: string
  // 子组件集合
  children?: ReactNode
  // antd form 实例
  form: FormInstance<any>
  // 表单数据
  rootData: AnyObject
  // 表单数据变化
  onValuesChange: (changeValues: AnyObject, allValues: AnyObject) => void
  // 重置
  onReset: () => void
  // 提交
  onSubmit: () => void
  // 其他属性，由 FormRender 的其他属性透传
  [key: string]: any
}

// 自行编写下面的渲染组件并导出
const Search: FC<IProps> = props => {
  const { name, form, onReset, onValuesChange, children, rootData, onSubmit } = props

  return (
    <Card title={name}>
      <Form form={form} onValuesChange={onValuesChange}>
        <SearchFormLayout.Row>
          {Children.map(children, (item, index) =>
            item ? <SearchFormLayout.Col key={index}>{item}</SearchFormLayout.Col> : null,
          )}
          <SearchFormLayout.Space>
            {onSubmit ? null : (
              <Form.Item>
                <Button type="primary" onClick={onSubmit}>
                  查询
                </Button>
              </Form.Item>
            )}
            {onReset ? null : (
              <Form.Item>
                <Button type={onSubmit ? 'default' : 'primary'} onClick={onReset}>
                  重置
                </Button>
              </Form.Item>
            )}
          </SearchFormLayout.Space>
        </SearchFormLayout.Row>
      </Form>
    </Card>
  )
}

export default Search
```

## 自定义组件

自定义组件用于渲染某个表单项，接受的属性如下

```ts
export interface IProps {
  value?: string
  defaultValue?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  props?: AnyObject
  // 透传 schema props 和 widgetProps 的属性
  [key: string]: any
}

// 自定编写渲染组件并导出
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
```

## 使用方法

```ts
import { FormRender, useForm } from 'react-any-render'

const Example = () => {
  const [form] = useForm()

  const onSubmit = async () => {
    const values = await validateFields()
    await request(...)
  }

  const onReset = () => {
    form.resetFields()
  }

  const onChange = (values: AnyObject) => {
    console.log(values)
  }

  const onMount = () => {
    form.setValues({key: 'aaa'})
  }

  return (
    <FormRender
      form={form}
      schema={schema}
      widgets={{ CustomComponent }}
      layouts={{ CustomLayoutComponent }}
      onMount={onMount}
      onChange={onChange}
      onSubmit={onSubmit}
      onReset={onReset}
    />
  )
}
```

## 常见问题

### 业务中完整使用流程？

由前后端共同定义 `Schema` 文件，后端负责字段的数据部分，前端负责展示属性编辑，最终由后端将 `Schema` 存入数据库中。前端通过接口获取对应的 `Schema`，然后传入 `FormRender` 中进行渲染，以及处理后续的业务逻辑
