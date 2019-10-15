# 功能说明
> 组件渲染处理

## 类型接口
## 功能函数
### renderComponentRoot
> 渲染根组件
```ts
export function renderComponentRoot(
  instance: ComponentInternalInstance
): VNode {
  const {
    type: Component,
    vnode,
    renderProxy,
    props,
    slots,
    attrs,
    emit
  } = instance

  let result
  currentRenderingInstance = instance
  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      result = normalizeVNode(instance.render!.call(renderProxy))
    } else {
      // functional
      const render = Component as FunctionalComponent
      result = normalizeVNode(
        render.length > 1
          ? render(props, {
              attrs,
              slots,
              emit
            })
          : render(props, null as any /* we know it doesn't it */)
      )
    }
  } catch (err) {
    handleError(err, instance, ErrorCodes.RENDER_FUNCTION)
    result = createVNode(Comment)
  }
  currentRenderingInstance = null
  return result
}
```
### shouldUpdateComponent
> 检查组件是否需要渲染更新
```ts
export function shouldUpdateComponent(
  prevVNode: VNode,
  nextVNode: VNode,
  optimized?: boolean
): boolean {
  const { props: prevProps, children: prevChildren } = prevVNode
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode
  if (patchFlag > 0) {
    if (patchFlag & PatchFlags.DYNAMIC_SLOTS) {
      // slot content that references values that might have changed,
      // e.g. in a v-for
      return true
    }
    if (patchFlag & PatchFlags.FULL_PROPS) {
      // presence of this flag indicates props are always non-null
      return hasPropsChanged(prevProps!, nextProps!)
    } else if (patchFlag & PatchFlags.PROPS) {
      const dynamicProps = nextVNode.dynamicProps!
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i]
        if (nextProps![key] !== prevProps![key]) {
          return true
        }
      }
    }
  } else if (!optimized) {
    // this path is only taken by manually written render functions
    // so presence of any children leads to a forced update
    if (prevChildren != null || nextChildren != null) {
      return true
    }
    if (prevProps === nextProps) {
      return false
    }
    if (prevProps === null) {
      return nextProps !== null
    }
    if (nextProps === null) {
      return prevProps !== null
    }
    return hasPropsChanged(prevProps, nextProps)
  }
  return false
}
```
## 实例对象
### currentRenderingInstance
> 当前渲染对象
```ts
export let currentRenderingInstance: ComponentInternalInstance | null = null
```

## 内部函数
### hasPropsChanged
> 是否有`Prop`变动
```ts
function hasPropsChanged(prevProps: Data, nextProps: Data): boolean {
  const nextKeys = Object.keys(nextProps)
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }
  return false
}
```