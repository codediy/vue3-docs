# 功能说明
> v-for解析

## 类型接口
### ForParseResult
> for解析结果
```ts
export interface ForParseResult {
  source: ExpressionNode
  value: ExpressionNode | undefined
  key: ExpressionNode | undefined
  index: ExpressionNode | undefined
}
```
## 实例对象

### transformFor
> 创建v-for转换
```ts
export const transformFor = createStructuralDirectiveTransform(
  'for',
  (node, dir, context) => {
      ...
  }
)
```
## 正则表达式
### forAliasRE
### forIteratorRE
### stripParensRE

## 功能函数
### parseForExpression
> v-for="exp"中exp解析
```ts
export function parseForExpression(
  input: SimpleExpressionNode,
  context: TransformContext
): ForParseResult | undefined {
    ...
}
```
### createForLoopParams
> 创建v-for参数
```ts
export function createForLoopParams({
  value,
  key,
  index
}: ForParseResult): ExpressionNode[] {
    ...
}
```
## 内部函数
### createAliasExpression
> 创建别名表达式
```ts
function createAliasExpression(
  range: SourceLocation,
  content: string,
  offset: number
): SimpleExpressionNode {
    ...
}
```
