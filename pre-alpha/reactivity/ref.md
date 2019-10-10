## 功能说明
> 

## 类型接口
### Ref
> 引用类型
```ts
export interface Ref<T = any> {
  [refSymbol]: true
  value: UnwrapNestedRefs<T>
}
```
### UnwrapNestedRefs
> 解引用类型
```ts
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>
```
### BailTypes
```ts
type BailTypes =
  | Function
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
```
### UnwrapRef
```ts
export type UnwrapRef<T> = {
  ref: T extends Ref<infer V> ? UnwrapRef<V> : T
  array: T extends Array<infer V> ? Array<UnwrapRef<V>> : T
  object: { [K in keyof T]: UnwrapRef<T[K]> }
  stop: T
}[T extends Ref
  ? 'ref'
  : T extends Array<any>
    ? 'array'
    : T extends BailTypes
      ? 'stop' // bail out on types that shouldn't be unwrapped
      : T extends object ? 'object' : 'stop']

```
## 实例对象
### refSymbol
> 引用标记
```ts
export const refSymbol = Symbol(__DEV__ ? 'refSymbol' : undefined)

```
## 功能函数
### ref
> 转换带有Ref标记的响应对象
```ts
export function ref<T>(raw: T): Ref<T> {
  raw = convert(raw)
  const v = {
    [refSymbol]: true,
    get value() {
      track(v, OperationTypes.GET, '')
      return raw
    },
    set value(newVal) {
      raw = convert(newVal)
      trigger(v, OperationTypes.SET, '')
    }
  }
  return v as Ref<T>
}
```
### isRef
> 是否带有引用标记
```ts
export function isRef(v: any): v is Ref {
  return v ? v[refSymbol] === true : false
}
```
### toRefs
>
```ts
export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {}
  for (const key in object) {
    ret[key] = toProxyRef(object, key)
  }
  return ret
```
## 内部函数
### conver
> 转换为响应对象
```ts
const convert = (val: any): any => (isObject(val) ? reactive(val) : val)
```
### toProxyRef
```ts
function toProxyRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  const v = {
    [refSymbol]: true,
    get value() {
      return object[key]
    },
    set value(newVal) {
      object[key] = newVal
    }
  }
  return v as Ref<T[K]>
}
```