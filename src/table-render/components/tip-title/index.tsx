import { InfoCircleOutlined } from '@ant-design/icons'
import { Space, Tooltip } from 'antd'
import type { FC } from 'react'
import React from 'react'

interface IProps {
  title?: string
  tip?: string
}

const TipTitle: FC<IProps> = props => {
  const { title, tip } = props
  return (
    <Space size={8}>
      {title}
      <Tooltip title={tip} placement="topLeft">
        <InfoCircleOutlined />
      </Tooltip>
    </Space>
  )
}

export default TipTitle
