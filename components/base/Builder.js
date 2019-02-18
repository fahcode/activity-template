import util from '../common/util';
import Vue from 'vue';
import store from '../common/store';
import Enum from '../common/enum';
//const _instancePool = {};
class Builder {
	constructor(ctx, comp) {
		this.ctx = ctx;
		this.comp = comp;
	}
	with(comp) {
		this.comp = comp;
		return this;
	}
	createComp(opts) {
		// var key = this.comp.name || '';
		// if(key && useCache && !_instancePool[key]) {
		// 	_instancePool[key] = [];
		// }
		// if(key && useCache) {
		// 	for(let data of _instancePool[key]) {
		// 		if(!data.instance.open) {
		// 			return data.instance;
		// 		}
		// 	}
		// }
		var Proxy = util.createComponentProxy(this.comp, opts);
		var anchor = document.createElement('a');
		document.body.appendChild(anchor);
		var instance = new Vue({
			name: `${this.comp.name || Date.now()}_Root`,
			$flag: Enum.FLAG.GLOBAL | Enum.FLAG.DISABLE_RESIZE,
			el: anchor,
			render: h => {
				return h(Proxy);
			},
      		store
		});
		// if(key && useCache) {
		// 	_instancePool[key].push({instance, opts});
		// }
		return instance;
	}
}

export default Builder;