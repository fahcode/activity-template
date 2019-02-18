import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import ExpandX from './ExpandX';
export default class ExpandLeft extends ExpandX {
    static $name = '向左展开';
    static $flag = Enum.ACTION_FLAG.SCALE_X;

    beforeStart(target) {
        target.x += target.width / 2;
        target.anchor.set(1, .5);
    }

    onUpdate(target) {
        target.scale.x = this.props.scaleX;
    }

    onComplete(target) {
        target.anchor.set(.5, .5);
        target.x -= target.width / 2;
    }
}