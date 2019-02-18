<style lang="less">
    .xmore {
        position: relative;
        margin: 0 auto;
        padding: 0;
        background-color: #e5e5e5;
        min-height: 16px;
        line-height: 1.571;

        &__ellipsis {
            display: block;
            margin: 0 .44444rem;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            transition: height .3s ease;
            white-space: pre-wrap;
            .ql-size-small {
                font-size: .75em;
            }
            .ql-size-large {
                font-size: 1.5em;
            }
        }
        &__more {
            display: none;
            text-align: center;
            margin-top: 0.111111rem;
        }
        #test-raw-height {
            display: block;
            margin: 0 .44444rem;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 999;
            -webkit-box-orient: vertical;
            -webkit-transition: height .3s ease;
            transition: height .3s ease;
            white-space: pre-wrap;
        }
    }
</style>
<template>
    <div class="xmore" :style="{'font-size': $toRem(parseInt(fontSize) * 3), 'color': fontColor}">
        <div ref="desc" class="xmore__ellipsis" :style="{'-webkit-line-clamp': lineNumber, height: clientHeight}" 
            v-html="text"></div>
        <div ref="more" class="xmore__more" :style="{'color': moreTextColor}" @click="showDescDetail">{{ moreText }}</div>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import Logger from 'common/logger';
    import BusinessCompMixin from 'base/BusinessCompMixin.js';
    export default {
        name: 'XMore',
        mixins: [BusinessCompMixin],
        props: {
            richText: {
                type: Object,
                default: ()=> {
                    return { content: '请输入内容', resMap: [] };
                },
                $rule: {
                    name: '富文本',
                    clazz: Enum.CLAZZ.RITCH_TEXT
                }
            },
            fontColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            fontSize: {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                }
            },
            lineNumber: {
                type: Number,
                default: 3,
                $rule: {
                    name: '显示行数(999显示全部)',
                }
            },
            moreText: {
                type: String,
                default: '展示详情',
                $rule: {
                    name: '“展示详情”文本'
                }
            },
            moreTextColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '“更多”文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        data() {
            return {
                rawHeight: 0,
                showHeight: 0
            }
        },
        computed: {
            text() {
                return this.$toRitchText(this.richText).replace(/<p>/g, '').replace(/<\/p>/g, '<br>');
            },
            clientHeight() {
                let height = this.lineNumber === 999 ? this.rawHeight : this.showHeight;
                return height ? height + 'px' : 'auto';
            }
        },
        watch: {
            lineNumber() {
                this.showHeight = 0;
            },
            fontSize() {
                this.$nextTick(()=> {
                    this.tryShowMore();
                });   
            },
            richText() {
                this.$nextTick(()=> {
                    this.tryShowMore();
                });
            }
        },
        mounted() {
            this.tryShowMore();
        },
        methods: {
            tryShowMore() {
                if(this.lineNumber === 999) return;
                let div = document.getElementById('test-raw-height');
                let showDiv = null;
                if(!div) {
                    div = document.createElement('DIV');
                    div.id = 'test-raw-height';
                    div.setAttribute('style', "position:absolute; z-index:-1; top:0; left:0; opacity:0; pointer-events: none");
                    this.$refs.desc.appendChild(div);
                }
                div.innerHTML = this.text;
                this.rawHeight = div.clientHeight;
                if(process.env.NODE_ENV != 'production') {
                    showDiv = document.getElementById('test-show-height');
                    if(!showDiv) {
                        showDiv = document.createElement('DIV');
                        showDiv.id = 'test-show-height';
                        showDiv.classList.add("xmore__ellipsis");
                        showDiv.setAttribute('style', `position:absolute; z-index:-1; top:0; left:0; width: 100%; opacity:0; pointer-events: none;margin:0;transition:none;-webkit-line-clamp:${this.lineNumber};`);
                        this.$refs.desc.appendChild(showDiv);
                    }
                    showDiv.innerHTML = this.text;
                    this.showHeight = showDiv.clientHeight;
                } else {
                   this.showHeight = this.$refs.desc.clientHeight; 
                }
                
                if(process.env.NODE_ENV == 'production') {
                    if(div) {
                        this.$refs.desc.removeChild(div); 
                    }
                    if(showDiv) {
                        this.$refs.desc.removeChild(showDiv);
                    }
                }
                if(this.rawHeight > this.showHeight) {
                    this.$refs.more.style.display = 'block';
                } else {
                    this.$refs.more.style.display = 'none';
                }
            },
            showDescDetail() {
                this.lineNumber = 999;
                this.$refs.more.style.display = 'none';
            },
        }
    }
</script>