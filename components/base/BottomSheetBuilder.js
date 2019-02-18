import BottomSheet from './BottomSheet.vue'
import Builder from 'base/Builder'
import Vue from 'vue';
import ModalManager from './ModalManager';
import util from 'common/util';
class BottomSheetBuilder extends Builder {
	constructor(ctx) {
	    super(ctx, BottomSheet)
	}
	
	show(title, content, opts) {
	  	opts = opts || {};
	  	opts.title = title;
	  	opts.content = content;
	  	// if(!opts.mode) opts.mode = 'show';
		//ModalManager.add(()=> this.createComp(opts));
		return this.createComp(opts);
	}

	static of(ctx) {
	    return new BottomSheetBuilder(ctx)
	}
}
export default BottomSheetBuilder 