<style lang="less">
    .award-title {
        font-size: 0.611111rem;
    }
</style>
<template>
    <div>
        <span class="award-title" v-html="title"></span>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: '&nbsp;&nbsp;恭喜中奖！'
            }
        }
    }
</script>