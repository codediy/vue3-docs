## 核心
- effect()创建副作用回调
- track()     在effect()首次读取数据的时候注册数据的依赖回调
- trigger()   在数据变动的时候 调用track()注册的依赖回调

## effect
``` 
export function effect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {
  if (isEffect(fn)) {
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}
```
- 将一个不接受参数的副作用函数转换为依赖数据的回调函数
- 首次检查是否依赖数据回调函数，如果是则返回缓存的回调effect
- 调用createReactiveEffect()创建effect
- 首次执行effect()注册数据依赖
- 返回创建的effect对象

## createReactiveEffect
``` 
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {}
```
- 创建依赖回调的核心实现

``` 
const effect = function reactiveEffect(): unknown {
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
} as ReactiveEffect
```
- 生成的effect函数 

- 缓存当前effect, effectStack.push(effect)
- 设置当前激活的effect,activeEffect = effect
- 执行函数fn()，在读取值的时候触发了track,注册为依赖
``` 
effect.id = uid++
effect._isEffect = true
effect.active = true
effect.raw = fn
effect.deps = []
effect.options = options
```
- 附加给effect的属性
- raw 表示原生函数

## track
- 注册依赖
``` 
export function track(target: object, type: TrackOpTypes, key: unknown) {}
```
- 在ProxyHandlers的get里面注册数据的依赖
``` 
let depsMap = targetMap.get(target)
if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
}
let dep = depsMap.get(key)
if (!dep) {
    depsMap.set(key, (dep = new Set()))
}
```
- targetMap = new WeakMap<any, KeyToDepMap>()
- targetMap = {
    target:{
        {
            key:Set<ReactiveEffect>
        }
    }
}
- 读取targetMap中缓存的依赖信息 
``` 
if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
}
```
- 添加当前activeEffect到dep中
- activeEffect在effect()创建的时候设置了
- 这样在targetMap中就可以根据`[target,key]`查找到ReactiveEffect
- 最后如果带有onTrack的debug回调，则调用effect的options.onTrack
- 这个流程在effect()的创建时候触发的。

## trigger
- 数据变化的时候调用注册的依赖信息
``` 
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {}
```
``` 
const depsMap = targetMap.get(target)
if (!depsMap) {
    // never been tracked
    return
}
const effects = new Set<ReactiveEffect>()
```
- 声明一个`[target,key]`对应的effects的空集合
``` 
const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => effects.add(effect))
    }
}
```
- 添加effect到上面声明的集合中

``` 
if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
} else if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
        if (key === 'length' || key >= (newValue as number)) {
            add(dep)
        }
    })
} else {}
```
- CLEAR 添加所有effect
- length参数，则添加对应的dep
``` 
if (key !== void 0) {
  add(depsMap.get(key))
}
```
- 其他情况SET/ADD/DELETE

``` 
const isAddOrDelete =
  type === TriggerOpTypes.ADD ||
  (type === TriggerOpTypes.DELETE && !isArray(target))
if (
  isAddOrDelete ||
  (type === TriggerOpTypes.SET && target instanceof Map)
) {
  add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY))
}
if (isAddOrDelete && target instanceof Map) {
  add(depsMap.get(MAP_KEY_ITERATE_KEY))
}
```
- Map,Set的处理
``` 
const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
}
```
- 对effect的回调处理
- 如果有onTrigger的回调则调用
- 如果scheduler则添加到调度队列，否则直接调用effect
``` 
effects.forEach(run)
```
- 遍历所有的effects进行回调





















