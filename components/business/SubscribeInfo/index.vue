<style lang="less">
    .subscribe-info {
        margin: 0.444444rem auto 0.555556rem
    }
    .none-margin {
        margin:0 auto;
    }
</style>
<template>
    <div class="subscribe-info" :class="{'none-margin':!hasTitle}">
        <SubscribeTitle v-if="hasTitle"></SubscribeTitle>
        <GameInfo></GameInfo>
    </div>
</template>
<script>
    import SubscribeTitle from '../SubscribeTitle/index.vue';
    import GameInfo from './GameInfo.vue';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default{
        name: 'SubscribeInfo',
        mixins: [BusinessCompMixin],
        components: {
            GameInfo,
            SubscribeTitle
        },
        props:{
            hasTitle:{
                type: Boolean,
                default: true,
                $rule: {
                    name: '是否显示标题'
                }
            }
        }
    }
</script>