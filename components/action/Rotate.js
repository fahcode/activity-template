import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class Rotate extends Base {
    static $name = '旋转';
    static $flag = Enum.ACTION_FLAG.ROTATION;
    props = {
        rotation: 0,
    }
    repeat = -1;
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {rotation: target.rotation}, Object.assign({
            rotation: target.rotation + Math.PI * 2,
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    onUpdate(target) {
        target.rotation = this.props.rotation;
    }
}