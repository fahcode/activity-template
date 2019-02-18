import Vue from 'vue';

const queue = [];
var currentInstance = null;

class ModalManager {
	
	static get current() {
		return currentInstance;
	}

	// static set current(instance) {
	// 	currentInstance = instance;
	// }

	static _inject(instance) {
		if(!instance) return;
		instance = instance == instance.$root ? instance.$children[0] : instance;
		var ofn = instance.$destroy;
		var self = this;
		instance.$destroy = function() {
			ofn && ofn.call(this);
			currentInstance = null;
			Vue.nextTick(function() {
				var request = queue.shift();
				if(request) {
					currentInstance = self._inject(request());
				}
			});
		}
		return instance;
	}

	static add(request) {
		if(!currentInstance) {
			currentInstance = this._inject(request());
		} else { 
			return new Vue.Promise((resolve, reject)=> {
				queue.push(()=> {
					let instance = request();
					return instance;
				});
			})
		}
	}
}

export default ModalManager;