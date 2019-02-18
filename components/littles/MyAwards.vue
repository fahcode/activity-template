n<style lang="less">
@import '../style/import';
.dialog__body--fixed {
	padding: 0 .27777rem 0 .27777rem;
	margin-bottom: .5rem;
}
.my-awards {
	&__item {
		position: relative;
		text-align: left;
		height: 2.027778rem;
	}

	&__item:last-child {
		border: none;
	}

	&__icon {
		display: inline-block;
		width: 1.4rem;
		height: 1.4rem;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: contain;
		position: absolute;
		top: 12%;
	}

	&__info {
		display: inline-block;
		width: 78.5%;
		margin-bottom: .35rem;
		font-size: 0.444444rem;
		position: absolute;
	    left: 21%;
	    top: 36%;
		.name {
			display: inline-block;
			max-width: 3.7rem;
		}
		.count {
			margin-left: .1rem;
			opacity: .8;
		}
		.btn {
			display: inline-block;
			font-size: 0.333333rem;
			border-radius: 999rem;
			text-align: center;
			float: right;
		}
		.cp-btn {
			width: 1.555556rem; //168px
			height: 0.611111rem; //66px
			border-width: 1px;
			border-style: solid;
			line-height: 0.611111rem;
		}
		.get-btn {
			width: 1.611111rem; //174px
			height: 0.666667rem; //72px
			line-height: 0.75rem;
		}
		.address-btn {
			width: 1.611111rem;
			height: 0.666667rem;
			line-height: 0.75rem;
		}
	}
	/* &__tips {
		right: 0;
		bottom: 0;  
		text-align: left;
		font-size: .333333rem;
		padding-bottom: 5px;
		.address {
			display: inline-block;
			.one-line();
			width: 4.092593rem;
			vertical-align: bottom;
		}
		a {
			color: red;
			padding-left: .277778rem;
			-webkit-tap-highlight-color: transparent;
		}
		&--phone {
			text-align: right;
		}
	} */
	&__divider {
		height: 2px;
		transform: scaleY(0.5) translateZ(0);    
		margin-top: .7rem;
	}
	&__empty {
		text-align: center;
		img {
			width:4.833333rem;
			height:4.833333rem
		}
		p {
			opacity: .5;
		}
	}
}
</style>
<template>
<div class="my-awards">
	<ul v-if="infos.length">
		<li class="my-awards__item" v-for="info in infos">
			<div class="my-awards__icon" :style="{'background-image':'url(' + info.icon + ')'}"></div>
			<div class="my-awards__info">
				<span class="name">{{info.name}}</span>
				<span class="count">x{{info.count}}</span>
				<div v-if="info.type == 'COUPON'" class="cp-btn btn" :style="{'background-color': 'transparent', 'color': btnColor, 'border-color': btnColor}" @click="goToCoupon()">查看</div>
				<div v-if="info.type == 'GIFT'" class="cp-btn btn" :style="{'background-color': 'transparent', 'color': btnColor, 'border-color': btnColor}" @click="goToMyGifts()">查看</div>
				<div v-else-if="info.type == 'MATERIAL' || info.type == 'MATERIAL100'" class="address-btn btn" :style="{'background-color': btnBgColor, 'color': btnColor}" @click="$doMotion(motion)">{{ playerInfo && playerInfo.address ? '修改地址' : '填写地址' }}</div>
				<div v-else-if="info.type == 'RATEOFFLOW' || info.type == 'TELCHARGE'" class="get-btn btn" :style="{'background-color': btnBgColor, 'color': btnColor}" @click="getRateOrTel(info.type,info)">{{info.hasGotRateOrTel ? '已领取': '领取'}}</div>
				<div v-else-if="info.type == 'VIRTUAL'" class="get-btn btn" :style="{'background-color': btnBgColor, 'color': btnColor}" @click="getVirtual(info.type,info)">{{info.hasGotVirtual ? '查看': '领取'}}</div>
				<div v-if="infos.length > 1 ? true: false" class="my-awards__divider" :style="{'background-color': dividerColor}"></div>
			</div>
			<!-- <div class="my-awards__tips" v-else-if="info.type == 'MATERIAL' || info.type == 'MATERIAL100'">收货地址：<span class="address">{{ playerInfo && playerInfo.address ? playerInfo.address : '无' }}</span><a href="javascript:void(0);" @click="$doMotion(motion)" :style="{color: addressTxtColor}">{{ playerInfo && playerInfo.address ? '修改' : '填写' }}</a></div>
			<p class="my-awards__tips my-awards__tips--phone" v-else-if="(info.type == 'RATEOFFLOW' || info.type == 'TELCHARGE') && (infos.length != 1)" :style="{color: addressTxtColor}" @click="getRateOrTel(info)">{{info.hasGotRateOrTel ? "已领取" : "去领取"}}</p>
			<div v-if="infos.length > 1 ? true: false" class="my-awards__divider"></div> -->
		</li>
	</ul>
	<div v-else class="my-awards__empty">
	    <img src="../assets/empty.png">
	    <p>你还没有获得奖品，赶紧参与活动吧！</p>
	</div>
</div>
</template>
<script>
	import Vue from 'vue';
	import Enum from '../common/enum';
	import util from '../common/util';
    import NativeInterface from 'common/nativeinterface';
    import util2 from 'common/util2';
	import DialogBuilder from '../base/DialogBuilder';

	export default {
		name: 'MyAwards',
		data() {
			return {
				motion: {'type':Enum.MOTION.ADDRESS}
			}
		},
		props: {
			infos: {},
			btnBgColor: {
				type: String,
				default: '#ff0000',
				$rule: {
					name: '按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			btnColor: {
				type: String,
				default: '#a0a0a0',
				$rule: {
					name: '按钮字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
            dividerColor: {
                type: String,
                default: 'rgba(0,0,0,0.1)',
                $rule: {
                    name: '分割线颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
		},
		mounted() {
			var self = this;
			this.$store.dispatch('fetchPlayerInfo', {context: this});
			/*this.$nextTick(() => {
			document.querySelector('.dialog__body').classList.add('dialog__body--fixed');
			});*/
			//todo
			this.infos.forEach(function(info, index) {
				if(info.type == "RATEOFFLOW" && ( info.status!=0||util.getStorage("ratePhone_" + info.awardRecordId) )) {
					info = Object.assign({}, info, {hasGotRateOrTel: true});
					self.$set(self.infos, index, info);
				}
				if(info.type == "TELCHARGE" && ( info.status!=0||util.getStorage("telPhone_" + info.awardRecordId) )) {
					info = Object.assign({}, info, {hasGotRateOrTel: true});
					self.$set(self.infos, index, info);
				}
				if(info.type == "VIRTUAL" && ( info.status!=0||util.getStorage("virtualPhone_" + info.awardRecordId) )) {
					info = Object.assign({}, info, {hasGotVirtual: true});
					self.$set(self.infos, index, info);
				}
			});
		},
		computed: {
			playerInfo() {
				return this.$store.state.playerInfo
			}
		},
		methods: {
			goToCoupon() {
				if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 6008000) {
				    NativeInterface.toMyCoupon();
				} else {
				    NativeInterface.toHome('feed');
				}
			},
			goToMyGifts() {
				if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 6008000) {
				    NativeInterface.toMyGifts();
				} else {
				    NativeInterface.toHome('feed');
				}
			},
			getRateOrTel(type, info) {
				if(type == 'TELCHARGE' && info.hasGotRateOrTel) return;
				if(type == 'RATEOFFLOW' && info.hasGotRateOrTel) return;
                this.$parent.hasOwnProperty('dismiss') && this.$parent.dismiss();
                this.$delay(800).then(()=> {
                    this.$doMotion({"type": Enum.MOTION.PHONE, params: [info.type, info.id, info.awardRecordId]});
                });
			},
			getVirtual(type,info){
                this.$parent.hasOwnProperty('dismiss') && this.$parent.dismiss();
                this.$delay(800).then(()=> {
                    //已经有号码了
                    if(type == 'VIRTUAL' && info.hasGotVirtual){
                        //已经分配code
                        if(!!info.code){
                            DialogBuilder.of(this).alert(`${info.name}`, `卡密：${info.code}`);
                        }else{
                            DialogBuilder.of(this).alert(`提示`, '正在分配奖品，请稍后查看！');
                        }
                        return;
                    }
                    this.$doMotion({"type": Enum.MOTION.PHONE, params: [info.type, info.id, info.awardRecordId]});
                });
				
			}
		}
	}
</script>