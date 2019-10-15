# 功能说明
> 代码转换处理

## 类型接口
### NodeTransform
> 节点转换处理函数类型
```ts
export type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext
) => void | (() => void) | (() => void)[]
```
### DirectiveTransform
> (简单)指令转换处理函数类型
```ts
export type DirectiveTransform = (
  dir: DirectiveNode,
  node: ElementNode,
  context: TransformContext
) => {
  props: Property[]
  needRuntime: boolean | symbol
}
```
### StructuralDirectiveTransform
> 结构化指令转换处理函数类型(v-if,v-for)
```ts
export type StructuralDirectiveTransform = (
  node: ElementNode,
  dir: DirectiveNode,
  context: TransformContext
) => void | (() => void)
```
### TransformOptions
> 转换配置项
```ts
export interface TransformOptions {
  nodeTransforms?: NodeTransform[]
  directiveTransforms?: { [name: string]: DirectiveTransform }
  prefixIdentifiers?: boolean
  hoistStatic?: boolean
  onError?: (error: CompilerError) => void
}
```
### TransformContext
> 转换配置上下文
```ts
export interface TransformContext extends Required<TransformOptions> {
  root: RootNode
  helpers: Set<symbol>
  components: Set<string>
  directives: Set<string>
  hoists: JSChildNode[]
  identifiers: { [name: string]: number | undefined }
  scopes: {
    vFor: number
    vSlot: number
    vPre: number
    vOnce: number
  }
  parent: ParentNode | null
  childIndex: number
  currentNode: RootNode | TemplateChildNode | null
  helper<T extends symbol>(name: T): T
  helperString(name: symbol): string
  replaceNode(node: TemplateChildNode): void
  removeNode(node?: TemplateChildNode): void
  onNodeRemoved: () => void
  addIdentifiers(exp: ExpressionNode | string): void
  removeIdentifiers(exp: ExpressionNode | string): void
  hoist(exp: JSChildNode): SimpleExpressionNode
}
```
## 功能函数
### createTransformContext
> 初始化转换上下文
```ts
function createTransformContext(
  root: RootNode,
  {
    prefixIdentifiers = false,
    hoistStatic = false,
    nodeTransforms = [],
    directiveTransforms = {},
    onError = defaultOnError
  }: TransformOptions
): TransformContext {
    ...
}
```
### transform
> 转换入口
```ts
export function transform(root: RootNode, options: TransformOptions) {
    ...
}
```
### traverseChildren
> 转换子节点
```ts
export function traverseChildren(
  parent: ParentNode,
  context: TransformContext
) {
    ...
}
```
### traverseNode
> 单个节点转换处理
```ts
export function traverseNode(
  node: RootNode | TemplateChildNode,
  context: TransformContext
) {
    ...
}
```
### createStructuralDirectiveTransform
> 创建结构化指令
> v-for,v-if
```ts
export function createStructuralDirectiveTransform(
  name: string | RegExp,
  fn: StructuralDirectiveTransform
): NodeTransform {
    ...
}
```
## 内部函数
### finalizeRoot
> 转换后处理
```ts
function finalizeRoot(root: RootNode, context: TransformContext) {
    ...
}
```
