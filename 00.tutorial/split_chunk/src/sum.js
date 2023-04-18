// 引入 lodash
import { delay } from 'lodash'

function sum(a, b) {
  return a + b
}

// 一秒后执行 sum
delay(sum, 1000, 1, 2)

export default sum
