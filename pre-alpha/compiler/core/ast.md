# 功能说明
> 语法节点类型

## TemplateNodeType

### Namespace
> 命名空间
```ts
export type Namespace = number
```
### Namespaces
> 命令空间枚举
```ts
export const enum Namespaces {
  HTML
}
```
### NodeTypes
> 节点类型枚举
```ts
export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  // codegen
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION
}
```
### ElementTypes
> 元素类型
```ts
export const enum ElementTypes {
  ELEMENT,
  COMPONENT,
  SLOT,
  TEMPLATE
}
```
### Node
> 节点基础类型
```ts
export interface Node {
  type: NodeTypes //节点类型
  loc: SourceLocation //源码位置
}
```

### SourceLocation
> 源代码位置类型
```ts
export interface SourceLocation {
  start: Position  //开始位置
  end: Position   //结束位置
  source: string  //源代码字符串
}
```
### Position
> 文本位置信息
```ts
export interface Position {
  offset: number // 字符串偏移
  line: number   // 行数
  column: number // 列数
}
```
### ParentNode
> 可以作为容器的节点
```ts
export type ParentNode = RootNode | ElementNode | IfBranchNode | ForNode
```
### ExpressionNode
> 表达式节点
```ts
export type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode
```

### TemplateChildNode
> 子节点类型
```ts
export type TemplateChildNode =
  | ElementNode
  | InterpolationNode
  | CompoundExpressionNode
  | TextNode
  | CommentNode
  | IfNode
  | ForNode
```
### RootNode
> 根节点类型
```ts
export interface RootNode extends Node {
  type: NodeTypes.ROOT
  children: TemplateChildNode[]
  helpers: symbol[]
  components: string[]
  directives: string[]
  hoists: JSChildNode[]
  codegenNode: TemplateChildNode | JSChildNode | undefined
}
```
### ElementNode
> 元素节点类型
```ts
export type ElementNode =
  | PlainElementNode
  | ComponentNode
  | SlotOutletNode
  | TemplateNode
```
### BaseElementNode
> 基础节点类型
```ts
export interface BaseElementNode extends Node {
  type: NodeTypes.ELEMENT
  ns: Namespace
  tag: string
  tagType: ElementTypes
  isSelfClosing: boolean
  props: Array<AttributeNode | DirectiveNode>
  children: TemplateChildNode[]
  codegenNode: CallExpression | SimpleExpressionNode | undefined
}
```
### PlainElementNode
> 包含简单表达式的节点类型
```ts
export interface PlainElementNode extends BaseElementNode {
  tagType: ElementTypes.ELEMENT
  codegenNode: ElementCodegenNode | undefined | SimpleExpressionNode // only when hoisted
}
```
### ComponentNode
> 组件节点类型
```ts
export interface ComponentNode extends BaseElementNode {
  tagType: ElementTypes.COMPONENT
  codegenNode: ComponentCodegenNode | undefined
}

```
### SlotOutletNode
> 
```ts
```
### TemplateNode
> 
```ts
```
### TextNode
> 文本节点
```ts
export interface TextNode extends Node {
  type: NodeTypes.TEXT
  content: string
  isEmpty: boolean
}
```
### CommentNode
> 注释节点
```ts
export interface CommentNode extends Node {
  type: NodeTypes.COMMENT
  content: string
}
```
### AttributeNode
> 属性节点
```ts
export interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE
  name: string
  value: TextNode | undefined
}
```
### DirectiveNode
> 指令属性节点
```ts
export interface DirectiveNode extends Node {
  type: NodeTypes.DIRECTIVE
  name: string
  exp: ExpressionNode | undefined
  arg: ExpressionNode | undefined
  modifiers: string[]
  // optional property to cache the expression parse result for v-for
  parseResult?: ForParseResult
}
```
### SimpleExpressionNode
> 简单表达式节点
```ts
export interface SimpleExpressionNode extends Node {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
  isStatic: boolean
  identifiers?: string[]
}
```
### InterpolationNode
> 插值表达式节点

```ts
export interface InterpolationNode extends Node {
  type: NodeTypes.INTERPOLATION
  content: ExpressionNode
}
```
### CompoundExpressionNode
> 合成属性表达式节点
```ts
export interface CompoundExpressionNode extends Node {
  type: NodeTypes.COMPOUND_EXPRESSION
  children: (
    | SimpleExpressionNode
    | InterpolationNode
    | TextNode
    | string
    | symbol)[]
  // an expression parsed as the params of a function will track
  // the identifiers declared inside the function body.
  identifiers?: string[]
}
```
### IfNode
> If指令节点
```ts
export interface IfNode extends Node {
  type: NodeTypes.IF
  branches: IfBranchNode[]
  codegenNode: IfCodegenNode
}
```
### IfBranchNode
> if分支节点
```ts
export interface IfBranchNode extends Node {
  type: NodeTypes.IF_BRANCH
  condition: ExpressionNode | undefined // else
  children: TemplateChildNode[]
}
```
### ForNode
> For节点
```ts
export interface ForNode extends Node {
  type: NodeTypes.FOR
  source: ExpressionNode
  valueAlias: ExpressionNode | undefined
  keyAlias: ExpressionNode | undefined
  objectIndexAlias: ExpressionNode | undefined
  children: TemplateChildNode[]
  codegenNode: ForCodegenNode
}
```
## jsExpressionNodeType

### JSChildNode
> js表达式节点
```ts
export type JSChildNode =
  | CallExpression
  | ObjectExpression
  | ArrayExpression
  | ExpressionNode
  | FunctionExpression
  | ConditionalExpression
  | SequenceExpression
```
### CallExpression
> 函数调用表达式
```ts
export interface CallExpression extends Node {
  type: NodeTypes.JS_CALL_EXPRESSION
  callee: string | symbol
  arguments: (
    | string
    | symbol
    | JSChildNode
    | TemplateChildNode
    | TemplateChildNode[])[]
}
```
### ObjectExpression
> 对象表达式
```ts
export interface ObjectExpression extends Node {
  type: NodeTypes.JS_OBJECT_EXPRESSION
  properties: Array<Property>
}
```
### Property
> 属性表达式
```ts
export interface Property extends Node {
  type: NodeTypes.JS_PROPERTY
  key: ExpressionNode
  value: JSChildNode
}
```
### ArrayExpression
> 数组表达式
```ts
export interface ArrayExpression extends Node {
  type: NodeTypes.JS_ARRAY_EXPRESSION
  elements: Array<string | JSChildNode>
}
```
### FunctionExpression
> 函数表达式
```ts
export interface FunctionExpression extends Node {
  type: NodeTypes.JS_FUNCTION_EXPRESSION
  params: ExpressionNode | ExpressionNode[] | undefined
  returns: TemplateChildNode | TemplateChildNode[] | JSChildNode
  newline: boolean
}
```
### SequenceExpression
> 序列表达式
```ts
export interface SequenceExpression extends Node {
  type: NodeTypes.JS_SEQUENCE_EXPRESSION
  expressions: JSChildNode[]
}
```
### ConditionalExpression
> 条件表达式
```ts
export interface ConditionalExpression extends Node {
  type: NodeTypes.JS_CONDITIONAL_EXPRESSION
  test: ExpressionNode
  consequent: JSChildNode
  alternate: JSChildNode
}
```

## CodegenNodeType

### PlainElementCodegenNode
> `createVNode()`参数类型
> `createVnode(tag,props.children?,patchFlag?,dynamicProps?)`
```ts
export interface PlainElementCodegenNode extends CallExpression {
  callee: typeof CREATE_VNODE | typeof CREATE_BLOCK
  arguments:  // tag, props, children, patchFlag, dynamicProps
    | [string | symbol]
    | [string | symbol, PropsExpression]
    | [string | symbol, 'null' | PropsExpression, TemplateChildNode[]]
    | [
        string | symbol,
        'null' | PropsExpression,
        'null' | TemplateChildNode[],
        string
      ]
    | [
        string | symbol,
        'null' | PropsExpression,
        'null' | TemplateChildNode[],
        string,
        string
      ]
}
```
### ElementCodegenNode
> 元素节点
```ts
export type ElementCodegenNode =
  | PlainElementCodegenNode
  | CodegenNodeWithDirective<PlainElementCodegenNode>
```
### PlainComponentCodegenNode
> `createVnode()`参数类型2
> `createVnode(Comp,props.slots?,patchFlag?,dynamicProps?)`
```ts
export interface PlainComponentCodegenNode extends CallExpression {
  callee: typeof CREATE_VNODE | typeof CREATE_BLOCK
  arguments:  // Comp, props, slots, patchFlag, dynamicProps
    | [string | symbol]
    | [string | symbol, PropsExpression]
    | [string | symbol, 'null' | PropsExpression, SlotsExpression]
    | [
        string | symbol,
        'null' | PropsExpression,
        'null' | SlotsExpression,
        string
      ]
    | [
        string | symbol,
        'null' | PropsExpression,
        'null' | SlotsExpression,
        string,
        string
      ]
}
```
### ComponentCodegenNode
```ts
export type ComponentCodegenNode =
  | PlainComponentCodegenNode
  | CodegenNodeWithDirective<PlainComponentCodegenNode>
```
### SlotExpression
```ts
export type SlotsExpression = SlotsObjectExpression | DynamicSlotsExpression
```
### SlotsObjectExpression
> slot是对象参数
```ts
export interface SlotsObjectExpression extends ObjectExpression {
  properties: SlotsObjectProperty[]
}
```
### SlotsObjectProperty
> slot对象中的属性
```ts
export interface SlotsObjectProperty extends Property {
  value: SlotFunctionExpression
}
```
### SlotFunctionExpression
> slot包含属性值函数类型
```ts
export interface SlotFunctionExpression extends FunctionExpression {
  returns: TemplateChildNode[]
}
```
### DynamicSlotsExpression
> slot动态表达式
```ts
export interface DynamicSlotsExpression extends CallExpression {
  callee: typeof CREATE_SLOTS
  arguments: [SlotsObjectExpression, DynamicSlotEntries]
}
```
### DynamicSlotEntries
> 
```ts
export interface DynamicSlotEntries extends ArrayExpression {
  elements: (ConditionalDynamicSlotNode | ListDynamicSlotNode)[]
}
```
### ConditionalDynamicSlotNode
```ts
export interface ConditionalDynamicSlotNode extends ConditionalExpression {
  consequent: DynamicSlotNode
  alternate: DynamicSlotNode | SimpleExpressionNode
}
```

### ListDynamicSlotNode
> 列表渲染
```ts
export interface ListDynamicSlotNode extends CallExpression {
  callee: typeof RENDER_LIST
  arguments: [ExpressionNode, ListDynamicSlotIterator]
}
```
### ListDynamicSlotIterator
```ts
export interface ListDynamicSlotIterator extends FunctionExpression {
  returns: DynamicSlotNode
}
```
### DynamicSlotNode
```ts
export interface DynamicSlotNode extends ObjectExpression {
  properties: [Property, DynamicSlotFnProperty]
}
```
### DynamicSlotFnProperty
```ts
export interface DynamicSlotFnProperty extends Property {
  value: SlotFunctionExpression
}
```
### CodegenNodeWithDirective
> 指令调用
```ts
export interface CodegenNodeWithDirective<T extends CallExpression>
  extends CallExpression {
  callee: typeof APPLY_DIRECTIVES
  arguments: [T, DirectiveArguments]
}
```
### DirectiveArguments
> 指令参数组
```ts
export interface DirectiveArguments extends ArrayExpression {
  elements: DirectiveArgumentNode[]
}
```
### DirectiveArgumentNode
> 指令参数
> dir:指令,exp:表达式,arg:参数,modifiers:修饰符
```ts
export interface DirectiveArgumentNode extends ArrayExpression {
  elements:  // dir, exp, arg, modifiers
    | [string]
    | [string, ExpressionNode]
    | [string, ExpressionNode, ExpressionNode]
    | [string, ExpressionNode, ExpressionNode, ObjectExpression]
}
```
### SlotOutletCodegenNode
>  slot渲染
```ts
export interface SlotOutletCodegenNode extends CallExpression {
  callee: typeof RENDER_SLOT
  arguments:  // $slots, name, props, fallback
    | [string, string | ExpressionNode]
    | [string, string | ExpressionNode, PropsExpression]
    | [
        string,
        string | ExpressionNode,
        PropsExpression | '{}',
        TemplateChildNode[]
      ]
}
```
### BlockCodegenNode
```ts
export type BlockCodegenNode =
  | ElementCodegenNode
  | ComponentCodegenNode
  | SlotOutletCodegenNode

```
### IfCodegenNode
> if生成节点
```ts
export interface IfCodegenNode extends SequenceExpression {
  expressions: [OpenBlockExpression, IfConditionalExpression]
}
```
### IfCoditionExpression
> if表达式条件节点
```ts
export interface IfConditionalExpression extends ConditionalExpression {
  consequent: BlockCodegenNode
  alternate: BlockCodegenNode | IfConditionalExpression
}
```
### ForCodegenNode
> for表达式节点
```ts
export interface ForCodegenNode extends SequenceExpression {
  expressions: [OpenBlockExpression, ForBlockCodegenNode]
}
```
### ForBlockCodegenNode
> for块表达式
```ts
export interface ForBlockCodegenNode extends CallExpression {
  callee: typeof CREATE_BLOCK
  arguments: [typeof FRAGMENT, 'null', ForRenderListExpression, string]
}
```
### ForRenderListExpression
> for渲染表达式
```ts
export interface ForRenderListExpression extends CallExpression {
  callee: typeof RENDER_LIST
  arguments: [ExpressionNode, ForIteratorExpression]
}
```
### ForIteratorExpression
> for循环表达式
```ts
export interface ForIteratorExpression extends FunctionExpression {
  returns: BlockCodegenNode
}
```
### OpenBlockExpression
> openBlock ?
```ts
export interface OpenBlockExpression extends CallExpression {
  callee: typeof OPEN_BLOCK
  arguments: []
}
```
### InferCodegenNodeType
> 
```ts
type InferCodegenNodeType<T> = T extends
  | typeof CREATE_VNODE
  | typeof CREATE_BLOCK
  ? PlainElementCodegenNode | PlainComponentCodegenNode
  : T extends typeof APPLY_DIRECTIVES
    ?
        | CodegenNodeWithDirective<PlainElementCodegenNode>
        | CodegenNodeWithDirective<PlainComponentCodegenNode>
    : T extends typeof RENDER_SLOT ? SlotOutletCodegenNode : CallExpression
```

## 实例对象
### SourceLocation
> 默认源代码位置
```ts
export const locStub: SourceLocation = {
  source: '',
  start: { line: 1, column: 1, offset: 0 },
  end: { line: 1, column: 1, offset: 0 }
}
```
## 功能函数
### createArrayExpression
> 创建数组表达式
```ts
export function createArrayExpression(
  elements: ArrayExpression['elements'],
  loc: SourceLocation = locStub
): ArrayExpression {
  return {
    type: NodeTypes.JS_ARRAY_EXPRESSION,
    loc,
    elements
  }
}
```
### createObjectExpression
> 创建对象表达式
```ts
export function createObjectExpression(
  properties: ObjectExpression['properties'],
  loc: SourceLocation = locStub
): ObjectExpression {
  return {
    type: NodeTypes.JS_OBJECT_EXPRESSION,
    loc,
    properties
  }
}
```
### createObjectProperty
> 创建对象属性表达式
```ts
export function createObjectProperty(
  key: Property['key'] | string,
  value: Property['value']
): Property {
  return {
    type: NodeTypes.JS_PROPERTY,
    loc: locStub,
    key: isString(key) ? createSimpleExpression(key, true) : key,
    value
  }
}
```
### createSimpleExpression
> 创建简单表达式
```ts
export function createSimpleExpression(
  content: SimpleExpressionNode['content'],
  isStatic: SimpleExpressionNode['isStatic'],
  loc: SourceLocation = locStub
): SimpleExpressionNode {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    loc,
    content,
    isStatic
  }
}

```
### createInterpolation
> 
```ts
export function createInterpolation(
  content: InterpolationNode['content'] | string,
  loc: SourceLocation
): InterpolationNode {
  return {
    type: NodeTypes.INTERPOLATION,
    loc,
    content: isString(content)
      ? createSimpleExpression(content, false, loc)
      : content
  }
}
```
### createCompoundExpression
> 
```ts
export function createCompoundExpression(
  children: CompoundExpressionNode['children'],
  loc: SourceLocation = locStub
): CompoundExpressionNode {
  return {
    type: NodeTypes.COMPOUND_EXPRESSION,
    loc,
    children
  }
}
```
### createCallExpression
> 函数调用表达式
```ts
export function createCallExpression<T extends CallExpression['callee']>(
  callee: T,
  args: CallExpression['arguments'] = [],
  loc: SourceLocation = locStub
): InferCodegenNodeType<T> {
  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    loc,
    callee,
    arguments: args
  } as any
}
```
### createFunctionExpression
> 创建函数表达式
```ts
export function createFunctionExpression(
  params: FunctionExpression['params'],
  returns: FunctionExpression['returns'],
  newline: boolean = false,
  loc: SourceLocation = locStub
): FunctionExpression {
  return {
    type: NodeTypes.JS_FUNCTION_EXPRESSION,
    params,
    returns,
    newline,
    loc
  }
}
```
### createSequenceExpression
>  创建序列表达式
```ts
export function createSequenceExpression(
  expressions: SequenceExpression['expressions']
): SequenceExpression {
  return {
    type: NodeTypes.JS_SEQUENCE_EXPRESSION,
    expressions,
    loc: locStub
  }
}
```
### createConditionalExpression
> 创建条件表达式
```ts
export function createConditionalExpression(
  test: ConditionalExpression['test'],
  consequent: ConditionalExpression['consequent'],
  alternate: ConditionalExpression['alternate']
): ConditionalExpression {
  return {
    type: NodeTypes.JS_CONDITIONAL_EXPRESSION,
    test,
    consequent,
    alternate,
    loc: locStub
  }
}
```
## 内部函数