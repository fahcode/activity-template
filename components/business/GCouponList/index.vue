<style lang="less">
    .gcoupon-list {
        width:100%;
        padding:.185185rem 0 0 0;  // 20px 0
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
            width:10.018519rem;  //  (509+22)*2+20=1082px
            padding:0 0 0 .185185rem;  // 0 0 0 20px
            margin:0 auto;
            box-sizing:content-box;
        }
        &__one {
            width:4.712963rem;  // 509px
            height:1.944444rem;  // 210px
            margin:0 .203704rem .185185rem 0;  // 0 22px 20px 0
            float:left;
            background-repeat:no-repeat;
            background-position:center center;
            background-size:100% 100%;
            background-color:transparent;
        }
        .one__money {
            width:1.546296rem;  // 167px
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
                margin:0 0 0 -.037037rem;  // -4px
                letter-spacing:-.037037rem;  // -2px
                font-size:.833333rem;  // 90px
                font-weight: bold;
                font-family:"Flyme";
            }
            .numz {
                font-size:.648148rem;  // 70
            }
            .num3 {
                font-size:.648148rem;  // 70px
            }
            .num4 {
                font-size:.537037rem;  // 58px
            }
        }
        .one__info {
            width:3.166667rem;  // 342px
            height:1.944444rem;  // 210px
            float:left;
            padding:0 .092593rem;  // 0 10px
        }
        .one__title {
            width:100%;
            line-height:.472222rem;   // 51px
            padding:.185185rem 0 0 0;  // 20px 0 0 0;
            font-size:.351852rem;  // 38px
            text-align:center;
            color:#333;
            white-space:nowrap;
            overflow:hidden;
            text-overflow: ellipsis;
            font-weight:bold;
        }
        .one__detail {
            width:100%;
            height:.555556rem;  // 60px
            line-height:.277778rem;  // 30px
            padding:0 .231481rem;  // 0 25px
            font-size:.222222rem;  // 24px
            color:#666;
            text-align:center;
            white-space: normal;
        }
        .one__btn {
            width:1.842593rem;  // 199px
            height:.601852rem;  // 65px
            padding:.074074rem 0 0 0; // 8px 0 0 0
            margin:0 auto;
            position:relative;
            .one__img {
                width:1.842593rem;
                position:absolute;
                left:0;
                top:.074074rem;  // 8px
            }
            .btn__text {
                width:1.842593rem;
                line-height:.416667rem; // 45px
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
    <div class="gcoupon-list">
        <div class="gcoupon-list__inner">
            <div class="synch-render">{{txt}}</div>
            <template v-if="map.length > 0">
                <ul class="gcoupon-list__list clearfix">
                    <li class="gcoupon-list__one clearfix" 
                        v-for ="(one,index) in map"
                        :style="{
                            backgroundImage:'url('+bg.url+')'
                        }">
                        <div class="one__money"
                            :style="{
                                color:moneyColor
                            }"><span class="cn" v-if="one.value < 10000">￥</span><span class="num" :class="{
                                'num4':one.value >= 1000 && one.value <= 10000,
                                'num3':one.value >= 100 && one.value <= 1000,
                                'numz':one.value >= 10000 && getCouponValue(one.value)
                            }">{{setCouponValue(one.value)}}</span><span class="cn cn-after" v-if="one.value >= 10000">折</span></div>
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
    import GCoupon from '../GCoupon/index.vue'
    export default {
        name: 'GCoupon-list',
        extends:GCoupon,
        props: {
            bg: {
                type: Object,
                default: ()=> ({url: require("../../assets/coupon_list_bg-02.png")}),
                $rule: {
                    name: '优惠劵背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            }
        },
        methods:{
            getCouponValue(value){
                if(value >= 10000){
                    var val = (value / 10000).toFixed(1).split('.')
                    if(val[1] != '0'){
                        return true
                    }
                }
                return false
            },
        },
    }
</script>