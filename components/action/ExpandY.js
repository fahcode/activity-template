import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class ExpandY extends Base {
    props = {
        scaleY: 0
    }
    easing = 'Elastic.easeOut';
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {scaleY: 0}, Object.assign({
            scaleY: target.scale.y
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        target.y -= target.height / 2;
        target.anchor.set(.5, 0);
    }

    onUpdate(target) {
        target.scale.y = this.props.scaleY;
    }

    onComplete(target) {
        target.anchor.set(.5, .5);
        target.y += target.height / 2;
    }
}