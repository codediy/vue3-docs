## transform()

```typescript
export function transform(root: RootNode, options: TransformOptions) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  if (options.hoistStatic) {
    hoistStatic(root, context)
  }
  if (!options.ssr) {
    createRootCodegen(root, context)
  }
  // finalize meta information
  root.helpers = [...context.helpers]
  root.components = [...context.components]
  root.directives = [...context.directives]
  root.imports = [...context.imports]
  root.hoists = context.hoists
  root.temps = context.temps
  root.cached = context.cached
}
```

- 语法树转换处理

## traverseNode
```typescript
export function traverseNode(
  node: RootNode | TemplateChildNode,
  context: TransformContext
) {}

```

- 递归转换处理

## traverseChildren
```typescript
export function traverseChildren(
  parent: ParentNode,
  context: TransformContext
) {}
```

- 转换子节点































