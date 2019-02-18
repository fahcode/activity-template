import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import ExpandY from './ExpandY';
export default class ExpandBottom extends ExpandY {
    static $name = '向下展开';
    static $flag = Enum.ACTION_FLAG.SCALE_Y;
}