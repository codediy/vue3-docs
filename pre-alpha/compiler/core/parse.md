# 功能说明
> 模板解析

## 类型接口
### ParserOptions
> 解析配置项
```ts
export interface ParserOptions {
  isVoidTag?: (tag: string) => boolean // e.g. img, br, hr
  isNativeTag?: (tag: string) => boolean // e.g. loading-indicator in weex
  getNamespace?: (tag: string, parent: ElementNode | undefined) => Namespace
  getTextMode?: (tag: string, ns: Namespace) => TextModes
  delimiters?: [string, string] // ['{{', '}}']
  ignoreSpaces?: boolean

  // Map to HTML entities. E.g., `{ "amp;": "&" }`
  // The full set is https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
  namedCharacterReferences?: { [name: string]: string | undefined }

  onError?: (error: CompilerError) => void
}
```
### MergedParserOptions
> 解析的配置项类型
```ts
type MergedParserOptions = Pick<
  Required<ParserOptions>,
  Exclude<keyof ParserOptions, 'isNativeTag'>
> &
  Pick<ParserOptions, 'isNativeTag'>
```
### TextModes
> 解析模式
```ts
export const enum TextModes {
  DATA, //    | ✔       | ✔       | End tags of ancestors |
  RCDATA, //  | ✘       | ✔       | End tag of the parent | <textarea>
  RAWTEXT, // | ✘       | ✘       | End tag of the parent | <style>,<script>
  CDATA,
  ATTRIBUTE_VALUE
}
````
### ParserContext
> 解析上下文
```ts
interface ParserContext {
  options: MergedParserOptions
  readonly originalSource: string
  source: string
  offset: number
  line: number
  column: number
  maxCRNameLength: number
  inPre: boolean
}
```
### TagType
> 标签类型
```ts
const enum TagType {
  Start,
  End
}
```
## 实例对象
### defaultParserOptions
> 默认解析配置项
```ts
export const defaultParserOptions: MergedParserOptions = {
  delimiters: [`{{`, `}}`], //插值开始与结束标志符
  ignoreSpaces: true,        //是否忽略空格
  getNamespace: () => Namespaces.HTML, //命名空间
  getTextMode: () => TextModes.DATA, //问你模式
  isVoidTag: NO, //无效标签
  namedCharacterReferences: {  //转义标签
    'gt;': '>',
    'lt;': '<',
    'amp;': '&',
    'apos;': "'",
    'quot;': '"'
  },
  onError: defaultOnError //错误处理
}
```
### CCR_REPLACEMENTS
> 
```ts

```

## 功能函数
### parse
> 模板解析入口
```ts
export function parse(content: string, options: ParserOptions = {}): RootNode {
```
## 内部函数

### createParserContext
> 初始化解析上下文
```ts
function createParserContext(
  content: string,
  options: ParserOptions
): ParserContext {
}
```
### parseChildren
> 解析子节点序列
```ts
function parseChildren(
  context: ParserContext,
  mode: TextModes,
  ancestors: ElementNode[]
): TemplateChildNode[] {
    ...
}
```
### pushNode
> 收集解析后的节点
```ts
function pushNode(
  context: ParserContext,
  nodes: TemplateChildNode[],
  node: TemplateChildNode
): void {
```
### parseCDATA
> CDATA文本解析
```ts
function parseCDATA(
  context: ParserContext,
  ancestors: ElementNode[]
): TemplateChildNode[] {
    ...
}
```
### parseComment
> 解析注释文本
```ts
function parseComment(context: ParserContext): CommentNode {
    ...
}
```
### parseBogusComment
> 解析伪造的注释(<!DOCTYPE)
```ts
function parseBogusComment(context: ParserContext): CommentNode | undefined {
```
### parseElement
> 解析标签元素
```ts
function parseElement(
  context: ParserContext,
  ancestors: ElementNode[]
): ElementNode | undefined {
    ...
}
```
### parseTag
> 解析标签处理
```ts
function parseTag(
  context: ParserContext,
  type: TagType,
  parent: ElementNode | undefined
): ElementNode {
    ...
}
```
### parseAttributes
> 解析多个属性
```ts
function parseAttributes(
  context: ParserContext,
  type: TagType
): (AttributeNode | DirectiveNode)[] {
    ...
}
```
### parseAttribute
> 解析单个属性
```ts
function parseAttribute(
  context: ParserContext,
  nameSet: Set<string>
): AttributeNode | DirectiveNode {
    ...
}
```
### parseAttributeValue
> 解析属性值
```ts
function parseAttributeValue(
  context: ParserContext
):
  | {
      content: string
      isQuoted: boolean
      loc: SourceLocation
    }
  | undefined {
      ...
  }
```
### parseInterpolation
> 解析插值表达式
```ts
function parseInterpolation(
  context: ParserContext,
  mode: TextModes
): InterpolationNode | undefined {

}
```

### parseText
> 解析文本内容
```ts
function parseText(context: ParserContext, mode: TextModes): TextNode {
    ...
}
```
### parseTextData
> 解析文本内容
```ts
function parseTextData(
  context: ParserContext,
  length: number,
  mode: TextModes
): string {
 ...
}
```
### getCursor
> 获取当前解析的光标位置
```ts
function getCursor(context: ParserContext): Position {
  const { column, line, offset } = context
  return { column, line, offset }
}
```
### getSelection
> 获取某段源代码字符串
```ts
function getSelection(
  context: ParserContext,
  start: Position,
  end?: Position
): SourceLocation {
  end = end || getCursor(context)
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  }
}
```
### last
> 数组最好一个元素
```ts
function last<T>(xs: T[]): T | undefined {
  return xs[xs.length - 1]
}
```
### startsWith
> 判断字符串开头
```ts
function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString)
}
```
### advanceBy
> 跳过N个字符
```ts
function advanceBy(context: ParserContext, numberOfCharacters: number): void {
  const { source } = context
  __DEV__ && assert(numberOfCharacters <= source.length)
  advancePositionWithMutation(context, source, numberOfCharacters)
  context.source = source.slice(numberOfCharacters)
}
```
### advanceSpaces
> 跳过空格
```ts

function advanceSpaces(context: ParserContext): void {
  const match = /^[\t\r\n\f ]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}
```
### getNewPosition
> 获取新的位置信息
```ts
function getNewPosition(
  context: ParserContext,
  start: Position,
  numberOfCharacters: number
): Position {

}
```
### emitError
> 解析错误信息
```ts
function emitError(
  context: ParserContext,
  code: ErrorCodes,
  offset?: number
): void {
    ...
}
```
### isEnd
> 是否解析完成
```ts
function isEnd(
  context: ParserContext,
  mode: TextModes,
  ancestors: ElementNode[]
): boolean {
    ...
}
```
### startsWithEndTagOpen
> 是否结束标签
```ts
function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    startsWith(source, '</') &&
    source.substr(2, tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\n\f />]/.test(source[2 + tag.length] || '>')
  )
}
```