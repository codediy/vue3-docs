## render()接口
- runtime-core/src/renderer.ts
- 在baseCreateRenderer()中实现

```
const render: RootRenderFunction = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    flushPostFlushCbs()
    container._vnode = vnode
}
```
- 如果渲染空vnode到容器，则卸载container的vnode
- 如果渲染vnode到容器，则调用patch()

## patch()接口
- runtime-core/src/renderer.ts
- 在baseCreateRenderer()中实现
``` 
const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    optimized = false
) => {
}
```
- 容器中已挂载的vNode
- 新的vNode
1. 如果存在旧节点，而且新旧节点类型不一样，卸载旧节点，并且设置n1等于null
``` 
if (n1 && !isSameVNodeType(n1, n2)) {
  anchor = getNextHostNode(n1)
  unmount(n1, parentComponent, parentSuspense, true)
  n1 = null
}
```
2. 然后根据n2类型进行处理
    1. text则processText()
    2. Comment则processCommentNode()
    3. Static则mountStaticNode()/patchStaticNode()
    4. Fragment则processFragment()
    5. ELEMENT则processElement
    6. COMPONENT则processComponent()
    7. TELEPORT则TeleportImpl.process()
    8. SUSPENSE则SuspenseImpl.process()
3. createApp()中createVNode()返回的是COMPONENT 调用processComponent()


## processComponent()
- 根据n1是否存在mountComponent()或updateComponent()

## mountComponent()
- 创建component实例 createComponentInstance()
- 处理setup参数 setupComponent(instance)
- ?? setupRenderEffect

## createComponentInstance 
- 初始化组件属性


## setupComponent()
- 组件的参数处理
- 处理createApp()的参数

## updateComponent()
- 检查是否需要更新shouldUpdateComponent
- 更新组件渲染updateComponentPreRender
- 可以调用在mounted中注册的instance.update()

## setupRenderEffect()
- 渲染处理
``` 
const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
) => {
    instance.update = effect(function componentEffect() {}
}
```
- 挂载update为effect函数


## componentEffect
```
function componentEffect() {
    if (!instance.isMounted) {
        let vnodeHook: VNodeHook | null | undefined
        const { el, props } = initialVNode
        const { bm, m, a, parent } = instance
        if (__DEV__) {
          startMeasure(instance, `render`)
        }
        const subTree = (instance.subTree = renderComponentRoot(instance))
    }
}
```
- 渲染根节点
``` 
// beforeMount hook
if (bm) {
  invokeArrayFns(bm)
}
```
- 调用beforeMount
``` 
// onVnodeBeforeMount
if ((vnodeHook = props && props.onVnodeBeforeMount)) {
   invokeVNodeHook(vnodeHook, parent, initialVNode)
 }
```
- vnode的hook
``` 
if (el && hydrateNode) {
  if (__DEV__) {
    startMeasure(instance, `hydrate`)
  }
  // vnode has adopted host node - perform hydration instead of mount.
  hydrateNode(
    initialVNode.el as Node,
    subTree,
    instance,
    parentSuspense
  )
  if (__DEV__) {
    endMeasure(instance, `hydrate`)
  }
} else {
  if (__DEV__) {
    startMeasure(instance, `patch`)
  }
  patch(
    null,
    subTree,
    container,
    anchor,
    instance,
    parentSuspense,
    isSVG
  )
  if (__DEV__) {
    endMeasure(instance, `patch`)
  }
  initialVNode.el = subTree.el
}
```
- patch()挂载根节点

``` 
// mounted hook
if (m) {
  queuePostRenderEffect(m, parentSuspense)
}
```
- mounted回调

``` 
// onVnodeMounted
if ((vnodeHook = props && props.onVnodeMounted)) {
  queuePostRenderEffect(() => {
    invokeVNodeHook(vnodeHook!, parent, initialVNode)
  }, parentSuspense)
}
```
- vnode的回调

``` 
// activated hook for keep-alive roots.
if (
  a &&
  initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
) {
  queuePostRenderEffect(a, parentSuspense)
}
instance.isMounted = true
```

``` 
// updateComponent
// This is triggered by mutation of component's own state (next: null)
// OR parent calling processComponent (next: VNode)
let { next, bu, u, parent, vnode } = instance
let originNext = next
let vnodeHook: VNodeHook | null | undefined
```
- updateComponent的处理


``` 
if (next) {
  updateComponentPreRender(instance, next, optimized)
} else {
  next = vnode
}
```
- updateComponentPreRender

``` 
const nextTree = renderComponentRoot(instance)
```
- nextTree获取

``` 
const prevTree = instance.subTree
instance.subTree = nextTree
next.el = vnode.el
```
- prevTree

``` 
// beforeUpdate hook
if (bu) {
  invokeArrayFns(bu)
}
// onVnodeBeforeUpdate
if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
  invokeVNodeHook(vnodeHook, parent, next, vnode)
}
```
- beforeUpdate回调

``` 
patch(
  prevTree,
  nextTree,
  // parent may have changed if it's in a teleport
  hostParentNode(prevTree.el!)!,
  // anchor may have changed if it's in a fragment
  getNextHostNode(prevTree),
  instance,
  parentSuspense,
  isSVG
)
```
- 更新挂载
``` 
// updated hook
if (u) {
  queuePostRenderEffect(u, parentSuspense)
}
// onVnodeUpdated
if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
  queuePostRenderEffect(() => {
    invokeVNodeHook(vnodeHook!, parent, next!, vnode)
  }, parentSuspense)
}
```
- updated回调



