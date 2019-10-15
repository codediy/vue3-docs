## 功能说明
- v-if/v-else/v-else-if处理
## 实例对象
### transformIf
> v-if/v-else/v-else-if解析入口
```ts
export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
      ..
  }

)
```
## 内部函数
### createIfBranch
> 创建if分支
```ts
function createIfBranch(node: ElementNode, dir: DirectiveNode): IfBranchNode {
  return {
    type: NodeTypes.IF_BRANCH,
    loc: node.loc,
    condition: dir.name === 'else' ? undefined : dir.exp,
    children: node.tagType === ElementTypes.TEMPLATE ? node.children : [node]
  }
}
```
### createCodegenNodeForBranch
> 创建if分支
```ts
function createCodegenNodeForBranch(
  branch: IfBranchNode,
  index: number,
  context: TransformContext
): IfConditionalExpression | BlockCodegenNode {
    ...
}
```
### createChildrenCodegenNode
> 创建子节点
```ts
function createChildrenCodegenNode(
  branch: IfBranchNode,
  index: number,
  context: TransformContext
): CallExpression {
    ...
}
```