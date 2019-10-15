# 功能说明
> 生命周期接口
> 添加生命周期到实例

## 类型接口
## 功能函数
### onBeforeMount
> 添加BEFORE_MOUNT的hook函数
```ts
export function onBeforeMount(
  hook: Function,
  target: ComponentInternalInstance | null = currentInstance
) {
  injectHook(LifecycleHooks.BEFORE_MOUNT, hook, target)
}
```
### onMounted

### onBeforeUpdate

### onUpdated

### onBeforeUnmount

### onUnmounted

### onRenderTriggered

### onRenderTracked

### onErrorCaptured

## 内部函数
### injectHook
> 添加带有异常处理调用hook函数
```ts
function injectHook(
  type: LifecycleHooks,
  hook: Function,
  target: ComponentInternalInstance | null
) {
    ...
}
```