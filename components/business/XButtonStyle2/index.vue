<style lang="less">
@import '../../style/mixin';
.app {
    padding-bottom: 1.333333rem;  // 144px
}
.xbutton-style2 {
    position: fixed;
    z-index: 999;
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
}
.xbtn2 {
    width: 100%;
    height: 1.333333rem;  // 144px
    display: block;
    /*padding: 5px 10px;*/
    font-size: 0.444444rem;
    justify-content: center;
    align-items: center;
    background-color:#272cb1;
    background-position:center center;
    background-size:100% 100%;
    background-repeat:no-repeat;
    &--round {
        border-radius: 50%;
    }

    &--oval {
        border-radius: 999px;
    }

    &--bold {
       font-weight: 500; 
    }
}
</style>
<template>
    <div class="xbutton-style2">
        <button class="xbtn2" @click="handleClick" v-bind:class="{
                'xbtn2--round': shape == 'ROUND', 
                'xbtn2--oval': shape == 'OVAL', 
                'xbtn2--bold': bold
            }"
            v-bind:style="{
                'color': fontColor, 
                'font-size': fontSize, 
                'background-image': realBgImg,
                'background-color': btnBg
            }">{{ txt }}</button>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    import XButton from '../XButton/index.vue'
	export default {
		name: 'XButton2',
        extends:XButton,
        props:{
            btnBg: {
                type: String,
                default: '#272cb1',
                $rule: {
                    name: '按钮背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
        },
        computed: {
            
        },
        methods: {
            
        }
	}
</script>