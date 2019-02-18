import Vue from 'vue';
import { defineMotion } from '../base/Assit';
import Enum from './enum';
import DialogBuilder from '../base/DialogBuilder';
import BottomSheetBuilder from '../base/BottomSheetBuilder';
import Address from '../littles/Address.vue';
import NativeInterface from '../common/nativeinterface';
import MyAwards from '../littles/MyAwards.vue';
import WinnerList from '../littles/WinnerList.vue';
import PhoneForm from '../littles/PhoneForm.vue';
import PreText from '../littles/PreText.vue';
import util from '../common/util';
import logger from 'common/logger';
import { phoneValidator } from 'common/validators';
import Issues from '../littles/Issues.vue';

defineMotion(Enum.MOTION.OPEN_URL, {
    name: '跳转地址',
    params: [{
        type: String,
        $rule: {
            name: '链接地址',
        }
    }],
    do: function openUrl(url) {
        window.open(url);
    }
});

defineMotion(Enum.MOTION.GO_APP_INFO, {
    name: '跳转游戏详情页(默认取后台配置)',
    params: [{
        type: String,
        $rule: {
            name: '游戏id'
        }
    }, {
        type: String,
        $rule: {
            name: '包名'
        }
    }, {
        type: String,
        $rule: {
            name: '游戏名称'
        }
    }],
    do: function goAppInfo(appId, pkg, appName, appStatus=50) {
        if(!appId) {
            if(window.__ACTIVITY_CONFIG__ && window.__ACTIVITY_CONFIG__.__APPS__ && window.__ACTIVITY_CONFIG__.__APPS__.length) {
                let app = window.__ACTIVITY_CONFIG__.__APPS__[0];
                appId = app.appId;
                pkg = app.packageName;
                appName = app.name;
                appStatus = app.appStatus || 50;
            }
        }
        if(NativeInterface.isSupportNewApi()) {
            let url = `http://api-game.meizu.com/games/public/detail/${appId}`;
            NativeInterface.toGameDetail(url, appName)
        } else {
            let version = 7003000;
            if(process.env.NODE_ENV == 'production') {
                if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < version) {
                    NativeInterface.gotoAppInfoPage(pkg);
                }else{
                    NativeInterface.gotoAppInfoPage(pkg,appStatus);
                }
            }
            // NativeInterface.gotoAppInfoPage(pkg);
        }
        logger.makeActivityLog('activity_jump_detail', {app_id: appId || ''});
    }
});

defineMotion(Enum.MOTION.GO_SUBSCRIBE_INFO, {
    name: '跳转预约游戏详情页(默认取后台配置)',
    params: [{
        type: String,
        $rule: {
            name: '游戏id'
        }
    }, {
        type: String,
        $rule: {
            name: '包名'
        }
    }, {
        type: String,
        $rule: {
            name: '游戏名称'
        }
    }],
    do: function goSubscribeAppInfo(appId, pkg, appName, appStatus = 50) {
        if(!appId) {
            if(window.__ACTIVITY_CONFIG__ && window.__ACTIVITY_CONFIG__.__APPS__ && window.__ACTIVITY_CONFIG__.__APPS__.length) {
                let app = window.__ACTIVITY_CONFIG__.__APPS__[0];
                appId = app.appId;
                pkg = app.packageName;
                appName = app.name
                appStatus = app.appStatus || 50;
            }
        }
        let subscribeStatus = false
        if(NativeInterface.isSupportNewApi()) {
            // let url = `http://api-game.meizu.com/games/public/detail/${appId}`;
            // NativeInterface.toSubscribeGameDetail(url, appName)
            if(NativeInterface.getUserId()) {
                // 获取预约状态
                this.$store.dispatch('fetchSubscribeApp',{context:this, params:{'game_id':appId}}).then((response)=> {
                    if(response == true) {
                        subscribeStatus = true
                    }
                    lowerCompatible(appId, appName, subscribeStatus, pkg)
                }).catch(() => {
                    // Totast.of(this).show('出错了，请重试～<2001>')
                    lowerCompatible(appId, appName, subscribeStatus, pkg)
                })
            }else{
                lowerCompatible(appId, appName, subscribeStatus, pkg)
            }
        } else {
            let version = 7003000;
            if(process.env.NODE_ENV == 'production') {
                if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < version) {
                    NativeInterface.gotoAppInfoPage(pkg);
                }else{
                    NativeInterface.gotoAppInfoPage(pkg,appStatus);
                }
            }
        }
        function lowerCompatible(appId, appName, subscribeStatus, pkg){
            let current = NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter')
            if(current < 6008007){
                let url = `http://api-game.meizu.com/games/public/detail/${appId}`;
                NativeInterface.toGameDetail(url, appName)
            }else{
                NativeInterface.toSubscribeGameDetail(appId, appName, subscribeStatus, pkg)
            }
        }
        logger.makeActivityLog('activity_jump_detail', {app_id: appId || ''});
    }
});

defineMotion(Enum.MOTION.SHOW_DIALOG, {
    name: '弹出对话框',
    params: [{
        type: String,
        $rule: {
            name: '标题'
        }
    }, {
        type: String,
        $rule: {
            name: '内容'
        }
    }],
    do: function showDialog(title, content) {
        DialogBuilder.of(this).alert(title, content);
    }
});

defineMotion(Enum.MOTION.INSTALL_APP, {
    name: '下载app',
    params: [{
        type: String,
        // $rule: {
        //     name: '应用id'
        // }
    }, {
        type: String,
        // $rule: {
        //     name: '包名'
        // }
    }],
    do: function installApp(id, pkg) {
        if(!id) {
            if(window.__ACTIVITY_CONFIG__ && window.__ACTIVITY_CONFIG__.__APPS__ && window.__ACTIVITY_CONFIG__.__APPS__.length) {
                let app = window.__ACTIVITY_CONFIG__.__APPS__[0];
                id = app.appId;
                pkg = app.packageName;
            }
        }
        if(!NativeInterface.isAppInstalled(pkg)) {
            logger.makeActivityLog('activity_click_install', {app_id: id || ''});
            NativeInterface.onInstallButtonClick(Number(id), pkg);
        }
    }
});

defineMotion(Enum.MOTION.INSTALL_LOGIN_APP, {
    name: '下载登录app',
    params: [{
        type: String,
        // $rule: {
        //     name: '应用id'
        // }
    }, {
        type: String,
        // $rule: {
        //     name: '包名'
        // }
    }],
    do: function installAppLogin(id, pkg) {
        let apps = [],
            app = {},
            i = 0
        if(!id) {
            if(window.__ACTIVITY_CONFIG__ && window.__ACTIVITY_CONFIG__.__APPS__ && window.__ACTIVITY_CONFIG__.__APPS__.length) {
                apps = window.__ACTIVITY_CONFIG__.__APPS__
                let loginApps = [];
                for(i = 0; i < apps.length; i++){
                    if(apps[i].type == 'INSTALL_LOGIN'){
                        loginApps.push(apps[i])
                    }
                }
                app = apps[0]
                id = app.appId;
                pkg = app.packageName;
            }
        }else{
            if(window.__ACTIVITY_CONFIG__ && window.__ACTIVITY_CONFIG__.__APPS__ && window.__ACTIVITY_CONFIG__.__APPS__.length) {
                apps = window.__ACTIVITY_CONFIG__.__APPS__;
                for(i = 0; i < apps.length; i++){
                    if(apps[i].appId == id){
                        app = apps[i]
                        break
                    }
                }
            }
        }
        if(!NativeInterface.isAppInstalled(pkg)) {
            logger.makeActivityLog('activity_click_install', {app_id: id || ''});
            NativeInterface.onInstallButtonClick(Number(id), pkg);
        }else if(NativeInterface.launchApp(pkg)){
            // this.postTask(app.taskId);
            if(NativeInterface.getUserId()) {
                if(!this.$checkVersion()) return;
                logger.makeActivityLog('activity_dotask_num');
                this.$store.dispatch('postTask', {context: this, params: {task_ids: app.taskId, content: {status: 2}}}).then((val) => {
                    logger.makeActivityLog('activity_dotask_success');
                }).catch((err)=> {
                    logger.makeActivityLog('activity_dotask_failed');
                });
            } else {
                DialogBuilder.of(this).confirm('登录后才可以获取抽奖机会哦~', function() {
                    this.dismiss();
                    NativeInterface.login();
                }, {confirmBtnTxt: '登录'});
            }   
        }else {
            DialogBuilder.of(this).alert('打开失败', '');
        }
    }
});

defineMotion(Enum.MOTION.MY_AWARD, {
    name: '我的奖品',
    params: [{
        type: String,
        $rule: {
            name: 'title'
        }
    }],
    do: function myAwards(title) {
        logger.makeActivityLog('activity_myawards_clicks');
        if(NativeInterface.getUserId()) {
            this.$store.dispatch('fetchMyAwards', {context: this})
            .then((response) => {
                title = title || '我的奖品';
                let content = '';
                let isAddress = '';
                let myAwards = this.$store.state.myAwards;
                let map = {};
                let infos = [];
                myAwards.forEach((value) => {
                    if(value.type == Enum.AWARD_TYPE.INTEGRATION || value.type == Enum.AWARD_TYPE.PAYINTEGRATION || value.type == Enum.AWARD_TYPE.PROP) {
                        return;
                    }
                    // 话费，虚拟奖品，流量拆分开
                    if (typeof map[value.award_id] != 'undefined' && value.type != 'TELCHARGE' && value.type != 'VIRTUAL' && value.type != 'RATEOFFLOW') {
                        map[value.award_id].count++;
                        return;
                    } else {
                        let award = util.findAwardById(value.award_id) || {};
                        award = Vue.util.extend({count: 1, awardRecordId: value.id || 0, status: value.status, code: value.code}, award);
                        map[value.award_id] = award;
                        if(process.env.NODE_ENV != 'production') {
                            award.type = value.type;
                        }
                        infos.push(award);
                    }
                });
                let _MyAwards = Vue.extend(MyAwards);
                BottomSheetBuilder.of(this).show(title, util.createComponentProxy(_MyAwards, {'infos': infos}));
            }).catch((err)=> {
                this.$handleReqErr(err);
            });
        } else {
            DialogBuilder.of(this).confirm('登录后才能查看我的奖品哦~', function() {
                this.dismiss();
                NativeInterface.login();
            }, {confirmBtnTxt: '登录'});
        }
    }
});

defineMotion(Enum.MOTION.RULE_TXT, {
    name: '活动规则',
    params: [{
        type: String,
        $rule: {
            name: '标题'
        }
    }, {
        type: String,
        $rule: {
            name: '规则内容,空为默认值',
            clazz: Enum.CLAZZ.TEXTAREA
        }
    }],
    do: function ruleTxt(title, content) {
        logger.makeActivityLog('activity_ruletxt_clicks');
        title = title || '活动规则';
        let _PrevText = Vue.extend(PreText)
        BottomSheetBuilder.of(this).show(title, util.createComponentProxy(_PrevText, {content: content}));
    }
});

defineMotion(Enum.MOTION.WINNER_LIST, {
    name: '中奖名单',
    params: [{
        type: String,
        $rule: {
            name: 'title'
        }
    }],
    do: function winnerList(title) {
        logger.makeActivityLog('activity_winnerlist_clicks');
        this.$store.dispatch('fetchWinnerList', {context: this}).then((response) => {
            title = title || '中奖名单';
            let winnerList = this.$store.state.winnerList;
            let _WinnerList = Vue.extend(WinnerList);
            BottomSheetBuilder.of(this).show(title, util.createComponentProxy(_WinnerList, {'infos': winnerList}));
        }).catch((err)=> {
            this.$handleReqErr(err);
        });
    }
});

defineMotion(Enum.MOTION.ADDRESS, {
    name: '填写地址',
    params:[],
    do: function address() {
        this.$parent.hasOwnProperty('dismiss') && this.$parent.dismiss(); //todo history.back()?
        this.$store.dispatch('fetchPlayerInfo', {context: this}).then((response)=> {
            // AddressBuilder.of(this).show();
            let _Address = Vue.extend(Address);
            BottomSheetBuilder.of(this).show('地址信息', util.createComponentProxy(_Address));
        }).catch(function() {
            DialogBuilder.of(this).alert('出错了！刷新看看～');
        });
    }
});

defineMotion(Enum.MOTION.PHONE, {
    name: '填写手机号码',
    params: [],
    do: function phone(type, awardId, awardRecordId) {
        type = type || Enum.AWARD_TYPE.TELCHARGE;
        let  _PhoneForm = Vue.extend(PhoneForm);
        DialogBuilder.of(this).confirm('', util.createComponentProxy(_PhoneForm, {type}), function() {
            let isValidPhone = phoneValidator(this.$store.state.chargePhoneNumber);
            if(!isValidPhone) {
                let instance = this.$find(PhoneForm.name);
                if(instance) {
                    instance.isSetErr = true;
                };
                return;
            };
            let self = this;
            if(type == Enum.AWARD_TYPE.TELCHARGE) {
                this.$store.dispatch('postCharge', { context: this, params: { awardId: awardId, awardType: type, awardRecordId: awardRecordId || 0}}).then(function(value) {
                    if(value) {
                        let val = String(value[0].awardName).match(/\d+/)[0];
                        util.setStorage('telPhone_' + awardRecordId, Date.now());
                        DialogBuilder.of(this).alert(`成功领取${val}元话费`, '请稍后查询短信提示');
                        self.dismiss();
                    };
                }).catch((res)=> {
                    const ERR_MAP = {
                        113000: '系统繁忙，请联系客服',
                        113002: '活动过期或不存在',
                        120023: '系统繁忙，请稍后再试',
                        120024: '系统繁忙，请联系客服',
                        120026: '话费已有手机号领取',
                        120027: '话费已经领取，等待发放中',
                        120028: '话费已成功领取',
                        120029: '系统繁忙，请联系客服',
                        120031: '话费已成功领取',
                        120030: '系统繁忙，请联系客服',
                        120032: '此号码已领取，请更换号码',
                        120044: '话费发送失败，请联系客服'                    
                    };
                    let $PhoneForm = this.$find('PhoneForm');
                    if($PhoneForm) {
                        if(res instanceof Error) {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        } else if(res.code) { //oauth request
                            $PhoneForm.setErrMsg(ERR_MAP[res.code] || '出错了！请重试。');
                        } else {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        }
                    }
                });
            } else if(type == Enum.AWARD_TYPE.RATEOFFLOW) {
                this.$store.dispatch('postTraffic', {context: this}).then(function(value) {
                    if(value) {
                        let val = value[0].awardName.match(/\d+/);
                        util.setStorage('ratePhone_' + value[0].awardId, Date.now());
                        DialogBuilder.of(this).alert(`成功领取${val}M流量`, '请稍后查询短信提示');
                        self.dismiss();
                    }
                }).catch((res)=> {
                    const ERR_MAP = {
                        120023: "系统繁忙，请联系客服",
                        120024: "系统繁忙，请联系客服",
                        120025: "系统繁忙，请联系客服",
                        120026: "流量包已有手机号领取",
                        120027: "流量包已成功领取",
                        120028: "流量包已成功领取",
                        120029: "手机号码有误，请重新输入",
                        120030: "系统繁忙，请联系客服",
                        120031: "流量包已成功领取",
                        120032: "此号码已领取，请更换号码"
                    };
                    let $PhoneForm = this.$find('PhoneForm');
                    if($PhoneForm) {
                        if(res instanceof Error) {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        } else if(res.code) { //oauth request
                            $PhoneForm.setErrMsg(ERR_MAP[res.code] || '出错了！请重试。');
                        } else {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        }
                    }
                });
            } else if (type == Enum.AWARD_TYPE.VIRTUAL) {
                this.$store.dispatch('postCharge', { context: this, params: { awardId: awardId, awardType :type, awardRecordId: awardRecordId || 0 } }).then(function (value) {
                    if (value) {
                        //let val = String(value[0].awardName).match(/\d+/)[0];
                        let val = String(value[0].awardName);
                        util.setStorage('virtualPhone_' + value[0].awardId, Date.now());
                        DialogBuilder.of(this).alert(`成功领取${val}`, '请稍后在我的奖品或短信查看');
                        self.dismiss();
                    };
                }).catch((res) => {
                    const ERR_MAP = {
                        113000: '系统繁忙，请联系客服',
                        113002: '活动过期或不存在',
                        120023: '系统繁忙，请联系客服',
                        120024: '系统繁忙，请联系客服',
                        120026: '奖品已有手机号领取',
                        120027: '奖品已经领取，等待发放中',
                        120028: '奖品已成功领取',
                        120029: '系统繁忙，请联系客服',
                        120031: '奖品已成功领取',
                        120030: '系统繁忙，请联系客服',
                        120032: '此号码已领取，请更换号码',
                        120044: '奖品发送失败，请联系客服'
                    };
                    let $PhoneForm = this.$find('PhoneForm');
                    if ($PhoneForm) {
                        if (res instanceof Error) {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        } else if (res.code) { //oauth request
                            $PhoneForm.setErrMsg(ERR_MAP[res.code] || '出错了！请重试。');
                        } else {
                            $PhoneForm.setErrMsg('出错了！请重试。');
                        }
                    }
                });
            }
        }, {
            cancelBtnTxt: '稍后填写',
            confirmBtnTxt: '立即领取'
        });
    }
});

defineMotion(Enum.MOTION.SUBSCRIBE_APP, {
    name: '预约app',
    params: [{
        type: String,
        // $rule: {
        //     name: '应用id'
        // }
    }, {
        type: String,
        // $rule: {
        //     name: '包名'
        // }
    }],
    do: function subscribeApp(id, pkg) {
           // this.$store.dispatch() 逻辑写到组件内
    }
});

defineMotion(Enum.MOTION.SEND_ISSUES, {
    name: '填写问题',
    params: [],
    do: function issues() {
        this.$parent.hasOwnProperty('dismiss') && this.$parent.dismiss(); //toso history.back()?
        logger.makeActivityLog('activity_sendissues_clicks');

        let _Issues = Vue.extend(Issues);
        BottomSheetBuilder.of(this).show('问题反馈', util.createComponentProxy(_Issues));
    }
});
