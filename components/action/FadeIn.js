import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';

export default class FadeIn extends Base {
    static $name = '淡入';
    static $flag = Enum.ACTION_FLAG.ALPHA;
    props = { alpha: 0 };
    
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, this.props, Object.assign({
            alpha: 1,
        }, opts || {})))
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    onUpdate(target) {
        target.alpha = this.props.alpha;
    }
}