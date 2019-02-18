<style lang="less">
	.app {
		padding-bottom: 1.5rem;
	}
	.subscribe-btn {
		position: fixed;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
		bottom: 0;
		left: 0;
		width: 100%;
		// height: 1.5rem;
		height: 1.055556rem; // 114px
		padding:.138889rem 0;  // 15px
        box-sizing:content-box;

		&__btn {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 6.666667rem;
			height: 1.055556rem;
			border-radius: 999px;
			font-size: 0.444444rem;   // 48px
			font-weight: 500;
			background-color: #e94a43;
			color: #fff;
		}

		.divider {
			top: 0;
			bottom: auto;
		}
	}
</style>
<template>
	<div class="subscribe-btn">
		<button class="subscribe-btn__btn" :style="{'background-color': bgColor, 'color': color}" @click="doSubscribe()">{{ text }}</button>
		<div class="divider" :style="{'background-color': dividerColor}"></div>
	</div>
</template>
<script>
	import Enum from 'common/enum';
	import util from 'common/util';
	import util2 from 'common/util2';
	import logger from 'common/logger';
	import BusinessCompMixin from 'base/BusinessCompMixin';
	import Totast from 'base/Totast.vue';
	import TotastBuilder from 'base/TotastBuilder';
	import DialogBuilder from 'base/DialogBuilder';
	import NativeInterface from 'common/nativeinterface';
	//import channel from './channel';
	export default {
		name: 'SubscribeButton',
		mixins: [BusinessCompMixin],
		props: {
			unsubscribeBgColor: {
				type: String,
				default: '#e94a43',
				$rule: {
					name: '预约按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			subscribedBgColor: {
				type: String,
				default: '#e94a43',
				$rule: {
					name: '预约成功按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			unsubscribeColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '预约按钮文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			subscribedColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '预约成功按钮文字颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			unsubscribedText: {
				type: String,
				default: '立即预约',
				$rule: {
					name: '预约按钮文本'
				}
			},
			subscribedText: {
				type: String,
				default: '已预约',
				$rule: {
					name: '预约成功按钮文本'
				}
			},
			dividerColor: {
				type: String,
				default: 'rgba(0, 0, 0, .15)',
				$rule: {
					name: '分隔线颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			}
		},
		data() {
			return {
				subscribed: false,
				subscribeNums: 0,
			}
		},
		computed: {
			bgColor() {
				return this.subscribed ? this.subscribedBgColor : this.unsubscribeBgColor;
			},
			color() {
				return this.subscribed ? this.subscribedColor : this.unsubscribeColor;
			},
			text() {
				return this.subscribed ? this.subscribedText : this.unsubscribedText;
			},
			app() {
				let apps = util.getApps(1, 0);
				if(apps[0]) {
					return apps[0];
				} else {
					return {
			            'appId': '0',
			            'taskId': '0'
			        };
				}
			}
		},
		beforeMount() {
			if(NativeInterface.getUserId()) {
				this.$store.dispatch('fetchSubscribeApp', {context: this, params: {game_id: this.app.appId}}).then((res)=> {
					this.subscribed = res;
					if(this.subscribed) { //防止用户预约后 没等服务端返回 就退出 以后获取不到抽奖次数
						this.postTask(this.app.taskId);
						this.app._status = Enum.APP_STATUS.GOT;
					}
				}).catch((err)=> {

				});
				let pendingPostTasks = util.getPendingPostTasks();
                if(pendingPostTasks.indexOf(this.app.taskId) > -1) {
                    if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') < 6007001) {
                        return;
                    }
                    this.postTask(this.app.taskId);
                }
			}
		},
		mounted() {
			//获取预约数
			this.$store.dispatch('fetchAppInfos',{context:this,params:{'game_id':this.app.appId,'status':this.app.appStatus || 50}}).then((response)=> {
			    this.subscribeNums = response.subscribe_count;
			}).catch(() => {
			    TotastBuilder.of(this).show('出错了，请重试～<2002>');
			});
		},
		methods: {
			doSubscribe() {
				if(this.subscribed) {
					return;
				}
				if(!NativeInterface.getUserId()) { 
					DialogBuilder.of(this).alert('预约游戏需要先登录', function() {
						NativeInterface.login();
						this.dismiss();
					}, {
						confirmBtnTxt: '登录'
					});
					return;
				}
				logger.makeActivityLog('activity_subscribe_clicks', {app_id: this.app.appId || ''});
				this.$store.dispatch('postSubscribeApp', {
					context: this, 
					params: {game_id: this.app.appId, imei: util2.getUrlParam('imei'), sn: util2.getUrlParam('sn')}
				}).then((res)=> {
					TotastBuilder.of(this).show('预约成功！', 2000);
					this.subscribed = true;
					
					//7.1.1预约成功通知客户端
					let self = this;
					if(NativeInterface.getVersionCode('', 'com.meizu.flyme.gamecenter') >= 7001001) {
					    NativeInterface.subscribeSuccess(parseInt(self.app.appId), self.app.packageName, parseInt(self.subscribeNums));
					};

					logger.makeActivityLog('activity_subscribe_app', {app_id: this.app.appId || ''}); 

					this.postTask(this.app.taskId);
				}).catch((err)=> {
					TotastBuilder.of(this).show('预约失败，请重试！', 2000);
				});
			},
			postTask(taskId) {
				if(util.getStorage('task_' + taskId)) return;
                util.addPendingPostTask(taskId);
                //if(NativeInterface.getUserId()) {
					if(!this.$checkVersion()) return;
                    this.$store.dispatch('postTask', {context: this, params: {task_ids: taskId, content: {status: 2}}}).then((val) => {
                        util.setStorage('task_' + taskId, 2);
                        NativeInterface.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
                        util.tryRemovePendingPostTask(taskId);
						this.app._status = Enum.APP_STATUS.GOT;
                    }).catch((err)=> {
                    });
                // } else {
                //     DialogBuilder.of(this).alert('登录后才可以获取抽奖机会哦~', function() {
                //         this.dismiss();
                //         NativeInterface.login();
                //     }, {confirmBtnTxt: '登录'});
                // }   
            }
		}
	}
</script>