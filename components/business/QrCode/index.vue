<style lang="less">
	.qr-container {
	    position: relative;
	    margin: 0.611111rem 0;
	    background-color: #4440eb;
	    color: #000;
	    &__inner {
	        display: block;
	        width: 9.111111rem;
	        height: auto;
	        margin: 0 auto;
	    }
	    &__button {
	        width: 2rem;
	        height: 0.8rem;
	        position: absolute;
	        top: 48%;
	        right: 0.888889rem;
	        transform: translate(0, -50%);
	    }
	}
</style>

<template>
	<div class="qr-container">
	    <img class="qr-container__inner" :src="qrImg.url">
	    <div class="qr-container__button" @click="copyQrCode"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Enum from 'common/enum.js';
	import NativeInterface from 'common/nativeinterface.js';
	import BusinessCompMixin from 'base/BusinessCompMixin.js';
	import Totast from 'base/Totast.vue';
	import TotastBuilder from 'base/TotastBuilder.js'; 
	
	export default {
		name: 'QrCode',
		mixins: [BusinessCompMixin],
		props: {
			qrImg: {
				type: Object,
				default: ()=> ({url: require("../../assets/qr-code.jpg")}),
				$rule: {
					name: '二维码图片',
					clazz: Enum.CLAZZ.IMAGE
				},
			}
		},
		methods: {
			copyQrCode() {
				let self = this;
				self.isActive = true;
				NativeInterface.setClipContent("meizugame");
				let _Totast = Vue.extend(Totast);
				TotastBuilder.of(this).show('复制成功', 1500);
			}
		}
	}
</script>