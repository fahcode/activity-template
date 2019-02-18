<style lang="less">
	@import url('../../style/import.less');
	.game-info {
		margin-top: -0.074074rem;
		padding: 0 0.444444rem 0.333333rem;

		&__tips {
			width: 100%;
			height: 1.0rem;
			font-size: 0.388889rem;
			font-weight: 500;
			color: #000;
			text-align: center;
		}

		&__list-item {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			height: 2.703704rem;
			padding: 0.444444rem 0;
		}

		&__content {
			flex: 1;
			display: flex;
			flex-direction: column;
    		justify-content: space-between;
			height: 1.731481rem;
			
			h1 {
				font-size: 0.444444rem;
				font-weight: 500;
				line-height: 0.583333rem;
				.max-line(2);
			}

			p {
				opacity: .6;
			}

			a {
				color: inherit;
				-webkit-tap-highlight-color: transparent;
			}
		}

		&__center {
			color:inherit;
			-webkit-tap-highlight-color:transparent;
			display:flex;
			align-items:center;
			width:100%;
		}
		&__head-img {
			display: block;
			padding-left: 0.444444rem;
			width: 2.472222rem;
			height: 1.833333rem;
		}

		.divider {
			top: 0;
			bottom: auto;
		}

		&__jump {
			display: block;
			font-size: 0.388889rem;
			font-weight: 500;
			text-align: center;
			color: #e94a43;
			-webkit-tap-highlight-color: transparent;
		}
	}
</style>
<template>
	<div class="game-info">
		<div v-if="!infos.length" class="game-info__tips" :style="{color: color}">
			<span>{{ tips }}</span>
		</div>
		<div v-else class="game-info__list">
			<div v-for="info in infos" :key="info.id" class="game-info__list-item">
				<a class="game-info__center" href="javascript:void(0);" @click.stop.prevent="toNewsDetail(setLink(info.content_link))">
					<div class="game-info__content">
						<h1 class="game-info__title" :style="{color: color}">{{ info.title }}</h1>
						<p :style="{color: color, opacity: .6}">{{ numToStr(info.read_count) + '人看过 · ' + info.source_name}}</p>
					</div>
					<img v-if="info.head_image && info.head_image.length" class="game-info__head-img" :src="info.head_image[0]">
				</a>
				<div class="divider"></div>
			</div>
		</div>
		<a v-if="infos.length" class="game-info__jump" :style="{color: jumpColor}" @click="jump" href="javascript:void(0)">前往游戏论坛了解更多信息</a>
	</div>
</template>
<script>
	import util from 'common/util';
	import Enum from 'common/enum';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import DialogBuilder from 'base/DialogBuilder';
	import N from 'common/nativeinterface';
	export default {
		name: 'GameInfo',
		mixins: [BusinessCompMixin],
		props: {
			color: {
				type: String,
				default: '#000',
				$rule: {
					name: '文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			dividerColor: {
				type: String,
				default: 'rgba(255, 255, 255, .15)',
				$rule: {
					name: '分隔线颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			jumpColor: {
				type: String,
				default: '#e94a43',
				$rule: {
					name: '跳转文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			jumpUrl: {
				type: String,
				default: '#',
				$rule: {
					name: '论坛跳转URL'
				}
			}
		},
		data() {
			return {
				infos: [],
				tips: '正在加载中..'
			}
		},
		computed: {
			app() {
				let apps = util.getApps(1, 0);
				if(apps[0]) {
					return apps[0];
				} else {
					return {         
			            'appId': '',
			            'packageName': '',
			        };
				}
			}
		},
		beforeMount() {
			this.loadData();
		},
		methods: {
			numToStr(num) {
				num = Number(num);
				if(isNaN(num)) {
					return '0';
				}
				if(num < 10000) {
					return num;
				}
				if(num < 100000000) {
					return parseInt(num / 10000) + '万';
				}
				return parseInt(num / 100000000) + '亿';
			},
			loadData() {
				this.$store.dispatch('fetchGameInfo', {context: this, params: {appId: this.app.appId}}).then((res)=> {
					let data = res.slice(0, 2);
					data.forEach((obj)=> {
						if(obj.head_image) {
							try {
								obj.head_image = JSON.parse(obj.head_image);
							} catch(err) {
								obj.head_image = [];
							}
						}
					});
					this.infos = data;
					if(!this.infos.length) {
						this.tips = '暂无数据';
					}
				}).catch(()=> {
					this.tips = '拉取资讯失败，请刷新重试！';
				});
			},
			jump() {
				if(!this.jumpUrl || this.jumpUrl == '#') return;
				N.getToken().then((token)=> {
					let jumpUrlWithToken = this.jumpUrl;
					if(this.jumpUrl.indexOf('?') == -1) {
						jumpUrlWithToken += `?token=${token}`;
					} else {
						jumpUrlWithToken += `&token=${token}`;
					}
					window.location.href = jumpUrlWithToken;
				}).catch((err)=> {
					if(!err) {
						DialogBuilder.of(this).confirm('提示', '请先登录~', ()=> {
							N.login();
						});
					} else {
						DialogBuilder.of(this).alert('提示', '版本过低，请升级客户端~');
					}
				});
			},
			toNewsDetail(link){
				 N.toNewsDetail(link)
			},
			setLink(link){
				let arr = link.split('?')
				if(arr.length > 1){
					return link+'&client=gamesdk'
				}else {
					return link+'?client=gamesdk'
				}
			}
		}
	}
</script>