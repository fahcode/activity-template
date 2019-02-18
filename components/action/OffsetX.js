import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class OffsetX extends Base {
    props = {
        offsetX: 0,
        alpha: 0
    };
    params = {
        offsetX: {
            type: Number,
            default: 200,
            $rule: {
                name: '偏移'
            }
        }
    };
    offsetX = 200;
    startX = 0;
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {offsetX: this.offsetX, alpha: 0}, Object.assign({
            offsetX: 0,
            alpha: target.alpha
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        this.startX = target.x;
    }

    onUpdate(target) {
        target.alpha = this.props.alpha;
        target.x = this.startX + this.props.offsetX;
    }
}