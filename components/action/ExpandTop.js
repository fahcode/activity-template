import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import ExpandY from './ExpandY';
export default class ExpandTop extends ExpandY {
    static $name = '向上展开';
    static $flag = Enum.ACTION_FLAG.SCALE_Y;

    beforeStart(target) {
        target.y += target.height / 2;
        target.anchor.set(.5, 1);
    }

    onUpdate(target) {
        target.scale.y = this.props.scaleY;
    }

    onComplete(target) {
        target.anchor.set(.5, .5);
        target.y -= target.height / 2;
    }
}