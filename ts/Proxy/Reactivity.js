//缓存已代理的对象
const toProxy = new WeakMap()


function isObject(param){
    return typeof param === 'object' && param !== null;
}


function reactive(target){
    if(!isObject(target)) {
        return target;
    }

    //检查是否以代理
    if(toProxy.get(target)){
        return toProxy.get(target);
    }

    const handler = {
        get(target,key,receiver){
            const proxyTarget =  Reflect.get(target,key,receiver);
            if(isObject(target[key])){
                //嵌套对象进行递归处理
                return reactive(proxyTarget);
            }
            return proxyTarget;
        },
        set(target,key,value,receiver){
            if(!target.hasOwnProperty(key)){
                //私有属性触发
                trigger();
            }
            return Reflect.set(target,key,value,receiver);
        },

        deleteProperty(target, key) {
            return Reflect.deleteProperty(target, key)
        }
    }

    let observed = new Proxy(target,handler);
    return observed
}

