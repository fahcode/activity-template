<style lang="less">
	.gashapon {
		position: relative;
		height: 6.759259rem;  // 730px
		&__canvas {
			width: 5.694444rem;  // 615
			height: 3.175926rem;  // 343
			position: absolute;
			top: 1.064815rem;  // 115px
			left: 50%;
			transform: translate(-50%, 0);
		}
		&__bg {
			display: block;
			margin: 0 auto;
		}
		&__box {
			width:5.694444rem; // 615px;
			height:3.175926rem; // 343px;
			overflow:hidden;
			position:absolute;
			// left:2.157407rem;  // 233px
			left:2.138889rem;  // 231px
			top:1.064815rem;  // 115px
			&__imgs {
				position:absolute;
				left:0;
				top:0;
			}
			&__one {

			}
			&__cover {
				position:absolute;
				left:0;
				top:0;
			}
		}
		&__btn {
			position: absolute;
			// left:5.361111rem;  // 579px
			left:5.342593rem;  // 577px
			top:5.009259rem;  // 541px
			// top:5rem;  // 540px
			// top: 50%;
			// left: 50%;
			// transfrom: translate(-50%, 0);
			background-size: 100% 100%; 
		}
		&__door {
			display: block;
			position: absolute;
			top: 4.898148rem;  // 529px
			left: 3.398148rem;  // 367px
		}
		&__result--parent {
			position: absolute;
			top: 4.898148rem;  // 529px
			left: 3.398148rem;  // 367px
			overflow:hidden;
		}
		&__result {
			position: absolute;
			left:.166667rem; // 18
			top:-100%;
			// // left: 50%;
			// left:3.564815rem;  // 385px
			// top:3.740741rem;  // 404px;
			background-size: 100% 100%;
			// transform:translate(-50%, 0);
			&--slide {
				animation: slide-ball ease-out 0.5s both;
			}
		}
		&__ball {
			display: none;
		}
		@keyframes slide-ball{
		    0% {
				top:-100%;
			}
		    100% {
				top:.240741rem;  // 26px
			};
		}
		&__box--moving {
			animation:boxMoving 1s both steps(10,end) infinite;
		}
		@keyframes boxMoving {
			0% {

			}
			100% {
				transform:translate3d(0,-100%,0);
			}
		}
	}
</style>

<template>
	<div class="gashapon">
		<canvas class="gashapon__canvas" ref="canvas"></canvas>
		<img class="gashapon__bg" :src="gashaponBgImg.url" :style="{'width': $toRem(gashaponBgImg.width)}">
		<!--<img class="gashapon__ball gashapon__ball--none" v-for="gashaponBall in gashaponBalls" :src="gashaponBall.url" ref="img">-->
		<div class="gashapon__box">
			<div class="gashapon__box__imgs" :class="animateClass">
				<img class="gashapon__box__one" v-for="one in gashaponBalls" :src="one.url" ref="img" 
					:style="{
						'width': $toRem(one.width), 
						'height': $toRem(one.height)
					}" />
			</div>
			<img class="gashapon__box__cover" :src="gashaponCover.url"
				:style="{
					'width': $toRem(gashaponCover.width), 
					'height': $toRem(gashaponCover.height)
				}"/>
		</div>
		<!--<button ref="el" class="gashapon__btn" :style="{'width': $toRem(btnImg.width), 'height': $toRem(btnImg.height), 'background-image': 'url(' + btnImg.url + ')', 'transform': 'translate(-50%, 0)'}" @click="doLottery"></button>-->
		<XImage class="gashapon__btn" :img="btnImg" @click.native="doLottery"></XImage>
		<!--<XImage class="gashapon__door" :img="gashaponDoor"></XImage>-->
		<img class="gashapon__door" :src="gashaponDoor.url" :style="{'width': $toRem(gashaponDoor.width), 'height': $toRem(gashaponDoor.height)}"> <!--, 'transform': 'translate(-50%, 0)'-->
		<div class="gashapon__result--parent" :style="{
				'width': $toRem(gashaponDoor.width), 
				'height': $toRem(gashaponDoor.height)
			}">
			<div class="gashapon__result" v-if="show" v-bind:style="{'width': $toRem(resultBall.width), 'height': $toRem(resultBall.height), 'background-image': 'url(' + resultBall.url + ')'}" v-bind:class="{'gashapon__result--slide': sliding}"></div>
		</div>
	</div>
</template>

<script>

	import Enum from 'common/enum.js'; 
	import util from 'common/util';
	import NativeInterface from 'common/nativeinterface';
	import DialogBuilder from 'base/DialogBuilder';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import LotteryMixin from 'base/LotteryMixin';
	import logger from 'common/logger';
	import XImage from '../XImage/index.vue';

	export default {
		name: 'Gashapon',
		components: {
            XImage
        },
		data() {
			return { 
				NDJ: {},
				show: false,
				animateClass:'',
				sliding: false
			}
		},
		mixins: [LotteryMixin, BusinessCompMixin],
		props: {
			gashaponBgImg: {
				type: Object,
				default: ()=> ({
					width:942,
					height:730,
					url: require("../../assets/gashapon-bg.png")
				}),
				$rule: {
					name: '扭蛋机背景图',
					clazz: Enum.CLAZZ.IMAGE
				} 
			},
			gashaponCover: {
				type: Object,
				default: ()=> ({
					width:615,
					height:343,
					url: require("../../assets/gashapon-cover.png")
				}),
				$rule: {
					name: '扭蛋机遮罩（玻璃）',
					clazz: Enum.CLAZZ.IMAGE
				} 
			},
			gashaponAbleBtnImg: {
				type: Object,
				default: ()=> ({
					width:135,
					height:134,
					url: require("../../assets/gashapon-btn.png")
				}),
				$rule: {
					name: '可抽奖按钮图',
					clazz: Enum.CLAZZ.IMAGE
				} 
			},
			gashaponDisableBtnImg: {
				type: Object,
				default: ()=> ({
					width:135,
					height:134,
					url: require("../../assets/gashapon-btn-disabled.png")
				}),
				$rule: {
					name: '不可抽奖按钮图',
					clazz: Enum.CLAZZ.IMAGE
				} 
			},
			gashaponDoor: {
				type: Object,
				default: ()=> ({
					width:160,
					height:152,
					url:require("../../assets/gashapon-door.png")
				}),
				$rule: {
					name: '扭蛋出口图',
					clazz: Enum.CLAZZ.IMAGE
				}
			},
			gashaponBalls: {
				type: Array,
				default: ()=> ([{
					width:616,
					height:343,
					url:require("../../assets/gashapon-01.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-02.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-03.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-04.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-05.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-06.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-07.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-08.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-09.png")
				},{
					width:616,
					height:343,
					url:require("../../assets/gashapon-10.png")
				}]),
				$rule: {
					name: '扭蛋图集合',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			},
			gashaponResultBalls: {
				type: Array,
				default: ()=> ([{
					width:125,
					height:125,
					url: require("../../assets/ball-01.png")
				},{
					width:125,
					height:125,
					url: require("../../assets/ball-02.png")
				},{
					width:125,
					height:125,
					url: require("../../assets/ball-03.png")
				}]),
				$rule: {
					name: '扭蛋图出口球集合',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			}
			// gashaponBall1: {
			// 	type: Object,
			// 	default: ()=> ({
			// 		url: require("../../assets/ball-01.png")
			// 	}),
			// 	$rule: {
			// 		name: '扭蛋图1',
			// 		clazz: Enum.CLAZZ.IMAGE
			// 	}
			// },
			// gashaponBall2: {
			// 	type: Object,
			// 	default: ()=> ({
			// 		url: require("../../assets/ball-02.png")
			// 	}),
			// 	$rule: {
			// 		name: '扭蛋图2',
			// 		clazz: Enum.CLAZZ.IMAGE
			// 	}
			// },
			// gashaponBall3: {
			// 	type: Object,
			// 	default: ()=> ({
			// 		url: require("../../assets/ball-03.png")
			// 	}),
			// 	$rule: {
			// 		name: '扭蛋图3',
			// 		clazz: Enum.CLAZZ.IMAGE
			// 	}
			// },
			// gashaponBall4: {
			// 	type: Object,
			// 	default: ()=> ({}),
			// 	$rule: {
			// 		name: '扭蛋图4',
			// 		clazz: Enum.CLAZZ.IMAGE
			// 	}
			// },
			// gashaponBall5: {
			// 	type: Object,
			// 	default: ()=> ({}),
			// 	$rule: {
			// 		name: '扭蛋图5',
			// 		clazz: Enum.CLAZZ.IMAGE
			// 	}
			// }
		},
		computed: {
			btnImg() {
				return this.times ? this.gashaponAbleBtnImg : this.gashaponDisableBtnImg;
			},
			resultBall() {
				return this.gashaponResultBalls[Math.floor(Math.random()*this.gashaponResultBalls.length)] || {
					width:0,
					height:0,
					url:''
				};  // 5
			},
			$gashaponAbleBtnImg() {
				return util.getImgCSSVal(this.gashaponAbleBtnImg);
			},
			$gashaponDisableBtnImg() {
				return util.getImgCSSVal(this.gashaponDisableBtnImg);
			}
		},
		mounted() {
			// 前端自己写的球滚动抽奖
			// this.initSingleBallAnimate();
		},
		methods: {
			initSingleBallAnimate(){
				var vm = this;
				function Ndj() {
					//this.canvas = document.getElementsByClassName('gashapon__canvas')[0];
					this.canvas = vm.$refs.canvas;
					//this.imgs = document.querySelectorAll('.gashapon__ball');
					this.imgs = vm.$refs.img;
					this.width = this.canvas.width = parseFloat(window.getComputedStyle(this.canvas).width)*4;
					this.height = this.canvas.height = parseFloat(window.getComputedStyle(this.canvas).height)*4;
					this.ctx = this.canvas.getContext('2d');
					this.dpr = 606/this.width*4;  //比例
					this.start = null;
					this.last = null;
					this.counter = 0;
					this.balls = [];

					var self = this    
					this.init = function() {
						this.start = null;
						this.last = null;
						this.counter = 0;
						this.balls = [];
						this.balls.push(
							new Ball(this.imgs[3], -1, this.dpr, 57/this.dpr*4,  239/this.dpr*4, this.width, (20+Math.random()*30)*4,  30*Math.PI/180),
							new Ball(this.imgs[4], -1, this.dpr, 142/this.dpr*4, 325/this.dpr*4, this.width, (20+Math.random()*30)*4,  45*Math.PI/180),
							new Ball(this.imgs[0], -1, this.dpr, 254/this.dpr*4, 261/this.dpr*4, this.width, (20+Math.random()*30)*4, -80*Math.PI/180),
							new Ball(this.imgs[1], -1, this.dpr, 400/this.dpr*4, 249/this.dpr*4, this.width, (20+Math.random()*30)*4,  70*Math.PI/180),
							new Ball(this.imgs[2], -1, this.dpr, 501/this.dpr*4, 232/this.dpr*4, this.width, (20+Math.random()*30)*4,  45*Math.PI/180),
							new Ball(this.imgs[0],  1, this.dpr, 64/this.dpr*4,  336/this.dpr*4, this.width, (20+Math.random()*30)*4, -60*Math.PI/180),
							new Ball(this.imgs[1],  1, this.dpr, 220/this.dpr*4, 333/this.dpr*4, this.width, (20+Math.random()*30)*4, -210*Math.PI/180),
							new Ball(this.imgs[2],  1, this.dpr, 330/this.dpr*4, 320/this.dpr*4, this.width, (20+Math.random()*30)*4, -80*Math.PI/180),
							new Ball(this.imgs[4],  1, this.dpr, 282/this.dpr*4, 360/this.dpr*4, this.width, (20+Math.random()*30)*4, -170*Math.PI/180),
							new Ball(this.imgs[3],  1, this.dpr, 425/this.dpr*4, 340/this.dpr*4, this.width, (20+Math.random()*30)*4, -10*Math.PI/180),
							new Ball(this.imgs[0],  1, this.dpr, 481/this.dpr*4, 326/this.dpr*4, this.width, (20+Math.random()*30)*4, -180*Math.PI/180),
							new Ball(this.imgs[4],  1, this.dpr, 551/this.dpr*4, 326/this.dpr*4, this.width, (20+Math.random()*30)*4, -50*Math.PI/180)
						)
						
						self.ctx.clearRect(0, 0, self.width, self.height);
						self.balls.map(function(ball) {
							ball.draw(self.ctx)
							if(!(ball.stopX && ball.stopY)) {
								ball.update() 
							}
						})
					}
					this.render = function(timestamp) {
						if(!self.start) {
							self.start = Date.now();
						}
						if(!self.last) {
							self.last = timestamp;
						}

						if(timestamp - self.last > 50) {
							self.last = timestamp
							self.counter++
							self.ctx.clearRect(0, 0, self.width, self.height)
							self.balls.map(function(ball) {
								ball.draw(self.ctx)
								if(!(ball.stopX && ball.stopY)) {
									ball.update() 
								}
							})
						}
						
						if(self.counter > 55) {
							self.elapsed = Date.now() - self.start
							window.cancelAnimationFrame(RequestID)
							return
						}
						let RequestID = window.requestAnimationFrame(function(timestamp) {
							self.render(timestamp)
						})
					}

					this.init()
				}

				//图片，前后，dpr，圆心x坐标，圆心y坐标，运动区域的宽，运动区域的高，弹跳的角度
				function Ball(img, zindex, dpr, x, y, maxX, maxY, deg) {
					this.img = img
					this.zindex = zindex
					this.dpr = dpr
					this.width = 108/this.dpr*4
					this.height = 108/this.dpr*4
					this.rx = 108/2/this.dpr*4
					this.ry = 108/2/this.dpr*4
					this.x = x
					this.y = y
					this.vx = (-10 + Math.random()*10)*4
					this.vy = (-50 + Math.random()*10)*4
					this.deg = deg
					this.maxX = maxX
					this.maxY = maxY
					this.floor = 340/this.dpr*4  //地面位置
					this.gravity = 1.2     // 重力性质
					this.bouncyness = 0.95  // 弹跳参数
				}

				Ball.prototype.update = function() {
					var nextX = this.x + this.vx
					var nextY = this.y + this.gravity + this.vy

					if(nextY > this.floor || nextY < this.maxY + this.ry) {
						if(nextY > this.maxY-this.ry && Math.abs(this.vy) < 0.5) {
							this.stopY = true
						}
						else {
							this.bounceY()
						}
					}
					else {
						this.vy = this.gravity + this.vy
						this.y = nextY
					}

					if(nextX > this.maxX - this.rx || nextX < this.rx) {
						this.bounceX()
					}
					else {
						this.x = nextX
					}

					if(Math.abs(this.vx) < 0.5) {
						this.stopX = true
					}

					this.bouncyness = this.bouncyness * 0.95
					this.deg += Math.random()*Math.PI/180*20

				}

				Ball.prototype.bounceY = function() {
					this.vy = -this.vy * this.bouncyness;
					this.y += this.vy;
				}

				Ball.prototype.bounceX = function() {
					this.vx = -this.vx * this.bouncyness;
					this.x += this.vx;
				}

				Ball.prototype.draw = function(ctx) {
					if(this.img){
						ctx.save()
						ctx.translate(this.x, this.y);
						ctx.rotate(this.deg);
						ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
						ctx.restore()
					}
				}
				this.DNJ = new Ndj();
			},
			doLottery() {
				//logger.makeActivityLog('activity_prize_draw');
				if(!this.$checkVersion()) return;
	            if(!NativeInterface.getUserId()) {
	                DialogBuilder.of(this).alert('登录后才可以抽奖哦~', function() {
	                    this.dismiss();
	                    NativeInterface.login();
	                }, {confirmBtnTxt: '登录'});
	                logger.makeActivityLog('activity_not_login');
	                return;
	            }
	            if(this.times > 0) {
	            	if(this.playig) {
	            		return;
	            	};
	                this.playing = true;
					this.animateClass = 'gashapon__box--moving';
	                // this.DNJ.render(); //开始摇奖动画
	                this.startTime = Date.now();
	                let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                    //logger.makeActivityLog('activity_prize_complete');
                    logger.makeActivityLog('activity_prize_get');
	                this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        this.showLotteryResult(value[0]);
                        logger.makeActivityLog('activity_prize_got');
	                }).catch((err) => {
	                    this.playing = false;
						this.animateClass = '';
                        //logger.makeActivityLog('activity_prizebad_juge');//调抽奖接口返回错误、异常埋点
                        logger.makeActivityLog('activity_prize_failed');
	                    this.$handleReqErr(err);
	                });
	            } else {
	            	//logger.makeActivityLog('activity_notimes_num');
	                if(util.canGetMore()) {
	                    DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips);
   					} else {
   					    DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips);
   					}
	            }
			},
			showLotteryResult(result) {
				let award = null;
				if(!result) {
					NativeInterface.emit(Enum.interface_EVENT.UPDATE_TIMES);
					this.animateClass = '';
					return;
				};
				if(result.award_id != 0) {
					award = util.findAwardById(result.award_id);
					if(!award) {
						this.playing = false;
						this.animateClass = '';
						DialogBuilder.of(this).alert('出错了！刷新看看~~~', function() {
							this.dismiss();
							NativeInterface.emit(Enum.INTERFACE_EVENT.LOGIN)
						}, {confirmBtnTxt: '刷新'});
						return;
					}
				} else {
					let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
					if(thanks.length) {
					    award = util.randomFormArr(thanks);
					} else {
					    this.playing = false;
						this.animateClass = '';
					    DialogBuilder.of(this).alert('出错了！刷新看看~~~', '', {
					    	onDismiss: ()=>this.reset()
					    });
					};
				}
				let waitTime = Date.now() - this.startTime;
				let duration = waitTime < 3000 ? 3000 - waitTime : 1000 - waitTime % 1000;
				this.$delay(duration).then(()=>{
					this.show = true;
					this.sliding = true;
					this.animateClass = '';
					this.$delay(1000).then(()=> {
						this.$showLotteryResult(award);
					});
				});
			},
			reset() {
				this.playing = false;
				this.show = false;
				this.animateClass = '';
				// this.DNJ.init();
			}
		}
	}
	
</script>