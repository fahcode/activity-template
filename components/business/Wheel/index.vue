<style lang="less">
    .wheel {
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 100% auto;
        background-repeat: repeat-y;
        background: #ececec;
        &__inner {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            min-width: 200px;
        }

        &__bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;

            &--playing {
                animation: rotation infinite .6s linear;
            }

            &--stopping {
                transition: all ease-out 3s;
            }
        }

        &__guide-img {
            position: relative;
            z-index: 11;
        }
   }
</style>
<template>
    <div class="wheel">
        <div class="wheel__inner" v-bind:style="{width: $toRem(wheelImg.width), height: $toRem(wheelImg.height)}">
            <div ref="wheel" class="wheel__bg" v-bind:class="{'wheel__bg--playing': playing}" 
          v-bind:style="{'background-image': realWheelImg}"></div>
            <XImage class="wheel__guide-img" :img="wheelGuideImg" @click.native="$doLottery"></XImage>
        </div>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import util from 'common/util';
    import DialogBuilder from 'base/DialogBuilder';
    import XImage from '../XImage/index.vue';
    import NativeInterface from 'common/nativeinterface';
    import LotteryMixin from 'base/LotteryMixin';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    import Vue from 'vue';
    export default{
        name: 'Wheel',
        mixins: [LotteryMixin, BusinessCompMixin],
        props: {
            wheelImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '转盘图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            wheelGuideImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '转盘指针',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            awardLength: {
                type: Number,
                default: 0,
                $rule: {
                    name: '奖品个数（默认0取所有奖品）',
                    clazz: Enum.CLAZZ.Number
                }
            },
            thanksPosition: {
                type: Number,
                default: -1,
                $rule: {
                    name: '谢谢参与位置（0：第一，-1：默认）',
                    clazz: Enum.CLAZZ.Number
                }
            },
        },
        data() {
            return {
                angle: -1
            }
        },
        computed: {
            realWheelImg() {
                return util.getImgCSSVal(this.wheelImg);
            },
            realWheelGuideImg() {
                return util.getImgUrl(this.wheelGuideImg);
            }
        },
        methods: {
            showLotteryResult(result) {
                let self = this;
                if(result) {
                    let diff = Date.now() - this.startTime;
                    let waitTime = diff > 2000 ? 600 - diff % 600 : 1800 - diff;
                    this.$delay(waitTime).then(() => {
                        let award = null;
                        if(result.award_id != 0) { 
                            award = util.findAwardById(result.award_id);
                            if(process.env.NODE_ENV != 'production' && award) { //for test
                                award.type = result.award_type;
                            }
                            if(!award) {
                                this.playing = false;
                                DialogBuilder.of(this).alert('出错了！刷新看看～');
                                return;
                            }
                        } else { //谢谢参与
                            let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
                            if(thanks.length) {
                                award = util.randomFormArr(thanks);
                            } else {
                                this.playing = false;
                                DialogBuilder.of(this).alert('出错了！刷新看看～');
                                return;
                            }
                        }
                        let alen = this.awardLength || window.__ACTIVITY_CONFIG__.__AWARDS__.length;
                        if((award.type == Enum.AWARD_TYPE.INTEGRATION ||　award.type == Enum.AWARD_TYPE.NOTHING) && this.thanksPosition > -1){
                            award.idx = this.thanksPosition;
                        }
                        let angle = 1080 - parseInt(360 / alen * award.idx);
                        this.$refs.wheel.classList.remove('wheel__bg--playing');
                        this.$refs.wheel.classList.add('wheel__bg--stopping');
                        this.$refs.wheel.offsetHeight;
                        this.$refs.wheel.style['webkitTransform'] = `rotateZ(${angle}deg)`;
                        this.$nextTick(()=> {
                            this.$delay(3200).then(() => {
                                this.$showLotteryResult(award);
                                // if(result[0].award_id == 0) {
                                //     DialogBuilder.of(this).confirm('囧，手气不好没中奖', '更多抽奖机会，请关注魅族游戏中心活动，祝游戏愉快！', function() {
                                //         this.dismiss();
                                //         self.reset();
                                //     }, function() {
                                //         this.dismiss();
                                //         self.reset();
                                //     }, {confirmBtnTxt: '打开游戏'});
                                    
                                // } else if(award.type == Enum.AWARD_TYPE.COUPON) {
                                //   let _LotteryResult = Vue.extend(LotteryResult);
                                //   DialogBuilder.of(this).alert('恭喜中奖啦！', util.createComponentProxy(_LotteryResult, {'award': award}), function() {
                                //     this.dismiss();
                                //     self.reset();
                                //   });
                                // } else if(award.type == Enum.AWARD_TYPE.RATEOFFLOW || award.type == Enum.AWARD_TYPE.TELCHARGE) {
                                //   let _LotteryResult = Vue.extend(LotteryResult);
                                //   DialogBuilder.of(this).alert('恭喜中奖啦！', util.createComponentProxy(_LotteryResult, {'award': award}), function() {
                                //     this.dismiss();
                                //     //self.$doMotion({type: Enum.MOTION.ADDRESS, params: []});
                                //     this.$doMotion({type: Enum.MOTION.PHONE, params: [award.type]});
                                //     self.reset();
                                //   }, {confirmBtnTxt: '去领取'});
                                // }  else {
                                //   let _LotteryResult = Vue.extend(LotteryResult);
                                //   DialogBuilder.of(this).confirm('恭喜中奖啦！', util.createComponentProxy(_LotteryResult, {'award': award}), function() {
                                //     this.dismiss();
                                //     self.$doMotion({type: Enum.MOTION.ADDRESS, params: []});
                                //     self.reset();
                                //   }, function() {
                                //     this.dismiss();
                                //     self.reset();
                                //   }, {confirmBtnTxt: '填写地址', cancelBtnTxt: '稍后填写'});
                                // }
                                // NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                            });
                        });
                    });
                }
            },

            reset() {
                this.playing = false;
                this.$refs.wheel.classList.remove('wheel__bg--playing');
                this.$refs.wheel.classList.remove('wheel__bg--stopping');
                this.$refs.wheel.style['webkitTransform'] = '';
            }
        },
        components: {
            XImage
        }
      }
</script>