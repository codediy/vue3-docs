## 功能说明
> 导出到全局的内部接口
- PublicApi    Vue级别接口
- AdvancedApi  VNode级别接口
- Types        类型相关
## PublicApi
> Vue级别的
```ts
export { createComponent } from './apiCreateComponent'
export { nextTick } from './scheduler'
export * from './apiReactivity'  
export * from './apiWatch'
export * from './apiLifecycle'
export * from './apiInject'
```

## AdvancedApi
> VNode级别
```ts

export { h } from './h'
export {
  createVNode,
  cloneVNode,
  mergeProps,
  openBlock,
  createBlock
} from './vnode'

export { Text, Comment, Fragment, Portal, Suspense } from './vnode'

export { PublicShapeFlags as ShapeFlags } from './shapeFlags'
export { PublicPatchFlags as PatchFlags } from '@vue/shared'

export { getCurrentInstance } from './component'

export { createRenderer } from './createRenderer'
export {
  handleError,
  callWithErrorHandling,
  callWithAsyncErrorHandling
} from './errorHandling'

export { applyDirectives } from './directives'
export { resolveComponent, resolveDirective } from './helpers/resolveAssets'
export { renderList } from './helpers/renderList'
export { toString } from './helpers/toString'
export { toHandlers } from './helpers/toHandlers'
export { renderSlot } from './helpers/renderSlot'
export { createSlots } from './helpers/createSlots'
export { capitalize, camelize } from '@vue/shared'


export { registerRuntimeCompiler } from './component'
```

## Types
> 类型级别
```ts
export { App, AppConfig, AppContext, Plugin } from './apiApp'
export { RawProps, RawChildren, RawSlots } from './h'
export { VNode, VNodeTypes } from './vnode'
export {
  Component,
  FunctionalComponent,
  ComponentInternalInstance,
  RenderFunction
} from './component'
export {
  ComponentOptions,
  ComponentOptionsWithoutProps,
  ComponentOptionsWithProps,
  ComponentOptionsWithArrayProps
} from './apiOptions'

export { ComponentPublicInstance } from './componentProxy'
export { RendererOptions } from './createRenderer'
export { Slot, Slots } from './componentSlots'
export { Prop, PropType, ComponentPropsOptions } from './componentProps'
export {
  Directive,
  DirectiveBinding,
  DirectiveHook,
  DirectiveArguments
} from './directives'
export { SuspenseBoundary } from './suspense'
```