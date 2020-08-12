## 运行时流程
1. createApp() 根据参数创建组件实例,             apiCreateApp.ts
2. createVNode() mount()中从组件实例产出VNode，  vnode.ts
3. render()    mount()中根据VNode渲染到特定平台  renderer.ts

## createApp()
- App的属性初始化

## mount()
- 初始化VNode,然后调用render

## render()
- 初始化Component,然后patch()


## 参考
[vue渲染器](http://hcysun.me/vue-design/zh/)