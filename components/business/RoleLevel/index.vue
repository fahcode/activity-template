<template>
    <div class="role-level">
        <div class="role-level__center" :style="{
                height:$toRem(bg.height),
                paddingTop:$toRem(titleHeight),
                backgroundImage:'url('+bg.url+')'
            }">
            <div class="role-level__one" v-for="(one,index) in levelList"
                :style="{
                    paddingTop:$toRem(giftGap)
                }">
                <img class="role-level__img" :src="one.url" :style="{
                    width:$toRem(one.width),
                    height:$toRem(one.height)
                }" />
                <div class="role-level__btn" :style="setBtnStyle(index)"
                    @click="getGift(index)"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import Enum from 'common/enum';
    import util from 'common/util';
    import util2 from 'common/util2';
    import N from 'common/nativeinterface';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    import DialogBuilder from 'base/DialogBuilder';
    import Base64 from 'base/Base64'
    import logger from 'common/logger';
    export default {
        name: 'RoleLevel',
        mixins: [BusinessCompMixin],
        props: {
            giftNoneStatus: {
                type: Boolean,
                default: false,
                $rule: {
                    name: '是否已领完'
                }
            },
            bg: {
                type: Object,
                default: ()=> ({
                    url: require("../../assets/role-level-bg.jpg"),
                    height:1410
                }),
                $rule: {
                    name: '等级礼包背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            titleHeight: {
                type: Number,
                default: 102,
                $rule: {
                    name: '等级礼包标题高度',
                    clazz: Enum.CLAZZ.Number
                }
            },
            giftGap: {
                type: Number,
                default: 81,
                $rule: {
                    name: '礼包间间距',
                    clazz: Enum.CLAZZ.Number
                }
            },
            btn:{
                type: Object,
                default: ()=> ({
                    width:408,
                    height:97,
                    url: require("../../assets/role-level-btn.png")
                }),
                $rule: {
                    name: '立即领取按钮图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            btnGot:{
                type: Object,
                default: ()=> ({
                    width:408,
                    height:97,
                    url: require("../../assets/role-level-btn-got.png")
                }),
                $rule: {
                    name: '已领取按钮图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            btnDisabled:{
                type: Object,
                default: ()=> ({
                    width:408,
                    height:97,
                    url: require("../../assets/role-level-btn-disabled.png")
                }),
                $rule: {
                    name: '等级不够领取按钮图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            btnNone:{
                type: Object,
                default: ()=> ({
                    width:408,
                    height:97,
                    url: require("../../assets/role-level-btn-none.png")
                }),
                $rule: {
                    name: '抢光领取按钮图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            levelList: {
				type: Array,
				default: ()=> ([{
					width:1080,
					height:448,
					url:require("../../assets/role-level-01.png")
				},{
					width:1080,
					height:448,
					url:require("../../assets/role-level-02.png")
				}]),
				$rule: {
					name: '等级礼包集合',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			},
        },
        data(){
            return {
                zippos:[],
                levelTask:[], // {}
                giftZippo:[],
                giftStatus:[],
                // giftNoneStatus:false,
                roleLevel:0,
                loginStatus:false,
                testTime:Date.now(),
                clickStatus:false
            }
        },
        computed:Object.assign({  // mapState(['loginStatus']),
            userLevelTask(){
                let _task = [];
                if(util2.isInBrowser() && window.__ACTIVITY_CONFIG__){
                    window.__ACTIVITY_CONFIG__.__TASKS__.forEach((task) => {
                        if(task.type == 'USER_LEVEL'){
                            _task.push(task);
                        }
                    })
                }
                return _task;
            },
            // giftZippo(){
            //     let zippos = typeof window != 'undefined' && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__ZIPPOS__ : [],
            //         arr = [],
            //         i = 0;
            //     for(i = 0; i < zippos.length; i++){
            //         if(zippos[i].type == 'EXCHANGE'){
            //             arr.push(zippos[i])
            //         }
            //     }
            //     return arr;
            // }
        }),
        beforeMount(){
            if(process.env.NODE_ENV != 'production' && typeof window !== undefined){
                var key = 'mzgame_activity_data_' + window.__ACTIVITY_ID__;
                localStorage[key] = "{}";
            }
        },
        mounted(){
            let self = this;
            if(process.env.NODE_ENV != 'production') {
                setTimeout(function(){
                     self.init()
                },500)
            }else{
                this.init()
            }
        },
        methods:{
            init(){
                let self = this;
                this.zippos = typeof window != 'undefined' && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__ZIPPOS__ : [];
                this.levelTask = this.userLevelTask;  // util.getLevelTask();  // this.userLevelTask;
                this.giftZippo = util.getzippoEx(this.levelTask.length);
                this.giftStatus = this.setGiftStatus();
                let hasLogin = !!N.getUserId();
                if(hasLogin) {
                    self.loginStatus = true;
                    this.getUserGameLevel();
                }
                // N.getToken(false).then((token) => {
                //     if(token){
                //         self.loginStatus = true
                //     }else{
                //         self.loginStatus = false
                //     }
                //     if(process.env.NODE_ENV != 'production'){
                //         self.loginStatus = true
                //     }
                //     self.testTime = Date.now();
                //     self.updateGiftStatus();
                // })
            },
            setGiftStatus(){
                var zlen = this.giftZippo.length,
                    tlen = this.levelTask.length,
                    len = zlen > tlen ? tlen : zlen,
                    arr = [],
                    temp = null;
                for(var i = 0; i < len; i++){
                    temp = this.levelTask[i];
                    let name = '';
                    let content = this.giftZippo[i].content;
                    if(content) {
                        let award = util.findAwardById(content);
                        if(award) {
                            name = award.name;
                        }
                    }
                    arr.push({
                        zippoId:this.giftZippo[i].id,
                        taskId:temp.id,
                        level:temp.content.level,
                        appId:temp.content.appId,
                        status:-1,
                        times:0,
                        name:name
                    })
                }
                return arr;
            },
            setBtnStyle(index){
                let bg = this.btn;//  || this.btnGot || this.btnDisabled;
                if(this.giftStatus.length <= index || this.roleLevel == -1){
                    bg = this.btn;
                }else {
                    let current = this.giftStatus.length <= index ? this.giftStatus[0] : this.giftStatus[index];
                    let id = current.zippoId,
                        level = current.level;
                    if(current.status != -1){
                        switch(current.status){
                            case 0:
                                bg = this.btn;
                                break;
                            case 1:
                                bg = this.btnGot;
                                break;
                            case 2:
                                bg = this.btnNone;
                                break;
                            case 3:
                                bg = this.btnDisabled;
                                break;
                        }
                    }else if(this.giftNoneStatus){
                        bg = this.btnNone;
                    }else if(this.roleLevel != -1 && this.roleLevel >= level){
                        let saveid = util.getStorage('activity_gift_got--'+index);
                        if(saveid && saveid == id){
                            bg = this.btnGot;
                        }else {
                            bg = this.btn;
                        }
                    }else if(!this.loginStatus){
                        // 未登录
                        bg = this.btn;
                    }else{
                        bg = this.btnDisabled;
                    }
                }
                return {
                    width:this.$toRem(bg.width),
                    height:this.$toRem(bg.height),
                    backgroundImage:'url('+bg.url+')'
                }
            },
            getUserGameLevel(){
                this.$store.dispatch('getUserGameLevel', {context: this, params: {
                    appId: this.giftStatus.length > 0 ? this.giftStatus[0].appId : 0, 
                    content: {status:2}
                }}).then((val) => {
                    if(val){
                        this.roleLevel = val.level;
                        this.updateGiftStatus();
                    }
                    logger.makeActivityLog('activity_rolelevel_success');
                }).catch((err) => {
                    logger.makeActivityLog('activity_rolelevel_failed');
                    if(err.code == 401) {
                        logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                    }else{
                        DialogBuilder.of(this).alert('获取用户角色等级失败', '请刷新重试');
                    }
                })
            },
            updateGiftStatus(){
                let index = 0,
                    saveid = 0,
                    id = 0;
                for( index = 0; index < this.giftStatus.length; index++){
                    id = this.giftStatus[index].zippoId;
                    saveid = util.getStorage('activity_gift_got--'+index);
                    if(this.giftStatus[index]){
                        this.giftStatus[index].status = saveid && saveid == id ? 1 : 0
                    }else{
                        this.giftStatus[index] = {
                            status:saveid && saveid == id ? 1 : 0
                        }
                    }
                    // 已抢光
                    if(this.giftNoneStatus) {
                        this.giftStatus[index].status = 2;
                    }else if(this.roleLevel != -1 && this.roleLevel >= this.giftStatus[index].level){
                        // 等级够了
                        if(saveid && saveid == id){
                            this.giftStatus[index].status = 1;    
                        }else{
                            this.giftStatus[index].status = 0;
                        }
                    }else if(!this.loginStatus){
                        // 未登录
                        this.giftStatus[index].status = 0;
                    }else{
                        this.giftStatus[index].status = 3;
                    }
                }
            },
            getGift(index){
                let current = this.giftStatus.length <= index ? this.giftStatus[0] : this.giftStatus[index];
                let level = current.level;
                if(this.giftNoneStatus || (this.roleLevel != -1 && this.roleLevel < level)){
                    return
                }
                if(this.clickStatus){
                    return;
                }
                // logger.makeActivityLog('activity_gift_get');
                // logger.makeActivityLog('activity_exchange_'+index+'_times');
                if(!this.$checkVersion()) return;
                this.clickStatus = true;
                // 先做task，获取次数
                this.doUserLevelTask(index,() => {
                    // 做完任务，并且此时已经获取到了次数
                    if(current.times == 0){
                        this.clickStatus = false;
                        return
                    }
                    logger.makeActivityLog('activity_exchange_get', {name: index + '兑换'});
                    this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: current.zippoId}}).then((value) => {
                        this.clickStatus = false;
                        // logger.makeActivityLog('activity_gift_got');
                        util.setStorage('activity_gift_got--'+index, current.zippoId);
                        this.updateGiftStatus();
                        logger.makeActivityLog('activity_exchange_got', {name: index + '兑换'});
                        DialogBuilder.of(this).alert('领取成功！', '可前往我的奖品查看',function() {
                            this.dismiss();
                            this.$doMotion({type: Enum.MOTION.PHONE, params: [value[0].award_type,value[0].award_id]});  // awarded.type  // VIRTUAL  
                        });
                        this.getZippoTimes();
                    }).catch((err) => {
                        this.clickStatus = false;
                        // logger.makeActivityLog('activity_prizebad_juge')
                        logger.makeActivityLog('activity_exchange_failed', {name: index + '兑换'})
                        if(err.code == 120040 || err.code == 120038) {
                            DialogBuilder.of(this).alert('您已领取了！', '可前往我的奖品查看')
                        }else if(err.code == 120036){
                            DialogBuilder.of(this).alert('奖品已发完！');
                        }else{
                            DialogBuilder.of(this).alert('出错了', '领取礼包失败');
                        }
                    });
                });
            },
            doUserLevelTask(index,callback = () => {}) {
                let current = this.giftStatus.length <= index ? this.giftStatus[0] : this.giftStatus[index];
                let ids = current.taskId,
                    self = this
                //logger.makeActivityLog('activity_dotask_num');
                this.$store.dispatch('postTask', {context: this, params: {task_ids: ids, content: {status:2}}}).then((val) => {
                    //logger.makeActivityLog('activity_dotask_success');
                    this.getZippoTimes(true,callback)
                }).catch((err) => {
                    this.clickStatus = false;
                    //logger.makeActivityLog('activity_dotask_failed');
                    if(err.code == 401) {
                        logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                    }else if(err.code == 113004){
                        // imei is used
                        DialogBuilder.of(this).alert("","此账号或此设备已领取");
                        util.setStorage('activity_gift_got--'+index, current.zippoId);
                        self.updateGiftStatus();
                    }else{
                        DialogBuilder.of(this).alert('获取领取机会失败', '请刷新重试');
                    }
                })
            },
            getZippoTimes(status = false,callback = () => {}){
                if(N.getUserId()) {
                    let arr = [],
                        i = 0,
                        self = this;
                    for(i = 0; i < this.zippos.length; i++){
                        arr.push(this.zippos[i].id)
                    }
                    this.$store.dispatch('fetchLotteryTimes', {context: this, params: {zippo_ids: arr.join(',')}}).then((val) => {
                        // logger.makeActivityLog('activity_charge_update_success_times'); // 获取lottery成功次数
                        val.zippoTimes.forEach((zippoTime,index) => {
                            for(i = 0; i < self.giftStatus.length; i++){
                                if(zippoTime.zippo_id == self.giftStatus[i].zippoId){
                                    self.giftStatus[i].times = zippoTime.times
                                    break
                                }
                            }
                        })
                        self.testTime = Date.now()
                        self.$forceUpdate()
                        callback()
                    }).catch((err) => {
                        this.clickStatus = false;
                        //logger.makeActivityLog('activity_prizebadtime_juge'); // 获取lottery失败次数
                        if(err.code == 401) {
                            logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                        }
                        this.$handleReqErr(err);
                    });
                }else {
                    this.clickStatus = false;
                }
            },
        }
    }
</script>
<style lang="less">
    .role-level {
        width:100%;
        &__center {
            width:100%;
            background-repeat:no-repeat;
            background-position:center top;
            background-size:100% 100%;
        }
        &__one {
            
        }
        &__img {
            width:100%;
            margin:0 auto;
        }
        &__btn {
            margin:0 auto;
            background-repeat:no-repeat;
            background-position:center top;
            background-size:100% 100%;
        }
    }
</style>