import { TweenLite, TimelineMax } from 'gsap'; //请同步imports.js
import Enum from '../common/enum';
import OffsetY from './OffsetY';
export default class Drop extends OffsetY {
    static $name = '跌落';
    static $flag = Enum.ACTION_FLAG.Y;
    params = {
        offsetY: {
            type: Number,
            default: -200,
            $rule: {
                name: '高度'
            }
        }
    }
    easing = 'Bounce.easeOut';

    onUpdate(target) {
        target.y = this.startY + this.props.offsetY;
    }
}