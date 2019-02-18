<style lang="less">
    .rule-text {
        margin: 0.555556rem 0;
        padding: 0 .5rem;
        font-size: 0.444rem;
        text-align: center;

        &--bold {
            font-weight: 500;
        }

        &__divider {
            padding: 0 1% ;
            line-height: 22px;
            height: 15px;
            display: inline-block;
            overflow: hidden
        }
        i {
            display: inline-block;
            height: 0.222222rem;
            width: 2px;
            margin: 0px 0.62963rem;
            vertical-align: 0.03rem;
        }
        span:last-child i{display: none;}
    }
    .rule-text-4{
        padding: 0 .4rem;
        font-size: 0.36rem;

        i {
            margin: 0px 0.36rem;//60
        }
    }
    .rule-text-5{
        padding: 0 .277778rem;  // 30px
        font-size: .296296rem;  // 32px
        i {
            margin: 0px .277778rem;  // 30px
        }
    }
</style>
<template>
    <div class="rule-text" v-bind:style="{color: fontColor, 'font-size': fontSize || ''}" v-bind:class="[showClass, {'rule-text--bold': bold}]">
        <span v-if="!!_showList[0]">
            <a @click="myAward">我的奖品</a>
            <i v-bind:style="{'background-color':fontColor}"></i>
        </span>
        <span v-if="!!_showList[1]">
            <a @click="myAddress">我的地址</a>
            <i v-bind:style="{'background-color':fontColor}"></i>
        </span>
        <span v-if="!!_showList[2]">
            <a @click="ruleTxt">活动说明</a>
            <i v-bind:style="{'background-color':fontColor}"></i>
        </span>
        <span v-if="!!_showList[3]">
            <a @click="winnerList">中奖名单</a>
            <i v-bind:style="{'background-color':fontColor}"></i>
        </span>
        <span v-if="!!_showList[4]">
            <a @click="sendIssues">问题反馈</a>
            <i v-bind:style="{'background-color':fontColor}"></i>
        </span>
    </div> 
</template>
<script>
    import Enum from 'common/enum';
    import DialogBuilder from 'base/DialogBuilder';
    import BusinessCompMixin from 'base/BusinessCompMixin'
    export default{
        name: 'RuleText',
        mixins: [BusinessCompMixin],
        props: {
            showList:{
                type: Array,
                default: ()=> {
                    return ['我的奖品', '活动说明', '问题反馈'];
                },
                $rule: {
                    name: '显示的状态',
                    clazz: Enum.CLAZZ.CHECKBOX,
                    options: [{value: 1, name: '我的奖品'}, {value: 2, name: '活动说明'}, {value: 3, name: '中奖名单'}, {value: 4, name: '问题反馈'}, {value: 5, name: '我的地址'}]
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
            fontSize: {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                }
            },
            myAwardMotion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.MY_AWARD, params: []}
                },
                $rule: {
                    name: '点击（我的奖品）响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            },
            myAddressMotion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.ADDRESS, params: []}
                },
                $rule: {
                    name: '点击（我的地址）响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            },
            ruleTextMotion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.RULE_TXT, params: []}
                },
                $rule: {
                    name: '点击（活动说明）响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            },
            winnerListMotion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.WINNER_LIST, params: []}
                },
                $rule: {
                    name: '点击（中奖名单）响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            },
            sendIssuesMotion: {
                type: Object,
                default: ()=> {
                    return {type: Enum.MOTION.SEND_ISSUES, params: []}
                },
                $rule: {
                    name: '点击（问题反馈）响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            }
        },
        data(){
            return {
                orderArr: ['我的奖品', '我的地址', '活动说明', '中奖名单', '问题反馈'],
                clickStatus: false
            }
        },
        created(){
        },
        computed: {
            showClass() {
                var len = 0;
                for (var i = 0; i < this.showList.length; i++) {
                    if (!!this.showList[i]) {
                        len++;
                    }
                };
                return "rule-text-" + len;
            },
            _showList() {
                return this.orderArr.map((item, index)=>{
                        return this.showList.indexOf(item)>-1
                    }); // [...Array(len).values()];
            }
        },
        methods: {
            myAward() {
                if(!this.clickStatus){
                    this.clickStatus = true;
                    this.$doMotion(this.myAwardMotion);
                    setTimeout(() => {
                        this.clickStatus = false;
                    },500);
                }
            },
            myAddress(){
                if(!this.clickStatus){
                    this.clickStatus = true;
                    this.$doMotion(this.myAddressMotion);
                    setTimeout(() => {
                        this.clickStatus = false;
                    },500);
                }
            },
            ruleTxt() {
                this.$doMotion(this.ruleTextMotion);
            },
            winnerList() {
                this.$doMotion(this.winnerListMotion);
            },
            sendIssues() {
                this.$doMotion(this.sendIssuesMotion);
            }
        }
    }
</script>