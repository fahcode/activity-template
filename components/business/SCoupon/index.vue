<style lang="less">
    .scoupon {
        width:100%;
        padding:.314815rem 0 0 0;  // 34px 0
        .clearfix{
            zoom:1;
        }
        .clearfix:after {
            content:"020";
            display:block;
            height:0;
            clear:both;
            visibility:hidden;
        }
        &__inner {
            
        }
        &__list {
            width:9.092593rem;  // 982px
            margin:0 auto;
            box-sizing:content-box;
        }
        &__one {
            width:9.092593rem;  // 982px
            height:2.777778rem;  // 300px
            margin:0 0 .314815rem 0 ; // 0 0 34px 0
            padding:.37037rem 0 0 .37037rem; // 40px 0 0 40px
            background-repeat:no-repeat;
            background-position:center center;
            background-size:100% 100%;
            background-color:transparent;
        }
        .one__appicon {
            width:2.037037rem;  // 220px
            height:2.037037rem;  // 220px
            border-radius:.555556rem;  // 60px
            overflow:hidden;
            float:left;
        }
        .one__info {
            width:3.935185rem;  // 425px
            height:1.759259rem;  // 190px
            float:left;
            padding:0 0 0 .37037rem;  // 40px
            box-sizing:content-box;
        }
        .one__gamename {
            width:100%;
            line-height:.518519rem;  // 56px
            color:#fff;
            font-size:.333333rem;  // 36px
            text-align:left;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
        }
        .one__title {
            width:100%;
            line-height:.435185rem;   // 47px
            font-size:.305556rem;  // 33px
            text-align:left;
            color:#b072fe;
            white-space:nowrap;
            overflow:hidden;
            text-overflow: ellipsis;
        }
        .one__money {
            width:100%;
            height:1.277778rem;  // 138px
            line-height:1.277778rem;  // 138px
            text-align:left;
            color:#f4dc3e;
            font-size:.314815rem;  // 34px
            vertical-align:baseline;
            font-family:'Flyme';
            .cn {
                margin:0 0 0 -.055556rem;  // -6
            }
            .cn-after {
                margin:0 0 0 .055556rem;  // 6
            }
            .num {
                font-size:.888889rem;  // 96px
                font-weight: bold;
                font-family:"SFDIN-Bold";
            }
        }
        .one__operate {
            height:1.62963rem;  // 176px
            padding:0 0 0 .277778rem; // 0 0 0 30px
            float:left;
        }
        .one__circle {
            width:1.592593rem;  // 172px
            height:1.592593rem;  // 172px
            padding:0 0 0 .111111rem; // 0 0 0 12px
            position:relative;
            box-sizing:content-box;
        }
        .one__canvas {
            width:100%;
            height:100%;
        }
        .one__percentage,
        .one__desc {
            width:1.592593rem;  // 172px
            line-height:.398148rem;  // 43px
            color:#fff;
            text-align:center;
            font-size:.304167rem;  // 32.85px
            position:absolute;
            left:.111111rem;  // 12px
            top:.425926rem;  // 46px
        }
        .one__percentage {
            top:.824074rem;  // 89px
        }
        .one__btn {
            width:1.833333rem;  // 198px
            height:.666667rem;  // 72px
            position:relative;
            .one__img {
                width:1.833333rem;  // 198px
                position:absolute;
                left:0;
                top:0;
            }
            .app__progress {
                width:1.768519rem;  // 191px
                height:.555556rem;  // 60px
                background-size:1.768519rem .555556rem;  // 191px 60px
                background-repeat:no-repeat;
                background-position:-1.768519rem 0; // -191px 0
                position:absolute;
                left:50%;
                // left:.037037rem;  // 4px
                top:.037037rem;  // 4px
                margin:0 0 0 -0.884259rem; // 0 0 0 -95.5px
                border-radius:1.768519rem; // 191px
                opacity:0;
            }
            .btn__text {
                width:1.833333rem;  // 198px
                line-height:.555556rem; // 60px //.592593rem; // 64px
                font-size:.268519rem;  // 29px
                text-align:center;
                color:#fff;
                position:absolute;
                left:0;
                // top:.037037rem;  // 4px
                padding:.037037rem 0 0 0;  // 4px 0 0 0
                transform:translateY(-50%);
                top:50%;
            }
            .force__update {
                position:absolute;
                left:0;
                top:0;
                opacity:0;
            }
        }
        .synch-render {
            display:none;
        }
    }
</style>
<template>
    <div class="scoupon">
        <div class="scoupon__inner">
            <div class="synch-render">{{txt}}</div>
            <template v-if="map.length > 0">
                <ul class="scoupon__list">
                    <li class="scoupon__one clearfix" 
                        v-for ="(one,index) in map"
                        :style="{
                            marginBottom:$toRem(margin),
                            backgroundImage:'url('+bg.url+')'
                        }">
                        <img v-if="normalizeApps && index < normalizeApps.length" 
                            class="one__appicon" 
                            :src="normalizeApps[index].icon || ''" @click="goAppInfo(normalizeApps[index])" />
                        <div class="one__appicon" v-else></div>
                        <div class="one__info">
                            <div v-if="normalizeApps && index < normalizeApps.length"
                                class="one__gamename" :style="{color:detailColor}">{{normalizeApps[index].name}} {{nametxt}}</div>
                            <div v-else class="one__gamename"></div>
                            <div class="one__title" :style="{color:titleColor}">{{one.name}}</div>
                            <div class="one__money"
                                :style="{
                                    color:moneyColor
                                }"><span class="cn" v-if="one.value < 10000">￥</span><span class="num">{{setCouponValue(one.value)}}</span><span class="cn cn-after" v-if="one.value >= 10000">折</span></div>
                        </div>
                        <div class="one__operate">
                            <div class="one__circle">
                                <div class="one__desc" :style="{color:percentageColor}">已抢</div>
                                <div class="one__percentage" :style="{color:percentageColor}">{{getPercentage(one)}}%</div>
                                <canvas class="one__canvas" :ref="'canvas__'+one.zippoId+'-'+index" width="172" height="172">{{prepareDrawCircle(one,index)}}</canvas>
                                <!--<svg width="100%" height="100%" viewbox="0 0 172 172" class="one__svg">
                                    <circle cx="86" cy="86" r="68" stroke-width="18" stroke-linecap="round"
                                        :stroke="moneyColor"
                                        fill="none"></circle>
                                </svg>-->
                            </div>
                            <div class="one__btn" @click.stop.prevent="getAppCoupon($event,index)"
                                 :style="{opacity:one.couponStatus != 0 ? 0.4 : 1}">
                                <img class="one__img" :src="normalizeApps[index] ? normalizeApps[index]._btnImg : btn.url" />
                                <div class="app__progress" :ref="'app__progress--'+index"
                                    :style="{backgroundImage:'url('+progressing.url+')'}"></div>
                                <div class="btn__text" :style="{color:btnColor}">{{one.btnTxt}}</div>
                                <div class="force__update">{{now}}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import Enum from 'common/enum';
    import util from 'common/util';
    import NativeInterface from 'common/nativeinterface';
    import logger from 'common/logger';
    import DialogBuilder from 'base/DialogBuilder';
    import GCoupon from '../GCoupon/index.vue'
    import Base64 from 'base/Base64'
    export default {
        name: 'SCoupon',
        extends:GCoupon,
        props: {
            bg: {
                type: Object,
                default: ()=> ({url: require("../../assets/single_coupon_bg.png")}),
                $rule: {
                    name: '优惠劵背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            margin: {
                type: Number,
                default: 34,
                $rule: {
                    name: '优惠劵间距(单位px)'
                }
            },
            detailColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '游戏名称颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            titleColor: {
                type: String,
                default: '#b072fe',
                $rule: {
                    name: '优惠劵标题颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            nametxt: {
				type: String,
				default: '专属优惠劵',
				$rule: {
					name: '游戏名称后的文本'
				}
			},
            moneyColor: {
                type: String,
                default: '#f4dc3e',
                $rule: {
                    name: '金额颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            btn: {
                type: Object,
                default: ()=> ({url: require("../../assets/single_coupon_btn.png")}),
                $rule: {
                    name: '按钮背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            downloading: {
                type: Object,
                default: ()=> ({url: require("../../assets/single-download-bg.png")}),
                $rule: {
                    name: '下载按钮背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            progressing: {
                type: Object,
                default: ()=> ({url: require("../../assets/single-download-progress.png")}),
                $rule: {
                    name: '下载按钮进度图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            circlebgColor: {
                type: String,
                default: '#0b0852',
                $rule: {
                    name: '领取进度背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            circleColor: {
                type: String,
                default: '#f4dc3e',
                $rule: {
                    name: '领取进度颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            percentageColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '已抢百分比文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            unintallTipsTitle: {
				type: String,
				default: '您还没有安装游戏哟',
				$rule: {
					name: '未安装游戏提示标题'
				}
			},
            uninstallTipsContent: {
				type: String,
				default: '请先下载游戏，才可领取使用',
				$rule: {
					name: '未安装游戏提示内容'
				}
			},
            dialogBgColor: {
                type: String,
                default: '#421587',
                $rule: {
                    name: '对话框背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            dialogBtnFontColor: {
                type: String,
                default: '#f40282',
                $rule: {
                    name: '对话框确定按钮背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
        },
        data() {
            return {
                appmap: {},
                normalizeApps:[],
                yapps:[],
                usage:[],
                usageStatus:false,
                mapupdate:Date.now(),
                installed_apps:[],
                couponApps:[],
                initialTxt:'',
                apktxt:{},
                now:0
            }
        },
        computed: {
            appList(){
                let normalizeApps = [];
                let apps = [],
                    self = this,
                    index = 0;
                while(true) {
                    apps = util.getApps(4,index);
                    if(!apps.length) {
                        break;
                    }
                    index += 4
                    apps.forEach((app, i) => {
                        if(process.env.NODE_ENV == 'production') {
                            app._status = util.getAppStatus(app);
                        } else {
                            app._status = [Enum.APP_STATUS.INSTALLED, Enum.APP_STATUS.GOT, Enum.APP_STATUS.UNINSTALL][i % 3];
                        }
                        app.downloadProgress = false
                        app._btnImg = self.btn.url
                        // app._txt = this.getBtnTxt(app._status);
                        self.appmap[app.packageName] = app;
                    });
                    if(apps.length < 4) {
                        Array.prototype.push.apply(apps, [{},{},{},{}].slice(0, 4 - apps.length));
                    }
                    self.yapps.push(...apps)
                    normalizeApps.push(...apps);
                }
                return normalizeApps;
            },
            /*
            normalizeApps() { //每四个一组，不够填空对象
                let normalizeApps = [];
                let apps = [],
                    self = this,
                    index = 0;
                while(true) {
                    apps = util.getApps(4,index);
                    if(!apps.length) {
                        break;
                    }
                    index += 4
                    apps.forEach((app, i) => {
                        if(process.env.NODE_ENV == 'production') {
                            app._status = util.getAppStatus(app);
                        } else {
                            app._status = [Enum.APP_STATUS.INSTALLED, Enum.APP_STATUS.GOT, Enum.APP_STATUS.UNINSTALL][i % 3];
                        }
                        app._btnImg = self.btn.url
                        // app._txt = this.getBtnTxt(app._status);
                        self.appmap[app.packageName] = app;
                    });
                    if(apps.length < 4) {
                        Array.prototype.push.apply(apps, [{},{},{},{}].slice(0, 4 - apps.length));
                    }
                    self.yapps.push(...apps)
                    normalizeApps.push(...apps);
                }
                if(this.coupons && this.coupons.length > 0){
                    return normalizeApps.slice(0,this.coupons.length)
                }
                return normalizeApps;
            },
            */
            packageNames() {
                let packageNames = []
                this.yapps.forEach((app) => {
                    if(app.packageName) {
                        packageNames.push(app.packageName);
                    }
                });
                return packageNames;
            }
        },
        watch:{
            // initialStatus(n,o){
            //     let _self = this
            //     console.log('initialStatus change *******************')
            //     this.$nextTick(function(){
            //         this.map.forEach((one,index) => {
            //             _self.setCanvasCircle(one,index)
            //         })
            //     })
            // },
            circlebgColor(n,o){
                let _self = this
                this.$nextTick(function(){
                    this.map.forEach((one,index) => {
                        _self.setCanvasCircle(one,index)
                    })
                })
            },
            circleColor(n,o){
                let _self = this
                this.$nextTick(function(){
                    // console.log(this.circleColor)
                    this.map.forEach((one,index) => {
                        _self.setCanvasCircle(one,index)
                    })
                })
            }
        },
        mounted(){
            
        },
        methods:{
            init(){
                this.map = this.coupons
                this.normalizeApps = this.appList.slice(0,this.map.length)
                NativeInterface.onAppShowInPage(this.packageNames);
                let hasLogin = !!NativeInterface.getUserId(),
                    installed_apps = [],
                    self = this

                // this.initSingleAppData()
                if(process.env.NODE_ENV == 'production' && NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < 6007001) {
                    if(!this.$store.state.lowerVersion){
                        this.$store.commit('setLowerVersion',true)
                        DialogBuilder.of(this).alert('','当前版本过低，请前往应用商店升级游戏中心最新版本', function() {
                            window.location.href = 'mstore://details?package_name=com.meizu.flyme.gamecenter&source_apkname=com.meizu.flyme.gamecenter';
                            this.dismiss();
                        }, {confirmBtnTxt: '去升级', onOuterClickDismiss: false});
                    }
                    return;
                }
                if(hasLogin) {
                    this.yapps.forEach((app) => {
                        if(NativeInterface.isAppInstalled(app.packageName)) {
                            installed_apps.push(app.taskId)
                        }
                    });
                    this.installed_apps = installed_apps
                    this.postTask()
                }
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_PROGRESS, (pkg, btnText, textColor, bgColor, clickEnable, isInstalled)=> {
                    this.normalizeApps.forEach((app,index) => {
                        if(app.packageName == pkg) {
                            let progress = self.$refs['app__progress--'+index][0]
                            if(btnText == '安装') {
                                self.map[index]['btnTxt'] = self.ungetText;
                                progress.style.opacity = 0
                                self.txt = Date.now()
                            }else if(btnText == '打开'){
                                progress.style.opacity = 0
                                self.map[index]['btnTxt'] = self.ungetText;
                                app._btnImg = self.btn.url
                                self.txt = Date.now()
                            }else {
                                progress.style.opacity = 1
                                app._btnImg = self.downloading.url
                                self.map[index]['btnTxt'] = btnText;
                                self.txt = Date.now()
                                let num = parseFloat(btnText) || 0,
                                    width = 191
                                if(/^[\d]+/g.test(btnText) || btnText == '继续'){
                                    app.downloadProgress = true
                                }
                                if(num){
                                    progress.style.backgroundPosition = self.$toRem(191 * (num / 100 - 1))+' 0'
                                }
                                if(btnText == '正在安装' || btnText == '等待安装'){
                                    progress.style.backgroundPosition = '0 0'
                                }
                            }
                            return
                        }
                    })
                });
                NativeInterface.on(Enum.INTERFACE_EVENT.APP_INSTALLED, (pkg) => {
                    this.normalizeApps.forEach((app,index) => {
                        if(app.packageName == pkg) {
                            let oldStatus = app._status;
                            app._btnImg = self.btn.url
                            app._status = util.getAppStatus(app); //获取初始状态
                            if(app.downloadProgress){
                                if(self.apktxt[app.packageName]){
                                    self.map[index]['btnTxt'] = self.apktxt[app.packageName]
                                }else if(self.map[index].chance){
                                    self.map[index]['btnTxt'] = self.ungetText;
                                }else{
                                    // self.map[index]['btnTxt'] = self.gotText;
                                    // self.map[index]['couponStatus'] = 1;
                                }
                            }else{
                                self.map[index]['btnTxt'] = self.ungetText;
                            }
                            self.txt = Date.now()
                            if((app.type == 'INSTALL' || app.type == 'INSTALL_G')) { //安装类且仍未获得抽奖机会  //  && app._status != Enum.APP_STATUS.GOT && !util.getStorage('task_' + app.taskId)
                                if(!NativeInterface.getUserId()) {  // 未登录
                                    // DialogBuilder.of(this).alert('登录后才可以领取哦~', function() {
                                    //     this.dismiss();
                                    //     NativeInterface.login();
                                    // }, {confirmBtnTxt: '登录'});
                                    app.downloadProgress = false
                                    return
                                }
                                if(self.installed_apps.indexOf(app.taskId) == -1){
                                    self.installed_apps.push(app.taskId)
                                    // self.installed_apps = [app.taskId]
                                    if(app.downloadProgress){
                                        self.postTask()
                                    }
                                }
                                // self.postTask()
                            }
                            if(oldStatus != Enum.APP_STATUS.INSTALLED) {//  && oldStatus != Enum.APP_STATUS.GOT
                                 logger.makeActivityLog('activity_install_complete', {app_id: app.appId});
                            }
                            app.downloadProgress = false
                        }
                    })
                    self.initialTxt = ''
                });
            },
            initSingleAppData(){
                this.couponApps = this.normalizeApps
            },
            goAppInfo(app) {
                this.$doMotion({type: Enum.MOTION.GO_APP_INFO, params: [app.appId, app.packageName]});
            },
            postFreeTask:function(){},
            initCouponsTime(){
                let self = this,
                    map = this.map,
                    apps = this.yapps,
                    temp = {},
                    i = 0,
                    j = 0,
                    timesObj = {}
                this.zippo_times.forEach((zippoTime,index) => {
                    let a = 0
                    let already = []
                    self.times_obj[zippoTime.zippo_id] = zippoTime.times
                    timesObj[zippoTime.zippo_id] = zippoTime.times
                    for(a = 0; a < map.length; a++){
                        if(already.indexOf(map[a].zippoId) == -1 && zippoTime.zippo_id == map[a].zippoId) {
                            map[a].times = zippoTime.times;
                            if(zippoTime.times > 0){
                                map[a].chance = zippoTime.times
                                if(map[a].use == map[a].total){
                                    map[a].btnTxt = this.cleanText
                                    map[a].couponStatus = -1
                                }else if(map[a].btnTxt == this.ungetText){
                                    map[a].btnTxt = this.ungetText
                                    map[a].couponStatus = 0
                                }else{
                                    // map[a].btnTxt = this.gotText
                                    // map[a].couponStatus = 1
                                    // map[a].chance = 0
                                }
                            }else if(apps && apps[a] && !NativeInterface.isAppInstalled(apps[a].packageName)){  // 未安装，次数为0
                                // 已抢光   下载游戏
                                if(map[a].use == map[a].total){
                                    if(!(/^[\d]+/g.test(map[a].btnTxt) || map[a].btnTxt == '继续')){
                                        map[a].btnTxt = '下载游戏'
                                    }
                                    apps[a].downloadProgress = true
                                }else if(!(/^[\d]+/g.test(map[a].btnTxt) || map[a].btnTxt == '继续')){
                                    map[a].btnTxt = this.ungetText // '立即安装'//this.ungetText
                                }
                                map[a].couponStatus = 0
                                map[a].chance = 0
                            }else {
                                map[a].chance = 0
                                if(util.getStorage('zippo_' + map[a].zippoId) == '3'){
                                    map[a].btnTxt = this.cleanText
                                    map[a].couponStatus = -1
                                }else {
                                    map[a].btnTxt = this.gotText
                                    map[a].couponStatus = 1
                                }
                            }
                            already.push(map[a].zippoId)
                            break
                        }
                    }
                    this.now = Date.now()
                    this.txt = Date.now()
                    this.$forceUpdate();
                })
                // if(this.zippo_times.length < map.length){
                    for(i = 0; i < map.length; i++){
                        if(!timesObj.hasOwnProperty(map[i].zippoId)){
                            if(map[i].use == map[i].total && apps && apps[i] && !NativeInterface.isAppInstalled(apps[i].packageName)){
                                map[i].btnTxt = '下载游戏'
                                apps[i].downloadProgress = true
                            }
                        }
                    }
                // }
                this.zippo_status = true
                this.initialStatus = true
                // this.postTask()
                // return map
            },
            getCouponFromSpecies(status = false){
                let list = util.findAwardsByType(Enum.AWARD_TYPE.COUPON) || [],
                    zippo_ids = this.zippo_ids,
                    base = new Base64(),
                    type = '',
                    arr = [],
                    ids = [],
                    already = [],
                    i = 0,j = 0
                for(i = 0; i < list.length; i++){
                    type = list[i].couponType || JSON.parse(base.decode(list[i].extValue1)).couponType
                    switch(type){
                        case 'single':
                            list[i].zippoId = zippo_ids && zippo_ids[i] ? zippo_ids[i].id : -1
                            list[i].total = 100
                            list[i].use = 0
                            arr.push(list[i])
                            ids.push(list[i].id)
                            break
                    }
                }
                this.getAwardsUsage(ids,status)
                // already = []
                // for(i = 0; i < arr.length; i++){
                //     for(j = 0; j < this.usage.length; j++){
                //         if(already.indexOf(arr[i].id) == -1 && arr[i].id == this.usage[j].id){
                //             arr[i].total = this.usage[j].total
                //             arr[i].use = this.usage[j].use
                //             already.push(arr[i].id)
                //         }
                //     }
                // }
                return arr
            },
            getAwardsUsage(ids,status = false){
                if(ids.length > 0){// && !this.usageStatus){
                    // this.usageStatus = true
                    this.$store.dispatch('fetchAwardsUse', {context: this, params: {award_ids: ids.join(",")}})
                    .then(val => {
                        // logger.makeActivityLog('activity_couponusage_success');
                        this.usage = val
                        let i = 0,j = 0,
                            already = [],
                            apps = this.yapps
                        for(i = 0; i < this.map.length; i++){
                            for(j = 0; j < this.usage.length; j++){
                                if(already.indexOf(this.map[i].id) == -1 && this.map[i].id == this.usage[j].id){
                                    this.map[i].total = this.usage[j].total
                                    this.map[i].use = this.usage[j].use
                                    if(this.map[i].use == this.map[i].total){
                                        if(apps && apps[i] && !NativeInterface.isAppInstalled(apps[i].packageName)){
                                            this.map[i].btnTxt = this.ungetText
                                            this.map[i].couponStatus = 0
                                        }else{
                                             this.map[i].btnTxt = this.cleanText
                                             this.map[i].couponStatus = -1
                                        }
                                    }
                                    already.push(this.map[i].id)
                                }
                            }
                        }
                        if(status){
                            let self = this
                            this.map.forEach((one,index) => {
                                self.setCanvasCircle(one,index)
                            })       
                        }
                        this.txt = Date.now()
                    })
                    .catch((err) => {
                        // logger.makeActivityLog('activity_couponusage_failed');
                        this.$handleReqErr(err);
                    })
                    // let usage = await this.$store.dispatch('fetchAwardsUse', {context: this, params: {award_ids: ids.join(",")}})
                    // this.usage = usage
                }
            },
            getPercentage(one){
                let p = Math.floor(one.use / one.total * 100)
                 return p
            },
            prepareDrawCircle(one,index){
                let _self = this
                this.$nextTick(function(){
                    this.map.forEach((one,index) => {
                        _self.setCanvasCircle(one,index)
                    })
                })
                return ''
            },
            setCanvasCircle(one,index){
                let canvas = this.$refs['canvas__'+one.zippoId+'-'+index][0],
                    ctx = canvas.getContext && canvas.getContext('2d'),
                    percentage = one.use / one.total,
                    end = percentage * 3 / 2 * Math.PI + -5/4*Math.PI
                ctx.clearRect(0,0,172,172)
                ctx.lineWidth = 18
                ctx.lineCap = 'round'
                // bg
                ctx.strokeStyle = this.circlebgColor
                ctx.beginPath()
                ctx.arc(86,86,77,-5/4*Math.PI,1/4*Math.PI,false)
                ctx.stroke()
                ctx.closePath()
                // 剩余的
                if(one.use){
                    ctx.strokeStyle = this.circleColor
                    ctx.beginPath()
                    // -5/4*Math.PI,1/4*Math.PI  100%
                    ctx.arc(86,86,77,-5/4*Math.PI,end,false)
                    ctx.stroke()
                    ctx.closePath()
                }
                return null
            },
            getAppCoupon(e,index){
                let one = this.map[index],
                    app = this.yapps[index],
                    self = this
                if(process.env.NODE_ENV == 'production'){
                    if(!this.$checkVersion()) {
                        return;
                    }
                }
                if(one.couponStatus == 1) { // 当前无次数
                    one.btnTxt = this.gotText;
                    one.couponStatus = 1;
                    this.txt = Date.now()
                    // logger.makeActivityLog('activity_notimes_num');
                    return;
                }else if(one.couponStatus == -1){   // 已抢光
                    one.btnTxt = this.cleanText;
                    one.couponStatus = -1;
                    this.txt = Date.now()
                    return
                }
                // if(one.couponStatus != 0) {  // 已领取
                //     return;
                // }
                if(process.env.NODE_ENV == 'production' && !NativeInterface.isAppInstalled(app.packageName) && !app.downloadProgress) {
                    DialogBuilder.of(this).confirm(this.unintallTipsTitle, this.uninstallTipsContent, function() {  // this.unintallTipsTitle  // this.uninstallTipsContent
                        this.dismiss();
                        self.initialTxt = one.btnTxt
                        app.downloadProgress = true
                        self.apktxt[app.packageName] = one.btnTxt
                        this.$doMotion({type: Enum.MOTION.INSTALL_APP, params: [app.appId, app.packageName]});
                    }, function() {
                        this.dismiss();
                    }, {
                        confirmBtnTxt: '下载游戏',
                        cancelBtnTxt: '取消',
                        bgColor:this.dialogBgColor,   // 对话框背景颜色
                        fontColor:this.detailColor,  // 对话框字体颜色
                        confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                        confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                    });
                }else if(app.downloadProgress){
                    // 暂停
                    // app.downloadProgress = false
                    this.$doMotion({type: Enum.MOTION.INSTALL_APP, params: [app.appId, app.packageName]});
                }else {
                    this.getCoupon(e,index)
                }
            },
            showLotteryResult(award,index){
                if(award && award.award_type == Enum.AWARD_TYPE.COUPON) {
                    //logger.makeActivityLog('activity_coupon_got');//领取优惠券成功埋点
                    let self = this,
                        app = this.yapps[index],
                        ids = [];

                    this.map[index].btnTxt = this.gotText;
                    this.map[index].couponStatus = 1;
                    this.txt = this.map[index].zippoId+'_'+this.gotText+'_'+Date.now()
                    // 获取领取进度，更新进度
                    this.getCouponFromSpecies(true)
                    DialogBuilder.of(this).confirm(this.gotSuccessTitle, this.gotSuccessContent,function(){
                        this.dismiss()
                        // logger.makeActivityLog('activity_couponapp_open');
                        if(NativeInterface.launchApp(app.packageName)){
                            logger.makeActivityLog('activity_open_app');
                        } else {
                            // logger.makeActivityLog('activity_open_app_failed')
                            DialogBuilder.of(this).alert('打开失败', '',{
                                bgColor:this.dialogBgColor,   // 对话框背景颜色
                                fontColor:this.detailColor,  // 对话框字体颜色
                                confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                                confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                            });
                        }
                    }, function() {
                        this.dismiss();
                    },{
                        confirmBtnTxt: '打开游戏',
                        cancelBtnTxt: '取消',
                        bgColor:this.dialogBgColor,   // 对话框背景颜色
                        fontColor:this.detailColor,  // 对话框字体颜色
                        confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                        confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                    })
                } else {  // 领取到别的视为当前已抢光
                    // logger.makeActivityLog('activity_coupon_snatched');//领取到的是积分的埋点
                    this.map[index].btnTxt = this.cleanText;
                    this.map[index].couponStatus = -1;
                    this.map[index].use = this.map[index].total
                    this.txt = this.map[index].zippoId+'_'+this.cleanText+'_'+Date.now()
                    this.setCanvasCircle(this.map[index],index)
                    util.setStorage('zippo_' + this.map[index].zippoId, 3);
                    DialogBuilder.of(this).alert(this.cleanTipsTitle, this.cleanTipsContent,{
                        bgColor:this.dialogBgColor,   // 对话框背景颜色
                        fontColor:this.detailColor,  // 对话框字体颜色
                        confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                        confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                    })
                }
            },
            postTask() {
                let taskIds = this.installed_apps,
                    ids = '',
                    _self = this,
                    i = 0
                ids = taskIds.join(",")
                // if(this.updateTimesStatus == ids) {
                //     return
                // }
                // this.updateTimesStatus = ids
                // this.getTimesStatus = ''
                if(taskIds.length == 0){
                    this.getTimes()
                    return
                }
                if(NativeInterface.getUserId()) {
                    if(!this.$checkVersion()) return;
                    for(i = 0; i < taskIds.length; i++){
                        util.addPendingPostTask(taskIds[i]);
                    }
                    //logger.makeActivityLog('activity_dotask_num');
                    this.$store.dispatch('postTask', {context: this, params: {task_ids: taskIds.join(','), content: {status: 2}}}).then((val) => {
                        //logger.makeActivityLog('activity_dotask_success');
                        _self.getTimes()
                        for(i = 0; i < taskIds.length; i++){
                            util.tryRemovePendingPostTask(taskIds[i]);
                        }
                        // this.$forceUpdate();
                    }).catch((err)=> {
                        //logger.makeActivityLog('activity_dotask_failed');
                        if(err.code == 401) {
                            logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                        } else {
                            // this.$handleReqErr(err);
                        }
                    });
                } else {
                    DialogBuilder.of(this).confirm('登录后才可以获取抽奖机会哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录',
                        bgColor:this.dialogBgColor,   // 对话框背景颜色
                        fontColor:this.detailColor,  // 对话框字体颜色
                        confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                        confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                    });
                }   
            },
        }
    }
</script>