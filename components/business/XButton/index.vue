<style lang="less">
@import '../../style/mixin';
.xbtn {
    display: inline-block;
    /*padding: 5px 10px;*/
    font-size: 0.444444rem;

    width: auto;

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
	<button class="xbtn" @click="handleClick" v-bind:class="{'xbtn--round': shape == 'ROUND', 'xbtn--oval': shape == 'OVAL', 'xbtn--bold': bold}"
        v-bind:style="{'color': fontColor, 'font-size': fontSize, 'background-image': realBgImg}">{{ txt }}</button>
</template>
<script>
    import Enum from 'common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin'
	export default {
		name: 'XButton',
        mixins: [BusinessCompMixin],
        props: {
            txt: {
                type: String,
                default: '按钮',
                $rule: { 
                    name: '按钮文本' 
                }
            },
            shape: {
                type: String,
                default: 'SQUARE',
                $rule: {
                    name: '形状',
                    options: [
                        {
                            value: 'SQUARE',
                            label: '方块'
                        }, {
                            value: 'ROUND',
                            label: '圆形'
                        }, {
                            value: 'OVAL',
                            label: '腰圆'
                        }
                    ],
                    clazz: Enum.CLAZZ.SELECT
                }
            },
            fontColor: {
                type: String,
                default: '#000000',
                $rule: {
                    name: '字体颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            bold: {
                type: Boolean,
                default: false,
                $rule: {
                    name: '加粗'
                }
            },
            // bgImg2: {
            //     type: Array,
            //     default: ()=> [],
            //     $rule: {
            //         name: '背景图片2',
            //         clazz: Enum.CLAZZ.IMAGE_ARRAY
            //     }
            // },
            fontSize: {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                }
            },
            /*
            date: {
                type: String,
                $rule: {
                    name: '日期',
                    clazz: Enum.CLAZZ.DATE
                }
            },
            dateTime: {
                type: String,
                $rule: {
                    name: '时间',
                    clazz: Enum.CLAZZ.DATE_TIME
                }
            },
            richText: {
                type: String,
                $rule: {
                    name: '富文本',
                    clazz: Enum.CLAZZ.RITCH_TEXT
                }
            },
            */
            motion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.OPEN_URL, params: ['http://www.baidu.com']}
                },
                $rule: {
                    name: '点击响应动作',
                    clazz: Enum.CLAZZ.MOTION
            
                }
            }
            // ,
            // muitlCheckbox: {
            //     type:String,
            //     default:'1',
            //     $rule: {
            //     name:'复选',
            //     options:[
            //       {value:'1',name:'fir'},{value:'2',name:'secd'}
            //     ],
            //     clazz: Enum.CLAZZ.CHECKBOX
            //     }
            // }
        },
        computed: {
            realBgImg() {
                return this.$bgImg && this.$bgImg.url ? `url(${this.$bgImg.url})` : '';
            }
        },
        methods: {
            handleClick() {
                this.$doMotion(this.motion);
            }
        }
	}
</script>