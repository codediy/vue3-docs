# 功能说明
> 组件创建接口

## 类型
## 功能函数
### createComponent
> 重建组件接口
> 使用ts的函数重载功能

- setup参数
```ts
export function createComponent<Props>(
  setup: (props: Props, ctx: SetupContext) => object | (() => VNodeChild)
): (props: Props) => any
```
- withoutProps参数
```ts
export function createComponent<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithoutProps<Props, RawBindings, D, C, M>
): {
  new (): ComponentPublicInstance<Props, RawBindings, D, C, M>
}
```
- ArrayProps
```ts
export function createComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithArrayProps<PropNames, RawBindings, D, C, M>
): {
  new (): ComponentPublicInstance<
    { [key in PropNames]?: unknown },
    RawBindings,
    D,
    C,
    M
  >
}
```
- ObjectProps
```ts
export function createComponent<
  PropsOptions,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
>(
  options: ComponentOptionsWithProps<PropsOptions, RawBindings, D, C, M>
): {
  // for Vetur and TSX support
  new (): ComponentPublicInstance<
    ExtractPropTypes<PropsOptions>,
    RawBindings,
    D,
    C,
    M,
    ExtractPropTypes<PropsOptions, false>
  >
}
```
- implementation
```ts
export function createComponent(options: any) {
  return isFunction(options) ? { setup: options } : options
}
```
## 内部函数