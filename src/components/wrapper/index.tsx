import React, { FC, ReactNode } from 'react'
import zhCN from 'antd/es/locale/zh_CN'
import { Locale } from 'antd/es/locale-provider'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/vi'
import 'dayjs/locale/th'
import { ConfigProvider } from 'antd'

interface IProps {
  locale?: Locale
  children?: ReactNode
}

const Wrapper: FC<IProps> = props => {
  const { locale, children } = props
  return <ConfigProvider locale={locale ?? zhCN}>{children}</ConfigProvider>
}

export default Wrapper
