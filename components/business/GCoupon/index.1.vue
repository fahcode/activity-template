<style lang="less">
    .gcoupon {
        width:100%;
        padding:.185185rem 0;  // 20px 0
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
            white-space: nowrap;
            overflow-x: auto;
        }
        &__list {
            width:100%;
            height:1.759259rem;  // 190px
            padding: 0 .314815rem;  // 0 34px 
            overflow-x:auto;
            overflow-y:hidden;
            white-space:nowrap;
            // :last-child{
            //     margin-right:0;
            // }
        }
        &__one {
            width:4.055556rem;  // 438px
            height:1.759259rem;  // 190px
            margin:0 .277778rem 0 0; // 0 30px
            display:inline-block;
            background-repeat:no-repeat;
            background-position:center center;
            background-size:100% 100%;
            background-color:transparent;
        }
        .one__money {
            width:1.740741rem;  // 188px
            height:1.759259rem;  // 190px
            line-height:1.759259rem;  // 190px
            text-align:center;
            color:#fff;
            font-size:.314815rem;  // 34px
            vertical-align:baseline;
            font-family:'Flyme';
            letter-spacing:0;
            float:left;
            overflow:hidden;
            .cn {
                margin:0 0 0 -.055556rem;  // -6
            }
            .cn-after {
                margin:0 0 0 .055556rem;  // 6
            }
            .num {
                // margin:0 0 0 -.037037rem;  // -4px
                // letter-spacing:-.037037rem;  // -2px
                font-size:.555556rem;  // 60px
                font-weight: bold;
                font-family:"Flyme";
            }
        }
        .one__info {
            width:2.314815rem;  // 250px
            height:1.759259rem;  // 190px
            float:left;
            padding:0 .092593rem;  // 0 10px
        }
        .one__title {
            width:100%;
            line-height:.490741rem;   // 53px
            padding:.138889rem 0 0 0;  // 15px 0 0 0;
            font-size:.277778rem;  // 30px
            text-align:center;
            color:#333;
            white-space:nowrap;
            overflow:hidden;
            text-overflow: ellipsis;
        }
        .one__detail {
            width:100%;
            height:.481481rem;  // 52px
            line-height:.240741rem;  // 26px
            font-size:.185185rem;  // 20px
            color:#666;
            text-align:center;
            white-space: normal;
        }
        .one__btn {
            width:1.842593rem;  // 199px
            height:.601852rem;  // 65px
            padding:.092593rem 0 0 0; // 10px 0 0 0
            margin:0 auto;
            position:relative;
            .one__img {
                width:1.842593rem;
            }
            .btn__text {
                width:1.842593rem;
                line-height:.388889rem; // 42px
                font-size:.268519rem;  // 29px
                text-align:center;
                color:#fff;
                position:absolute;
                left:0;
                top:.12963rem;  // 14px
            }
        }
        .synch-render {
            display:none;
        }
    }
</style>
<template>
    <div class="gcoupon">
        <div class="gcoupon__inner">
            <div class="synch-render">{{txt}}</div>
            <template v-if="coupons">
                <ul class="gcoupon__list clearfix">
                    <li class="gcoupon__one clearfix" 
                        v-for ="(one,index) in map"
                        :style="{
                            backgroundImage:'url('+bg.url+')'
                        }">
                        <div class="one__money"
                            :style="{
                                color:moneyColor
                            }"><span class="cn" v-if="one.value < 10000">￥</span><span class="num">{{setCouponValue(one.value)}}</span><span class="cn cn-after" v-if="one.value >= 10000">折</span></div>
                        <div class="one__info">
                            <div class="one__title" :style="{color:titleColor}">{{one.name}}</div>
                            <div class="one__detail" :style="{color:detailColor}">{{detail}}</div>
                            <div class="one__btn" @click.stop.prevent="getCoupon($event,index)"
                                :style="{opacity:one.couponStatus != 0 ? 0.4 : 1}">
                                <img class="one__img" :src="btn.url" />
                                <div class="btn__text" :style="{color:btnColor}">{{one.btnTxt}}</div>
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
    import BusinessCompMixin from 'base/BusinessCompMixin'
    import DialogBuilder from 'base/DialogBuilder';
    import Base64 from 'base/Base64'
    import logger from 'common/logger';
    export default {
        name: 'GCoupon',
        mixins: [BusinessCompMixin],
        props: {
            bg: {
                type: Object,
                default: ()=> ({url: require("../../assets/coupon_bg02.png")}),
                $rule: {
                    name: '优惠劵背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            margin: {
                type: Number,
                default: 30,
                $rule: {
                    name: '优惠劵间距(单位px)'
                }
            },
            // money: {
			// 	type: Number,
			// 	default: 10,
			// 	$rule: {
			// 		name: '金额'
			// 	}
			// },
            moneyColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '金额颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            // title: {
			// 	type: String,
			// 	default: '消费满12元可用',
			// 	$rule: {
			// 		name: '优惠劵标题标题文本'
			// 	}
			// },
            titleColor: {
                type: String,
                default: '#333',
                $rule: {
                    name: '优惠劵标题颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            detail: {
				type: String,
				default: '适用游戏中心Flyme账号登录游戏',
				$rule: {
					name: '优惠劵信息文本'
				}
			},
            detailColor: {
                type: String,
                default: '#666',
                $rule: {
                    name: '优惠劵信息颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            btn: {
                type: Object,
                default: ()=> ({url: require("../../assets/coupon_btn_bg.png")}),
                $rule: {
                    name: '按钮背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            // ungetColor: {
            //     type: String,
            //     default: '#000',
            //     $rule: {
            //         name: '按钮颜色（未领取状态）',
            //         clazz: Enum.CLAZZ.COLOR
            //     }
            // },
            btnColor:{
                type: String,
                default: '#fff',
                $rule: {
                    name: '领取按钮文本颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            ungetText: {
				type: String,
				default: '立即领取',
				$rule: {
					name: '未领取按钮文本'
				}
			},
            // got: {
            //     type: Object,
            //     default: ()=> ({url: require("../../assets/coupon_got.png")}),
            //     $rule: {
            //         name: '按钮图片（已领取状态）',
            //         clazz: Enum.CLAZZ.IMAGE
            //     }
            // },
            // gotColor: {
            //     type: String,
            //     default: '#000',
            //     $rule: {
            //         name: '按钮颜色（已领取状态）',
            //         clazz: Enum.CLAZZ.COLOR
            //     }
            // },
            gotText: {
				type: String,
				default: '已领取',
				$rule: {
					name: '已领取按钮文本'
				}
			},
            cleanText: {
				type: String,
				default: '已抢光',
				$rule: {
					name: '已抢光按钮文本'
				}
            },
            gotSuccessTitle: {
				type: String,
				default: '领取成功',
				$rule: {
					name: '成功领取弹窗提示标题'
				}
			},
            gotSuccessContent: {
				type: String,
				default: '请进入游戏点击熊猫图标查看，如无熊猫图标请删除游戏并安装新版本。',
				$rule: {
					name: '成功领取弹窗提示内容'
				}
			},
            gotTipsTitle: {
				type: String,
				default: '今日已领完',
				$rule: {
					name: '已领取弹窗提示标题'
				}
			},
            gotTipsContent: {
				type: String,
				default: '请领取其他优惠劵或明日再来领取',
				$rule: {
					name: '已领取弹窗提示内容'
				}
			},
            cleanTipsTitle: {
				type: String,
				default: '已抢光',
				$rule: {
					name: '已抢光弹窗提示标题'
				}
			},
            cleanTipsContent: {
				type: String,
				default: '此券已经被领完了，下次记得早点来哟~你还可以领取其他优惠券！',
				$rule: {
					name: '已抢光弹窗提示内容'
				}
			},
        },
        data(){
            return {
                allcoupons:[],
                zippo_times:[],
                updateTimesStatus:-1,
                getTimesStatus:-1,
                times_obj:{},
                zippo_status:false,  // 是否已经初始化次数值
                // allcoupons:allcoupons,
                // zippo_ids:zippo_ids,
                map:[],
                initialStatus:false,
                txt:'123'
            }
        },
        computed:{
            zippo_ids(){
                return util.isInBrowser() && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__ZIPPOS__ : []
            },
            coupons(){
                let zippo_ids = this.zippo_ids,
                    allcoupons = this.getCouponFromSpecies(),
                    content = null,
                    already = [],
                    one = null,
                    zid = -1,
                    i = 0,j = 0,z = 0,
                    st = 0,
                    stime = 0,
                    temp = {}
                if(!this.initialStatus){
                    for(i = 0; i < allcoupons.length; i++){
                        // zid = -1
                        // for(j = 0; j < zippo_ids.length; j++){
                        //     content = JSON.parse(zippo_ids[j].content)
                        //     if(already.indexOf(zippo_ids[j].id) != -1 || content.probabilitys.length > 2){
                        //         continue
                        //     }
                        //     // if(content.conditions.awardId == allcoupons[i].id){
                        //     //     zid = zippo_ids[j].id
                        //     //     already.push(zippo_ids[j].id)
                        //     // }else {
                        //         for(z = 0; z < content.probabilitys.length; z++){
                        //             one = content.probabilitys[z]
                        //             if(one.awardId == allcoupons[i].id){
                        //                 zid = zippo_ids[j].id
                        //                 already.push(zippo_ids[j].id)
                        //                 break
                        //             }
                        //         }
                        //     // }
                        //     if(zid != -1){
                        //         allcoupons[i].conditionsId = content.conditions.awardId
                        //         // allcoupons[i].total = zippo_ids[j].total
                        //         // allcoupons[i].use = zippo_ids[j].use
                        //         break
                        //     }
                        // }
                        // zid = zippo_ids[i].id
                        // allcoupons[i].zippoId = zid
                        // 获取当前设备本地存储的领取情况
                        // st = parseInt(util.getStorage('zippo_' + zid))
                        // stime = util.getStorage('last_get_time_'+zid)
                        // if(st == 1) {
                        //     if(util.isOpenExpire(1,stime)){
                        //         allcoupons[i].btnTxt = this.ungetText
                        //         allcoupons[i].couponStatus = 0
                        //     }else{
                        //         allcoupons[i].couponStatus = 1;
                        //         allcoupons[i].btnTxt = this.gotText
                        //     }
                        // }else if(st == -1){
                        //     allcoupons[i].couponStatus = -1;
                        //     allcoupons[i].btnTxt = this.cleanText
                        // }else{
                                allcoupons[i].btnTxt = this.ungetText
                                allcoupons[i].couponStatus = 0
                        // }
                        // this.map.push(allcoupons[i])
                    }
                }
                if(allcoupons.length > 0 && !this.zippo_status && this.zippo_times && this.zippo_times.length > 0){
                    allcoupons = this.initCouponsTime(allcoupons)
                }
                this.map = []
                for(i = 0; i < allcoupons.length; i++){
                    this.map.push({})
                    for(j in allcoupons[i]){
                        this.map[i][j] = allcoupons[i][j]
                    }
                }
                return allcoupons
            },
            freeTask() {
                // let _task = {};
                let _task = [],
                    already = [];
                if(util.isInBrowser && window.__ACTIVITY_CONFIG__) {
                    window.__ACTIVITY_CONFIG__.__TASKS__.forEach((task) => {
                        if(task.type == 'FREE') {
                            let i = 0
                            // for(i = 0; i < this.map.length; i++){
                            //     if(already.indexOf(task.id) == -1){// && task.content.awardId == this.map[i].id
                                    _task.push(task)
                                    already.push(task.id)
                            //         break
                            //     }
                            // }
                            // _task = task;
                            // let i = 0,
                            //     one = null
                            // for(i = 0; i < this.map.length; i++){
                            //     one = JSON.parse(task.content)
                            //     if(already.indexOf(task.id) == -1 && this.map[i].conditionsId == one.awardId){
                                    // _task.push(task)
                            //         already.push(task.id)
                            //         break
                            //     }
                            // }
                        }
                    });
                }
                return _task;
            }
        },
        mounted(){
            let hasLogin = !!NativeInterface.getUserId();
            //this.freeTask
            if(hasLogin) {
                if(process.env.NODE_ENV == 'production' && NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < 6007001) {
                    DialogBuilder.of(this).alert('','当前版本过低，请前往应用商店升级游戏中心最新版本', function() {
                        window.location.href = 'mstore://details?package_name=com.meizu.flyme.gamecenter&source_apkname=com.meizu.flyme.gamecenter';
                        this.dismiss();
                    }, {confirmBtnTxt: '去升级', onOuterClickDismiss: false});
                    return;
                }
                // 执行免费赠送任务
                this.postFreeTask()
            }
        },
        methods:{
            setCouponValue(value){
                if(value < 10000){
                    return value
                }else{
                    var val = (value / 10000).toFixed(1).split('.')
                    if(val[1] == '0'){
                        return val[0]
                    }else return val.join('.')
                }
            },
            postFreeTask(){
                let  _self = this,
                    freeTask = this.freeTask,
                    task_ids = [],
                    ids = ''
                for(let i = 0; i < freeTask.length; i++){
                    task_ids.push(freeTask[i].id)
                }
                ids = task_ids.join(",")
                if(this.updateTimesStatus == ids) {
                    return
                }
                this.updateTimesStatus = ids
                if(task_ids.length == 0){
                    this.getTimes()
                    return
                }
                //logger.makeActivityLog('activity_dotask_num');
                this.$store.dispatch('postTask', {context: this, params: {task_ids: ids, content: {status: 2}}}).then((val) => {
                    //logger.makeActivityLog('activity_dotask_success'); //领取优惠券机会成功人数埋点
                }).then(() => {
                    // 任务执行完成后获取抽奖次数
                    this.getTimes()
                }).catch((err) => {
                    //logger.makeActivityLog('activity_dotask_failed');//获取领取优惠券机会异常
                    if(err.code == 401) {
                        logger.makeActivityLog('activity_signbad_juge');//登录账号异常
                    } else {
                        this.$handleReqErr(err);
                    }
                });
            },
            getTimes(){
                let zippo_ids = this.zippo_ids,
                    ids = [],
                    o = '',
                    _self = this
                for(let i = 0; i < zippo_ids.length; i++){
                    ids.push(zippo_ids[i].id)
                }
                o = ids.join(",")
                if(ids.length){
                    if(this.getTimesStatus == o){
                        return
                    }
                    this.getTimesStatus = o
                    _self.$getLotteryTimes(o,(response) => {
                        let already = []
                        _self.zippo_times = response.zippoTimes
                        if(!_self.coupons || _self.coupons.length == 0){
                            _self.zippo_status = false
                            return
                        }
                        _self.coupons = _self.initCouponsTime(_self.coupons)
                        // _self.$forceUpdate();
                    })
                }
            },
            getCouponFromSpecies(){
                let list = this.findAwardsByType(Enum.AWARD_TYPE.COUPON) || [],
                    zippo_ids = this.zippo_ids,
                    base = new Base64(),
                    type = '',
                    arr = [],
                    i = 0
                for(i = 0; i < list.length; i++){
                    type = list[i].couponType || JSON.parse(base.decode(list[i].extValue1)).couponType
                    switch(type){
                        case 'global':
                            list[i].zippoId = zippo_ids && zippo_ids[i] ? zippo_ids[i].id : -1
                            arr.push(list[i])
                            break
                    }
                }
                return arr
            },
            findAwardsByType(type) {
                let result = [];
                let awards = typeof window != 'undefined' && window.__ACTIVITY_CONFIG__ ? window.__ACTIVITY_CONFIG__.__AWARDS__ : [];
                for(let i = 0; i < awards.length; i++) {
                    let award = awards[i];
                    if(award.type == type) {
                        award.idx = i;
                        result.push(award);
                    }
                }
                return result;
            },
            initCouponsTime(coupons){
                let self = this,
                    temp = {},
                    i = 0,
                    j = 0
                this.zippo_times.forEach((zippoTime) => {
                    let a = 0
                    let already = []
                    self.times_obj[zippoTime.zippo_id] = zippoTime.times
                    for(a = 0; a < coupons.length; a++){
                        if(already.indexOf(coupons[a].zippoId) == -1 && zippoTime.zippo_id == coupons[a].zippoId) {
                            coupons[a].times = zippoTime.times;
                            if(zippoTime.times > 0){
                                if(coupons[a].btnTxt == this.ungetText){
                                    coupons[a].btnTxt = this.ungetText
                                    coupons[a].couponStatus = 0
                                }
                            }else {
                                if(coupons[a].btnTxt == this.gotText){
                                    coupons[a].btnTxt = this.gotText
                                    coupons[a].couponStatus = 1
                                }else{
                                    coupons[a].btnTxt = this.cleanText
                                    coupons[a].couponStatus = -1
                                }
                            }
                            already.push(coupons[a].zippoId)
                            break
                        }
                    }
                })
                this.zippo_status = true
                this.initialStatus = true
                this.txt = Date.now()
                this.postFreeTask()
                return coupons
            },
            getCoupon(e,index){
                if(process.env.NODE_ENV == 'production'){
                    if(!this.$checkVersion()) {
                        return;
                    }
                    if(!NativeInterface.getUserId()) {
                        DialogBuilder.of(this).alert('登录后才可以领取哦', function() {
                            this.dismiss();
                            NativeInterface.login();
                        }, {confirmBtnTxt: '登录'});
                        return;
                    }
                }
                if(this.map[index].couponStatus == 1) { // 当前无次数
                    this.map[index].btnTxt = this.gotText;
                    this.map[index].couponStatus = 1;
                    this.txt = Date.now()
                    //logger.makeActivityLog('activity_notimes_num');
                    return;
                }else if(this.map[index].couponStatus == -1){   // 已抢光
                    this.map[index].btnTxt = this.cleanText;
                    this.map[index].couponStatus = -1;
                    this.txt = Date.now()
                    return
                }
                logger.makeActivityLog('activity_coupon_get');//点击领取优惠券埋点
                this.$store.dispatch('doLottery', {context: this, params: {zippo_ids:  this.map[index].zippoId}}).then((value) => {
                    this.showLotteryResult(value[0],index);
                    this.getTimesStatus = ''
                    this.getTimes()
                    // util.setStorage('zippo_' + this.map[index].zippoId, 1);
                    // util.setStorage('last_get_time_'+this.map[index].zippoId,Date.now())
                }).catch((err) => {
                    logger.makeActivityLog('activity_prize_failed');
                    if(err.code && (err.code == 120040 || err.code == 120038)) {
                        // logger.makeActivityLog('activity_coupon_ntimes');//领取优惠券多次领取
                        // util.setStorage('zippo_' + this.map[index].zippoId, 1);
                        this.map[index].btnTxt = this.gotText;
                        this.map[index].couponStatus = 1;
                        this.txt = this.map[index].zippoId+'_'+this.gotText+'_'+Date.now()
                        DialogBuilder.of(this).alert(this.gotTipsTitle,this.gotTipsContent);
                    } else {
                        return Vue.Promise.reject(err);
                    }
                }).catch((err) => {
                    // logger.makeActivityLog('activity_coupon_failed');//领取优惠券异常埋点
                    this.$handleReqErr(err);
                })
            },
            showLotteryResult(award,index){
                if(award && award.award_type == Enum.AWARD_TYPE.COUPON) {
                    //logger.makeActivityLog('activity_coupon_got');//领取优惠券成功埋点
                    // let _LotteryResult = Vue.extend(LotteryResult);
                    let self = this;

                    this.map[index].btnTxt = this.gotText;
                    this.map[index].couponStatus = 1;
                    this.txt = this.map[index].zippoId+'_'+this.gotText+'_'+Date.now()
                    DialogBuilder.of(this).alert(this.gotSuccessTitle, this.gotSuccessContent)
                    // DialogBuilder.of(this).alert('领取成功！', util.createComponentProxy(_LotteryResult, {'award': {'icon': ''}}), function() {
                    //     this.dismiss();
                    // }, {confirmBtnTxt: '确定'})
                } else {  // 领取到别的视为当前已抢光
                    // logger.makeActivityLog('activity_coupon_snatched');//领取到的是积分的埋点
                    // DialogBuilder.of(this).alert('出错了！刷新看看～');
                    // util.setStorage('zippo_' + this.map[index].zippoId, -1);
                    this.map[index].btnTxt = this.cleanText;
                    this.map[index].couponStatus = -1;
                    this.txt = this.map[index].zippoId+'_'+this.cleanText+'_'+Date.now()
                    DialogBuilder.of(this).alert(this.cleanTipsTitle, this.cleanTipsContent)
                }
            }
        }
        // computed: {
        //   margin() {
        //     if(this.imgs.length) {
        //       let margin = (this.$psdWidth - this.imgs[0].width * (Number(this.displayCount) - 0.5) - this.$toPx(0.44444)) / 4;
        //       margin = margin < 0 ? 0 : margin;
        //       return this.$toRem(margin);
        //     } else {
        //       return 0;
        //     }
        //   }
        // }
    }
</script>