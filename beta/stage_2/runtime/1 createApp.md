
## createApp()接口

1. createApp()
- runtime-dom/src/index.ts
- 全局app创建接口
- 与app同级别的是render()接口

```typescript
const { render, createApp } = createRenderer<Node, Element>({
   patchProp,
   ...nodeOps
 })
```

2. ensureRenderer()
- runtime-dom/src/index.ts
- 全局render创建接口

3. createRender()
- runtime-core/src/renderer.ts
- 全局render实例化接口

4. baseCreateRenderer()
- runtime-core/src/renderer.ts
- 全局render实例化接口

``` typescript
const internals: RendererInternals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
}
.....
return {
  render,
  hydrate,
  createApp: createAppAPI(render, hydrate)
}
```

## createApp() 流程
1. render.createApp()
2. createAppAPI()
- runtime-core/src/apiCreateApp.ts
- 返回一个函数createApp()
