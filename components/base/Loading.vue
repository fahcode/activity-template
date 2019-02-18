<style lang="less">
	.loading {
		position: fixed;
		top: 50%;
		left: 50%;
		font-size: 0.444444rem;
		font-weight: 500;
		text-align: center;
		color: #fff;
		transform: translate3d(-50%, -50%, 0);
		&__spinner {
			width: 0.666666rem;
			height: 0.666666rem;
			margin-bottom: 0.25rem;
		}
	}
</style>
<template>
	<div class="loading" v-bind:style="{'z-index': zIndex}">
		<img class="loading__spinner" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSI+ICA8cGF0aCBvcGFjaXR5PSIuMSIgZD0iTTE2IDAgQTE2IDE2IDAgMCAwIDE2IDMyIEExNiAxNiAwIDAgMCAxNiAwIE0xNiA0IEExMiAxMiAwIDAgMSAxNiAyOCBBMTIgMTIgMCAwIDEgMTYgNCIgZmlsbD0iIzk5OTk5OSIvPiAgPHBhdGggZD0iTTE2IDAgQTE2IDE2IDAgMCAxIDMyIDE2IEwyOCAxNiBBMTIgMTIgMCAwIDAgMTYgNHoiIGZpbGw9IiNmYzViMjMiPiAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAxNiAxNiIgdG89IjM2MCAxNiAxNiIgZHVyPSIwLjhzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4gIDwvcGF0aD48L3N2Zz4=">
		<p>请稍后..</p>
	</div>
</template>
<script>
	import OverlayManager from './OverlayManager';
	import util from 'common/util';
	export default {
		name: 'Loading',
		data() {
			return {
				zIndex: util.genZIndex()
			}
		},
		beforeMount: function() {
			OverlayManager.requestOverlay(this, {
				zIndex: this.zIndex - 1,
				backgroundColor: 'rgb(0, 0, 0)',
				opacity: 0.4
			});
		},
		beforeDestroy: function() {
			OverlayManager.closeOverlay(this);
		},
		destroyed() {
			this.$el.remove();
		}
	}
</script>