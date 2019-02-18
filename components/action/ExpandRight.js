import { TweenLite, TimelineMax } from 'gsap';
import Enum from '../common/enum';
import ExpandX from './ExpandX';
export default class ExpandRight extends ExpandX {
    static $name = '向右展开';
    static $flag = Enum.ACTION_FLAG.SCALE_X;
}