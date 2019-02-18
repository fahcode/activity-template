import DialogBuilder from './DialogBuilder';
import LotteryResult from '../littles/LotteryResult.vue';
import NativeInterface from '../common/nativeinterface';
import logger from '../common/logger';
import Enum from '../common/enum';
import util from '../common/util';
import Vue from 'vue';
import LotteryTipsMixin from './LotteryTipsMixin';
import BigTitle from '../littles/BigTitle.vue';
export default {
    mixins: [LotteryTipsMixin],
    data() {
      return {
        playing: false,
        startTime: -1,
        zippos: [],
        times: 0
      }
    },
    mounted() {
        this.zippos = util.getZippos();
        NativeInterface.on(Enum.INTERFACE_EVENT.UPDATE_TIMES, ()=> {
           this.$updateLotteryTimes();
        });
        NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
    },
    beforeDestroy() {
        NativeInterface.removeAllListeners(Enum.INTERFACE_EVENT.UPDATE_TIMES);
    },
    methods: {
        $updateLotteryTimes() {
            let p = new Promise((resolve, rejected)=> {
                if(NativeInterface.getUserId()) {
                    let zippoIds = this.zippos.map((item)=> item.id);
                    this.$store.dispatch('fetchLotteryTimes', {context: this, params: {zippo_ids: zippoIds.join(',')}}).then(()=> {
                        resolve();
                    }).catch((err) => {
                        //logger.makeActivityLog('activity_prizebadtime_juge');//获取次数接口异常埋点
                        if(err.code == 401) {
                            logger.makeActivityLog('activity_signbad_juge', {message: err.message});//登录账号异常
                        }
                        this.$handleReqErr(err);
                        rejected(err);
                    });
                } else {
                    this.$store.commit('setLotteryTimes', 0);
                }
            });
            return p;
        },
        $doLottery() {
            //logger.makeActivityLog('activity_prize_draw');
            if(!this.$checkVersion()) return;
            if(!NativeInterface.getUserId()) {
                DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
                    this.dismiss();
                    NativeInterface.login();
                }, {confirmBtnTxt: '登录'});
                logger.makeActivityLog('activity_not_login');//未登录人数
                return;
            }
            if(this.times > 0) {
                this.playing = true;
                this.startTime = Date.now();
                let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                //logger.makeActivityLog('activity_prize_complete');
                logger.makeActivityLog('activity_prize_get');
                this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                    if(process.env.NODE_ENV == 'production') {
                        let award = util.findAwardById(value[0].award_id);
                            award.award_id = award.id || award.award_id;
                        this.showLotteryResult(award);
                    } else {
                        this.showLotteryResult(value[0]);
                    }
                    logger.makeActivityLog('activity_prize_got');
                }).catch((err) => {
                    this.playing = false;
                    logger.makeActivityLog('activity_prize_failed');//调抽奖接口返回错误、异常埋点
                    this.$handleReqErr(err);
                });
            } else {
                //logger.makeActivityLog('activity_notimes_num');//无抽奖次数
                //logger.makeActivityLog('activity_prize_failed');
                if(util.canGetMore()) {
                    DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips);
                } else {
                    DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips);
                }
            }
        },
        $showLotteryResult(award) {
            let self = this;
            NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
            if(!award) {
                // NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                this.reset();
                return;
            }
            if(award.type == Enum.AWARD_TYPE.INTEGRATION || award.type == Enum.AWARD_TYPE.NOTHING) {
                DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, {
                    onDismiss: ()=> this.reset(),
                    confirmBtnTxt: '确定'
                });               
            } else if(award.type == Enum.AWARD_TYPE.COUPON) {
                let _LotteryResult = Vue.extend(LotteryResult);
                let _BigTitle = Vue.extend(BigTitle);
                DialogBuilder.of(this).alert(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': award}), {
                    onDismiss: ()=> this.reset()
                });
            } else if (award.type == Enum.AWARD_TYPE.RATEOFFLOW || award.type == Enum.AWARD_TYPE.TELCHARGE || award.type == Enum.AWARD_TYPE.VIRTUAL) {
                let _LotteryResult = Vue.extend(LotteryResult);
                let _BigTitle = Vue.extend(BigTitle);
                DialogBuilder.of(this).alert(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': award}), function() {
                    this.dismiss();
                    self.$doMotion({type: Enum.MOTION.PHONE, params: [award.type, award.id]});
                }, {
                    confirmBtnTxt: '去领取',
                    onDismiss: ()=> this.reset()
                });
            } else if(award.type == Enum.AWARD_TYPE.MATERIAL || award.type == Enum.AWARD_TYPE.MATERIAL100){
                let _LotteryResult = Vue.extend(LotteryResult);
                let _BigTitle = Vue.extend(BigTitle);
                DialogBuilder.of(this).confirm(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': award}), function() {
                    this.dismiss();
                    self.$doMotion({type: Enum.MOTION.ADDRESS, params: []});
                }, {
                    confirmBtnTxt: '填写地址', 
                    cancelBtnTxt: '稍后填写',
                    onDismiss: ()=> this.reset()
                });
            }else {
                DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, {
                    onDismiss: ()=> this.reset(),
                    confirmBtnTxt: '确定'
                });      
            }
            // NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
        },
        /* user implement */
        reset() {
            this.playing = false;
        },
        /* user implement */
        showLotteryResult(award) {
            this.$showLotteryResult(award);
        }
    },

    watch: {
        '$store.state.zippoTimes': {
            handler: function(newVal) {
                let times = 0;
                let str = this.zippos.map((zippo) => zippo.id).join(',');          
                newVal.forEach(function(zippoTime) {
                    if(process.env.NODE_ENV == 'production') {
                        if(str.indexOf(String(zippoTime.zippo_id)) >= 0) {
                            times += zippoTime.times;
                        }
                    } else {
                        times += zippoTime.times;
                    }
                });
                this.$store.commit('setLotteryTimes', times);
                this.times = times;
                // if(times > 0) {
                //     logger.makeActivityLog('activity_prize_num');
                // };
            },
            immediate: true
        }
    }
}