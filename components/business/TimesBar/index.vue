<style lang="less">
    .times-bar {
        height:.574074rem;  // 62px
        position: absolute;
        right: 2%;
        top:.666667rem;  // 72px
        font-size: 0.388889rem;  // 42px
        border-radius: 999px;
        text-align: center;
        z-index: 999;
        padding: .092593rem .12963rem;  // 10px 14px
        line-height: 1;

        &__inner {
            line-height:1;
            // vertical-align: 1px;
            padding-top:.092593rem;  // 10px
            position:relative;
            left:50%;
            top:50%;
            transform:translate(-50%,-50%);
            display: block;
        }

        &__count {
            color: inherit;
            font-weight: 700;
        }
    }
    .times-bar--full {
        top:.888889rem;  // 96px
    }
</style>
<template>
    <div class="times-bar" v-bind:style="{'background-color': bgColor, 'color': fontColor, 'top': topPos}" :class="{'times-bar--full':fullStatus}">
        <!--<span>--><span class="times-bar__inner">抽奖次数：<span class="times-bar__count" v-bind:style="{'color': timesFontColor}">{{ $store.state.lotteryTimes }}</span></span><!--</span>-->
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import NativeInterface from 'common/nativeinterface';
    export default {
        name: 'TimesBar',
        props: {
            bgColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            fontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '字体颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            timesFontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '次数字体颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        computed: {
            topPos() {
                let titleType = this.$store.state.components['activity-title'].titleType;
                let top = '.666667rem';  // 72px  //'0.45rem';
                if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 7000000 || process.env.NODE_ENV != 'production') {
                    if(titleType == 1) {
                        top = '1.422222rem';
                    }
                }
                return top;
            },
            fullStatus(){
                if(process.env.NODE_ENV != 'production') {
                    return true
                }
                if(NativeInterface.isFringeDevice() || NativeInterface.isFullScreenDevice()){
                    return true
                }
                return false
            },
        }
    }
</script>