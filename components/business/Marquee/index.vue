<style lang="less">
    .marquee {
        position: relative;
        margin: 0 auto;
        min-height: 3rem;
        &__light {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            animation: flash .8s infinite;
            transform: translate3d(0,0,0);
        }
        &__bgimg {
            display: block;
            width: 100%;
            height: 100%;
        }
        &__awardimg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        &__btn {
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            //background: url('') no-repeat;
            background-size: contain;
            top: 50%;
        }
        img {
            display: block;
        }
    }
    #selector-canvas{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
    }
    #selector {
        display: none;
    }
</style>
<template>
    <div id="marquee" ref="marquee" class="marquee" :style="{'width':$toRem(marqueeBgimg.width), 'height': $toRem(marqueeBgimg.height)}">
        <img  class="marquee__bgimg" :src="marqueeBgimg.url"/>
        <div v-if="lightImg1" class="marquee__light" :style="{'background-image': lightImg1}"></div>
        <img id="selector" ref="selector" :src="selector.url" />
        <canvas ref="selectorCanvas" id="selector-canvas" width="0" height="0"></canvas>
        <img v-bind:style="{'height':$toRem(marqueeAwardimg.height),'width':$toRem(marqueeAwardimg.width)}" class="marquee__awardimg" :src="marqueeAwardimg.url"/>
        <a class="marquee__btn" v-bind:style="{'background-image': btnImgVal,'height':$toRem(btnImg.height),'width':$toRem(btnImg.width)}" @click="startLottery"></a>
    </div>
</template>
<script>
    import Enum from 'common/enum'
    import util from 'common/util'
    import NativeInterface from 'common/nativeinterface'
    import DialogBuilder from 'base/DialogBuilder'
    import LotteryResult from 'littles/LotteryResult.vue'
    import BigTitle from 'littles/BigTitle.vue'
    //import LotteryMixin from 'base/LotteryMixin';
    import LotteryTipsMixin from 'base/LotteryTipsMixin'
    import BusinessCompMixin from 'base/BusinessCompMixin'
    import logger from 'common/logger'
    import Vue from 'vue';
    export default {
        name: 'marQuee',
        mixins: [BusinessCompMixin, LotteryTipsMixin],
        data() {
          return {
            canvasInterval: 100,
            award: null,
            animationTimer: 1,
            startTime: 1,
            playing: false,
            zippos: [],
            times: 0,
            deviationX: 0,
            deviationY: 0,
            // moveX: 0,
            // moveY: 0,
          }
        },
        props: {
            marqueeBgimg: {
                type: Object,
                default: ()=> ({'width':800,'height':200}),
                $rule: {
                    name: '跑马灯背景图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            marqueeAwardimg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '奖品图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            btnImgDis: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '不能抽奖了的按钮',
                    clazz: Enum.CLAZZ.IMAGE
                } 
            },
            btnImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '点击抽奖按钮',
                    clazz: Enum.CLAZZ.IMAGE
                } 
            },
            selector: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '跑动背景图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            light1: {
                type: Object,
                default: () => ({}),
                $rule: {
                    name: '边框闪烁图1',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            light2: {
                type: Object,
                default: () => ({}),
                $rule: {
                    name: '边框闪烁图2',
                    clazz: Enum.CLAZZ.IMAGE
                }
            }
        },
        mounted() {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '@-webkit-keyframes flash {0% {background-image: '+this.lightImg1+';}50% {background-image: '+this.lightImg2+';}100% {background-image: '+this.lightImg1+';}}';
            document.getElementsByTagName('head')[0].appendChild(style);
            
            this.zippos = util.getZippos();
            NativeInterface.on(Enum.INTERFACE_EVENT.UPDATE_TIMES, ()=> {
                if(NativeInterface.getUserId()) {
                    let zippoIds = this.zippos.map((item)=> item.id);
                    this.$store.dispatch('fetchLotteryTimes', {context: this, params: {zippo_ids: zippoIds.join(',')}})
                    .catch((err) => {
                        logger.makeActivityLog('activity_prizebadtime_juge');//获取次数接口异常埋点
                        if(err.code == 401) {
                            logger.makeActivityLog('activity_signbad_juge', {message: err.message});//登录账号异常
                        }
                        this.$handleReqErr(err);
                    });
                } else {
                    this.$store.commit('setLotteryTimes', 0);
                }
            });
            this.init();
        },
        beforeDestroy() {
            NativeInterface.removeAllListeners(Enum.INTERFACE_EVENT.UPDATE_TIMES);
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
                    if(times > 0) {
                        logger.makeActivityLog("activity_prize_num");
                    }
                },
                immediate: true
            }
        },
        computed: {
            btnImgVal() {
                // let timesd = 0;
                // let str = this.zippos.map((zippo) => zippo.id).join(',');          
                // this.$store.state.zippoTimes.forEach(function(zippoTime) {
                //     if(process.env.NODE_ENV == 'production') {
                //         if(str.indexOf(String(zippoTime.zippo_id)) >= 0) {
                //             timesd += zippoTime.times;
                //         }
                //     } else {
                //         timesd += zippoTime.times;
                //     }
                // });
                // this.times = timesd;
                let img = this.$store.state.lotteryTimes == 0 ? this.btnImgDis : this.btnImg
                return util.getImgCSSVal(img)
            },
            lightImg1() {
                return this.$getImgCSSVal(this.light1);
            },
            lightImg2() {
                return this.$getImgCSSVal(this.light2);
            },
            marqueeWidth() {
                return this.$refs.marquee.clientWidth;
            },
            marqueeHeight() {
                return this.$refs.marquee.clientHeight;
            }
        },
        methods: {
            init() {
                //初始化跑动图
                //this.$nextTick(() => {
                    //初始化偏移x、y
                    this.deviationX = (this.marqueeBgimg.width - this.marqueeAwardimg.width) / 2; //求背景图 跟 奖品图间隔
                    this.deviationY = (this.marqueeBgimg.height - this.marqueeAwardimg.height) / 2; //求背景图 跟 奖品图间隔

                  
                    let selectorCanvas = this.$refs.selectorCanvas;
                    let marqueeWidth = selectorCanvas.width = this.marqueeWidth;
                    let marqueeHeight = selectorCanvas.height = this.marqueeHeight;
                    let context = selectorCanvas.getContext('2d');
                    // let deviationXWidth = this.deviationX / this.marqueeBgimg.width * marqueeWidth; //间隔实际宽度
                    // let deviationXHeight = this.deviationY / this.marqueeBgimg.height * marqueeHeight; //间隔实际高度
                    // let selectorWidth = this.selector.width / this.marqueeBgimg.width * marqueeWidth; //实际宽度
                    // let selectorHeight = this.selector.height / this.marqueeBgimg.height * marqueeHeight; //实际高度

                    context.fillStyle = 'rgba(255, 255, 255, 0)';
                    context.clearRect(0, 0, marqueeWidth, marqueeHeight);
                    //context.drawImage(this.$refs.selector, deviationXWidth, deviationXHeight, selectorWidth, selectorHeight);
                //})
                NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES); 
            },
            startLottery() {
                logger.makeActivityLog('activity_prize_draw');
                let self = this;
                //判断登录态
                if(!NativeInterface.getUserId()) {
                    DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录'});
                    logger.makeActivityLog('activity_not_login');
                    return;
                }
                if(this.playing) return;
                if(!this.$checkVersion()) return;
                
                if(this.times > 0) {
                    this.playing = true;   
                    let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');

                    logger.makeActivityLog('activity_prize_complete');

                    this.startTime = Date.now();
                    this.doAnimate();

                    this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        let diff = Date.now() - self.startTime;
                        let waitTime = diff > 2000 ? 600 - diff % 600 : 1800 - diff;
                        self.$delay(waitTime).then(() => {
                            self.canvasInterval = 300;
                            if(value[0].award_id == 0) {
                                self.award = util.randomFormArr(util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION));
                            } else {
                                self.award = util.findAwardById(value[0].award_id);
                            }
                        });
                    }).catch((err) => {
                        logger.makeActivityLog('activity_prizebad_juge');
                        DialogBuilder.of(this).alert('出错了！刷新看看～<2003>');
                        self.reset();
                    });
                } else {
                    logger.makeActivityLog('activity_notimes_num');
                    this.playing = false;
                    if(util.canGetMore()) {
					    DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips);
					} else {
					    DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips);
					}
                }
            },
            doAnimate() {
                //跑马灯位移x,y
                let moveX = (this.marqueeAwardimg.width - this.selector.width * 3) / 2 + this.selector.width;
                let moveY = (this.marqueeAwardimg.height - this.selector.height * 3) / 2 + this.selector.height;
                let selectorCanvas = this.$refs.selectorCanvas;
                let marqueeWidth = selectorCanvas.width = this.marqueeWidth;
                let marqueeHeight = selectorCanvas.height = this.marqueeHeight;
                let context = selectorCanvas.getContext('2d');
                let deviationXWidth = this.deviationX / this.marqueeBgimg.width * marqueeWidth; //间隔实际宽度
                let deviationXHeight = this.deviationY / this.marqueeBgimg.height * marqueeHeight; //间隔实际高度
                let selectorWidth = this.selector.width / this.marqueeBgimg.width * marqueeWidth; //实际宽度
                let selectorHeight = this.selector.height / this.marqueeBgimg.height * marqueeHeight; //实际高度


                let u = moveX / this.marqueeBgimg.width * marqueeWidth;
                let v = moveY / this.marqueeBgimg.height * marqueeHeight;
                let posMap = {
                    0: {
                        x: 0 * u + deviationXWidth,
                        y: 0 * v + deviationXHeight
                    },
                    1: {
                        x: 1 * u + deviationXWidth,
                        y: 0 * v + deviationXHeight
                    },
                    2: {
                        x: 2 * u + deviationXWidth,
                        y: 0 * v + deviationXHeight
                    },
                    3: {
                        x: 2 * u + deviationXWidth,
                        y: 1 * v + deviationXHeight
                    },
                    4: {
                        x: 2 * u + deviationXWidth,
                        y: 2 * v + deviationXHeight
                    },
                    5: {
                        x: 1 * u + deviationXWidth,
                        y: 2 * v + deviationXHeight
                    },
                    6: {
                        x: 0 * u + deviationXWidth,
                        y: 2 * v + deviationXHeight
                    },
                    7: {
                        x: 0 * u + deviationXWidth,
                        y: 1 * v + deviationXHeight
                    }
                };
                let curPos = 0;
                let pos = 0;
                let lastTick = 0;
                let animate = (elapse)=> {
                    if(this.award && curPos === this.award.idx) {
                        setTimeout(()=> {
                            window.cancelAnimationFrame(this.animationTimer);
                            this.showLotteryResult(this.award);
                        }, 500);
                    } else {
                        this.animationTimer = window.requestAnimationFrame(animate);
                        if(elapse - lastTick > this.canvasInterval) {
                            lastTick = elapse;
                            curPos = pos++ % 8;
                            context.clearRect(0, 0, marqueeWidth, marqueeHeight);
                            //console.log(this.$refs.selector);
                            context.drawImage(this.$refs.selector, posMap[curPos].x, posMap[curPos].y, selectorWidth, selectorHeight);
                        }
                    }

                }
                this.animationTimer = window.requestAnimationFrame(animate);
            },
            showLotteryResult(awarded) {
                //this.reset();
                let self = this;
                //let awarded = util.findAwardById(result[0].award_id);
                if(!awarded){
                    DialogBuilder.of(this).alert('出错了！刷新看看～<2002>');
                    self.reset();
                    return;
                }
                if(awarded.type == Enum.AWARD_TYPE.INTEGRATION) {
                    DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, function() {
                        this.dismiss();
                        self.reset();
                    });
                } else if(awarded.type == Enum.AWARD_TYPE.COUPON) {
                    let _LotteryResult = Vue.extend(LotteryResult);
                    let _BigTitle = Vue.extend(BigTitle);
                    DialogBuilder.of(this).alert(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': awarded}), function() {
                        this.dismiss();
                        self.reset();
                    });
                } else if(awarded.type == Enum.AWARD_TYPE.RATEOFFLOW || awarded.type == Enum.AWARD_TYPE.TELCHARGE || awarded.type == Enum.AWARD_TYPE.VIRTUAL) {
                    let _LotteryResult = Vue.extend(LotteryResult);
                    let _BigTitle = Vue.extend(BigTitle);
                    DialogBuilder.of(this).alert(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': awarded}), function() {
                        this.dismiss();
                        this.$doMotion({type: Enum.MOTION.PHONE, params: [awarded.type, awarded.id]});
                        self.reset();
                    }, {confirmBtnTxt: '去领取'});
                } else if(awarded.type == Enum.AWARD_TYPE.MATERIAL || awarded.type == Enum.AWARD_TYPE.MATERIAL100){
                    let _LotteryResult = Vue.extend(LotteryResult);
                    let _BigTitle = Vue.extend(BigTitle);
                    DialogBuilder.of(this).confirm(util.createComponentProxy(_BigTitle, {title: this.$lang.$$winTitle}), util.createComponentProxy(_LotteryResult, {'award': awarded}), function() {
                        this.dismiss();
                        self.$doMotion({type: Enum.MOTION.ADDRESS, params: []});
                        self.reset();
                    }, function() {
                        this.dismiss();
                        self.reset();
                    }, {confirmBtnTxt: '填写地址', cancelBtnTxt: '稍后填写'});
                }else {
                    DialogBuilder.of(this).alert(this.$lang.$$loseTitle, this.$lang.$$loseTips, function() {
                        this.dismiss();
                        self.reset();
                    });
                }
            },
            reset() {
                this.init();
                this.playing = false;
                this.canvasInterval = 100;
                this.award = null;
                window.cancelAnimationFrame(this.animationTimer);
            }
        }
    }
</script>