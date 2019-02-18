import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class RotateIn extends Base {
    static $name = '旋转出现';
    static $flag = Enum.ACTION_FLAG.ROTATION | Enum.ACTION_FLAG.ALPHA;
    props = {
        rotation: 0,
        alpha: 0
    }
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {rotation: target.rotation - Math.PI / 2, alpha: 0}, Object.assign({
            rotation: target.rotation,
            alpha: target.alpha
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    onUpdate(target) {
        target.rotation = this.props.rotation;
        target.alpha = this.props.alpha;
    }
}