# 功能说明
> 代理对象操作类型
## 类型接口
### Dep
> 依赖类型
```ts
export type Dep = Set<ReactiveEffect>
```
### KeyToDepMap
> Key的依赖类型
```ts
export type KeyToDepMap = Map<string | symbol, Dep>
```
### reactive
> 创建响应对象
```ts
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```
## 实例对象
### targetMap
> target的依赖回调缓存
```ts
export const targetMap = new WeakMap<any, KeyToDepMap>()
```
### rawToReactive
> raw->reactive转换缓存
```ts
const rawToReactive = new WeakMap<any, any>()
```
### reactiveToRaw
> reactive->raw转换缓存
```ts
const reactiveToRaw = new WeakMap<any, any>()
```
### rawToReadonly
> raw->readonly转换缓存
```ts
const rawToReadonly = new WeakMap<any, any>()
```
### readonlyToRaw
> readonly->raw转换缓存
```ts
const readonlyToRaw = new WeakMap<any, any>()
```
### readonlyValues
```ts
const readonlyValues = new WeakSet<any>()
```
### nonReactiveValues
```ts
const nonReactiveValues = new WeakSet<any>()
```
## 功能函数
### reactive
> 转换对象为响应代理
```ts
export function reactive(target: object) {
    if (readonlyToRaw.has(target)) {
        return target
    }

    if (readonlyValues.has(target)) {
        return readonly(target)
    }

    //创建响应对象
    return createReactiveObject(
        target,//目标对象
        rawToReactive, //响应代理缓存WeakMap
        reactiveToRaw, //响应代理缓存WeakMap
        mutableHandlers, //Proxy回调
        mutableCollectionHandlers //Proxy回调
    )
}
```
### readonly
> 创建`readonly`代理
```ts
export function readonly<T extends object>(
  target: T
): Readonly<UnwrapNestedRefs<T>> {
    if (reactiveToRaw.has(target)) {
        target = reactiveToRaw.get(target)
    }

    return createReactiveObject(
        target, //目标对象
        rawToReadonly, //只读代理缓存WeakMap
        readonlyToRaw, //只读代理缓存WeakMap
        readonlyHandlers, //Proxy回调
        readonlyCollectionHandlers //Proxy回调
    )
}    
```
### isReactive
> 判断是否`Reactive`代理对象
```ts
export function isReactive(value: any): boolean {
  return reactiveToRaw.has(value) || readonlyToRaw.has(value)
}
```
### isReadonly
> 判断是否`Readonly`代理对象
```ts
export function isReadonly(value: any): boolean {
  return readonlyToRaw.has(value)
}

```
### toRaw
> 转换为Raw
```ts
export function toRaw<T>(observed: T): T {
  return reactiveToRaw.get(observed) || readonlyToRaw.get(observed) || observed
}
```
### markReadonly
> 标记为只读
```ts
export function markReadonly<T>(value: T): T {
  readonlyValues.add(value)
  return value
}
```
### markNonReactive
> 标记为不响应
```ts
export function markNonReactive<T>(value: T): T {
  nonReactiveValues.add(value)
  return value
}
```
## 内部函数
### canObserve
> 检查是否响应对象
```ts
const canObserve = (value: any): boolean => {
  return (
    !value._isVue &&
    !value._isVNode &&
    observableValueRE.test(toTypeString(value)) &&
    !nonReactiveValues.has(value)
  )
}
```
### createReactiveObject
> 创建响应对象
```ts
function createReactiveObject(
  target: any,
  toProxy: WeakMap<any, any>,
  toRaw: WeakMap<any, any>,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  //Object类型检查
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  
  //检查是否已注册响应
  let observed = toProxy.get(target)
  if (observed !== void 0) {
    return observed
  }
 
  if (toRaw.has(target)) {
    return target
  }
  
  if (!canObserve(target)) {
    return target
  }

  //Proxy代理  
  const handlers = collectionTypes.has(target.constructor)
    ? collectionHandlers
    : baseHandlers
  observed = new Proxy(target, handlers)

  //缓存
  toProxy.set(target, observed)
  toRaw.set(observed, target)

  //初始化依赖回调
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }

  return observed  
}
```