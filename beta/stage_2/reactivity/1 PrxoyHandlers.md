## baseHandlers

### createGetter
``` 
function createGetter(isReadonly = false, shallow = false) {
}
```
- isReadonly 只读get
- shallow    get的值是否转换为响应 

``` 
return function get(target: object, key: string | symbol, receiver: object) {
}
```
- 返回一个函数，用来读取`target[key]`
``` 
if (key === ReactiveFlags.IS_REACTIVE) {
  return !isReadonly
} else if (key === ReactiveFlags.IS_READONLY) {
  return isReadonly
} else if (
  key === ReactiveFlags.RAW &&
  receiver ===
    (isReadonly
      ? (target as any)[ReactiveFlags.READONLY]
      : (target as any)[ReactiveFlags.REACTIVE])
) {
  return target
}
```
- 检查对象的ReactiveFlags属性，

``` 
const targetIsArray = isArray(target)
if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
  return Reflect.get(arrayInstrumentations, key, receiver)
}
```
- 数组的转换处理，包括`includes`,`indexOf`,`lastIndexOf`

``` 
const res = Reflect.get(target, key, receiver)
```
- 读取`target[key]`

``` 
if (
  isSymbol(key)
    ? builtInSymbols.has(key)
    : key === `__proto__` || key === `__v_isRef`
) {
  return res
}
```
- target的符号属性读取

``` 
if (!isReadonly) {
  track(target, TrackOpTypes.GET, key)
}
```
- target普通属性读取，并且不是只读的，则进行数据与注册回调函数track()
- track()是响应机制的核心实现，在effect中分析
``` 
if (shallow) {
    return res
}
```
- shallow则返回普通的`target[key]`

``` 
if (isRef(res)) {
  // ref unwrapping, only for Objects, not for Arrays.
  return targetIsArray ? res : res.value
}

if (isObject(res)) {
  // Convert returned value into a proxy as well. we do the isObject check
  // here to avoid invalid value warning. Also need to lazy access readonly
  // and reactive here to avoid circular dependency.
  return isReadonly ? readonly(res) : reactive(res)
}
return res
```
- shallow为false则返回转换后的`target[key]`

``` 
const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)
```
- 四种类型get

###  createSetter
``` 
function createSetter(shallow = false) {}
```
- shallow

``` 
return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {}
```
- 返回一个设置`target[key]=value`的函数代理

``` 
const oldValue = (target as any)[key]
```
- 获取oldValue

``` 
if (!shallow) {
  value = toRaw(value)
  if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
    oldValue.value = value
    return true
  }
} else {
  // in shallow mode, objects are set as-is regardless of reactive or not
}
```
- shallow为否时，转换为普通值赋值

``` 
const hadKey = hasOwn(target, key)
const result = Reflect.set(target, key, value, receiver)
// don't trigger if target is something up in the prototype chain of original
if (target === toRaw(receiver)) {
  if (!hadKey) {
    trigger(target, TriggerOpTypes.ADD, key, value)
  } else if (hasChanged(value, oldValue)) {
    trigger(target, TriggerOpTypes.SET, key, value, oldValue)
  }
}
return result
```
- hadKey为真 表示更新属性，hadKey为否 表示添加属性
- result表示设置的结果
- 然后根据hadKey进行ADD或者SET回调处理

``` 
const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)
```
- 两种set


### deleteProperty
``` 
function deleteProperty(target: object, key: string | symbol): boolean {
  const hadKey = hasOwn(target, key)
  const oldValue = (target as any)[key]
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey) {
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}
```
- 删除属性的回调

### has
``` 
function has(target: object, key: string | symbol): boolean {
  const result = Reflect.has(target, key)
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, TrackOpTypes.HAS, key)
  }
  return result
}
```
- has的回调

### Handlers的封装
``` 
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  has,
  ownKeys,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}

export const shallowReactiveHandlers: ProxyHandler<object> = extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)

// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
export const shallowReadonlyHandlers: ProxyHandler<object> = extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)
```

## collectHandlers
- handlers->instrument->get/has/size/add/set/foreach

### mutableCollectionHandlers
``` 
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false)
}
```
### shallowCollectionHandlers
``` 
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false)
}
```
### readonlyCollectionHandlers
``` 
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: createInstrumentationGetter(false, false)
}
```
- handlers统一使用`createInstrumentationGetter`读取instrumentations对应的属性进行操作

### mutableInstrumentations
``` 
const mutableInstrumentations: Record<string, Function> = {
  get(this: MapTypes, key: unknown) {
    return get(this, key, toReactive)
  },
  get size() {
    return size((this as unknown) as IterableCollections)
  },
  has,
  add,
  set,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
}
```
### shallowInstrumentations
``` 
const shallowInstrumentations: Record<string, Function> = {
  get(this: MapTypes, key: unknown) {
    return get(this, key, toShallow)
  },
  get size() {
    return size((this as unknown) as IterableCollections)
  },
  has,
  add,
  set,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, true)
}
```
### readonlyInstrumentations
``` 
const readonlyInstrumentations: Record<string, Function> = {
  get(this: MapTypes, key: unknown) {
    return get(this, key, toReadonly)
  },
  get size() {
    return size((this as unknown) as IterableCollections)
  },
  has,
  add: createReadonlyMethod(TriggerOpTypes.ADD),
  set: createReadonlyMethod(TriggerOpTypes.SET),
  delete: createReadonlyMethod(TriggerOpTypes.DELETE),
  clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
  forEach: createForEach(true, false)
}
```
```
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator]
iteratorMethods.forEach(method => {
  mutableInstrumentations[method as string] = createIterableMethod(
    method,
    false,
    false
  )
  readonlyInstrumentations[method as string] = createIterableMethod(
    method,
    true,
    false
  )
  shallowInstrumentations[method as string] = createIterableMethod(
    method,
    false,
    true
  )
})
```
- 注册`keys`,`values`,`entries`的遍历处理

### 函数实现
- get()
- has()
- size()
- add()
- set()
- deleteEntry()
- clear()
- createForEach()
- createIterableMethod()
- createReadonlyMethod()








