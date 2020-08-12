## ref
``` 
export function ref(value?: unknown) {
  return createRef(value)
}
```
- 简单值转换为响应对象

## 其他转换方法
- shallowRef

## createRef
``` 
function createRef(rawValue: unknown, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue
  }
  let value = shallow ? rawValue : convert(rawValue)
  const r = {
    __v_isRef: true,
    get value() {
      track(r, TrackOpTypes.GET, 'value')
      return value
    },
    set value(newVal) {
      if (hasChanged(toRaw(newVal), rawValue)) {
        rawValue = newVal
        value = shallow ? newVal : convert(newVal)
        trigger(r, TriggerOpTypes.SET, 'value', newVal)
      }
    }
  }
  return r
}
```
- 核心转换方法
- 首先检查是否Ref 如果是直接返回
- 将rawValue转换为响应式对象 `convert(rawValue)`
- 创建get,set代理 `const r = {}`

## 辅助函数
- triggerRef
- unref
- proxyRefs
- customRef
- toRefs
- toRef