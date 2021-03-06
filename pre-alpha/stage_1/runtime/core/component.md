# 功能说明
> 组件相关类型接口

## 类型接口

### Data
> Options的Data类型
```ts
export type Data = { [key: string]: unknown }
```
### FunctionalComponent
> 函数类型组件
```ts
export interface FunctionalComponent<P = {}> {
  (props: P, ctx: SetupContext): VNodeChild
  props?: ComponentPropsOptions<P>
  displayName?: string
}
```
### Component
> 组件类型
```ts
export type Component = ComponentOptions | FunctionalComponent
```

### LifecycleHooks
> 生命周期钩子函数
```ts
type LifecycleHook = Function[] | null
export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
  DEACTIVATED = 'da',
  ACTIVATED = 'a',
  RENDER_TRIGGERED = 'rtg',
  RENDER_TRACKED = 'rtc',
  ERROR_CAPTURED = 'ec'
}
```
### SetupContext
> 
```ts
type Emit = ((event: string, ...args: unknown[]) => void)

export interface SetupContext {
  attrs: Data
  slots: Slots
  emit: Emit
}
```
### RenderFunction
> 渲染函数类型
```ts
export type RenderFunction = () => VNodeChild
```
### ComponentInternalInstance
> 组件实例类型
```ts
export interface ComponentInternalInstance {
  type: FunctionalComponent | ComponentOptions
  parent: ComponentInternalInstance | null
  appContext: AppContext
  root: ComponentInternalInstance
  vnode: VNode
  next: VNode | null
  subTree: VNode
  update: ReactiveEffect
  render: RenderFunction | null
  effects: ReactiveEffect[] | null
  provides: Data

  components: Record<string, Component>
  directives: Record<string, Directive>

  asyncDep: Promise<any> | null
  asyncResult: any
  asyncResolved: boolean

  // the rest are only for stateful components
  renderContext: Data
  data: Data
  props: Data
  attrs: Data
  slots: Slots
  renderProxy: ComponentPublicInstance | null
  propsProxy: Data | null
  setupContext: SetupContext | null
  refs: Data
  emit: Emit

  // user namespace
  user: { [key: string]: any }

  // lifecycle
  isUnmounted: boolean
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  [LifecycleHooks.CREATED]: LifecycleHook
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  [LifecycleHooks.MOUNTED]: LifecycleHook
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  [LifecycleHooks.UPDATED]: LifecycleHook
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook
}
```

## 功能函数
### createComponentInstance
> 创建组件实例
```ts 
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null
): ComponentInternalInstance {
  // inherit parent app context - or - if root, adopt from root vnode
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext
  const instance = {
    vnode,
    parent,
    appContext,
    type: vnode.type as Component,
    root: null as any, // set later so it can point to itself
    next: null,
    subTree: null as any, // will be set synchronously right after creation
    update: null as any, // will be set synchronously right after creation
    render: null,
    renderProxy: null,
    propsProxy: null,
    setupContext: null,
    effects: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),

    // setup context properties
    renderContext: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,

    // per-instance asset storage (mutable during options resolution)
    components: Object.create(appContext.components),
    directives: Object.create(appContext.directives),

    // async dependency management
    asyncDep: null,
    asyncResult: null,
    asyncResolved: false,

    // user namespace for storing whatever the user assigns to `this`
    user: {},

    // lifecycle hooks
    // not using enums here because it results in computed properties
    isUnmounted: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,

    emit: (event: string, ...args: unknown[]) => {
      const props = instance.vnode.props || EMPTY_OBJ
      const handler = props[`on${event}`] || props[`on${capitalize(event)}`]
      if (handler) {
        if (isArray(handler)) {
          for (let i = 0; i < handler.length; i++) {
            callWithAsyncErrorHandling(
              handler[i],
              instance,
              ErrorCodes.COMPONENT_EVENT_HANDLER,
              args
            )
          }
        } else {
          callWithAsyncErrorHandling(
            handler,
            instance,
            ErrorCodes.COMPONENT_EVENT_HANDLER,
            args
          )
        }
      }
    }
  }

  instance.root = parent ? parent.root : instance
  return instance
}
```
### getCurrentInstance
> 获取当前操作组件实例
```ts
export const getCurrentInstance: () => ComponentInternalInstance | null = () =>
  currentInstance
```

### setCurrentInstance
> 设置当前操作组件实例
```ts
export const setCurrentInstance = (
  instance: ComponentInternalInstance | null
) => {
  currentInstance = instance
}
```
### setupStatefulComponent
> 初始化`StatefulComponent`
```ts
export function setupStatefulComponent(
  instance: ComponentInternalInstance,
  parentSuspense: SuspenseBoundary | null
) {
  const Component = instance.type as ComponentOptions
  // 1. create render proxy
  instance.renderProxy = new Proxy(instance, PublicInstanceProxyHandlers)
  // 2. create props proxy
  // the propsProxy is a reactive AND readonly proxy to the actual props.
  // it will be updated in resolveProps() on updates before render
  const propsProxy = (instance.propsProxy = readonly(instance.props))
  // 3. call setup()
  const { setup } = Component
  if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    currentInstance = instance
    currentSuspense = parentSuspense
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [propsProxy, setupContext]
    )
    currentInstance = null
    currentSuspense = null

    if (
      setupResult &&
      isFunction(setupResult.then) &&
      isFunction(setupResult.catch)
    ) {
      if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
      } else if (__DEV__) {
        warn(
          `setup() returned a Promise, but the version of Vue you are using ` +
            `does not support it yet.`
        )
      }
      return
    } else {
      handleSetupResult(instance, setupResult, parentSuspense)
    }
  } else {
    finishComponentSetup(instance, parentSuspense)
  }
}
```
### handleSetupResult
> setup结果处理
```ts
export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown,
  parentSuspense: SuspenseBoundary | null
) {
  if (isFunction(setupResult)) {
    // setup returned an inline render function
    instance.render = setupResult as RenderFunction
  } else if (isObject(setupResult)) {
    if (__DEV__ && isVNode(setupResult)) {
      warn(
        `setup() should not return VNodes directly - ` +
          `return a render function instead.`
      )
    }
    instance.renderContext = reactive(setupResult)
  } else if (__DEV__ && setupResult !== undefined) {
    warn(
      `setup() should return an object. Received: ${
        setupResult === null ? 'null' : typeof setupResult
      }`
    )
  }
  finishComponentSetup(instance, parentSuspense)
}
```
### registerRuntimCompiler
> 设置当前编译器
```ts
export function registerRuntimeCompiler(_compile: CompileFunction) {
  compile = _compile
}
```
## 实例对象
### emptyAppContext
> 空的App配置
```ts
const emptyAppContext = createAppContext()
```
### currentInstance
> 当前组件实例
```ts 
export let currentInstance: ComponentInternalInstance | null = null
```
### currentSuspense
> 当前Suspense实例
```ts
export let currentSuspense: SuspenseBoundary | null = null
```
## 内部函数
### CompileFunction
> 编译函数类型
```ts
type CompileFunction = (
  template: string,
  options?: CompilerOptions
) => RenderFunction
```
### compile
> 当前编译器
```ts
let compile: CompileFunction | undefined
```
### finishComponentSetup
> 初始化组件渲染函数
```ts
function finishComponentSetup(
  instance: ComponentInternalInstance,
  parentSuspense: SuspenseBoundary | null
) {
  const Component = instance.type as ComponentOptions
  if (!instance.render) {
    if (Component.template && !Component.render) {
      if (compile) {
        Component.render = compile(Component.template, {
          onError(err) {}
        })
      } else if (__DEV__) {
        warn(
          `Component provides template but the build of Vue you are running ` +
            `does not support on-the-fly template compilation. Either use the ` +
            `full build or pre-compile the template using Vue CLI.`
        )
      }
    }
    if (__DEV__ && !Component.render) {
      warn(
        `Component is missing render function. Either provide a template or ` +
          `return a render function from setup().`
      )
    }
    instance.render = (Component.render || NOOP) as RenderFunction
  }

  // support for 2.x options
  if (__FEATURE_OPTIONS__) {
    currentInstance = instance
    currentSuspense = parentSuspense
    applyOptions(instance, Component)
    currentInstance = null
    currentSuspense = null
  }

  if (instance.renderContext === EMPTY_OBJ) {
    instance.renderContext = reactive({})
  }
}
```
### createSetupContext
> 创建setupContext,初始化内部代理对象
```ts
export const SetupProxySymbol = Symbol()
const SetupProxyHandlers: { [key: string]: ProxyHandler<any> } = {}
;['attrs', 'slots', 'refs'].forEach((type: string) => {
  SetupProxyHandlers[type] = {
    get: (instance, key) => instance[type][key],
    has: (instance, key) => key === SetupProxySymbol || key in instance[type],
    ownKeys: instance => Reflect.ownKeys(instance[type]),
    // this is necessary for ownKeys to work properly
    getOwnPropertyDescriptor: (instance, key) =>
      Reflect.getOwnPropertyDescriptor(instance[type], key),
    set: () => false,
    deleteProperty: () => false
  }
})
function createSetupContext(instance: ComponentInternalInstance): SetupContext {
  const context = {
    // attrs, slots & refs are non-reactive, but they need to always expose
    // the latest values (instance.xxx may get replaced during updates) so we
    // need to expose them through a proxy
    attrs: new Proxy(instance, SetupProxyHandlers.attrs),
    slots: new Proxy(instance, SetupProxyHandlers.slots),
    refs: new Proxy(instance, SetupProxyHandlers.refs),
    emit: instance.emit
  }
  return __DEV__ ? Object.freeze(context) : context
}

```
