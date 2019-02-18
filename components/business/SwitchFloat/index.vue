<style lang="less">
    a{-webkit-tap-highlight-color:rgba(255,255,255,0);}
    .clearfix:after{
        content: "020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
    .switchFloat, .sf {
        position: fixed;
        width: 1.481481rem;  // 160
        height: 5.842593rem;    // 631
        top: 2.62963rem;    // 284
        z-index: 1000;
        background-color: transparent !important;
        &_box{
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            padding-top: 1px; // 解决margin-top问题
        }
        &_content{
            width: 100%;
            height: 100%;
        }
        &_ul{
            position: relative;
            width: 100%;
            height: 100%;
        }
        &_li{
            position: relative;
            width: 100%;
            height: 1.481481rem;    // 160
            line-height: 1.481481rem;    // 160
            background-size: 100% 100%;
            font-size: .259259rem;  // 28
            color: #fff;
            text-align: center;
        }
        &_link{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 2;
        }
    }
</style>
<template>
    <div ref="switchFloat" class="switchFloat sf" id="switchFloat" :style="floatStyle" v-if="fatLists.length>0">
        <div class="sf_box" :style="boxStyle">
            <div class="sf_content" :style="contentStyle">
                <ul class="sf_ul">
                    <li v-for="(it, ii) in fatLists" class="sf_li" :class="{'active': it.active}" :style="liStyle(ii, it.active)">
                        <span class="sf_text">{{it.name}}</span>
                        <a href="javascript:void(0)" @click="fatMotion(it, ii)" class="sf_link"></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import Enum from 'common/enum'
    import util from 'common/util'
    import NativeInterface from 'common/nativeinterface'
    import DialogBuilder from 'base/DialogBuilder'
    import BusinessCompMixin from 'base/BusinessCompMixin'
    import logger from 'common/logger'
    import Vue from 'vue';
    import util2 from 'common/util2';

    export default {
        name: 'switchFloat',
        mixins: [BusinessCompMixin],
        props:{
            'boxBg': {
                type: Object,
                default: ()=> ({'width':160,'height':631, url: require('../../assets/sf_bg.png')}),
                $rule: {
                    name: '背景图',
                    clazz: Enum.CLAZZ.IMAGE
                },
                sort: 0
            },
            'list_bgs': {
                type: Array,
                default: ()=> ([
                    {
                        width:160,
                        height:160,
                        url:require("../../assets/sf_rowbg.png")
                    },
                    {
                        width:160,
                        height:160,
                        url:require("../../assets/sf_rowbg-l.png")
                    }
                ]),
                $rule: {
                    name: '每一栏的默认图和选中图',
                    clazz: Enum.CLAZZ.IMAGE_ARRAY
                },
                sort: 1
            },
            
            'pos': {
                type: String,
                default: 'top/284,right/10',
                $rule: {
                    name: '浮动的位置(可以数值百分比字符串)'
                },
                sort: 2
            },
            'contentPos': {
                type: String,
                default: '0,0',
                $rule: {
                    name: '内容与背景容器的top和left'
                },
                sort: 2
            },
            'textColor':{
                type: String,
                default: '#ffffff',
                $rule: {
                    name: '默认的文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                },
                sort: 3
            },
            'activeColor':{
                type: String,
                default: "#ffde00",
                $rule: {
                    name: '选中的文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                },
                sort: 4
            },
            'fontSize': {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                },
                sort: 5
            },
            'gap':{
                type: Number,
                default: 0,
                $rule: {
                    name: '每一块之间的下边距',
                    clazz: Enum.CLAZZ.Number
                },
                sort: 6
            },
            'lists': {
                type: String,
                default: '',
                $rule: {
                    name: '标题列表(覆盖标题eg:迎锦鲤,幸运盒,狂欢趴)'
                },
                sort: 7
            }
        },
        data(){
            return {
                activitys: [],
                curActivity: {}
            }
        },
        computed:{
            getActivityId() {
                return util.isInBrowser? window.__ACTIVITY_ID__: 0;
            },
            
            fatLists() {
                let fatLis = this.fatTexts(this.lists);
                // 先使用注入的数据，并修改为自定义的名字。否则使用传入的标题空数据
                return this.activitys.length>0? this.activitys.map((it, ii) => {
                    it.name = fatLis[ii] || it.name;
                    return it
                }): (fatLis.length>0? fatLis.map((item, index) => {
                    return {
                        id: 0,
                        name: item,
                        url: '',
                        type: 'custom',
                        active: index==0? true: false
                    }
                }): []);
            },
            floatStyle() {
                let fatPos = this.fatTexts(this.pos),
                    ypos = fatPos[0]? fatPos[0].split('/'): [],
                    xpos = fatPos[1]? fatPos[1].split('/'): [],
                    top = 0,
                    bottom = 'auto',
                    left = 0,
                    right = 'auto';
                if(ypos[0]=='top') { 
                    top = ypos[1]? (ypos[1].indexOf('%')>-1? ypos[1]: this.toRem(ypos[1])): 0;
                    bottom = 'auto';
                }
                if(ypos[0]=='bottom') {
                    top = 'auto'; 
                    bottom = ypos[1]? (ypos[1].indexOf('%')>-1? ypos[1]: this.toRem(ypos[1])): 0;
                }

                if(xpos[0]=='left') {
                    left = xpos[1]? (xpos[1].indexOf('%')>-1? xpos[1]: this.toRem(xpos[1])): 0;
                    right = 'auto';
                }
                if(xpos[0]=='right') {
                    left = 'auto';
                    right = xpos[1]? (xpos[1].indexOf('%')>-1? xpos[1]: this.toRem(xpos[1])): 0;
                }

                return {
                        'top': top,
                        'bottom': bottom,
                        'left': left,
                        'right': right
                    };
            },
            boxStyle(){
                return !this.boxBg? {}: {
                        "width": this.toRem(this.boxBg.width),
                        "height": this.toRem(this.boxBg.height),
                        'background-image': 'url('+ this.boxBg.url +')'
                    };
            },
            contentStyle() {
                let cpos = this.fatTexts(this.contentPos);
                return {
                        'margin-top': this.toRem(cpos[0]|| 0),
                        'margin-left': this.toRem(cpos[1]|| 0)
                    };
            }
        },
        watch:{
        },
        mounted(){
            util2.getUrlParam("fromswitch") && logger.makeActivityLog('activity_switch_from', {
                fromid: util2.getUrlParam("fromid"),
                fromname: util2.getUrlParam("fromname") || '',
                toid: util2.getUrlParam("toid") || this.getActivityId
            }); // 从哪里切换过来的活动统计

            this.$nextTick(()=>{
                this.getActivitys(); // 获取注入的活动
            })

            this.docReady(this.getActivitys);   // DOMContentLoaded监听
        },
        methods:{
            getActivitys() {
                let allActivityNode = Array.from(document.querySelectorAll('.all-activity-data')),
                    allActivity = allActivityNode.map((it, ii) => {
                        let id = it.getAttribute('data-activity') || 0;
                        let ops = {
                            id: id,
                            name: it.getAttribute('data-name') || '',
                            url: it.getAttribute('data-url') || '',
                            type: it.getAttribute('data-type') || '',
                            start_time: it.getAttribute('data-start-time') || 0,
                            end_time: it.getAttribute('data-end-time') || 0,
                            active: id == this.getActivityId
                        }
                        if(ops.active) this.curActivity = ops;  // 记录当前的活动
                        return ops
                    });
                
                allActivity.sort((a, b) => a.id-b.id); // 通过活动id排序排序
                this.activitys = allActivity;
            },
            fatTexts(string) {
                let ary = string.replace(/，/g, ',').split(',');
                return (ary.length==1&&ary[0]=="")? []: ary
            },
            // 处理每一栏的样式
            liStyle(idx, active) {
                let ops = {
                    'font-size': this.fontSize,
                    'color': active? this.activeColor: this.textColor,
                    'margin-bottom': this.toRem(this.gap),
                    'z-index': idx+1
                }
                if(this.list_bgs.length==0) return ops;
                let img = active? (this.list_bgs[1] || this.list_bgs[0]): this.list_bgs[0];
                return Vue.util.extend(ops, {
                        "width": this.toRem(img.width),
                        "height": this.toRem(img.height),
                        'background-image': 'url('+ img.url +')'
                    })
            },
            // 处理每一栏的事件，可以配置自定义事件未完成
            fatMotion(info, idx) {

                logger.makeActivityLog('activity_switch_to', {
                    fromid: this.getActivityId,
                    toid: info.id,
                    toname: info.name,
                    zindex: idx+1
                }); // 点击切换活动统计

                if(info.url){
                    window.location.href = this.addParams(info.url, {
                        'fromswitch': true, 
                        'fromid': this.getActivityId, 
                        'fromname': this.curActivity.name || '', 
                        'toid': info.id
                    });
                }
            },
            toRem(px, u=1080){
                return '' + (10*px/u).toFixed(5) + "rem";
            },
            addParams(url, toParams) {
                let addurls = '',
                    paramsKeys = Object.keys(toParams);

                for(let i = 0;i<paramsKeys.length; i++){
                    addurls += paramsKeys[i] + '=' + toParams[paramsKeys[i]] + (i==(paramsKeys.length-1)? '': '&');
                }
                console.log(addurls)
                // 判断search
                return url? (url.indexOf('?')>-1? (url+'&'+addurls): (url+'?'+addurls)): ''
            },
            docReady(callback){
                document.addEventListener('DOMContentLoaded', function fn() {
                    document.removeEventListener('DOMContentLoaded', fn, false);
                    callback();
                }, false)
            }
        }
    }
</script>
