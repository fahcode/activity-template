import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class Float extends Base {
    static $name = '浮动';
    static $flag = Enum.ACTION_FLAG.Y;
    props = {
        offsetY: 0
    }
    params = {
        offsetY: {
            type: Number,
            default: 25,
            $rule: {
                name: '浮动幅度'
            }
        }
    }
    offsetY = 25;
    startY = 0;
    repeat = -1;
    yoyo = true;
    duration = 2.5;
    easing = 'Power2.easeInOut';
    createAction(target, opts) {
        let t = new TimelineMax();
        let onComplete = opts.onComplete;
        opts.onComplete = undefined;
        t.add(TweenLite.fromTo(this.props, opts.duration, {offsetY: 0}, Object.assign({
            offsetY: this.offsetY
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        this.startY = target.y;
    }

    onUpdate(target) {
        target.y = this.startY + this.props.offsetY;
    }
}