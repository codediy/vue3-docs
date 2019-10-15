# 功能说明
> 渲染器实现

## 接口类型
### RendererOptions
> Renderer参数选项
> 自定义渲染器需要实现的接口函数
```ts
export interface RendererOptions<HostNode = any, HostElement = any> {
  patchProp(
    el: HostElement,
    key: string,
    value: any,
    oldValue: any,
    isSVG: boolean,
    prevChildren?: VNode<HostNode, HostElement>[],
    parentComponent?: ComponentInternalInstance | null,
    parentSuspense?: SuspenseBoundary<HostNode, HostElement> | null,
    unmountChildren?: (
      children: VNode<HostNode, HostElement>[],
      parentComponent: ComponentInternalInstance | null,
      parentSuspense: SuspenseBoundary<HostNode, HostElement> | null
    ) => void
  ): void
  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  remove(el: HostNode): void
  createElement(type: string, isSVG?: boolean): HostElement
  createText(text: string): HostNode
  createComment(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostNode | null
  nextSibling(node: HostNode): HostNode | null
  querySelector(selector: string): HostElement | null
}
```
- patchProp 属性更新
- insert(el,parent,anchor)   添加节点
- remove（el）                删除节点
- createElement(type,isSVG)   创建元素节点
- createText(text)            创建文本节点
- createComment(text)         创建注释节点
- setText(node,text)          修改节点文本
- setElementText(node,text)   修改元素文本
- parentNode(node)            父节点
- nextSibling(node)           兄弟节点
- querySelector(selector)     查询元素节点

### RootRenderFunction
> 渲染函数类型
```ts
export type RootRenderFunction<HostNode, HostElement> = (
  vnode: VNode<HostNode, HostElement> | null,
  dom: HostElement | string
) => void
```

## 功能函数

### createRenderer
> 创建渲染器
```ts
export function createRenderer<
  HostNode extends object = any,
  HostElement extends HostNode = any
>(
  options: RendererOptions<HostNode, HostElement>
): {
  render: RootRenderFunction<HostNode, HostElement>
  createApp: () => App<HostElement>
} {
    ...
}
```
- 参数与返回值
> 参数 `options:RendererOptions`            自定义渲染器需要实现的接口

> 返回 `render:RootRenderFunction`          返回的渲染接口

> 返回 `createApp: () => App<HostElement>`  返回的App创建接口

- 内部接口
> `function patch()`                更新节点入口
> `function processText()`          更新文本节点
> `function processCommentNode()`   更新注释节点
> `function processElement()`       更新元素节点
> `function mountElement()`         挂载元素节点
> `function mountChildren()`        挂载子节点
> `function patchElement()`         更新元素节点
> `function patchProps()`           更新元素属性
> `function processFragment()`      处理Fragment
> `function processPortal()`        处理Portal
> `function processSuspense()`      处理Suspense
> `function mountSuspense()`        挂载Suspense
> `function patchSuspense()`        更新Suspense
> `function resolveSuspense()`
> `function restartSuspense()`
> `function processComponent()`
> `function mountComponent()`
> `function retryAsyncComponent()`
> `function setupRenderEffect()`
> `function updateComponentPreRender()`
> `function updateHOCHostEl()`
> `function patchChildren()`
> `function patchUnkeyedChildren()`
> `function patchKeyedChildren()`
> `fucntion move()`
> `function unmount()`
> `function unmountComponent()`
> `function unmountSuspense()`
> `function unmountChildren()`
> `function getNextHostNode()`
> `function setRef()`
> `function render()`              渲染入口
## 内部函数
### prodEffectOptions
### createDevEffectOptions(instance)
### isSameType()
> Vnode类型检查
### invokeHooks(hooks:Function[],arg?:any)
> 调用hooks回调函数
### getSequence()