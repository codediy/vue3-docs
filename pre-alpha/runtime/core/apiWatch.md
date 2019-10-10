# 功能
> watchApi接口
## 类型接口
### WatchOptions
> Watch参数类型
```ts
export interface WatchOptions {
  lazy?: boolean
  flush?: 'pre' | 'post' | 'sync'
  deep?: boolean
  onTrack?: ReactiveEffectOptions['onTrack']
  onTrigger?: ReactiveEffectOptions['onTrigger']
}
```
### CleanupRegistrator
>
```ts
export type CleanupRegistrator = (invalidate: () => void) => void
```

### watch
> 简单依赖回调
```ts
export function watch(effect: SimpleEffect, options?: WatchOptions): StopHandle
```
> 
```ts
export function watch<T>(
  source: WatcherSource<T>,
  cb: WatchHandler<T>,
  options?: WatchOptions
): StopHandle

```
>
```ts
export function watch<T extends WatcherSource<unknown>[]>(
  sources: T,
  cb: (
    newValues: MapSources<T>,
    oldValues: MapSources<T>,
    onCleanup: CleanupRegistrator
  ) => any,
  options?: WatchOptions
): StopHandle
```
> 其他辅助类型
```ts
type StopHandle = () => void

type WatcherSource<T = any> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

export type CleanupRegistrator = (invalidate: () => void) => void

type SimpleEffect = (onCleanup: CleanupRegistrator) => void

const invoke = (fn: Function) => fn()
```
### instanceWatch
> 注册watch
```ts
export function instanceWatch(
  this: ComponentInternalInstance,
  source: string | Function,
  cb: Function,
  options?: WatchOptions
): () => void {
  const ctx = this.renderProxy!
  const getter = isString(source) ? () => ctx[source] : source.bind(ctx)
  const stop = watch(getter, cb.bind(ctx), options)
  onBeforeUnmount(stop, this)
  return stop
}
```
## 实例对象
## 功能函数
### watch()
> 注册`watch`
```ts
export function watch<T = any>(
  effectOrSource: WatcherSource<T> | WatcherSource<T>[] | SimpleEffect,
  cbOrOptions?: WatchHandler<T> | WatchOptions,
  options?: WatchOptions
): StopHandle {
  if (isFunction(cbOrOptions)) {
    return doWatch(effectOrSource, cbOrOptions, options)
  } else {
    return doWatch(effectOrSource, null, cbOrOptions)
  }
}
```
## 内部函数
## doWatch
> watch回调处理
```ts
function doWatch(
  source: WatcherSource | WatcherSource[] | SimpleEffect,
  cb:
    | ((newValue: any, oldValue: any, onCleanup: CleanupRegistrator) => any)
    | null,
  { lazy, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): StopHandle {
    ...
}
```

## traverse
> 递归遍历
```ts
function traverse(value: any, seen: Set<any> = new Set()) {
  if (!isObject(value) || seen.has(value)) {
    return
  }
  seen.add(value)
  if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (value instanceof Map) {
    value.forEach((v, key) => {
      traverse(value.get(key), seen)
    })
  } else if (value instanceof Set) {
    value.forEach(v => {
      traverse(v, seen)
    })
  } else {
    for (const key in value) {
      traverse(value[key], seen)
    }
  }
  return value
}
```