<style lang="less">
    @import "../style/import";
    .issues {
        height: 8rem;
        margin-top: .5rem;
        .issuestips {
            position: absolute;
            top: 0.75rem;
            left: 0;
            font-size: 0.444444rem;
            font-weight: 500;
            opacity: .2;
            margin-left: 0.222222rem;
            transition: all 0.4s;
            transform: translateZ(0);
        }
        &__box{width: 100%;height: 100%;}
        &__name {
            position: relative;
            height: 1.666667rem;
            animation: float ease-in-out 0.4s 1;
        }
        &__desc {
            width: 100%;        
            position: relative;
            height: 4rem;//480 432
        }
        &__issues {        
            position: relative;
            height: 1.666667rem;
        }
        &__postcode {        
            position: relative;
            height: 1.666667rem;
        }
        &__divider {
            transform: scaleY(0.5) translateZ(0);
            height: 2px;
        }
        &__submit-btn {
            width: 6.5rem;
            height: 1.055556rem;
            line-height: 1.15rem;
            border-radius: 999rem;
            text-align: center;
            font-weight: 500;
            font-size: 0.444444rem;//16px
            position: absolute;
            bottom: .2rem;
            left: 50%;
            transform: translateX(-50%);
        }
        .issuestips{}//27//81/0.25//0.75
        .lengthtips{
            position: absolute;
            font-size: 0.33333rem;
            opacity: 0.2;
            right: 0;
            margin-right: 0.222222rem;
            bottom: -0.61rem;//0.55 + 0.6
        }
    }
    input, textarea {
        width: 95%;
        position: absolute;
        top: 45%;
        font-size: 0.444444rem;
        font-weight: 500;
        margin-left: 0.222222rem;
        background-color: transparent;
        color: inherit;
        resize: none;
    }
    
    input::-webkit-input-placeholder{
        color: #000;
        opacity: 0.2;
    }
    textarea{
        top: 0.8rem;
        height: 3.15rem;//x5
        line-height: 0.61rem;
    }
    @media screen and (orientation: landscape) {
        body{
            .issues{
                margin-top: 0px;
                height: 100%;
                overflow: hidden;
                overflow-y: auto;
                &__box{
                    width: 166.66%;
                    transform: scale(0.6, 0.6);
                    transform-origin: 0 0;
                }
                &__desc{width: 100%;}
                &__submit-btn{
                    position: static;
                    margin: 1.1rem auto 0;
                    transform: translate(0,0);
                }
            }
        }
    }
</style>
<template>
    <div ref="issues" class="issues" :style="{'color': fontColor}">
        <div class="issues__box">
            <div class="issues__name">
                <p name="tips" class="issuestips">活动名称</p>
                <input v-model="do_activityName" @blur="inputBlur(0)" @focus="inputFocus(0)" :placeholder="activity_name_placeholder" :maxlength="nameLength"/>
            </div>
            <div class="issues__divider" :style="{'background-color': dividerColor}"></div>
            <div class="issues__desc">
                <p name="tips" class="issuestips">问题描述</p>
                <textarea class="input1" name="desc" rows="5" :maxlength="descLength" v-model="issuesDesc" @blur="inputBlur(1)" @focus="inputFocus(1)" vplaceholder="请详细描述你遇到的问题 500字以内" @input="changeLength"></textarea>
                <p class="lengthtips">还可以输入<span>{{residueLength}}</span>个字</p>
            </div>
            <div class="issues__divider" :style="{'background-color': dividerColor}"></div>

            <div class="issues__submit-btn" :style="{'background-color': btnBgColor, 'color': btnFontColor}" @click="submit()">提交</div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import TotastBuilder from '../base/TotastBuilder'
    import Enum from '../common/enum';
    import NativeInterface from 'common/nativeinterface';
    import { request, oauthRequest, createSilentParams} from 'common/request';
    import util2 from 'common/util2';
    import {nameValidator, numberValidator, phoneValidator} from '../common/validators';
    import Base64Tool from 'common/base64-tool';
    export default {
    name: 'issues',
    props: ['$bgColor', '$pos'],
    props: {
        dividerColor: {
            type: String,
            default: 'rgba(0,0,0,0.1)',
            $rule: {
                name: '分割线颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        fontColor: {
            type: String,
            default: '#000',
            $rule: {
                name: '字体颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        btnBgColor: {
            type: String,
            default: '#ff0000',
            $rule: {
                name: '按钮背景颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        btnFontColor: {
            type: String,
            default: '#ffffff',
            $rule: {
                name: '按钮字体颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        nameLength: {
            type: Number,
            default: 30,
            $rule: {
                name: '活动名称的输入长度'
            }
        },
        descLength: {
            type: Number,
            default: 200,
            $rule: {
                name: '问题描述的输入长度'
            }
        }
    },
    data() {
        return {
            activityName: "",
            issuesDesc: '',
            nowDescLength: 0,
            activity_name_placeholder: ""
        }
    },
    mounted(){
        var self = this;
        //获取活动名称
        process.env.NODE_ENV == 'production' && oauthRequest.call(this, `${Vue.__REQ_ENV__}/public/activity/detail/${window.__ACTIVITY_ID__}`, {}, function(data){
            if(!!data) self.activityName = data.subject;
        });
    },
    computed: {
        do_activityName:{
            set: function(value) {
                this.activityName = value;
            },
            get: function() {
                if(this.activityName) this.initInputValue(0);
                return this.activityName 
            }
        },
        do_issuesDesc: {
            set: function(value) {
                this.issuesDesc = value;
                this.initInputValue(1);
            },
            get: function() {
                return this.issuesDesc
            }
        },
        isNameOk() {
            return this.activityName!="";
        },
        isDescOk() {
            return this.issuesDesc!="";
        },
        isAllOk() {
            return this.isNameOk && this.isDescOk;
        },

        residueLength(){
            return this.descLength - this.nowDescLength;
        }
    },
    methods: {
        submit() {
            let self = this;
            this.activityName = this.$refs.issues.getElementsByTagName('input')[0].value;
            this.issuesDesc = this.$refs.issues.getElementsByTagName('textarea')[0].value;

            var options = {
                typeName: "活动问题", 
                typeId: 42043,
                activityName: this.activityName, 
                activityId: this.getActivityId(), 
                content: this.issuesDesc
            };
            options = this.serializeData(options);//格式化转换为base64

            if(this.isAllOk) {

                this.$store.dispatch('postIssues', { context: this, params: options }).then(function() {
                    let $BottomSheet = self.$closest('BottomSheet'); //todo
                    $BottomSheet.dismiss();
                    TotastBuilder.of(self).show('提交成功', 1500);
                }).catch(function(err) {
                    TotastBuilder.of(self).show('提交失败', 1500);
                });
            } else {
                if(this.activityName == '' || this.issuesDesc == '') {
                    TotastBuilder.of(this).show('请完善信息', 1000);
                } else if(!this.isNameOk) {
                    TotastBuilder.of(this).show('填写活动名称有误', 1000);
                } else if(!this.isDescOk) {
                    TotastBuilder.of(this).show('填写问题描述有误', 1000);
                }
            }    
        },
        changeLength(){
            this.$nextTick(() => {
                let value = this.$refs.issues.getElementsByTagName('textarea')[0].value;
                    this.nowDescLength = value.toString().length;
            });
        },
        initInputValue(index) {
            this.$nextTick(() => {
                //let value = document.getElementsByTagName('input')[index].value;
                let input = this.$refs.issues.getElementsByTagName('input')[index],
                    value = !!input? input.value: document.getElementsByClassName('input'+ index)[0].value;
                if(value == '' || value == null) {
                    this.floatDown(index);
                } else {
                    this.floatUp(index);
                }
            })
        },
        inputBlur(index) {
            let input = this.$refs.issues.getElementsByTagName('input')[index],
                value = !!input? input.value: document.getElementsByClassName('input'+ index)[0].value;

            if(value == '' || value == null) {
                this.floatDown(index);
            } else {
                this.floatUp(index);
            };
            if(index==0){
                this.activity_name_placeholder = "";
            }
        },
        inputFocus(index) {
            this.floatUp(index);
            if(index==0){
                this.activity_name_placeholder = `如：清凉一夏 ${this.nameLength}字以内`;
            }
        },
        floatUp(index) {
            document.getElementsByName('tips')[index].style.fontSize = '0.333333rem';
            document.getElementsByName('tips')[index].style.fontWeight = 'normal';
            document.getElementsByName('tips')[index].style.opacity = 0.4;
            document.getElementsByName('tips')[index].style.top = '0.25rem';
        },
        floatDown(index) {
            document.getElementsByName('tips')[index].style.fontSize = '0.444444rem';
            document.getElementsByName('tips')[index].style.fontWeight = 500;
            document.getElementsByName('tips')[index].style.opacity = 0.2;
            document.getElementsByName('tips')[index].style.top = '0.75rem';
        },
        htmlEncode: function(str) {  
            var ele = document.createElement('span');  
            ele.appendChild( document.createTextNode( str ) );  
            return ele.innerHTML;  
        },
        serializeData: function(data) {
            if(!data) return;
            for(var p in data) {
                if(p == 'typeId' || p == 'attachments' || p == 'totalPrice' || p == 'payTime' || p == 'createTimestamp'||p == 'activityId') continue;
                data[p] = Base64Tool.base64encode(Base64Tool.utf16to8(data[p]));
            }
            return data;
        },
        getActivityId: function(){
            var pathnames = window.location.pathname.split('/');
            for(var i = 0;i<pathnames.length;i++){
                if(Number(pathnames[i])!=NaN && i>0 && pathnames[i-1].indexOf('activity')!=-1){
                    return pathnames[i]
                }
            };
            return 0;
        }
    }
  }
</script>