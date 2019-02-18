import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import OffsetX from './OffsetX';
export default class FlyLeft extends OffsetX {
    static $name = '向左飞入';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.X;
}