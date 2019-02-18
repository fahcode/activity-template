<template>
    <div class="free-gift">
        <div class="free-gift__center" :style="{
                height:$toRem(bg.height),
                paddingTop:$toRem(titleHeight),
                backgroundImage:'url('+bg.url+')'
            }">
            <div class="free-gift__one">
                <img class="free-gift__img" :src="gift.url" :style="{
                    width:$toRem(gift.width),
                    height:$toRem(gift.height),
                    paddingBottom:$toRem(giftGap)
                }" />
                <div class="free-gift__btn" :style="setBtnStyle()"
                    @click="getGift()"></div>
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
    import LotteryResult from 'littles/LotteryResult.vue';
    import BigTitle from 'littles/BigTitle.vue';
    import LotteryTipsMixin from 'base/LotteryTipsMixin'
    export default {
        name: 'FreeGift',
        mixins: [BusinessCompMixin, LotteryTipsMixin],
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
                    url: require("../../assets/free-gift-bg.jpg"),
                    height:824
                }),
                $rule: {
                    name: '背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            titleHeight: {
                type: Number,
                default: 0,
                $rule: {
                    name: '奖品距离上方高度',
                    clazz: Enum.CLAZZ.Number
                }
            },
            giftGap: {
                type: Number,
                default: 48,
                $rule: {
                    name: '按钮距离奖品上面距离',
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
            gift: {
				type: Object,
				default: ()=> ({
					width:1080,
					height:580,
					url:require("../../assets/free-gift.png")
				}),
				$rule: {
					name: '礼包图片',
					clazz: Enum.CLAZZ.IMAGE
				}
            }
        },
        data(){
            return {
                zippos:[],
                freeTask:[],
                giftZippo:[],
                giftStatus:{
                    zippoId:0,
                    taskId:0,
                    status:-1,
                    times:0,
                    name:''
                },
                loginStatus:false,
                clickStatus:false,
                testTime:Date.now()
            }
        },
        computed:{}, // mapState(['loginStatus']),
        // computed:{
        //     ...mapState(['loginStatus'])
        //     // getFreeTask(){
        //     //     let _task = [];
        //     //     if(util2.isInBrowser() && window.__ACTIVITY_CONFIG__){
        //     //         window.__ACTIVITY_CONFIG__.__TASKS__.forEach((task) => {
        //     //             if(task.type == 'FREE'){
        //     //                 _task.push(task);
        //     //             }
        //     //         })
        //     //     }
        //     //     return _task;
        //     // },
        // },
        mounted(){
            let self = this;
            if(process.env.NODE_ENV != 'production') {
                setTimeout(function(){
                     self.init()
                },200)
            }else{
                this.init()
            }
        },
        methods:{
            init(){
                let self = this;
                this.zippos = typeof window != 'undefined' && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__ZIPPOS__ : [];
                this.freeTask = util.getFreeTask();
                this.giftZippo = util.getZippos();
                this.giftStatus = this.setGiftStatus();
                let hasLogin = !!N.getUserId();
                if(hasLogin) {
                    self.loginStatus = true;
                    this.doFreeTask();
                    self.updateGiftStatus();
                    // this.getAwardsUsage();
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
            // getAwardsUsage(){
            //     this.$store.dispatch('fetchAwardsUse', {context: this, params: {award_ids: ids.join(",")}})
            //     .then(val => {
            //         this.usage = val
            //         let i = 0,j = 0,
            //             already = []
            //         for(i = 0; i < this.map.length; i++){
            //             for(j = 0; j < this.usage.length; j++){
            //                 if(already.indexOf(this.map[i].id) == -1 && this.map[i].id == this.usage[j].id){
            //                     this.map[i].total = this.usage[j].total
            //                     this.map[i].use = this.usage[j].use
            //                     if(this.map[i].use == this.map[i].total){
            //                         this.map[i].btnTxt = this.cleanText
            //                         this.map[i].couponStatus = -1
            //                     }
            //                     already.push(this.map[i].id)
            //                 }
            //             }
            //         }
            //         this.txt = Date.now()
            //     })
            //     .catch((err) => {
            //         this.$handleReqErr(err);
            //     })
            // },
            setGiftStatus(){
                var obj = null,
                    temp = this.freeTask[0] || {};
                let name = '';
                if(this.giftZippo.length) {
                    let zippo = this.giftZippo[0];
                    if(zippo.content && zippo.content.probabilitys && zippo.content.probabilitys.length) {
                        let award = util.findAwardById(zippo.content.probabilitys[0].materialId);
                        if(award) {
                            name = award.name;
                        }
                    }
                }
                obj = {
                    zippoId:this.giftZippo.length ? this.giftZippo[0].id : 0,
                    taskId:temp.id || 0,
                    status:-1,
                    times:0,
                    name: name
                }
                return obj;
            },
            setBtnStyle(){
                let bg = this.btn;//  || this.btnGot || this.btnDisabled;
                let current = this.giftStatus;
                let id = current.zippoId;
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
                }else if(!this.loginStatus){
                    // 未登录
                    bg = this.btn;
                }else if(this.giftStatus.times){
                    bg = this.btn;
                }else{
                    bg = this.btnGot;
                }
                return {
                    width:this.$toRem(bg.width),
                    height:this.$toRem(bg.height),
                    backgroundImage:'url('+bg.url+')'
                }
            },
            updateGiftStatus(){
                let index = 0,
                    saveid = 0,
                    id = 0;
                id = this.giftStatus.zippoId;
                saveid = util.getStorage('activity_gift_got');
                this.giftStatus.status = saveid && saveid == id ? 1 : 0
                // 已抢光
                if(this.giftNoneStatus) {
                    this.giftStatus.status = 2;
                }else if(saveid && saveid == id){
                    // 已领取
                    this.giftStatus.status = 1;
                }else if(!this.loginStatus){
                    // 未登录
                    this.giftStatus.status = 0;
                }else if(this.giftStatus.times){
                    this.giftStatus.status = 0;
                }else{
                    this.giftStatus.status = 1;
                    // this.giftStatus.status = 3;
                }
            },
            getGift(){
                let current = this.giftStatus;
                if(this.giftNoneStatus){
                    return
                }
                if(this.clickStatus){
                    return;
                }
                //logger.makeActivityLog('activity_gift_get');
                if(!this.$checkVersion()) return;
                if(current.times == 0){
                    return
                }
                this.clickStatus = true;
                logger.makeActivityLog('activity_gift_get', {'name': current.name});
                this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: current.zippoId}}).then((value) => {
                    this.clickStatus = false;
                    logger.makeActivityLog('activity_gift_got',  {'name': current.name});
                    util.setStorage('activity_gift_got', current.zippoId);
                    this.updateGiftStatus();
                    this.showLotteryResult(value[0]);
                    this.getZippoTimes();
                }).catch((err) => {
                    this.clickStatus = false;
                    //logger.makeActivityLog('activity_prizebad_juge')
                    logger.makeActivityLog('activity_gift_failed',  {'name': current.name});
                    if(err.code == 120040 || err.code == 120038) {
                        DialogBuilder.of(this).alert('您已领取了！', '可前往我的奖品查看')
                    }else if(err.code == 120036){
                        DialogBuilder.of(this).alert('奖品已发完！');
                    }else{
                        DialogBuilder.of(this).alert('出错了', '领取失败');
                    }
                });
            },
            showLotteryResult(award){
                let self = this,
                    type = award.award_type,
                    result = null;
                if(award.award_id != 0) {  // 中奖
                    result = util.findAwardById(award.award_id);
                    if(type == Enum.AWARD_TYPE.MATERIAL || type == Enum.AWARD_TYPE.MATERIAL100){
                        let _LotteryResult = Vue.extend(LotteryResult);
                        let _BigTitle = Vue.extend(BigTitle);
                        DialogBuilder.of(this).confirm(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': result}), function() {
                            this.dismiss();
                            self.$doMotion({type: Enum.MOTION.ADDRESS, params: []});
                        }, {
                            confirmBtnTxt: '填写地址', 
                            cancelBtnTxt: '稍后填写',
                            onDismiss: ()=> this.reset()
                        });
                    }else if(type == Enum.AWARD_TYPE.RATEOFFLOW || type == Enum.AWARD_TYPE.TELCHARGE){
                        let _LotteryResult = Vue.extend(LotteryResult);
                        let _BigTitle = Vue.extend(BigTitle);
                        DialogBuilder.of(this).alert(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': result}), function() {
                            this.dismiss();
                            self.$doMotion({type: Enum.MOTION.PHONE, params: [type, result.id]});
                        }, {
                            confirmBtnTxt: '去领取',
                            onDismiss: ()=> this.reset()
                        });
                    }else if(type == Enum.AWARD_TYPE.COUPON || type == Enum.AWARD_TYPE.VIRTUAL || award.type == Enum.AWARD_TYPE.GIFT){
                        DialogBuilder.of(this).alert('领取成功！', '可前往我的奖品查看',function() {
                            this.dismiss();
                            if(type == Enum.AWARD_TYPE.VIRTUAL){
                                self.$doMotion({type: Enum.MOTION.PHONE, params: [type,result.id]});  // awarded.type  // VIRTUAL
                            }
                        });
                    }else{
                        DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, {
                            onDismiss: ()=> this.reset(),
                            confirmBtnTxt: '确定'
                        });
                    }
                }else{  // 未中奖
                    DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, {
                        onDismiss: ()=> this.reset(),
                        confirmBtnTxt: '确定'
                    });
                }
            },
            doFreeTask(index,callback = () => {}) {
                let current = this.giftStatus;
                let ids = current.taskId,
                    self = this
                //logger.makeActivityLog('activity_dotask_num');
                this.$store.dispatch('postTask', {context: this, params: {task_ids: ids, content: {status:2}}}).then((val) => {
                    //logger.makeActivityLog('activity_dotask_success');
                    this.getZippoTimes(callback);
                }).catch((err) => {
                    //logger.makeActivityLog('activity_dotask_failed');
                    if(err.code == 401) {
                        logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                    }else if(err.code == 113004){
                        // imei is used
                        DialogBuilder.of(this).alert("","此账号或此设备已领取");
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
                             if(zippoTime.zippo_id == self.giftStatus.zippoId){
                                self.giftStatus.times = zippoTime.times;
                            }
                        })
                        self.testTime = Date.now();
                        self.$forceUpdate();
                        self.updateGiftStatus();
                        callback()
                    }).catch((err) => {
                        //logger.makeActivityLog('activity_prizebadtime_juge'); // 获取lottery失败次数
                        if(err.code == 401) {
                            logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                        }
                        this.$handleReqErr(err);
                    });
                }
            },
            reset(){

            }
        }
    }
</script>
<style lang="less">
    .free-gift {
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
            display: block;
        }
        &__btn {
            margin:0 auto;
            background-repeat:no-repeat;
            background-position:center top;
            background-size:100% 100%;
        }
    }
</style>