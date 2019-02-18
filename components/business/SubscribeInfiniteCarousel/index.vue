<style lang="less">
    .subscribe-inifinite-carousel {
        margin: 0.444444rem auto 0.555556rem
    }
</style>
<template>
    <div class="subscribe-inifinite-carousel">
        <SubscribeTitle></SubscribeTitle>
        <InfiniteCarousel></InfiniteCarousel>
    </div>
</template>
<script>
    import SubscribeTitle from '../SubscribeTitle/index.vue';
    import InfiniteCarousel from '../InfiniteCarousel/index.vue';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    export default{
        name: 'SubcribeInfiniteCarousel',
        mixins: [BusinessCompMixin],
        components: {
            InfiniteCarousel,
            SubscribeTitle
        }
    }
</script>