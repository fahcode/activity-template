import Enum from 'common/enum';
export default {
	props: {
		$pos: {
			type: Boolean,
			default: true,
			$rule: {
				name: '占位'
			}
		},
		$bgColor: {
	        type: String,
	        default: process.env.NODE_ENV == 'production' ? 'transparent' : '#ececec',
	        $rule: {
	            name: '背景颜色',
	            clazz: Enum.CLAZZ.COLOR
	        }
      	},
		$bgImg: {
			type: Object,
			default:()=>({}),
			$rule: {
				name: '背景图片',
				clazz: Enum.CLAZZ.IMAGE
			}
		}
	},
	watch: {
		$pos: {
			handler: function(newVal) {
				if(this.$vnode) {
					let val = this.$vnode.data.staticStyle['position'] = !newVal ? 'absolute' : '';
					if(!this.$config) {
						this.$config = {};
					}
					if(!this.$config.staticStyle) {
						this.$config.staticStyle = {};
					}
					this.$config.staticStyle['position'] = val;
					if(this.$el) { //用于用户动态改变时
						this.$el.style['position'] = val;
					}
				}
			},
			immediate: true
		},
		$bgColor: {
			handler: function(newVal) {
				if(this.$vnode) {
					let val = this.$vnode.data.staticStyle['background-color'] = !newVal ? 'transparent' : newVal;
					if(!this.$config) {
						this.$config = {};
					}
					if(!this.$config.staticStyle) {
						this.$config.staticStyle = {};
					}
					this.$config.staticStyle['background-color'] = val;
					if(this.$el) { //用于用户动态改变时
						this.$el.style['background-color'] = val;
					}
				}
			},
			immediate: true
		},
		$bgImg: {
			handler: function(newVal) {
				let bgImg = '';
				let bgSize = '';
				if(newVal.url) {
					bgImg = this.$vnode.data.staticStyle['background-image'] = `url('${newVal.url}')`;
					bgSize = this.$vnode.data.staticStyle['background-size'] = `100% 100%`;
				} else {
					this.$vnode.data.staticStyle['background-image'] = '';
					this.$vnode.data.staticStyle['background-size'] = '';
				}
				if(!this.$config) {
					this.$config = {};
				}
				if(!this.$config.staticStyle) {
					this.$config.staticStyle = {};
				}
				this.$config.staticStyle['background-image'] = bgImg;
				this.$config.staticStyle['background-size'] = bgSize;
				if(this.$el) { //用于用户动态改变时
					this.$el.style['background-image'] = bgImg;
					this.$el.style['background-size'] = bgSize;
				}
			},
			immediate: true
		}
	}
}