<style lang="less">
	.tiger {
		position: relative;
		min-height: 7.4rem;
	    &__img {
    	    position: absolute;
    	    top: 0;
		    left: 50%;
		    transform: translateX(-50%);
		    -webkit-transform: translateX(-50%);
    	    z-index: 10;
    		display: block;
	    }
	    &__block {
	    	position: relative;
	    	top: 0.5rem;
	    	margin: 0 auto;
	    	background: #ffffff;
	    	overflow: hidden;
	    }
	    &__award-list {
	    	position: absolute;
	    	top: 0;
	    	left: 0;
	    	width: 2.8rem;
	    	&:nth-child(1) {
	    		left: 0;
	    		top: .6rem;
	    		&.lottery-play {
	    			-webkit-animation: lottery-play 1s linear infinite;
	    		}
	    	}
	    	&:nth-child(2) {
	    		left: 2.9rem;
	    		top: -2rem;
	    		border-style: solid;
	    		&.lottery-play {
	    			-webkit-animation: lottery-play 1s linear 0.3s infinite;
	    		}
	    	}
	    	&:nth-child(3) {
	    		left: 5.75rem;
	    		top: -4.6rem;
	    		&.lottery-play {
	    			-webkit-animation: lottery-play 1s linear 0.5s infinite;
	    		}
	    	}
	    }
	    &__award-list-item {
	    	& img {
    			display: block;
    		    width: 70%;
    		    margin: 0 auto;
	    	}
	    }
	    &__lottery-btn {
    		position: absolute;
    	    bottom: 9%;
    	    left: 50%;
    	    transform: translate3d(-50%,0,0);
    	    background-color: transparent;
    	    background-size: 100% auto;
    	    background-repeat: no-repeat;
    	    -webkit-tap-highlight-color: transparent;
    	    -webkit-user-select: none;
	    }
	}
	@-webkit-keyframes lottery-play {
		100% {-webkit-transform: translate3d(0, -50%, 0);}
	    // 100% {-webkit-transform: translate3d(0, -62.5%, 0);}
	}
	.lottery-end-2 {
	    -webkit-transition: -webkit-transform ease-out 1.1s;
	}
	.lottery-end-3 {
	    -webkit-transition: -webkit-transform ease-out 1.1s;
	}
	.lottery-end-4 {
	    -webkit-transition: -webkit-transform ease-out 1.4s;
	}
	.lottery-end-5 {
	    -webkit-transition: -webkit-transform ease-out 1.6s;
	}
	.lottery-end-6 {
	    -webkit-transition: -webkit-transform ease-out 1.8s;
	}
	.lottery-end-7 {
	    -webkit-transition: -webkit-transform ease-out 2.0s;
	}
	.lottery-end-8 {
	    -webkit-transition: -webkit-transform ease-out 2.2s;
	}
</style>
<template>
<div>
	<div class="tiger">
		<img class="tiger__img" :src="realBgImg" :style="{'width': $toRem(tigerBgImg.width),'height': $toRem(tigerBgImg.height)}">
		<div class="tiger__block" :style="{'width': $toRem(tigerBlockWidth), 'height': $toRem(tigerBlockHeight)}">
			<template v-for="num in awardListNum">
				<ul ref="list" class="tiger__award-list" :index="num">
					<li class="tiger__award-list-item" v-for="img in realAwardsImgs">
						<img :src="img">
					</li>
				</ul>
			</template>
		</div>
		<div 
			class="tiger__lottery-btn" 
			:style="{'background-image': realLotteryBtnImg, width: $toRem(lotteryImg.width), height: $toRem(lotteryImg.height)}"
			@click="doLottery">
		</div>
	</div>
</div>
</template>
<script>
	import Vue from 'vue'
	import Enum from 'common/enum';
	import util from 'common/util';
	import DialogBuilder from 'base/DialogBuilder';
	import NativeInterface from 'common/nativeinterface';
	import LotteryMixin from 'base/LotteryMixin';
  	import BusinessCompMixin from 'base/BusinessCompMixin';
  	import logger from 'common/logger';
	export default {
		name: 'Tiger',
		mixins: [LotteryMixin, BusinessCompMixin],
		props: {
			tigerBgImg: {
				type: Object,
				default: () => ({}),
				$rule: {
					name: '老虎机背景图',
					clazz: Enum.CLAZZ.IMAGE
				}
			},
			tigerAwardImgs: {
				type: Array,
				default: () => ([]),
				$rule: {
					name: '老虎机奖品图（3<奖品数量<=8）',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			},
			lotteryImg: {
				type: Object,
				default: () => ({}),
				$rule: {
					name: '抽奖按钮图',
					clazz: Enum.CLAZZ.IMAGE
				}
			},
			lotteryDisableImg: {
				type: Object,
				default: () => ({}),
				$rule: {
					name: '抽奖按钮灰显图',
					clazz: Enum.CLAZZ.IMAGE
				}
			}
		},
		data() {
			return {
				awardListNum: [0,1,2],
				playing: false,
				stopFlag: 0,
				// liIndex: []
			}
		},
		computed: {
			realBgImg() {
				return util.getImgUrl(this.tigerBgImg);
			},
			awardsImgs() {
				let imgs = [];
				for(let i = 0; i < this.tigerAwardImgs.length; i++) {
					imgs.push(util.getImgUrl(this.tigerAwardImgs[i]));
				}
				return imgs;
			},
			realAwardsImgs() {
				let imgs = [],
					aimgs = this.awardsImgs,
					total = Vue.__META__.awardsCount || 8,
					temp = total,
					mid = total;
				if(temp <= aimgs.length){
					temp *= 2
				}else{
					temp = aimgs.length * 2
					mid = aimgs.length
				}
				for(let i = 0, j = 0; i < temp; i++) {
					imgs.push(aimgs[i % mid])
					// if(aimgs[i] != undefined) {
					// 	imgs.push(aimgs[i])
					// } else {
					// 	imgs.push(aimgs[j])
					// 	j++;
					// }
				}
				return imgs
			},
			realLotteryBtnImg() {
				let btnImg = '';
				if(this.$store.state.lotteryTimes) {
					btnImg = util.getImgCSSVal(this.lotteryImg);
				} else {
					btnImg = util.getImgCSSVal(this.lotteryDisableImg);
				}
				return btnImg;
			},
			tigerBlockWidth() {
				return this.tigerBgImg.width * 0.88;
			},
			tigerBlockHeight() {
				return this.tigerBgImg.height * 0.746;
			}
		},
		methods: {
			doLottery() {
				let self = this
				//logger.makeActivityLog('activity_prize_draw');
				if(!this.$checkVersion()) return;
				if(!NativeInterface.getUserId()) {
				    DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
				        this.dismiss();
				        NativeInterface.login();
				    }, {confirmBtnTxt: '登录'});
				    logger.makeActivityLog('activity_not_login');
				    return;
				}
				if(this.playing) return;
				if(this.times > 0) {
				    this.playing = true;
				    this.startTime = Date.now();
				    let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                    //logger.makeActivityLog('activity_prize_complete');
                    logger.makeActivityLog('activity_prize_get');
				    this.init();
				    this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        this.showLotteryResult(value[0]);
                        logger.makeActivityLog('activity_prize_got');
				    }).catch((err) => {
                        this.playing = false;
                        logger.makeActivityLog('activity_prize_failed');
				        //logger.makeActivityLog('activity_prizebad_juge');//调抽奖接口返回错误、异常埋点
				        
				        // let list = document.querySelectorAll('.tiger__award-list');
				        // for(let i = 0;i < list.length;i++) {
				        // 	list[i].style['webkitTransform'] = 'translate3d(0,0,0)';
				        // 	list[i].classList.remove('lottery-play');
				        // }
						setTimeout(function(){
							self.reset();
						},600)
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
			init() {
				let list = document.querySelectorAll('.tiger__award-list');
				for(let i = 0;i < list.length;i++) {
					list[i].classList.add('lottery-play');
					let waitTime = 300*i;
					setTimeout(() => {
						list[i].style.top = '.6rem';
					},waitTime);
				}
			},
			showLotteryResult(result) {
				let self = this;
				let awardResult = [];
				if(result) {
					let award = null;
					let myAwards= window.__ACTIVITY_CONFIG__.__AWARDS__;
					myAwards =  myAwards.filter((item) => {
						return item.type != 'INTEGRATION';
					});
					myAwards.forEach((item, index) => {
						item.index = index;
					});
					if(result.award_id != 0) {
						award = util.findAwardById(result.award_id);
						if(!award) {
							this.playing = false;
							DialogBuilder.of(this).alert('出错了！刷新看看～');
							this.reset();
                  			return;
						}
						awardResult = [award.index, award.index, award.index];
					} else {
						let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
						if(thanks.length) {
							award = award = util.randomFormArr(thanks);
							let copyAwards = myAwards.slice(0);
							let i = Math.floor(Math.random() * myAwards.length);
							copyAwards.splice(i, 1);
							awardResult[i % 3] = myAwards[i].index;
							awardResult[(i + 1) % 3] = copyAwards[Math.floor(Math.random() * copyAwards.length)].index;
							awardResult[(i + 2) % 3] = copyAwards[Math.floor(Math.random() * copyAwards.length)].index;

						} else {
							this.playing = false;
							DialogBuilder.of(this).alert('出错了！刷新看看～');
							this.reset();
							return;
						}
					}
					
					self.stopFlag = 0;
					this.$delay(2300).then(() => {
						let list = document.querySelectorAll('.tiger__award-list');
						for(let i = 0; i < list.length; i++) {
							(function(ii){
								list[i].addEventListener('webkitAnimationIteration',listenerCallback)
								function listenerCallback(num){
									animationCallBack(num,ii)
									list[ii].removeEventListener('webkitAnimationIteration',listenerCallback)
								}
							})(i)
							/* (num) => {
								let listIndex = list[i].getAttribute('index');
								let l = awardResult[listIndex];
								if(l < 2) {
									l += myAwards.length;
								}
								list[i].classList.remove('lottery-play');
								list[i].classList.add('lottery-end-' + l);
								list[0].offsetHeight;
								let offset = (-l * this.tigerAwardImgs[0].height) / (this.realAwardsImgs.length * this.tigerAwardImgs[0].height) * 100;
								console.log("offset: "+offset+" award: "+award.name+" , index: "+award.index)
								// if(offset <= -100){
								// 	offset += 100
								// }
								list[i].style['webkitTransform'] = 'translate3d(0,' + offset  + '%,0)';

								self.stopFlag++;
								if(self.stopFlag == 3) {
									self.$delay(2000).then(() => {
										self.$showLotteryResult(award);
									})
								}
							});*/
						}
						function animationCallBack(num,i){
							let listIndex = list[i].getAttribute('index');
							let l = awardResult[listIndex],
								mid = self.realAwardsImgs.length / 2;
							if(l < mid) {
								l += mid;
							}
							list[i].classList.remove('lottery-play');
							list[i].style['webkitTransition'] = "-webkit-transform ease-out "+(1+0.2*l)+"s"
							let offset = (-l / self.realAwardsImgs.length) * 100;
							if(offset <= -100){
								l = l % self.realAwardsImgs.length
								offset = (-l / self.realAwardsImgs.length) * 100;
							}
							list[i].style['webkitTransform'] = 'translate3d(0,' + offset  + '%,0)';

							self.stopFlag++;
							if(self.stopFlag == 3) {
								self.$delay(1000).then(() => {
									self.$showLotteryResult(award);
								})
							}
							// let listIndex = list[i].getAttribute('index');
							// let l = awardResult[listIndex];
							// if(l < 2) {
							// 	l += myAwards.length;
							// }
							// list[i].classList.remove('lottery-play');
							// list[i].classList.add('lottery-end-' + l);
							// // list[0].offsetHeight;
							// let offset = (-l * self.tigerAwardImgs[0].height) / (self.realAwardsImgs.length * self.tigerAwardImgs[0].height) * 100;
							// if(offset <= -100){
							// 	// offset += 100
							// 	l = l - (list[i].children.length - 1)
							// 	offset = (-l * self.tigerAwardImgs[0].height) / (self.realAwardsImgs.length * self.tigerAwardImgs[0].height) * 100
							// }
							// list[i].style['webkitTransform'] = 'translate3d(0,' + offset  + '%,0)';

							// self.stopFlag++;
							// if(self.stopFlag == 3) {
							// 	self.$delay(2000).then(() => {
							// 		self.$showLotteryResult(award);
							// 	})
							// }
						}
					})
				}
			},
			reset() {
				this.playing = false;
				this.stopFlag = 0;
				let list = document.querySelectorAll('.tiger__award-list');
				let topPos = 0;
				for(let i = 0;i < list.length;i++) {
					list[i].style['webkitTransform'] = '';
					topPos = -i * 2.6 + 0.6;
					list[i].style.cssText = 'top: '+topPos+'rem;';
					list[i].classList.remove('lottery-play');
					list[i].style.top = topPos+'rem';
					// list[i].classList.remove('lottery-end-2','lottery-end-3','lottery-end-4','lottery-end-5','lottery-end-6','lottery-end-7','lottery-end-8')
				}
			}
		},
		components: {
		}
	}
</script>