## render()
- 渲染VNode到特定container
- 在createApp()的mount()中触发
- 根据n1,n2参数进行分类处理

## processComponent()
- 组件的挂载处理
- 根据容器是已挂载过，mountComponent()或者updateComponent()
- 在mountComponent()进行组件实例化处理createComponentInstance()
- 组件的实例化中处理createApp()传入的参数

## createComponentInstance()
- 组件的实例化

## setupRenderEffect()
- 初始化渲染


## 参考
## 参考
[vue渲染器](http://hcysun.me/vue-design/zh/)