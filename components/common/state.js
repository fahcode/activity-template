import Vue from 'vue';
import { request, oauthRequest, createSilentParams} from './request';
import Ninterface from './nativeinterface.js';
import util2 from './util2.js';
let URL_PARAMS = {};
let API_PREFIXER = '';
if(util2.isInBrowser()) {
  URL_PARAMS = {
    imei: util2.getUrlParam('imei'),
    sn: util2.getUrlParam('sn')
    // firmware: util2.getUrlParam('firmware')
  };
  if(process.env.NODE_ENV == 'production') {
    API_PREFIXER = window.location.protocol + '//api-game.meizu.com/games';
  } else {
    API_PREFIXER = '/games';
  }
}

const DEFAULT_PLAYERINFO = {
  "address": '', 
  "imei": '',
  "message": null,
  "mobile": '',
  "postcode": '',
  "recipient": '', 
  "uid": null
}

export const state = {
  activityName: "", //活动名称
  lotteryAward: {}, //中奖奖品
  myAwards: [], //我的奖品
  winnerList: [], //中奖名单
  wishList:[],  // 许愿名单
  playerInfo: DEFAULT_PLAYERINFO, //玩家信息
  zippoTimes: [], //抽奖次数
  lotteryTimes: 0, //抽奖次数 filter之后
  userInfo: {}, //用户个人信息
  chargePhoneNumber: '', //充值话费或流量的号码
  finishedTasks: [],
  components: { //组件ui状态
    'activity-title': {
      titleType: 0
    }
  },
  lowerVersion:false  // 低版本是否已弹窗提醒，如果已弹，不再提醒
};

export const mutations = {
  setLowerVersion(state,status){
    state.lowerVersion = status
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  setZippoTimes(state, zippoTimes) {
    state.zippoTimes = zippoTimes;
  },
  setFinishedTasks(state, tasks) {
    state.finishedTasks = tasks;
  },
  setLotteryTimes(state, lotteryTimes) {
    state.lotteryTimes = lotteryTimes;
  },
  setMyAwards(state, myawards) {
    state.myAwards = myawards;
  },
  setWinnerList(state, winnerlist) {
    state.winnerList = winnerlist;
  },
  setWishList(state,wishList) {
    state.wishList = wishList;
  },
  setChargePhoneNumber(state, chargePhoneNumber) {

  },
  // tryAbortRequest(state, url) {
  //   var requests = state.pendingRequests;
  //   var len = requests.length;
  //   while(len--) {
  //     if(requests[len].url.indexOf(url) != -1) {
  //       requests[len].abort();
  //       requests.splice(len, 1);
  //     }
  //   }
  // },
  // addPendingRequest(state, request) {
  //   state.pendingRequests.push(request);
  // },
  // removePendingRequest(state, request) {
  //   var pos = state.pendingRequests.indexOf(request);
  //   if(pos != -1) {
  //     state.pendingRequests.splice(pos, 1);
  //   }
  // },
  setPlayerInfo(state, playerInfo) {
     state.playerInfo = playerInfo || DEFAULT_PLAYERINFO
  },
  /* setActivityName(state, activityName){
    state.activityName = activityName;
  } */
};
export const actions = {
  fetchMyAwards({commit}, {context, params}) {
    params = params || {};
    if(process.env.NODE_ENV != 'production') {
      params.awardIds = window.__ACTIVITY_CONFIG__.__AWARDS__.map(function(award) {
        return award.id;
      });
    }
    params.uid = Ninterface.getUserId();
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/public/activity/award/user/${window.__ACTIVITY_ID__}`, params, 'setMyAwards'); 
  },
  fetchAwardsUse({commit}, {context, params}) {
    return request.call(context, 
    `${API_PREFIXER}${Vue.__REQ_ENV__}/public/activity/awards/${window.__ACTIVITY_ID__}`, params); 
  },
  fetchWinnerList({commit}, {context, params}) {
    return request.call(context, 
    `${API_PREFIXER}${Vue.__REQ_ENV__}/public/activity/award/latest/${window.__ACTIVITY_ID__}`, params, 'setWinnerList'); 
  },
  fetchWishList({commit}, {context, params}) {
    return request.call(context, 
    `${API_PREFIXER}${Vue.__REQ_ENV__}/public/activity/wish/${window.__ACTIVITY_ID__}`, params, 'setWishList'); 
  },
  fetchPlayerInfo({commit}, {context, params}) {
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/player_info/get`, params, 'setPlayerInfo');
  },
  fetchLotteryTimes({commit}, {context, params}) {
    params = createSilentParams(params);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/zippo/times/${window.__ACTIVITY_ID__}`, params, function(value) {
      if(value) {
          commit('setZippoTimes', value.zippoTimes);
          commit('setFinishedTasks', value.tasks || []);
          commit('setUserInfo', value.userInfo); 
      }
    });
  },
  postPlayerInfo({commit, state}, {context, params}) {
    params = Object.assign(params || {}, state.playerInfo);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/player_info/save`, params);
  },
  ///oauth/activity/traffic/do/
  postTraffic({commit, state}, {context, params}) {
    params = Object.assign({phonNum: state.chargePhoneNumber}, createSilentParams(params || {}));
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/traffic/do/${window.__ACTIVITY_ID__}`, params);
  },
  postCharge({commit, state}, {context, params}) {
    params = Object.assign({phonNum: state.chargePhoneNumber}, createSilentParams(params || {}));
    //return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/charge/do/${window.__ACTIVITY_ID__}`, params);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/receive/do/${window.__ACTIVITY_ID__}`, params);
  },
  postTask({commit, state}, {context, params}) {
    params = Object.assign(params || {}, URL_PARAMS);
    params = createSilentParams(params);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/task/do/${window.__ACTIVITY_ID__}`, params);
  },
  getUserGameLevel({commit, state}, {context, params}) {
    params = Object.assign(params || {}, URL_PARAMS);
    params = createSilentParams(params);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/user/role/level/${window.__ACTIVITY_ID__}`, params);
  },
  // 获取周卡详情
  getWeekCardInfo({ commit, state }, { context, params }) {
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/user/card/${window.__ACTIVITY_ID__}`, params);
  },
  doLottery({commit},{context, params}) {
    params = Object.assign(params || {}, URL_PARAMS);
    params = createSilentParams(params);
    if(process.env.NODE_ENV != 'production') {
      params.__awardIds__ = window.__ACTIVITY_CONFIG__.__AWARDS__.map(function(award) {
        return award.id;
      });
      params.__mockAward__ = Vue.__META__.mockAward;
    }
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/activity/zippo/do/${window.__ACTIVITY_ID__}`, params);
  },
  //test
  fetchMockAwards({commit}, {context}) {
    return request.call(context, `/games/mock/awards?count=${Vue.__META__.awardsCount}`, {__silent__:true}, function(awards) {
      window.__ACTIVITY_CONFIG__.__AWARDS__ = awards;
    });
  },

  fetchMockApps({commit}, {context}) {
    return request.call(context, `/games/mock/apps`, {__silent__:true}, function(apps) {
      window.__ACTIVITY_CONFIG__.__APPS__ = apps;
    });
  },
  fetchMockZippos({commit}, {context}) {
    return request.call(context, `/games/mock/zippos`, {__silent__:true}, function(zippos) {
      window.__ACTIVITY_CONFIG__.__ZIPPOS__ = zippos;
    });
  },
  fetchMockTasks({commit}, {context}) {
    return request.call(context, `/games/mock/tasks`, {__silent__:true}, function(tasks) {
      window.__ACTIVITY_CONFIG__.__TASKS__ = tasks;
    });
  },
  //获取app信息
  fetchAppInfos({commit},{context, params}) {
    params = createSilentParams(params);
    return request.call(context, 
    `${API_PREFIXER}${Vue.__REQ_ENV__}/public/detail/${params.game_id}`, params); 
  },
  //预约app
  fetchSubscribeApp({commit}, {context, params}) {
    params = createSilentParams(params);
    return oauthRequest.call(context,`${Vue.__REQ_ENV__}/oauth/subscribe/${params.game_id}/subscribed`, params)
  },
  postSubscribeApp({commit}, {context, params}) {
    params = createSilentParams(params);
    return oauthRequest.call(context,`${Vue.__REQ_ENV__}/oauth/subscribe/add/${params.game_id}`, params)
  },
 
  fetchGameInfo({commit}, {context, params}) {
    params = Object.assign({start: 0, max: 5}, params);
    params = createSilentParams(params);
    return request.call(context, 
      `${API_PREFIXER}${Vue.__REQ_ENV__}/information/relate/infos`, params); 
  },

  fetchGameDetail({commit}, {context, params}) {
    params = createSilentParams(params);
    return request.call(context, `${API_PREFIXER}${Vue.__REQ_ENV__}/public/detail`, params);
  },
  //反馈问题
  postIssues({ commit, state }, { context, params }) {
    //params = Object.assign(params || {}, state.playerInfo);
    return oauthRequest.call(context, `${Vue.__REQ_ENV__}/oauth/worksheet/add`, params);
  }
}