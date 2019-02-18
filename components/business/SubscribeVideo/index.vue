<style lang="less">
    .subscribe-video {
        margin: 0.444444rem auto 0.555556rem
    }
</style>
<template>
    <div class="subscribe-video">
        <SubscribeTitle></SubscribeTitle>
        <XVideo></XVideo>
    </div>
</template>
<script>
    import SubscribeTitle from '../SubscribeTitle/index.vue';
    import XVideo from '../XVideo/index.vue';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default{
        name: 'SubscribeVideo',
        mixins: [BusinessCompMixin],
        components: {
            XVideo,
            SubscribeTitle
        }
    }
</script>