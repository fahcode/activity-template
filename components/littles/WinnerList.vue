<style lang="less">
    @import "../style/import";
    .winner-list {
        &__item {
            height: 1.083333rem;
            line-height: 1.12rem;
        }

        &__name, &__award {
            display: inline-block;
            .one-line();
        }

        &__name {
            text-align: left;
            width: 50%;
        }

        &__award {
            text-align: right;
            width: 40%;
            margin-left: 10%;
        }

        &__divider {
            transform: scaleY(0.5) translateZ(0);
            height: 2px;
        }
        &__empty {
            text-align: center;
            img {
                width:4.833333rem;
                height:4.833333rem
            }
            p {
                opacity: .5;
            }
        }
    }
</style>
<template>
    <div>
        <ul v-if="infos.length" class="winner-list">
            <template v-for="(info, index) in infos">
                <li class="winner-list__item">
                    <span class="winner-list__name">{{ info.nickname }}</span><span class="winner-list__award">{{ info.award_name }}</span>
                </li>
                <li v-if="infos.length > 1 ? true: false" class="winner-list__divider" v-bind:style="{'background-color': dividerColor}"></li>
            </template>
        </ul>
        <div v-else class="winner-list__empty">
            <img style="width:4.833333rem;height:4.833333rem" src="../assets/empty.png">
            <p>奖品还没有被抽走，赶紧参与活动吧！</p>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Enum from '../common/enum';
    export default {
        name: 'WinnerList',
        props: {
            infos: {},
            dividerColor: {
                type: String,
                default: 'rgba(0,0,0,0.1)',
                $rule: {
                    name: '分割线颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        }
    }
</script>