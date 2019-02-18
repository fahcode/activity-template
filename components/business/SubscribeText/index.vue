<style lang="less">
    .subscribe-text {
        margin: 0.444444rem auto 0.555556rem
    }
    
</style>
<template>
    <div class="subscribe-text">
        <SubscribeTitle></SubscribeTitle>
        <XMore :fontSize="'14'"></XMore>
    </div>
</template>
<script>
    import SubscribeTitle from '../SubscribeTitle/index.vue';
    import XMore from '../XMore/index.vue';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default{
        name: 'SubscribeText',
        mixins: [BusinessCompMixin],
        components: {
            XMore,
            SubscribeTitle
        }
    }
</script>
