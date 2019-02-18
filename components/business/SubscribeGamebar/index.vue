<style lang="less">
	@import url('../../style/import.less');
	.subscribe-gamebar {
		position: relative;
		width: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        min-height: 5rem;
        padding-bottom: 0.444444rem;

        &__bar {
        	position: absolute;
        	display: flex;
        	align-items: center;
        	left: 0;
        	bottom: 0.444444rem;
        	width: 100%;
        	height: 1.796296rem;
        	padding: 0 0.444444rem;
        }

        &__icon {
    		flex-shrink: 0;
        	width: 1.796296rem;
        	height: 1.796296rem;
        	margin-right: 0.444444rem;
        }

        &__content {
        	flex: 1;
        	display: flex;
        	flex-direction: column;
        	justify-content: space-between;
        	height: 1.648148rem;
        	color: #000;

        	h1 {
        		font-size: 0.444444rem;
        		font-weight: 500;
        		.one-line();
        		width: 80%;
        	}

        	p {
        		opacity: .6;
        		font-size: 0.333333rem;
        	}
        }
	}
</style>
<template>
	<div class="subscribe-gamebar"  v-bind:style="{'background-image': imgVal,'height': $toRem($bgImg.height)}">
		<div class="subscribe-gamebar__bar">
			<LazyImage class="subscribe-gamebar__icon" :src="appIconVal"></LazyImage>
			<div class="subscribe-gamebar__content" :style="{color: color}">
				<h1>{{ appNameVal || '----' }}</h1>
				<p>{{ appDes }}</p>
				<p>{{ subscribeCount }}人已预约</p>
			</div>
		</div>
	</div>
</template>
<script>
	import Enum from 'common/enum';
	import util from 'common/util';
	import logger from 'common/logger';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import LazyImage from 'base/LazyImage.vue';
	import TotastBuilder from 'base/TotastBuilder';
	//import channel from '../SubscribeButton/channel';
	export default {
		name: 'SubscribeGameBar',
		mixins: [BusinessCompMixin],
		props: {
            $bgImg: {
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            color: {
            	type: String,
            	default: '#000',
            	$rule: {
            		name: '文字颜色',
            		clazz: Enum.CLAZZ.COLOR
            	}
            },
            appIcon: {
            	type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '游戏ICON(可不填)',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            appName: {
            	type: String,
            	default: '游戏名称',
            	$rule: {
            		name: '游戏名称(可不填)'
            	}
            },
            appDes: {
            	type: String,
            	default: '游戏描述',
            	$rule: {
            		name: '游戏描述'
            	}
            }
        },
        data() {
        	return {
        		subscribeCount: 0
        	}
        },
        computed: {
            imgVal() {
                return util.getImgCSSVal(this.$bgImg);
            },
            app() {
            	let apps = util.getApps(1, 0);
				if(apps[0]) {
					return apps[0];
				} else {
					return {         
			            'name': '',
			            'appId': '',
			            'packageName': '',
			            'icon': ''
			        };
				}
            },
            appNameVal() {
            	if(this.appName) {
            		if(process.env.NODE_ENV != 'production') {
            			return this.appName;
            		}
            		if(this.appName != '游戏名称') {
            			return this.appName;
            		}
            	}
            	return this.app.name;
            },
            appIconVal() {
            	let icon = '';
            	if(this.appIcon.url) {
            		icon = this.appIcon.url;
            	} else {
            		icon = this.app.icon;
            	}
            	return icon;
            }
        },
        beforeMount() {
        	this.$store.dispatch('fetchGameDetail', {context: this, params: {package_name: this.app.packageName}})
        		.then((res)=> {
        			this.subscribeCount = res.subscribe_count;
        		})
        		.catch((err)=> {
        			TotastBuilder.of(this).show('拉取预约信息失败！', 2000);
        		});
        },
        // mounted() {
        // 	channel.on('update_subscribed_count', (count)=> {
        // 		this.subscribeCount = count;
        // 	});
        // },
        // beforeDestroy() {
        // 	channel.off('update_subscribed_count');
        // },
        methods: {
        	// goAppInfo() {
        	// 	this.$doMotion({type: Enum.MOTION.GO_APP_INFO, params: [this.app.appId, this.app.packageName, this.app.name]});
        	// }
        },
        components: {
        	LazyImage
        }
	}
</script>