## baseParse()

```typescript

export function baseParse(
  content: string,
  options: ParserOptions = {}
): RootNode {
  const context = createParserContext(content, options)
  const start = getCursor(context)
  return createRoot(
    parseChildren(context, TextModes.DATA, []),
    getSelection(context, start)
  )
}
```

- `content` 待处理的模板内容
- `options` 解析器的控制选项
- 创建解析上下文，获取当前解析位置，
- `createRoot()` 创建语法树根节点，并递归解析子节点`parseChildren`

## createParserContext()

```typescript

 function createParserContext(
  content: string,
  rawOptions: ParserOptions
): ParserContext {
  const options = extend({}, defaultParserOptions)
  for (const key in rawOptions) {
    // @ts-ignore
    options[key] = rawOptions[key] || defaultParserOptions[key]
  }
  return {
    options,
    column: 1,
    line: 1,
    offset: 0,
    originalSource: content,
    source: content,
    inPre: false,
    inVPre: false
  }
}
 ```
- `content` 待处理的模板内容
- `options` 解析器的控制选项
- 合并解析器选项，并输出

## getCursor()
```typescript
function getCursor(context: ParserContext): Position {
  const { column, line, offset } = context
  return { column, line, offset }
}
```
- 读取解析上下文中的位置信息

## createRoot()
[createRoot()](.ast.md?line=1)

## parseChildren()

```typescript 

function parseChildren(
  context: ParserContext,
  mode: TextModes,
  ancestors: ElementNode[]
): TemplateChildNode[] {

}
```

- 解析的核心处理过程

## getSelection()
```typescript
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
- 读取当前解析的文本内容

## parseInterpolation()
```json

function parseInterpolation(
  context: ParserContext,
  mode: TextModes
): InterpolationNode | undefined   
{}

```

- 解析插入语句

## parseElement() 
      


  