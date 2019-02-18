<style lang="less">
	.rank {
		position: relative;
		background:transparent;
		transform:none!important;
	    &__title {
    	    width:8.648148rem;  // 934px
			padding:0 0 .166667rem 0;  // 0 0 18px 0
			margin:0 auto;
    		display: block;
	    }
	    &__block {
			width:8.62963rem;  // 932px
			border-radius:.092593rem;  // 10px
	    	position: relative;
	    	margin: 0 auto;
	    	background: rgba(0,0,0,0.25);
	    	overflow: hidden;
	    }
	    &__list {
			padding:.055556rem 0 .222222rem 0;  // 6px 0 24px 0
	    }
		&__list-item--title {
			height:.546296rem;  // 59px
			line-height:.546296rem;  // 59px
			padding:.138889rem 0 0 0; // 15px 0 0 0
			box-sizing:content-box;
			background:rgba(0,0,0,0.6);
			.title-item {
				padding:.055556rem 0 0 0;  // 6px
    			box-sizing: border-box;
				text-align:center;
				font-size:.240741rem;  // 26px
				color:#f5c887;
				position:relative;
			}
			.title-line {
				width:1px;
				height:.268519rem; 
				position:absolute;
				right:0;
				top:.157407rem;  // 17px
  				display:block;
				background-color:#f5c887;
			}
		}
	    &__list-item {
			padding:.055556rem 0 0 0;  // 6px
			height:.462963rem;   // 50px
			line-height:.462963rem;  // 50px
			box-sizing:border-box;
			&:nth-child(2n) {
	    		background:rgba(0,0,0,0.4);
	    	}
			.item {
				text-align:center;
				font-size:.240741rem;  // 26px
				color:#fff;
			}
	    }
		&__list-item--no {
			text-align:center;
			font-size:.240741rem;  // 26px
			color:#fff;
		}
		&__num {
			width:1.907407rem;  // 206px
			float:left;
		}
		&__id {
			width:2.481481rem;  // 268px
			float:left;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		&__award {
			width:2.712963rem;  // 293px
			float:left;
		}
	    &__more {
			width:1.305556rem;  // 141px
			height:.388889rem;  // 42px
			line-height:.388889rem;  // 42px
			padding:.018519rem 0 0 0;
			box-sizing:border-box;
			border-radius:.166667rem;  // 18px
    		position: absolute;
    	    right:.222222rem;  // 24px
			top:.166667rem;  // 18px
    	    background-color: #fff;
			font-size:.203704rem;  // 22px
			color:#fa0202;
			text-align:center;
    	    -webkit-tap-highlight-color: transparent;
    	    -webkit-user-select: none;
	    }
		.more__block {
			width:100%;
			height:100%;
			overflow:hidden;
			background:rgba(0,0,0,0.6);
			position:fixed;
			left:0;
			top:0;
			z-index:100;
			
			display:flex;
			flex-direction: column;
			.item {
				height: .462963rem;  // 50px
				line-height:.462963rem;  // 50px
				font-size:.240741rem; // 26px
				text-align:center;
				color:#fff;
			}
			.rank__award,
			.rank__num {
				width:2.12963rem;  // 230px
			}
			.rank__id {
				width:5.740741rem; // 620px
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
		}
		.more__back {
			padding:.740741rem 0 0 1.111111rem;  // 80px 0 0 120px
			line-height:.462963rem;  // 50px
			font-size:.277778rem;  // 30px
			text-align:left;
			color:#fff;
			position:relative;
		}
		.more__back-icon {
			width:.740741rem;  // 160px/2
			height:.462963rem;  // 100px/2
			background:url("../../assets/rank-back.png") no-repeat 0 center;
			background-size:100% 100%;
			position:absolute;
			left:.185185rem;  // 20px
			top:.703704rem;  // 76px
		}
		.more__title {
			padding:.277778rem 0 .277778rem 0; // 30px 0 30px 0
			border-bottom:1px solid #ccc;
			flex-grow:1;
			flex-shrink:1;
		}
		.more__content {
			height:auto;
			padding:.092593rem 0 0 0;  // 10px 0 0 0
			margin:0 0 .185185rem 0; // 0 0 20px 0;
			overflow: hidden;
			display: flex;
			flex-grow:1;
			.more__center {
				height: auto;
				box-sizing:border-box;
				overflow-x: hidden;
				overflow-y: scroll;
			}
			.more__list {
				
			}
		}
	}
</style>
<template>
	<div class="rank">
		<img class="rank__title" :src="rankTitle.url" />
		<div class="rank__block">
			<div class="rank__list-item--title">
				<div class="title-item rank__num" :style="{'color':titleColor}">名次<span class="title-line" :style="{'background-color':titleColor}"></span></div>
				<div class="title-item rank__id" :style="{'color':titleColor}">游戏ID<span class="title-line" :style="{'background-color':titleColor}"></span></div>
				<div class="title-item rank__award" :style="{'color':titleColor}">勋章数</div>
			</div>
			<ul ref="list" class="rank__list" v-if="rankList.length > 0">
				<li class="rank__list-item clearfix" :class="'rank__list-item--'+index" v-for="(one,index) in rankList.slice(0,5)">
					<div class="item rank__num" :style="{'color':fontColor}">{{index+1}}</div>
					<div class="item rank__id" :style="{'color':fontColor}">{{one.nickName}}</div>
					<div class="item rank__award" :style="{'color':fontColor}">{{one.matchPoint}}</div>
				</li>
			</ul>
			<ul class="rank__list" v-else>
				<li class="rank__list-item--no clearfix" :style="{'color':fontColor}">暂没有数据！</li>
			</ul>
			<div class="rank__more" 
				:style="{'background-color': moreBgColor, 'color':moreColor}"
				@click="showMore"
				v-if="rankList.length > 6">
				更多排行
			</div>
		</div>
		<div class="more__block" v-show="moreStatus">
			<div class="more__back"><div class="more__back-icon" @click.stop.prevent="hideMore"></div>总排行</div>
			<div class="more__title clearfix">
				<div class="item rank__num">名次</div>
				<div class="item rank__id">游戏ID</div>
				<div class="item rank__award">勋章数</div>
			</div>
			<div class="more__content">
				<div class="more__center">
					<ul class="more__list">
						<li class="more__list-item clearfix" v-for="(one,index) in rankList">
							<div class="item rank__num">{{index+1}}</div>
							<div class="item rank__id">{{one.nickName}}</div>
							<div class="item rank__award">{{one.matchPoint}}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Enum from 'common/enum';
	import util from 'common/util';
	import HistoryTracker from 'base/HistoryTracker';
	import DialogBuilder from 'base/DialogBuilder';
	import NativeInterface from 'common/nativeinterface';
  	import logger from 'common/logger';
	export default {
		name: 'Rank',
		props: {
			rankTitle: {
				type: Object,
				default: () => ({url: require("../../assets/rank-title.png")}),
				$rule: {
					name: '排行榜标题图片',
					clazz: Enum.CLAZZ.IMAGE
				}
			},
			titleColor: {
				type: String,
				default: '#f5c887',
				$rule: {
					name: '分类字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			fontColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '内容字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			moreBgColor: {
				type: String,
				default: '#fff',
				$rule: {
					name: '更多按钮背景颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
			moreColor: {
				type: String,
				default: '#fa0202',
				$rule: {
					name: '更多字体颜色',
					clazz: Enum.CLAZZ.COLOR
				}
			},
		},
		data() {
			return {
				rankList: [],
				moreStatus:false,
				float:{
					type:"float-layer",
					$destroy:() => {}
				},
				history:null
			}
		},
		mounted(){
			this.getMonthMatchRank()
		},
		methods: {
			//jsonp调用
			//响应参数:myRank=>用户排名,nickName=>用户昵称,matchPoint=>比赛积分
			getMonthMatchRank(){
				var  now  =  new  Date();
				var  month  =  ("0"  +  (now.getMonth()  +  1)).slice(-2);//当前月份
				var  uri  =  'month='+month;
				var  url  ='https://activity.12317wan.com/activity/newmobile/monthMatch/getMonthMatchRank?'+uri;
				Vue.http.jsonp(url, {
					jsonp:'callback', 
					jsonpCallback:'monthMatchRankCallback'
				}).then(res =>{
					let json = res.data
					if(json.ret==1){
						this.rankList = json.data
					}
				})
			},
			showMore() {
				this.history = this.dismissMore
				HistoryTracker.trace(this, 'dismissMore');
				this.moreStatus = true
			},
			hideMore(){
				this.moreStatus = false
				this.dismissMore = this.history
			},
			dismissMore(){
				this.hideMore()
			}
		},
		components: {
		}
	}
</script>