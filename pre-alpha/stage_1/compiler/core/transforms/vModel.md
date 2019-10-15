# 功能说明
> v-model处理

## 实例对象
### transformModel
> v-model处理
```ts
export const transformModel: DirectiveTransform = (dir, node, context) => {
    ...
}
```
## 内部函数
### createTransformProps
> 生成transform
```ts
function createTransformProps(props: Property[] = []) {
  return { props, needRuntime: false }
}
```