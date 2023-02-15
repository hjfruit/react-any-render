import { gql, useQuery } from '@apollo/client'
import { TreeSelect } from 'antd'
import { get } from 'lodash'
import type { FC } from 'react'
import React from 'react'
import { AnyObject, GraphqlObject } from '../../../types'
import { getGqlParams } from '../../../utils'

export interface IProps {
  value?: string | number
  rootData: AnyObject
  onChange?: (value: string | number) => void
  defaultValue?: string | number
  graphql?: Partial<GraphqlObject>
  readOnly?: boolean
  props?: AnyObject
}

const FormAsyncTreeSelect: FC<IProps> = props => {
  const { value, rootData, onChange, defaultValue, graphql, readOnly } = props
  const { loading, data } = useQuery(
    gql`
      ${graphql?.gql}
    `,
    {
      variables: getGqlParams(graphql || {}, rootData),
    },
  )

  const treeProps = { ...(props?.props ?? {}) }

  return (
    <TreeSelect
      treeData={get(data, graphql?.interfaceName ?? '')}
      showArrow
      allowClear
      loading={loading}
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={readOnly}
      {...treeProps}
    />
  )
}

export default FormAsyncTreeSelect
