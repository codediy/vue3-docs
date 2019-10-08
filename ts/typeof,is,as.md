## typeof
> js中获取变量的类型
> typeof (x)中 
    - 未定义          "undefined"
    - 数字            "number",
    - 字符串          "string",
    - 布尔值          "boolean"
    - null,数组,对象  "object",
    - 函数            "function"
```js
if(!typeof(document.mylist.length) != "undefined"){
    console.log(document.mylist.length);
}

console.log(typeof (123))   //number
console.log(typeof ("123")) //string


function doSome(x: number | string) {
  if (typeof x === 'string') {
    // 在这个块中，TypeScript 知道 `x` 的类型必须是 `string`
    console.log(x.subtr(1)); // Error: 'subtr' 方法并没有存在于 `string` 上
    console.log(x.substr(1)); // ok
  }

  x.substr(1); // Error: 无法保证 `x` 是 `string` 类型
}
```

## instanceof
> `typeof`检查引用类型返回都是`object`,
> 需要使用`instanceof`检查一个对象在其原型链上是否存在特定的构造函数的`prototype`属性
```js
var a = new Array()
console.log(a instanceof Array) //true
console.log(a instanceof Object) //true

var b = function test(){}
console.log(b instanceof test) //true

function Foo(){}
Foo.prototype = new  Aoo();
var foo = new Foo();
console.log(foo instanceof Foo) //true
console.log(foo instanceof Aoo) //true

console.log(Object instanceof Object) //true
console.log(Function instanceof Function) //true
console.log(Function instanceof Object) //true
console.log(Foo instanceof Function) //true

console.log(Number instanceof Number) //false
console.log(String instanceof String) //false
console.log(Foo instanceof Foo) //false
```

```js
function C(){}
function D(){}

var o = new C()
o instanceof C;//true
o instanceof D;//false
o instanceof Object; //true
C.prototype instanceof Object //true
C.prototype = {};

var o2 = new C();
o2 instanceof C;
o instanceof C;//false,
```

```ts
class Foo {
  foo = 123;
  common = '123';
}

class Bar {
  bar = 123;
  common = '123';
}

function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  }
  if (arg instanceof Bar) {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff(new Foo());
doStuff(new Bar());
```

## in 
> 检查对象是否存在某个属性
```ts
interface A {
  x: number;
}

interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ('x' in q) {
    // q: A
  } else {
    // q: B
  }
}
```

## kind 
> 自定义类型判断
```ts
type Foo = {
  kind: 'foo'; // 字面量类型
  foo: number;
};

type Bar = {
  kind: 'bar'; // 字面量类型
  bar: number;
};

function doStuff(arg: Foo | Bar) {
  if (arg.kind === 'foo') {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 一定是 Bar
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```

## is 
> 自定义类型保护函数

```ts
// 仅仅是一个 interface
interface Foo {
  foo: number;
  common: string;
}

interface Bar {
  bar: number;
  common: string;
}

// 用户自己定义的类型保护！
function isFoo(arg: Foo | Bar): arg is Foo {
  return (arg as Foo).foo !== undefined;
}

// 用户自己定义的类型保护使用用例：
function doStuff(arg: Foo | Bar) {
  if (isFoo(arg)) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff({ foo: 123, common: '123' });
doStuff({ bar: 123, common: '123' });
```

## as
> 声明显示类型断言
```ts
const foo = {};
foo.bar = 123; // Error: 'bar' 属性不存在于 ‘{}’
foo.bas = 'hello'; // Error: 'bas' 属性不存在于 '{}'

interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo;  //将foo显示声明为Foo类型
foo.bar = 123;
foo.bas = 'hello';
```

> 相对于类型转换是运行时类型的操作
