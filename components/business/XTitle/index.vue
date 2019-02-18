<style lang="less">
    @import '../../style/import';
	.xtitle { 
        margin: 0.555556rem 0;
        padding: 0 0.444444rem;
        height: 0.944444rem;
        line-height: 1;

        &__inner {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding-left: 0.2rem;
            border-left: 0.111111rem solid #fff;
        }

        &__placeholder {
            flex: 1;
        }

        &__main {
            font-size: 0.444444rem;
            font-weight: 500;
        }

        &__sub {
            font-size: 0.333333rem;
            opacity: .7;
        }
	}
</style>
<template>
	<div class="xtitle" v-bind:style="{height: subTitle ? '' : '0.425926rem'}">
        <div class="xtitle__inner" v-bind:style="{'border-left-color': borderColor}">
            <h2 class="xtitle__main" v-bind:style="{'color': mainTitleColor}" ><span style="display:inline-block;" v-bind:style="{'vertical-align': subTitle ? 'middle' : '-12.5%'}">{{ mainTitle }}</span></h2>
            <div class="xtitle__placeholder" v-if="subTitle"></div>
            <p class="xtitle__sub" v-if="subTitle" v-bind:style="{'color': subTitleColor}"><span style="display:inline-block;vertical-align:bottom">{{ subTitle }}</span></p>
        </div>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin'
	export default {
		name: 'Title',
        mixins: [BusinessCompMixin],
        props: {
            mainTitle: {
                type: String,
                default: '主标题',
                $rule: {
                    name: '主标题'
                }
            },
            subTitle: {
                type: String,
                default: '副标题',
                $rule: {
                    name: '副标题'
                }
            },
            mainTitleColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '主标题文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            subTitleColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '副标题文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            borderColor: {
                type: String,
                default: '#fff',
                $rule: {
                    name: '左边边栏颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        }
	}
</script>