import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import ZoomIn from './ZoomIn';
export default class ZoomInBounce extends ZoomIn {
    static $name = '弹性放大';
    static $flag = Enum.ACTION_FLAG.SCALE_X | Enum.ACTION_FLAG.SCALE_Y;
    // props = {
    //     scaleX: 0, 
    //     scaleY: 0
    // }
    easing = 'Back.easeOut';
    // createAction(target, opts) {
    //     let t = new TimelineMax();
    //     t.add(TweenLite.fromTo(this.props, opts.duration, {scaleX: 0, scaleY: 0}, Object.assign({
    //         scaleX: target.scale.x,
    //         scaleY: target.scale.y,
    //     }, opts || {})));
    //     t.repeat(opts.repeat);
    //     t.yoyo(opts.yoyo);
    //     return t;
    // }

    // onUpdate(target) {
    //     target.scale.set(this.props.scaleX, this.props.scaleY);
    // }
}