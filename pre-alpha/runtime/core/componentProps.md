# 功能说明
> 组件的`Props`处理

## 类型接口
### ComponentPropsOptions
> 组件的Props参数类型
```ts
export type ComponentPropsOptions<P = Data> =
  | ComponentObjectPropsOptions<P>
  | string[]
```
### ComponentObjectPropsOptions
> 组件的Props的对象参数类型
```ts
export type ComponentObjectPropsOptions<P = Data> = {
  [K in keyof P]: Prop<P[K]> | null
}
```

### Prop
> 组件的Prop类型,对象配置项,或者构造函数
```ts
export type Prop<T> = PropOptions<T> | PropType<T>
```
### PropType
> Prop构造函数类型
```ts
export type PropType<T> = PropConstructor<T> | PropConstructor<T>[]

type PropConstructor<T> = { new (...args: any[]): T & object } | { (): T }
```

### ExtractPropTypes
> Props
```ts
type RequiredKeys<T, MakeDefaultRequired> = {
  [K in keyof T]: T[K] extends
    | { required: true }
    | (MakeDefaultRequired extends true ? { default: any } : never)
    ? K
    : never
}[keyof T]

type OptionalKeys<T, MakeDefaultRequired> = Exclude<
  keyof T,
  RequiredKeys<T, MakeDefaultRequired>
>

type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // somehow `ObjectConstructor` when inferred from { (): T } becomes `any`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? { [key: string]: any }
      : T extends Prop<infer V> ? V : T

export type ExtractPropTypes<
  O,
  MakeDefaultRequired extends boolean = true
> = O extends object
  ? {
      readonly [K in RequiredKeys<O, MakeDefaultRequired>]: InferPropType<O[K]>
    } &
      {
        readonly [K in OptionalKeys<O, MakeDefaultRequired>]?: InferPropType<
          O[K]
        >
      }
  : { [K in string]: any }
```
## 功能函数
### resolveProps
> Props处理
```ts
export function resolveProps(
  instance: ComponentInternalInstance,
  rawProps: any,
  _options: ComponentPropsOptions | void
) {
}
```
## 内部函数

### normalizePropsOptions
> Props处理选项参数
```ts
const enum BooleanFlags {
  shouldCast = '1',
  shouldCastTrue = '2'
}

type NormalizedProp =
  | null
  | (PropOptions & {
      [BooleanFlags.shouldCast]?: boolean
      [BooleanFlags.shouldCastTrue]?: boolean
    })

type NormalizedPropsOptions = Record<string, NormalizedProp>

```
### getType
> 获取Prop的类型
```ts
function getType(ctor: Prop<any>): string {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}
```
### isSameType
> 检查Prop是否相同类型
```ts
function isSameType(a: Prop<any>, b: Prop<any>): boolean {
  return getType(a) === getType(b)
}
```
### getTypeIndex
> 获取类型的索引标志
```ts
function getTypeIndex(
  type: Prop<any>,
  expectedTypes: PropType<any> | void | null | true
): number {
  if (isArray(expectedTypes)) {
    for (let i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
  } else if (isObject(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  return -1
}
```
### validateProp
> 验证Prop是否类型正确
```ts
function validateProp(
  name: string,
  value: any,
  prop: PropOptions<any>,
  isAbsent: boolean
) {
  const { type, required, validator } = prop
  // required!
  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"')
    return
  }
  // missing but optional
  if (value == null && !prop.required) {
    return
  }
  // type check
  if (type != null && type !== true) {
    let isValid = false
    const types = isArray(type) ? type : [type]
    const expectedTypes = []
    // value is valid as long as one of the specified types match
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i])
      expectedTypes.push(expectedType || '')
      isValid = valid
    }
    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes))
      return
    }
  }
```
### assertType
> 断言Prop类型
```ts
type AssertionResult = {
  valid: boolean
  expectedType: string
}
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

function assertType(value: any, type: PropConstructor<any>): AssertionResult {
  let valid
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = toRawType(value) === 'Object'
  } else if (expectedType === 'Array') {
    valid = isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```
### getInvalidTypeMessage
> 生成无效提示语
```ts
function getInvalidTypeMessage(
  name: string,
  value: any,
  expectedTypes: string[]
): string {
  let message =
    `Invalid prop: type check failed for prop "${name}".` +
    ` Expected ${expectedTypes.map(capitalize).join(', ')}`
  const expectedType = expectedTypes[0]
  const receivedType = toRawType(value)
  const expectedValue = styleValue(value, expectedType)
  const receivedValue = styleValue(value, receivedType)
  // check if we need to specify expected value
  if (
    expectedTypes.length === 1 &&
    isExplicable(expectedType) &&
    !isBoolean(expectedType, receivedType)
  ) {
    message += ` with value ${expectedValue}`
  }
  message += `, got ${receivedType} `
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`
  }
  return message
}
```
### styleValue
> 提示语格式化输出
```ts
function styleValue(value: any, type: string): string {
  if (type === 'String') {
    return `"${value}"`
  } else if (type === 'Number') {
    return `${Number(value)}`
  } else {
    return `${value}`
  }
}
```
### toRawType
> 获取`value`的原始类型
```ts
function toRawType(value: any): string {
  return toTypeString(value).slice(8, -1)
}

```
### isExplicable
> 检查是否合法类型
```ts
function isExplicable(type: string): boolean {
  const explicitTypes = ['string', 'number', 'boolean']
  return explicitTypes.some(elem => type.toLowerCase() === elem)
}
```

### isBoolean
> 检查是否Boolean
```ts
function isBoolean(...args: string[]): boolean {
  return args.some(elem => elem.toLowerCase() === 'boolean')
}

```