<style lang="less">
    .subscribe-title {
        display: flex;
        font-weight: 500;
        font-size: 0.388889rem;
        padding: 0 0.444444rem 0.277778rem;

        &__left {
            flex: 3;
            text-align: left;
        }

        &__right {
            flex: 1;
            text-align: right;
        }

        &__icon {
            width: 0.444444rem;
            height: 0.444444rem;
            margin-right: 0.148148rem;
            vertical-align: -12.5%;
        }
    }
</style>
<template>
    <div class="subscribe-title">
        <div class="subscribe-title__left" :style="{color: color}"><img class="subscribe-title__icon" :src="titleIcon.url"><span>{{title}}</span></div>
        <div class="subscribe-title__right">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    import Enum from '../../common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default {
        name: 'SubscribeTitle',
        mixins: [BusinessCompMixin],
        props: {
            titleIcon: {
                type: Object,
                default: ()=> ({url: require("../../assets/gift.png")}),
                $rule: {
                    name: '标题ICON',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            title: {
                type: String,
                default: '标题',
                $rule: {
                    name: '标题'
                }
            },
            color: {
                type: String,
                default: '#000',
                $rule: {
                    name: '标题文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        }
    }
</script>

