import N from './nativeinterface';
import Vue from 'vue';
import util2 from './util2';
let GLOBAL_LOGGER_DIV = null;
let ots = Object.prototype.toString;
function logger(content, type) {
    let log = document.createElement('div');
    let style = '';
    switch(type) {
        case 'info':
            style = 'color: #008080';
            break;
        case 'error':
            style = 'color: #d14';
            break;
        default:
            break;
    }
    style += 'word-break:break-all;padding: 0 8px; border-bottom: 1px solid rgba(255, 255, 255, .3)';
    log.setAttribute('style', style);
    let contentType = ots.call(content);
    if(contentType == '[object Object]' || contentType == '[object Array]') {
        log.innerText = JSON.stringify(content);
    } else {
        log.innerText = content;
    }
    GLOBAL_LOGGER_DIV.appendChild(log);
    Vue.nextTick(()=> {
        GLOBAL_LOGGER_DIV.scrollTop = GLOBAL_LOGGER_DIV.scrollHeight;
    });
}
export default {
    makeActivityLog(action, p) {
        if(process.env.IS_SSR) {
            return;
        }
        let MeizuBH = require('@flyme/tongji');
        try {
            let params = Vue.util.extend({
                action: action,
                imei: N.getIMEI(),
                activity_id: window.__ACTIVITY_ID__,
                uid: N.getUserId() || ''
            }, p || {});
            MeizuBH(params, 1);
        } catch(err) {
        }
    },
    createLoggerOverlay() {
        if(util2.isInBrowser()) {
            GLOBAL_LOGGER_DIV = document.querySelector('#__global_logger_div__');
            if(!GLOBAL_LOGGER_DIV) {
                GLOBAL_LOGGER_DIV = document.createElement('div');
                GLOBAL_LOGGER_DIV.id = '__global_logger_div__';
                GLOBAL_LOGGER_DIV.style = 
                    'position: fixed; z-index:9999; width: 100%; left: 0; top: 0; background:rgba(0, 0, 0,.6);'
                    + 'transform:translate3d(0,0,0); color: #fff;font-size:16px; line-height: 1.6; min-height: 200px;'
                    + 'max-height: 50%; pointer-events:none;overflow-y: auto;';
                document.body.insertBefore(GLOBAL_LOGGER_DIV, document.body.children[0]);
            }
            console.log = function log(content) {
                logger(content);
            };
            console.info = function info(content) {
                logger(content, 'info');
            };
            console.error = function error(content) {
                logger(content, 'error');
            }
        }
    }
}