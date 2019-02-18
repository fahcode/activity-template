import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class ZoomOut extends Base {
    static $name = '缩小';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.SCALE_X | Enum.ACTION_FLAG.SCALE_Y;
    props = {
        scaleX: 0, 
        scaleY: 0,
        alpha: 0
    }
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {scaleX: target.scale.x * 1.8, scaleY: target.scale.y * 1.8, alpha: 0}, Object.assign({
            scaleX: target.scale.x,
            scaleY: target.scale.y,
            alpha: target.alpha
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    onUpdate(target) {
        target.alpha = this.props.alpha;
        target.scale.set(this.props.scaleX, this.props.scaleY);
    }
}