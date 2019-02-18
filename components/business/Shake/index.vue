<style lang="less">
    .shake {
        position: relative;
        width: 6.62037rem;
        height: 6.62037rem;
        margin: 0 auto;
        &__bg {
            display: block;
            width: 100%;
            height: 100%;
        }
        &__hand {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%; 
            &--animate {
                -webkit-animation: lottery-play linear .2s infinite;
            }
        }
        &__arc {
            position: absolute;
            width: 0.453704rem;
            height: 0.490741rem;
            animation: shake-arc .3s ease-out infinite;
            &--top {
                top: 17%;
                right: 26%;
                transform-origin: 0 100%;
            }
            &--down {
                bottom: 14%;
                left: 27%;
                transform-origin: 100% 0;
            }
        }

    }
    @keyframes shake-arc {
        0% {-webkit-transform: rotateZ(0);}
        25% {-webkit-transform: rotateZ(12deg);}
        50% {-webkit-transform: rotateZ(0);}
        75% {-webkit-transform: rotateZ(-12deg);}
        100% {-webkit-transform: rotateZ(0);}
    }
    @-webkit-keyframes lottery-play {
        0% {-webkit-transform: rotateZ(0);}
        25% {-webkit-transform: rotateZ(12deg);}
        50% {-webkit-transform: rotateZ(0);}
        75% {-webkit-transform: rotateZ(-12deg);}
        100% {-webkit-transform: rotateZ(0);}
    }
</style>
<template>
    <div class="shake" ref="shake" v-bind:style="{'background':bgColor}">
        <img class="shake__bg" :src="shakeBgImg.url">
        <img class="shake__hand" :class="{'shake__hand--animate': playing }" ref="img" id="shake" :src="shakeMainImg.url" @click="shake">
        <img class="shake__arc shake__arc--top"  :src="shakeTopimg.url">
        <img class="shake__arc shake__arc--down"  :src="shakeDownimg.url">
        <audio v-show="false" :src="musicSource" preload="auto" ref="audio"></audio>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import NativeInterface from 'common/nativeinterface';
    import DialogBuilder from 'base/DialogBuilder';
    import LotteryMixin from 'base/LotteryMixin';
    import logger from 'common/logger';
    import util from 'common/util';

    export default {
        name: 'shake',
        data(){
            return {
                canLottery: true,
                //musicSource: require("../../assets/shake.mp3"),
                musicSource: "",
                music: null
            }
        },
        mixins: [LotteryMixin],
        props: {
            bgColor: {
                type: String,
                default: '#ececec',
                $rule: {
                    name: '背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            shakeBgImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '摇一摇背景图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            shakeDownimg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '摇一摇左下角动图',
                    clazz: Enum.CLAZZ.IMAGE
                }  
            },
            shakeMainImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '摇一摇主图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            shakeTopimg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '摇一摇右上角动图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            }
            // shakeBackMusic: {
            //     type: Object,
            //     default: ()=> ({}),
            //     $rule: {
            //         name: '摇一摇音乐',
            //         clazz: Enum.CLAZZ.AUDIO
            //     }
            // }
        },
        mounted() {
            
            // let self = this;
            // let hackAudio = function() {
            //     //self.$refs.audio.play();
            //     //self.$refs.audio.src = require("../../assets/shake.mp3");
            //     //self.$refs.audio.load();
            //     document.documentElement.removeEventListener("touchstart", hackAudio, false)
            // }
            // document.documentElement.addEventListener("touchstart", hackAudio, false);
            
            // let shakeThreshold = window._shakeThreshold || 2300; // 定义一个摇动的阈值
            // let lastUpdate = 0; // 记录上一次摇动的时间
            // // 定义x、y、z记录三个轴的数据以及上一次触发的数据
            // let x = 0;
            // let y = 0;
            // let z = 0;
            // let lastX = 0;
            // let lastY = 0;
            // let lastZ = 0; 

            // window.addEventListener('devicemotion', function (eventData) {
            //     if(self.playing || !self.canLottery) {
            //         return;
            //     };
            //     let acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
            //     let curTime = Number(new Date());
            //     if ((curTime - lastUpdate) > 100) {

            //         let diffTime = curTime - lastUpdate;
            //         lastUpdate = curTime;

            //         x = acceleration.x;
            //         y = acceleration.y;
            //         z = acceleration.z;

            //         let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
            //         // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
            //         if (speed > shakeThreshold) {
            //             self.canLottery = false;
            //             let devicePixelRatio = window.devicePixelRatio;
            //             document.getElementById("app").scrollTop = self.$refs.shake.offsetTop;
            //             self.doLottery();
            //         };
            //         lastX = x;
            //         lastY = y;
            //         lastZ = z;
            //     }   
            // }, false);
            // this.$refs.audio.load();
            this.init();
        },
        methods: {
            init() {
                let self = this;
                let hackAudio = function() {
                    self.$refs.audio.play();
                    self.$refs.audio.src = require("../../assets/shake.mp3");
                    self.$refs.audio.load();
                    document.documentElement.removeEventListener("touchstart", hackAudio, false)
                }
                document.documentElement.addEventListener("touchstart", hackAudio, false);
                
                let shakeThreshold = window._shakeThreshold || 2300; // 定义一个摇动的阈值
                let lastUpdate = 0; // 记录上一次摇动的时间
                // 定义x、y、z记录三个轴的数据以及上一次触发的数据
                let x = 0;
                let y = 0;
                let z = 0;
                let lastX = 0;
                let lastY = 0;
                let lastZ = 0; 

                window.addEventListener('devicemotion', function (eventData) {
                    if(self.playing || !self.canLottery) {
                        return;
                    };
                    let acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
                    let curTime = Number(new Date());
                    if ((curTime - lastUpdate) > 100) {

                        let diffTime = curTime - lastUpdate;
                        lastUpdate = curTime;

                        x = acceleration.x;
                        y = acceleration.y;
                        z = acceleration.z;

                        let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
                        // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
                        if (speed > shakeThreshold) {
                            self.canLottery = false;
                            let devicePixelRatio = window.devicePixelRatio;
                            document.getElementById("app").scrollTop = self.$refs.shake.offsetTop;
                            self.doLottery();
                        };
                        lastX = x;
                        lastY = y;
                        lastZ = z;
                    }   
                }, false);
                this.$refs.audio.load();
            },
            doLottery() {
                //logger.makeActivityLog('activity_prize_draw');
                if(!this.$checkVersion()) return;
                if(!NativeInterface.getUserId()) {
                    DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录', onDismiss: ()=> this.reset()});
                    logger.makeActivityLog('activity_not_login');
                    return;
                };
                if(this.times > 0) {
                    this.playing = true;
                    this.$refs.audio.play(); //播放音乐
                    this.startTime = Date.now();
                    let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                    //logger.makeActivityLog('activity_prize_complete');
                    logger.makeActivityLog('activity_prize_get');
                    this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        this.showLotteryResult(value[0]);
                        logger.makeActivityLog('activity_prize_got');
                    }).catch((err) => {
                        this.playing = false;
                        //logger.makeActivityLog('activity_prizebad_juge');//调抽奖接口返回错误、异常埋点
                        logger.makeActivityLog('activity_prize_failed');//调抽奖接口返回错误、异常埋点
                        this.$handleReqErr(err);
                    });
                } else {
                    //logger.makeActivityLog('activity_notimes_num');
                    if(util.canGetMore()) {
                        DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips, {
                            onDismiss: ()=> this.reset()
                        });
                    } else {
                        DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips, {
                            onDismiss: ()=> this.reset()
                        });
                    }
                };
            },
            shake() {
                //不支持重力感应时点击抽奖
                if(window.DeviceMotionEvent) {
                    this.doLottery();
                }
            },
            showLotteryResult(award) {
                let self = this;
                let awardMap = window.__ACTIVITY_CONFIG__.__AWARDS__;
                if(award.award_id != 0) { //中奖
                    award = util.findAwardById(award.award_id);
                    if(!award) {
                        this.playing = false;
                        DialogBuilder.of(self).alert("出错了！刷新看看～", {
                            onDismiss: () => this.reset()
                        });
                        return;
                    };
                } else { //谢谢参与
                   let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
                   if(thanks.length) {
                       award = util.randomFormArr(thanks);
                   } else {
                       self.playing = false;
                       DialogBuilder.of(this).alert('出错了！刷新看看~~~', {
                        onDismiss: ()=>this.reset()
                       });
                   }; 
                }
                setTimeout(function() {
                    self.playing = false; //停止动画
                    self.$refs.audio.load(); //重新加载音乐
                    self.$showLotteryResult(award);
                }, 1600);
            },
            reset() {
                let self = this;
                setTimeout(function() {
                    self.canLottery = true;
                }, 200);
            }
        }
    }
</script>