import Loading from './Loading.vue'
import Builder from 'base/Builder'
let singleInstance = null;
class LoadingBuilder extends Builder {
    constructor(ctx) {
        super(ctx, Loading)
    }
    show() {
        if(!singleInstance) {
      	    singleInstance = this.createComp();
        } 
        singleInstance._bindingCtx = this.ctx;
        return singleInstance;
    }
    hide(force) {
        if(singleInstance && (singleInstance._bindingCtx == this.ctx || force)) {
            singleInstance.$destroy();
            singleInstance._bindingCtx = null;
            singleInstance = null;
        }
    }
    static of(ctx) {
      	return new LoadingBuilder(ctx);
    }
}
export default LoadingBuilder 