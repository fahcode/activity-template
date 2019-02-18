<script>
    import XButton from '../XButton/index.vue';
    import NativeInterface from 'common/nativeinterface';
    import Enum from 'common/enum';
    import util from 'common/util';
    import DialogBuilder from 'base/DialogBuilder';
    import logger from 'common/logger';
    import LotteryTipsMixin from 'base/LotteryTipsMixin';
    export default {
        name: 'DownloadButton',
        extends: XButton,
        data() {
            return {
                app: {},
                loginStatus:false,
            }
        },
        mixins: [LotteryTipsMixin],
        props: {
            installBtnTexts: {
                type: String,
                default: '打开,抽奖已+1',
                $rule: {
                    name: '安装后不同状态下的按钮文字'
                }
            },
             motion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.INSTALL_APP, params: []}
                },
                $rule: {
                    name: '点击响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            }
        },
        computed:{
            appTaskAwardId(){
                if(typeof window != 'undefined' && window.__ACTIVITY_CONFIG__) {
                    let tasks = window.__ACTIVITY_CONFIG__.__TASKS__ || [],
                        i = 0
                    for(i = 0; i < tasks.length; i++){
                        if(tasks[i].id == this.app.taskId){
                            return tasks[i].content.awardId
                        }
                    }
                }
            },
            fatBtnTexts(){
                let fatBtnTxts = this.installBtnTexts.replace(/，/g, ','),
                    texts = fatBtnTxts.split(','),
                    nbtnTexts = {};

                nbtnTexts[Enum.APP_STATUS.UNINSTALL] = '安装';
                nbtnTexts[Enum.APP_STATUS.INSTALLED] = texts[0] || '打开';
                nbtnTexts[Enum.APP_STATUS.GOT] = texts[1] || '抽奖已+1';
                return nbtnTexts;
            }
        },
        watch: {
            '$store.state.zippoTimes': {
                handler: function(newVal) {
                    if(this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP && !this.loginStatus){
                        let id = this.app.taskId,
                            awardId = this.appTaskAwardId,
                            self = this;          
                        newVal.forEach(function(zippoTime) {
                            if(awardId == zippoTime.award_id && zippoTime.times) {
                                util.setStorage('login_' + self.app.appId, Date.now());
                                self.loginStatus = true
                                return
                            }
                        });
                    }
                },
                immediate: true
            }
        },
        created() {
            if(!this.motion.params.length || !this.motion.params[0] || !this.motion.params[1]){
                if(this.motion.type == Enum.MOTION.INSTALL_APP){
                    this.app = util.getApps(1)[0] || {};
                    this.motion.params[0] = this.app.appId;
                    this.motion.params[1] = this.app.packageName;
                }else if(this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP){
                    this.app = util.getLoginApps(1)[0] || {}
                    this.motion.params[0] = this.app.appId;
                    this.motion.params[1] = this.app.packageName;
                }
            }else{
                if(this.motion.type == Enum.MOTION.INSTALL_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                    this.app = {
                        appId: this.motion.params[0],
                        packageName: this.motion.params[1],
                        type: 'OPEN' //默认OPEN
                    }
                }
            }
        },
        mounted() {
            if(this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP && util.getStorage('login_' + this.app.appId)){
                this.loginStatus = true
            }
            if(this.motion.type == Enum.MOTION.INSTALL_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                this.app._status = Enum.APP_STATUS.UNINSTALL;
                this.initialTxt = this.txt;
                if(this.app.packageName) {
                    NativeInterface.onAppShowInPage([this.app.packageName]); //告诉客户端页面有哪些游戏，需要把对应的安装进度同步到页面上
                    this.app._status = util.getAppStatus(this.app); //获取初始状态
                    this.txt = this.getBtnTxt(this.app._status) || this.txt;
                    //检查是否有还没上报的task
                    if(NativeInterface.getUserId()) {
                        let pendingPostTasks = util.getPendingPostTasks();
                        if(pendingPostTasks.indexOf(this.app.taskId) > -1) {
                            if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < 6007001) {
                                return;
                            }
                            this.postTask(this.app.taskId);
                        }
                    }
                }
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_PROGRESS, (pkg, btnText, textColor, bgColor, clickEnable, isInstalled)=> {
                    if(this.app.packageName == pkg) {
                        if(btnText == '安装') {
                            this.txt = this.initialTxt;
                        } else {
                            this.txt = btnText;
                        }
                    }
                });
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_INSTALLED, (pkg) => {
                    if(this.app.packageName == pkg) {
                        let oldStatus = this.app._status;
                        this.app._status = util.getAppStatus(this.app); //获取初始状态
                        this.txt = this.getBtnTxt(this.app._status) || this.txt;
                        if((this.app.type == 'INSTALL' || this.app.type == 'INSTALL_G') && this.app._status != Enum.APP_STATUS.GOT && !util.getStorage('task_' + this.app.taskId)) { //安装类且仍未获得抽奖机会
                            this.postTask(this.app.taskId);
                        }
                        if(this.app.type == 'INSTALL_LOGIN'){
                            this.postTask(this.app.taskId);
                        }
                        if(oldStatus != Enum.APP_STATUS.INSTALLED && oldStatus != Enum.APP_STATUS.GOT) {
                            logger.makeActivityLog('activity_install_complete', {app_id: this.app.appId});
                        }
                        
                    }
                });
            }
        },
        methods: {
            getBtnTxt(status) {
                let txt = '';
                if(this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP){
                    switch(status) {
                        case Enum.APP_STATUS.INSTALLED:
                            txt = this.fatBtnTexts[status];
                            break;
                        case Enum.APP_STATUS.GOT:
                            if(this.loginStatus){
                                txt = this.fatBtnTexts[status];
                            }else {
                                txt = this.fatBtnTexts[Enum.APP_STATUS.INSTALLED];
                            }
                            break;
                    }
                }else {
                    switch(status) {
                        case Enum.APP_STATUS.INSTALLED:
                            txt = this.fatBtnTexts[status];
                            break;
                        case Enum.APP_STATUS.GOT:
                            txt = this.fatBtnTexts[status];
                            break;
                    }
                }
                return txt;
            },
            postTask(taskId) {
                util.addPendingPostTask(taskId);
                if(NativeInterface.getUserId()) {
                    if(!this.$checkVersion()) return;
                    //logger.makeActivityLog('activity_dotask_num');
                    this.$store.dispatch('postTask', {context: this, params: {task_ids: taskId, content: {status: 2}}}).then((val) => {
                        //logger.makeActivityLog('activity_dotask_success');
                        util.setStorage('task_' + taskId, 2);
                        this.app._status = Enum.APP_STATUS.GOT;
                        this.txt = this.getBtnTxt(Enum.APP_STATUS.GOT);
                        NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                        util.tryRemovePendingPostTask(taskId);
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
            handleClick() {
                if(this.motion.type == Enum.MOTION.INSTALL_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                    if(!NativeInterface.getUserId()) {
                        DialogBuilder.of(this).confirm('需登录后才能抽奖哦~', function() {
                            this.dismiss();
                            NativeInterface.login();
                        }, {confirmBtnTxt: '登录'});
                        return;
                    }
                    if(!NativeInterface.isAppInstalled(this.app.packageName)) {
                        this.$doMotion(this.motion);
                    } else {//已经安装
                        if(this.app._status == Enum.APP_STATUS.GOT && this.motion.type != Enum.MOTION.INSTALL_LOGIN_APP) { //已经获取抽奖机会
                            return;
                        } else if(this.loginStatus && this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP){
                            return;
                        } else {
                            if(!this.$checkVersion()) return;
                            if(NativeInterface.launchApp(this.app.packageName)) {
                                if(this.app.type == 'OPEN' && this.app._status != Enum.APP_STATUS.GOT) { //打开类型 且 未获取抽奖机会
                                    util.setStorage('open_' + this.app.appId, Date.now());
                                    this.postTask(this.app.taskId);
                                }else if(this.app.type == 'INSTALL_LOGIN'){
                                    util.setStorage('open_' + this.app.appId, Date.now());
                                    this.postTask(this.app.taskId);
                                }
                            } else {
                                DialogBuilder.of(this).alert('打开失败', '');
                            }
                        }
                    }
                } else {
                    this.$doMotion(this.motion);
                }
            }
        }
    }
</script>