<style lang="less">
.carousel {
    width: 100%;
    padding: 0.2rem 0;

    &__inner {
        white-space: nowrap;
        overflow-x: auto;
        padding: 0 0.4444rem;

        :last-child {
            margin-right: 0 !important;
        }  
    }

    &__item {
        display: inline-block;
        img {
            display: block;
        }
    }
}
</style>
<template>
    <div class="carousel">
        <ul class="carousel__inner">
            <li class="carousel__item" v-for="img in imgs" v-bind:style="{'margin-right': $toRem(margin)}">
                <img v-bind:src="img.url" v-bind:style="{width: $toRem(img.width), height: $toRem(img.height)}">
            </li>
        </ul>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    export default{
        name: 'Carousel',
        mixins: [BusinessCompMixin],
        props: {
            imgs: {
                type: Array,
                default: ()=> ([]),
                $rule: {
                    name: '图片',
                    clazz: Enum.CLAZZ.IMAGE_ARRAY
                }
              },
            margin: {
                type: Number,
                default: 24,
                $rule: {
                    name: '图片间距(单位px)'
                }
            }
        }
        // computed: {
        //   margin() {
        //     if(this.imgs.length) {
        //       let margin = (this.$psdWidth - this.imgs[0].width * (Number(this.displayCount) - 0.5) - this.$toPx(0.44444)) / 4;
        //       margin = margin < 0 ? 0 : margin;
        //       return this.$toRem(margin);
        //     } else {
        //       return 0;
        //     }
        //   }
        // }
    }
</script>