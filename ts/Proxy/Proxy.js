function ProxyObject(data)
{
    let p = new Proxy(data,{
        get(target,key,receiver){
            console.log("get",target,key,receiver);
            return target[key]
        },
        set(target,key,value,receiver){
            console.log("set",target,key,value,receiver);
            target[key] = value;
        }
    })
    return p;
}
// let object = ProxyObject({foo:"foo"});
// object.foo;
// object.foo = 3;


function ProxyArray(data)
{
    let p = new Proxy(data,{
        get(target,key,receiver){
            console.log("get",target,key,receiver);
            return target[key]
        },
        set(target,key,value,receiver){
            console.log("set",target,key,value,receiver);
            target[key] = value;
            return true;
        }
    })
    return p;
}

// let array = ProxyArray([1,2,3]);
// array.push(4); 
/* 
get (3) [1, 2, 3] push Proxy {0: 1, 1: 2, 2: 3}
get (3) [1, 2, 3] length Proxy {0: 1, 1: 2, 2: 3}
set (3) [1, 2, 3] 3 4 Proxy {0: 1, 1: 2, 2: 3}
set (4) [1, 2, 3, 4] length 4 Proxy {0: 1, 1: 2, 2: 3, 3: 4}
*/


function ProxyReflectArray(data)
{
    let p = new Proxy(data,{
        get(target,key,receiver){
            console.log("get",target,key,receiver);
            return Reflect.get(target, key, receiver)
        },
        set(target,key,value,receiver){
            console.log("set",target,key,value,receiver);
            return Reflect.set(target, key, value, receiver)
            
        }
    })
    return p;
}

let array1 = ProxyReflectArray([1,2,3]);
array1.push(4); 

/* 
get (3) [1, 2, 3] push Proxy {0: 1, 1: 2, 2: 3}
get (3) [1, 2, 3] length Proxy {0: 1, 1: 2, 2: 3}
set (3) [1, 2, 3] 3 4 Proxy {0: 1, 1: 2, 2: 3}
set (4) [1, 2, 3, 4] length 4 Proxy {0: 1, 1: 2, 2: 3, 3: 4}
*/

/* 
setTimeout解决重复
*/
function reactiveTimeOut(data,cb){
    let timer = null
    return new Proxy(data, {
        get(target, key, receiver) {
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                cb && cb()
            }, 0);
            return Reflect.set(target, key, value, receiver)
        }
    })
}

let ary = [1, 2]
let p = reactive(ary, () => {
  console.log('trigger')
})
p.push(3)

function reactive(data,cb){
    let res = null
    let timer = null
    //数组,对象
    res = data instanceof Array ? []: {} 

    //递归处理
    for (let key in data) {
        if (typeof data[key] === 'object') {
            res[key] = reactive(data[key], cb)
        } else {
            res[key] = data[key]
        }
    }
    
    //代理最上层
    return new Proxy(res, {
        get(target, key) {
            return Reflect.get(target, key)
        },
        set(target, key, val) {
            let res = Reflect.set(target, key, val)
            clearTimeout(timer)
            timer = setTimeout(() => {
                cb && cb()
            }, 0)
            return res
        }
    })
}

let data = { foo: 'foo', bar: [1, 2] }
let p = reactive(data, () => {
  console.log('trigger')
})
p.bar.push(3)

