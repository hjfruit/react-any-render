import { getTime } from '../../utils'
import { IRenderParams } from '../types'

export default {
  Time: (params: IRenderParams) => {
    if (!params?.value) return
    return getTime({ time: params.value, format: params.attrs?.format })
  },
  MarkTime: (params: IRenderParams) => {
    if (!params?.value) return
    return getTime({
      time: params.value,
      format: params.attrs?.format,
      label: true,
    })
  },
}
