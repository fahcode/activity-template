import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import OffsetX from './OffsetX';
export default class SlideLeft extends OffsetX {
    static $name = '向左滑入';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.X;
    easing = 'Back.easeOut';
}