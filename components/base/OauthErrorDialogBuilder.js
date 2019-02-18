import Builder from './Builder';
import Dialog from './Dialog.vue';
import Vue from 'vue';
import ModalManager from './ModalManager';
import N from 'common/nativeinterface';

let singleInstance = null;

class OauthErrorDialogBuilder extends Builder {
    constructor(ctx) {
		super(ctx, Dialog);
	}
    alert() {
        if(!singleInstance) {
            let opts = {
                title: '未登录或登录已过期，请重新登录',
                content: '',
                confirmBtnTxt: '登录',
                onConfirm: function() {
                    this.$delay(300).then(()=> {
                        N.login();
                    });
                    this.dismiss();
                },
                onDismiss() {
                    singleInstance = null;
                }
            };
            singleInstance = new Object(); //占位
            ModalManager.add(()=> {
                return singleInstance = this.createComp(opts)
            });
        }
    }

    static of(ctx) {
        return new OauthErrorDialogBuilder;
    }
}

export default OauthErrorDialogBuilder