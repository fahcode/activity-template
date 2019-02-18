import HistoryTracker from './HistoryTracker';
import OverlayManager from './OverlayManager';
import util from 'common/util';
export default {
    props: {
        onDismiss: {
            type: Function
        }
    },
    data() {
        return {
            open: true,
            zIndex: util.genZIndex()
        }
    },
    beforeMount: function() {
        let createTime = Date.now();
        OverlayManager.requestOverlay(this, {
            zIndex: this.zIndex - 1,
            backgroundColor: 'rgb(0, 0, 0)',
            opacity: 0.4,
            onOverlayClick: ()=> {
                if(Date.now() - createTime > 500) {
                    this.dismiss() 
                }
            }
        });
    },
    mounted: function() {
        HistoryTracker.trace(this, 'dismiss');
    },
    beforeDestroy: function() {
        OverlayManager.closeOverlay(this);
    },
    destroyed: function() {
        this.$el.remove();
    },
    methods: {
        dismiss() {
            this.open = false;
            this.onDismiss && this.onDismiss();
        }
    }
}