<style lang="less">
    .pre-text {
        text-align: justify;
        white-space: pre-wrap;
        word-break: break-all;
        padding: 0 0 .148148rem 0;  // 0 0 16px 0
    }
</style>
<template>
    <div class="pre-text" v-html="content"></div>
</template>
<script>
    import Vue from 'vue';
    export default {
        name: 'PreText',
        props: {
            content: {
                type: String,
                default: ''
            }
        }
    }
</script>