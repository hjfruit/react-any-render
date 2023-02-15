import { gql } from '@apollo/client'
import { AsyncSelect } from '@fruits-chain/react-bailu'
import { isEqual } from 'lodash'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { AnyObject, GraphqlObject } from '../../../types'
import { selectFilterOption } from '../../../utils'

export interface IProps {
  value?: string | number
  rootData: AnyObject
  onChange?: (value?: any) => void
  graphql?: GraphqlObject
  readOnly?: boolean
  props?: AnyObject
}

const FormAsyncSelect: FC<IProps> = props => {
  const { value, onChange, readOnly, graphql, rootData } = props
  const [params, setParams] = useState()

  useEffect(() => {
    let newParams = graphql?.singleParam
    if (!newParams && graphql?.params?.length) {
      newParams = {}
      graphql.params.forEach((key: any) => {
        newParams[key] = rootData?.[key]
      })
    }
    if (!isEqual(newParams, params) && params && onChange) {
      onChange(undefined)
    }
    setParams(newParams)
  }, [rootData, graphql])

  return (
    <AsyncSelect
      allowClear
      showArrow
      showSearch
      filterOption={selectFilterOption}
      onChange={onChange}
      disabled={readOnly}
      value={value}
      remote={{
        gql: gql`
          ${graphql?.gql}
        `,
        gqlKey: graphql?.interfaceName ?? '',
        extraParams: params ? params : undefined,
      }}
      {...(props?.props ?? {})}
    />
  )
}

export default FormAsyncSelect
