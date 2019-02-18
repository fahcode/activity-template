<style lang="less">
	.flip-wraper { 
		width: 9.111111rem;
		min-height: 3.805537rem;
		margin: 0.462963rem auto;
		display: flex;
		justify-content: space-between;
		perspective: 1000px;
		perspective-origin: 50% 50%;

		&__item {
			position: relative;	
			&--rocking {
				transform-origin: 50% 50%;
				animation: rock .3s infinite;
			}
		}
		&__cover {
			position: absolute;
			width: 100%;
			height: 100%;
			transform: rotateY(0deg);
			backface-visibility: hidden;
			z-index: 3;
			&--ani {
				// transform: rotateY(180deg);
				animation: cover-rotate 2s forwards;   
			}
			&--recover {
				// transform: rotateY(0deg);
				animation: cover-recover 2s forwards;
			}
		}
		&__award {
			width: 100%;
			height: 100%;
			position: absolute; 
			top: 0;
			left: 0;
			transform: rotateY(-180deg);
			z-index: 2;
			backface-visibility: hidden;;
			&--ani {
				// transform: rotateY(0deg);
				animation: award-rotate 2s forwards;
			}
			&--recover {
				// transform: rotateY(180deg);
				animation: award-recover 2s forwards;
			}
		}
		@keyframes rock {
		    0% { -webkit-transform: rotateZ(0deg); }
		    25% { -webkit-transform: rotateZ(-5deg); }
		    50% { -webkit-transform: rotateZ(0deg); }
		    75% { -webkit-transform: rotateZ(5deg); }
		    100% { -webkit-transform: rotateZ(0deg); }
		}

		@keyframes cover-rotate {
			0% {transform: rotateY(0deg)}
			100% {transform: rotateY(180deg);}
		}

		@keyframes award-rotate {
			0% {transform: rotateY(-180deg)}
			100% {transform: rotateY(0deg)}
		}

		@keyframes award-recover {
			0% {transform: rotateY(0deg)}
			100% {transform: rotateY(-180deg)}
		}

		@keyframes cover-recover {
			0% {transform: rotateY(180deg)}
			100% {transform: rotateY(0deg);}
		}	
	}
</style>
<template>
	<ul class="flip-wraper" :style="{'background-color': $bgColor}">
		<li class="flip-wraper__item" 
			ref="target"
			v-for="index in 3"
			:style="{width: $toRem(flipBgImg.width), height: $toRem(flipBgImg.height)}">
			<img class="flip-wraper__cover" 
				ref="cover"
				:src="flipBgImg.url"
				v-on:click="doLottery(index - 1)"
				v-bind:class="{'flip-wraper__cover--ani': isCoverAni[index - 1], 'flip-wraper__cover--recover': isCoverRecover[index - 1]}">
			<img class="flip-wraper__award" 
				ref="award"
				v-bind:class="{'flip-wraper__award--ani': isAwardAni[index - 1], 'flip-wraper__award--recover': isAwardRecover[index - 1]}" :src="awardImgs[index - 1] || emptyImg">
		</li>
	</ul>
</template>
<script>
	import Enum from 'common/enum.js'; 
	import util from 'common/util';
	import NativeInterface from 'common/nativeinterface';
	import DialogBuilder from 'base/DialogBuilder';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import LotteryMixin from 'base/LotteryMixin';
	import logger from 'common/logger';

	export default {
		name: 'Flip',
		data() {
			return {
				emptyImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
				lotteryChance: 0,
				index: 0,
				loadedImgs: {},
				zippos: [],
				isCoverAni: [false, false, false], //反面动画
				isCoverRecover: [false, false, false], //反面方向动画
				isAwardAni: [false, false, false], //正面动画
				isAwardRecover: [false, false, false], //正面反向
				awardImgs: []
			}
		},
		mixins: [LotteryMixin, BusinessCompMixin],
		props: {
			flipBgImg: {
				type: Object,
				default: ()=> ({'width': 301}),
				$rule: {
					name: '翻牌图片',
					clazz: Enum.CLAZZ.IMAGE
				},
			},
			flipAwards: {
				type: Array,
				default: ()=>([]),
				$rule: {
					name: '翻牌奖品图集',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		methods: {
			doLottery(index) {
				//logger.makeActivityLog('activity_prize_draw');
				if(!this.$checkVersion()) return;
				if(!NativeInterface.getUserId()) {
				    DialogBuilder.of(this).confirm('登录后才可以抽奖哦~', function() {
				        NativeInterface.login();
				    }, {confirmBtnTxt: '登录'});
				    logger.makeActivityLog('activity_not_login');
				    return;
				}
				if(this.times > 0) {
					if(this.playing) {
						return;
					};
					this.playing = true;
					this.index = index;
					this.$refs.target[index].classList.add('flip-wraper__item--rocking');
					this.startTime = Date.now();
					let zippoIds = this.zippos.map((zippo) => zippo.id).join(',');
                    //logger.makeActivityLog('activity_prize_complete');
                    logger.makeActivityLog('activity_prize_get');
					this.$store.dispatch('doLottery', {context: this, params:{zippo_ids: zippoIds}}).then((value) => {
                        this.showLotteryResult(value[0]);
                        //logger.makeActivityLog('activity_prize_get');
                        logger.makeActivityLog('activity_prize_got');
					}).catch((err) => {
					    this.playing = false;
					    DialogBuilder.of(this).alert('出错了！刷新看看～');
                        //logger.makeActivityLog("activity_prizebad_juge");//抽奖报错
                        logger.makeActivityLog('activity_prize_failed');
					});
				} else {
					//logger.makeActivityLog('activity_notimes_num');//无抽奖机会点击抽奖次数
					if(util.canGetMore()) {
					    DialogBuilder.of(this).alert(this.$lang.$$noTimesTitle, this.$lang.$$noTimesTips);
					} else {
					    DialogBuilder.of(this).alert(this.$lang.$$reallyNoTimesTitle, this.$lang.$$reallyNoTimesTips);
					}
				};
			},
			showLotteryResult(result) {
				let self = this;
				let index = self.index;
				if(result) {
					let award = null;
					let randomNum = 0;
					let imgUrls = [];
					let otherAwards = [];
					let otherFlipAwards = [];//todo
					let awardsMap = window.__ACTIVITY_CONFIG__.__AWARDS__;
					let flipAwardsMap = self.flipAwards;

					if(result.award_id != 0) { //中奖
						award = util.findAwardById(result.award_id);
						
						if(!award) {
							this.playing = false;
							DialogBuilder.of(this).alert('出错了！刷新看看~~');
							return;
						};
		
						for(let i = 0; i < awardsMap.length; i++) {
							let a = awardsMap[i];
							if(a.id != award.id) {
								otherAwards.push(a);
								otherFlipAwards.push(flipAwardsMap[i % flipAwardsMap.length])	
							};
						};
						randomNum = Math.floor(Math.random() * otherFlipAwards.length);
						imgUrls = [
							flipAwardsMap[award.idx % flipAwardsMap.length].url,
							otherFlipAwards[randomNum % otherFlipAwards.length].url,
							otherFlipAwards[(randomNum + 1) % otherFlipAwards.length].url
						];
					} else { //未中奖 
						let thanks = util.findAwardsByType(Enum.AWARD_TYPE.INTEGRATION);
						if(thanks.length) {
							award = util.randomFormArr(thanks);
							otherFlipAwards = flipAwardsMap.slice(0, flipAwardsMap.length-1); //最后配谢谢参与
							let i = Math.floor(Math.random() * otherAwards.length);
							imgUrls = [
								flipAwardsMap[flipAwardsMap.length-1].url,
								otherFlipAwards[i % otherFlipAwards.length].url,
								otherFlipAwards[(i + 1) % otherFlipAwards.length].url
							];
						} else {
							this.playing = false;
							DialogBuilder.of(this).alert('出错了！刷新看看~~~')
						};
					};
					this.loadImgs(imgUrls, 2000, function() {
						//let index = self.index;
						// let num = 1;

						// self.$refs.award[index].src = imgUrls[0];
						// self.$refs.award.forEach(function(el, i) {
						// 	if(i != index) {
						// 		el.src = imgUrls[num++];
						// 	};
						// });
						let imgs = [];
						imgs[index] = imgUrls[0];
						imgs[(index + 1) % 3] = imgUrls[1];
						imgs[(index + 2) % 3] = imgUrls[2];
						self.awardImgs = imgs;
						// let times;
						// clearTimeout(times);
						// times = 
						setTimeout(function() {
							self.flipCard(index);
							self.$delay(2500).then(() => {
								self.$showLotteryResult(award);
							});
						}, 1000);
					});
				};
			},

			loadImgs(imgUrls, timeout ,callback) {
			    var count = 0;
			    var self = this;
			    var timer = -1;
			    if(typeof timeout == 'function') {
			        callback = timeout;
			        timeout = 20000;
			    }
			    if(imgUrls.length && timeout > 0) {
			        timer = setTimeout(function() {
			            callback && callback();
			            callback = null;
			        }, timeout);
			    }
			    for(var i = 0; i < imgUrls.length; i++) {
		    		if(self.loadedImgs[imgUrls[i]]) {
		    		    if(++count == imgUrls.length) {
		    		        clearTimeout(timer);
		    		        callback && callback();
		    		    }
		    		    continue;
		    		}
			       
			        (function(url) {
			            var img = document.createElement('img');
			            img.onload = function() {
			                self.loadedImgs[url] = img;
			                if(++count == imgUrls.length) {
			                    clearTimeout(timer);
			                    callback && callback();
			                    callback = null;
			                }
			            };
			            img.src = url;
			        })(imgUrls[i]);  
			    }
			},

			flipCard(index) {
				let self = this;
				let $target = this.$refs.target;
				//let $imgCover = this.$refs.cover;
				//let $imgAward = this.$refs.award;
				$target[index].classList.remove('flip-wraper__item--rocking');
				//let $index = index + 1;
				this.$set(this.isCoverAni, index, true);
				this.$set(this.isAwardAni, index, true);

				setTimeout(function() {
					$target.forEach(function(el, idx) {
						if(idx != index) {
							self.$set(self.isCoverAni, idx, true);
							self.$set(self.isAwardAni, idx, true);
						};
					})
				}, 600);
			},

			reset() {
				//this.playing = false;
				let index = this.index;
				let $target = this.$refs.target
				//let $imgCover = this.$refs.cover;
				let $awardImg = this.$refs.award;

				//let $index = index + 1;
				let self = this;
				this.$set(this.isCoverRecover, index, true);
				this.$set(this.isAwardRecover, index, true);
				setTimeout(function() {
					$target.forEach(function(el, idx) {
						// let $idx = idx + 1;
						if(idx != index) {
							self.$set(self.isCoverRecover, idx, true);
							self.$set(self.isAwardRecover, idx, true);
						};
					});
					//清空上次抽奖奖品图,复原所有图片状态
					setTimeout(function() {
						// $awardImg.forEach(function(award) {
						// 	award.src = self.emptyImg;
						// });
						self.awardImgs = [];
						$target.forEach(function(el, idx) {
							//let $idx = idx + 1;
							self.$set(self.isCoverAni, idx, false);
							self.$set(self.isAwardAni, idx, false);
							self.$set(self.isCoverRecover, idx, false);
							self.$set(self.isAwardRecover, idx, false);
						});
					}, 1400);
					setTimeout(function() {
						self.playing = false;
					}, 1400);
				}, 600);
			}
		},
		watch: {
			playing: {
				handler: function(newVal) {
					if(!newVal) {
						this.$refs.target[this.index].classList.remove('flip-wraper__item--rocking');
					}
				}
			}
		}
	}
</script>