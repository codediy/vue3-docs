## computed()
``` 
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {}
```
- 注册一个响应式的回调
``` 
let getter: ComputedGetter<T>
let setter: ComputedSetter<T>

if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
} else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
}
```
- getter/setter的设置

``` 
let dirty = true
let value: T
let computed: ComputedRef<T>
```

``` 
const runner = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (!dirty) {
        dirty = true
        trigger(computed, TriggerOpTypes.SET, 'value')
      }
    }
})
```
- 创建回调函数

``` 
computed = {
    __v_isRef: true,
    [ReactiveFlags.IS_READONLY]:
      isFunction(getterOrOptions) || !getterOrOptions.set,
    
    // expose effect so computed can be stopped
    effect: runner,
    get value() {
      if (dirty) {
        value = runner()
        dirty = false
      }
      track(computed, TrackOpTypes.GET, 'value')
      return value
    },
    set value(newValue: T) {
      setter(newValue)
    }
} as any
return computed
```
- 返回创建的computed
