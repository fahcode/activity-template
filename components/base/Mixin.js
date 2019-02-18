import Vue from 'vue';
import util from '../common/util';
import Enum from '../common/enum';
import { defineLangs, dropLangs } from './Assit';
import NativeInterface from '../common/nativeinterface';
import logger from '../common/logger';

function _broadcast(componentName, eventName, params) {
  	this.$children.forEach(function (child) {
	    var name = child.$options.name;

	    if (name === componentName) {
	      	child.$emit.apply(child, [eventName].concat(params));
	    } else {
	      	_broadcast.apply(child, [componentName, eventName].concat([params]));
	    }
	});
}

function _find(componentName) {
	let len = this.$children.length;
	let component = null;
	while(len--) {
		let child = this.$children[len];
		if(child.$options.name == componentName) {
			component = child;
			break;
		} else {
			component = _find.call(child, componentName);
			if(component) break;
		}
	}
	return component;
}

function traverseInstanceVNode(vnode) {
	if(!vnode) return [];
	let arr = [vnode];
	let _vnode = null;
	let instanceVnodes = [];
	while(_vnode = arr.shift()) {
		let children = _vnode.children || (_vnode.componentOptions && _vnode.componentOptions.children);
		if(_vnode.componentOptions && _vnode.componentOptions.Ctor && !_vnode.componentOptions.Ctor.options.abstract) {
			instanceVnodes.push(_vnode);
		}
		if(children) {
			Array.prototype.push.apply(arr, children);
		}
	}
	return instanceVnodes;
}

export default {
	beforeCreate() {
		let $global = false;
		if('$flag' in this.$options) {
			$global = this.$options.$flag & Enum.FLAG.GLOBAL;
		}
		if(process.env.IS_SSR) {
			//this.$newChildren = [];
			this.$location = this.$parent ? this.$parent.$location + '.' + (this.$parent.$children.length - 1) : 
				($global && this.$options.name ? this.$options.name : this._uid);
			// if(this.$parent) {
			// 	this.$parent.$newChildren.push(this);
			// }
		} else {
			if(this.$parent && this.$parent._vnode) {
				if(!this.$parent.$instanceVnodeTraversed) {
					this.$parent.$instanceVnodes = traverseInstanceVNode(this.$parent._vnode);
					this.$parent.$instanceVnodeTraversed = true;
				}
			}
			this.$location = this.$parent ? this.$parent.$location + '.' + this.$parent.$instanceVnodes.indexOf(this.$vnode) : 
				($global && this.$options.name ? this.$options.name : this._uid);
		}
		if(!$global) {
			this.$$location = this.$options.name ? `${this.$location}@${this.$options.name}` : this.$location;
			this.$config = Vue.__STORE__[this.$$location] || {};
			//Vue.set(this, '$config', Vue.__STORE__[this.$$location] || {})
		} else {
			this.$$location = this.$options.name;
			this.$config = Vue.__STORE__[this.$options.name] || {};
			//Vue.set(this, '$config', Vue.__STORE__[this.$$location] || {})
		}
		this._updateFromParent = function(propsData, listeners, parentVnode, renderChildren) { //vue2.3.0 hack		
			if(process.env.NODE_ENV != 'production') { //目的是 属性修改时不会造成 full page reload
				if(this.$parent && this.$parent._vnode) {
					if(!this.$parent.$instanceVnodeTraversed) {
						this.$parent.$instanceVnodes = traverseInstanceVNode(this.$parent._vnode);
						this.$parent.$instanceVnodeTraversed = true;
					}
				}
				this.$location = this.$parent ? this.$parent.$location + '.' + this.$parent.$instanceVnodes.indexOf(parentVnode) : 
					($global && this.$options.name ? this.$options.name : this._uid);
				if(!$global) {
					this.$$location = this.$options.name ? `${this.$location}@${this.$options.name}` : this.$location;
					this.$config = Vue.__STORE__[this.$$location] || {};
				} else {
					this.$$location = this.$options.name;
					this.$config = Vue.__STORE__[this.$options.name] || {};
				}
				//this.$config = ($global ? Vue.__STORE__[this.$options.name] : Vue.__STORE__[this.$$location]) || {};
				//this.$vnode 仍然是旧的vnode
				parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle || {}, this.$vnode.data.staticStyle); 
				parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle, this.$config.staticStyle || {});
			} else {
				//staticStyle
				parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle || {}, this.$config.staticStyle || {});
			}
			//propsData
			Vue.util.extend(propsData, this.$config.propsData || {});
			
			//staticStyle
			//parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle || {}, this.$config.staticStyle || {});
			// if(process.env.IS_SSR) {
			// 	this.$parent.$newChildren.push(this); //添加新组件时候
			// }
			//ufp.apply(this, [propsData, listeners, parentVnode, renderChildren]);
		};
		this.$options.propsData = Vue.util.extend(this.$options.propsData || {}, this.$config.propsData || {});
		// if(this.$options._parentVnode) {
		// 	this.$options._parentVnode.data.staticStyle = this.$config.staticStyle;
		// }
		if(this.$vnode) {
			this.$vnode.data.staticStyle = Vue.util.extend(this.$vnode.data.staticStyle || {}, this.$config.staticStyle || {});
		}
		defineLangs(this);
	},
	beforeUpdate: function() {
		//if(process.env.IS_SSR) {
			// this.$newChildren = [];
		//} else {
			this.$instanceVnodeTraversed = false;
			this.$instanceVnodes = [];
		//}
	},
	beforeDestroy: function() {
		dropLangs(this);
	},
	methods: {
		$dispatch: function dispatch(componentName, eventName, params) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.name;
			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;
				if (parent) {
					name = parent.$options.name;
				}
			}
			if (parent) {
				parent.$emit.apply(parent, [eventName].concat(params));
			}
		},
		$broadcast: function broadcast(componentName, eventName, params) {
			_broadcast.call(this, componentName, eventName, params);
		},
		$find: function(componentName) {
			return _find.call(this, componentName);
		},
		$closest: function closest(componentName) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.name;
			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if (parent) {
					name = parent.$options.name;
				}
			}
			if (parent) {
				return parent;
			}
		},
		$toRem: function(val) {
			if(typeof val !== 'number') return '0rem';
			return (val / this.$psdWidth * 10).toFixed(6) + 'rem';
		},
		$toPx: function(val) {
			if(typeof val !== 'number') return 0;
			return this.$psdWidth / 10 * val;
		},
		$getImgCSSVal: function(obj) {
			if(!obj) return '';
			return util.getImgCSSVal(obj);
		},
		$toRitchText: function(obj) {
			if(!obj) return '';
			if(typeof obj != 'object') return String(obj);
			let content = obj.content;
			let resMap = obj.resMap;
			Object.keys(resMap).forEach((p) => {
				content = content.replace(new RegExp(`\\[${p}\\]`, 'g'), resMap[p]);
			});
			return content;
		},
		$delay: function(duration) {
			return new Vue.Promise((resolve, reject)=> {
					setTimeout(()=> {
						resolve();
					}, duration);
			}, this);
		},
		$handleReqErr: function(err) {
			let DialogBulder = require('./DialogBuilder').default;
			let OauthErrorDialogBuilder = require('./OauthErrorDialogBuilder').default;
			if(err instanceof Error) {
				err = {code: 1001, message: err.message}
			}
			switch(err.code) {
				case 1001:
					DialogBulder.of(this).alert('出错了', '请刷新重试<1001>');
				break;
				case 401:
					OauthErrorDialogBuilder.of(this).alert();
				break;
				case 500:
				case 502:
				case 503:
					DialogBulder.of(this).alert('服务错误！刷新看看～');
				break;
				case 120043:
					DialogBulder.of(this).alert('发放礼包失败～', {
						confirmBtnTxt: '请重试'
					});
				break;
				default:
					DialogBulder.of(this).alert(`出错了！刷新看看～<${err.code}>`);
			}
			return Vue.Promise.reject(err);
		},
		$checkVersion(value) {
			let DialogBuilder = require('./DialogBuilder').default;
			let version = value || 6007001;
			if(process.env.NODE_ENV == 'production') {
			    if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < version) {
			        DialogBuilder.of(this).alert('','当前版本过低，请前往应用商店升级游戏中心最新版本', function() {
			            window.location.href = 'mstore://details?package_name=com.meizu.flyme.gamecenter&source_apkname=com.meizu.flyme.gamecenter';
			            this.dismiss();
			        }, {confirmBtnTxt: '去升级', onOuterClickDismiss: false});
			        logger.makeActivityLog('activity_lowversion_juge');
			        return false;
			    } else {
			    	return true;
			    }
			} else {
				return true;
			}
		},
		// 优惠券获取领取次数
		$getLotteryTimes(zippo_ids,callback){
			this.$store.dispatch('fetchLotteryTimes', {context: this, params: {zippo_ids: zippo_ids}}).then((response) => {
				callback(response)
			}).catch((err) => {
				//logger.makeActivityLog('activity_prizebadtime_juge');//获取次数接口异常埋点
				if(err.code == 401) {
					logger.makeActivityLog('activity_signbad_juge', {message: err.message});//登录账号异常
					// logger.makeActivityLog('activity_lotterysignbad_times');//登录账号异常
				}
				this.$handleReqErr(err);
			});
		}
  	},
	computed: {
		$psdWidth: function() {
			return Vue.__META__.psdWidth || 1080;
		}
	}
}