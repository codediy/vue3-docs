## baseCompile()
```typescript
export function baseCompile(
  template: string | RootNode,
  options: CompilerOptions = {}
): CodegenResult {}

```
- 模板编译处理
- 注册编译错误处理
- 1 模板解析   baseParse()
- 注册转换器 getBaseTransformPreset()
- 2 转换处理   transform()
- 3 代码生成   generate()

## getBaseTransformPreset()
```typescript
export function getBaseTransformPreset(
  prefixIdentifiers?: boolean
): TransformPreset {
  return [
    [
      transformOnce,
      transformIf,
      transformFor,
      ...(!__BROWSER__ && prefixIdentifiers
        ? [
            // order is important
            trackVForSlotScopes,
            transformExpression
          ]
        : __BROWSER__ && __DEV__
          ? [transformExpression]
          : []),
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ]
}
```
- 获取内置转换器
- 返回的节点转换器，指令转换器

