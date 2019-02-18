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
            height:1.944444rem;  // 210px
            padding: 0 .444444rem;  // 0 48px 
            overflow-x:auto;
            overflow-y:hidden;
            white-space:nowrap;
        }
        &__one {
            width:4.518519rem;  // 488px
            height:1.944444rem;  // 210px
            margin:0 .148148rem 0 0; // 0 16px
            display:inline-block;
            background-repeat:no-repeat;
            background-position:center center;
            background-size:100% 100%;
            background-color:transparent;
        }
        &__one:last-child{
            margin-right:.444444rem;  //48px 
        }
        .one__money {
            width:1.740741rem;  // 188px
            height:1.944444rem;  // 210px
            line-height:1.944444rem;  // 210px
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
                font-family:"SFDIN-Bold";
            }
        }
        .one__info {
            width:2.777778rem;  // 300px
            height:1.944444rem;  // 210px
            float:left;
            padding:0 .092593rem;  // 0 10px
        }
        .one__title {
            width:100%;
            line-height:.5rem;   // 54px
            padding:.212963rem 0 0 0;  // 23px 0 0 0;
            font-size:.314815rem;  // 34px
            font-weight:bold;
            text-align:center;
            color:#333;
            white-space:nowrap;
            overflow:hidden;
            text-overflow: ellipsis;
        }
        .one__detail {
            width:100%;
            height:.537037rem;  // 58px
            line-height:.277778rem;  // 30px
            padding:.018519rem 0 0 0;  // 2px
            font-size:.222222rem;  // 24px
            color:#666;
            text-align:center;
            white-space: normal;
            overflow:hidden;
        }
        .one__cbtn {
            width:1.842593rem;  // 199px
            height:.601852rem;  // 65px
            padding:.092593rem 0 0 0; // 10px 0 0 0
            margin:0 auto;
            position:relative;
            .one__img {
                width:1.833333rem;  // 198px
                position:absolute;
                left:0;
                top:.092593rem;  // 10px
            }
            .btn__text {
                width:1.842593rem;
                line-height:.388889rem; // 42px
                font-size:.268519rem;  // 29px
                text-align:center;
                color:#fff;
                position:absolute;
                left:0;
                top:.166667rem;  // 18px
                // padding:.12963rem 0 0 0;  // 14px
                // top:.12963rem;  // 14px
                // transform:translateY(-50%);
                // top:50%;
                // background-color:#0f0;
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
            <template v-if="map.length > 0">
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
                            <div class="one__cbtn" @click.stop.prevent="getCoupon($event,index)"
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
                default: ()=> ({url: require("../../assets/coupon_bg03.png")}),
                $rule: {
                    name: '优惠劵背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            margin: {
                type: Number,
                default: 16,
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
				default: '可进入游戏点击熊猫图标查看优惠券详情，或点击我的奖品查看',
				$rule: {
					name: '成功领取弹窗提示内容'
				}
			},
            gotTipsTitle: {
				type: String,
				default: '今日已领完',
				// $rule: {
				// 	name: '已领取弹窗提示标题'
				// }
			},
            gotTipsContent: {
				type: String,
				default: '请领取其他优惠劵或明日再来领取',
				// $rule: {
				// 	name: '已领取弹窗提示内容'
				// }
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
                // if(!this.initialStatus){
                for(i = 0; i < allcoupons.length; i++){
                    allcoupons[i].btnTxt = this.ungetText
                    allcoupons[i].couponStatus = 0
                    allcoupons[i].chance = 0
                }
                // }
                /*
                if(allcoupons.length > 0 && !this.zippo_status && this.zippo_times && this.zippo_times.length > 0){
                    allcoupons = this.initCouponsTime(allcoupons)
                }
                this.map = []
                for(i = 0; i < allcoupons.length; i++){
                    this.map.push({})
                    for(j in allcoupons[i]){
                        this.map[i][j] = allcoupons[i][j]
                    }
                }*/
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
                let hasLogin = !!NativeInterface.getUserId(),
                    self = this;
                this.map = this.coupons
                
                //this.freeTask
                if(hasLogin) {
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
                    // 执行免费赠送任务
                    this.postFreeTask()
                }
            },
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
                // if(this.updateTimesStatus == ids) {
                //     return
                // }
                // this.updateTimesStatus = ids
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
                    // if(this.getTimesStatus == o){
                    //     return
                    // }
                    // this.getTimesStatus = o
                    _self.$getLotteryTimes(o,(response) => {
                        let already = []
                        _self.zippo_times = response.zippoTimes
                        if(!_self.map || _self.map.length == 0){
                            _self.zippo_status = false
                            return
                        }
                        _self.initCouponsTime()
                        // _self.$forceUpdate();
                    })
                }
            },
            getCouponFromSpecies(){
                let list = util.findAwardsByType(Enum.AWARD_TYPE.COUPON) || [],
                    zippo_ids = this.zippo_ids,
                    base = new Base64(),
                    type = '',
                    arr = [],
                    ids = [],
                    i = 0
                for(i = 0; i < list.length; i++){
                    type = list[i].couponType || JSON.parse(base.decode(list[i].extValue1)).couponType
                    switch(type){
                        case 'global':
                            list[i].zippoId = zippo_ids && zippo_ids[i] ? zippo_ids[i].id : -1
                            list[i].total = 100
                            list[i].use = 0
                            arr.push(list[i])
                            ids.push(list[i].id)
                            break
                    }
                }
                this.getAwardsUsage(ids,status)
                return arr
            },
            getAwardsUsage(ids,status = false){
                if(ids.length > 0){
                    this.$store.dispatch('fetchAwardsUse', {context: this, params: {award_ids: ids.join(",")}})
                    .then(val => {
                        this.usage = val
                        let i = 0,j = 0,
                            already = []
                        for(i = 0; i < this.map.length; i++){
                            for(j = 0; j < this.usage.length; j++){
                                if(already.indexOf(this.map[i].id) == -1 && this.map[i].id == this.usage[j].id){
                                    this.map[i].total = this.usage[j].total
                                    this.map[i].use = this.usage[j].use
                                    if(this.map[i].use == this.map[i].total){
                                        this.map[i].btnTxt = this.cleanText
                                        this.map[i].couponStatus = -1
                                    }
                                    already.push(this.map[i].id)
                                }
                            }
                        }
                        this.txt = Date.now()
                    })
                    .catch((err) => {
                        this.$handleReqErr(err);
                    })
                }
            },
            initCouponsTime(){
                let self = this,
                    map = this.map,
                    temp = {},
                    i = 0,
                    j = 0
                this.zippo_times.forEach((zippoTime) => {
                    let a = 0
                    let already = []
                    self.times_obj[zippoTime.zippo_id] = zippoTime.times
                    for(a = 0; a < map.length; a++){
                        if(already.indexOf(map[a].zippoId) == -1 && zippoTime.zippo_id == map[a].zippoId) {
                            map[a].times = zippoTime.times;
                            if(zippoTime.times > 0){
                                if(map[a].use == map[a].total){
                                    map[a].btnTxt = this.cleanText
                                    map[a].couponStatus = -1
                                }else if(map[a].btnTxt == this.ungetText){
                                    map[a].btnTxt = this.ungetText
                                    map[a].couponStatus = 0
                                }else{
                                    map[a].btnTxt = this.gotText
                                    map[a].couponStatus = 1
                                    map[a].chance = 0
                                    // map[a].btnTxt = this.cleanText
                                    // map[a].couponStatus = -1
                                }
                            }else {
                                map[a].btnTxt = this.gotText
                                map[a].couponStatus = 1
                            }
                            already.push(map[a].zippoId)
                            break
                        }
                    }
                })
                this.zippo_status = true
                this.initialStatus = true
                this.txt = Date.now()
                // this.postFreeTask()
                // return map
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
                    // logger.makeActivityLog('activity_notimes_num');
                    return;
                }else if(this.map[index].couponStatus == -1){   // 已抢光
                    this.map[index].btnTxt = this.cleanText;
                    this.map[index].couponStatus = -1;
                    this.txt = Date.now()
                    return
                }
                logger.makeActivityLog('activity_coupon_get', {'name': this.map[index].name});//点击领取优惠券埋点
                this.$store.dispatch('doLottery', {context: this, params: {zippo_ids:  this.map[index].zippoId}}).then((value) => {
                    this.showLotteryResult(value[0],index);
                    this.getTimesStatus = ''
                    this.getTimes()
                    logger.makeActivityLog('activity_coupon_got', {'name': this.map[index].name});
                    // util.setStorage('zippo_' + this.map[index].zippoId, 1);
                    // util.setStorage('last_get_time_'+this.map[index].zippoId,Date.now())
                }).catch((err) => {
                    logger.makeActivityLog('activity_coupon_failed', {'name': this.map[index].name});
                    if(err.code && (err.code == 120040 || err.code == 120038)) {
                        // logger.makeActivityLog('activity_coupon_ntimes');//领取优惠券多次领取
                        // util.setStorage('zippo_' + this.map[index].zippoId, 1);
                        this.map[index].btnTxt = this.gotText;
                        this.map[index].couponStatus = 1;
                        this.txt = this.map[index].zippoId+'_'+this.gotText+'_'+Date.now()
                        DialogBuilder.of(this).alert(this.gotTipsTitle,this.gotTipsContent);
                    }else if(err.code && err.code == 120036){
                        this.map[index].btnTxt = this.cleanText;
                        this.map[index].couponStatus = -1;
                        
                        this.txt = this.map[index].zippoId+'_'+this.cleanText+'_'+Date.now()
                        DialogBuilder.of(this).alert(this.cleanTipsTitle, this.cleanTipsContent)
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
                    DialogBuilder.of(this).confirm(this.gotSuccessTitle, this.gotSuccessContent,function() {
                        this.dismiss();
                    }, function() {
                        this.dismiss();
                        if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 6008000) {
                            NativeInterface.toMyCoupon();
                        } else {
                            NativeInterface.toHome('feed');
                        }
                    }, {
                        confirmBtnTxt: '确定',
                        cancelBtnTxt: '查看',
                        bgColor:this.dialogBgColor,   // 对话框背景颜色
                        fontColor:this.detailColor,  // 对话框字体颜色
                        confirmBtnBgColor:this.dialogBtnFontColor, // 确定按钮背景颜色
                        confirmBtnFontColor:this.detailColor,  // 确定按钮字体颜色
                    })
                    // DialogBuilder.of(this).alert('领取成功！', util.createComponentProxy(_LotteryResult, {'award': {'icon': ''}}), function() {
                    //     this.dismiss();
                    // }, {confirmBtnTxt: '确定'})
                } else {  // 领取到别的视为当前已抢光
                    // logger.makeActivityLog('activity_coupon_snatched');//领取到的是积分的埋点
                    // DialogBuilder.of(this).alert('出错了！刷新看看～');
                    // util.setStorage('zippo_' + this.map[index].zippoId, -1);
                    this.map[index].btnTxt = this.cleanText;
                    this.map[index].couponStatus = -1;
                    this.map[index].use = this.map[index].total
                    
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