import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import OffsetY from './OffsetY';
export default class FlyTop extends OffsetY {
    static $name = '向上飞入';
    static $flag = Enum.ACTION_FLAG.ALPHA | Enum.ACTION_FLAG.Y;
    offsetY = 200;
}