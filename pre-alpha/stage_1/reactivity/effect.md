# 功能说明
> 依赖回调类型
## 类型接口
### ReactiveEffect
> 依赖回调类型
```ts
export interface ReactiveEffect<T = any> {
  (): T
  [effectSymbol]: true
  active: boolean
  raw: () => T
  deps: Array<Dep>
  computed?: boolean
  scheduler?: (run: Function) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}
```
### ReactiveEffectOptions
> 依赖回调参数类型
```ts
export interface ReactiveEffectOptions {
  lazy?: boolean
  computed?: boolean
  scheduler?: (run: Function) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
}
```
### DebuggerEvent
> 调试事件类型
```ts
export interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```

## 实例对象
### effectSymbol
> effect符号标记
```ts
export const effectSymbol = Symbol(__DEV__ ? 'effect' : void 0)
```
### activeReactiveEffectStack
> effect待处理依赖回调
```ts
export const activeReactiveEffectStack: ReactiveEffect[] = []
```
### ITERATE_KEY
> 迭代器符号标记
```ts
export const ITERATE_KEY = Symbol('iterate')
```
### shouldTrack
> 是否进行依赖收集
```ts
let shouldTrack = true
```
## 功能函数

### isEffect
> 函数是否是依赖回调类型
```ts
export function isEffect(fn: any): fn is ReactiveEffect {
  return fn != null && fn[effectSymbol] === true
}
```
### effect
> 注册依赖回调
```ts
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
### stop
> 停止依赖回调执行
```ts
export function stop(effect: ReactiveEffect) {
  if (effect.active) {
    cleanup(effect)
    if (effect.onStop) {
      effect.onStop()
    }
    effect.active = false
  }
}
```
### pauseTracking
>
```ts
export function pauseTracking() {
  shouldTrack = false
}
```
### resumeTracking
> 重启依赖收集
```ts
export function resumeTracking() {
  shouldTrack = true
}
```
### track
> 依赖收集
```ts
export function track(
  target: any,
  type: OperationTypes,
  key?: string | symbol
) {
  if (!shouldTrack) {
    return
  }
  const effect = activeReactiveEffectStack[activeReactiveEffectStack.length - 1]
  if (effect) {
    if (type === OperationTypes.ITERATE) {
      key = ITERATE_KEY
    }
    let depsMap = targetMap.get(target)
    if (depsMap === void 0) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key!)
    if (dep === void 0) {
      depsMap.set(key!, (dep = new Set()))
    }
    if (!dep.has(effect)) {
      dep.add(effect)
      effect.deps.push(dep)
      if (__DEV__ && effect.onTrack) {
        effect.onTrack({
          effect,
          target,
          type,
          key
        })
      }
    }
  }
}
```
### trigger
> 调用依赖回调
```ts
export function trigger(
  target: any,
  type: OperationTypes,
  key?: string | symbol,
  extraInfo?: any
) {
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    // never been tracked
    return
  }
  const effects = new Set<ReactiveEffect>()
  const computedRunners = new Set<ReactiveEffect>()
  if (type === OperationTypes.CLEAR) {
    // collection being cleared, trigger all effects for target
    depsMap.forEach(dep => {
      addRunners(effects, computedRunners, dep)
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      addRunners(effects, computedRunners, depsMap.get(key))
    }
    // also run for iteration key on ADD | DELETE
    if (type === OperationTypes.ADD || type === OperationTypes.DELETE) {
      const iterationKey = Array.isArray(target) ? 'length' : ITERATE_KEY
      addRunners(effects, computedRunners, depsMap.get(iterationKey))
    }
  }
  const run = (effect: ReactiveEffect) => {
    scheduleRun(effect, target, type, key, extraInfo)
  }
  // Important: computed effects must be run first so that computed getters
  // can be invalidated before any normal effects that depend on them are run.
  computedRunners.forEach(run)
  effects.forEach(run)
}
```
## 内部函数

### createReactiveEffect
> 初始依赖回调
```ts
function createReactiveEffect<T = any>(
  fn: () => T,
  options: ReactiveEffectOptions
): ReactiveEffect<T> {
  const effect = function reactiveEffect(...args: any[]): any {
    return run(effect, fn, args)
  } as ReactiveEffect
  effect[effectSymbol] = true
  effect.active = true
  effect.raw = fn
  effect.scheduler = options.scheduler
  effect.onTrack = options.onTrack
  effect.onTrigger = options.onTrigger
  effect.onStop = options.onStop
  effect.computed = options.computed
  effect.deps = []
  return effect
}
```
### run
> 注册依赖回调
```ts
function run(effect: ReactiveEffect, fn: Function, args: any[]): any {
  if (!effect.active) {
    return fn(...args)
  }
  if (activeReactiveEffectStack.indexOf(effect) === -1) {
    cleanup(effect)
    try {
      activeReactiveEffectStack.push(effect)
      return fn(...args)
    } finally {
      activeReactiveEffectStack.pop()
    }
  }
}
```
### cleanup
> 清空依赖回调
```ts
function cleanup(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}
```
### addRunners
> 注册依赖收集
```ts
function addRunners(
  effects: Set<ReactiveEffect>,
  computedRunners: Set<ReactiveEffect>,
  effectsToAdd: Set<ReactiveEffect> | undefined
) {
  if (effectsToAdd !== void 0) {
    effectsToAdd.forEach(effect => {
      if (effect.computed) {
        computedRunners.add(effect)
      } else {
        effects.add(effect)
      }
    })
  }
}
```
### scheduleRun
> 依赖收集执行
```ts
function scheduleRun(
  effect: ReactiveEffect,
  target: any,
  type: OperationTypes,
  key: string | symbol | undefined,
  extraInfo: any
) {
  if (__DEV__ && effect.onTrigger) {
    effect.onTrigger(
      extend(
        {
          effect,
          target,
          key,
          type
        },
        extraInfo
      )
    )
  }
  if (effect.scheduler !== void 0) {
    effect.scheduler(effect)
  } else {
    effect()
  }
}
```