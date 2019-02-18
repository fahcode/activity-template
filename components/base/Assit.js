import Enum from '../common/enum';
import Vue from 'vue';
import util from '../common/util';
const MOTIONS = {};
const TYPES = {};
let vm = null;

function doMotion(opts) {
    let motion = MOTIONS[opts.type];
    return this.$promise((resolve, reject) => {
        if(!motion) {
            reject(new Error(`Cannot found Motion type: ${opts.type}`));
        }
        try {
            resolve(motion.do.apply(this, opts.params));
        } catch(err) {
            reject(err);
        }
    });

}

function install(Vue) {
    Vue.prototype.$defineMotion = defineMotion;
    Vue.prototype.$doMotion = doMotion;
    Vue.prototype.__MOTIONS__ = MOTIONS;
    delete Vue.prototype['$lang'];
    Object.defineProperty(Vue.prototype, '$lang', {
        get() {
            return vm;
        },
        configurable: true
    });
    if(process.env.NODE_ENV != 'production' && util.isInBrowser() && window.parent) {
        parent.dispatchEvent(new Event(Enum.CUSTOM_EVENT.UPDATE_LANGS));
    }
}

function processLangs(instance) {
    let flag = false;
    let props = {};
    let propConfigs = {};
    if(instance._isVue) {
        if(instance.$options.$flag == 1024) return;
        propConfigs = instance.$options.props;
    } else {
        propConfigs = instance;
    }
    if(!propConfigs) return flag;
    // Object.keys(propConfigs).forEach((key) => {
    //     if(/^\$\$/.test(key)) {
    //         flag = true;
    //         props[key] = propConfigs[key];
    //     }
    // });
    for(let key in propConfigs) {
        if(/^\$\$/.test(key)) {
            flag = true;
            props[key] = propConfigs[key];
        }
    }
    if(flag) {
        return props;
    } else {
        return false;
    }
}

export function defineMotion(motion, opts) {
    if(!motion) return;
    MOTIONS[motion] = opts;
}

export function defineLangs(instance) {
    let props = processLangs(instance);
    if(!props) {
        return;
    }
    if(!vm) {
        vm = new Vue({
            $flag: 1024,
            props,
            propsData: Vue.__STORE__['$lang']
        });
    } else {
        let newVm = new Vue({
            $flag: 1024,
            props,
            propsData: Vue.__STORE__['$lang']
        });
        
        Object.keys(newVm._props).forEach((key) => {
            let property = Object.getOwnPropertyDescriptor(newVm._props, key)
            if (property && property.configurable === false) {
                return
            }
            if(vm[key]) {
                //console.warn(`Conflict tips key: ${key}`);
                return;
            }

            Object.defineProperty(vm._props, key, property);
            Object.defineProperty(vm, key, {
                get() {
                    return vm._props[key];
                },
                set(newVal) {
                    if(vm._props[key] == newVal) {
                        return;
                    }
                    vm._props[key] = newVal;
                },
                configurable: true
            });
            vm.$options.props[key] = props[key];
        });
    }
    //if(process.env.NODE_ENV != 'production' && util.isInBrowser()) {
        //vm.$emit(Enum.CUSTOM_EVENT.UPDATE_LANGS);
        if(process.env.NODE_ENV != 'production' && util.isInBrowser() && window.parent) {
            parent.dispatchEvent(new Event(Enum.CUSTOM_EVENT.UPDATE_LANGS));
        }
        
    //}
}

export function dropLangs(instance) {
    if(process.env.NODE_ENV != 'production' && util.isInBrowser() && window.parent) {
        let props = processLangs(instance);
        if(!props) {
            return;
        }
        Object.keys(props).forEach((key) => {
            delete vm[key];
            delete vm._props[key];
            delete vm.$options.props[key];
        });    
        parent.dispatchEvent(new Event(Enum.CUSTOM_EVENT.UPDATE_LANGS));
    }
}

export default {
    install
};