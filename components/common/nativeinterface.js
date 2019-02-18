import EventEmitter from 'eventemitter3';
import Enum from './enum';
import Vue from 'vue';
import util from './util2';

let CHECK_LOGIN_TIMEOUT = 300;
const OAUTH_REQUEST_TIMEOUT = 6000; //6秒
let global = util.isInBrowser() ? window : (function() {return this})() || {};
let emitter = new EventEmitter();
let noop = function() {};
let _isMzBrower = global.MzJavascriptInterface ? true : false;
let _isNative = global.EventJavascriptInterface ? (_isMzBrower ? false : true) : false;
let _isSupportNewApi = global.InnerNavigationJsInterface ? true : false;
const Interface = {};

let _oauthRequestTimer = -1;
let _userId = '';
let _oauthRequestQueue = []; //因为客户端原因不能并发oauthRequest，只能在前一个request 触发onTokenSuccess/onTokenError之后继续

global.__PROMISE_MAP__ = {};

let _lotteryTag = '';
let _getTokenTag = '';
let IS_PRODUCTION = process.env.NODE_ENV == 'production';
let API_PREFIX = util.isInBrowser() ? (`${window.location.protocol}//${IS_PRODUCTION ? 'api-game.meizu.com' : window.location.host}/games`) : '';

function createPromise() {
    let promiseResolve;
    let promiseReject;
    let promise = new Vue.Promise(function(resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });
    promise.resolve = promiseResolve;
    promise.reject = promiseReject;
    return promise;
}

function startCheckLogin() {
    let needCheckOauthTimeout = Number(Interface.getVersionCode(0, 'com.meizu.flyme.gamecenter') || 0) < 6006002;
    function checkOauthRequestTimeout() {
        let currtRequest = _oauthRequestQueue[0];
        if(currtRequest && (Date.now() - currtRequest.start) >= OAUTH_REQUEST_TIMEOUT) {
            _onOauthTokenError({code: 401, message: 'token timeout'});
        }
    }
    function checkLogin() {
        let newUserId = Interface.getUserId()
        if(_userId != newUserId) {
            _userId = newUserId;
            //Interface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES); //触发更新抽奖次数 (fixbug)
            if(_userId) {
                Interface.emit(Enum.INTERFACE_EVENT.LOGIN); //触发登录事件
                CHECK_LOGIN_TIMEOUT = 800;
            } else {
                Interface.emit(Enum.INTERFACE_EVENT.LOGOUT);
                CHECK_LOGIN_TIMEOUT = 300;
            }
        }
        if(needCheckOauthTimeout) {
            checkOauthRequestTimeout();
        }
        setTimeout(checkLogin, CHECK_LOGIN_TIMEOUT);
    }
    setTimeout(checkLogin, CHECK_LOGIN_TIMEOUT);
}

if(!global.EventJavascriptInterface) {
    global.EventJavascriptInterface = {
        oauthRequest: noop,
        isAppInstalled: noop,
        pay:noop,
        isFringeScreen: noop,
        isFringeDevice: noop,
        isFullScreenDevice: noop,
        onAppShowInPage: noop,
        requestChance: noop,
        getUserId: function () {return 11;},
        login: noop,
        getPhoneNumber: function () {return '10000000000'},
        launchApp: noop,
        gotoAppInfoPage: noop,
        onInstallButtonClick: noop,
        // todo
        installAppById: noop,
        lottery: noop,
        installApp: noop, //meizu浏览器api
        getIMEI: noop,
        getSN: noop,
        getVersionCode: noop,
        goBackDirectly: noop,
        setClipContent: noop, //复制
        setActivityTasks: noop,
        subscribeSuccess: noop, //预约成功回调,
        getToken: noop,
        vibrate: noop, //震动
    }
}

if(!global.InnerNavigationJsInterface) {
    global.InnerNavigationJsInterface = {
        toHome: noop, 
        toGameDetail: noop,
        toHotGames: noop,
        toSpecialTopic: noop,
        toMyGifts: noop,
        toMyCodes: noop,
        toHelp: noop,
        toNewServer: noop,
        toForum: noop,
        toGiftCenter: noop,
        toActivity: noop,
        toBest: noop,
        toWelfare: noop,
        toWelfareDetail: noop,
        toMgc: noop,
        toNewsDetail: noop,
        toUserCenter: noop,
        toLiveZoneDetail: noop,
        toMyCoupon: noop,
        toSearch: noop,
        toSimpleRankList: noop
    }
}

if(!global.MzJavascriptInterface) {
    global.MzJavascriptInterface = {
        getIMEI: function() { return ''; }
    }
}

if(!global.MzPrivateJavascriptInterface) {
    global.MzPrivateJavascriptInterface = {
        getSN: function() { return ''; }
    }
}
global.notifyDownProgress = function(pkg, btnText, textColor, bgColor, clickEnable, isInstalled) {
    emitter.emit(Enum.INTERFACE_EVENT.APP_PROGRESS, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
    if (isInstalled) {
        emitter.emit(Enum.INTERFACE_EVENT.APP_INSTALLED, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
    } else {
        if(btnText == '继续' || btnText == '安装') {
            emitter.emit(Enum.INTERFACE_EVENT.APP_DEFAULT, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
        } else if(/\d+%/.test(btnText) || btnText == '等待下载' || btnText == '正在链接') {
            emitter.emit(Enum.INTERFACE_EVENT.APP_DOWNLOADING, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
        }
    }
}

global.onLotteryStart = function() {
    emitter.emit(Enum.INTERFACE_EVENT.START_LOTTERY);
}

global.onLotteryStop = function(result) {
    emitter.emit(Enum.INTERFACE_EVENT.STOP_LOTTERY, result);
    let promise = global.__PROMISE_MAP__[_lotteryTag];
    if(promise) {
        try {
            promise.resolve(JSON.parse(result));
        } catch(err) {
            promise.reject(err);
        }
        delete global.__PROMISE_MAP__[_lotteryTag];
    }
}

global.onWindowHide = function() {
    emitter.emit(Enum.INTERFACE_EVENT.PAGE_HIDE);
}

global.onWindowShow = function() {
    emitter.emit(Enum.INTERFACE_EVENT.PAGE_SHOW);
}

global.onPaySucess = function(appId, pkgName) {
    emitter.emit(Enum.INTERFACE_EVENT.PAY_SUCCESS, appId, pkgName);
}

global.onPayError = function onPayError(appId, pkgName, errorCode, errorMsg) {
    emitter.emit(Enum.INTERFACE_EVENT.PAY_ERROR, appId, pkgName, errorCode, errorMsg);
}

global.onTokenSuccess = function(tag, isFromLogin) {
    emitter.emit(Enum.INTERFACE_EVENT.TOKEN_SUCCESS, tag, isFromLogin);
    _oauthRequestQueue.shift(); //移出工作队列
    let nextRequest = _oauthRequestQueue[0]; //检查是否有下个请求
    if (nextRequest) {
        nextRequest.start = Date.now(); //更新开始时间
        EventJavascriptInterface.oauthRequest(nextRequest.tag, nextRequest.url, JSON.stringify(nextRequest.data));
    }
}

global.onGetTokenSuccess = function(token) {
    let promise = global.__PROMISE_MAP__[_getTokenTag];
    if(promise) {
        promise.resolve(token);
        delete global.__PROMISE_MAP__[_getTokenTag];
    }
}

global.onGetTokenError = function() {
    let promise = global.__PROMISE_MAP__[_getTokenTag];
    if(promise) {
        promise.reject();
        delete global.__PROMISE_MAP__[_getTokenTag];
    }
}

function _onOauthTokenError(reason) {
    while(_oauthRequestQueue[0]) {
        let curRequest = _oauthRequestQueue[0];
        let tag = curRequest.tag;
        let promise = global.__PROMISE_MAP__[tag];
        if(promise) {
            promise.reject(reason);
            delete global.__PROMISE_MAP__[tag];        
        }
        _oauthRequestQueue.shift(); //移出工作队列
    }
}

global.onTokenError = function(tag, errorCode) { //Token出错后续所有请求默认失败
    emitter.emit(Enum.INTERFACE_EVENT.TOKEN_ERROR, tag, errorCode);
    _onOauthTokenError({code: 401, message: 'token error'});

    let promise = global.__PROMISE_MAP__[tag]; //fix 部分版本问题请求同时调用onTokenSuccess onTokenError问题
    if(promise) {
        promise.reject({code: 401, message: 'token error'});
        delete global.__PROMISE_MAP__[tag];        
    }
}

global.onOauthResponse = function(tag, responseJson) {
    emitter.emit(Enum.INTERFACE_EVENT.OAUTH_RESPONSE, tag, responseJson);
    let promise = global.__PROMISE_MAP__[tag];
    if(promise) {
        try {
            promise.resolve(JSON.parse(responseJson));
        } catch(err) {
            try {
                promise.resolve((new Function('return ' + responseJson.replace(/\n/g, '//n')))());
            } catch(err) {
                promise.reject(err);
            }
        }
        delete global.__PROMISE_MAP__[tag];
    }
}

global.onOauthError = function(tag, errorMsg) {
    console.error(errorMsg);
    emitter.emit(Enum.INTERFACE_EVENT.OAUTH_ERROR, tag, errorMsg);
    let promise = global.__PROMISE_MAP__[tag];
    if(promise) {
        promise.reject({code: 401, message: 'oauth error'});
        delete global.__PROMISE_MAP__[tag];
    }
    _onOauthTokenError({code: 401, message: 'oauth error'});
}

global.Activity = {
    notifyLotteryTimes() {
        emitter.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES, true); //FromNative
    }
}

Interface.login = function() {
    if(!_isNative) {
        if(!util.isInBrowser()) return;
        localStorage['mz_game_access_token'] = ''
        location.href = 'https://login.flyme.cn/authorize/cert.html?'
                        + 'appuri=' + location.protocol + '//' +  location.host + location.pathname 
                        +  (util.getUrlParam('channel_id') ? '?channel_id='+ util.getUrlParam('channel_id') : '')
                        + '&service=uc&scope=trust&clientId=pkj6DgyJooci9hkcijtwfnfctbtiqcdh&clientSecret=ptdje0meulhrvEsb8webmjNziztszwsc'
                        + '&imei=' + MzJavascriptInterface.getIMEI()
                        + '&sn=' + MzPrivateJavascriptInterface.getSN()
    } else {
        global.EventJavascriptInterface.login()
    }
}



Interface.getUserInfoBy = function() {
    return function() {
        if(!util.isInBrowser()) return null;
        var access_token_local = localStorage['mz_game_access_token'] && JSON.parse(localStorage['mz_game_access_token'])
        if(!access_token_local || access_token_local.expires <= Date.now()) {
            localStorage['mz_game_access_token'] = ''
            //Interface.login()
            return null
        }
        return access_token_local[param]
    }
}

Interface.getUserId = function() {
    if(process.env.NODE_ENV != 'production') { //fot test
        return '1';
    } else {
        return !_isNative ? Interface.getUserInfoBy('uid')() : EventJavascriptInterface.getUserId();
    }
}
//复制
Interface.setClipContent = function(param) {
    return EventJavascriptInterface.setClipContent(param);
}
//预约成功回调
Interface.subscribeSuccess = function(appId, pkgName, subscribedCount) {
    return EventJavascriptInterface.subscribeSuccess(appId, pkgName, subscribedCount);
}

Interface.getUserToken = Interface.getUserInfoBy('access_token');

Interface.getToken = function(refresh) {
    if(_isNative) {
        _getTokenTag = util.genId();
        global.__PROMISE_MAP__[_getTokenTag] = createPromise();
        global.EventJavascriptInterface.getToken(refresh);
        return global.__PROMISE_MAP__[_getTokenTag];
    } else {
        if(IS_PRODUCTION) {
            return Vue.Promise.reject(new Error('unsupport api'));
        } else {
            return Vue.Promise.resolve('');
        }
    }
};

Interface.oauthRequest = function(url, data) {
    let tag = util.genId()
    data = data || {}
    if(!_isNative) {
        data.uid = Interface.getUserId()
        data.access_token = Interface.getUserToken()
        data.imei = MzJavascriptInterface.getIMEI()
        data.sn = MzPrivateJavascriptInterface.getSN()
        // for(var i in data) {
        //     if(typeof data[i] == 'object') {
        //         data[i] = JSON.stringify(data[i])
        //     }
        // }
        // console.log(data)
        return Vue.http.jsonp(`${API_PREFIX}${url}`, {
            jsonp: 'jsonpCallback',
            params: data
        });
    } else {
        global.__PROMISE_MAP__[tag] = createPromise();
        if (!_oauthRequestQueue.length) {
            //工作队列为空 立即请求
            EventJavascriptInterface.oauthRequest(tag, url, JSON.stringify(data));
        } 
       //添加到工作队列
        _oauthRequestQueue.push({
           tag: tag,
           url: url,
           data: data,
           start: Date.now()
        }); 
        
        return global.__PROMISE_MAP__[tag];
    } 
}

Interface.lottery = function(zippoArr) {
    if(!_isNative) {
        var params = {
            uid: Interface.getUserId(),
            access_token: Interface.getUserToken(),
            imei: MzJavascriptInterface.getIMEI(),
            sn: MzPrivateJavascriptInterface.getSN(),
            zippo_ids: zippoArr.join(',')
        }
        return Vue.http.jsonp(`${API_PREFIX}/oauth/activity/zippo/do/${global.__ACTIVITY_ID__}`, {
            before: global.onLotteryStart,
            jsonp: 'jsonpCallback',
            params: params
        })
    } else {
        _lotteryTag = util.getId()
        global.__PROMISE_MAP__[_lotteryTag] = createPromise();
        EventJavascriptInterface.lottery(zippoArr)
        return global.__PROMISE_MAP__[_lotteryTag]
    }
}

Interface.gotoAppInfoPage = function(pkg) {
    if(!_isNative) {
        location.href = 'https://game-res.meizu.com/resources/gameh5/html/app/details.html?' 
                        + 'packageName=' + pkg + '&'  
                        + 'channel_id=' + util.getUrlParam('channel_id') + '&'
                        + '_=' + Date.now()
    } else {
        global.EventJavascriptInterface.gotoAppInfoPage(pkg)
    }
}

Interface.isAppInstalled = function(pkg) {
    return !_isNative ? global.EventJavascriptInterface.isAppInstalled(pkg, 0) : EventJavascriptInterface.isAppInstalled(pkg) 
}
Interface.pay = function(productId){
    return !_isNative ? global.EventJavascriptInterface.pay(productId+'') : EventJavascriptInterface.pay(productId+'') 
}
// 判断是否是刘海屏
Interface.isFringeScreen = function() {
    return !_isNative ? global.EventJavascriptInterface.isFringeScreen ? global.EventJavascriptInterface.isFringeScreen() : false : EventJavascriptInterface.isFringeScreen ? EventJavascriptInterface.isFringeScreen() : false 
}

// 无参,返回boolean:刘海屏机器且刘海位置显示内容返回true,其余为false
Interface.isFringeDevice = function() {
    return !_isNative ? global.EventJavascriptInterface.isFringeDevice ? global.EventJavascriptInterface.isFringeDevice() : false : EventJavascriptInterface.isFringeDevice ? EventJavascriptInterface.isFringeDevice() : false 
}

// 无参,返回boolean:是否全面屏机器(18:9及以上)
Interface.isFullScreenDevice = function() {
    return !_isNative ? global.EventJavascriptInterface.isFullScreenDevice ? global.EventJavascriptInterface.isFullScreenDevice() : false : EventJavascriptInterface.isFullScreenDevice ? EventJavascriptInterface.isFullScreenDevice() : false 
}
Interface.onAppShowInPage = function(pkgs) {
    return !_isNative ? null : global.EventJavascriptInterface.onAppShowInPage(pkgs) 
}

Interface.launchApp = function(pkg) {
    return !_isNative ? global.EventJavascriptInterface.installApp(1, pkg, 0) || true : EventJavascriptInterface.launchApp(pkg) 
}

Interface.onInstallButtonClick = function(id, pkg) {
    var c = util.getUrlParam('channel_id');
    return !_isNative ? global.EventJavascriptInterface.installApp(1, (c ? pkg + '_channelId' + c : pkg), 0) : EventJavascriptInterface.onInstallButtonClick(Number(id), pkg);
}

Interface.getVersionCode = function(id,pkgs) {
    return !_isNative ? null : global.EventJavascriptInterface.getVersionCode(id,pkgs) 
}

Interface.updateApp = function(id,pkgs) {
    return !_isNative ? null : global.EventJavascriptInterface.updateApp(id,pkgs) 
}

Interface.goBackDirectly = function(id,pkgs) {
    return !_isNative ? null : global.EventJavascriptInterface.goBackDirectly() 
}
//http://gitlab.meizu.com/Game/InternalNavigation 接口
Interface.toHome = function(type) {
    global.InnerNavigationJsInterface.toHome(type);
}

Interface.toGameDetail = function(url, title) {
    global.InnerNavigationJsInterface.toGameDetail(url, title);
}

Interface.toSubscribeGameDetail = function(appId, appName, isSubscribe, pkg) {
    global.InnerNavigationJsInterface.toSubscribeGameDetail(appId, appName, isSubscribe, pkg);
}

Interface.toHotGames = function(url, title) {
    global.InnerNavigationJsInterface.toHotGames(url, title);
}

Interface.toSpecialTopic = function(url, title) {
    global.InnerNavigationJsInterface.toSpecialTopic(url, title);
}

Interface.toMyGifts = function() {
    global.InnerNavigationJsInterface.toMyGifts();
}

Interface.toMyCodes = function() {
    global.InnerNavigationJsInterface.toMyCodes();
}

Interface.toHelp = function(url) {
    global.InnerNavigationJsInterface.toHelp(url);
}

Interface.toNewServer = function() {
    global.InnerNavigationJsInterface.toNewServer();
}

Interface.toForum = function(url, title) {
    global.InnerNavigationJsInterface.toForum(url, title);
}

Interface.toGiftCenter = function() {
    global.InnerNavigationJsInterface.toGiftCenter();
}

Interface.toActivity = function(url, title) {
    global.InnerNavigationJsInterface.toActivity(url, title);
}

Interface.toBest = function(url, title) {
    global.InnerNavigationJsInterface.toBest(url, title);
}

Interface.toWelfare = function(url, title, forwardType) {
    global.InnerNavigationJsInterface.toWelfare(url, title, forwardType);
}

Interface.toWelfareDetail = function(appId) {
    global.InnerNavigationJsInterface.toWelfareDetail(appId);
}

Interface.toMgc = function(url) {
    global.InnerNavigationJsInterface.toMgc(url);
}

Interface.toNewsDetail = function(url) {
    global.InnerNavigationJsInterface.toNewsDetail(url);
}

Interface.toUserCenter = function(mgcUrl, helpUrl) {
    global.InnerNavigationJsInterface.toUserCenter(mgcUrl, helpUrl);
}

Interface.toLiveZoneDetail = function(id, gameName) {
    global.InnerNavigationJsInterface.toLiveZoneDetail(id, gameName);
}

Interface.toMyCoupon = function() {
    global.InnerNavigationJsInterface.toMyCoupon();
}

Interface.toSearch = function() {
    global.InnerNavigationJsInterface.toSearch();
}
Interface.toSimpleRank = function(url, title) {
    global.InnerNavigationJsInterface.toSimpleRank(url, title);
}


Interface.getIMEI = function() {
    if(_isNative) {
        return util.getUrlParam('imei');
    } else if(_isMzBrower && global.MzJavascriptInterface) {
        return global.MzJavascriptInterface.getIMEI();
    } else {
        return '';
    }
}
Interface.getIMEI = function () {
  return !_isNative ? null : EventJavascriptInterface.getIMEI()
}
Interface.getSN = function () {
  return !_isNative ? null : EventJavascriptInterface.getSN()
}

Interface.isNative = function() {
    return _isNative; 
}

Interface.isSupportNewApi = function() {
    return _isSupportNewApi;
}

Interface.requestChance = function(arr) {
    return global.requestChance(arr);
}

//[{"task_id":"1001","task_type":"LIVE_DETAIL","activity_id": 100},{"task_id":"1002","task_type":"TOP_LAYOUT","activity_id": 100}]
Interface.setActivityTasks = function(tasks) {
    return global.EventJavascriptInterface.setActivityTasks(tasks);
}

//添加震动
Interface.vibrate = function (time) {
    return (_isNative && !!EventJavascriptInterface.vibrate) ? EventJavascriptInterface.vibrate(time): null;
}

Object.keys(EventEmitter.prototype).forEach(function(key) {
    if(typeof emitter[key] == 'function') {
        Interface[key] = emitter[key].bind(emitter);
    }
})

if(util.isInBrowser()) { //在浏览器环境
    if(!_isNative) {
        var access_token_url = util.getUrlParam('access_token') && decodeURIComponent(util.getUrlParam('access_token'))
        var access_token_local = localStorage['mz_game_access_token'] && JSON.parse(localStorage['mz_game_access_token'])
        if(access_token_url) {
            if(!access_token_local) {
                var access_token = access_token_url.access_token
                var expires_in = access_token_url.expires_in
                var uid = access_token_url.user_id
                var phone = access_token_url.phone
                localStorage['mz_game_access_token'] = JSON.stringify({access_token: access_token, expires: Date.now() + expires_in * 1000, uid: uid, phone: phone})            
            }
        }
        // } else {
        //     if(!access_token_local || access_token_local.expires <= Date.now()) {
        //         Interface.login()
        //     }
        // }
    }
    _userId = Interface.getUserId();
    startCheckLogin(); //检查登录状态
}

export default Interface;