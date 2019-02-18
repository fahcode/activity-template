<style lang="less">
	.subscribe-marquee {
		&__mine {
			font-size: 0.388889rem;
			color: #e94a43;
			font-weight: 500;
			-webkit-tap-highlight-color: transparent;
		}
		&__tips {
			font-size: 0.333333rem;
			color: #000;
			text-align: center;
			opacity: .6;
			margin-top: 0.333333rem;
		}
	}
</style>
<template>
	<div class="subscribe-marquee">
		<SubscribeTitle>
			<a href="javascript:void(0)" class="subscribe-marquee__mine" :style="{color: myAwardColor}" @click="showMyAward()">我的奖品</a>
		</SubscribeTitle>
		<Marquee></Marquee>
		<p class="subscribe-marquee__tips" :style="{color: tipsColor}">{{ tipsText }}</p>
	</div>
</template>
<script>
	import Enum from 'common/enum';
	import util from 'common/util';
	import SubscribeTitle from '../SubscribeTitle/index.vue';
	import Marquee from '../Marquee/index.vue';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	export default {
		name: 'SubscribeMarquee',
		mixins: [BusinessCompMixin],
		props: {
			myAwardColor: {
				type: String,
				default: '#e94a43',
				$rule: {
					name: '‘我的奖品’文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			tipsColor: {
				type: String,
				default: '#000',
				$rule: {
					name: '提示文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			tipsText: {
				type: String,
				default: '* 活动期间预约游戏即可获得一次抽奖机会。',
				$rule: {
					name: '提示文本'
				}
			}
		},
		methods: {
			showMyAward() {
				this.$doMotion({type: Enum.MOTION.MY_AWARD, params: []});
			}
		},
		components: {
			SubscribeTitle,
			Marquee
		}
	}
</script>