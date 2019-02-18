<style lang="less">
	@import url('../../style/import.less');
	.lottery-tips {
		margin: 0.953604rem 0.444444rem 0;
 		//border-left: 0.092593rem solid #fff;
 		border-left-width: 0.092593rem;
 		border-left-style: solid;
		display: flex;
		justify-content: space-between;
		align-items: center;
 		&__content {
 			height: 0.444444rem;
 			line-height: 0.444444rem;
 			&--left {
 				max-width: 60%;
 				.font-dpr(16px);
 				font-weight: 500;
 				overflow: hidden;
 				white-space: nowrap;
 				text-overflow:ellipsis;
 				padding-left: 0.222222rem;
 			}
 			&--right {
 				.font-dpr(14px);
 			}
 		}
 	}
</style>

<template>
    <div class="lottery-tips" v-bind:style="{'color': fontColor, 'border-left-color': borderColor}">
        <p class="lottery-tips__content lottery-tips__content--left">{{ playDesc }}</p>
        <p class="lottery-tips__content lottery-tips__content--right" 
        	v-if="hasLogged">
        	{{ timesDesc }}
        	<span v-bind:style="{'color': timesFontColor, 'font-weight': 500}">{{ $store.state.lotteryTimes }}</span>
        	次
        	</p>
        <p class="lottery-tips__content lottery-tips__content--right" 
        	v-else
        	v-on:click="logIn">{{ unLoginDesc }}</p>
    </div>
</template>

<script>
	import Enum from 'common/enum.js'; 
	import util from 'common/util';
	import NativeInterface from 'common/nativeinterface';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import LotteryMixin from 'base/LotteryMixin';

	export default {
		name: 'LotteryTimesBar',
		mixins: [BusinessCompMixin],
		data: function() {
			return {
				hasLogged: false 
			}
		},
		props: {
			borderColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '左侧竖线颜色',
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
			timesFontColor: {
			    type: String,
			    default: '#000',
			    $rule: {
			        name: '抽奖次数字体颜色',
			        clazz: Enum.CLAZZ.COLOR
			    }
			},
			playDesc: {
				type: String,
				default: '进行抽奖',
				$rule: {
					name: '玩法简介',
				}
			},
			timesDesc: {
				type: String,
				default: '剩余抽奖机会',
				$rule: {
					name: '抽奖次数描述',
				}
			},
			unLoginDesc: {
				type: String,
				default: '请登录抽奖',
				$rule: {
					name: '未登录状态描述',
				}
			}
		},
		mounted() {
			this.hasLogged = NativeInterface.getUserId();
		},
		methods: {
			logIn () {
				if(!NativeInterface.getUserId()) {
					NativeInterface.login();
				}
			}
		}
	}
	
</script>