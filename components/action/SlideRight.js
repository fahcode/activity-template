import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import OffsetX from './OffsetX';
export default class SlideRight extends OffsetX {
    static $name = '向右滑入';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.X;
    easing = 'Back.easeOut';
    offsetX = -200;
}