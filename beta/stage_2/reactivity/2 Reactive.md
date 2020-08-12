## reactive
``` 
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```
- 对象/数组创建响应式数据

## 其他转换方法
- shallowReactive
- readonly
- shallowReadonly





## 关键数据
``` 
const collectionTypes = new Set<Function>([Set, Map, WeakMap, WeakSet])
const isObservableType = /*#__PURE__*/ makeMap(
  'Object,Array,Map,Set,WeakMap,WeakSet'
)
```
- 可以被观察的集合数据类型

``` 
type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp
```
- 简单数据类型


## createReactiveObject
``` 
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {}
```
- 创建响应式数据

```
if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
}
```
- 简单值直接返回


``` 
if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
}
```
- Proxy类型


``` 
const reactiveFlag = isReadonly
    ? ReactiveFlags.READONLY
    : ReactiveFlags.REACTIVE
if (hasOwn(target, reactiveFlag)) {
    return target[reactiveFlag]
}
```
- 返回标记为的缓存

``` 
if (!canObserve(target)) {
    return target
}
```
- 是否可以被观察

``` 
const observed = new Proxy(
    target,
    collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers
)
```
- 创建Proxy代理

``` 
def(target, reactiveFlag, observed)
```
- 缓存Proxy代理到reactiveFlag

``` 
 return observed
```
- 返回响应对象


## 其他辅助函数
- isReactive
- isReadonly
- isProxy
- toRaw
- markRaw

