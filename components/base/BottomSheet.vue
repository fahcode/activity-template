<style lang="less">
	@import '~components/style/import.less';
	.slideup-enter-active, .slideup-leave-active {
		transition: transform .36s ease;
	}
	.slideup-enter, .slideup-leave-active {
		transform: translateY(100%);
	}
	.bottom-dialog {
        position: fixed;
        display: flex;
        flex-direction: column;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 12.222222rem; //1320
		background: #fff;
		&__header {
			padding: 0.888889rem 0 0.5rem 0;
			text-align: center;
			font-size: 0.555556rem;
			font-weight: 500;
		}
		&__body {
			padding: 0 0.555556rem;
			font-size: 0.388889rem;
			line-height: 0.555556rem;
            //max-height: 10rem;
            flex: 1;
    		overflow-y: auto;
			&::-webkit-scrollbar {
				width: 2px;
			}
			&::-webkit-scrollbar-thumb {
			    border-radius: 999px;
			    background-color: rgba(0,0,0,0.1);
			}
		}
		/* &__footer {
			&__button {
				width: 6.5rem;
				height: 1.055556rem;
				line-height: 1.055556rem;
				border-radius: 999rem;
				text-align: center;
				font-weight: 500;
				font-size: 0.444444rem;//16px
				position: absolute;
				bottom: 0.361111rem;
				left: 50%;
				transform: translateX(-50%);
			}
		} */
	}
</style>
<template>
	<transition name="slideup" @after-leave="$destroy()" appear>
		<div class="bottom-dialog" v-show="open" :style="{'z-index': zIndex, 'background-color': bgColor, 'color': fontColor, 'height': fullPage ? '100%': getBgHeight}">
			<div class="bottom-dialog__header" :style="{'padding': headerPadding}">
				<component v-if="title&&!!title.cid" :is="title"></component>
				<slot v-else name="title">
					<div v-html="title"></div>
				</slot>
			</div>
			<div class="bottom-dialog__body">
				<component v-if="content&&!!content.cid" :is="content"></component>
				<slot v-else name="content">
					<div v-html="content"></div>
				</slot>
			</div>
			<!-- <div v-if="mode == 'alert'" class="bottom-dialog__footer">
				<div class="bottom-dialog__footer__button" :style="{'background-color': btnBgColor, 'color': btnFontColor}">保存</div>
			</div> -->
		</div>
	</transition>
</template>
<script>
	import ModalMixin from 'base/ModalMixin';
	import Enum from 'common/enum';
	export default {
		name: 'BottomSheet',
		mixins: [ModalMixin],
		props: {
			title: {},
			content: {},
			mode: {
				type: String,
				default: 'show'
			},
			fullPage: {
				default: false
			},
			bgColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '滑出框背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			fontColor: {
				type: String,
				default: '#000',
				$rule: {
					name: '滑出框字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			bgHeight: {
				type: Number,
				default: 1160,
				$rule: {
					name: '滑出框的高度'
				}
			},
			/*btnBgColor: {
				type: String,
				default: '#ff0000',
				$rule: {
					name: '按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			btnFontColor: {
				type: String,
				default: '#ffffff',
				$rule: {
					name: '按钮字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},*/

		},
		data() {
			return {}
		},
		computed: {
			getBgHeight(){
				return (this.bgHeight/108).toFixed(5) + "rem";
			},
			headerPadding(){
				if(this.bgHeight>1300){
					return `.888889rem 0 .5rem`;//96 54
				}else if(this.bgHeight>1160){
					return `.740740rem 0 .370370rem`; //80 40
				}else{
					return `.6481481rem 0 .27777rem`; //70 30
				};
			}
		},
		methods: {
			close() {
				this.open = false;
			}
		}
	}
</script>