# 功能说明
## v-bind转换处理

## 功能函数
### transformBind
> v-bind处理
```ts
export const transformBind: DirectiveTransform = (dir, node, context) => {
  //指令参数检查
  const { exp, modifiers, loc } = dir
  const arg = dir.arg!
  if (!exp) {
    context.onError(createCompilerError(ErrorCodes.X_V_BIND_NO_EXPRESSION, loc))
  }

  // 修饰符处理
  if (modifiers.includes('camel')) {
    if (arg.type === NodeTypes.SIMPLE_EXPRESSION) {
      if (arg.isStatic) {
        arg.content = camelize(arg.content)
      } else {
        arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`
      }
    } else {
      arg.children.unshift(`${context.helperString(CAMELIZE)}(`)
      arg.children.push(`)`)
    }
  }

  //返回转换后
   return {
    props: [
      createObjectProperty(arg!, exp || createSimpleExpression('', true, loc))
    ],
    needRuntime: false
  }
}
```