# 功能说明
> 组件的属性代理

## 类型接口
> 组件实例接口
> 对应的是`ComponentInternalInstance`
```ts
export type ComponentPublicInstance<
  P = {},
  B = {},
  D = {},
  C = {},
  M = {},
  PublicProps = P
> = {
  [key: string]: any
  $data: D
  $props: PublicProps
  $attrs: Data
  $refs: Data
  $slots: Data
  $root: ComponentInternalInstance | null
  $parent: ComponentInternalInstance | null
  $emit: (event: string, ...args: unknown[]) => void
} & P &
  UnwrapRef<B> &
  D &
  ExtractComputedReturns<C> &
  M
```

## 功能函数
### PublicInstanceProxyHandlers
> 属性代理接口
```ts
export const PublicInstanceProxyHandlers = {
    get(target: ComponentInternalInstance, key: string) {
        ...
    },
    has(_: any, key: string): boolean {
        ...
    },
    set(target: ComponentInternalInstance, key: string, value: any): boolean {
        ...
    }
}
```