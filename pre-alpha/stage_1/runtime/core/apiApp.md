# 功能说明
> ViewModel实例App扩展接口

## 接口
### App
> ViewModel实例App扩展接口
```ts
export interface App<HostElement = any> {
  config: AppConfig
  use(plugin: Plugin, options?: any): this
  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined
  component(name: string, component: Component): this
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
  mount(
    rootComponent: Component,
    rootContainer: HostElement,
    rootProps?: Data
  ): ComponentPublicInstance
  provide<T>(key: InjectionKey<T> | string, value: T): void
}
```

### AppConfig
> 开发配置接口
```ts
export interface AppConfig {
  devtools: boolean
  performance: boolean
  errorHandler?: (
    err: Error,
    instance: ComponentPublicInstance | null,
    info: string
  ) => void
  warnHandler?: (
    msg: string,
    instance: ComponentPublicInstance | null,
    trace: string
  ) => void
}
```

### AppContext
> App上下文
```ts
export interface AppContext {
  config: AppConfig
  mixins: ComponentOptions[]
  components: Record<string, Component>
  directives: Record<string, Directive>
  provides: Record<string | symbol, any>
}
```


### Plugin
> 插件接口
```ts
export type Plugin =
  | PluginInstallFunction
  | {
      install: PluginInstallFunction
    }
```


## 功能函数
### createAppContext()
> 创建默认配置AppContext
```ts
export function createAppContext(): AppContext {
  return {
    config: {
      devtools: true,
      performance: false,
      errorHandler: undefined,
      warnHandler: undefined
    },
    mixins: [],
    components: {},
    directives: {},
    provides: {}
  }
}
```

### createAppAPI
> 创建ViewModel的App实例接口
```ts
export function createAppAPI<HostNode, HostElement>(
  render: RootRenderFunction<HostNode, HostElement>
): () => App<HostElement> {
  return function createApp(): App {
      const app:App = {
          ...
      }
      return app;
  }
}
```