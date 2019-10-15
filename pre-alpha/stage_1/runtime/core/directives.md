# 功能说明
> 指令操作的类型

## 类型接口
### DirectiveBinding
> 指令类型
```ts
export interface DirectiveBinding {
  instance: ComponentPublicInstance | null
  value?: any
  oldValue?: any
  arg?: string
  modifiers?: DirectiveModifiers
}
```
### DirectiveHook
> 指令回调类型
```ts
export type DirectiveHook = (
  el: any,
  binding: DirectiveBinding,
  vnode: VNode,
  prevVNode: VNode | null
) => void
```
### Directive
> 指令生命周期
```ts
export interface Directive {
  beforeMount?: DirectiveHook
  mounted?: DirectiveHook
  beforeUpdate?: DirectiveHook
  updated?: DirectiveHook
  beforeUnmount?: DirectiveHook
  unmounted?: DirectiveHook
}
```
### DirectiveArguments
> 指令的所有参数
```ts
export type DirectiveArguments = Array<
  | [Directive]
  | [Directive, any]
  | [Directive, any, string]
  | [Directive, any, string, DirectiveModifiers]
>
```
## 功能函数
### appliDirectives
> 生成指令回调函数挂载到`VNode.prop`
```ts
export function applyDirectives(vnode: VNode, directives: DirectiveArguments) {
  const instance = currentRenderingInstance
  if (instance !== null) {
    vnode = cloneVNode(vnode)
    vnode.props = vnode.props != null ? extend({}, vnode.props) : {}
    for (let i = 0; i < directives.length; i++) {
      const [dir, value, arg, modifiers] = directives[i]
      applyDirective(vnode.props, instance, dir, value, arg, modifiers)
    }
  } else if (__DEV__) {
    warn(`applyDirectives can only be used inside render functions.`)
  }
  return vnode
}
```
### invokeDirectiveHook
> 调用指令的钩子函数
```ts
export function invokeDirectiveHook(
  hook: Function | Function[],
  instance: ComponentInternalInstance | null,
  vnode: VNode,
  prevVNode: VNode | null = null
) {
    ...
}
```
## 实例对象
### valueCache
> 指令缓存
```ts
const valueCache = new WeakMap<Directive, WeakMap<any, any>>()
```
## 内部函数
### applyDirective
> 生成指令回调函数
```ts
function applyDirective(
  props: Record<any, any>,
  instance: ComponentInternalInstance,
  directive: Directive,
  value?: any,
  arg?: string,
  modifiers?: DirectiveModifiers
) {
    ...
}
```
### DirectiveModifiers
> 指令修饰符
```ts
type DirectiveModifiers = Record<string, boolean>
```