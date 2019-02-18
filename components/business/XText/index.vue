<style lang="less">
    .ql-editor {
        height: auto;
        padding: 0;
        background-color: #e5e5e5;
        min-height: 10px;
        padding: 0 .44444rem;
    }
    /*.text {
        word-break: break-all;
        word-wrap: break-word;
        background-color: #e5e5e5;
        min-height: 10px;
    }
    .text.single {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    */
</style>
<template>
    <div class="ql-editor" v-bind:style="{'text-align':location}" v-html="$toRitchText(ritchText)"></div>
</template>
<script>
    import Enum from '../../common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    export default {
        name: 'XText',
        mixins: [BusinessCompMixin],
        props: {
            ritchText: {
                type: String,
                default: '请输入文本',
                $rule: {
                    name: '富文本',
                    clazz: Enum.CLAZZ.RITCH_TEXT
                }
            },
            location: {
                type: String,
                default: 'left',
                $rule: {
                    name: '位置',
                    options: [
                        {
                            value: 'left',
                            label: '居左'
                        },
                        {
                            value: 'center',
                            label: '居中'
                        },
                        {
                           value: 'right',
                           label: '居右'
                        }
                    ],
                    clazz: Enum.CLAZZ.SELECT
                }
            }
		}
    }
</script>