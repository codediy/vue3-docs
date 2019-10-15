# 功能说明
> computedApi

## 类型接口
### computed
> computed类型
```ts
export function computed<T>(getter: () => T): ComputedRef<T>
export function computed<T>(options: WritableComputedOptions<T>): Ref<T>
```
## 功能函数
### computed
> 注册computed
```ts
export function computed<T>(getterOrOptions: any) {
  const c = _computed(getterOrOptions)
  recordEffect(c.effect)
  return c
}
```