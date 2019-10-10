const isObject = (val) => val !== null && typeof val === 'object';
const hasOwn = (val,key) => Object.prototype.hasOwnProperty(val,key);

//依赖回调缓存(target->key->effect)
const targetMap = new WeakMap()
//待处理依赖回调
const effectStack = []

function tarck(target,operationType,key){
    //获取最后一个effect
    const effect = effectStack[effectStack.length - 1]

    if(effect){
        let depsMap = targetMap.get(target);
        if(depsMap === void 0){
            target.set(target,(depsMap = new Map()));
        }

        let dep = depsMap.get(key)
        if(dep === void 0){
            depsMap.set(key,(dep = new Set()))
        }
        if(!dep.has(effect)){
            dep.add(effect)
        }
    }
}

function trigger(target,operationType,key){
    //获取依赖回调
    const depsMap = targetMap.get(target);
    if(depsMap === void 0){
        return 
    }


    const effects = new Set()
    if( key !== void 0){
        const dep = depsMap.get(key)
        dep && dep.forEach(effect => {
            effects.add(effect)
        });
    }

    if(operationType === 'add' || operationType === 'set'){
        const iterationKey = Array.isArray(target) ? 
            'length' : Symbol('iterate');
        const dep = depsMap.get(iterationKey);

        dep && dep.forEach(effect => {
            effects.add(effect);
        })
    }

    //执行依赖回调
    effects.forEach(effect => {
        effect();
    })
}

//注册到effectStack
function effect(fn){
    const effect = function effect(...args){
        return run(effect,fn,args)
    }
    //注册依赖收集
    effect()
    //返回包裹后的函数
    return effect;
}

function run(effect,fn,args){
    if(effectStack.indexOf(effect) === -1){
        try {
            //添加到待收集
            effectStack.push(effect)
            //调用注册函数
            return fn(...args)
        } finally {
            //取消待收集
            effectStack.pop();
        }
    }
}

function createGetter(target,key,receiver){
    const res = Reflect.get(target,key,receiver)
    tarck(target,'get',key)

    return isObject(res)
        ? reactive(res)
        : res
}

function createSetter(target,key,value,receiver){
    const hadKey = hasOwn(target,key);
    const oldValue = target[key];
    const result = Reflect.set(target,key,value,receiver);

    if(!hadKey){
        trigger(target,"add",key);
    }else if(value !== oldValue){
        trigger(target,"set",key)
    }

    return result;
}

function createDeleteProperty(target,key){
    const hadKey = hasOwn(target,key);
    const oldValue = target[key];
    const result = Reflect.set(target,key,value,receiver);

    if(hadKey){
        trigger(target,"delete",key)
    }

    return result;
}

const handler = {
    get:createGetter,
    set:createSetter,
    deleteProperty:createDeleteProperty
}

function reactive(target) {
    const observed = new Proxy(target,handler);
    return observed;
}