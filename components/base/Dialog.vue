<style lang="less">
	@import "../style/import";
	
	.dialog {
        position: fixed;
		top: 50%;
		left: 50%;
		width: 8.055556rem;
		height: auto;
		background: @defaultBgColor;
		padding: 0.333333rem;
		border-radius: 0.111111rem;
		transform: translate3d(-50%, -50%, 0);
		/*box-shadow: 0 0 0.277778rem rgba(0, 0, 0, 0.3);*/

		&__header {
			padding: 0.25rem 0;
			text-align: center;
			font-size: 0.444444rem;
			font-weight: 500;
			line-height: 0.592593rem;
		}

		&__body {
			padding: 0.277778rem;
			max-height: 5.777778rem;
    		overflow-y: auto;
    		text-align: center;
    		font-size: 0.388889rem;
    		line-height: 0.6rem;
			&::-webkit-scrollbar {
				width: 2px;
			}

			/*定义滑块 内阴影+圆角*/
			&::-webkit-scrollbar-thumb {
			    border-radius: 999px;
			    background-color: rgba(0,0,0,0.1);
			}
		}

		&__footer {
			padding: 0.416667rem 0 0.388889rem 0;
			text-align: center;

			button + button {
				margin-left: 0.444444rem;
			}
		}

		&__cancel-btn, &__confirm-btn {
			border: 0;
			height: 0.944444rem;
			min-width: 2.777778rem;
			padding: 0 0.444444rem;
			background: @primaryColor;
			color: #fff;
			outline: none;
			.font-dpr(14px);
			font-weight: 500;
			line-height: 1rem;
			border-radius: 9999px;
		}

		/*&__cancel-btn, &__confirm-btn {
			&:active {
				background: darken(@defaultBgColor, 10%) !important;
			}
		}*/

		&__cancel-btn {
			color: #fff;
			background-color: #bdbdbb;
		}

		&__confirm-btn {

			&--deprecated {
				color: #fff !important;
				background-color: #bdbdbb !important;
			}

			&--primary {
				width: 5.074074rem;
			}
		}
	}
</style>
<template>
	<!-- <div class="dialog-container" @click="handleOuterClick"> -->
		<transition :name="transition" @after-leave="afterLeave" appear>
			<div class="dialog" v-show="open" @click.stop v-bind:style="{'z-index': zIndex, 'background-color': bgColor, 'color': fontColor}">
				<div class="dialog__header">
					<component v-if="!!title.cid" v-bind:is="title"></component>
					<slot v-else name="title">
						<div v-html="title"></div>
					</slot>
				</div>
				<div class="dialog__body" v-if="!!content" v-bind:style="{'background-color': bgColor}">
					<component v-if="!!content.cid" v-bind:is="content"></component>
					<slot v-else name="content" >
           				<div v-html="content"></div>     
          			</slot>
				</div>
				<div class="dialog__footer">
					<button class="dialog__cancel-btn" v-if="mode == 'confirm'" @click="handleCancel">{{cancelBtnTxt}}</button>
					<button class="dialog__confirm-btn" v-bind:class="{'dialog__confirm-btn--deprecated': disabled, 'dialog__confirm-btn--primary': mode != 'confirm'}" 
						@click="handleConfirm" v-bind:style="{'background-color': confirmBtnBgColor, 'color': confirmBtnFontColor}">{{confirmBtnTxt}}</button>
				</div>
			</div>
		</transition>
	<!-- </div> -->
</template>
<script>
	import Vue from 'vue';
	import HistoryTracker from './HistoryTracker';
	import OverlayManager from './OverlayManager';
	import util from 'common/util';
	import Enum from 'common/enum';
	export default {
		name: 'Dialog',
		props: ['$bgColor', '$pos'],
		props: {
			mode: {
				type: String,
				default: 'confirm'
			},
			onOuterClickDismiss: {
				type: Boolean,
				default: true
			},
			cancelBtnTxt: {
				type: String,
				default: '取消',
				$rule: {
					name: '取消按钮文本'
				}
			},
			confirmBtnTxt: {
				type: String,
				default: '确定',
				$rule: {
					name: '确定按钮文本'
				}
			},
			bgColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '对话框背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			fontColor: {
				type: String,
				default: '#000',
				$rule: {
					name: '对话框字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			confirmBtnBgColor: {
				type: String,
				default: '#f05036',
				$rule: {
					name: '确定按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			confirmBtnFontColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '确定按钮字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			onCancel: {
				type: Function
			},
			onConfirm: {
				type: Function
			},
			onDismiss: {
				type: Function
			},
			title: {},
			content: {},
			transition: {
				type: String,
				default: 'zoom'
			}
		},
		data: function() {
			return {
				open: true,
				destroy: true,
				zIndex: util.genZIndex(),
				disabled: false,
				stage: null
			}
		},
		beforeMount: function() {
			let createTime = Date.now();
			OverlayManager.requestOverlay(this, {
				zIndex: this.zIndex - 1,
				backgroundColor: 'rgb(0, 0, 0)',
				opacity: 0.4,
				onOverlayClick: ()=> {
					if(Date.now() - createTime > 500) {
						this.handleOuterClick();
					}
				}
			});
		},
		mounted: function() {
			HistoryTracker.trace(this, 'dismiss');
		},
		beforeDestroy: function() {
			OverlayManager.closeOverlay(this);
		},
		destroyed: function() {
			this.$el.remove();
		},
		methods: {
			handleCancel: function(evt) {
				if(this.onCancel) {
					this.onCancel(evt);
				} else {
					this.dismiss();
				}
			},
			handleConfirm: function(evt) {
				if(this.disabled) {
					return;
				}
				if(this.onConfirm) {
					this.onConfirm(evt);
				} else {
					this.dismiss();
				}
			},
			handleOuterClick: function() {
				if(this.onOuterClickDismiss) {
					this.dismiss();
				}
			},
			setDisabled: function(disabled) {
				this.disabled = disabled;
			},
			stageData: function(data) {
				this.stage = data;
			},
			clearData: function() {
				this.stage = null;
			},
			getData: function() {
				return this.stage;
			},
			dismiss: function() {
				this.open = false;
				this.onDismiss && this.onDismiss();
			},
			afterLeave: function() {
				if(this.destroy) {
					this.$destroy();
				}
			}
		}
	}
</script>