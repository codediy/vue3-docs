## createAppApi()
``` 
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
}
```
- 参数render 渲染函数接口
- 说明createApp包含了render流程
- 创建app上下文 createAppContext()
- 创建组件集合 const installedPlugins = new Set()
- app实例对象 const app: App = (context.app = {})
- app包含了一系列createApp()后可以调用的接口
- `use()`,`mixin()`用来扩展接口
- `component()`,`directive()`,`provide`用来注册组件,指令,数据源到app上下文
- `mount()`用来挂载元素，渲染的流程

## createAppContext()
``` 
export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      isCustomElement: NO,
      errorHandler: undefined,
      warnHandler: undefined
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null)
  }
}
```

## mount()接口
- 根据组件生产vnode
- 渲染vnode到平台
``` 
mount(rootContainer: HostElement, isHydrate?: boolean): any {
     if (!isMounted) {
           const vnode = createVNode(rootComponent as Component, rootProps)
           // store app context on the root VNode.
           // this will be set on the root instance on initial mount.
           vnode.appContext = context
    
           // HMR root reload
           if (__DEV__) {
             context.reload = () => {
               render(cloneVNode(vnode), rootContainer)
             }
           }
    
           if (isHydrate && hydrate) {
             hydrate(vnode as VNode<Node, Element>, rootContainer as any)
           } else {
             render(vnode, rootContainer)
           }
           isMounted = true
           app._container = rootContainer
           // for devtools and telemetry
           ;(rootContainer as any).__vue_app__ = app
    
           if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
             devtoolsInitApp(app, version)
           }
    
           return vnode.component!.proxy
         } else if (__DEV__) {
           warn(
             `App has already been mounted.\n` +
               `If you want to remount the same app, move your app creation logic ` +
               `into a factory function and create fresh app instances for each ` +
               `mount - e.g. \`const createMyApp = () => createApp(App)\``
           )
     }
}
```

- 根据组件创建VNode，组件的意义所在， const vnode = createVNode(rootComponent as Component, rootProps)
- vnode添加app上下文信息  vnode.appContext = context
- 渲染vnode到特定平台  
``` 
if (isHydrate && hydrate) {
    hydrate(vnode as VNode<Node, Element>, rootContainer as any)
} else {
    render(vnode, rootContainer)
}
```












