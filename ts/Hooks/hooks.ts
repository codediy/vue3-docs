/*name:i => function*/
/*
*https://github.com/suchipi/concubine
* */
export type HookThunks<Instance> = {
    [name: string]: (instance: Instance) => Function;
};

export type HooksSystem<Instance, Hooks extends HookThunks<Instance>> = {
    /*注册实例*/
    withInstance<ReturnType>(
        instance: Instance,
        callback: () => ReturnType
    ): ReturnType;
    hooks: {
        [Name in keyof Hooks]: ReturnType<Hooks[Name]>;
    }
}

export function makeHooksSystem<Instance>() {

    return function provedHookThunks<Hooks extends HookThunks<Instance>>(
        hooks: Hooks,
        config: Partial<{
            prepareInstance: (instance: Instance) => void;
            releaseInstance: (instance: Instance) => void;
            hookUsedOutsideOfWithInstanceErrorMessage: string;
        }> = {}
    ): HooksSystem<Instance, Hooks> {
        let currentInstance: Instance | null = null;

        // @ts-ignore
        const resolvedHooks: HooksSystem<Instance, Hooks>["hooks"] = {};

        for (const name in hooks) {
            if (hooks.hasOwnProperty(name)) {
                // @ts-ignore
                resolvedHooks[name] = (...args: any[]) => {
                    if (currentInstance == null) {
                        throw new Error(
                            config.hookUsedOutsideOfWithInstanceErrorMessage
                            || "Attempted to use a hook function,but there was no active instance."
                        )
                    }

                    return hooks[name](currentInstance)(...args);
                };
            }
        }

        return {
            withInstance: (instance, callback) => {
                if (config.prepareInstance) {
                    config.prepareInstance(instance);
                }
                currentInstance = instance;
                let ret;
                try {
                    ret = callback();
                } finally {
                    if (config.releaseInstance) {
                        config.releaseInstance(instance);
                    }
                    currentInstance = null;
                }
                return ret;
            },
            hooks: resolvedHooks
        }
    }
}


/*demo*/
class Instance {
    stateSlots: Map<number, any> = new Map();
    currentStateSlot: number     = 0;
}

const hooksSystem = makeHooksSystem<Instance>()(
    {
        useState: (instance) => <T>(
            initialValue: T
        ): [T, (nextValue: T) => void] => {
            const slot = instance.currentStateSlot;

            let value;
            if (instance.stateSlots.has(slot)) {
                value = instance.stateSlots.get(slot);
            } else {
                instance.stateSlots.set(slot, initialValue);
                value = initialValue;
            }

            const setValue = (nextValue: T) => {
                instance.stateSlots.set(slot, nextValue);
            };

            instance.currentStateSlot++;

            return [value, setValue];
        },
    },
    {
        prepareInstance(instance) {
            instance.currentStateSlot = 0;
        },
    }
);

//存储数据的state
const holder = new Instance();

hooksSystem.withInstance(holder, () => {
    const [slot0, setSlot0] = hooksSystem.hooks.useState(0);

    console.log("slot0", slot0);
    setSlot0(99);
    console.log("setSlot0", slot0);

    const [slot1] = hooksSystem.hooks.useState(45);
    console.log("slot1", slot1);
})
