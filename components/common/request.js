import VueResource from 'vue-resource'
import Vue from 'vue'
import Ninterface from './nativeinterface.js';
import LoadingBuilder from '../base/LodingBuilder';

const SHOW_LOADING_TIMEOUT = 800;

const NORMALIZE_ERROR_RES = {code: 100, message: 'error request'}; //统一错误返回值

const oauthRequestQueue = []; //为的是 在第一个oauth request请求判断是否未授权，提示用户登录，取消后续所有请求

let allowOauthRequest = false;

function createNormalizeErrRes(response) {
  if(response instanceof Error) {
    return {code: 1001, message: response.message};
  } else if(response.code) {
    return response;
  } else {
    return NORMALIZE_ERROR_RES;
  }
}

function addOauthRequest(request) {
  if(allowOauthRequest) {
    request.call();
    return;
  } else {
    if(!oauthRequestQueue[0]) {
      request.call().then(()=> {
        oauthRequestQueue.shift();
        oauthRequestQueue.forEach((request) => {
          request.call();
        });
        oauthRequestQueue.splice(0, oauthRequestQueue.length);
        allowOauthRequest = true;
      }).catch((err)=> {
        oauthRequestQueue.shift();
        if(err.code == 401) {
          this.$handleReqErr(err);
          oauthRequestQueue.forEach((request) => {
            request.reject({code: 401, message: 'oauth error', params: request.params});
          });
        } else {
          oauthRequestQueue.forEach((request) => {
            request.call();
          });
        }
        oauthRequestQueue.splice(0, oauthRequestQueue.length);
        allowOauthRequest = true;
      });
      oauthRequestQueue.push(request);
    } else {
      oauthRequestQueue.push(request);
    }
  }
}

export function createSilentParams(params, force) {
  if(params) {
    if(!('__silent__' in params) || force) {
      params.__silent__ = true;
    }
  } else {
    params = {
      __silent__: true
    }
  }
  return params;
}

export function request(url, params, mutation) {
  //this.$store.commit('tryAbortRequest', url);
  let reqUrl = Vue.url.parse(url);
  let method = 'get';
  //todo use cors
  // if(reqUrl.host && reqUrl.host !== window.location.host) {
  //   method = 'jsonp'
  // }

  let loadingTimer = -1;
  if(!params || !params.__silent__) {
    loadingTimer = setTimeout(()=> {
      LoadingBuilder.of(this).show();
    }, SHOW_LOADING_TIMEOUT);
  }
  if(params) {
    delete params.__silent__
  }

  return this.$http[method](url, {params: params || {}}).then((response) => {
    if(response.status == 200 && response.data.code == 200) {
      if(typeof mutation == 'string') {
        this.$store.commit(mutation, response.data.value);
      } else {
        mutation && mutation(response.data.value);
      }
      return Vue.Promise.resolve(response.data.value);
    } else {
      let errCode = 100;
      let errMsg = '';
      if(response.status == 200) {
        errCode = response.data.code;
        errMsg = response.data.message;
      } else {
        errCode = response.status
      }

      if(errCode == 401 || errCode == 198300 || errCode == 198301 || errCode == 198302) {
        errCode = 401; //规范化
        errMsg = "request oauth error";
      }
      return Vue.Promise.reject({code: errCode, message: errMsg});
    }
  }).catch(function(response) {
    return Vue.Promise.reject(createNormalizeErrRes(response));
  }).finally(()=> {
    clearTimeout(loadingTimer);
    LoadingBuilder.of(this).hide();
  });
}

export function oauthRequest(url, params, mutation) {
  return new Vue.Promise((resolve, reject)=> {
    addOauthRequest.call(this, {
      resolve,
      reject,
      call:()=> {
        //this.$store.commit('tryAbortRequest', url);

        let loadingTimer = -1;
        if(!params || !params.__silent__) {
          loadingTimer = setTimeout(()=> {
            LoadingBuilder.of(this).show();
          }, SHOW_LOADING_TIMEOUT);
        }
        if(params) {
          delete params.__silent__
        }
        let pending = Ninterface.oauthRequest(url, params).then((response)=> {
            if(response.status == 200 && response.data.code == 200) { // normal request
              if(typeof mutation == 'string') {
                this.$store.commit(mutation, response.data.value);
              } else {
                mutation && mutation(response.data.value);
              }
              return Vue.Promise.resolve(response.data.value);
            } else if(response.code == 200) { //oauth request
              if(typeof mutation == 'string') {
                this.$store.commit(mutation, response.value);
              } else {
                mutation && mutation(response.value);
              }
              return Vue.Promise.resolve(response.value)
            } else {
              let errCode = 100;
              let errMsg = '';
              if('status' in response) { // normal request
                if(response.status == 200) {
                  errCode = response.data.code;
                  errMsg = response.data.message;
                } else {
                  errCode = response.status
                }
              } else {
                errCode = response.code;
                errMsg = response.message;
              }

              if(errCode == 401 || errCode == 198300 || errCode == 198301 || errCode == 198302) {
                errCode = 401; //规范化
              }
              return Vue.Promise.reject({code: errCode, message: errMsg});
            }
        }).catch((response)=> {
          return Vue.Promise.reject(createNormalizeErrRes(response));
        }).finally(()=> {
          clearTimeout(loadingTimer);
          LoadingBuilder.of(this).hide();
        });
        resolve(pending);
        return pending;
      },
      params
    });
  });
    
}