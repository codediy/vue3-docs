# 功能说明
> 辅助函数注册

## 实例对象

### 常量符号
> 函数名称索引标志符
```ts
export const FRAGMENT = Symbol(__DEV__ ? `Fragment` : ``)
export const PORTAL = Symbol(__DEV__ ? `Portal` : ``)
export const COMMENT = Symbol(__DEV__ ? `Comment` : ``)
export const TEXT = Symbol(__DEV__ ? `Text` : ``)
export const SUSPENSE = Symbol(__DEV__ ? `Suspense` : ``)
export const OPEN_BLOCK = Symbol(__DEV__ ? `openBlock` : ``)
export const CREATE_BLOCK = Symbol(__DEV__ ? `createBlock` : ``)
export const CREATE_VNODE = Symbol(__DEV__ ? `createVNode` : ``)
export const RESOLVE_COMPONENT = Symbol(__DEV__ ? `resolveComponent` : ``)
export const RESOLVE_DIRECTIVE = Symbol(__DEV__ ? `resolveDirective` : ``)
export const APPLY_DIRECTIVES = Symbol(__DEV__ ? `applyDirectives` : ``)
export const RENDER_LIST = Symbol(__DEV__ ? `renderList` : ``)
export const RENDER_SLOT = Symbol(__DEV__ ? `renderSlot` : ``)
export const CREATE_SLOTS = Symbol(__DEV__ ? `createSlots` : ``)
export const TO_STRING = Symbol(__DEV__ ? `toString` : ``)
export const MERGE_PROPS = Symbol(__DEV__ ? `mergeProps` : ``)
export const TO_HANDLERS = Symbol(__DEV__ ? `toHandlers` : ``)
export const CAMELIZE = Symbol(__DEV__ ? `camelize` : ``)
```
### helperNameMap
> 模板编译的函数名
> `runtime-core`中对应
```ts
export const helperNameMap: any = {
  [FRAGMENT]: `Fragment`,
  [PORTAL]: `Portal`,
  [COMMENT]: `Comment`,
  [TEXT]: `Text`,
  [SUSPENSE]: `Suspense`,
  [OPEN_BLOCK]: `openBlock`,
  [CREATE_BLOCK]: `createBlock`,
  [CREATE_VNODE]: `createVNode`,
  [RESOLVE_COMPONENT]: `resolveComponent`,
  [RESOLVE_DIRECTIVE]: `resolveDirective`,
  [APPLY_DIRECTIVES]: `applyDirectives`,
  [RENDER_LIST]: `renderList`,
  [RENDER_SLOT]: `renderSlot`,
  [CREATE_SLOTS]: `createSlots`,
  [TO_STRING]: `toString`,
  [MERGE_PROPS]: `mergeProps`,
  [TO_HANDLERS]: `toHandlers`,
  [CAMELIZE]: `camelize`
}
```
## 功能函数
### registerRuntimeHelpers
> 注册模板函数
```ts
export function registerRuntimeHelpers(helpers: any) {
  Object.getOwnPropertySymbols(helpers).forEach(s => {
    helperNameMap[s] = helpers[s]
  })
}
```