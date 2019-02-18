<style lang="less">
/* ##remfixer: 1080 */
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
    .rollAwards {
        position: relative;
	    //width: 984px;
        //height: 80px;
        //padding:0 30px 0 86px;
        border-radius: 0;
		margin: .333333rem auto;  // 36
	    background-repeat: no-repeat;
        background-size: 100%;
	    overflow: hidden;
	    white-space: nowrap;
        white-space: nowrap;
        //&.vertical{min-height: 200px;}
        &__bg {
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        &__inner {
			position: relative;
	    	width: 100%;
			height: 100%;
			line-height: 100%;
            font-size: .324074rem;    // 35
            overflow: hidden;
            z-index: 2;
            transform: translate3d(0, 0, 0);
        }
        &__list-layer {
            position: absolute;
            // display: flex;
            width: 100%;
            //transition: translate3d 0.5s;
            flex-grow: 0;
            flex-shrink: 0;
        }
        &__list {
            display: flex;
            width: 10px;
            // float: left;
            flex-grow: 0;
            flex-shrink: 0;
            li {
                color:#fff;
                font-weight: 500;
                float:left;
                font-size: .305556rem;  // 33
                .innerSpan{
                }
				.name{
                    color: #fff834;
                }
                .aw {
                    color: #fff834;
                } 
            }
        }
        .roll-horizontal-all {
            animation: winner-scroll 50s linear infinite;
        }
        .roll-horizontal-lefttop-half {
            animation: winner-scroll-left-half 50s linear infinite;
        }
        .roll-horizontal-rightbottom-half {
            animation: winner-scroll-right-half 50s linear infinite;
        }

        .roll-vertical-lefttop {
            animation: winner-vertical-scroll-top 50s linear infinite;
        }
        .roll-vertical-rightbottom {
            animation: winner-vertical-scroll-bottom 50s linear infinite;
        }
        .roll-vertical-lefttop-half {
            animation: winner-vertical-scroll-top-half 50s linear infinite;
        }
        .roll-vertical-rightbottom-half {
            animation: winner-vertical-scroll-bottom-half 50s linear infinite;
        }
        @keyframes winner-scroll {
            100% {
                transform: translate3d(-100%, 0, 0);
            }
        }
        @keyframes winner-scroll-left-half {
            100% {
                transform: translate3d(-50%, 0, 0);
            }
        }
        @keyframes winner-scroll-right-half {
            100% {
                transform: translate3d(50%, 0, 0);
            }
        }
        @keyframes winner-vertical-scroll-top {
            100% {
                transform: translate3d(0, -100%, 0);
            }
        }
        @keyframes winner-vertical-scroll-bottom {
            100% {
                transform: translate3d(0, 100%, 0);
            }
        }
        @keyframes winner-vertical-scroll-top-half {
            100% {
                transform: translate3d(0, -50%, 0);
            }
        }
        @keyframes winner-vertical-scroll-bottom-half {
            100% {
                transform: translate3d(0, 50%, 0);
            }
        }
    }
</style>
<template>
    <div ref="rollAwards" id="rollAwards" class="rollAwards clearfix" :class="rollClass" :style="boxStyle">
        <img class="rollAwards__bg" :src="boxBg.url"/>
        <div ref="inner" class="rollAwards__inner">
            <div class="rollAwards__list-layer clearfix" ref="list-layer" v-if="show" :class="animationClassName" :style="[layerStyle, animationStyle]">
                <ul class="rollAwards__list clearfix" ref="list" :style="listStyle">
                    <li v-for="item in productWinnerList" :style="innerStyle"><span class="innerSpan" >
						恭喜 <span class="name" :style="{'color':keyColor}">{{item.nickname}}</span> 获得 <span class="aw" :style="{'color':keyColor}">{{item.award_name}}</span></span>
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
    export default {
        name: 'rollAwards',
        mixins: [BusinessCompMixin],
        props:{
            'boxBg': {
                type: Object,
                default: ()=> ({'width':984,'height':80, url: require('../../assets/roll-awards-bg.png')}),
                $rule: {
                    name: '背景图',
                    clazz: Enum.CLAZZ.IMAGE
                },
                sort: 0
            },
            'direction':{
                type: String,
                default: 'horizontal',
                $rule: {
                    name: '滚动方向的类型',
                    options: [
                        {
                            value: 'horizontal',
                            label: '水平滚动'//horizontal
                        },
                        {
                            value: 'vertical',
                            label: '横向滚动'
                        }
                    ],
                    clazz: Enum.CLAZZ.SELECT
                },
                sort: 1
            },
            'direction_xy':{
                type: String,
                default: 'lefttop',
                $rule: {
                    name: '滚动的方向',
                    options: [
                        {
                            value: 'lefttop',
                            label: '向左/向上'//horizontal
                        },
                        {
                            value: 'rightbottom',
                            label: '向右/向下'
                        }
                    ],
                    clazz: Enum.CLAZZ.SELECT
                },
                sort: 2
            },
            'speed':{
                type: Number,
                default: 160,   // 0.3
                $rule: {
                    name: '水平滚动的速度(px)/纵向滚动的过渡时间（s）',
                    clazz: Enum.CLAZZ.Number
                },
                sort: 3
            },
            'gap':{
                type: Number,
                default: 54,    // 2
                $rule: {
                    name: '水平滚动条目间隔（px）/纵向滚动每一条的间隔时间（s）',
                    clazz: Enum.CLAZZ.Number
                },
                sort: 4
            },
            'textColor':{
                type: String,
                default: '#ffffff',
                $rule: {
                    name: '内容文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                },
                sort: 5
            },
            'keyColor':{
                type: String,
                default: "#fff834",
                $rule: {
                    name: '重点内容文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                },
                sort: 6
            },
            'fontSize': {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                },
                sort: 7
            },
            'befPadding':{
                type: Number,
                default: 86,
                $rule: {
                    name: '内容离背景最前面的距离',
                    clazz: Enum.CLAZZ.Number
                },
                sort: 8
            },
            'aftPadding':{
                type: Number,
                default: 30,
                $rule: {
                    name: '内容离背景最后面的距离',
                    clazz: Enum.CLAZZ.Number
                },
                sort: 9
            }
        },
        data(){
            return {
                show: true,
                winnerList: [],
                rollClass: 'direction',

                animationClassName: '',
                twiceWidth: 10, // 实际的宽度/高度
                time: 100,  // 默认一轮的时间
                delay: 0, // 动画开始的延时

                oneHeight: 0, // 记录一条的高度
                animationTimer: null,
                loopInx: 0 // 记录滚动的位置
            }
        },
        computed:{
            productWinnerList(){
                if(this.winnerList.length<1) return [];
                let list = this.winnerList.slice(0);
                if(this.direction=='horizontal') {
                    let time = 0,
                        j = 0;
                    //长度小于5，补齐数量
                    if(list.length < 5){
                        time = Math.ceil(5 / list.length) - 1
                        for(j = 0; j < time; j++){
                            list = list.concat(this.winnerList)
                        }
                    }
                    return list.concat(list);   // 水平滚动要翻倍
                }else {
                    return list.concat(list.slice(0, 1));   // 水平滚动补第一条到最后
                }  
            },
            boxStyle(){
                let opsa = {},
                    opsb= {};
                if(this.boxBg){
                    opsa = {
                        "width": this.toRem(this.boxBg.width),
                        "height": this.toRem(this.boxBg.height),
                        "line-height": this.toRem(this.boxBg.height),
                        'padding-left': this.toRem(this.befPadding),
                        'padding-right': this.toRem(this.aftPadding),
                        'background-image': 'url('+ this.boxBg.url +')'
                    }
                };
                return Object.assign({}, opsa, opsb);
            },
            layerStyle(){
                let ops = {};
                //判断移动的方向，来控制当前滚动box的相对位置
                if(this.direction == 'horizontal'){
                    ops = {width: this.twiceWidth+'px', height: '100%', top: 0};
                    if(this.direction_xy == 'lefttop'){
                        ops['left'] = 0;
                    }else{
                        ops['right'] = 0;
                    }
                    return ops;
                }else {
                    ops = {width: '100%', height: this.twiceWidth+'px', left: 0};
                    if(this.direction_xy == 'lefttop'){
                        ops['top'] = 0;
                    }else{
                        ops['bottom'] = 0;
                    }
                    return ops;
                };
            },
            listStyle(){
                let ops = {};
                if(this.direction != 'horizontal'){
                    ops = {
                        'width': '100%',
                        'flex-wrap': 'wrap'
                    }
                }
                return ops
            },
            innerStyle(){
                let opsa = {
                        "height": this.toRem(this.boxBg.height),
                        "line-height": this.toRem(this.boxBg.height + 3),
                        'color': this.textColor,
                        'font-size': this.fontSize || ''
                    };

                if(this.direction == 'horizontal'){
                    opsa = Object.assign({}, opsa, {'margin-right': this.toRem(this.gap)});
                }else{
                    opsa = Object.assign({}, opsa, {
                        // 'margin-bottom': this.toRem(this.gap),
                        'width': '100%',
                        'overflow': 'hidden',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis'
                        });
                }
                return opsa;
            },
            animationStyle(){
                let ops = {}
                if(this.direction == 'horizontal'){
                    ops = {
                        '-webkit-animation-duration': this.time + 's!important', 
                        'animation-duration': this.time + 's!important',
                        '-webkit-animation-delay': this.delay + 's!important', 
                        'animation-delay': this.delay + 's!important'
                    }
                }else{
                    ops = Object.assign({}, ops, {
                        transform: `translate3d(0px, ${this.direction_xy=='lefttop'? '-': ''}${this.loopInx*this.oneHeight}px, 0px)`,
                        transition: this.loopInx!=0? `transform ${this.speed}s`: ''
                    })
                    //ops = {};
                }
                return ops
            },
            watchValues(){
                let {winnerList, boxBg, direction, direction_xy, gap, fontSize, speed} = this;
                return {
                    winnerList, boxBg, direction, direction_xy, gap, fontSize, speed
                }
            }
        },
        watch:{
            watchValues: function(n,o){
                let self = this;
                this.rollClass = n.direction;

                this.$nextTick(function () {
                    setTimeout(() => {
                        self.setRoll()
                    }, 17);
                })
            },
            direction: function(n, o){
                if(n != 'horizontal'){
                    this.speed = 0.3;
                    this.gap = 2;
                }else{
                    this.speed = 160;
                    this.gap = 54;
                }
            }
        },
        mounted(){
            (function() {
                var lastTime = 0;
                var vendors = ['webkit', 'moz'];
                for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                    window.cancelAnimationFrame =
                    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
                }

                if (!window.requestAnimationFrame)
                    window.requestAnimationFrame = function(callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };

                if (!window.cancelAnimationFrame)
                    window.cancelAnimationFrame = function(id) {
                        clearTimeout(id);
                    };
            }());

            this.getWinnerList();
        },
        methods:{
            setRoll(){
                let list = this.$refs['list'],
                    length = list.children.length,
                    width = list.scrollWidth,// list.clientWidth || list.offsetWidth,
                    height = list.scrollHeight,
                    actual = 0,
                    iv = 0;
                this.direction == 'horizontal'? (actual = width): (actual = height); // 当前模式的容器宽度/高度
                iv = this.speed; // 速度
                this.twiceWidth = actual;
                this.oneHeight = (height/length).toFixed(2);

                if(this.direction == 'horizontal'){
                    this.time = ~~(actual ? actual / iv : 100);//长度除速度
                    this.animationClassName = 'roll-'+ this.direction +'-'+ this.direction_xy +'-half';
                }else{
                    this.animationClassName = '';
                    // 调用循环的动画
                    this.transitionRoll();
                }
                
            },
            transitionRoll(){
                let self = this;
                
                window.cancelAnimationFrame(this.animationTimer);
                let lastTick = 0;
                let animloop = (elapse)=> {
                    if(this.direction=='horizontal') {
                        self.loopInx = 0;
                        window.cancelAnimationFrame(this.animationTimer);
                    } else {
                        if(elapse - lastTick > self.gap*1000) {
                            lastTick = elapse; // 记录时间
                            self.loopInx++;
                            // 等于最后一条，等动画执行speed结束后，立刻切换为第1条。last=first
                            if(self.loopInx==(self.productWinnerList.length-1)){
                                setTimeout(() => {
                                    self.loopInx = 0;
                                }, self.speed*1000);
                            }
                        }
                        this.animationTimer = window.requestAnimationFrame(animloop);
                    }

                }
                animloop(0);
                //this.animationTimer = window.requestAnimationFrame(animloop);
            },
            getWinnerList() {
                logger.makeActivityLog('activity_pagein_winnerlist_times');
                this.$store.dispatch('fetchWinnerList', {context: this, params: { __silent__: true}}).then((response) => {
                    logger.makeActivityLog('activity_pagein_winnerlist_success_times');
                    if(response && response.length > 0){
                        this.winnerList = response;
                    }else {
                        this.winnerList = []
                    }
                }).catch((err) => {
                    logger.makeActivityLog('activity_pagein_winnerlist_bad_times');
                })
            },
            toRem(px, u=1080){
                return '' + (10*px/u).toFixed(5) + "rem";
            }
        }
    }
</script>
