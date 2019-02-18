import Dialog from './Dialog.vue';
import Builder from './Builder';
import Vue from 'vue';
import ModalManager from './ModalManager';
import util from 'common/util';
class DialogBuilder extends Builder {
	constructor(ctx) {
		super(ctx, Dialog);
	}
	confirm(title, content, onConfirm, onCancel, opts) {
		if(util.isObject(onCancel)) {
			opts = onCancel;
			onCancel = undefined;
		}
		if(util.isObject(onConfirm)) {
			opts = onConfirm;
			onConfirm = undefined;
		}
		if(typeof content == 'function' && !content.cid) {
			onConfirm = content;
			content = '';
		}
		opts = opts || {};
		opts.title = title;
		opts.content = content;
		if(!opts.mode) opts.mode = 'confirm';
		opts.onConfirm = onConfirm;
		opts.onCancel = onCancel;
		return ModalManager.add(()=> this.createComp(opts));
	}
	alert(title, content, onConfirm, opts) {
		opts = opts || {};
		if(util.isObject(onConfirm)) {
			opts = onConfirm;
			onConfirm = content;
			return this.confirm(title, onConfirm, Vue.util.extend(opts, {mode: 'alert'}));
		} else {
			return this.confirm(title, content, onConfirm, Vue.util.extend(opts, {mode: 'alert'}));
		}
	}

	static of(ctx) {
		return new DialogBuilder(ctx);
	}
}
export default DialogBuilder;
