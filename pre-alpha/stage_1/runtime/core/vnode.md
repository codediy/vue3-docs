# 功能说明
> 虚拟Dom类型`VNode`的操作

## 类型接口
### VNodeTypes
> Vnode的`type`类型
> 字符串/组件/
> Fragment/Portal/Text/Comment/Suspense
```ts
export type VNodeTypes =
  | string
  | Component
  | typeof Fragment
  | typeof Portal
  | typeof Text
  | typeof Comment
  | typeof Suspense
```

### VNodeChildAtom
> Vnode子节点基础类型
> string/number/boolean/null/void/Vnode
```ts
type VNodeChildAtom<HostNode, HostElement> =
  | VNode<HostNode, HostElement>
  | string
  | number
  | boolean
  | null
  | void

```
### VNodeChildren
> VNode子节点数组类型
```ts
export interface VNodeChildren<HostNode = any, HostElement = any>
  extends Array<
      | VNodeChildren<HostNode, HostElement>
      | VNodeChildAtom<HostNode, HostElement>
    > {}
```

### VnodeChild
> VNode子节点类型(具有值)
```ts
export type VNodeChild<HostNode = any, HostElement = any> =
  | VNodeChildAtom<HostNode, HostElement>
  | VNodeChildren<HostNode, HostElement>
```

### NormalizedChildren
> VNode子节点类型(包含Slot,null)
```ts
export type NormalizedChildren<HostNode = any, HostElement = any> =
  | string
  | VNodeChildren<HostNode, HostElement>
  | RawSlots
  | null
```

### VNode
> VNode类型
```ts
export interface VNode<HostNode = any, HostElement = any> {
  _isVNode: true
  type: VNodeTypes
  props: Record<any, any> | null
  key: string | number | null
  ref: string | Function | null
  children: NormalizedChildren<HostNode, HostElement>
  component: ComponentInternalInstance | null
  suspense: SuspenseBoundary<HostNode, HostElement> | null

  // DOM
  el: HostNode | null
  anchor: HostNode | null // fragment anchor
  target: HostElement | null // portal target

  // optimization only
  shapeFlag: number
  patchFlag: number
  dynamicProps: string[] | null
  dynamicChildren: VNode[] | null

  // application root node only
  appContext: AppContext | null
}
```
## 功能函数
### openBlock
> 
```ts
export function openBlock(disableTracking?: boolean) {
  blockStack.push(disableTracking ? null : [])
}
```

### createBlock
> 创建Vnode根节点
```ts
export function createBlock(
  type: VNodeTypes,
  props?: { [key: string]: any } | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[]
): VNode {
    ...
}
```

### createVNode
> 创建VNode
```ts
export function createVNode(
  type: VNodeTypes,
  props: { [key: string]: any } | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null
): VNode {
    ...
}
```

### cloneVNode
> 复制VNode
```ts
export function cloneVNode(vnode: VNode): VNode {
    ...
}
```

### isVNode
> 检查是否是VNode
```ts
export function isVNode(value: any): boolean {
  return value ? value._isVNode === true : false
}
```

### normalizeVNode
> 子节点处理
```ts
export function normalizeVNode(child: VNodeChild): VNode {
  if (child == null) {
    return createVNode(Comment)
  } else if (isArray(child)) {
    return createVNode(Fragment, null, child)
  } else if (typeof child === 'object') {
    return child.el === null ? child : cloneVNode(child)
  } else {
    return createVNode(Text, null, child + '')
  }
}

```

### normalizeChildren
>
```ts
export function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    type = ShapeFlags.SLOTS_CHILDREN
  } else if (isFunction(children)) {
    children = { default: children }
    type = ShapeFlags.SLOTS_CHILDREN
  } else {
    children = isString(children) ? children : children + ''
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children as NormalizedChildren
  vnode.shapeFlag |= type
}
```

### normalizeClass
>
```ts
export function normalizeClass(value: unknown): string {
    ...
}
```
### mergeProps
> 合并Prop
```ts
export function mergeProps(...args: Data[]) {
    ...
}
```
## 实例对象

### Fragment/Text/Comment/Portal/Suspense
> VNode的type标志
```ts
export const Fragment = __DEV__ ? Symbol('Fragment') : Symbol()
export const Text = __DEV__ ? Symbol('Text') : Symbol()
export const Comment = __DEV__ ? Symbol('Empty') : Symbol()
export const Portal = __DEV__ ? Symbol('Portal') : Symbol()
export const Suspense = __DEV__ ? Symbol('Suspense') : Symbol()
```
### blockStack
> 解析过程的存储栈
```ts
const blockStack: (VNode[] | null)[] = []
```

### shouldTrack
>
```ts
let shouldTrack = true
```

### handlersRE
> 回调标记正则
```ts
const handlersRE = /^on|^vnode/
```
## 内部函数
### trackDynamicNode
```ts
```
### normalizeStyle
```ts

```
