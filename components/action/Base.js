import Enum from '../common/enum';
// import { Power0, Power2, Bounce, Back, Elastic } from 'gsap'; //请同步imports.js
// console.log(Power0)
// const EASE_MAP = {
//     'Power0.easeNone': Power0.easeNone,
//     'Power2.easeOut': Power2.easeOut,
//     'Power2.easeIn': Power2.easeIn,
//     'Power2.easeInOut': Power2.easeInOut,
//     'Bounce.easeOut': Bounce.easeOut,
//     'Bounce.easeIn': Bounce.easeIn,
//     'Back.easeOut': Back.easeOut.config(1.7),
//     'Elastic.easeOut.l': Elastic.easeOut.config(1, 0.3),
//     'Elastic.easeOut': Elastic.easeOut.config(1, 0.5)
// }

import 'gsap/EasePack';
const EASE_MAP = {
    'Power0.easeNone': Power0.easeNone,
    'Power2.easeOut': Power2.easeOut,
    'Power2.easeIn': Power2.easeIn,
    'Power2.easeInOut': Power2.easeInOut,
    'Bounce.easeOut': Bounce.easeOut,
    'Bounce.easeIn': Bounce.easeIn,
    'Back.easeOut': Back.easeOut.config(1.7),
    'Elastic.easeOut.l': Elastic.easeOut.config(1, 0.3),
    'Elastic.easeOut': Elastic.easeOut.config(1, 0.5)
}

export default class Base {
    static $name = '动作';
    static $flag = Enum.ACTION_FLAG.DEFAULT;
    params = {};
    props = {};
    target = null;
    duration = 1;
    delay = 0;
    yoyo = false;
    repeat = 0;
    easing = 'Power0.easeNone';
    isStarted = false;

    create(target, opts) {
        let self = this;
        opts = Object.assign({}, opts || {});
        this.target = target;

        opts.duration = this.duration = opts.duration || this.duration;
        opts.delay = this.delay = opts.delay || this.delay;
        opts.yoyo = this.yoyo = opts.yoyo || this.yoyo;
        opts.repeat = this.repeat = opts.repeat || this.repeat;
        opts.ease = EASE_MAP[opts.easing || this.easing] || EASE_MAP['Power0.easeNone'];
        opts.resolution = opts.resolution || 1;
        for(let p in this.params) {
            if(opts[p]) {
                this[p] = opts[p];
                delete opts[p];
            }
        }
        //opts.paused = true;
        opts.immediateRender = false;
        let _onUpdate = opts.onUpdate;
        opts.onUpdate = function() {
            if(!self.isStarted) {
                self.beforeStart(target);
                self.isStarted = true;
            }
            _onUpdate && _onUpdate.call(this);
            self.onUpdate(target);
        }
        let _onStart = opts.onStart;
        opts.onStart = function() {
            _onStart && _onStart.call(this);
            self.onStart(target);
        }

        let _onComplete = opts.onComplete;
        opts.onComplete = function() {
            self.isStarted = false;
            _onComplete && _onComplete.call(this);
            self.onComplete(target);
        }
        return this.createAction(target, opts);
    }

    createAction() {
        throw new Error('Must be implemented!');
    }

    beforeStart() {

    }

    onStart() {

    }

    onUpdate() {
        throw new Error('Must be implemented!');
    }

    onComplete() {

    }
}