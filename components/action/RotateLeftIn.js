import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class RotateLeftIn extends Base {
    static $name = '从左滚入';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.ROTATION;
    props = {
        rotation: 0,
        alpha: 0
    }
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {rotation: target.rotation - Math.PI / 2}, Object.assign({
            rotation: target.rotation,
            alpha: target.alpha
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        target.x -= target.width / 2;
        target.y += target.height / 2;
        target.anchor.set(0, 1);
    }

    onUpdate(target) {
        target.alpha = this.props.alpha;
        target.rotation = this.props.rotation;
    }

    onComplete(target) {
        target.x += target.width / 2;
        target.y -= target.height / 2;
        target.anchor.set(.5, .5);
    }
}