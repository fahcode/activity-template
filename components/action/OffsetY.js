import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class OffsetY extends Base {
    props = {
        offsetY: 0,
        alpha: 0
    }
    params = {
        offsetY: {
            type: Number,
            default: -200,
            $rule: {
                name: '偏移'
            }
        }
    }
    startY = 0;
    offsetY = -200;
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {offsetY: this.offsetY, alpha: 0}, Object.assign({
            offsetY: 0,
            alpha: target.alpha
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        this.startY = target.y;
    }

    onUpdate(target) {
        target.alpha = this.props.alpha;
        target.y = this.startY + this.props.offsetY;
    }
}