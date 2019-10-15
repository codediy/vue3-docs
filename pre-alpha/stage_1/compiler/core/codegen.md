# 功能说明
> 代码生成

## 类型接口
### CodegenNode
> 生成的节点类型
> 模板节点/js节点
```ts
type CodegenNode = TemplateChildNode | JSChildNode
```
### CodegenOptions
> 生成选项
```ts
export interface CodegenOptions {
    mode?: 'module' | 'function'
    prefixIdentifiers?: boolean
    sourceMap?: boolean
    filename?: string
}
```
### CodegenResult
> 解析结果
```ts
export interface CodegenResult {
  code: string  //生成的代码
  ast: RootNode  //ast节点
  map?: RawSourceMap //sourceMap
}

```
### CodegenContext
> 代码生成上下文类型
```ts
export interface CodegenContext extends Required<CodegenOptions> {
    source: string
    code: string
    line: number
    column: number
    offset: number
    indentLevel: number

    map?: SourceMapGenerator

    helper(key: symbol): string
    push(code: string, node?: CodegenNode, openOnly?: boolean): void
    resetMapping(loc: SourceLocation): void
    indent(): void
    deindent(withoutNewLine?: boolean): void
    newline(): void
}
```
## 功能函数
### generate
> 从ast节点生成js表达式入口
```ts
export function generate(
  ast: RootNode,
  options: CodegenOptions = {}
): CodegenResult {
    ..
}
```
## 内部函数
### createCodegenContext
> 初始化代码生成上下文
```ts
function createCodegenContext(
  ast: RootNode,
  {
    mode = 'function',
    prefixIdentifiers = mode === 'module',
    sourceMap = false,
    filename = `template.vue.html`
  }: CodegenOptions
): CodegenContext {
```
### newline
> 添加换行符
```ts
function newline(n: number) {
    ...
}
```
### addMapping
> source-map生成
```ts
function addMapping(loc: Position, name?: string) {
    ...
}
```

### genAssets
> 常量表达式
```ts
function genAssets(
  assets: string[],
  type: 'component' | 'directive',
  context: CodegenContext
) {
    ...
}
```
### genHoists
> 占位常量
```ts
function genHoists(hoists: JSChildNode[], context: CodegenContext) {
    ...
}
```
### isText
> 是否是文本节点
```ts
function isText(n: string | CodegenNode) {
  return (
    isString(n) ||  //字符串
    n.type === NodeTypes.SIMPLE_EXPRESSION ||  //简单表达式
    n.type === NodeTypes.TEXT || //文本表达式
    n.type === NodeTypes.INTERPOLATION || //插值表达式
    n.type === NodeTypes.COMPOUND_EXPRESSION //组合表达式
  )
}
```
### genNodeListAsArray
> 生成节点数组
```ts
function genNodeListAsArray(
  nodes: (string | CodegenNode | TemplateChildNode[])[],
  context: CodegenContext
) {
    ...
}
```
### genNodeList
> 节点数组处理
```ts
function genNodeList(
  nodes: (string | symbol | CodegenNode | TemplateChildNode[])[],
  context: CodegenContext,
  multilines: boolean = false
) {
    ...
}
```
### genNode
> 单个节点处理入口
```ts
function genNode(node: CodegenNode | symbol | string, context: CodegenContext) {
    ...
}
```
### genText
> 文本节点处理
```ts
function genText(
  node: TextNode | SimpleExpressionNode,
  context: CodegenContext
) {
```
### genExpression
> 简单表达式处理
```ts
function genExpression(node: SimpleExpressionNode, context: CodegenContext) {
    ...
}
```
### genInterpolation
> 插值表达式处理
```ts
function genInterpolation(node: InterpolationNode, context: CodegenContext) {
    ...
}
```
### genCompoundExpression
>  `CompoundExpressionNode` 组合表达式计算
```ts
function genCompoundExpression(
  node: CompoundExpressionNode,
  context: CodegenContext
) {
    ...
}
```
### genExpressionAsPropertyKey
> 表达式属性处理
```ts
function genExpressionAsPropertyKey(
  node: ExpressionNode,
  context: CodegenContext
) {
    ...
}
```
### genComment
> `CommentNode`注释节点处理
```ts
function genComment(node: CommentNode, context: CodegenContext) {
    ...
}
```
### genCallExpression
> `CallExpression`表达式处理
```ts
function genCallExpression(node: CallExpression, context: CodegenContext) {
```
### genObjectExpression
>`ObjectExpression`表达式处理
```ts
function genObjectExpression(node: ObjectExpression, context: CodegenContext) {
}
```
### genArrayExpression
> `ArrayExpression`表达式处理
```ts
function genArrayExpression(node: ArrayExpression, context: CodegenContext) {
  genNodeListAsArray(node.elements, context)
}
```
### genFunctionExpression
> `FunctionExpression`表达式处理
```ts
function genFunctionExpression(
  node: FunctionExpression,
  context: CodegenContext
) {
    ...
}
```
### genConditionalExpression
> `ConditionalExpression`表达式处理
```ts
function genConditionalExpression(
  node: ConditionalExpression,
  context: CodegenContext
) {
    ...
}
```
### genSequenceExpression
> `SequenceExpression`处理
```ts
function genSequenceExpression(
  node: SequenceExpression,
  context: CodegenContext
) {
  context.push(`(`)
  genNodeList(node.expressions, context)
  context.push(`)`)
}
```
