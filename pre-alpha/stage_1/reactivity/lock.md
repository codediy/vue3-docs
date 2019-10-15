## 功能说明
> 全局锁机制

## 实例对象
### LOCKED
> 全局锁控制
```ts
export let LOCKED = true
```
## 功能函数
### lock
> 开启全局锁
```ts
export function lock() {
  LOCKED = true
}
```
### unlock
> 关闭全局锁
```ts
export function unlock() {
  LOCKED = false
}
```