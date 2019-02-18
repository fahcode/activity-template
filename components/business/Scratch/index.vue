<style lang="less">
    @import '~components/style/mixin';
 
    .scratch {
        position: relative;
        width: 100%;
        margin: 0.555556rem 0;
        &__bg {
            display: block;
            margin: auto;
        }
        &__tips {
            position: absolute;
            width: 80%;
            left: 50%;
            top: 0.833333rem;
            transform: translateX(-50%);
            .font-dpr(20px);
            text-align: center;
        }
        &__lottery {
            opacity: 0;
            position: absolute;
            bottom: 0.805556rem;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 4;
        }
        &__cover {
            opacity: 1;
            background-repeat: no-repeat;
            background-size: cover;
        }
        &__award {
            position: absolute;
            left: 50%;
            bottom: 0.805556rem;
            transform: translate(-50%, 0);
            width: 8.277778rem;
            height: 4.814815rem;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center; 
            &--hidden {
                 display: none; 
            }
            &--tips {
                font-weight: 500;
                .font-dpr(18px);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        &__canvas {
            position: absolute;
            bottom: 0.805556rem;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 2;
        }
    }
</style>
<template>
    <div class="scratch" ref="scratch">
        <img class="scratch__bg" v-bind:src="scratchBgImg.url" v-bind:style="{width: $toRem(scratchBgImg.width), height: $toRem(scratchBgImg.height)}">
        <div class="scratch__tips" v-bind:style="{color: lotteryTimesTipsColor}">
            <p class="scrtach__tips--none" v-if="!times">暂无抽奖机会</p>
            <p class="scrtach__tips--nonzero" v-else>
                您还有 <span class="scratch__times" v-bind:style="{color: lotteryTimesColor}">{{ times }}</span> 次抽奖机会
            </p>
        </div>
        <div class="scratch__lottery" v-show="showCoverLayer" v-bind:style="{width: $toRem(scratchCoverImg.width), height: $toRem(scratchCoverImg.height), backgroundImage: scratchCoverImg.url, backgroundSize: '100% 100%'}" 
            @touchstart="doLottery($event)" @mousedown="doLottery($event)"></div>
        <!-- <img class="scratch__lottery scratch__cover" v-bind:style="{width: $toRem(scratchCoverImg.width), height: $toRem(scratchCoverImg.height), backgroundImage: scratchCoverImg.url, display: coverImgDisplay}" v-bind:src="scratchCoverImg.url"></img> -->
        <div class="scratch__award" v-bind:class="{'scratch__award--hidden': showCoverLayer}" v-bind:style="{width: $toRem(scratchCoverImg.width), height: $toRem(scratchCoverImg.height)}">
            <p class="scratch__award--tips" v-bind:style="{color: lossPrizeTipsColor}" v-if="award.type == 'INTEGRATION'">{{ lossPrizeTips }}</p>
            <p class="scratch__award--tips" v-bind:style="{color: getPrizeTipsColor}" v-else><span>{{ setPrizeTips }}</span><span class="scratch__award-name" :style="{color: awardNameColor}">{{ award.name }}</span></p>
        </div>
        <canvas ref="canvas" id="scratch-canvas" class="scratch__canvas" :style="{width: $toRem(scratchCoverImg.width), height: $toRem(scratchCoverImg.height)}"></canvas>
    </div>
</template>
<script>
    import logger from 'common/logger';
    import NativeInterface from 'common/nativeinterface';
    import util from 'common/util';
    import Enum from 'common/enum';
    import DialogBuilder from 'base/DialogBuilder';
    import LotteryMixin from 'base/LotteryMixin';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    import LotteryResult from 'littles/LotteryResult.vue';

    export default {
        name: 'Scratch',
        data: function() {
            return {
                showCoverLayer: true,
                award: {},
                context: null,
                scratching: false,
                isShowingResult: false,
                // coverImgDisplay: 'block',
            }
        },
        mixins: [LotteryMixin, BusinessCompMixin],
        props: {
            scratchBgImg: {
                type: Object,
                default: ()=> ({width: 943, height: 571}),
                $rule: {
                    name: '刮奖背景图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            scratchCoverImg: {
                type: Object,
                default: ()=> ({width: 810, height: 144}),
                $rule: {
                    name: '刮奖覆盖图',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            lotteryTimesTipsColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '抽奖次数提示语颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            lotteryTimesColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '抽奖次数颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            getPrizeTipsColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '中奖提示语颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            getPrizeTips: {
                type: String,
                default: '恭喜获得',
                $rule: {
                   name: '中奖提示语'
                }
            },
            awardNameColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '奖品名称字体颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            lossPrizeTipsColor: {
                type: String,
                default: '#000',
                $rule: {
                    name: '未中奖提示语字体颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            lossPrizeTips: {
                type: String,
                default: '抱歉，未中奖！',
                $rule: {
                    name: '未中奖提示语'
                }  
            }
        },
        computed: {
            opts() {
                return {
                    src: this.scratchCoverImg.url,
                    color: '#ccdff1'
                }
            },
            setPrizeTips(){
                if(this.award && typeof this.award.type !== 'undefined'){
                // if(this.award){
                    return this.getPrizeTips;
                }
                return ''
            },
        },

        mounted() {
            this.initCanvas(this.opts);
        },

        methods: {
            initCanvas(opts) {
                let self = this;
                let canvas = self.$refs.canvas;
                let context = this.context =  canvas.getContext('2d');
                let devicePixelRatio = window.devicePixelRatio;
                opts = opts || {color: '#d8dceb'};
                let canvasWidth = canvas.offsetWidth * devicePixelRatio;
                let canvasHeight = canvas.offsetHeight * devicePixelRatio;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                let lastPt = {x: 0, y: 0};
                let canvasOffset = self.$refs.canvas.getBoundingClientRect();

                if(opts.src) {
                    let img = new Image();
                    img.onload = function() {
                        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasWidth, canvasHeight);
                        //self.coverImgDisplay = "none";
                        bindTouchEvent();
                        opts.callback && opts.callback();
                    };
                    img.src = opts.src;
                } else {
                    context.rect(0, 0, canvasWidth, canvasHeight);
                    context.fillStyle = opts.color;
                    context.fill();
                    bindTouchEvent();
                    opts.callback && opts.callback();
                };

                function bindTouchEvent() {
                    if('ontouchstart' in document) {
                        canvas.addEventListener('touchstart', touchstartHander, false);
                        canvas.addEventListener('touchend', touchendHandler, false);
                        canvas.addEventListener('touchmove', touchmoveHandler, false);
                    } else {
                        canvas.addEventListener('mousedown', touchstartHander, false);
                        canvas.addEventListener('mouseup', touchendHandler, false);
                        canvas.addEventListener('mousemove', touchmoveHandler, false);
                    }
                };

                function touchstartHander(evt) {
                    let scrollTop = document.getElementById("app").scrollTop;//todo
                    let touch;
                    if(evt.changedTouches) {
                        touch = evt.changedTouches[0]; 
                    } else {
                        touch = evt;
                    }
                    
                    lastPt = {
                       x: (touch.pageX - canvasOffset.left) * devicePixelRatio,
                       y: (touch.pageY + scrollTop - canvasOffset.top) * devicePixelRatio
                    };
                }

                function touchmoveHandler(evt) {
                
                    let touch;
                    if(evt.changedTouches) {
                        touch = evt.changedTouches[0]; 
                    } else {
                        touch = evt;
                    }
                    let scrollTop = document.getElementById("app").scrollTop;
                    evt.preventDefault(); //阻止默认事件
                    context.save();
                    context.beginPath();//这里一定需要beginPath，否则第一个rect也会被clip          
                    context.moveTo(lastPt.x, lastPt.y);
                    context.lineTo((touch.pageX - canvasOffset.left) * devicePixelRatio, (touch.pageY + scrollTop - canvasOffset.top) * devicePixelRatio);
                    context.strokeStyle = 'white';
                    context.lineWidth = 20 * devicePixelRatio;
                    context.lineCap = context.lineJoin = "round";
                    context.globalCompositeOperation = 'destination-out';
                    context.stroke();
                    lastPt = {
                        x:(touch.pageX - canvasOffset.left) * devicePixelRatio, 
                        y: (touch.pageY + scrollTop - canvasOffset.top) * devicePixelRatio
                    };
                    context.clip();
                    context.clearRect(0, 0, canvasWidth, canvasHeight);
                    context.restore();
                };

                function touchendHandler(evt) {
                    let scratchLimit = window._scratchLimit || 0.5;
                    let scratchedArea = self.getScratchedArea(1, window._AwardRect || {x: 0.25, y: 0.25, width: 0.5, height: 0.5});
                    if(scratchedArea > scratchLimit) {
                        if(self.isShowingResult) return;
                        self.isShowingResult = true
                        //NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        self.$delay(800).then(() => {
                            self.scratching = false; 
                            self.$showLotteryResult(self.award);}
                        );
                    }
                };
            },

            getScratchedArea(stride, rect) {
                let i;
                let l;
                let canvas = this.$refs.canvas;
                let ctx = canvas.getContext("2d");
                let count, total;
                let pixels, pdata;
                rect = rect || {x: 0, y: 0, width: 1, height: 1};
                if (!stride || stride < 1) {
                    stride = 1;
                };
             
                stride *= 4; // 4 elements per pixel
             
                pixels = ctx.getImageData(canvas.width * rect.x, canvas.height * rect.y, canvas.width * rect.width, canvas.height * rect.height);

                pdata = pixels.data;
                l = pdata.length; // 4 entries per pixel
                total = (l / stride) | 0;
                total = (l / stride);
                for (i = count = 0; i < l; i += stride) {
                    if (pdata[i] != 0) {
                        count++;
                    }
                };
                return 1 - count / total;
            },

            doLottery ($evt) {
                // $evt.preventDefault();
                // DialogBuilder.of(this).alert('aa', 'bb', function() {
                //     this.dismiss();
                //     DialogBuilder.of(this).alert('dd', 'ee', function() {
                //         this.dismiss();
                //         // setTimeout(function() {
                //         //     alert(window.aa);
                //         // }, 300);
                //     });
                // });
                var self = this;
                $evt.preventDefault();
                //logger.makeActivityLog('activity_prize_draw');
                if(!NativeInterface.getUserId()) {
                    DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
                        this.dismiss();
                        NativeInterface.login();
                    }, {confirmBtnTxt: '登录'});
                    logger.makeActivityLog('activity_not_login');
                    return;
                };
                if(!this.$checkVersion()) return;
                if(this.scratching) return;
                if(this.times > 0) {
                    this.scratching = true;
                    this.showCoverLayer = false;
                    this.startTime = Date.now();
                    let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                    //logger.makeActivityLog('activity_prize_complete');
                    logger.makeActivityLog('activity_prize_get');
                    this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        this.showLotteryResult(value[0]);
                        logger.makeActivityLog('activity_prize_got');
                    }).catch((err) => {
                        //logger.makeActivityLog("activity_prizebad_juge"); //抽奖报错
                        logger.makeActivityLog('activity_prize_failed');
                        DialogBuilder.of(this).alert('出错了！刷新看看～', '', {
                            onDismiss: ()=> this.reset()
                        });
                    });
                } else {
                    //logger.makeActivityLog('activity_notimes_num');//无抽奖次数
                    if(util.canGetMore()) {
                        DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips);
                    } else {
                        DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips);
                    }
                }; 
            },

            showLotteryResult(result) {
                let self = this;
                let award = null;
                if(!result) {
                    NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                    return;
                };
                if(result.award_id != 0) { //中奖
                    award = util.findAwardById(result.award_id);
                    if(!award) {
                        self.playing = false;
                        DialogBuilder.of(this).alert('出错了！刷新看看~~~', '', {
                            onDismiss: ()=>this.reset()
                        });
                        return;
                    };
                } else { //未中奖
                    let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
                    if(thanks.length) {
                        award = util.randomFormArr(thanks);
                    } else {
                        self.playing = false;
                        DialogBuilder.of(this).alert('出错了！刷新看看~~~', '', {
                            onDismiss: ()=>this.reset()
                        });
                    };
                };
                self.award = award;
            },

            reset() {
                this.scratching = false;
                this.isShowingResult = false;
                this.showCoverLayer = true;
                this.initCanvas(this.opts); 
                this.award = {};
            }
        }
    }
</script>