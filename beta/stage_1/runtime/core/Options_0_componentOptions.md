## applyOptions()
- options参数处理核心

``` 
export function applyOptions(
  instance: ComponentInternalInstance,
  options: ComponentOptions,
  deferredData: DataFn[] = [],
  deferredWatch: ComponentWatchOptions[] = [],
  asMixin: boolean = false
) {
    const {
        // composition
        mixins,
        extends: extendsOptions,
        // state
        data: dataOptions,
        computed: computedOptions,
        methods,
        watch: watchOptions,
        provide: provideOptions,
        inject: injectOptions,
        // lifecycle
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeUnmount,
        unmounted,
        render,
        renderTracked,
        renderTriggered,
        errorCaptured
    } = options
}
```
- 获取options对象的参数信息
``` 
const publicThis = instance.proxy!
const ctx = instance.ctx
const globalMixins = instance.appContext.mixins
```
- publicThis,当前this引用

``` 
if (asMixin && render && instance.render === NOOP) {
    instance.render = render as InternalRenderFunction
}
```
- render的处理

``` 
if (!asMixin) {
    callSyncHook('beforeCreate', options, publicThis, globalMixins)
    // global mixins are applied first
    applyMixins(instance, globalMixins, deferredData, deferredWatch)
}
```
- beforeCreate的调用，applyMixins()处理globalMixins

``` 
if (extendsOptions) {
    applyOptions(instance, extendsOptions, deferredData, deferredWatch, true)
}
```
- extend的处理

``` 
if (mixins) {
    applyMixins(instance, mixins, deferredData, deferredWatch)
}
```
- mixins的处理

``` 
const checkDuplicateProperties = __DEV__ ? createDuplicateChecker() : null
if (__DEV__) {
    const propsOptions = normalizePropsOptions(options)[0]
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties!(OptionTypes.PROPS, key)
      }
    }
}
```
- 重复属性检测

``` 
// options initialization order (to be consistent with Vue 2):
// - props (already done outside of this function)
// - inject
// - methods
// - data (deferred since it relies on `this` access)
// - computed
// - watch (deferred since it relies on `this` access)
```
- vue2的参数处理顺序
``` 
if (injectOptions) {
    if (isArray(injectOptions)) {
      for (let i = 0; i < injectOptions.length; i++) {
        const key = injectOptions[i]
        ctx[key] = inject(key)
        if (__DEV__) {
          checkDuplicateProperties!(OptionTypes.INJECT, key)
        }
      }
    } else {
      for (const key in injectOptions) {
        const opt = injectOptions[key]
        if (isObject(opt)) {
          ctx[key] = inject(opt.from, opt.default)
        } else {
          ctx[key] = inject(opt)
        }
        if (__DEV__) {
          checkDuplicateProperties!(OptionTypes.INJECT, key)
        }
      }
    }
}
```
- inject的处理

``` 
if (methods) {
    for (const key in methods) {
      const methodHandler = (methods as MethodOptions)[key]
      if (isFunction(methodHandler)) {
        ctx[key] = methodHandler.bind(publicThis)
        if (__DEV__) {
          checkDuplicateProperties!(OptionTypes.METHODS, key)
        }
      } else if (__DEV__) {
        warn(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
            `Did you reference the function correctly?`
        )
      }
    }
}
```
- methods的处理

``` 
if (dataOptions) {
    if (__DEV__ && !isFunction(dataOptions)) {
      warn(
        `The data option must be a function. ` +
          `Plain object usage is no longer supported.`
      )
    }

    if (asMixin) {
      deferredData.push(dataOptions as DataFn)
    } else {
      resolveData(instance, dataOptions, publicThis)
    }
}
if (!asMixin) {
    if (deferredData.length) {
      deferredData.forEach(dataFn => resolveData(instance, dataFn, publicThis))
    }
    if (__DEV__) {
      const rawData = toRaw(instance.data)
      for (const key in rawData) {
        checkDuplicateProperties!(OptionTypes.DATA, key)
        // expose data on ctx during dev
        if (key[0] !== '$' && key[0] !== '_') {
          Object.defineProperty(ctx, key, {
            configurable: true,
            enumerable: true,
            get: () => rawData[key],
            set: NOOP
          })
        }
      }
    }
}
```
- data的处理
``` 
if (computedOptions) {
    for (const key in computedOptions) {
      const opt = (computedOptions as ComputedOptions)[key]
      const get = isFunction(opt)
        ? opt.bind(publicThis, publicThis)
        : isFunction(opt.get)
          ? opt.get.bind(publicThis, publicThis)
          : NOOP
      if (__DEV__ && get === NOOP) {
        warn(`Computed property "${key}" has no getter.`)
      }
      const set =
        !isFunction(opt) && isFunction(opt.set)
          ? opt.set.bind(publicThis)
          : __DEV__
            ? () => {
                warn(
                  `Write operation failed: computed property "${key}" is readonly.`
                )
              }
            : NOOP
      const c = computed({
        get,
        set
      })
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: v => (c.value = v)
      })
      if (__DEV__) {
        checkDuplicateProperties!(OptionTypes.COMPUTED, key)
      }
    }
}
```
- computed的处理

``` 
if (watchOptions) {
    deferredWatch.push(watchOptions)
  }
  if (!asMixin && deferredWatch.length) {
    deferredWatch.forEach(watchOptions => {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key)
      }
    })
}
```
- watch的处理

``` 
if (provideOptions) {
    const provides = isFunction(provideOptions)
      ? provideOptions.call(publicThis)
      : provideOptions
    for (const key in provides) {
      provide(key, provides[key])
    }
}
```
- provide的处理


``` 
// lifecycle options
  if (!asMixin) {
    callSyncHook('created', options, publicThis, globalMixins)
  }
  if (beforeMount) {
    onBeforeMount(beforeMount.bind(publicThis))
  }
  if (mounted) {
    onMounted(mounted.bind(publicThis))
  }
  if (beforeUpdate) {
    onBeforeUpdate(beforeUpdate.bind(publicThis))
  }
  if (updated) {
    onUpdated(updated.bind(publicThis))
  }
  if (activated) {
    onActivated(activated.bind(publicThis))
  }
  if (deactivated) {
    onDeactivated(deactivated.bind(publicThis))
  }
  if (errorCaptured) {
    onErrorCaptured(errorCaptured.bind(publicThis))
  }
  if (renderTracked) {
    onRenderTracked(renderTracked.bind(publicThis))
  }
  if (renderTriggered) {
    onRenderTriggered(renderTriggered.bind(publicThis))
  }
  if (beforeUnmount) {
    onBeforeUnmount(beforeUnmount.bind(publicThis))
  }
  if (unmounted) {
    onUnmounted(unmounted.bind(publicThis))
  }
```
- 生命周期钩子的挂载

## applyOptions中调用的选项处理函数
- applyMixins()     在当前文件,
- inject()          apiInject.ts
- resolveData()     在当前文件  调用了reactive()，响应核心
- computed()        apiComputed.ts
- createWatcher()   当前文件,调用了watch()在apiWatch.ts
- provide()         apiInject.ts
- callSyncHook()    当前文件
- onXX()            apiLifecycle.ts
