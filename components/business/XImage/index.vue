<style lang="less">
    .ximage {
        width: 100%;
        min-height: 24px;
    }
</style>
<template>
    <img class="ximage" v-bind:style="{'height': $toRem(img.height), 'width': $toRem(img.width)}" :src="realImg"></img>
</template>
<script>
    import Enum from 'common/enum';
    import util from 'common/util';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    export default{
        name: 'XImage',
        mixins: [BusinessCompMixin],
        props: {
            img: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            }
        },
        computed: {
            realImg() {
                return util.getImgUrl(this.img);
            }
        }
    }
</script>