<style lang="less">
    .banner {
        width: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        min-height: 48px;
    }
</style>
<template>
    <div class="banner" v-bind:style="{'background-image': realImg,'height': $toRem($bgImg.height)}"></div>
</template>
<script>
    import Enum from 'common/enum';
    import util from 'common/util';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    export default{
        name: 'Banner',
        mixins: [BusinessCompMixin],
        props: {
            $bgImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            }
        },
        computed: {
            realImg() {
                return util.getImgCSSVal(this.$bgImg);
            }
        }
    }
</script>