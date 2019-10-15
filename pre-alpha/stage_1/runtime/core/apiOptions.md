# 功能说明
> ViewModel实例创建参数选项Options接口
> ViewModel实例创建参数选项Options解析处理
## 类型接口
### ComponentOptionsBase
> 基础Option类型接口
```ts
interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions
> extends LegacyOptions<Props, RawBindings, D, C, M> {
  setup?: (
    this: null,
    props: Props,
    ctx: SetupContext
  ) => RawBindings | (() => VNodeChild) | void
  name?: string
  template?: string
  // Note: we are intentionally using the signature-less `Function` type here
  // since any type with signature will cause the whole inference to fail when
  // the return expression contains reference to `this`.
  // Luckily `render()` doesn't need any arguments nor does it care about return
  // type.
  render?: Function
  components?: Record<string, Component>
  directives?: Record<string, Directive>
}
```
### ComponentOptionWithoutProps
> 不包含Props的Option类型
```ts
export type ComponentOptionsWithoutProps<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
> = ComponentOptionsBase<Props, RawBindings, D, C, M> & {
  props?: undefined
} & ThisType<ComponentPublicInstance<Props, RawBindings, D, C, M>>
```
### ComponentOptionArrayProps
> 包含ArrayProps的Option类型
```ts
export type ComponentOptionsWithArrayProps<
  PropNames extends string = string,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Props = { [key in PropNames]?: unknown }
> = ComponentOptionsBase<Props, RawBindings, D, C, M> & {
  props: PropNames[]
} & ThisType<ComponentPublicInstance<Props, RawBindings, D, C, M>>
```
### ComponentOptionWithProps
> 包含ObjectProp的Option类型
```ts
export type ComponentOptionsWithProps<
  PropsOptions = ComponentPropsOptions,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Props = ExtractPropTypes<PropsOptions>
> = ComponentOptionsBase<Props, RawBindings, D, C, M> & {
  props: PropsOptions
} & ThisType<ComponentPublicInstance<Props, RawBindings, D, C, M>>
```
### ComponentOptions
> Component组件选项参数类型
```ts
export type ComponentOptions =
  | ComponentOptionsWithoutProps
  | ComponentOptionsWithProps
  | ComponentOptionsWithArrayProps

type LegacyComponent = ComponentOptions
```
### ComputedOptions
> computed选项参数类型
```ts
export interface ComputedOptions {
  [key: string]:
    | Function
    | {
        get: Function
        set: Function
      }
}
```
### MethodOptions
> method选项参数类型
```ts
export interface MethodOptions {
  [key: string]: Function
}
```
### ExtractComputedReturns
```ts
export type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends { get: Function }
    ? ReturnType<T[key]['get']>
    : ReturnType<T[key]>
}
```
### WatchHandler
> watch回调接口函数类型
```ts
type WatchHandler = (
  val: any,
  oldVal: any,
  onCleanup: CleanupRegistrator
) => void
```
### ComponentWatchOptions
> Watch选项参数类型
```ts
type ComponentWatchOptions = Record<
  string,
  string | WatchHandler | { handler: WatchHandler } & WatchOptions
>
```
### ComponentInjectOptions
> Inject选项参数类型
```ts
type ComponentInjectOptions =
  | string[]
  | Record<
      string | symbol,
      string | symbol | { from: string | symbol; default?: any }
    >
```
### LegacyOptions
> 基础Options类型
```ts
export interface LegacyOptions<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions
> {
  el?: any
  data?: D | ((this: ComponentPublicInstance<Props>) => D)
  computed?: C
  methods?: M

  watch?: ComponentWatchOptions
  provide?: Data | Function
  inject?: ComponentInjectOptions

  mixins?: LegacyComponent[]
  extends?: LegacyComponent

  beforeCreate?(): void
  created?(): void
  beforeMount?(): void
  mounted?(): void
  beforeUpdate?(): void
  updated?(): void
  activated?(): void
  deactivated?(): void
  beforeUnmount?(): void
  unmounted?(): void
  renderTracked?(e: DebuggerEvent): void
  renderTriggered?(e: DebuggerEvent): void
  errorCaptured?(): boolean | void
}
```

## 功能函数
### applyOptions()
> Options实例化
```ts
export function applyOptions(
  instance: ComponentInternalInstance,
  options: ComponentOptions,
  asMixin: boolean = false
) {
  ...
}
```
> 参数 `instance: ComponentInternalInstance` 组件实例
> 参数 `options: ComponentOptions` 组件选项参数
> 参数 `asMixin: boolean = false` 是否混合
> 内部机制
- `instance.renderContext` 渲染上下文
- `instance.renderProxy` ?
- `options`     选项参数解析与处理
- `instance.appContext`
- 
## 内部函数
### callSyncHook()
> 调用同步hook
```ts
function callSyncHook(
  name: 'beforeCreate' | 'created',
  options: ComponentOptions,
  ctx: any,
  globalMixins: ComponentOptions[]
) {
  ...
}
```
### callHookFromMixins()
> 调用mixins值的hook
```ts
function callHookFromMixins(
  name: 'beforeCreate' | 'created',
  mixins: ComponentOptions[],
  ctx: any
) {
```
### applyMixins()
> 属性混合
```ts
function applyMixins(
  instance: ComponentInternalInstance,
  mixins: ComponentOptions[]
) {
  for (let i = 0; i < mixins.length; i++) {
    applyOptions(instance, mixins[i], true)
  }
}
```