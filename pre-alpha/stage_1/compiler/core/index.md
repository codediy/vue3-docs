## 功能说明
> 导出到全局的接口

## 类型接口
### CompilerOptions
> 编译配置项包含三部分
> 解析配置项(ParserOptions),
> 转换配置项(TransformOptions),
> 代码生成配置项(CodegenOptions)
```ts
export type CompilerOptions = ParserOptions & TransformOptions & CodegenOptions;
```
## 功能函数
### baseCompile
> 模板编译入口
```ts
export function baseCompile(
  template: string | RootNode,
  options: CompilerOptions = {}
): CodegenResult {
    ...
    /* 
    1 parse
    2 transform
    3 generate
    */
}
```
## 其他接口
> 导出的`parse`,`transform`,`codegen`等内部接口
```ts
export { parse, ParserOptions, TextModes } from './parse'
export {
  transform,
  createStructuralDirectiveTransform,
  TransformOptions,
  TransformContext,
  NodeTransform,
  StructuralDirectiveTransform,
  DirectiveTransform
} from './transform'
export {
  generate,
  CodegenOptions,
  CodegenContext,
  CodegenResult
} from './codegen'
export {
  ErrorCodes,
  CoreCompilerError,
  CompilerError,
  createCompilerError
} from './errors'
export * from './ast'
export * from './utils'
export * from './codeframe'
export { registerRuntimeHelpers } from './runtimeHelpers'

// expose transforms so higher-order compilers can import and extend them
export { transformModel } from './transforms/vModel'
export { transformOn } from './transforms/vOn'

```