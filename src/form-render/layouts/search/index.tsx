import { Card, SearchFormLayout } from '@fruits-chain/react-bailu'
import { Button, Form, FormInstance, Tooltip } from 'antd'
import React, { Children, FC, ReactNode } from 'react'
import { AnyObject } from '../../../types'

export interface IProps {
  name?: string
  children?: ReactNode
  form: FormInstance<any>
  rootData: AnyObject
  onValuesChange: (changeValues: AnyObject, allValues: AnyObject) => void
  setDefault?: (rootData: AnyObject) => void
  setQuery?: () => void
  onReset?: () => void
  onSubmit?: () => void
}

const Search: FC<IProps> = props => {
  const { name, form, onReset, onValuesChange, children, setDefault, setQuery, rootData, onSubmit } = props

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
            {setDefault ? (
              <Form.Item>
                <Tooltip title="记录当前页面的查询条件和内容，下次进入时自动应用">
                  <Button onClick={() => setDefault(rootData)}>设为默认</Button>
                </Tooltip>
              </Form.Item>
            ) : null}
            {setQuery ? (
              <Form.Item>
                <Button onClick={setQuery}>查询设置</Button>
              </Form.Item>
            ) : null}
          </SearchFormLayout.Space>
        </SearchFormLayout.Row>
      </Form>
    </Card>
  )
}

export default Search
