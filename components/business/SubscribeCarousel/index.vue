<style lang="less">
    .subscribe-carousel {
        margin: 0.444444rem auto 0.555556rem
    }
</style>
<template>
    <div class="subscribe-carousel">
        <SubscribeTitle></SubscribeTitle>
        <Carousel></Carousel>
    </div>
</template>
<script>
    import SubscribeTitle from '../SubscribeTitle/index.vue';
    import Carousel from '../Carousel/index.vue';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default{
        name: 'SubscribeCarousel',
        mixins: [BusinessCompMixin],
        components: {
            Carousel,
            SubscribeTitle
        }
    }
</script>