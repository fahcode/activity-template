import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import Base from './Base';
export default class ExpandY extends Base {
    props = {
        scaleX: 0
    }
    easing = 'Elastic.easeOut';
    createAction(target, opts) {
        let t = new TimelineMax();
        t.add(TweenLite.fromTo(this.props, opts.duration, {scaleX: 0}, Object.assign({
            scaleX: target.scale.x
        }, opts || {})));
        t.repeat(opts.repeat);
        t.yoyo(opts.yoyo);
        return t;
    }

    beforeStart(target) {
        target.x -= target.width / 2;
        target.anchor.set(0, .5);
    }

    onUpdate(target) {
        target.scale.x = this.props.scaleX;
    }

    onComplete(target) {
        target.anchor.set(.5, .5);
        target.x += target.width / 2;
    }
}