## 0 ProxyHandlers
- ProxyHandlers 实现get与set的代理
- get()代理中track()实现数据与回调函数的关联
- set()代理中trigger()实现数据更新时调用回调函数

## 1 Reactive/Ref
- reactive() 将数组/对象转换为响应式
- ref()      将简单值(布尔/数字/字符串)转换为响应式
- 内部使用了ProxyHandlers

## 2 Effect
- effect()   数据响应的副作用回调函数
- 首先get响应式数据，注册数据更新的回调函数
- 等数据更新时回调effect()的回调函数

