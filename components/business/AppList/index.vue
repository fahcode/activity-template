<style lang="less">
    @import '../../style/mixin';
	.app-list {
        margin: 0.555556rem 0;
        &__row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        &__row + &__row {
            margin-top: 0.944444rem;
        }

        &__app {
            position: relative;
            width: 2.388889rem;
            text-align: center;
        }

        &__app-icon {
            display: block;
            margin: 0 auto;
            width: 1.407407rem;
            height: 1.407407rem;
        }

        &__app-name {
            height: 0.851852rem;
            padding: 0 0.111111rem;
            line-height: 0.888889rem;
            text-align: center;
            font-size: 0.388889rem;
            font-weight: 500;
            .one-line();
        }

        &__app-btn {
            /* position: relative;
            display: block;
            max-width: 96%;
            min-width: 1.62037rem;
            padding: 0 .111111rem;
            min-height: 0.666667rem; */
            display: inline-block;
            width: 1.62037rem;
            height: 0.666667rem;
            line-height: 0.722222rem; 
            vertical-align: middle;
            border-radius: 999px;
            font-weight: 500;
            font-size: 0.388889rem;
            color: #000;
            background: #e5e5e5;
            border: 1px solid #e5e5e5;

            /* left: 50%;
            transform: translate(-50%, 0);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap; */
        }
	}
</style>
<template>
	<div class="app-list" v-bind:style="{color: fontColor}">
        <template v-for="apps in normalizeApps">
            <div class="app-list__row">
                <div v-for="app in apps" :key="app.appId" class="app-list__app" v-bind:style="{'visibility': app.appId ? 'visible': 'hidden'}">
                    <!-- <img class="app-list__app-icon" :src="app.icon" @click="goAppInfo(app)"> -->
                    <LazyImg class="app-list__app-icon" :src="app.icon || ''" @click.native="goAppInfo(app)"></LazyImg>
                    <h4 class="app-list__app-name" @click="goAppInfo(app)">{{ app.name || '' }}</h4>
                    <button class="app-list__app-btn" v-bind:style="{'background-color': getBtnBgColor(app._status),'color': getBtnFontColor(app._status), 'border-color': getBtnBorderColor(app._status)}" @click="handleClick(app)">{{ app._txt || '' }}</button>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import util from 'common/util';
    import NativeInterface from 'common/nativeinterface';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    import DialogBuilder from 'base/DialogBuilder';
    import logger from 'common/logger';
    import LazyImg from 'base/LazyImage.vue'
	export default {
		name: 'AppList',
        mixins: [BusinessCompMixin],
        props: {
            btnTexts: {
                type: String,
                default: '安装,打开,抽奖+1',
                $rule: {
                    name: '不同状态下的按钮文字'
                }
            },
            fontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            unInstallBgColor: {
                type: String,
                default: '#e5e5e5',
                $rule: {
                    name: '(未安装状态)的背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            unInstallFontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '(未安装状态)的文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            gotBgColor: {
                type: String,
                default: '#e5e5e5',
                $rule: {
                    name: '(抽奖+1状态)的背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            gotBorderColor: {
                type: String,
                default: '#e5e5e5',
                $rule: {
                    name: '(抽奖+1状态)的边框颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            gotFontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '(抽奖+1状态)的文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        data() {
            return {
                map: {}
            }
        },
        mounted() {
            NativeInterface.onAppShowInPage(this.packageNames);
            //检查是否有还没上报的task
            let pendingPostTasks = util.getPendingPostTasks();
            let hasLogin = !!NativeInterface.getUserId();

            if(hasLogin) {
                this.normalizeApps.forEach((apps) => {
                    apps.forEach((app) => {
                        if(pendingPostTasks.indexOf(app.taskId) > -1) {
                            if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < 6007001) {
                                return;
                            }
                            this.postTask(app);
                        }
                    });
                });
            }
            
            NativeInterface.on(Enum.INTERFACE_EVENT.APP_PROGRESS, (pkg, btnText, textColor, bgColor, clickEnable, isInstalled)=> {
                let app = this.map[pkg];
                if(app) {
                    if(btnText == '安装') {
                        app._txt = this.getBtnTxt();// 使用自定义的文本
                    } else {
                        app._txt = btnText;
                    }
                    this.$forceUpdate();
                }
            });
            NativeInterface.on(Enum.INTERFACE_EVENT.APP_INSTALLED, (pkg) => {
                let app = this.map[pkg];
                if(app) {
                    let oldStatus = app._status;
                    app._status = util.getAppStatus(app);   //获取初始状态
                    app._txt = this.getBtnTxt(app._status) || app._txt;
                    this.$forceUpdate();
                    if((app.type == 'INSTALL' || app.type == 'INSTALL_G') && app._status != Enum.APP_STATUS.GOT && !util.getStorage('task_' + app.taskId)) {//安装类且仍未获得抽奖机会
                        this.postTask(app);
                    }
                    if(oldStatus != Enum.APP_STATUS.INSTALLED && oldStatus != Enum.APP_STATUS.GOT) {
                        logger.makeActivityLog('activity_install_complete', {app_id: app.appId});
                    }
                }
            });
        },
        computed: {
            normalizeApps() { //每四个一组，不够填空对象
                let normalizeApps = [];
                let apps = [];
                let ii = 0;
                while(true) {
                    apps = util.getApps(4, ii*4);
                    apps.forEach((app, i) => {
                        if(process.env.NODE_ENV == 'production') {
                            app._status = util.getAppStatus(app);
                        } else {
                            app._status = [Enum.APP_STATUS.INSTALLED, Enum.APP_STATUS.GOT, Enum.APP_STATUS.UNINSTALL][i % 3];
                        }
                        app._txt = this.getBtnTxt(app._status);
                        this.map[app.packageName] = app;
                    });
                    if(!apps.length) {
                        break;
                    } else if(apps.length < 4) {
                        Array.prototype.push.apply(apps, [{},{},{},{}].slice(0, 4 - apps.length));
                    }
                    normalizeApps.push(apps);
                    ii++;
                }
                return normalizeApps;
            },
            packageNames() {
                let packageNames = [];
                this.normalizeApps.forEach((apps) => {
                    apps.forEach((app) => {
                        if(app.packageName) {
                            packageNames.push(app.packageName);
                        }
                    });
                });
                return packageNames;
            },
            fatBtnTexts(){
                let fatBtnTxts = this.btnTexts.replace(/，/g, ','),
                    texts = fatBtnTxts.split(','),
                    nbtnTexts = {};

                nbtnTexts[Enum.APP_STATUS.UNINSTALL] = texts[0] || '安装';
                nbtnTexts[Enum.APP_STATUS.INSTALLED] = texts[1] || '打开';
                nbtnTexts[Enum.APP_STATUS.GOT] = texts[2] || '抽奖+1';
                return nbtnTexts;
            }
        },
        methods: {
            getBtnTxt(status) {
                /* let txt = '';
                switch(status) {
                    case Enum.APP_STATUS.INSTALLED:
                        txt = '打开';
                        break;
                    case Enum.APP_STATUS.GOT:
                        txt = '抽奖+1';
                        break;
                    case Enum.APP_STATUS.UNINSTALL:
                        txt = '安装';
                        break;
                } */
                return this.fatBtnTexts[(status? status: Enum.APP_STATUS.UNINSTALL)];
            },
            getBtnBgColor(status) {
                let color = '';
                switch(status) {
                    case Enum.APP_STATUS.INSTALLED:
                        color = 'transparent';
                        break;
                    case Enum.APP_STATUS.GOT:
                        color = this.gotBgColor;
                        break;
                    case Enum.APP_STATUS.UNINSTALL:
                        color = this.unInstallBgColor;
                        break;
                }
                return color;
            },
            getBtnFontColor(status) {
                let color = '';
                switch(status) {
                    case Enum.APP_STATUS.INSTALLED:
                        color = this.unInstallBgColor;
                        break;
                    case Enum.APP_STATUS.GOT:
                        color = this.gotFontColor;
                        break;
                    case Enum.APP_STATUS.UNINSTALL:
                        color = this.unInstallFontColor;
                        break;
                }
                return color;
            },
            getBtnBorderColor(status) {
                let color = '';
                switch(status) {
                    case Enum.APP_STATUS.INSTALLED:
                        color = this.unInstallBgColor;
                        break;
                    case Enum.APP_STATUS.GOT:
                        color = this.gotBorderColor;
                        break;
                    case Enum.APP_STATUS.UNINSTALL:
                        color = this.unInstallBgColor;
                        break;
                }
                return color;
            },
            
            postTask(app) {
                util.addPendingPostTask(app.taskId);
                if(NativeInterface.getUserId()) {
                    if(!this.$checkVersion()) return;
                    //logger.makeActivityLog('activity_dotask_num');
                    this.$store.dispatch('postTask', {context: this, params: {task_ids: app.taskId, content: {status: 2}}}).then((val) => {
                        //logger.makeActivityLog('activity_dotask_success');
                        util.setStorage('task_' + app.taskId, 2);
                        app._status = Enum.APP_STATUS.GOT;
                        app._txt = this.getBtnTxt(Enum.APP_STATUS.GOT);
                        NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                        util.tryRemovePendingPostTask(app.taskId);
                        this.$forceUpdate();
                    }).catch((err)=> {
                        //logger.makeActivityLog('activity_dotask_failed');
                    });
                } else {
                    DialogBuilder.of(this).confirm('登录后才可以获取抽奖机会哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录'});
                }   
            },
            goAppInfo(app) {
                this.$doMotion({type: Enum.MOTION.GO_APP_INFO, params: [app.appId, app.packageName]});
            },
            handleClick(app) {
                if(!NativeInterface.getUserId()) {
                    DialogBuilder.of(this).confirm('需登录后才能抽奖哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录'});
                    return;
                }
                if(!NativeInterface.isAppInstalled(app.packageName)) {
                    this.$doMotion({type: Enum.MOTION.INSTALL_APP, params: [app.appId, app.packageName]});
                } else {//已经安装
                    if(app._status == Enum.APP_STATUS.GOT) { //已经获取抽奖机会
                        return;
                    } else {
                        if(!this.$checkVersion()) return;
                        if(NativeInterface.launchApp(app.packageName)) {
                            if(app.type == 'OPEN' && app._status != Enum.APP_STATUS.GOT) { //打开类型 且 未获取抽奖机会
                                util.setStorage('open_' + app.appId, Date.now());
                                this.postTask(app);
                            }
                        } else {
                            DialogBuilder.of(this).alert('打开失败', '');
                        }
                    }
                }
            }
        },
        components: {
            LazyImg
        }
	}
</script>