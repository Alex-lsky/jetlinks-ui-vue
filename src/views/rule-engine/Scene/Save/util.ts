import { queryBuiltInParams } from '@/api/rule-engine/scene'
import { handleParamsData } from './components/Terms/util'
import { useSceneStore } from 'store/scene'
import { storeToRefs } from 'pinia'
import type { FormModelType } from '@/views/rule-engine/Scene/typings'
import { isArray } from 'lodash-es'

interface Params {
  branch: number
  branchGroup: number
  action: number
}

export const getParams = (params: Params, sceneModel: FormModelType): Promise<any[]> => {
  return new Promise(res => {
    const data = sceneModel.branches!.filter(item => !!item)
    queryBuiltInParams({
      ...sceneModel,
      branches: data
    }, params).then(resp => {
      if (resp.success) {
        res(resp.result as any[])
      }
    })
  })
}

/**
 * @param params
 */
export const useParams = (params: Params) => {
  const sceneStore = useSceneStore()
  const { data: formModel } = storeToRefs(sceneStore)
  const columnOptions = ref<any[]>([])

  const handleParams = async () => {
    const _data = await getParams(params, formModel.value)
    columnOptions.value = handleParamsData(_data, 'id')
  }

  watchEffect(() => {
    if (formModel.value.branches![params.branch].then[params.branchGroup].actions[params.action]) {
      handleParams()
    }
  })

  return {
    columnOptions
  }
}

export const DeviceEmitterKey = 'device_rules'

/**
 * 发布keys
 * @param params
 * @constructor
 */
export const EventEmitterKeys = (params: Params): string => {
  const _b = `branches_${params.branch}` // branchesName
  const _t = `then_${params.branchGroup}` // thenName
  const _a = `then_${params.action}` // actionName
  return `${_b}_${_t}_${_a}`
}

/**
 * 订阅keys
 * @param params
 * @constructor
 */
export const EventSubscribeKeys = (params: Params): string[] => {
  let keys: string[] = []

  if (params.action === 0) {
    keys.push(DeviceEmitterKey)
  }

  for (let i = 0; i <= params.action; i++) {
    const _b = `branches_${params.branch}` // branchesName
    const _t = `then_${params.branchGroup}` // thenName
    const _a = `then_${i}` // actionName
    keys.push(`${_b}_${_t}_${_a}`)
  }

  return keys
}

export const EventEmitter = {
  list: {},
  subscribe: function(events: string[], fn: Function) {
    const list = this.list
    events.forEach(event => {
      (list[event] || (list[event] = [])).push(fn)
    })
    return this
  },
  emit: function(events:string, data?: any) {
    const list = this.list
    const fns: Function[] = list[events] ? [...list[events]] : []

    if (!fns.length) return false;

    fns.forEach(fn => {
      fn(data)
    })

    return this
  },
  unSubscribe: function(events:string[], fn: Function) {
    const list = this.list
    events.forEach(key => {
      if (key in list) {
        const fns = list[key]
        for (let i = 0; i < fns.length; i++) {
          if (fns[i] === fn) {
            fns.splice(i, 1)
            break;
          }
        }
      }
    })
    return this
  }
}
