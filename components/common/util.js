import Vue from 'vue';
import Mixin from '../base/Mixin';
import Enum from './enum';
import store from './store';
import nativeinterface from './nativeinterface';
import util2 from './util2';

let ZINDEX = 1234;
let zippoPos = 0;
// 兑换
let zippoExPos = 0;
let appPos = 0;
let appLoginPos = 0;
let levelTaskPos = 0;
let freeTaskPos = 0;
let _cache = {};
export default {
	noop() {},
	isInBrowser: util2.isInBrowser,
	formatDate: function(format, date) {
	    var o = {
	        'M+': date.getMonth() + 1,
	        'd+': date.getDate(),
	        'h+': date.getHours(),
	        'm+': date.getMinutes(),
	        's+': date.getSeconds(),
	        'q+': Math.floor((date.getMonth() + 3) / 3),
	        'S': date.getMilliseconds()
	    };

	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }

	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
	                : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    }
	    return format;
	},
	createComponentProxy(S, data) {
		//为了可以让修改data时界面得到响应
		let vm = new Vue({
			data
		});
		vm.$destroy();
		
		S._Ctor = null;
		let Stub = Vue.extend(S);
		let Proxy = function(options) {
			let propsData = options.propsData = Vue.util.extend(options.propsData || {}, data);
			let vm = new Stub(options);
			let ufp = vm._updateFromParent;
			vm._updateFromParent = function() {
				arguments[0] = Vue.util.extend(arguments[0] || {}, propsData);
				ufp && ufp.apply(this, arguments);
			}
			return vm;
		}
		Vue.util.extend(Proxy, Stub);
		return Proxy;
	},

	// locate(node) {
	// 	if(node.$parent) {
	// 		return this.locate(node.$parent) + '.' + node.$parent.$newChildren.indexOf(node);
	// 	} else {
	// 		return '0';
	// 	}
	// },

	reset() {
		zippoPos = 0;
		zippoExPos = 0;
		appPos = 0;
		appLoginPos = 0;
		levelTaskPos = 0;
	},

	setCache(context, key, val) {
		if(!_cache[context.$location]) {
			_cache[context.$location] = {};
		}
		_cache[key] = val;
	},

	getCache(context, key) {
		if(!_cache[context.$location]) {
			return;
		} else {
			return _cache[context.$location][key];
		}
	},

	isObject(obj) {
		return obj !== null && typeof obj === 'object'
	},

	genZIndex() {
		return ZINDEX += 2;
	},

	isEmptyObject(obj) {
		return Object.keys(obj).length === 0;
	},

	getImgCSSVal(img) {
		return img && img.url ? `url(${img.url})` : '';
	},

	getImgUrl(img) {
		return img && img.url ? img.url : '';
	},

	findAwardById(awardId) {
		let awards = window.__ACTIVITY_CONFIG__.__AWARDS__;
    // awards=[
    //         {"index":0,"id":"6104","name":"魅族PRO6","type":"MATERIAL","icon":"https://img12.360buyimg.com/mobilecms/s220x220_jfs/t5215/252/15502760/100416/cb06f1da/58f709adN45511018.jpg","count":3},
    //         {"index":1,"id":"6105","name":"暖手宝移动电源","type":"MATERIAL","icon":"https://img12.360buyimg.com/mobilecms/s220x220_jfs/t5215/252/15502760/100416/cb06f1da/58f709adN45511018.jpg"},
    //         {"index":2,"id":"6106","name":"100元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439000.png"},
    //         {"index":3,"id":"6107","name":"碎片","type":"PROP","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439016.png"},{"index":4,"id":"6108","name":"20元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439045.png"},{"index":5,"id":"6109","name":"10元话费","type":"TELCHARGE","icon":"http://game.res.meizu.com/gamecenter/fileserver/activity/image/295/1486956439062.png"}];
		let len = awards.length;
		let award = null;
		if(!awardId) {
			return this.randomFormArr(this.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION));
		} else {
			while(len--) {
				if(awards[len].id == awardId) {
					award = awards[len];
					break;
				}
			}
			if(award) {
				award.idx = len;
			}
			return award;
		}
	},

	findAwardsByType(type) {
		let result = [];
		let awards = typeof window != 'undefined' && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__AWARDS__ : []; // window.__ACTIVITY_CONFIG__.__AWARDS__;
		for(let i = 0; i < awards.length; i++) {
			let award = awards[i];
			if(award.type == type) {
				award.idx = i;
				result.push(award);
			}
		}
		return result;
	},

	randomFormArr(arr) {
		if(!arr.length) return null;
		return arr[Math.floor(Math.random() * arr.length)];
	},

	setCommonStorage(id, val) {
		localStorage[id] = val;
	},

	getCommonStorage(id) {
		return localStorage[id];
	},

	setStorage(id, val) {
        var key = 'mzgame_activity_data_' + window.__ACTIVITY_ID__
        var storage = localStorage[key];
        if (!storage) {
            var obj = {};
            obj[id] = val;
            localStorage[key] = JSON.stringify(obj);
        } else {
            storage = JSON.parse(storage);
            storage[id] = val;
            localStorage[key] = JSON.stringify(storage);
        }
    },

    getStorage(id) {
        var key = 'mzgame_activity_data_' + window.__ACTIVITY_ID__;
        var storage = localStorage[key];
        if (storage) {
            storage = JSON.parse(storage);
            for (var k in storage) {
                if (k == id) {
                    return storage[k];
                }
            }
        }
        return false;
    },
    //应该不需要记录未上报成功的task 转而每次进活动都默认上报 这样可能会加重服务器负担
	getPendingPostTasks() {
		return this.getStorage('pendingPostTasks') || []; 
	},

	addPendingPostTask(taskId) {
		let pendingPostTask = this.getStorage('pendingPostTasks');
		if(!pendingPostTask) {
			pendingPostTask = [taskId];
		} else if(pendingPostTask.indexOf(taskId) == -1) {
			pendingPostTask.push(taskId);
		}
		this.setStorage('pendingPostTasks', pendingPostTask);
	},

	tryRemovePendingPostTask(taskId) {
		let pendingPostTask = this.getStorage('pendingPostTasks');
		if(!pendingPostTask || !pendingPostTask.length) return;
		for(let i = 0; i < pendingPostTask.length; i++) {
			if(pendingPostTask[i] == taskId) {
				pendingPostTask.splice(i, 1);
				break;
			}
		}
		this.setStorage('pendingPostTasks', pendingPostTask);
	},

    isOpenExpire(limitDay, openTime) {
        if(!limitDay || isNaN(limitDay) || limitDay <= 0 || !openTime) return false

        openTime -= 0

        let d = new Date(openTime + limitDay * 24 * 3600 * 1000);
        let deadline = new Date(0);
        deadline.setFullYear(d.getFullYear());
        deadline.setMonth(d.getMonth());
        deadline.setDate(d.getDate());
        if(Date.now() >= deadline.getTime()) {
            return true;
        } else {
            return false;
        }
        // if(new Date().getMonth() > new Date(openTime).getMonth()) return true

        // return new Date().getDate() - new Date(openTime).getDate() >= limitDay
    },

	getAppStatus(app) { //初始化 APP状态
		let status = Enum.APP_STATUS.UNINSTALL;
		if(nativeinterface.isAppInstalled(app.packageName)) { 
			if(app.type == 'OPEN') { //打开类
				let openTime = this.getStorage('open_' + app.appId);  
				if(this.isOpenExpire(app.limitDay, openTime)) {
					status = Enum.APP_STATUS.INSTALLED;
				} else {
					if(this.getStorage('task_' + app.taskId)) { // 打开过
						status = Enum.APP_STATUS.GOT;
					} else { // 安装了没打开过
						status = Enum.APP_STATUS.INSTALLED;
					}
				}
			} else { //安装类
				status = Enum.APP_STATUS.INSTALLED;
				if(this.getStorage('task_' + app.taskId)) {
					status = Enum.APP_STATUS.GOT;
				}
			}
		}
		return status;
	},

	canGetMore() {
		if(this.isInBrowser() && window.__ACTIVITY_CONFIG__) {
			return window.__ACTIVITY_CONFIG__.__APPS__.some((app) => {
				if(!app._status) {
					app._status = this.getAppStatus(app);
				}
				return app._status != Enum.APP_STATUS.GOT;
			});
		} else {
			return false;
		}
	},

	getZippos(count, _pos) {
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : zippoPos;
			let zippos = window.__ACTIVITY_CONFIG__.__ZIPPOS__.slice(pos, pos + count);
			zippoPos += zippos.length;
			zippos.forEach((zippo) => {
				if(zippo.type == 'EXCHANGE'){
					zippoExPos++;
				}
			})
			return zippos;
		} else {
			return [];
		}
	},
	getzippoEx(count, _pos) {
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : zippoExPos,
				_zippos = [];
			window.__ACTIVITY_CONFIG__.__ZIPPOS__.forEach((zippo) => {
				if(zippo.type == 'EXCHANGE'){
					_zippos.push(zippo);
				}
			})
			let zippos =_zippos.slice(pos, pos + count);
			zippoExPos += zippos.length;
			return zippos;
		} else {
			return [];
		}
	},
	getFreeTask(count,_pos){
		// freeTaskPos
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : freeTaskPos,
				_task = [];
			window.__ACTIVITY_CONFIG__.__TASKS__.forEach((task) => {
				if(task.type == 'FREE'){
					_task.push(task);
				}
			})
			let task = _task.slice(pos, pos + count);
			freeTaskPos += task.length;
			return task;
		} else {
			return [];
		}
	},
	getLevelTask(count,_pos){
		// levelTaskPos
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : levelTaskPos,
				_task = [];
			window.__ACTIVITY_CONFIG__.__TASKS__.forEach((task) => {
				if(task.type == 'USER_LEVEL'){
					_task.push(task);
				}
			})
			let task = _task.slice(pos, pos + count);
			levelTaskPos += task.length;
			return task;
		} else {
			return [];
		}
	},
	getApps(count, _pos) {
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : appPos;
			let apps = window.__ACTIVITY_CONFIG__.__APPS__.slice(pos, pos + count)
			appPos += apps.length;
			return apps;
			// let apps = window.__ACTIVITY_CONFIG__.__APPS__,//.slice(pos, pos + count),
			// 	nonLogin = [],
			// 	lapps = [],
			// 	i = 0;
			// 	for(i = 0; i < apps.length; i++){
			// 		if(apps[i].type != 'INSTALL_LOGIN'){
			// 			nonLogin.push(apps[i])
			// 		}
			// 	}
			// lapps = nonLogin.slice(pos, pos + count)
			// appPos += lapps.length;
			// return lapps;
		} else {
			return [];
		}
	},

	getLoginApps(count,_pos){
		if(!count) count = 1;
		if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
			let pos = _pos !== undefined ? _pos : appLoginPos,
				apps = window.__ACTIVITY_CONFIG__.__APPS__,
				loginApps = [],
				i = 0;
			for(i = 0; i < apps.length; i++){
				if(apps[i].type == 'INSTALL_LOGIN'){
					loginApps.push(apps[i])
				}
			}
			let lapps = loginApps.slice(pos, pos + count)
			appLoginPos += lapps.length;
			return lapps;
		} else {
			return [];
		}
	},

	isMaterial(type) {
		return type == Enum.AWARD_TYPE.MATERIAL || type == Enum.AWARD_TYPE.MATERIAL100;
	},

	getStrLen(str) {
		if (str == null) return 0;
		if (typeof str != "string"){
	    	str += "";
	  	}
		return str.replace(/[^\x00-\xff]/g,"xx").length;
	}
} 