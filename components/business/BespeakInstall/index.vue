<style lang="less">
    .bespeak {
        min-height: 100%;
        padding-bottom: 1.481481rem;
    }
    header {
        height: 4.26555rem;
        padding: 0.37037rem 0.444444rem 0;
        margin-bottom: 0.611111rem;
        /*      position: relative; */
        img {
            display: block;
        /*        position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 1rem; */
            height: 3.89815rem;
            width: 9.111111rem;
        }
        span {
            font-size: 0.444444rem;
            color: #fff;
            display: inline-block;
            margin-left: 0.1rem;
        }
        i {
            display: inline-block;
            width: 0.32rem;
            height: 0.35rem;
            border-width: 0 0 0.092593rem 0.092593rem;
            border-style: solid;
            transform:rotateZ(45deg);
            vertical-align: text-top;  
        }
    }
    .bespeak__fixed {
        position: fixed;
        bottom: 0;
        // text-align: center;
        // height: 1.481481rem;
        // height:1.333333rem;  // 144px
        height:1.055556rem;  // 114px
        // border-top: 1px solid #eee;
        width: 100%;
        background-color: #fff;
        max-width: 10rem;
        padding:.138889rem 0;  // 15px
        box-sizing:content-box;
        .divider {
            width:100%;
            height:1px;
            background:#eee;
            top: 0;
			bottom: auto;
        }
        a {
            color: #fff;
            line-height: 1;
            display: block;
            text-align: center;
            font-size: 0.444444rem;   // 48px
            height: 1.055556rem; // 114px
            line-height: 1.118519rem;  // 120.8px
            width: 6.666667rem;
            border-radius: 1rem;
            // margin-top: 0.18rem;
            margin:0 auto;   // 15px
            // position:absolute;
            // left:50%;
            // top:50%;
            // transform:translate(-50%,-50%);
            padding:0;
            border:0;
        }
    }
    .bespeak__gameinfo {
        padding: 0 0.4444rem;
        position: relative;
        img {
            display: inline-block;
            vertical-align: top;
            height: 1.77778rem;
            width: 1.77778rem;
        }
        .right {
            margin-left: 0.37037rem;
            display: inline-block;
            vertical-align: top;
            & p:first-child {
                color: #000;
                font-size: 0.444444rem;
                font-weight: 500;
                margin-bottom: 0.16rem;
            }
            & p:last-child {
                color: #9d9d9d;
                font-size: 0.333333rem;
                margin-top: 0.16rem;
            }
            /*       & .bespeak__nums {
                margin-top: 0.8rem !important;
            } */
        }
        .star {
            line-height: 1;
            position: relative;
            div {
                display: inline-block;
            }
        }
        .star i {
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAdVBMVEUAAAD/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh3/lh2Elsw8AAAAJnRSTlMA9+cWCPDQrIldPS4pIgX008C7U0fIoZx4bWZODevc28Szl48eDz87XNQAAADQSURBVCjPfZLXFoIwEERT6EWKgDS7zv9/ogKrJwmE+5bch8zOhuk0LdtBcnHY0R1w3NE5UNpthC+pVZ8mHdjsmE36bAvXYya06HrRxbaNQSR6HIKDyPDDZyEsUIyB2yQf5jLcbetGlElsWREzIr2s7VUpV3qm9SRTeBe6LUam4ZSqvTnMIFC1z0w8bSZzaxIakW7NbgNDN9QjNZgbWiy3ibwv/rWx68c0TzevqNd0O8WlL554q9FKoE7/FT2BzFE74wjUUSuBSjkmojJq8JeXPi7sM/u+wWaRAAAAAElFTkSuQmCC') no-repeat;
            background-size: contain;
            width: 0.277778rem;
            height: 0.277778rem;
            display: inline-block;
            margin-right: 0.05rem;
            &.diabled {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeBAMAAADJHrORAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACnRSTlMAJh8JBRsSAg4WZnZhkAAAAKpJREFUGNNVkD0OgkAQhVfAn3ZQiHYSTWz1BsTG1r2B3ICY2O8RsPG8LjtvCO81mw+y38xbh/wcZV0yryQQZ/IkvsmO+CsH0okI64SEWeQj6cSEXuapXEdcuw1x0LuWbRTkM76OxvuE5zShaIBlqyPf4Itt7/V3P7XDLhYIDAubZm3BA3gJtsaL6H54bYz2w9irBneyT2tXNq5q9XOPx32lM2+Cnien+UT+AxqEGQ0JnQ2TAAAAAElFTkSuQmCC');
            }
        }
        .star em {
            font-style: normal;
            color: #ff961d;
        }
    }
    .bespeak__txtinfo {
        margin-top: 0.740741rem;
        padding: 0 0.4444rem;
    }
    .ql-editor {
        text-align: left;
        padding: 0 !important;
        height: inherit !important;
        overflow-y: inherit !important;
    }
    #bespeak__nums {
        position: absolute;
        bottom: 0;
    }
</style>

<template>
    <div class="bespeak">
        <header v-bind:style="{'background':'linear-gradient(to bottom,'+colored+',#fff)','background-color':colored}">
            <img :src="banner" />
        </header>
        <div class="bespeak__gameinfo" v-show="isshowicon">
            <img :src="icon" />
            <div class="right">
                <p>{{ title }}</p>
                <template v-if="isInstall">
                    <div class="star">
                        <star-list :starnum="starValue"></star-list>
                        <em>{{ star }}</em>
                    </div>
                    <p>{{ size }}</p>
                </template>
                <template v-else>
                    <p class="bespeak__nums">{{ subscribeNums }}人已预约</p>
                </template>
            </div>
        </div>
        <div class="bespeak__txtinfo">
            <div class="ql-editor" v-html="$toRitchText(ritchText)"></div>
        </div>
        <div class="bespeak__fixed">
            <div class="divider"></div>
            <a ref="btntxt" v-bind:style="{'background-color':colored,'color':txtcolor}" @click="handleClick">{{ btnTxt }}</a>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Enum from '../../common/enum'
    import NativeInterface from '../../common/nativeinterface'
    import util from '../../common/util'
    import util2 from '../../common/util2'
    import Totast from '../../base/TotastBuilder'
    import logger from '../../common/logger'
    Vue.component('star-list',{
        functional: true,
        render: (h,ctx) => {
            let starValue = ctx.props.starnum
            var star = 0
            if(starValue==0){
                star = 0
            }else if(starValue>0&&starValue<=10) {
                star = 1
            }else if(starValue>10&&starValue<=20) {
                star = 2
            }else if(starValue>20&&starValue<=30) {
                star = 3
            }else if(starValue>30&&starValue<50) {
                star = 4
            }else {
                star = 5
            }
            //let star = 5-(50/starValue).toFixed(0)
            //star = (star < 0 && star != -Infinity) ? 0 : star
            return h('div',[0,0,0,0,0].map((child,index) => {
                if(index>star-1) {
                    return h('i',{'class':{diabled:true}})
                }else {
                    return h('i')
                }
            }))
        },
        props: {
            starnum: {
            }
        }
    })
    //异常处理
    function toType(arr) {
        let defaultObject = {
            'name': '',
            'size': 0,
            'appId': '',
            'packageName': '',
            'icon': ''
        } 
        if(typeof arr != 'undefined') {
            if(Object.prototype.toString.call(arr) == '[object Array]') {
                return arr[0] || defaultObject
            } else {
                return arr || defaultObject
            }
        } else {
            return defaultObject
        }
    }
    export default {
        $flag: Enum.FLAG.DISABLE_RESIZE,
        data() {
            return {
                isInstall: true,
                isBespeak: false,//是否预约
                isUpdate: false, 
                app: {},
                btnTxt: '安装',
                title: typeof window.__ACTIVITY_CONFIG__ == 'undefined' ? '' : toType(window.__ACTIVITY_CONFIG__.__APPS__).name,
                star: 0,
                size: typeof window.__ACTIVITY_CONFIG__ == 'undefined' ? 0 : (toType(window.__ACTIVITY_CONFIG__.__APPS__).size/1024/1024).toFixed(1)+'M',
                info:{},
                subscribeNums: 0,
                stared: 0
            }
        },
        props: {
            isshowicon: {
                type: Boolean,
                default: true,
                $rule: {
                    name: '是否展示icon区域'
                }
            },
            txtcolor: {
                type: String,
                default: '#ffffff',
                $rule: {
                    name: '文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }     
            },
            colored: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '背景色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            ritchText: {
                type: Object,
                $rule: {
                    name: '富文本',
                    clazz: Enum.CLAZZ.RITCH_TEXT
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
        computed: {
            starValue() {
                return this.stared
            },
            icon() {
                return this.info.icon
            },
            banner() {
                return this.info.publicityImg
            }
        },
        created() {
            if((this.motion.type == Enum.MOTION.INSTALL_APP||this.motion.type == Enum.MOTION.SUBSCRIBE_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) && !this.motion.params[0]) {
                if(typeof window.__ACTIVITY_CONFIG__ != 'undefined') {
                    this.app = toType(window.__ACTIVITY_CONFIG__.__APPS__)
                }else {
                    this.app = {}
                }
                this.motion.params[0] = this.app.appId;
                this.motion.params[1] = this.app.packageName;
            } else if(this.motion.type == Enum.MOTION.INSTALL_APP||this.motion.type == Enum.MOTION.SUBSCRIBE_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                this.app = {
                    appId: this.motion.params[0],
                    packageName: this.motion.params[1]
                }
            }
        },
        mounted() {
            if(this.motion.type == Enum.MOTION.INSTALL_APP || this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                this.app._status = Enum.APP_STATUS.UNINSTALL;
                this.initialTxt = this.btnTxt;
                if(this.app.packageName) {
                    NativeInterface.onAppShowInPage([this.app.packageName]); //告诉客户端页面有哪些游戏，需要把对应的安装进度同步到页面上
                    this.app._status = util.getAppStatus(this.app, NativeInterface); //获取初始状态
                    this.btnTxt = this.getBtnTxt(this.app._status) || this.btnTxt;
                }
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_PROGRESS, (pkg, btnText, textColor, bgColor, clickEnable, isInstalled)=> {
                    if(this.app.packageName == pkg) {
                        if(btnText == '安装') {
                            this.btnTxt = this.initialTxt;
                        } else {
                            this.btnTxt = btnText;
                        }
                    }
                });
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_INSTALLED, (pkg,btnText) => {
                    if(this.app.packageName == pkg) {
                        let oldStatus = this.app._status; 
                        this.app._status = util.getAppStatus(this.app, NativeInterface); //获取初始状态
                        if(btnText == '更新') {
                           this.btnText = btnText
                        } else {
                           this.btnTxt = this.getBtnTxt(this.app._status) || this.btnTxt;
                        }
                        if(oldStatus != Enum.APP_STATUS.INSTALLED && oldStatus != Enum.APP_STATUS.GOT) {
                            logger.makeActivityLog('activity_install_complete', {app_id: this.app.appId});
                        }
                    }
                });
            }
            if(this.motion.type == Enum.MOTION.SUBSCRIBE_APP) {
                this.isInstall = false 
                this.btnTxt = '预约'
                if(NativeInterface.getUserId()) {
                    //预约app
                    this.$store.dispatch('fetchSubscribeApp',{context:this, params:{'game_id':this.app.appId}}).then((response)=> {
                        if(response == true) {
                            this.btnTxt = '预约成功'
                            //7.1.1预约成功通知客户端
                            //let self = this;
                            // if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 7001001) {
                            //     NativeInterface.subscribeSuccess(parseInt(this.app.appId), this.app.packageName, parseInt(this.subscribeNums));
                            //     this.subscribeNums = this.subscribeNums + 1;
                            // };
                            this.isBespeak = true 
                        }
                    }).catch(() => {
                      Totast.of(this).show('出错了，请重试～<2001>')
                    })
                }
            }
            //获取app预约人数 app星级
            this.$store.dispatch('fetchAppInfos',{context:this,params:{'game_id':this.app.appId,'status':this.app.appStatus || 50}}).then((response)=> {
                this.subscribeNums = response.subscribe_count
                this.star =  (response.star/5).toFixed(1)
                this.stared = response.star
                if(NativeInterface.getVersionCode(this.app.appId,this.app.packageName) < response.version_code && this.app._status == Enum.APP_STATUS.INSTALLED && this.motion.type != Enum.MOTION.SUBSCRIBE_APP ) {
                    this.btnText = '更新'
                    this.isUpdate = true 
                }
            }).catch(() => {
                Totast.of(this).show('出错了，请重试～<2002>')
            })
            this.$nextTick(() =>{
                //修改属性 vue检测属性变化，更新dom
                if(typeof window.__ACTIVITY_CONFIG__ != 'undefined' && typeof window.__ACTIVITY_CONFIG__.__INFO__ != 'undefined') {
                    let targ = toType(window.__ACTIVITY_CONFIG__.__APPS__)
                    // if(Object.prototype.toString.call(targ) == '[object Array]') {
                    //   targ = window.__ACTIVITY_CONFIG__.__APPS__[0]
                    // }
                    this.info = {
                        'icon': targ.icon,
                        'publicityImg': window.__ACTIVITY_CONFIG__.__INFO__.publicityImg
                    }
                } else {
                    this.info = {
                        'icon': '',
                        'publicityImg': ''
                    }
                }
            })
        },
        methods: {
            installApp() {
              NativeInterface.onInstallButtonClick(Number(this.app.appId), this.app.packageName);
            },
            openApp() {
              NativeInterface.launchApp(this.app.packageName);
            },
            getBtnTxt(status) {
                let txt = '';
                switch(status) {
                    case Enum.APP_STATUS.INSTALLED:
                        txt = '打开';
                        break;
                    case Enum.APP_STATUS.UPDATE:
                        txt = '更新';
                        break;
                    case Enum.APP_STATUS.GOT:
                        if(this.motion.type == Enum.MOTION.INSTALL_LOGIN_APP) {
                            txt = '打开';
                        }else {
                            txt = '抽奖已+1';
                        }
                        break;
                }
                return txt;
            },
            handleClick() {
                if(this.motion.type == Enum.MOTION.INSTALL_APP) {
                    if(!NativeInterface.isAppInstalled(this.app.packageName)) {
                      this.$doMotion(this.motion);
                      //logger.makeActivityLog('activity_click_install', {app_id: this.app.appId || ''})
                    } else {//已经安装
                        if(this.app._status == Enum.APP_STATUS.GOT) { //已经获取抽奖机会
                            return;
                        } else {
                            //更新app
                            if(this.isUpdate && this.$refs.btntxt.text == '更新') {
                                NativeInterface.updateApp(this.app.appId,this.app.packageName)
                                logger.makeActivityLog('activity_update_app', {app_id: this.app.appId || ''})
                                return
                            }
                            if(NativeInterface.launchApp(this.app.packageName)) {
                                logger.makeActivityLog('activity_open_app', {app_id: this.app.appId || ''})
                            } else {
                                DialogBuilder.of(this).alert('打开失败', '');
                            }
                        }
                    }
                } else if (this.motion.type == Enum.MOTION.SUBSCRIBE_APP) {
                    if(!NativeInterface.getUserId()){
                        NativeInterface.login()
                        return
                    }

                    if(this.isBespeak) return

                    this.$store.dispatch('postSubscribeApp',{context:this,params:{game_id:this.app.appId,imei:util2.getUrlParam('imei'),sn:util2.getUrlParam('sn')}}).then((response)=>{
                        if(response == this.app.appId) {
                            Totast.of(this).show('预约成功')
                            this.btnTxt = '预约成功'
                            this.isBespeak = true
                            //7.1.1预约成功通知客户端
                            //let self = this;
                            if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 7001001) {
                                NativeInterface.subscribeSuccess(parseInt(this.app.appId), this.app.packageName, parseInt(this.subscribeNums));
                                this.subscribeNums = this.subscribeNums + 1;
                            };
                            logger.makeActivityLog('activity_subscribe_app', {app_id: this.app.appId || ''}) 
                        } else {
                            Totast.of(this).show('预约失败，请重试～')
                            //logger.makeActivityLog('activity_subscribe_app_fail')
                        }
                    }).catch(()=>{
                           Totast.of(this).show('出错了，请重试～')
                           //logger.makeActivityLog('activity_subscribe_app_fail')
                    })
                }
                else {
                    this.$doMotion(this.motion);
                }
            }
        }
}
</script>