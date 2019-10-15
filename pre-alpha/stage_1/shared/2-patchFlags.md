# 功能说明
> 更新标记类型

## PatchFlags
```ts
export const enum PatchFlags {
  TEXT = 1,
  CLASS = 1 << 1,
  STYLE = 1 << 2,
  PROPS = 1 << 3,
  NEED_PATCH = 1 << 5,
  KEYED_FRAGMENT = 1 << 6,
  UNKEYED_FRAGMENT = 1 << 7,
  DYNAMIC_SLOTS = 1 << 8,
  BAIL = -1
}
```

## PublicPatchFlags
> 字符串转Flag
```ts
export const PublicPatchFlags = {
  TEXT: PatchFlags.TEXT,
  CLASS: PatchFlags.CLASS,
  STYLE: PatchFlags.STYLE,
  PROPS: PatchFlags.PROPS,
  NEED_PATCH: PatchFlags.NEED_PATCH,
  FULL_PROPS: PatchFlags.FULL_PROPS,
  KEYED_FRAGMENT: PatchFlags.KEYED_FRAGMENT,
  UNKEYED_FRAGMENT: PatchFlags.UNKEYED_FRAGMENT,
  DYNAMIC_SLOTS: PatchFlags.DYNAMIC_SLOTS,
  BAIL: PatchFlags.BAIL
}
```
## PatchFlagNames
> Flag转字符串
```ts
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.BAIL]: `BAIL`
}
```