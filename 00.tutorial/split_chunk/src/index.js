// 引入 lodash
import { cloneDeep } from 'lodash'
import { now } from './moment'

const obj = {}

console.log(cloneDeep(obj))
console.log(now())
