## createComponentInstance()
- 组件的初始化
``` 
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
) {}
```
- 获取vnode的参数信息
``` 
const type = vnode.type as Component
// inherit parent app context - or - if root, adopt from root vnode
const appContext =
(parent ? parent.appContext : vnode.appContext) || emptyAppContext
```
- 初始化component属性
``` 
const instance: ComponentInternalInstance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null!, // to be immediately set
    next: null,
    subTree: null!, // will be set synchronously right after creation
    update: null!, // will be set synchronously right after creation
    render: null,
    proxy: null,
    withProxy: null,
    effects: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null!,
    renderCache: [],

    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,

    // suspense related
    suspense,
    asyncDep: null,
    asyncResolved: false,

    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
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
    emit: null as any, // to be set immediately
    emitted: null
}
```
- ctx初始化
``` 
if (__DEV__) {
    instance.ctx = createRenderContext(instance)
} else {
    instance.ctx = { _: instance }
}
```
- root初始化
```
instance.root = parent ? parent.root : instance 
```
- emit初始化
``` 
instance.emit = emit.bind(null, instance)
```


## setupComponent()
- 组件的参数处理
``` 
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children, shapeFlag } = instance.vnode
  const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```

- initProps() 处理props
- initSlots() 处理slots
- setupStatefulComponent() 状态组件处理

## setupStatefulComponent()
- 状态组件参数处理
``` 
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
    const Component = instance.type as ComponentOptions
}
``` 
- 获取组件信息
``` 
if (__DEV__) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config)
    }
    if (Component.components) {
      const names = Object.keys(Component.components)
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config)
      }
    }
    if (Component.directives) {
      const names = Object.keys(Component.directives)
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i])
      }
    }
}
```
- 组件名,指令名的检查
``` 
const { setup } = Component
if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    currentInstance = instance
    pauseTracking()
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    resetTracking()
    currentInstance = null

    if (isPromise(setupResult)) {
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult.then((resolvedResult: unknown) => {
          handleSetupResult(instance, resolvedResult, isSSR)
        })
      } else if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
      } else if (__DEV__) {
        warn(
          `setup() returned a Promise, but the version of Vue you are using ` +
            `does not support it yet.`
        )
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
```
- 如果有setup,则处理setup参数
- 否则调用finishComponentSetup()
- setup在handleSetupResult最后调用finishComponentSetup()

## finishComponentSetup()
- 处理合并后的选项参数
``` 
function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
     // template / render function normalization
     if (__NODE_JS__ && isSSR) {
       if (Component.render) {
         instance.render = Component.render as InternalRenderFunction
       }
     } else if (!instance.render) {
       // could be set from setup()
       if (compile && Component.template && !Component.render) {
         if (__DEV__) {
           startMeasure(instance, `compile`)
         }
         Component.render = compile(Component.template, {
           isCustomElement: instance.appContext.config.isCustomElement,
           delimiters: Component.delimiters
         })
         if (__DEV__) {
           endMeasure(instance, `compile`)
         }
       }
   
       instance.render = (Component.render || NOOP) as InternalRenderFunction
   
       // for runtime-compiled render functions using `with` blocks, the render
       // proxy used needs a different `has` handler which is more performant and
       // also only allows a whitelist of globals to fallthrough.
       if (instance.render._rc) {
         instance.withProxy = new Proxy(
           instance.ctx,
           RuntimeCompiledPublicInstanceProxyHandlers
         )
       }
     }
}
```
- template/render的处理
``` 
if (__FEATURE_OPTIONS_API__) {
    currentInstance = instance
    applyOptions(instance, Component)
    currentInstance = null
}
```
vue2的options参数处理

``` 
if (__DEV__ && !Component.render && instance.render === NOOP) {
    /* istanbul ignore if */
    if (!compile && Component.template) {
      warn(
        `Component provided template option but ` +
          `runtime compilation is not supported in this build of Vue.` +
          (__ESM_BUNDLER__
            ? ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
            : __ESM_BROWSER__
              ? ` Use "vue.esm-browser.js" instead.`
              : __GLOBAL__
                ? ` Use "vue.global.js" instead.`
                : ``) /* should not happen */
      )
    } else {
      warn(`Component is missing template or render function.`)
    }
  }

```
- render检查

## applyOptions
- options处理核心
- runtime-core/src/componentOptions.ts








