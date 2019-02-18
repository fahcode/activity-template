<style lang="less">
    .result {
        margin-top: -0.3rem;
    }
    .winning-petal {
        position: absolute;
        z-index: 1;
        width: 124%;
        height: 3.592593rem;
        top: -1.777778rem;
        left: -12%;
        background-image: url('../assets/petal.png');
        background-repeat: no-repeat;
        background-size: 100% auto;
    }
    .winning-tips {
        font-size: 0.611111rem;
        margin: 5px 0;
        font-weight: 500;
    }
    .winning-name {
        font-size: 0.444444rem;
        font-weight: 500;
    }
    .winning-name span {
        color:#e5391e;
    }
    .winning-award {
        width: 2.77rem;
        margin: 0.333333rem auto;
    }
    .tips {
        opacity: .5;
        text-align: center;
        width: 104%;
        margin-left: -0.17rem;
    }
    .dialog__body {
        max-height: 6.5rem!important;
    }
</style>
<template>
    <div class="result">
        <div class="winning-petal"></div>
        <p class="winning-name">获得 <span :style="{color: awardNameColor}">{{award.name}}</span></p>
        <img class="winning-award" :src="award.icon">
        <p class="tips" v-if="tips" v-html="tips" v-bind:style="{color: tipsColor}"></p>
    </div>
</template>
<script>
    import util from '../common/util';
    import Enum from '../common/enum';
    // import LotteryTipsMixin from 'base/LotteryTipsMixin';
    export default {
        name: 'LotteryResult',
        props: {
            award: {
                type: Object
            },
            awardNameColor: {
                type: String,
                default: '#fba013',
                $rule: {
                    name: '奖品名字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            tipsColor: {
                type: String,
                default: '#fba013',
                $rule: {
                    name: '提示文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        computed: {
            tips() {
                let tips = ''
                switch(this.award.type) {
                    case Enum.AWARD_TYPE.MATERIAL:
                        tips = this.$lang.$$winMaterialTips;
                        break;
                    case Enum.AWARD_TYPE.TELCHARGE:
                        tips = this.$lang.$$winTelchargeTips;
                        break;
                    case Enum.AWARD_TYPE.RATEOFFLOW:
                        tips = this.$lang.$$winRateofflowTips;
                        break;
                    case Enum.AWARD_TYPE.COUPON:
                        tips = this.$lang.$$winCouponTips;
                        break;
                    case Enum.AWARD_TYPE.PROP:
                        tips = this.$lang.$$winPropTips;
                        break;
                    case Enum.AWARD_TYPE.GIFT:
                        tips = this.$lang.$$winGiftTips;
                        break;
                    case Enum.AWARD_TYPE.VIRTUAL:
                        tips = this.$lang.$$winVirtualTips;
                        break;
                }
                return tips
            }
        }
    }
</script>