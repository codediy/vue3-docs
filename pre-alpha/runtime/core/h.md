# 功能说明
> 虚拟节点创建函数

## 类型接口

### RawProps
### RawChildren
### Constructor



## 功能函数
### h(string->VNode)
> VNode创建多态函数`h`的类型
```ts
export function h(type: string, children?: RawChildren): VNode
export function h(
  type: string,
  props?: RawProps | null,
  children?: RawChildren
): VNode
```

### h(Fragment->VNode)
> > h多态函数
```ts
export function h(type: typeof Fragment, children?: RawChildren): VNode
export function h(
  type: typeof Fragment,
  props?: (RawProps & { key?: string | number }) | null,
  children?: RawChildren
): VNode
```

### h(Portal->VNode)
> h多态函数
```ts
export function h(type: typeof Portal, children?: RawChildren): VNode
export function h(
  type: typeof Portal,
  props?: (RawProps & { target: any }) | null,
  children?: RawChildren
): VNode
```
### h(FunctionalComponent->VNode)
> h多态函数
```ts
export function h(type: FunctionalComponent, children?: RawChildren): VNode
export function h<P>(
  type: FunctionalComponent<P>,
  props?: (RawProps & P) | null,
  children?: RawChildren | RawSlots
): VNode
```

### h(StatefuleComponent->VNode)
> h多态函数
```ts
export function h(type: ComponentOptions, children?: RawChildren): VNode
export function h<P>(
  type: ComponentOptionsWithoutProps<P>,
  props?: (RawProps & P) | null,
  children?: RawChildren | RawSlots
): VNode
export function h<P extends string>(
  type: ComponentOptionsWithArrayProps<P>,
  props?: (RawProps & { [key in P]?: any }) | null,
  children?: RawChildren | RawSlots
): VNode
export function h<P>(
  type: ComponentOptionsWithObjectProps<P>,
  props?: (RawProps & ExtractPropTypes<P>) | null,
  children?: RawChildren | RawSlots
): VNode
```

### h(Constructor->VNode)
> h多态函数
```ts
export function h(type: Constructor, children?: RawChildren): VNode
export function h<P>(
  type: Constructor<P>,
  props?: (RawProps & P) | null,
  children?: RawChildren | RawSlots
): VNode
```

### h(implementation)
```ts
export function h(
  type: VNodeTypes,
  propsOrChildren?: any,
  children?: any
): VNode {
  if (arguments.length === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // props without children
      return createVNode(type, propsOrChildren)
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    return createVNode(type, propsOrChildren, children)
  }
}
```